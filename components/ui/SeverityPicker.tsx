"use client";
import { cn } from "@/lib/cn";
import { SEVERITY_OPTIONS } from "@/lib/catalog";
import type { Severity } from "@/lib/types";

export function SeverityPicker({
  value,
  onChange,
}: {
  value: Severity | undefined;
  onChange: (s: Severity) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5" role="radiogroup">
      {SEVERITY_OPTIONS.map((opt) => {
        const isSel = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSel}
            onClick={() => onChange(opt.value)}
            className={cn(
              "touch-target flex flex-col items-center justify-center rounded-xl border-2 px-1 py-2 text-center",
              isSel ? "text-white" : "bg-white text-ink",
            )}
            style={
              isSel
                ? { backgroundColor: opt.color, borderColor: opt.color }
                : { borderColor: opt.color }
            }
          >
            <span className="break-words text-xs font-bold leading-tight">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
