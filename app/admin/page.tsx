"use client";
// Dashboard administrativo: mapa semáforo, filtros (evento, municipio, fecha,
// sync), contadores y tabla exportable (CSV / GeoJSON con mapeo dual
// FUNVISIS/ATC-20). Combina las inspecciones locales (Dexie) con las del
// servidor que la sesión pueda leer (dueño; coordinador ve toda la red).
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { AppShell } from "@/components/AppShell";
import { Button, Card, CardTitle, Field, Spinner } from "@/components/ui";
import type { MapMarker } from "@/components/map/LeafletMap";
import { db } from "@/lib/db";
import {
  buildCsv,
  buildGeoJson,
  exportRowFromInspection,
  exportRowFromRemote,
  type ExportRow,
} from "@/lib/funvisis/export";
import { EVENT_TYPE_OPTIONS } from "@/lib/funvisis/catalog";
import { getSupabase } from "@/lib/supabase";
import type { Placard } from "@/lib/types";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-sky-100 text-slate-500">
      <Spinner />
    </div>
  ),
});

const PLACARD_COUNTER: { key: Placard; label: string; cls: string }[] = [
  { key: "rojo", label: "Rojas", cls: "bg-red-100 text-red-800" },
  { key: "amarillo", label: "Amarillas", cls: "bg-amber-100 text-amber-800" },
  { key: "verde", label: "Verdes", cls: "bg-green-100 text-green-800" },
];

export default function AdminDashboardPage() {
  // --- Fuente local (offline-first) ---------------------------------------
  const local = useLiveQuery(async () => {
    const all = await db.inspections.where("status").equals("complete").toArray();
    return all.map(exportRowFromInspection);
  }, []);

  // --- Fuente remota (lo que la RLS permita leer a esta sesión) ------------
  const [remote, setRemote] = useState<ExportRow[]>([]);
  const [remoteState, setRemoteState] = useState<"loading" | "done" | "offline">("loading");
  useEffect(() => {
    void (async () => {
      const sb = getSupabase();
      if (!sb || (typeof navigator !== "undefined" && !navigator.onLine)) {
        setRemoteState("offline");
        return;
      }
      try {
        const [{ data: inspections }, { data: buildings }, { data: counts }] = await Promise.all([
          sb.from("inspections").select("*").limit(5000),
          sb.from("buildings").select("*").limit(5000),
          sb.from("inspection_element_counts").select("*").limit(20000),
        ]);
        const bIndex = new Map((buildings ?? []).map((b) => [b.id, b]));
        const cIndex = new Map<string, NonNullable<typeof counts>>();
        for (const c of counts ?? []) {
          const list = cIndex.get(c.inspection_id) ?? [];
          list.push(c);
          cIndex.set(c.inspection_id, list);
        }
        setRemote(
          (inspections ?? []).map((i) =>
            exportRowFromRemote(
              i as unknown as Record<string, unknown>,
              (bIndex.get(i.building_id ?? "") ?? null) as Record<string, unknown> | null,
              (cIndex.get(i.id) ?? []).map((c) => ({
                element_type: c.element_type,
                n_no_minor: c.n_no_minor,
                n_moderate: c.n_moderate,
                pct_moderate: c.pct_moderate,
              })),
            ),
          ),
        );
        setRemoteState("done");
      } catch {
        setRemoteState("offline");
      }
    })();
  }, []);

  // --- Merge (lo local manda sobre su copia remota) -------------------------
  const rows = useMemo(() => {
    const localRows = local ?? [];
    const localIds = new Set(localRows.map((r) => r.id));
    return [...localRows, ...remote.filter((r) => !localIds.has(r.id))];
  }, [local, remote]);

  // --- Filtros ---------------------------------------------------------------
  const [fEvent, setFEvent] = useState("");
  const [fMunicipio, setFMunicipio] = useState("");
  const [fFrom, setFFrom] = useState("");
  const [fTo, setFTo] = useState("");
  const [fSync, setFSync] = useState("");

  const municipios = useMemo(
    () =>
      [...new Set(rows.map((r) => (r.municipio as string) || "").filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, "es"),
      ),
    [rows],
  );

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (fEvent && r.event_type !== fEvent) return false;
        if (fMunicipio && r.municipio !== fMunicipio) return false;
        const date = String(r.inspected_at ?? "").slice(0, 10);
        if (fFrom && date < fFrom) return false;
        if (fTo && date > fTo) return false;
        if (fSync && r.sync_status !== fSync) return false;
        return true;
      }),
    [rows, fEvent, fMunicipio, fFrom, fTo, fSync],
  );

  // --- Contadores y mapa -------------------------------------------------------
  const total = filtered.length;
  const byPlacard = (p: Placard) => filtered.filter((r) => r.placard_final === p).length;
  const pct = (n: number) => (total > 0 ? Math.round((100 * n) / total) : 0);

  const markers: MapMarker[] = useMemo(
    () =>
      filtered
        .filter((r) => typeof r.lat === "number" && typeof r.lng === "number")
        .map((r) => ({
          id: String(r.id),
          lat: r.lat as number,
          lng: r.lng as number,
          placard: (r.placard_final as Placard) ?? "none",
          label: `${r.edificacion || r.direccion || "Edificación"}<br/>${r.municipio ?? ""} · ${
            r.etiqueta_funvisis || r.placard_atc20 || "—"
          }`,
        })),
    [filtered],
  );

  function download(content: string, name: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  const stamp = new Date().toISOString().slice(0, 10);

  return (
    <AppShell title="Dashboard" back>
      <div className="flex flex-col gap-4 pb-6">
        {/* Contadores */}
        <div className="grid grid-cols-4 gap-2">
          <Card className="flex flex-col items-center py-3">
            <span className="text-2xl font-extrabold text-ink">{total}</span>
            <span className="text-xs font-semibold text-slate-500">Total</span>
          </Card>
          {PLACARD_COUNTER.map((c) => {
            const n = byPlacard(c.key);
            return (
              <Card key={c.key} className="flex flex-col items-center py-3">
                <span className={`rounded-full px-2 text-2xl font-extrabold ${c.cls}`}>{n}</span>
                <span className="text-xs font-semibold text-slate-500">
                  {c.label} · {pct(n)}%
                </span>
              </Card>
            );
          })}
        </div>

        {remoteState === "offline" && (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
            Sin conexión con el servidor: se muestran solo las inspecciones de este dispositivo.
          </p>
        )}

        {/* Filtros */}
        <Card>
          <CardTitle>Filtros</CardTitle>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="Evento">
              <select
                className="touch-target w-full rounded-xl border border-slate-300 bg-white px-3 text-base"
                value={fEvent}
                onChange={(e) => setFEvent(e.target.value)}
              >
                <option value="">Todos</option>
                {EVENT_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Municipio">
              <select
                className="touch-target w-full rounded-xl border border-slate-300 bg-white px-3 text-base"
                value={fMunicipio}
                onChange={(e) => setFMunicipio(e.target.value)}
              >
                <option value="">Todos</option>
                {municipios.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Desde">
              <input
                type="date"
                className="touch-target w-full rounded-xl border border-slate-300 bg-white px-3 text-base"
                value={fFrom}
                onChange={(e) => setFFrom(e.target.value)}
              />
            </Field>
            <Field label="Hasta">
              <input
                type="date"
                className="touch-target w-full rounded-xl border border-slate-300 bg-white px-3 text-base"
                value={fTo}
                onChange={(e) => setFTo(e.target.value)}
              />
            </Field>
            <Field label="Sincronización" className="col-span-2">
              <select
                className="touch-target w-full rounded-xl border border-slate-300 bg-white px-3 text-base"
                value={fSync}
                onChange={(e) => setFSync(e.target.value)}
              >
                <option value="">Todas</option>
                <option value="synced">Sincronizadas</option>
                <option value="pending">Pendientes</option>
                <option value="error">Con error</option>
              </select>
            </Field>
          </div>
        </Card>

        {/* Mapa semáforo */}
        <div className="h-80 w-full overflow-hidden rounded-2xl border border-slate-200">
          <LeafletMap className="h-full w-full" markers={markers} zoom={12} />
        </div>

        {/* Exports */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            onClick={() => download(buildCsv(filtered), `reestructuramos-${stamp}.csv`, "text/csv;charset=utf-8")}
            disabled={filtered.length === 0}
          >
            Exportar CSV ({filtered.length})
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              download(buildGeoJson(filtered), `reestructuramos-${stamp}.geojson`, "application/geo+json")
            }
            disabled={filtered.length === 0}
          >
            Exportar GeoJSON
          </Button>
        </div>
        <Link
          href="/admin/importar"
          className="touch-target flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 font-semibold text-ink active:bg-slate-100"
        >
          Importar desde QuickCheck Damage →
        </Link>

        {/* Tabla */}
        <Card>
          <CardTitle>Inspecciones ({filtered.length})</CardTitle>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <th className="py-2 pr-2">Planilla</th>
                  <th className="py-2 pr-2">Edificación</th>
                  <th className="py-2 pr-2">Municipio</th>
                  <th className="py-2 pr-2">Fecha</th>
                  <th className="py-2 pr-2">Riesgo</th>
                  <th className="py-2 pr-2">Etiqueta</th>
                  <th className="py-2">Sync</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={String(r.id)} className="border-b border-slate-100">
                    <td className="py-2 pr-2 font-data text-xs">{r.planilla_no || "—"}</td>
                    <td className="max-w-48 truncate py-2 pr-2">
                      {r.edificacion || r.direccion || "—"}
                    </td>
                    <td className="py-2 pr-2">{r.municipio || "—"}</td>
                    <td className="py-2 pr-2">{String(r.inspected_at ?? "").slice(0, 10) || "—"}</td>
                    <td className="py-2 pr-2 font-bold">{r.risk_overall || "—"}</td>
                    <td className="py-2 pr-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                          r.placard_final === "rojo"
                            ? "bg-red-100 text-red-800"
                            : r.placard_final === "amarillo"
                              ? "bg-amber-100 text-amber-800"
                              : r.placard_final === "verde"
                                ? "bg-green-100 text-green-800"
                                : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {r.placard_atc20 || "—"}
                      </span>
                    </td>
                    <td className="py-2 text-xs">{r.sync_status}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-slate-400">
                      Sin inspecciones con estos filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
