"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui";

/**
 * Lienzo de dibujo a mano alzada (firma o croquis). Offline, sin dependencias.
 * Emite el contenido como dataURL PNG en cada trazo terminado; null al limpiar.
 */
export function DrawCanvas({
  heightClass = "h-40",
  strokeWidth = 2.5,
  initialDataUrl,
  placeholder,
  onChange,
  className,
}: {
  heightClass?: string;
  strokeWidth?: number;
  initialDataUrl?: string | null;
  placeholder?: string;
  onChange: (dataUrl: string | null) => void;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [empty, setEmpty] = useState(!initialDataUrl);

  // Ajusta el tamaño interno al CSS (nitidez en pantallas retina) y restaura
  // el contenido inicial si existe.
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = c.getBoundingClientRect();
    c.width = Math.round(rect.width * dpr);
    c.height = Math.round(rect.height * dpr);
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = "#0f172a";
    if (initialDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setEmpty(false);
      };
      img.src = initialDataUrl;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const point = useCallback((e: React.PointerEvent) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  function start(e: React.PointerEvent) {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    drawing.current = true;
    canvasRef.current?.setPointerCapture(e.pointerId);
    const p = point(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    // Punto inicial visible aunque el trazo sea un toque.
    ctx.lineTo(p.x + 0.1, p.y + 0.1);
    ctx.stroke();
    setEmpty(false);
  }

  function move(e: React.PointerEvent) {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = point(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  function end() {
    if (!drawing.current) return;
    drawing.current = false;
    const c = canvasRef.current;
    if (c) onChange(c.toDataURL("image/png"));
  }

  function clear() {
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    setEmpty(true);
    onChange(null);
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className={cn("relative w-full overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-white", heightClass)}>
        {empty && placeholder && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-slate-400">
            {placeholder}
          </span>
        )}
        <canvas
          ref={canvasRef}
          className="h-full w-full touch-none"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onPointerLeave={end}
        />
      </div>
      <Button variant="ghost" size="md" onClick={clear} className="self-end text-slate-500">
        Limpiar
      </Button>
    </div>
  );
}
