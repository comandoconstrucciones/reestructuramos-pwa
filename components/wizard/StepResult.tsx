"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardTitle,
  Field,
  Icon,
  OptionGrid,
  PlacardBadge,
  Spinner,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/ui";
import { DictateButton } from "@/components/DictateButton";
import { PLACARD_META, suggestPlacard } from "@/lib/placard";
import { DETAILED_EVAL_OPTIONS } from "@/lib/catalog";
import { finalizeInspection, getFlag, setFlag } from "@/lib/db";
import { cn } from "@/lib/cn";
import type { DetailedEval, Inspection, Placard } from "@/lib/types";
import type { StepProps } from "./types";

const CHOICES: Exclude<Placard, "none">[] = ["verde", "amarillo", "rojo"];

export function StepResult({ insp, update, finalize }: StepProps) {
  const router = useRouter();
  const [finalizing, setFinalizing] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const s = suggestPlacard({
    findings: insp.findings,
    damageBand: insp.estimatedDamageBand,
    isEssential: insp.building.isEssential,
  });

  // Texto local (no perder el cursor con el autoguardado).
  const [restrictions, setRestrictions] = useState(insp.entryRestrictions ?? "");
  const [comments, setComments] = useState(insp.generalComments ?? "");
  const [signature, setSignature] = useState(insp.inspectorSignature ?? "");
  const [overrideReason, setOverrideReason] = useState(insp.placardOverrideReason ?? "");

  // Prefill de UNA SOLA VEZ (la marca persiste en Dexie -> sobrevive a
  // remontajes al ir/volver de pasos y a reanudaciones de sesión).
  useEffect(() => {
    let active = true;
    (async () => {
      const key = `result_init:${insp.clientUuid}`;
      const done = await getFlag(key);
      if (done) {
        const patch: Partial<Inspection> = {};
        if (insp.placardSuggested !== s.placard) patch.placardSuggested = s.placard;
        // Si NO hubo elección manual, mantén el cartel final sincronizado con la
        // sugerencia (evita un "override fantasma" al cambiar hallazgos y volver).
        if (!insp.placardManual && insp.placardFinal !== s.placard) patch.placardFinal = s.placard;
        if (Object.keys(patch).length) update(patch);
        return;
      }
      await setFlag(key, true);
      if (!active) return;
      update((cur) => {
        const patch: Partial<Inspection> = {
          placardSuggested: s.placard,
          barricadesNeeded: s.barricadesNeeded,
        };
        if (cur.placardFinal === "none") patch.placardFinal = s.placard;
        if (cur.entryRestrictions == null) patch.entryRestrictions = s.defaultEntryRestrictions;
        if (!cur.detailedEvalRecommended.length)
          patch.detailedEvalRecommended = s.detailedEvalRecommended;
        return patch;
      });
      if (!insp.entryRestrictions) setRestrictions(s.defaultEntryRestrictions);
    })();
    return () => {
      active = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Anulación REAL: el inspector eligió a mano un cartel que difiere de una
  // sugerencia existente. No cuenta como anulación una sugerencia 'none'.
  const isOverride =
    insp.placardManual === true &&
    insp.placardSuggested !== "none" &&
    insp.placardFinal !== "none" &&
    insp.placardFinal !== insp.placardSuggested;
  const hasLocation = insp.lat != null && insp.lng != null;
  const overrideOk = !isOverride || overrideReason.trim().length > 0;
  const canFinalize = insp.placardFinal !== "none" && hasLocation && overrideOk;

  async function handleFinalize() {
    setShowErrors(true);
    if (!canFinalize || finalizing) return;
    setFinalizing(true);
    try {
      // Drena la cola de autosave y finaliza atómicamente (prop del orquestador).
      if (finalize) await finalize();
      else await finalizeInspection(insp.clientUuid);
      router.replace(`/inspeccion/${insp.clientUuid}`);
    } catch {
      setFinalizing(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Sugerencia automática */}
      <Card className="flex flex-col items-center gap-3">
        <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Cartel sugerido
        </span>
        <PlacardBadge placard={s.placard} size="lg" />
        {s.reasons.length > 0 && (
          <ul className="w-full list-disc space-y-1 pl-5 text-sm text-slate-600">
            {s.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        )}
        <p className="text-center text-xs text-slate-400">
          Es una sugerencia automática. La decisión final es del inspector.
        </p>
      </Card>

      {/* Confirmar o anular */}
      <Card>
        <CardTitle>Confirma o anula el cartel</CardTitle>
        <p className="mb-3 mt-1 text-sm text-slate-500">Toca el cartel definitivo.</p>
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
                  setShowErrors(false);
                  update({ placardFinal: p, placardManual: true });
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
                <span className="break-words text-xs leading-tight">{meta.label}</span>
                <span className="mt-0.5 text-[10px] font-semibold leading-tight">{meta.sublabel}</span>
              </button>
            );
          })}
        </div>

        {insp.placardFinal !== "none" && (
          <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
            {PLACARD_META[insp.placardFinal].instruction}
          </p>
        )}

        {isOverride && (
          <div className="mt-3">
            <Field
              label="Motivo de la anulación"
              help="Difiere de la sugerencia: explica por qué."
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

      {/* Restricciones de ingreso */}
      <Card>
        <Field label="Restricciones de ingreso" help="Prellenado según la sugerencia; editable.">
          <TextArea
            value={restrictions}
            onChange={(e) => {
              setRestrictions(e.target.value);
              update({ entryRestrictions: e.target.value });
            }}
            placeholder="Condiciones de acceso al edificio…"
          />
        </Field>
      </Card>

      {/* Barricadas */}
      <Card>
        <Toggle
          checked={insp.barricadesNeeded}
          onChange={(v) => update({ barricadesNeeded: v })}
          label="Se requieren barricadas / acordonamiento"
          description="Señalizar y aislar el perímetro de peligro."
          emphasis
        />
      </Card>

      {/* Evaluación detallada recomendada */}
      <Card>
        <CardTitle>Evaluación detallada recomendada</CardTitle>
        <p className="mb-3 mt-1 text-sm text-slate-500">Selecciona las que apliquen.</p>
        <OptionGrid<DetailedEval>
          options={DETAILED_EVAL_OPTIONS}
          value={insp.detailedEvalRecommended}
          multi
          columns={3}
          onChange={(v) => update({ detailedEvalRecommended: v as DetailedEval[] })}
        />
      </Card>

      {/* Comentarios */}
      <Card>
        <Field label="Comentarios generales" help="Observaciones, contexto, recomendaciones.">
          <TextArea
            value={comments}
            onChange={(e) => {
              setComments(e.target.value);
              update({ generalComments: e.target.value });
            }}
            placeholder="Notas del inspector…"
          />
          <div className="mt-2">
            <DictateButton
              onText={(t) => {
                const next = comments ? `${comments} ${t}` : t;
                setComments(next);
                update({ generalComments: next });
              }}
            />
          </div>
        </Field>
      </Card>

      {/* Firma */}
      <Card>
        <Field label="Inspector (nombre / firma)" help="Quien realiza esta evaluación.">
          <TextInput
            value={signature}
            onChange={(e) => {
              setSignature(e.target.value);
              update({ inspectorSignature: e.target.value });
            }}
            placeholder="Nombre y apellido"
          />
        </Field>
      </Card>

      {/* Errores de validación */}
      {showErrors && !canFinalize && (
        <div className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-rojo-ink">
          <p>No se puede finalizar todavía:</p>
          <ul className="mt-1 list-disc pl-5">
            {insp.placardFinal === "none" && <li>Selecciona el cartel definitivo.</li>}
            {!hasLocation && <li>Falta la ubicación del edificio (Paso 1).</li>}
            {isOverride && !overrideOk && <li>Indica el motivo de la anulación.</li>}
          </ul>
        </div>
      )}

      {/* Finalizar */}
      <Button
        variant="success"
        size="xl"
        fullWidth
        onClick={handleFinalize}
        disabled={finalizing}
        className="mt-1"
      >
        {finalizing ? <Spinner /> : <Icon name="check" size={22} />} Finalizar inspección
      </Button>
    </div>
  );
}
