"use client";
import { WIZARD_STEPS, WIZARD_TOTAL } from "./types";

/** Barra de progreso del asistente (paso actual de N). */
export function WizardProgress({ step }: { step: number }) {
  const current = Math.min(WIZARD_TOTAL, Math.max(1, step + 1));
  const pct = (current / WIZARD_TOTAL) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between text-sm font-semibold">
        <span className="text-slate-500">
          Paso {current} de {WIZARD_TOTAL}
        </span>
        <span className="text-brand">{WIZARD_STEPS[step] ?? ""}</span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={WIZARD_TOTAL}
        aria-label={`Progreso: paso ${current} de ${WIZARD_TOTAL}`}
      >
        <div
          className="h-full rounded-full bg-brand transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
