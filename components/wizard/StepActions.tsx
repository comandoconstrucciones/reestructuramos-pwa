"use client";
// Paso 7 — Acciones recomendadas y firmas (planilla FUNVISIS, Sección 7).
// Inspección detallada + medidas de prevención (checkboxes oficiales) y
// firmas de hasta 4 inspectores (mínimo 1). Al finalizar se sella time_end,
// se calculan y persisten los riesgos y se muestra la nota oficial.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardTitle, Field, Icon, OptionGrid, Spinner, TextInput } from "@/components/ui";
import { DrawCanvas } from "@/components/DrawCanvas";
import { getProfile } from "@/lib/db";
import {
  FUNVISIS_DETAILED_EVAL_OPTIONS,
  PREVENTION_MEASURE_OPTIONS,
} from "@/lib/funvisis/catalog";
import { normalizeDetailedEvals } from "@/lib/funvisis/normalize";
import { FUNVISIS_DISCLAIMER, overrideNeedsReason } from "@/lib/funvisis/scoring";
import { MAX_INSPECTORS, type CoInspector, type FunvisisDetailedEval, type PreventionMeasure } from "@/lib/funvisis/types";
import { validateStep } from "@/lib/funvisis/validation";
import { success, warn } from "@/lib/haptics";
import type { DetailedEval } from "@/lib/types";
import type { StepProps } from "./types";
import { StepIssuesList } from "./funvisis-ui";

export function StepActions({ insp, update, finalize }: StepProps) {
  const router = useRouter();
  const [finalizing, setFinalizing] = useState(false);
  const [issues, setIssues] = useState<string[]>([]);

  const roster = insp.inspectors ?? [];

  // Prefill de UNA sola vez: normaliza valores legados y siembra al inspector
  // líder con el nombre del perfil.
  useEffect(() => {
    void (async () => {
      const profile = await getProfile();
      update((cur) => {
        const patch: Partial<typeof cur> = {};
        const normalized = normalizeDetailedEvals(cur.detailedEvalRecommended);
        if (JSON.stringify(normalized) !== JSON.stringify(cur.detailedEvalRecommended))
          patch.detailedEvalRecommended = normalized;
        if (!cur.inspectors || cur.inspectors.length === 0) {
          patch.inspectors = [
            {
              inspectorId: profile?.id ?? null,
              fullName: profile?.fullName ?? "",
              nationalId: profile?.nationalId ?? null,
              isLead: true,
              signatureDataUrl: null,
            },
          ];
        }
        return patch;
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setPerson(idx: number, patch: Partial<CoInspector>) {
    update((cur) => {
      const list = [...(cur.inspectors ?? [])];
      if (!list[idx]) return {};
      list[idx] = { ...list[idx], ...patch };
      return { inspectors: list };
    });
  }

  function addPerson() {
    update((cur) => {
      const list = cur.inspectors ?? [];
      if (list.length >= MAX_INSPECTORS) return {};
      return {
        inspectors: [...list, { fullName: "", isLead: false, signatureDataUrl: null }],
      };
    });
  }

  function removePerson(idx: number) {
    update((cur) => {
      const list = [...(cur.inspectors ?? [])];
      if (list[idx]?.isLead) return {}; // el líder no se elimina
      list.splice(idx, 1);
      return { inspectors: list };
    });
  }

  async function handleFinalize() {
    // Última línea de validación en la app (los CHECK de la BD son la última).
    const stepIssues = [...validateStep(5, insp), ...validateStep(6, insp)];
    if (
      insp.placardManual === true &&
      overrideNeedsReason(insp.placardSuggested, insp.placardFinal) &&
      !insp.placardOverrideReason?.trim()
    ) {
      stepIssues.push("Indica el motivo para suavizar la etiqueta (Decisión final).");
    }
    if (insp.lat == null || insp.lng == null) {
      stepIssues.push("Falta la ubicación GPS (Paso 1).");
    }
    setIssues(stepIssues);
    if (stepIssues.length > 0 || finalizing) {
      if (stepIssues.length > 0) warn();
      return;
    }
    setFinalizing(true);
    try {
      if (finalize) await finalize();
      success();
      router.replace(`/inspeccion/${insp.clientUuid}`);
    } catch {
      setFinalizing(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Inspección detallada recomendada */}
      <Card>
        <CardTitle>Se recomienda inspección detallada de:</CardTitle>
        <div className="mt-3">
          <OptionGrid<FunvisisDetailedEval>
            options={FUNVISIS_DETAILED_EVAL_OPTIONS}
            value={normalizeDetailedEvals(insp.detailedEvalRecommended)}
            multi
            columns={2}
            onChange={(v) => update({ detailedEvalRecommended: v as DetailedEval[] })}
          />
        </div>
      </Card>

      {/* Medidas de prevención */}
      <Card>
        <CardTitle>Medidas de prevención</CardTitle>
        <p className="mb-3 mt-1 text-sm text-slate-500">Marca las que apliquen.</p>
        <OptionGrid<PreventionMeasure>
          options={PREVENTION_MEASURE_OPTIONS}
          value={insp.preventionMeasures ?? []}
          multi
          columns={2}
          onChange={(v) => {
            const measures = v as PreventionMeasure[];
            update({
              preventionMeasures: measures,
              // Capa ATC-20 derivada: acordonar → barricadas.
              barricadesNeeded: measures.includes("acordonar") || measures.includes("cerrar_calles"),
            });
          }}
        />
      </Card>

      {/* Firmas de los inspectores (hasta 4, mínimo 1) */}
      <Card>
        <CardTitle>Inspectores y firmas</CardTitle>
        <p className="mb-3 mt-1 text-sm text-slate-500">
          La planilla admite hasta {MAX_INSPECTORS} inspectores. Cada uno debe firmar.
        </p>
        <div className="flex flex-col gap-4">
          {roster.map((person, idx) => (
            <div key={idx} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-slate-600">
                  {person.isLead ? "Inspector líder" : `Inspector ${idx + 1}`}
                </span>
                {!person.isLead && (
                  <Button variant="ghost" size="md" className="text-rojo" onClick={() => removePerson(idx)}>
                    Quitar
                  </Button>
                )}
              </div>
              <div className="mt-2 flex flex-col gap-2">
                <Field label="Nombre y apellido" required>
                  <PersonNameInput
                    value={person.fullName}
                    onChange={(v) => setPerson(idx, { fullName: v })}
                  />
                </Field>
                <Field label="Cédula de identidad" help="La planilla oficial la solicita por inspector.">
                  <PersonNameInput
                    value={person.nationalId ?? ""}
                    onChange={(v) => setPerson(idx, { nationalId: v })}
                    placeholder="V-12.345.678"
                    numeric
                  />
                </Field>
                <Field label="Firma" required>
                  <DrawCanvas
                    heightClass="h-32"
                    strokeWidth={2.5}
                    placeholder="Firma aquí"
                    initialDataUrl={person.signatureDataUrl}
                    onChange={(dataUrl) =>
                      setPerson(idx, {
                        signatureDataUrl: dataUrl,
                        signatureStoragePath: null,
                        signedAt: dataUrl ? new Date().toISOString() : null,
                      })
                    }
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
        {roster.length < MAX_INSPECTORS && (
          <Button variant="secondary" size="lg" fullWidth className="mt-3" onClick={addPerson}>
            + Agregar inspector
          </Button>
        )}
      </Card>

      {/* Nota oficial */}
      <p className="rounded-xl bg-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-600">
        {FUNVISIS_DISCLAIMER}
      </p>

      <StepIssuesList issues={issues} />

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

/** Input controlado local (no perder el cursor con el autoguardado). */
function PersonNameInput({
  value,
  onChange,
  placeholder = "Nombre del inspector",
  numeric = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  numeric?: boolean;
}) {
  const [text, setText] = useState(value);
  // Sincroniza si el prefill del perfil llega después del montaje (ajuste de
  // estado durante el render, patrón recomendado en vez de un effect).
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    if (value && !text) setText(value);
  }
  return (
    <TextInput
      value={text}
      inputMode={numeric ? "numeric" : undefined}
      onChange={(e) => {
        setText(e.target.value);
        onChange(e.target.value);
      }}
      placeholder={placeholder}
    />
  );
}
