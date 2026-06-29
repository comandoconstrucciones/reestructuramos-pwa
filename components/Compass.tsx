"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";

// Brújula: orientación (rumbo) de la cara/fachada dañada. iOS usa
// webkitCompassHeading; Android usa alpha (deviceorientationabsolute).

type Perm = "checking" | "need" | "granted" | "denied" | "unsupported";

interface OrientEvent extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

const DIRS = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];

export function Compass({ onCapture }: { onCapture?: (text: string) => void }) {
  const [perm, setPerm] = useState<Perm>("checking");
  const [heading, setHeading] = useState<number | null>(null);
  const [approx, setApprox] = useState(false);
  const nRef = useRef(0);

  useEffect(() => {
    const doe = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof window === "undefined" || typeof DeviceOrientationEvent === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPerm("unsupported");
      return;
    }
    setPerm(typeof doe.requestPermission === "function" ? "need" : "granted");
  }, []);

  useEffect(() => {
    if (perm !== "granted") return;
    let got = false;
    const handler = (e: OrientEvent) => {
      let h: number | null = null;
      if (typeof e.webkitCompassHeading === "number") {
        h = e.webkitCompassHeading;
      } else if (e.alpha != null) {
        h = (360 - e.alpha) % 360;
        if (!e.absolute) setApprox(true);
      }
      if (h == null) return;
      got = true;
      if (nRef.current++ % 3 === 0) setHeading((h + 360) % 360);
    };
    window.addEventListener("deviceorientationabsolute", handler as EventListener);
    window.addEventListener("deviceorientation", handler as EventListener);
    const t = setTimeout(() => {
      if (!got) setPerm("unsupported");
    }, 1800);
    return () => {
      window.removeEventListener("deviceorientationabsolute", handler as EventListener);
      window.removeEventListener("deviceorientation", handler as EventListener);
      clearTimeout(t);
    };
  }, [perm]);

  async function requestPerm() {
    try {
      const doe = DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> };
      setPerm((await doe.requestPermission()) === "granted" ? "granted" : "denied");
    } catch {
      setPerm("denied");
    }
  }

  if (perm === "unsupported") {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
        Este dispositivo no expone la brújula. Úsala en un teléfono (sobre HTTPS).
      </div>
    );
  }
  if (perm === "need") {
    return (
      <Button fullWidth onClick={requestPerm}>
        Activar brújula
      </Button>
    );
  }
  if (perm === "denied") {
    return (
      <div className="rounded-xl border border-rojo bg-red-50 p-3 text-sm text-rojo-ink">
        Permiso de orientación denegado. Actívalo en los ajustes del navegador.
      </div>
    );
  }

  const card = heading != null ? DIRS[Math.round(heading / 45) % 8] : "—";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-40 w-40 rounded-full border-4 border-slate-200">
        <div
          className="absolute inset-0 transition-transform"
          style={{ transform: `rotate(${heading != null ? -heading : 0}deg)` }}
        >
          <span className="absolute left-1/2 top-1 -translate-x-1/2 text-sm font-bold text-rojo">N</span>
          <span className="absolute left-1/2 bottom-1 -translate-x-1/2 text-sm font-semibold text-slate-500">S</span>
          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">E</span>
          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">O</span>
          <div className="absolute left-1/2 top-1/2 h-16 w-1 -translate-x-1/2 -translate-y-full rounded bg-rojo" />
        </div>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-brand">
          <Icon name="compass" size={26} />
        </span>
      </div>

      <div className="text-center">
        <div className="font-data text-4xl font-bold text-ink">
          {heading != null ? `${Math.round(heading)}°` : "—"}
        </div>
        <div className="text-sm font-semibold text-brand">{card}</div>
      </div>

      {onCapture && heading != null && (
        <Button
          size="md"
          onClick={() => onCapture(`Orientación de la cara: ${card} (${Math.round(heading)}°)`)}
        >
          <Icon name="check" size={18} /> Usar orientación
        </Button>
      )}

      <p className="text-center text-[11px] leading-snug text-slate-400">
        {approx ? "Lectura aproximada (orientación relativa). " : ""}
        Calíbrala moviendo el teléfono en forma de 8. Aléjate de metal/imanes.
      </p>
    </div>
  );
}
