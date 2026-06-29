"use client";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Marco a pantalla completa para el flujo de primera vez (inducción + quiz +
 * registro). Barra de progreso arriba, botón "Saltar" opcional, contenido
 * desplazable y una franja de acciones fija abajo. No usa AppShell porque el
 * onboarding no debe mostrar la navegación inferior.
 */
export function OnboardingShell({
  progress,
  onSkip,
  skipLabel = "Saltar",
  children,
  footer,
}: {
  progress: number; // 0..1
  onSkip?: () => void;
  skipLabel?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const pct = Math.round(Math.max(0, Math.min(1, progress)) * 100);
  return (
    <div className="flex min-h-dvh flex-col bg-slate-canvas">
      <header
        className="sticky top-0 z-20 flex items-center gap-3 bg-slate-canvas px-4 pb-3"
        style={{ paddingTop: "calc(var(--safe-top) + 0.75rem)" }}
      >
        <div
          className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-label="Progreso de la inducción"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        >
          <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
        </div>
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="touch-target -mr-2 flex items-center justify-center px-2 text-base font-semibold text-slate-500"
          >
            {skipLabel}
          </button>
        )}
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-6">{children}</main>

      {footer && (
        <footer
          className="sticky bottom-0 border-t border-slate-200 bg-white px-4 pt-3"
          style={{ paddingBottom: "calc(var(--safe-bottom) + 0.75rem)" }}
        >
          {footer}
        </footer>
      )}
    </div>
  );
}
