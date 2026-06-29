"use client";
import { Button } from "@/components/ui";

/** Contador numérico táctil (− valor +). Mínima escritura para el campo. */
export function Stepper({
  value,
  onChange,
  min = 0,
  max = 200,
  suffix,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  return (
    <div className="flex items-center gap-3">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        aria-label="Disminuir"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        className="w-16 text-2xl"
      >
        −
      </Button>
      <span className="min-w-16 text-center text-2xl font-bold tabular-nums text-ink">
        {value}
        {suffix && <span className="ml-1 text-base font-medium text-slate-500">{suffix}</span>}
      </span>
      <Button
        type="button"
        variant="secondary"
        size="lg"
        aria-label="Aumentar"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        className="w-16 text-2xl"
      >
        +
      </Button>
    </div>
  );
}
