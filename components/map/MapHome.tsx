"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import type { Map as LeafletMapHandle } from "leaflet";

import { getFlag, listInspections, listRemoteInspections } from "@/lib/db";
import { triggerSync } from "@/lib/sync";
import { useSyncStore } from "@/lib/store";
import { PLACARD_META } from "@/lib/placard";
import type { Placard } from "@/lib/types";
import { Button, Icon, PlacardDot, Spinner } from "@/components/ui";
// Tipo solamente (se elimina en compilación): NO arrastra Leaflet al SSR.
import type { MapMarker } from "@/components/map/LeafletMap";

// Centro inicial: Caracas. Definido localmente para NO importar valores en
// tiempo de ejecución desde LeafletMap (que carga Leaflet y rompería el SSR).
const CARACAS_CENTER: [number, number] = [10.4806, -66.9036];

// Leaflet usa window/document -> SIEMPRE dinámico con ssr:false.
const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500">
      <span className="inline-flex items-center gap-2">
        <Spinner /> Cargando mapa…
      </span>
    </div>
  ),
});

const LEGEND: { placard: Placard; label: string }[] = [
  { placard: "verde", label: "Habitable" },
  { placard: "amarillo", label: "Uso restringido" },
  { placard: "rojo", label: "Inseguro" },
];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(iso?: string | null): string {
  if (!iso) return "Sin fecha";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Sin fecha";
  const day = d.toLocaleDateString("es-VE", { day: "2-digit", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString("es-VE", { hour: "2-digit", minute: "2-digit" });
  return `${day} · ${time}`;
}

function popupHtml(opts: {
  name?: string | null;
  address?: string | null;
  dateIso?: string | null;
  placard: Placard;
  remote: boolean;
}): string {
  const { name, address, dateIso, placard, remote } = opts;
  const meta = PLACARD_META[placard];
  const title = escapeHtml(name?.trim() || address?.trim() || "Edificio sin nombre");
  const sub = name?.trim() && address?.trim() ? escapeHtml(address.trim()) : "";
  const date = escapeHtml(formatDate(dateIso));
  const foot = remote
    ? '<div style="margin-top:6px;color:#64748b;font-size:11px">Reporte de la red (solo lectura)</div>'
    : '<div style="margin-top:6px;color:#0369a1;font-size:11px">Toca el pin para ver el historial</div>';
  return [
    '<div style="min-width:160px;line-height:1.35">',
    `<strong style="font-size:14px;color:#0f172a">${title}</strong>`,
    sub ? `<div style="color:#475569;font-size:12px">${sub}</div>` : "",
    `<div style="margin-top:4px;color:#334155;font-size:12px">${date}</div>`,
    `<div style="margin-top:6px;display:inline-block;padding:2px 8px;border-radius:8px;background:${meta.color};color:${meta.textOn};font-weight:700;font-size:11px">${escapeHtml(meta.label)}</div>`,
    foot,
    "</div>",
  ].join("");
}

export function MapHome() {
  const router = useRouter();
  const online = useSyncStore((s) => s.online);

  const mapRef = useRef<LeafletMapHandle | null>(null);
  const didFitRef = useRef(false);

  const [precaching, setPrecaching] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [capped, setCapped] = useState(false);

  // Lectura reactiva offline (Dexie). undefined mientras carga.
  const localInspections = useLiveQuery(() => listInspections(), []);
  const remoteInspections = useLiveQuery(() => listRemoteInspections(), []);
  const onboarded = useLiveQuery(() => getFlag("onboarded"), []);

  // Al montar: refrescar datos del mapa + cola de sync (seguro offline).
  useEffect(() => {
    triggerSync();
  }, []);

  const markers = useMemo<MapMarker[]>(() => {
    const out: MapMarker[] = [];
    const localUuids = new Set<string>();

    for (const insp of localInspections ?? []) {
      if (insp.status !== "complete") continue;
      const lat = insp.lat ?? insp.building.lat;
      const lng = insp.lng ?? insp.building.lng;
      if (lat == null || lng == null) continue;
      localUuids.add(insp.clientUuid);
      out.push({
        id: `local-${insp.clientUuid}`,
        lat,
        lng,
        placard: insp.placardFinal,
        label: popupHtml({
          name: insp.building.name,
          address: insp.building.address,
          dateIso: insp.inspectedAt,
          placard: insp.placardFinal,
          remote: false,
        }),
        onClick: () => router.push(`/edificio/${insp.buildingId}`),
      });
    }

    for (const r of remoteInspections ?? []) {
      if (r.lat == null || r.lng == null) continue;
      // Evita duplicar una inspección local ya sincronizada (mismo uuid).
      if (localUuids.has(r.id)) continue;
      out.push({
        id: `remote-${r.id}`,
        lat: r.lat,
        lng: r.lng,
        placard: r.placardFinal,
        // Sin onClick: las remotas solo muestran info en el popup.
        label: popupHtml({
          name: r.buildingName,
          address: r.address,
          dateIso: r.inspectedAt,
          placard: r.placardFinal,
          remote: true,
        }),
      });
    }

    return out;
  }, [localInspections, remoteInspections, router]);

  // Encadra los pines la primera vez que aparecen (Caracas puede no contenerlos).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || didFitRef.current || markers.length === 0) return;
    didFitRef.current = true;
    if (markers.length === 1) {
      map.setView([markers[0].lat, markers[0].lng], 16);
    } else {
      map.fitBounds(
        markers.map((m) => [m.lat, m.lng] as [number, number]),
        { padding: [48, 48], maxZoom: 16 },
      );
    }
  }, [markers]);

  const dataLoaded = localInspections !== undefined && remoteInspections !== undefined;
  const isEmpty = dataLoaded && markers.length === 0;
  const showOnboarding = onboarded !== true;

  async function handlePrecache() {
    const map = mapRef.current;
    if (!map || !online || precaching) return;
    setPrecaching(true);
    setCapped(false);
    setProgress({ done: 0, total: 0 });
    try {
      const { precacheBounds } = await import("@/components/map/offlineTiles");
      const z = map.getZoom();
      const res = await precacheBounds(map.getBounds(), [z, z + 1, z + 2], (done, total) =>
        setProgress({ done, total }),
      );
      setProgress({ done: res.fetched, total: res.total });
      setCapped(res.capped);
    } catch {
      setProgress(null);
    } finally {
      setPrecaching(false);
    }
  }

  return (
    <div className="relative h-full w-full">
      <LeafletMap
        markers={markers}
        center={CARACAS_CENTER}
        zoom={12}
        className="absolute inset-0 h-full w-full"
        onReady={(map) => {
          mapRef.current = map;
        }}
      />

      {/* Capa de superposiciones: deja pasar los gestos al mapa salvo en controles. */}
      <div className="pointer-events-none absolute inset-0 z-[1000]">
        {/* Banner de inducción (no bloquea el mapa) */}
        {showOnboarding && (
          <Link
            href="/onboarding"
            className="pointer-events-auto absolute inset-x-0 top-0 flex items-center justify-between gap-3 bg-brand px-4 py-3 text-white shadow-md"
          >
            <span className="flex items-center gap-2 font-semibold">
              <Icon name="graduation" size={20} />
              Aprende a inspeccionar (2 min)
            </span>
            <Icon name="chevronRight" size={20} />
          </Link>
        )}

        {/* Preparar área offline (esquina superior derecha) */}
        <div
          className="pointer-events-auto absolute right-3 flex max-w-[60%] flex-col items-end gap-1"
          style={{ top: showOnboarding ? 64 : 12 }}
        >
          <Button
            variant="secondary"
            size="md"
            onClick={handlePrecache}
            disabled={!online || precaching}
            className="shadow-md"
            aria-label="Descargar el mapa de esta zona para usarlo sin conexión"
          >
            {precaching ? <Spinner className="h-4 w-4" /> : <Icon name="download" size={16} />}
            <span className="text-sm">{precaching ? "Descargando…" : "Preparar área offline"}</span>
          </Button>
          {precaching && progress && (
            <span className="rounded-md bg-white/95 px-2 py-1 text-xs font-medium text-ink shadow">
              {progress.done}/{progress.total}
            </span>
          )}
          {!precaching && progress && (
            <span className="rounded-md bg-white/95 px-2 py-1 text-right text-xs font-medium text-ink shadow">
              {progress.done} mosaicos guardados
              {capped && (
                <span className="mt-0.5 block font-semibold text-amarillo">
                  Área muy grande: se guardó el máximo permitido. Acércate y repite.
                </span>
              )}
            </span>
          )}
          {!online && (
            <span className="rounded-md bg-white/95 px-2 py-1 text-right text-xs text-slate-500 shadow">
              Conéctate para preparar el área
            </span>
          )}
        </div>

        {/* Leyenda de colores (esquina inferior izquierda) */}
        <div className="pointer-events-auto absolute bottom-4 left-3 rounded-2xl border border-slate-200 bg-white/95 px-3 py-2 shadow-md">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">Carteles</p>
          <ul className="flex flex-col gap-1">
            {LEGEND.map((l) => (
              <li key={l.placard} className="flex items-center gap-2 text-sm text-ink">
                <PlacardDot placard={l.placard} />
                {l.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Estado vacío amable */}
        {isEmpty && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
            <div className="pointer-events-auto max-w-xs rounded-2xl border border-slate-200 bg-white/95 p-5 text-center shadow-lg">
              <div className="mb-2 flex justify-center text-slate-300">
                <Icon name="map" size={40} strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-bold text-ink">Aún no hay inspecciones</h2>
              <p className="mt-1 text-sm text-slate-600">
                Cuando registres o recibas inspecciones, aparecerán aquí como pines de color según
                su cartel.
              </p>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="mt-4"
                onClick={() => router.push("/inspeccion/nueva")}
              >
                Comenzar inspección
              </Button>
            </div>
          </div>
        )}

        {/* FAB: Nueva inspección (esquina inferior derecha) */}
        <button
          type="button"
          onClick={() => router.push("/inspeccion/nueva")}
          aria-label="Nueva inspección"
          className="pointer-events-auto absolute bottom-4 right-3 inline-flex touch-target items-center gap-2 rounded-full bg-brand px-5 py-4 text-lg font-bold text-white shadow-xl transition-colors active:bg-brand-dark"
        >
          <Icon name="plus" size={22} />
          Nueva inspección
        </button>
      </div>
    </div>
  );
}

export default MapHome;
