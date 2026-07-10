"use client";
// Piezas de UI compartidas por los pasos FUNVISIS del asistente.

import { cn } from "@/lib/cn";
import { tap } from "@/lib/haptics";
import { RISK_LABELS } from "@/lib/funvisis/catalog";
import type { AspectLevel, RiskLevel } from "@/lib/funvisis/types";

export const RISK_STYLES: Record<RiskLevel, { bg: string; ink: string; border: string }> = {
  A: { bg: "bg-green-100", ink: "text-green-800", border: "border-green-300" },
  B: { bg: "bg-amber-100", ink: "text-amber-800", border: "border-amber-300" },
  C: { bg: "bg-red-100", ink: "text-red-800", border: "border-red-300" },
};

/** Chip A/B/C con semáforo. */
export function RiskChip({ risk, size = "md" }: { risk: RiskLevel | null | undefined; size?: "md" | "lg" }) {
  if (!risk) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-500">
        Sin calificar
      </span>
    );
  }
  const s = RISK_STYLES[risk];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-bold",
        s.bg,
        s.ink,
        s.border,
        size === "lg" ? "px-4 py-1.5 text-base" : "px-3 py-1 text-sm",
      )}
    >
      {RISK_LABELS[risk]}
    </span>
  );
}

const LEVEL_STYLES: Record<AspectLevel, string> = {
  a: "border-green-500 bg-green-50 text-green-900",
  b: "border-amber-500 bg-amber-50 text-amber-900",
  c: "border-red-500 bg-red-50 text-red-900",
};

/** Grupo de radios de un aspecto/componente con nivel a/b/c visible. */
export function LevelRadioGroup<T extends string>({
  options,
  value,
  onChange,
  columns = 1,
}: {
  options: { value: T; label: string; level: AspectLevel }[];
  value: T | undefined;
  onChange: (v: T) => void;
  columns?: 1 | 2 | 3;
}) {
  return (
    <div
      role="radiogroup"
      className={cn("grid gap-2", columns === 2 && "grid-cols-2", columns === 3 && "grid-cols-3")}
    >
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => {
              onChange(opt.value);
              tap();
            }}
            className={cn(
              "touch-target flex items-center justify-between gap-2 rounded-xl border-2 px-3 py-3 text-left transition-colors",
              selected ? LEVEL_STYLES[opt.level] : "border-slate-200 bg-white active:bg-slate-50",
            )}
          >
            <span className="text-base font-semibold">{opt.label}</span>
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-extrabold uppercase",
                selected ? "bg-white/70" : "bg-slate-100 text-slate-500",
              )}
            >
              {opt.level}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Banner rojo de REGLA DE CORTE (riesgo C → saltar a Decisión final). */
export function CutBanner({ title, detail }: { title: string; detail: string }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border-2 border-red-600 bg-red-600 px-4 py-3 text-white shadow-lg"
    >
      <p className="text-base font-extrabold uppercase tracking-wide">{title}</p>
      <p className="mt-1 text-sm font-medium">{detail}</p>
    </div>
  );
}

/** Lista de errores de validación del paso (zod). */
export function StepIssuesList({ issues }: { issues: string[] }) {
  if (issues.length === 0) return null;
  return (
    <div className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-rojo-ink">
      <p>Para continuar:</p>
      <ul className="mt-1 list-disc pl-5">
        {issues.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
