"use client";
import { useEffect } from "react";

// Mantiene la pantalla encendida mientras `active` es true (p.ej. durante una
// inspección en campo). Se re-adquiere al volver a primer plano. No-op si el
// navegador no soporta Screen Wake Lock.

type WakeLockSentinel = { release: () => Promise<void> };
type NavWithWakeLock = Navigator & {
  wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinel> };
};

export function useWakeLock(active: boolean): void {
  useEffect(() => {
    if (!active || typeof navigator === "undefined") return;
    const nav = navigator as NavWithWakeLock;
    if (!nav.wakeLock) return;

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    const request = async () => {
      try {
        const s = await nav.wakeLock!.request("screen");
        if (cancelled) {
          void s.release();
        } else {
          sentinel = s;
        }
      } catch {
        /* denegado o no disponible */
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") void request();
    };

    void request();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      try {
        void sentinel?.release();
      } catch {
        /* ya liberado */
      }
    };
  }, [active]);
}
