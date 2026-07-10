"use client";
// Paso 3 — Piso crítico y daño Severo/Completo (planilla FUNVISIS, Sección 3).
// N = suma de miembros con daño Severo/Completo. N ≥ 1 → REGLA DE CORTE:
// etiqueta roja y salto al paso 6 (se omiten las secciones 4 y 5).
import { useState } from "react";
import { Card, CardTitle, Field, OptionGrid, TextInput } from "@/components/ui";
import { ACCESS_MEMBERS_OPTIONS, SEVERE_COUNTER_DEFS } from "@/lib/funvisis/catalog";
import { DAMAGE_CRITERIA } from "@/lib/funvisis/scoring";
import type { AccessMembers } from "@/lib/funvisis/types";
import type { StepProps } from "./types";
import { CutBanner } from "./funvisis-ui";
import { Stepper } from "./Stepper";

export function StepSevere({ insp, update }: StepProps) {
  const [floors, setFloors] = useState(insp.floorsInspected ?? "");
  const [critical, setCritical] = useState(insp.criticalFloor ?? "");
  const [showCriteria, setShowCriteria] = useState(false);

  const n =
    (insp.nSevereColumns ?? 0) +
    (insp.nSevereConcreteWalls ?? 0) +
    (insp.nSevereMasonryWalls ?? 0) +
    (insp.nSevereBeams ?? 0);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-500">
        Recorre la edificación, identifica el <strong>piso crítico</strong> (el más dañado) y
        cuenta los miembros con daño <strong>Severo/Completo</strong>.
      </p>

      <Card>
        <div className="flex flex-col gap-3">
          <Field label="Pisos inspeccionados" required help="p. ej. «PB, 1 al 4» o «todos».">
            <TextInput
              value={floors}
              onChange={(e) => {
                setFloors(e.target.value);
                update({ floorsInspected: e.target.value });
              }}
              placeholder="Pisos recorridos"
            />
          </Field>
          <Field label="Piso crítico" required help="El nivel con el daño más grave.">
            <TextInput
              value={critical}
              onChange={(e) => {
                setCritical(e.target.value);
                update({ criticalFloor: e.target.value });
              }}
              placeholder="p. ej. PB"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <CardTitle className="text-base">Acceso a los miembros estructurales</CardTitle>
        <p className="mb-3 mt-0.5 text-sm text-slate-500">
          ¿A cuántos miembros del piso crítico se pudo acceder para revisarlos?
        </p>
        <OptionGrid<AccessMembers>
          options={ACCESS_MEMBERS_OPTIONS}
          value={insp.accessMembers}
          onChange={(v) => update({ accessMembers: v as AccessMembers })}
          columns={2}
        />
      </Card>

      <Card>
        <CardTitle className="text-base">Miembros con daño Severo/Completo</CardTitle>
        <button
          type="button"
          className="mt-1 text-sm font-semibold text-brand underline"
          onClick={() => setShowCriteria((v) => !v)}
        >
          {showCriteria ? "Ocultar criterios" : "¿Qué cuenta como Severo/Completo?"}
        </button>
        {showCriteria && (
          <ul className="mt-2 space-y-1 rounded-xl bg-sky-50 p-3 text-xs text-slate-600">
            {DAMAGE_CRITERIA.map((c) => (
              <li key={c.element}>
                <strong>{c.label}:</strong> {c.severoCompleto}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex flex-col gap-4">
          {SEVERE_COUNTER_DEFS.map((def) => (
            <Field key={def.key} label={def.label}>
              <Stepper
                value={insp[def.key] ?? 0}
                onChange={(v) => update({ [def.key]: v })}
                max={500}
              />
            </Field>
          ))}
        </div>
      </Card>

      {n >= 1 && (
        <CutBanner
          title={`Daño Severo/Completo en ${n} miembro${n === 1 ? "" : "s"} — riesgo Alto`}
          detail="La planilla ordena calificar riesgo C: etiqueta roja (PELIGRO). Al tocar «Siguiente» pasarás directo a la Decisión final (las secciones 4 y 5 se omiten)."
        />
      )}
    </div>
  );
}
