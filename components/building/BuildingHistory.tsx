"use client";

// Historial del edificio (destino del QR). Lee inspecciones LOCALES de este
// edificio con useLiveQuery (offline-first) y, si hay Supabase + red, completa
// con las inspecciones PÚBLICAS del mismo building_id para que cualquiera que
// escanee el QR vea el historial aunque no lo tenga local. Nunca bloquea la UI
// por red: los errores de red se tragan en silencio (queda solo lo local).

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";

import { inspectionsForBuilding } from "@/lib/db";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { useSyncStore } from "@/lib/store";
import { cn } from "@/lib/cn";
import { CONSTRUCTION_TYPE_OPTIONS, OCCUPANCY_OPTIONS } from "@/lib/catalog";
import type { Building, EvaluationLevel, Placard } from "@/lib/types";
import { Button, Card, PlacardBadge, Spinner } from "@/components/ui";

// --- Tipos locales ---------------------------------------------------------

type BuildingLite = Partial<
  Pick<Building, "name" | "address" | "constructionType" | "occupancyType" | "yearBuilt">
>;

/** Fila normalizada de la línea de tiempo (local o remota). */
interface TimelineItem {
  key: string; // clave de dedup (client_uuid)
  clientUuid?: string; // presente => existe local => navegable al detalle
  placard: Placard;
  inspectedAt: string;
  evaluationLevel: EvaluationLevel;
  local: boolean;
  building?: BuildingLite;
}

/** Forma cruda de la consulta a Supabase (snake_case). */
interface RemoteRow {
  id: string;
  client_uuid: string | null;
  placard_final: Placard | null;
  inspected_at: string;
  evaluation_level: EvaluationLevel;
  building_name: string | null;
  address: string | null;
  construction_type: string | null;
  occupancy_type: string | null;
  year_built: number | null;
}

// --- Helpers de presentación ----------------------------------------------

function fmtDateTime(iso?: string): string {
  if (!iso) return "Fecha desconocida";
  try {
    return new Intl.DateTimeFormat("es-VE", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function levelLabel(level: EvaluationLevel): string {
  return level === "detallada" ? "Evaluación detallada" : "Evaluación rápida";
}

function constructionLabel(ct?: string | null): string | undefined {
  if (!ct) return undefined;
  return CONSTRUCTION_TYPE_OPTIONS.find((o) => o.value === ct)?.label ?? ct;
}

function occupancyLabel(oc?: string | null): string | undefined {
  if (!oc) return undefined;
  return OCCUPANCY_OPTIONS.find((o) => o.value === oc)?.label ?? oc;
}

// --- Componente ------------------------------------------------------------

export function BuildingHistory({ id }: { id: string }) {
  const router = useRouter();
  const online = useSyncStore((s) => s.online);

  // Fuente de verdad LOCAL (reactiva, offline-first).
  const local = useLiveQuery(() => inspectionsForBuilding(id), [id]);

  // Complemento REMOTO (solo si hay Supabase + red). Errores -> silencio.
  // `remote` undefined = aún no respondió la red; [] o filas = ya respondió.
  const wantRemote = isSupabaseConfigured && online;
  const [remote, setRemote] = useState<RemoteRow[] | undefined>(undefined);
  // Derivado (sin setState síncrono en efecto): ya intentamos la red, o no aplica.
  const remoteSettled = !wantRemote || remote !== undefined;

  useEffect(() => {
    if (!wantRemote) return;
    const sb = getSupabase();
    if (!sb) return;

    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await sb
          .from("inspections_public")
          .select(
            "id, client_uuid, placard_final, inspected_at, evaluation_level, building_name, address, construction_type, occupancy_type, year_built",
          )
          .eq("building_id", id)
          .order("inspected_at", { ascending: false });
        // setState dentro de callback async (permitido); silencio ante error/offline.
        if (!cancelled) setRemote(!error && data ? (data as unknown as RemoteRow[]) : []);
      } catch {
        if (!cancelled) setRemote([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id, wantRemote]);

  // Combinar local + remoto, dedup por client_uuid (lo LOCAL tiene prioridad
  // porque es navegable al detalle).
  const items = useMemo<TimelineItem[]>(() => {
    const map = new Map<string, TimelineItem>();

    for (const insp of local ?? []) {
      map.set(insp.clientUuid, {
        key: insp.clientUuid,
        clientUuid: insp.clientUuid,
        placard: insp.placardFinal,
        inspectedAt: insp.inspectedAt,
        evaluationLevel: insp.evaluationLevel,
        local: true,
        building: insp.building,
      });
    }

    for (const r of remote ?? []) {
      const k = r.client_uuid ?? r.id;
      if (map.has(k)) continue; // ya está local
      map.set(k, {
        key: k,
        placard: (r.placard_final ?? "none") as Placard,
        inspectedAt: r.inspected_at,
        evaluationLevel: r.evaluation_level,
        local: false,
        building: {
          name: r.building_name ?? undefined,
          address: r.address ?? undefined,
          constructionType: (r.construction_type as Building["constructionType"]) ?? undefined,
          occupancyType: (r.occupancy_type as Building["occupancyType"]) ?? undefined,
          yearBuilt: r.year_built ?? undefined,
        },
      });
    }

    return Array.from(map.values()).sort((a, b) =>
      (b.inspectedAt || "").localeCompare(a.inspectedAt || ""),
    );
  }, [local, remote]);

  // Cabecera: datos del edificio de la inspección más reciente que los tenga.
  const headerBuilding = useMemo<BuildingLite | undefined>(
    () => items.find((i) => i.building && (i.building.name || i.building.address))?.building ??
      items.find((i) => i.building)?.building,
    [items],
  );

  const current = items[0];
  const previous = items.slice(1);

  // --- Estados de carga / vacío --------------------------------------------

  const localLoading = local === undefined;
  // Aún podría estar llegando lo remoto: hay Supabase + red y todavía no respondió.
  const waitingRemote = isSupabaseConfigured && online && !remoteSettled;

  if (localLoading) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
        <Spinner />
        <p>Cargando historial…</p>
      </div>
    );
  }

  if (items.length === 0) {
    // Aún puede estar llegando lo remoto: muestra carga en vez de "vacío".
    if (waitingRemote) {
      return (
        <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
          <Spinner />
          <p>Buscando historial en línea…</p>
        </div>
      );
    }
    return (
      <Card className="border-amber-300 bg-amber-50">
        <p className="font-semibold text-ink">Sin registros locales de este edificio</p>
        <p className="mt-1 text-sm text-slate-600">
          No hay inspecciones guardadas en este dispositivo para este edificio
          {isSupabaseConfigured ? (online ? " ni en línea." : ". Conéctate a internet para intentar traerlas del servidor.") : "."}
        </p>
        <div className="mt-4">
          <Button fullWidth onClick={() => router.push("/inspeccion/nueva")}>
            Iniciar primera inspección
          </Button>
        </div>
      </Card>
    );
  }

  // --- Render ---------------------------------------------------------------

  return (
    <div className="space-y-5">
      {/* Cabecera del edificio */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Edificio
        </p>
        <h2 className="mt-0.5 text-xl font-extrabold text-ink">
          {headerBuilding?.name || "Edificio sin nombre"}
        </h2>
        {headerBuilding?.address && (
          <p className="mt-1 text-slate-600">{headerBuilding.address}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          {constructionLabel(headerBuilding?.constructionType) && (
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
              {constructionLabel(headerBuilding?.constructionType)}
            </span>
          )}
          {occupancyLabel(headerBuilding?.occupancyType) && (
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
              {occupancyLabel(headerBuilding?.occupancyType)}
            </span>
          )}
          {headerBuilding?.yearBuilt && (
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
              Año {headerBuilding.yearBuilt}
            </span>
          )}
        </div>
        <p className="mt-3 text-sm text-slate-500">
          {items.length} {items.length === 1 ? "inspección registrada" : "inspecciones registradas"}
          {" · "}el historial nunca se sobrescribe
        </p>
      </Card>

      {/* Estado actual (más reciente, resaltado) */}
      {current && (
        <TimelineEntry item={current} highlighted />
      )}

      {/* Historial anterior */}
      {previous.length > 0 && (
        <div>
          <h3 className="mb-2 px-1 text-sm font-bold uppercase tracking-wide text-slate-500">
            Historial anterior
          </h3>
          <div className="space-y-3">
            {previous.map((item) => (
              <TimelineEntry key={item.key} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Nueva re-inspección */}
      <div className="pt-1">
        <Button fullWidth size="lg" onClick={() => router.push(`/inspeccion/nueva?building=${id}`)}>
          Nueva re-inspección
        </Button>
        <p className="mt-2 px-1 text-center text-xs text-slate-500">
          Crea un registro NUEVO (por ejemplo, tras réplicas). No modifica ni
          borra las inspecciones anteriores.
        </p>
      </div>
    </div>
  );
}

// --- Entrada de la línea de tiempo ----------------------------------------

function TimelineEntry({
  item,
  highlighted = false,
}: {
  item: TimelineItem;
  highlighted?: boolean;
}) {
  const body = (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl border bg-white p-4 shadow-sm transition-colors",
        highlighted ? "border-brand ring-2 ring-brand/30" : "border-slate-200",
        item.clientUuid && "active:bg-slate-50",
      )}
    >
      <PlacardBadge placard={item.placard} size={highlighted ? "md" : "sm"} showSub={highlighted} />
      <div className="min-w-0 flex-1">
        {highlighted && (
          <p className="text-xs font-bold uppercase tracking-wide text-brand">
            Estado actual
          </p>
        )}
        <p className="truncate font-semibold text-ink">{fmtDateTime(item.inspectedAt)}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-slate-500">
          <span>{levelLabel(item.evaluationLevel)}</span>
          <span aria-hidden>·</span>
          <span>{item.local ? "Guardada en este equipo" : "En línea"}</span>
        </p>
      </div>
      {item.clientUuid ? (
        <span aria-hidden className="text-2xl text-slate-300">
          ›
        </span>
      ) : (
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
          solo lectura
        </span>
      )}
    </div>
  );

  // Las inspecciones LOCALES llevan al detalle; las remotas (no descargadas) no.
  if (item.clientUuid) {
    return (
      <Link
        href={`/inspeccion/${item.clientUuid}`}
        aria-label={`Ver inspección del ${fmtDateTime(item.inspectedAt)}`}
        className="block"
      >
        {body}
      </Link>
    );
  }
  return body;
}
