"use client";
import { cn } from "@/lib/cn";
import type { Option } from "@/lib/types";

/** Rejilla de botones grandes para selección única o múltiple (mínima escritura). */
export function OptionGrid<T extends string>({
  options,
  value,
  onChange,
  multi = false,
  columns = 1,
}: {
  options: Option<T>[];
  value: T | T[] | undefined;
  onChange: (value: T | T[]) => void;
  multi?: boolean;
  columns?: 1 | 2 | 3;
}) {
  const selected = (v: T) => (Array.isArray(value) ? value.includes(v) : value === v);

  const toggle = (v: T) => {
    if (multi) {
      const arr = Array.isArray(value) ? value : [];
      onChange(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    } else {
      onChange(v);
    }
  };

  return (
    <div className={cn("grid gap-2", columns === 2 && "grid-cols-2", columns === 3 && "grid-cols-3")}>
      {options.map((opt) => {
        const isSel = selected(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={isSel}
            onClick={() => toggle(opt.value)}
            className={cn(
              "touch-target flex flex-col items-start rounded-xl border-2 p-3 text-left transition-colors",
              isSel ? "border-brand bg-sky-50" : "border-slate-200 bg-white active:bg-slate-50",
            )}
          >
            <span className="text-base font-semibold text-ink">{opt.label}</span>
            {opt.description && <span className="text-sm text-slate-500">{opt.description}</span>}
          </button>
        );
      })}
    </div>
  );
}
