"use client";
// Paso 6 — Decisión final (planilla FUNVISIS, Sección 6).
// Tarjeta con los 4 riesgos parciales + riesgo global + etiqueta sugerida en
// semáforo. Override manual: ENDURECER siempre está permitido; SUAVIZAR exige
// razón obligatoria. Croquis de la planta del piso crítico + observaciones.
import { useEffect, useState } from "react";
import { Card, CardTitle, Field, TextArea } from "@/components/ui";
import { DrawCanvas } from "@/components/DrawCanvas";
import { cn } from "@/lib/cn";
import { RISK_LABELS } from "@/lib/funvisis/catalog";
import {
  computeFunvisis,
  FUNVISIS_PLACARD_META,
  overrideNeedsReason,
  riskToPlacard,
} from "@/lib/funvisis/scoring";
import { tap } from "@/lib/haptics";
import { PLACARD_META } from "@/lib/placard";
import type { Inspection, Placard } from "@/lib/types";
import type { RiskLevel } from "@/lib/funvisis/types";
import type { StepProps } from "./types";
import { RISK_STYLES, RiskChip } from "./funvisis-ui";

const CHOICES: Exclude<Placard, "none">[] = ["verde", "amarillo", "rojo"];

function computeFromInspection(insp: Inspection) {
  return computeFunvisis({
    external: insp,
    severe: {
      nSevereColumns: insp.nSevereColumns ?? 0,
      nSevereConcreteWalls: insp.nSevereConcreteWalls ?? 0,
      nSevereMasonryWalls: insp.nSevereMasonryWalls ?? 0,
      nSevereBeams: insp.nSevereBeams ?? 0,
    },
    elementCounts: insp.elementCounts ?? [],
    moderatePctEstimated: insp.moderatePctEstimated,
    components: insp,
  });
}

export function StepDecision({ insp, update }: StepProps) {
  const result = computeFromInspection(insp);
  const [observations, setObservations] = useState(insp.observations ?? "");
  const [overrideReason, setOverrideReason] = useState(insp.placardOverrideReason ?? "");
  // El croquis vive como dataURL local mientras se dibuja; se persiste como
  // Blob (Dexie) para subirlo a Storage al sincronizar. Al reanudar un
  // borrador se restaura desde el Blob guardado.
  const [sketchUrl, setSketchUrl] = useState<string | null>(null);
  const [sketchReady, setSketchReady] = useState(!insp.sketchBlob);
  useEffect(() => {
    const blob = insp.sketchBlob;
    if (sketchReady || !blob) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSketchUrl(typeof reader.result === "string" ? reader.result : null);
      setSketchReady(true);
    };
    reader.onerror = () => setSketchReady(true);
    reader.readAsDataURL(blob);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mantén sugerencia + riesgos sincronizados con lo capturado; si el
  // inspector no ha elegido a mano, el cartel final sigue a la sugerencia.
  useEffect(() => {
    update((cur) => {
      const r = computeFromInspection(cur);
      const patch: Partial<Inspection> = {
        riskExternal: r.riskExternal,
        riskSevere: r.riskSevere,
        riskModerate: r.riskModerate,
        riskComponents: r.riskComponents,
        riskOverall: r.riskOverall,
      };
      if (cur.placardSuggested !== r.placardSuggested) patch.placardSuggested = r.placardSuggested;
      if (!cur.placardManual && cur.placardFinal !== r.placardSuggested)
        patch.placardFinal = r.placardSuggested;
      return patch;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.riskOverall, result.riskExternal, result.riskSevere, result.riskModerate, result.riskComponents]);

  const needsReason =
    insp.placardManual === true &&
    overrideNeedsReason(insp.placardSuggested, insp.placardFinal);

  const partials: { title: string; risk: RiskLevel | null | undefined; skipped: boolean }[] = [
    { title: "2. Riesgo externo", risk: result.riskExternal, skipped: false },
    { title: "3. Daño Severo/Completo", risk: result.riskSevere, skipped: result.skippedSections.includes(3) },
    { title: "4. Daño Moderado", risk: result.riskModerate, skipped: result.skippedSections.includes(4) },
    { title: "5. Componentes", risk: result.riskComponents, skipped: result.skippedSections.includes(5) },
  ];

  return (
    <div className="flex flex-col gap-3">
      {/* Resumen de riesgos parciales + global (semáforo de la planilla) */}
      <Card>
        <CardTitle>Calificación del riesgo</CardTitle>
        <div className="mt-3 flex flex-col gap-2">
          {partials.map((p) => (
            <div key={p.title} className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-600">{p.title}</span>
              {p.skipped ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-400">
                  Omitida (corte)
                </span>
              ) : (
                <RiskChip risk={p.risk} />
              )}
            </div>
          ))}
          <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-200 pt-3">
            <span className="text-base font-bold text-ink">6. Riesgo global</span>
            <RiskChip risk={result.riskOverall} size="lg" />
          </div>
        </div>

        {result.riskOverall && (
          <div
            className={cn(
              "mt-3 rounded-xl border-2 p-3 text-center",
              RISK_STYLES[result.riskOverall].bg,
              RISK_STYLES[result.riskOverall].border,
            )}
          >
            <p className={cn("text-lg font-extrabold", RISK_STYLES[result.riskOverall].ink)}>
              {FUNVISIS_PLACARD_META[result.riskOverall].label} ·{" "}
              {FUNVISIS_PLACARD_META[result.riskOverall].sublabel}
            </p>
            <p className={cn("text-xs font-medium", RISK_STYLES[result.riskOverall].ink)}>
              Etiqueta sugerida ({RISK_LABELS[result.riskOverall]}) — equivale a{" "}
              {PLACARD_META[riskToPlacard(result.riskOverall)].label} en ATC-20
            </p>
          </div>
        )}
        <p className="mt-2 text-center text-xs text-slate-400">
          Es una sugerencia automática. La decisión final es del inspector.
        </p>
      </Card>

      {/* Confirmar o anular la etiqueta */}
      <Card>
        <CardTitle>Confirma o ajusta la etiqueta</CardTitle>
        <p className="mb-3 mt-1 text-sm text-slate-500">
          Puedes endurecerla siempre; para suavizarla debes justificarlo.
        </p>
        <div className="flex gap-2">
          {CHOICES.map((p) => {
            const meta = PLACARD_META[p];
            const selected = insp.placardFinal === p;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  update({ placardFinal: p, placardManual: true });
                  tap();
                }}
                className={cn(
                  "touch-target flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl border-4 px-1 py-3 text-center font-extrabold transition-all",
                  selected ? "ring-4 ring-ink/40 ring-offset-2" : "opacity-60",
                )}
                style={{
                  backgroundColor: meta.color,
                  color: meta.textOn,
                  borderColor: selected ? meta.color : "transparent",
                }}
              >
                <span className="w-full break-words text-[11px] leading-tight">{meta.label}</span>
                <span className="mt-0.5 w-full break-words text-[10px] font-semibold leading-tight">
                  {meta.sublabel}
                </span>
              </button>
            );
          })}
        </div>

        {needsReason && (
          <div className="mt-3">
            <Field
              label="Motivo para suavizar la etiqueta"
              help="Elegiste una etiqueta menos severa que la sugerida: justifícalo."
              required
            >
              <TextArea
                value={overrideReason}
                onChange={(e) => {
                  setOverrideReason(e.target.value);
                  update({ placardOverrideReason: e.target.value });
                }}
                placeholder="Justificación técnica de la decisión…"
              />
            </Field>
          </div>
        )}
      </Card>

      {/* Croquis de la planta del piso crítico */}
      <Card>
        <CardTitle>Croquis de la planta del piso crítico</CardTitle>
        <p className="mb-3 mt-1 text-sm text-slate-500">
          Dibuja la planta y marca los daños principales. Se guarda con la planilla.
        </p>
        {sketchReady && (
        <DrawCanvas
          heightClass="h-64"
          strokeWidth={2}
          placeholder="Dibuja aquí el croquis"
          initialDataUrl={sketchUrl}
          onChange={(dataUrl) => {
            setSketchUrl(dataUrl);
            if (!dataUrl) {
              update({ sketchBlob: null, sketchStoragePath: null });
              return;
            }
            // dataURL → Blob PNG para Dexie/Storage.
            const [head, body] = dataUrl.split(",");
            const mime = head.match(/data:(.*?);/)?.[1] ?? "image/png";
            const bin = atob(body);
            const bytes = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
            update({ sketchBlob: new Blob([bytes], { type: mime }), sketchStoragePath: null });
          }}
        />
        )}
      </Card>

      {/* Observaciones */}
      <Card>
        <Field label="Observaciones" help="Notas de la Sección 6 de la planilla.">
          <TextArea
            value={observations}
            onChange={(e) => {
              setObservations(e.target.value);
              update({ observations: e.target.value });
            }}
            placeholder="Observaciones del inspector…"
          />
        </Field>
      </Card>
    </div>
  );
}
