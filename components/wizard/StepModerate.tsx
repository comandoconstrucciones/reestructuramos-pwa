"use client";
// Paso 4 — Riesgo estructural por daño Moderado (planilla FUNVISIS, Sección 4).
// Conteos por tipo de elemento con % en vivo; el riesgo se califica con el
// MAYOR % entre los tipos. Si no se pudo cuantificar, estimación manual.
// Integra hallazgos + fotos con fisurómetro digital (crack_width_mm).
import { useState } from "react";
import { Card, CardTitle, Field, TextInput } from "@/components/ui";
import { PhotoCapture } from "@/components/PhotoCapture";
import { cn } from "@/lib/cn";
import { ELEMENT_COUNT_LABELS } from "@/lib/funvisis/catalog";
import {
  criterionForElementType,
  maxPctModerate,
  pctModerate,
  scoreModerate,
  suggestGradeFromCrackWidth,
  type DamageGrade,
} from "@/lib/funvisis/scoring";
import { ELEMENT_COUNT_TYPES, type ElementCount, type ElementCountType } from "@/lib/funvisis/types";
import { newId } from "@/lib/id";
import type { Finding, Severity } from "@/lib/types";
import type { StepProps } from "./types";
import { RiskChip } from "./funvisis-ui";
import { Stepper } from "./Stepper";

const GRADE_LABELS: Record<DamageGrade, string> = {
  sin_dano_leve: "Sin daño / Leve",
  moderado: "Moderado",
  severo_completo: "Severo/Completo",
};
const GRADE_TO_SEVERITY: Record<DamageGrade, Severity> = {
  sin_dano_leve: "leve",
  moderado: "moderado",
  severo_completo: "severo",
};
const GRADE_STYLES: Record<DamageGrade, string> = {
  sin_dano_leve: "bg-green-100 text-green-800",
  moderado: "bg-amber-100 text-amber-800",
  severo_completo: "bg-red-100 text-red-800",
};

function countFor(list: ElementCount[] | undefined, type: ElementCountType): ElementCount {
  return (
    list?.find((c) => c.elementType === type) ?? { elementType: type, nNoMinor: 0, nModerate: 0 }
  );
}

export function StepModerate({ insp, update }: StepProps) {
  const counts = insp.elementCounts ?? [];
  const maxPct = maxPctModerate(counts);
  const hasCounts = maxPct !== null;
  const result = scoreModerate(counts, insp.moderatePctEstimated);
  const [estimate, setEstimate] = useState(
    insp.moderatePctEstimated != null ? String(insp.moderatePctEstimated) : "",
  );

  function setCount(type: ElementCountType, patch: Partial<ElementCount>) {
    update((cur) => {
      const list = cur.elementCounts ?? [];
      const existing = countFor(list, type);
      const next = { ...existing, ...patch };
      return {
        elementCounts: [...list.filter((c) => c.elementType !== type), next].sort(
          (a, b) =>
            ELEMENT_COUNT_TYPES.indexOf(a.elementType) - ELEMENT_COUNT_TYPES.indexOf(b.elementType),
        ),
      };
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Cuenta los miembros del <strong>piso crítico</strong> por tipo de elemento.
        </p>
        <RiskChip risk={result.risk} />
      </div>

      {/* Grid de conteos por tipo de elemento */}
      {ELEMENT_COUNT_TYPES.map((type) => {
        const row = countFor(counts, type);
        const examined = row.nNoMinor + row.nModerate;
        const pct = pctModerate(row);
        const isMax = hasCounts && examined > 0 && pct === maxPct;
        return (
          <Card key={type} className={cn(isMax && "ring-2 ring-brand")}>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base">{ELEMENT_COUNT_LABELS[type]}</CardTitle>
              <span
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-sm font-bold tabular-nums",
                  examined === 0
                    ? "bg-slate-100 text-slate-400"
                    : pct > 30
                      ? "bg-red-100 text-red-800"
                      : pct >= 10
                        ? "bg-amber-100 text-amber-800"
                        : "bg-green-100 text-green-800",
                )}
              >
                {examined === 0 ? "—" : `${pct}%`}
                {isMax && " ★"}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Sin daño / menor">
                <Stepper
                  value={row.nNoMinor}
                  onChange={(v) => setCount(type, { nNoMinor: v })}
                  max={999}
                />
              </Field>
              <Field label="Con daño Moderado">
                <Stepper
                  value={row.nModerate}
                  onChange={(v) => setCount(type, { nModerate: v })}
                  max={999}
                />
              </Field>
            </div>
            <FisurometroBlock insp={insp} update={update} type={type} />
          </Card>
        );
      })}

      {hasCounts ? (
        <p className="rounded-xl bg-sky-50 px-3 py-2 text-sm font-medium text-brand-ink">
          % máximo de daño Moderado: <strong>{maxPct}%</strong> (★). Con este valor se califica la
          sección: &lt;10% → A · 10–30% → B · &gt;30% → C.
        </p>
      ) : (
        <Card>
          <CardTitle className="text-base">¿No fue posible cuantificar?</CardTitle>
          <p className="mb-3 mt-0.5 text-sm text-slate-500">
            Si no pudiste contar miembros, registra tu estimación del % de elementos con daño
            Moderado en el piso crítico.
          </p>
          <Field label="Estimación manual (%)">
            <TextInput
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              value={estimate}
              onChange={(e) => {
                setEstimate(e.target.value);
                const n = parseFloat(e.target.value);
                update({ moderatePctEstimated: Number.isFinite(n) ? n : null });
              }}
              placeholder="p. ej. 15"
            />
          </Field>
        </Card>
      )}
    </div>
  );
}

/** Fisurómetro digital: ancho de grieta (mm) → sugerencia de severidad según
 *  DAMAGE_CRITERIA (solo sugiere; el inspector confirma al registrar el
 *  hallazgo) + evidencia fotográfica ligada al hallazgo. */
function FisurometroBlock({
  insp,
  update,
  type,
}: Pick<StepProps, "insp" | "update"> & { type: ElementCountType }) {
  const [open, setOpen] = useState(false);
  const [widthMm, setWidthMm] = useState("");

  const steel = insp.building.material === "acero";
  const criterion = criterionForElementType(type, steel);
  const width = parseFloat(widthMm);
  const grade = Number.isFinite(width) ? suggestGradeFromCrackWidth(type, width, steel) : null;

  const finding = insp.findings.find((f) => f.category === "estructural" && f.element === type);

  function recordFinding(g: DamageGrade) {
    update((cur) => {
      const findings = [...cur.findings];
      const idx = findings.findIndex((f) => f.category === "estructural" && f.element === type);
      const notes = `Grieta de ${width} mm (fisurómetro) · ${GRADE_LABELS[g]}`;
      if (idx >= 0) {
        findings[idx] = { ...findings[idx], severity: GRADE_TO_SEVERITY[g], notes };
      } else {
        const f: Finding = {
          id: newId(),
          category: "estructural",
          element: type,
          severity: GRADE_TO_SEVERITY[g],
          notes,
          photoIds: [],
        };
        findings.push(f);
      }
      return { findings };
    });
  }

  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <button
        type="button"
        className="text-sm font-semibold text-brand underline"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Ocultar fisurómetro" : "Fisurómetro digital + evidencia"}
      </button>
      {open && (
        <div className="mt-2 flex flex-col gap-2">
          <p className="text-xs text-slate-500">
            Criterio ({criterion.label}): {criterion.sinDanoLeve} · Moderado: {criterion.moderado}
          </p>
          {criterion.crackThresholdsMm ? (
            <>
              <Field label="Ancho de grieta medido (mm)">
                <TextInput
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min={0}
                  value={widthMm}
                  onChange={(e) => setWidthMm(e.target.value)}
                  placeholder="p. ej. 1.5"
                />
              </Field>
              {grade && (
                <div className="flex items-center gap-2">
                  <span className={cn("rounded-full px-3 py-1 text-sm font-bold", GRADE_STYLES[grade])}>
                    Sugerencia: {GRADE_LABELS[grade]}
                  </span>
                  <button
                    type="button"
                    className="touch-target rounded-xl border border-brand px-3 text-sm font-semibold text-brand active:bg-sky-50"
                    onClick={() => recordFinding(grade)}
                  >
                    Confirmar y registrar
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-slate-500">
              En acero el criterio no es por grietas: evalúa pandeo/fractura visualmente.
            </p>
          )}
          {finding && (
            <div className="mt-1">
              <p className="mb-1 text-xs font-semibold text-slate-600">
                Hallazgo registrado ({finding.notes ?? finding.severity}). Adjunta evidencia:
              </p>
              <PhotoCapture inspectionClientUuid={insp.clientUuid} findingId={finding.id} compact />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
