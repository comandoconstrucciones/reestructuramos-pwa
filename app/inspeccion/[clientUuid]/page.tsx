"use client";
import { useParams, useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button, Card, CardTitle, Icon, PlacardBadge, Spinner } from "@/components/ui";
import { PhotoGallery } from "@/components/result/PhotoGallery";
import { PrintablePlacard } from "@/components/result/PrintablePlacard";
import {
  CONSTRUCTION_TYPE_OPTIONS,
  DAMAGE_BAND_OPTIONS,
  DETAILED_EVAL_OPTIONS,
  OCCUPANCY_OPTIONS,
  SEVERITY_OPTIONS,
  getElementLabel,
} from "@/lib/catalog";
import { getInspection, listPhotos } from "@/lib/db";
import { buildInspectionPdf } from "@/lib/pdf";
import { PLACARD_META } from "@/lib/placard";
import { triggerSync } from "@/lib/sync";
import type { Inspection, SyncStatus } from "@/lib/types";

const EVAL_LEVEL_LABELS: Record<string, string> = {
  rapida: "Evaluación rápida",
  detallada: "Evaluación detallada",
};
const AREAS_LABELS: Record<string, string> = {
  exterior: "Solo exterior",
  exterior_interior: "Exterior e interior",
};
const CATEGORY_LABELS: Record<string, string> = {
  peligro_general: "Peligro general",
  estructural: "Estructural",
  no_estructural: "No estructural",
  geotecnico: "Geotécnico",
};
const SEV_COLOR: Record<string, string> = Object.fromEntries(
  SEVERITY_OPTIONS.map((s) => [s.value, s.color]),
);
const SEV_LABEL: Record<string, string> = Object.fromEntries(
  SEVERITY_OPTIONS.map((s) => [s.value, s.label]),
);
const SYNC_META: Record<SyncStatus, { label: string; cls: string }> = {
  pending: { label: "Pendiente de subir", cls: "bg-amber-100 text-amber-900" },
  synced: { label: "Sincronizada", cls: "bg-green-100 text-green-800" },
  error: { label: "Error de sincronización", cls: "bg-red-100 text-rojo" },
};

function optLabel(opts: { value: string; label: string }[], v?: string | null): string {
  if (!v) return "—";
  return opts.find((o) => o.value === v)?.label ?? v;
}

function fmtDateTime(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  try {
    return d.toLocaleString("es-VE", { dateStyle: "long", timeStyle: "short" });
  } catch {
    return d.toISOString();
  }
}

export default function InspectionResultPage() {
  const params = useParams<{ clientUuid: string }>();
  const clientUuid = params?.clientUuid ?? "";
  const router = useRouter();

  // undefined = cargando · null = no existe · Inspection = encontrada
  const result = useLiveQuery(
    async () => (await getInspection(clientUuid)) ?? null,
    [clientUuid],
  );
  const photos = useLiveQuery(() => listPhotos(clientUuid), [clientUuid]) ?? [];

  const [pdfBusy, setPdfBusy] = useState(false);
  const [showPlacard, setShowPlacard] = useState(false);

  if (result === undefined) {
    return (
      <AppShell title="Resultado" back>
        <div className="flex justify-center p-12">
          <Spinner className="h-8 w-8 text-brand" />
        </div>
      </AppShell>
    );
  }

  if (result === null) {
    return (
      <AppShell title="Resultado" back>
        <Card className="text-center">
          <CardTitle>Inspección no encontrada</CardTitle>
          <p className="mt-2 text-slate-600">
            No existe una inspección con este identificador en este dispositivo.
          </p>
          <Button className="mt-4" onClick={() => router.push("/")} fullWidth>
            Volver al inicio
          </Button>
        </Card>
      </AppShell>
    );
  }

  const inspection: Inspection = result;
  const meta = PLACARD_META[inspection.placardFinal] ?? PLACARD_META.none;
  const sync = SYNC_META[inspection.syncStatus];
  const restrictions = inspection.entryRestrictions || meta.defaultRestrictions;

  async function downloadPdf() {
    setPdfBusy(true);
    try {
      const blob = await buildInspectionPdf(inspection, photos);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const stamp = (inspection.inspectedAt ?? "").slice(0, 10) || "inspeccion";
      a.download = `reestructuramos-${stamp}-${inspection.clientUuid.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    } finally {
      setPdfBusy(false);
    }
  }

  return (
    <AppShell title="Resultado" back>
      <div className="flex flex-col gap-4 pb-6">
        {inspection.status === "draft" && (
          <div className="rounded-xl bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-900">
            Esta inspección es un borrador y aún no se ha finalizado.
          </div>
        )}

        {/* Cartel final */}
        <div className="flex flex-col items-center gap-3">
          <PlacardBadge placard={inspection.placardFinal} size="lg" />
          <p className="max-w-md text-center text-sm text-slate-600">{meta.instruction}</p>
          {inspection.placardSuggested !== inspection.placardFinal && (
            <p className="text-center text-xs text-slate-500">
              Sugerido por el sistema:{" "}
              <span className="font-semibold">
                {(PLACARD_META[inspection.placardSuggested] ?? PLACARD_META.none).label}
              </span>
              {inspection.placardOverrideReason
                ? ` · Anulado: ${inspection.placardOverrideReason}`
                : ""}
            </p>
          )}
        </div>

        {/* Acciones */}
        <div className="grid grid-cols-2 gap-2">
          <Button onClick={downloadPdf} disabled={pdfBusy}>
            {pdfBusy ? <Spinner /> : <Icon name="download" size={18} />}
            {pdfBusy ? "Generando…" : "Descargar PDF"}
          </Button>
          <Button variant="secondary" onClick={() => setShowPlacard(true)}>
            <Icon name="printer" size={18} /> Cartel para imprimir
          </Button>
        </div>

        {/* Estado de sincronización */}
        <Card className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-sm font-bold ${sync.cls}`}>
            {sync.label}
          </span>
          {inspection.syncStatus !== "synced" && (
            <Button variant="ghost" size="md" className="ml-auto" onClick={triggerSync}>
              Sincronizar ahora
            </Button>
          )}
        </Card>
        {inspection.syncStatus === "error" && inspection.lastSyncError && (
          <p className="-mt-2 px-1 text-xs text-rojo">{inspection.lastSyncError}</p>
        )}

        {/* Edificio */}
        <Card>
          <CardTitle>Edificio</CardTitle>
          <dl className="mt-3 space-y-2">
            <Row k="Nombre / referencia" v={inspection.building.name || "—"} />
            <Row k="Dirección" v={inspection.building.address || "—"} />
            <Row
              k="Tipo de construcción"
              v={optLabel(CONSTRUCTION_TYPE_OPTIONS, inspection.building.constructionType)}
            />
            <Row k="Ocupación" v={optLabel(OCCUPANCY_OPTIONS, inspection.building.occupancyType)} />
            <Row
              k="Niveles"
              v={`${inspection.building.nStoriesAbove ?? "—"} sobre rasante · ${
                inspection.building.nStoriesBelow ?? "—"
              } bajo rasante`}
            />
            <Row
              k="Año"
              v={inspection.building.yearBuilt != null ? String(inspection.building.yearBuilt) : "—"}
            />
            <Row
              k="Características"
              v={
                [
                  inspection.building.isEssential && "Edificio esencial",
                  inspection.building.softStory && "Piso blando",
                  inspection.building.shortColumn && "Columna corta",
                ]
                  .filter(Boolean)
                  .join("; ") || "Ninguna"
              }
            />
          </dl>
        </Card>

        {/* Hallazgos */}
        <Card>
          <CardTitle>Hallazgos ({inspection.findings.length})</CardTitle>
          {inspection.findings.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">Sin hallazgos registrados.</p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {inspection.findings.map((f) => (
                <li key={f.id} className="flex items-start gap-3 py-2.5">
                  <span
                    className="mt-1.5 h-3 w-3 shrink-0 rounded-full ring-2 ring-white"
                    style={{ backgroundColor: SEV_COLOR[f.severity] ?? "#64748b" }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">{getElementLabel(f.element)}</p>
                    <p className="text-xs text-slate-500">
                      {CATEGORY_LABELS[f.category] ?? f.category} ·{" "}
                      <span className="font-semibold" style={{ color: SEV_COLOR[f.severity] }}>
                        {SEV_LABEL[f.severity] ?? f.severity}
                      </span>
                    </p>
                    {f.notes && <p className="mt-1 text-sm text-slate-600">{f.notes}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Evaluación y medidas */}
        <Card>
          <CardTitle>Evaluación y medidas</CardTitle>
          <dl className="mt-3 space-y-2">
            <Row
              k="Banda de daño estimada"
              v={optLabel(DAMAGE_BAND_OPTIONS, inspection.estimatedDamageBand)}
            />
            <Row k="Restricciones de entrada" v={restrictions || "—"} />
            <Row k="Barricadas necesarias" v={inspection.barricadesNeeded ? "Sí" : "No"} />
            <Row
              k="Evaluación detallada recomendada"
              v={
                inspection.detailedEvalRecommended
                  .map((e) => optLabel(DETAILED_EVAL_OPTIONS, e))
                  .join(", ") || "Ninguna"
              }
            />
            <Row
              k="Nivel de evaluación"
              v={EVAL_LEVEL_LABELS[inspection.evaluationLevel] ?? inspection.evaluationLevel}
            />
            {inspection.areasInspected && (
              <Row
                k="Áreas inspeccionadas"
                v={AREAS_LABELS[inspection.areasInspected] ?? inspection.areasInspected}
              />
            )}
          </dl>
        </Card>

        {/* Comentarios */}
        {inspection.generalComments && (
          <Card>
            <CardTitle>Comentarios</CardTitle>
            <p className="mt-2 whitespace-pre-wrap text-slate-700">{inspection.generalComments}</p>
          </Card>
        )}

        {/* Ubicación, fecha y firma */}
        <Card>
          <CardTitle>Ubicación y registro</CardTitle>
          <dl className="mt-3 space-y-2">
            <Row
              mono
              k="Coordenadas"
              v={
                inspection.lat != null && inspection.lng != null
                  ? `${inspection.lat.toFixed(6)}, ${inspection.lng.toFixed(6)}`
                  : "No registradas"
              }
            />
            <Row
              k="Precisión GPS"
              v={inspection.gpsAccuracyM != null ? `± ${Math.round(inspection.gpsAccuracyM)} m` : "—"}
            />
            <Row k="Fecha de inspección" v={fmtDateTime(inspection.inspectedAt)} />
            {inspection.completedAt && <Row k="Finalizada" v={fmtDateTime(inspection.completedAt)} />}
            <Row
              k="Inspector / firma"
              v={
                inspection.inspectorSignature && !inspection.inspectorSignature.startsWith("data:")
                  ? inspection.inspectorSignature
                  : inspection.inspectorSignature
                    ? "Firma adjunta"
                    : "—"
              }
            />
          </dl>
        </Card>

        {/* Galería de fotos */}
        <Card>
          <CardTitle>Evidencia fotográfica ({photos.length})</CardTitle>
          <div className="mt-3">
            <PhotoGallery photos={photos} />
          </div>
        </Card>
      </div>

      {showPlacard && (
        <PrintablePlacard inspection={inspection} onClose={() => setShowPlacard(false)} />
      )}
    </AppShell>
  );
}

function Row({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex gap-3 text-sm">
      <dt className="w-40 shrink-0 font-semibold text-slate-500">{k}</dt>
      <dd className={mono ? "min-w-0 flex-1 font-data text-ink" : "min-w-0 flex-1 text-ink"}>{v}</dd>
    </div>
  );
}
