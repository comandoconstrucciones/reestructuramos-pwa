"use client";
import { cn } from "@/lib/cn";

export function Toggle({
  checked,
  onChange,
  label,
  description,
  emphasis,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  emphasis?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "touch-target flex w-full items-center justify-between gap-3 rounded-xl border-2 p-3 text-left transition-colors",
        checked
          ? emphasis
            ? "border-amarillo bg-amber-50"
            : "border-brand bg-sky-50"
          : "border-slate-200 bg-white",
      )}
    >
      <span className="flex flex-col">
        <span className="text-base font-semibold text-ink">{label}</span>
        {description && <span className="text-sm text-slate-500">{description}</span>}
      </span>
      <span
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? (emphasis ? "bg-amarillo" : "bg-brand") : "bg-slate-300",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}
