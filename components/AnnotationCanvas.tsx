"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import type { Annotation, AnnotationData } from "@/lib/types";
import { Button } from "./ui/Button";

type Tool = "arrow" | "circle" | "free";
const COLORS = ["#dc2626", "#d97706", "#ffffff", "#0f172a"];

/** Editor de anotaciones a pantalla completa: dibuja flechas/círculos/trazo libre. */
export function AnnotationCanvas({
  src,
  initial,
  onCancel,
  onSave,
}: {
  src: Blob;
  initial?: AnnotationData | null;
  onCancel: () => void;
  onSave: (data: AnnotationData, flattened: Blob) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [tool, setTool] = useState<Tool>("arrow");
  const [color, setColor] = useState(COLORS[0]);
  const [shapes, setShapes] = useState<Annotation[]>(initial?.shapes ?? []);
  const drawing = useRef<Annotation | null>(null);
  const [, force] = useState(0);

  useEffect(() => {
    const url = URL.createObjectURL(src);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      fitCanvas();
      redraw();
    };
    img.onerror = () => {};
    img.src = url;
    // Revoca SIEMPRE al desmontar o cambiar la fuente (también si nunca cargó).
    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  function fitCanvas() {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const maxW = Math.min(window.innerWidth - 16, 900);
    const scale = maxW / img.naturalWidth;
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
  }

  function redraw() {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const all = drawing.current ? [...shapes, drawing.current] : shapes;
    for (const s of all) drawShape(ctx, s, canvas.width, canvas.height);
  }

  useEffect(redraw); // re-render en cada cambio de estado

  function toNorm(e: React.PointerEvent) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }

  function onDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    const p = toNorm(e);
    drawing.current = { type: tool, color, points: [p, p], width: 4 };
    force((n) => n + 1);
  }
  function onMove(e: React.PointerEvent) {
    if (!drawing.current) return;
    const p = toNorm(e);
    if (tool === "free") drawing.current.points.push(p);
    else drawing.current.points[1] = p;
    force((n) => n + 1);
  }
  function onUp() {
    if (drawing.current) {
      setShapes((s) => [...s, drawing.current!]);
      drawing.current = null;
    }
  }

  function undo() {
    setShapes((s) => s.slice(0, -1));
  }
  function clear() {
    setShapes([]);
  }

  async function save() {
    const img = imgRef.current;
    if (!img) return;
    const cap = Math.min(1600, img.naturalWidth);
    const scale = cap / img.naturalWidth;
    const out = document.createElement("canvas");
    out.width = Math.round(img.naturalWidth * scale);
    out.height = Math.round(img.naturalHeight * scale);
    const ctx = out.getContext("2d")!;
    ctx.drawImage(img, 0, 0, out.width, out.height);
    for (const s of shapes) drawShape(ctx, s, out.width, out.height);
    const flattened: Blob = await new Promise((res) =>
      out.toBlob((b) => res(b!), "image/jpeg", 0.8),
    );
    onSave(
      { shapes, imageW: img.naturalWidth, imageH: img.naturalHeight },
      flattened,
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90 p-2" style={{ paddingTop: "var(--safe-top)" }}>
      <div className="flex items-center justify-between gap-2 py-1">
        <Button variant="ghost" size="md" className="text-white" onClick={onCancel}>
          Cancelar
        </Button>
        <span className="text-sm font-semibold text-white">Anotar foto</span>
        <Button variant="success" size="md" onClick={save}>
          Guardar
        </Button>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-auto">
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          className="touch-none rounded-lg bg-white"
          style={{ maxWidth: "100%" }}
        />
      </div>

      <div className="flex flex-col gap-2 py-2">
        <div className="flex justify-center gap-2">
          {(["arrow", "circle", "free"] as Tool[]).map((t) => (
            <button
              key={t}
              onClick={() => setTool(t)}
              className={cn(
                "touch-target rounded-lg px-4 text-sm font-semibold",
                tool === t ? "bg-brand text-white" : "bg-white/15 text-white",
              )}
            >
              {t === "arrow" ? "Flecha" : t === "circle" ? "Círculo" : "Libre"}
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-3">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              aria-label={`color ${c}`}
              className={cn("h-9 w-9 rounded-full border-2", color === c ? "border-brand" : "border-white/40")}
              style={{ backgroundColor: c }}
            />
          ))}
          <button onClick={undo} className="touch-target rounded-lg bg-white/15 px-3 text-sm font-semibold text-white">
            Deshacer
          </button>
          <button onClick={clear} className="touch-target rounded-lg bg-white/15 px-3 text-sm font-semibold text-white">
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}

function drawShape(ctx: CanvasRenderingContext2D, s: Annotation, w: number, h: number) {
  ctx.strokeStyle = s.color;
  ctx.fillStyle = s.color;
  ctx.lineWidth = Math.max(2, (s.width ?? 4) * (w / 600));
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const pts = s.points.map((p) => ({ x: p.x * w, y: p.y * h }));
  if (pts.length < 2) return;
  if (s.type === "free") {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.stroke();
  } else if (s.type === "circle") {
    const [a, b] = pts;
    const r = Math.hypot(b.x - a.x, b.y - a.y);
    ctx.beginPath();
    ctx.arc(a.x, a.y, r, 0, Math.PI * 2);
    ctx.stroke();
  } else if (s.type === "arrow") {
    const [a, b] = pts;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    const ang = Math.atan2(b.y - a.y, b.x - a.x);
    const head = ctx.lineWidth * 4;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x - head * Math.cos(ang - Math.PI / 6), b.y - head * Math.sin(ang - Math.PI / 6));
    ctx.lineTo(b.x - head * Math.cos(ang + Math.PI / 6), b.y - head * Math.sin(ang + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }
}
