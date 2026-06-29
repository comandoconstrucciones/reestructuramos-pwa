"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Button } from "./ui/Button";

// Mide el ancho de una grieta usando un objeto de escala conocido (p.ej. el
// borde de una tarjeta). El usuario marca 2 puntos sobre la referencia y 2
// sobre la grieta; el ancho = (px_grieta / px_referencia) * mm_referencia.

type Pt = { x: number; y: number };
type Seg = "ref" | "crack";

const REFS = [
  { id: "card-long", label: "Tarjeta — borde largo (85.6 mm)", mm: 85.6 },
  { id: "card-short", label: "Tarjeta — borde corto (54 mm)", mm: 53.98 },
  { id: "custom", label: "Personalizado…", mm: 0 },
];

function dist(a: Pt, b: Pt) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function CrackMeasure({
  src,
  onCancel,
  onSave,
}: {
  src: Blob;
  onCancel: () => void;
  onSave: (widthMm: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [active, setActive] = useState<Seg>("ref");
  const [refPts, setRefPts] = useState<Pt[]>([]);
  const [crackPts, setCrackPts] = useState<Pt[]>([]);
  const [refId, setRefId] = useState("card-long");
  const [customMm, setCustomMm] = useState("");

  const refMm = refId === "custom" ? parseFloat(customMm) || 0 : REFS.find((r) => r.id === refId)!.mm;
  const width =
    refPts.length === 2 && crackPts.length === 2 && refMm > 0
      ? (dist(crackPts[0], crackPts[1]) / dist(refPts[0], refPts[1])) * refMm
      : null;

  useEffect(() => {
    const url = URL.createObjectURL(src);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      fit();
      draw();
    };
    img.onerror = () => {};
    img.src = url;
    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  function fit() {
    const c = canvasRef.current,
      img = imgRef.current;
    if (!c || !img) return;
    const maxW = Math.min(window.innerWidth - 16, 900);
    const s = maxW / img.naturalWidth;
    c.width = Math.round(img.naturalWidth * s);
    c.height = Math.round(img.naturalHeight * s);
  }

  function draw() {
    const c = canvasRef.current,
      img = imgRef.current;
    if (!c || !img) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
    seg(ctx, refPts, "#0ea5e9", "R");
    seg(ctx, crackPts, "#dc2626", "G");
  }

  function seg(ctx: CanvasRenderingContext2D, pts: Pt[], color: string, tag: string) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    for (const p of pts) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    if (pts.length === 2) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      ctx.lineTo(pts[1].x, pts[1].y);
      ctx.stroke();
      ctx.font = "bold 14px ui-monospace, monospace";
      ctx.fillText(tag, (pts[0].x + pts[1].x) / 2 + 8, (pts[0].y + pts[1].y) / 2);
    }
  }

  useEffect(draw); // redibuja en cada cambio

  function onTap(e: React.PointerEvent) {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const p = {
      x: ((e.clientX - rect.left) / rect.width) * c.width,
      y: ((e.clientY - rect.top) / rect.height) * c.height,
    };
    if (active === "ref") setRefPts((prev) => (prev.length >= 2 ? [p] : [...prev, p]));
    else setCrackPts((prev) => (prev.length >= 2 ? [p] : [...prev, p]));
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 p-2" style={{ paddingTop: "var(--safe-top)" }}>
      <div className="flex items-center justify-between gap-2 py-1">
        <Button variant="ghost" size="md" className="text-white" onClick={onCancel}>
          Cancelar
        </Button>
        <span className="text-sm font-semibold text-white">Medir grieta</span>
        <Button variant="success" size="md" disabled={width == null} onClick={() => width != null && onSave(width)}>
          Guardar
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-auto">
        <canvas
          ref={canvasRef}
          onPointerDown={onTap}
          className="touch-none rounded-lg bg-white"
          style={{ maxWidth: "100%" }}
        />
      </div>

      <div className="flex flex-col gap-2 py-2 text-white">
        <div className="flex items-center gap-2">
          <label className="text-sm">Referencia:</label>
          <select
            value={refId}
            onChange={(e) => setRefId(e.target.value)}
            className="flex-1 rounded-lg bg-white/15 px-2 py-2 text-sm"
          >
            {REFS.map((r) => (
              <option key={r.id} value={r.id} className="text-ink">
                {r.label}
              </option>
            ))}
          </select>
          {refId === "custom" && (
            <input
              inputMode="decimal"
              value={customMm}
              onChange={(e) => setCustomMm(e.target.value.replace(/[^\d.]/g, ""))}
              placeholder="mm"
              className="w-20 rounded-lg bg-white/15 px-2 py-2 text-sm"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(["ref", "crack"] as Seg[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setActive(s)}
              className={cn(
                "touch-target rounded-lg px-3 text-sm font-semibold",
                active === s ? (s === "ref" ? "bg-sky-500" : "bg-rojo") : "bg-white/15",
              )}
            >
              {s === "ref"
                ? `1) Referencia ${refPts.length}/2`
                : `2) Grieta ${crackPts.length}/2`}
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-white/70">
          Toca 2 puntos sobre el borde de la referencia y 2 a lo ancho de la grieta.
        </p>

        <div className="text-center font-data text-3xl font-bold">
          {width != null ? `${width.toFixed(1)} mm` : "—"}
        </div>
      </div>
    </div>
  );
}
