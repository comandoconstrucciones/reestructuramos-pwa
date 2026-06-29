"use client";

// MIS INSPECCIONES — lista local (borradores + completas), estado de sync y acciones.
// Offline-first: lee de Dexie con useLiveQuery; nunca bloquea por red.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { AppShell } from "@/components/AppShell";
import { Button, Card, CardTitle, Icon, PlacardDot, Spinner } from "@/components/ui";
import { deleteInspection, listInspections } from "@/lib/db";
import { PLACARD_META } from "@/lib/placard";
import { useSyncStore } from "@/lib/store";
import { triggerSync } from "@/lib/sync";
import { cn } from "@/lib/cn";
import type { Inspection, Placard, SyncStatus } from "@/lib/types";

// --- Filtros por cartel ----------------------------------------------------

type FilterKey = "todos" | "verde" | "amarillo" | "rojo" | "draft";

const FILTERS: { key: FilterKey; label: string; placard?: Placard }[] = [
  { key: "todos", label: "Todos" },
  { key: "verde", label: "Verde", placard: "verde" },
  { key: "amarillo", label: "Amarillo", placard: "amarillo" },
  { key: "rojo", label: "Rojo", placard: "rojo" },
  { key: "draft", label: "Borradores" },
];

// --- Helpers de presentación ----------------------------------------------

const dateFmt = new Intl.DateTimeFormat("es-VE", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(iso?: string): string {
  if (!iso) return "Sin fecha";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Sin fecha";
  return dateFmt.format(d);
}

/** Etiqueta de ubicación: nombre → dirección → coordenadas → fallback. */
function placeLabel(insp: Inspection): string {
  const b = insp.building;
  if (b?.name?.trim()) return b.name.trim();
  if (b?.address?.trim()) return b.address.trim();
  const lat = insp.lat ?? b?.lat;
  const lng = insp.lng ?? b?.lng;
  if (lat != null && lng != null) return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  return "Ubicación sin registrar";
}

/** Destino al tocar el item. Borrador → asistente reanudando ESE borrador concreto. */
function targetHref(insp: Inspection): string {
  return insp.status === "draft"
    ? `/inspeccion/nueva?draft=${insp.clientUuid}`
    : `/inspeccion/${insp.clientUuid}`;
}

const SYNC_BADGE: Record<SyncStatus, { label: string; className: string }> = {
  pending: { label: "Por subir", className: "bg-amber-100 text-amarillo-ink" },
  synced: { label: "Sincronizada", className: "bg-emerald-100 text-verde-ink" },
  error: { label: "Error", className: "bg-red-100 text-rojo-ink" },
};

function SyncBadge({ status }: { status: SyncStatus }) {
  const b = SYNC_BADGE[status];
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap", b.className)}>
      {b.label}
    </span>
  );
}

// --- Item de la lista ------------------------------------------------------

function InspectionItem({
  insp,
  onDelete,
}: {
  insp: Inspection;
  onDelete: (insp: Inspection) => void;
}) {
  const isDraft = insp.status === "draft";
  const placard: Placard = isDraft ? "none" : insp.placardFinal;
  const heading = isDraft ? "Borrador" : PLACARD_META[insp.placardFinal].label;

  return (
    <Card className="overflow-hidden p-0">
      <Link
        href={targetHref(insp)}
        className="flex items-start gap-3 p-4 active:bg-slate-50"
      >
        <span className="pt-1">
          <PlacardDot placard={placard} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-ink">{heading}</span>
            {!isDraft && <SyncBadge status={insp.syncStatus} />}
            {isDraft && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                En curso
              </span>
            )}
          </div>
          <p className="mt-0.5 truncate text-slate-700">{placeLabel(insp)}</p>
          <p className="text-sm text-slate-500">{formatDate(insp.inspectedAt)}</p>
          {insp.syncStatus === "error" && insp.lastSyncError && (
            <p className="mt-1 truncate text-xs text-rojo" title={insp.lastSyncError}>
              {insp.lastSyncError}
            </p>
          )}
        </div>
        <span aria-hidden className="self-center text-2xl text-slate-300">
          ›
        </span>
      </Link>

      <div className="flex items-stretch border-t border-slate-100">
        {isDraft ? (
          <Link
            href={`/inspeccion/nueva?draft=${insp.clientUuid}`}
            className="touch-target flex flex-1 items-center justify-center gap-1 py-2 font-semibold text-brand active:bg-slate-100"
          >
            ▸ Continuar
          </Link>
        ) : (
          <Link
            href={`/inspeccion/${insp.clientUuid}`}
            className="touch-target flex flex-1 items-center justify-center gap-1 py-2 font-semibold text-brand active:bg-slate-100"
          >
            Ver resultado
          </Link>
        )}
        <button
          type="button"
          onClick={() => onDelete(insp)}
          aria-label="Eliminar inspección"
          className="touch-target flex items-center justify-center gap-1 border-l border-slate-100 px-4 py-2 font-semibold text-rojo active:bg-red-50"
        >
          Eliminar
        </button>
      </div>
    </Card>
  );
}

// --- Diálogo de confirmación de borrado ------------------------------------

function DeleteDialog({
  insp,
  onCancel,
  onConfirm,
}: {
  insp: Inspection;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  // "Confirmación fuerte" para completas YA sincronizadas (historial subido).
  const strong = insp.status === "complete" && insp.syncStatus === "synced";
  const unsyncedComplete = insp.status === "complete" && insp.syncStatus !== "synced";
  const [ack, setAck] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirmar eliminación"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      onClick={onCancel}
    >
      <Card className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <CardTitle>
          {insp.status === "draft"
            ? "Eliminar borrador"
            : strong
              ? "Eliminar inspección sincronizada"
              : "Eliminar inspección"}
        </CardTitle>

        <p className="mt-2 text-slate-700">
          {insp.status === "draft" && "Se descartará este borrador y sus fotos. Esta acción no se puede deshacer."}
          {unsyncedComplete &&
            "Esta inspección aún no se ha subido al servidor. Si la eliminas, se perderán sus datos y fotos de forma permanente."}
          {strong &&
            "Esta inspección ya fue sincronizada. Al borrarla solo eliminas la copia local; el registro permanece en el servidor. Confirma que entiendes."}
        </p>

        {strong && (
          <label className="mt-3 flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={ack}
              onChange={(e) => setAck(e.target.checked)}
              className="mt-0.5 h-5 w-5 accent-rojo"
            />
            <span>Entiendo que se eliminará la copia local de esta inspección.</span>
          </label>
        )}

        <div className="mt-4 flex gap-2">
          <Button variant="secondary" size="md" fullWidth onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="md"
            fullWidth
            disabled={strong && !ack}
            onClick={onConfirm}
          >
            Eliminar
          </Button>
        </div>
      </Card>
    </div>
  );
}

// --- Pantalla --------------------------------------------------------------

export default function InspeccionesPage() {
  const inspections = useLiveQuery(() => listInspections(), []);
  const online = useSyncStore((s) => s.online);
  const syncing = useSyncStore((s) => s.syncing);

  const [filter, setFilter] = useState<FilterKey>("todos");
  const [toDelete, setToDelete] = useState<Inspection | null>(null);

  const all = inspections ?? [];
  const total = all.length;
  const pendingCount = useMemo(
    () =>
      all.filter(
        (i) => i.status === "complete" && (i.syncStatus === "pending" || i.syncStatus === "error"),
      ).length,
    [all],
  );

  const filtered = useMemo(() => {
    switch (filter) {
      case "draft":
        return all.filter((i) => i.status === "draft");
      case "verde":
      case "amarillo":
      case "rojo":
        return all.filter((i) => i.status === "complete" && i.placardFinal === filter);
      default:
        return all;
    }
  }, [all, filter]);

  async function handleConfirmDelete() {
    if (!toDelete) return;
    const uuid = toDelete.clientUuid;
    setToDelete(null);
    await deleteInspection(uuid);
  }

  const loading = inspections === undefined;

  return (
    <AppShell
      title="Mis inspecciones"
      right={
        <Link
          href="/cuenta"
          aria-label="Cuenta"
          className="touch-target flex items-center justify-center text-white"
        >
          <Icon name="user" size={22} />
        </Link>
      }
    >
      {/* Encabezado: conteos + sincronizar */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-ink">
            {total} {total === 1 ? "inspección" : "inspecciones"}
          </p>
          <p className="text-sm text-slate-500">
            {pendingCount > 0 ? (
              <span className="font-semibold text-amarillo">{pendingCount} por subir</span>
            ) : (
              "Todo al día"
            )}
            {!online && <span className="ml-1 text-slate-400">· Sin conexión</span>}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          disabled={!online || syncing}
          onClick={() => triggerSync()}
          className="shrink-0"
        >
          {syncing ? (
            <>
              <Spinner /> Sincronizando…
            </>
          ) : (
            "Sincronizar ahora"
          )}
        </Button>
      </div>

      {/* Filtros (chips) */}
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={active}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold",
                active
                  ? "border-brand bg-brand text-white"
                  : "border-slate-300 bg-white text-slate-600 active:bg-slate-100",
              )}
            >
              {f.placard && <PlacardDot placard={f.placard} />}
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex justify-center py-16 text-slate-400">
          <Spinner className="h-7 w-7" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState filtered={total > 0} />
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((insp) => (
            <li key={insp.clientUuid}>
              <InspectionItem insp={insp} onDelete={setToDelete} />
            </li>
          ))}
        </ul>
      )}

      {toDelete && (
        <DeleteDialog
          insp={toDelete}
          onCancel={() => setToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </AppShell>
  );
}

// --- Estado vacío ----------------------------------------------------------

function EmptyState({ filtered }: { filtered: boolean }) {
  // filtered=true → hay inspecciones pero ninguna en el filtro actual.
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <span className="text-slate-300" aria-hidden>
        <Icon name="clipboard" size={44} strokeWidth={1.5} />
      </span>
      {filtered ? (
        <p className="text-slate-600">No hay inspecciones en este filtro.</p>
      ) : (
        <>
          <div>
            <p className="text-lg font-bold text-ink">Aún no tienes inspecciones</p>
            <p className="mt-1 text-slate-600">
              Crea tu primera evaluación rápida. Todo se guarda en tu equipo, incluso sin señal.
            </p>
          </div>
          <Link href="/inspeccion/nueva">
            <Button variant="primary" size="lg">
              <Icon name="plus" size={20} /> Nueva inspección
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
