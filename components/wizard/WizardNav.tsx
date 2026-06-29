"use client";
import { Button } from "@/components/ui";

/** Botones grandes Atrás / Siguiente, anclados al pie. */
export function WizardNav({
  canBack,
  canNext,
  onBack,
  onNext,
  hideNext,
  nextLabel = "Siguiente ›",
  hint,
}: {
  canBack: boolean;
  canNext: boolean;
  onBack: () => void;
  onNext: () => void;
  hideNext?: boolean;
  nextLabel?: string;
  hint?: string;
}) {
  return (
    <div
      className="sticky bottom-0 z-20 flex flex-col gap-2 bg-slate-canvas pt-3"
      style={{ paddingBottom: "calc(var(--safe-bottom) + 0.75rem)" }}
    >
      {hint && !canNext && !hideNext && (
        <p className="text-center text-sm font-medium text-amarillo-ink">{hint}</p>
      )}
      <div className="flex gap-3 border-t border-slate-200 pt-3">
        <Button
          variant="secondary"
          size="lg"
          onClick={onBack}
          disabled={!canBack}
          className="flex-1"
        >
          ‹ Atrás
        </Button>
        {!hideNext && (
          <Button
            variant="primary"
            size="lg"
            onClick={onNext}
            disabled={!canNext}
            className="flex-[2]"
          >
            {nextLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
