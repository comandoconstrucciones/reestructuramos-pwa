"use client";
// Paso 5 — Componentes no estructurales (planilla FUNVISIS, Sección 5).
// Cinco componentes calificados a/b/c. «Fuga de gas» fuerza los servicios a c
// y muestra la advertencia de seguridad.
import { Card, CardTitle, Toggle } from "@/components/ui";
import { COMPONENT_DEFS } from "@/lib/funvisis/catalog";
import { scoreComponents } from "@/lib/funvisis/scoring";
import type { AspectLevel } from "@/lib/funvisis/types";
import type { Inspection } from "@/lib/types";
import type { StepProps } from "./types";
import { LevelRadioGroup, RiskChip } from "./funvisis-ui";

export function StepComponents({ insp, update }: StepProps) {
  const risk = scoreComponents(insp);
  const gasLeak = insp.gasLeak ?? false;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Califica cada componente: a, b o c.</p>
        <RiskChip risk={risk} />
      </div>

      {COMPONENT_DEFS.map((def) => {
        const isUtilities = def.key === "compUtilities";
        const forced = isUtilities && gasLeak;
        return (
          <Card key={def.key}>
            <CardTitle className="text-base">{def.title}</CardTitle>
            {forced && (
              <p className="mb-2 mt-1 rounded-lg bg-red-50 px-3 py-1.5 text-sm font-semibold text-rojo-ink">
                Forzado a «c» por fuga de gas.
              </p>
            )}
            <div className="mt-2">
              <LevelRadioGroup<AspectLevel>
                options={(["a", "b", "c"] as const).map((level) => ({
                  value: level,
                  label: def.levels[level],
                  level,
                }))}
                value={forced ? "c" : insp[def.key]}
                onChange={(v) => {
                  if (forced) return; // con fuga de gas el nivel queda fijado en c
                  update({ [def.key]: v } as Partial<Inspection>);
                }}
              />
            </div>
            {isUtilities && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <Toggle
                  checked={gasLeak}
                  // Al activar, fija también el nivel persistido en 'c' (la BD y
                  // el CSV deben reflejar el forzado, no solo la UI).
                  onChange={(v) => update(v ? { gasLeak: true, compUtilities: "c" } : { gasLeak: false })}
                  label="Fuga de gas detectada"
                  description="Olor a gas o fuga visible en la edificación."
                  emphasis
                />
                {gasLeak && (
                  <div
                    role="alert"
                    className="mt-2 rounded-xl border-2 border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-rojo-ink"
                  >
                    ⚠️ Seguridad: cierra la llave de paso o la fuente de gas si es seguro hacerlo,
                    notifica a los bomberos y desaloja la edificación. No acciones interruptores ni
                    produzcas chispas.
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
