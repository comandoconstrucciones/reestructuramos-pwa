"use client";
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/components/ui";
import type { Photo } from "@/lib/types";

function fmtDateTime(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  try {
    return d.toLocaleString("es-VE", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return d.toISOString();
  }
}

/** Galería de evidencia de la inspección. Crea object URLs y los revoca al salir. */
export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  // Firma sensible al CONTENIDO (id + tamaño del blob): si un blob se reemplaza
  // in situ (re-anotación) la galería refresca el object URL en vez de mostrar el viejo.
  const sig = photos.map((p) => `${p.id}:${p.blob?.size ?? 0}`).join("|");
  // Crea los object URLs en render (memoizados); se revocan al cambiar o desmontar.
  const urls = useMemo<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const p of photos) if (p.blob) map[p.id] = URL.createObjectURL(p.blob);
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);
  useEffect(() => {
    return () => {
      Object.values(urls).forEach((u) => URL.revokeObjectURL(u));
    };
  }, [urls]);

  // Cerrar el visor con Escape (accesibilidad teclado).
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox]);

  if (photos.length === 0) {
    return <p className="text-sm text-slate-500">Sin fotos de evidencia.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setLightbox(p)}
            className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
            aria-label="Ampliar foto"
          >
            {urls[p.id] ? (
              <img
                src={urls[p.id]}
                alt={p.caption || "Foto de evidencia"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-slate-300">
                <Icon name="image" size={28} strokeWidth={1.6} />
              </span>
            )}
            {p.findingId && (
              <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1 text-[10px] font-bold text-white">
                hallazgo
              </span>
            )}
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Foto de evidencia"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-4"
          onClick={() => setLightbox(null)}
        >
          {urls[lightbox.id] && (
            <img
              src={urls[lightbox.id]}
              alt={lightbox.caption || "Evidencia"}
              className="max-h-[80vh] max-w-full rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <div
            className="mt-3 max-w-lg rounded-xl bg-white/95 p-3 text-center text-sm text-ink"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.caption && <p className="font-semibold">{lightbox.caption}</p>}
            <p className="text-slate-500">{fmtDateTime(lightbox.capturedAt)}</p>
            {lightbox.lat != null && lightbox.lng != null && (
              <p className="font-data text-slate-500">
                GPS {lightbox.lat.toFixed(5)}, {lightbox.lng.toFixed(5)}
              </p>
            )}
          </div>
          <button
            type="button"
            className="mt-3 rounded-xl bg-white px-5 py-2 font-semibold text-ink"
            onClick={() => setLightbox(null)}
          >
            Cerrar
          </button>
        </div>
      )}
    </>
  );
}
