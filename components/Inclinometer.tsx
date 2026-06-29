"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";

// Nivel / plomada usando el acelerómetro del teléfono (DeviceMotion).
// Mide el desplome de columnas/muros respecto a la vertical (plomada) o la
// inclinación de vigas/pisos respecto a la horizontal (nivel). Indicador de
// apoyo al criterio, NO una medición pericial.

type Mode = "plomada" | "nivel";
type Perm = "checking" | "need" | "granted" | "denied" | "unsupported";
type Vec = [number, number, number];

const IDEAL: Record<Mode, Vec> = {
  plomada: [0, -1, 0], // teléfono en vertical (portrait), pegado a la cara de la columna
  nivel: [0, 0, 1], // teléfono acostado, pantalla hacia arriba
};

function norm(v: Vec): Vec {
  const m = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / m, v[1] / m, v[2] / m];
}
function dot(a: Vec, b: Vec) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function Inclinometer({ onCapture }: { onCapture?: (text: string) => void }) {
  const [perm, setPerm] = useState<Perm>("checking");
  const [mode, setMode] = useState<Mode>("plomada");
  const [angle, setAngle] = useState(0);
  const [bubble, setBubble] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tared, setTared] = useState(false);

  const gRef = useRef<Vec>([0, -1, 0]); // gravedad suavizada
  const tareRef = useRef<Vec | null>(null);
  const modeRef = useRef<Mode>(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const dm =
      typeof DeviceMotionEvent !== "undefined"
        ? (DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> })
        : null;
    // Detección de capacidad una sola vez al montar (sync con el dispositivo).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPerm(!dm ? "unsupported" : typeof dm.requestPermission === "function" ? "need" : "granted");
  }, []);

  useEffect(() => {
    if (perm !== "granted") return;
    let n = 0;
    let got = false;
    const handler = (e: DeviceMotionEvent) => {
      const a = e.accelerationIncludingGravity;
      if (!a || a.x == null || a.y == null || a.z == null) return;
      got = true;
      const s = gRef.current;
      gRef.current = [s[0] * 0.85 + a.x * 0.15, s[1] * 0.85 + a.y * 0.15, s[2] * 0.85 + a.z * 0.15];
      if (n++ % 3 !== 0) return;
      const g = norm(gRef.current);
      const ref = tareRef.current ?? IDEAL[modeRef.current];
      setAngle((Math.acos(Math.max(-1, Math.min(1, dot(g, ref)))) * 180) / Math.PI);
      // burbuja: componente de g perpendicular a la referencia
      const d = dot(g, ref);
      const perp: Vec = [g[0] - d * ref[0], g[1] - d * ref[1], g[2] - d * ref[2]];
      const y = modeRef.current === "nivel" ? perp[1] : perp[2];
      setBubble({ x: Math.max(-1, Math.min(1, perp[0] * 2.2)), y: Math.max(-1, Math.min(1, y * 2.2)) });
    };
    window.addEventListener("devicemotion", handler);
    // Si en 1.5s no llegó ningún dato, el dispositivo no expone el sensor.
    const t = setTimeout(() => {
      if (!got) setPerm("unsupported");
    }, 1500);
    return () => {
      window.removeEventListener("devicemotion", handler);
      clearTimeout(t);
    };
  }, [perm]);

  async function requestPerm() {
    try {
      const dm = DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> };
      const res = await dm.requestPermission();
      setPerm(res === "granted" ? "granted" : "denied");
    } catch {
      setPerm("denied");
    }
  }

  function toggleTare() {
    if (tared) {
      tareRef.current = null;
      setTared(false);
    } else {
      tareRef.current = norm(gRef.current);
      setTared(true);
    }
  }

  const color = angle < 1 ? "#16a34a" : angle <= 3 ? "#d97706" : "#dc2626";
  const label =
    mode === "plomada"
      ? angle < 1
        ? "A plomo"
        : angle <= 3
          ? "Desplome leve"
          : "Fuera de plomo"
      : angle < 1
        ? "Nivelado"
        : angle <= 3
          ? "Ligera inclinación"
          : "Inclinación marcada";

  if (perm === "unsupported") {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        Este dispositivo o navegador no expone los sensores de movimiento. Usa un teléfono
        (Chrome/Safari) sobre HTTPS para medir la inclinación.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Selector de modo */}
      <div className="grid w-full grid-cols-2 gap-2">
        {(["plomada", "nivel"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={cn(
              "touch-target rounded-xl border-2 px-3 py-2 text-sm font-semibold",
              mode === m ? "border-brand bg-sky-50 text-brand" : "border-slate-200 bg-white text-ink",
            )}
          >
            {m === "plomada" ? "Plomada (vertical)" : "Nivel (horizontal)"}
          </button>
        ))}
      </div>

      {perm === "need" ? (
        <Button onClick={requestPerm} fullWidth>
          Activar sensor de inclinación
        </Button>
      ) : perm === "denied" ? (
        <div className="rounded-xl border border-rojo bg-red-50 p-3 text-sm text-rojo-ink">
          Permiso del sensor denegado. Actívalo en los ajustes del navegador para medir.
        </div>
      ) : perm === "granted" ? (
        <>
          {/* Burbuja de nivel */}
          <div className="relative h-40 w-40 rounded-full border-4" style={{ borderColor: color }}>
            <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200" />
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-200" />
            <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-slate-200" />
            <div
              className="absolute h-7 w-7 rounded-full shadow-md transition-transform"
              style={{
                backgroundColor: color,
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${bubble.x * 56}px), calc(-50% + ${-bubble.y * 56}px))`,
              }}
            />
          </div>

          {/* Lectura grande */}
          <div className="text-center">
            <div className="font-data text-5xl font-bold leading-none" style={{ color }}>
              {angle.toFixed(1)}°
            </div>
            <div className="mt-1 text-sm font-semibold" style={{ color }}>
              {label}
            </div>
          </div>

          <p className="text-center text-xs text-slate-500">
            {mode === "plomada"
              ? "Apoya el teléfono en VERTICAL contra la cara de la columna o muro."
              : "Acuesta el teléfono sobre la superficie (viga, piso, alféizar)."}
          </p>

          <div className="grid w-full grid-cols-2 gap-2">
            <Button variant="secondary" size="md" onClick={toggleTare}>
              {tared ? "Quitar cero" : "Poner a cero"}
            </Button>
            {onCapture ? (
              <Button
                size="md"
                onClick={() =>
                  onCapture(
                    `${mode === "plomada" ? "Desplome" : "Inclinación"} medido: ${angle.toFixed(1)}°`,
                  )
                }
              >
                <Icon name="check" size={18} /> Usar medición
              </Button>
            ) : (
              <div />
            )}
          </div>

          <p className="text-center text-[11px] leading-snug text-slate-400">
            Indicador de apoyo al criterio (±0.5–1°), no es una medición pericial. Para mayor
            precisión, calibra con “Poner a cero” contra una referencia conocida.
          </p>
        </>
      ) : (
        <p className="py-8 text-center text-sm text-slate-500">Preparando sensor…</p>
      )}
    </div>
  );
}
