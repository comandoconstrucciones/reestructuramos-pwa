"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { addPhoto, db, deletePhoto } from "@/lib/db";
import { compressImage, blobToDataUrl } from "@/lib/image";
import { stampProvenance } from "@/lib/stamp";
import { getCurrentPosition } from "@/lib/geo";
import { tapStrong, warn } from "@/lib/haptics";
import { newId } from "@/lib/id";
import type { AnnotationData, Photo } from "@/lib/types";
import { AnnotationCanvas } from "./AnnotationCanvas";
import { CrackMeasure } from "./CrackMeasure";
import { Button } from "./ui/Button";
import { Spinner } from "./ui/Spinner";
import { Icon } from "./ui/Icon";
import { TextInput } from "./ui/Field";

type AiResult = {
  patron?: string;
  severidad?: string;
  ancho_mm_estimado?: number | null;
  resumen?: string;
  recomendacion?: string;
  error?: string;
};

/** Captura de evidencia SIEMPRE ligada a la inspección (y opcional a un hallazgo). */
export function PhotoCapture({
  inspectionClientUuid,
  findingId = null,
  compact,
}: {
  inspectionClientUuid: string;
  findingId?: string | null;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [editing, setEditing] = useState<Photo | null>(null);
  const [annotating, setAnnotating] = useState<Photo | null>(null);
  const [measuring, setMeasuring] = useState<Photo | null>(null);

  const photos =
    useLiveQuery(async () => {
      const all = await db.photos.where("inspectionClientUuid").equals(inspectionClientUuid).toArray();
      return all.filter((p) => (findingId ? p.findingId === findingId : !p.findingId));
    }, [inspectionClientUuid, findingId]) ?? [];

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      let compressed: Blob;
      try {
        compressed = await compressImage(file);
      } catch {
        compressed = file; // si la compresión falla (HEIC/corrupta/OOM), guarda el original
      }
      let lat: number | undefined;
      let lng: number | undefined;
      try {
        const pos = await getCurrentPosition(8000);
        lat = pos.lat;
        lng = pos.lng;
      } catch {
        /* GPS opcional, no bloquea la captura */
      }
      const id = newId();
      const capturedAt = new Date().toISOString();
      // Sello de proveniencia sobre la imagen mostrada; el original queda prístino.
      const stamped = await stampProvenance(compressed, { lat, lng, capturedAt, id });
      const photo: Photo = {
        id,
        inspectionClientUuid,
        findingId: findingId ?? null,
        blob: stamped,
        originalBlob: compressed,
        lat,
        lng,
        capturedAt,
        annotationJson: null,
        storagePath: null,
        syncStatus: "pending",
      };
      await addPhoto(photo);
      tapStrong();
    } catch {
      warn();
      setErr("No se pudo guardar la foto. Verifica el almacenamiento e intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  async function saveAnnotation(photo: Photo, data: AnnotationData, flattened: Blob) {
    const stamped = await stampProvenance(flattened, {
      lat: photo.lat,
      lng: photo.lng,
      capturedAt: photo.capturedAt,
      id: photo.id,
    });
    await db.photos.update(photo.id, {
      blob: stamped,
      originalBlob: photo.originalBlob ?? photo.blob, // conserva la base prístina
      annotationJson: data,
      syncStatus: "pending",
      storagePath: null,
    });
    setAnnotating(null);
  }

  async function saveCrack(photo: Photo, mm: number) {
    await db.photos.update(photo.id, {
      crackWidthMm: Math.round(mm * 10) / 10,
      syncStatus: "pending",
      storagePath: null,
    });
    setMeasuring(null);
  }

  const measureSrc = measuring ? (measuring.originalBlob ?? measuring.blob) : undefined;
  const annotateSrc = annotating ? (annotating.originalBlob ?? annotating.blob) : undefined;

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onFile}
      />
      <Button
        type="button"
        variant="secondary"
        size={compact ? "md" : "lg"}
        onClick={() => inputRef.current?.click()}
        disabled={busy}
      >
        {busy ? <Spinner /> : <Icon name="camera" size={20} />}
        {busy ? "Procesando…" : "Tomar foto"}
      </Button>

      {err && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-rojo-ink">{err}</p>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p) => (
            <Thumb key={p.id} photo={p} onClick={() => setEditing(p)} />
          ))}
        </div>
      )}

      {editing && (
        <PhotoEditor
          photo={editing}
          onClose={() => setEditing(null)}
          onAnnotate={() => {
            setAnnotating(editing);
            setEditing(null);
          }}
          onMeasure={() => {
            setMeasuring(editing);
            setEditing(null);
          }}
          onDelete={async () => {
            await deletePhoto(editing.id);
            setEditing(null);
          }}
        />
      )}

      {annotating && annotateSrc && (
        <AnnotationCanvas
          src={annotateSrc}
          initial={annotating.annotationJson}
          onCancel={() => setAnnotating(null)}
          onSave={(data, flattened) => saveAnnotation(annotating, data, flattened)}
        />
      )}

      {measuring && measureSrc && (
        <CrackMeasure
          src={measureSrc}
          onCancel={() => setMeasuring(null)}
          onSave={(mm) => saveCrack(measuring, mm)}
        />
      )}
    </div>
  );
}

function useObjectUrl(blob?: Blob): string | null {
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);
  return url;
}

function Thumb({ photo, onClick }: { photo: Photo; onClick: () => void }) {
  const url = useObjectUrl(photo.blob);
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
    >
      {url && <img src={url} alt={photo.caption || "Foto de evidencia"} className="h-full w-full object-cover" />}
      {photo.syncStatus !== "synced" && (
        <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-amarillo ring-2 ring-white" />
      )}
      {(photo.annotationJson || photo.crackWidthMm != null) && (
        <span className="absolute bottom-1 left-1 rounded bg-black/60 p-0.5 text-white">
          <Icon name={photo.crackWidthMm != null ? "ruler" : "pen"} size={11} />
        </span>
      )}
    </button>
  );
}

function PhotoEditor({
  photo,
  onClose,
  onAnnotate,
  onMeasure,
  onDelete,
}: {
  photo: Photo;
  onClose: () => void;
  onAnnotate: () => void;
  onMeasure: () => void;
  onDelete: () => void;
}) {
  const url = useObjectUrl(photo.blob);
  const [caption, setCaption] = useState(photo.caption ?? "");
  const [aiBusy, setAiBusy] = useState(false);
  const [ai, setAi] = useState<AiResult | null>((photo.aiClassification as AiResult) ?? null);

  async function saveCaption(v: string) {
    setCaption(v);
    await db.photos.update(photo.id, { caption: v });
  }

  async function analyze() {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setAi({ error: "El análisis con IA necesita conexión." });
      return;
    }
    if (!photo.blob) return;
    setAiBusy(true);
    try {
      const dataUrl = await blobToDataUrl(photo.blob);
      const base64 = dataUrl.split(",")[1] ?? "";
      const res = await fetch("/api/analizar-grieta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mime: photo.blob.type || "image/jpeg" }),
      });
      const data = (await res.json()) as AiResult;
      if (res.ok && !data.error) {
        setAi(data);
        await db.photos.update(photo.id, { aiClassification: data, syncStatus: "pending", storagePath: null });
      } else {
        setAi({ error: data.error || "El análisis no está disponible." });
      }
    } catch {
      setAi({ error: "No se pudo analizar (revisa la conexión)." });
    } finally {
      setAiBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-4"
        style={{ paddingBottom: "calc(var(--safe-bottom) + 1rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {url && <img src={url} alt="Evidencia" className="mb-3 max-h-64 w-full rounded-xl object-contain" />}
        <TextInput
          placeholder="Descripción de la foto (opcional)"
          value={caption}
          onChange={(e) => saveCaption(e.target.value)}
          className="mb-3"
        />

        {photo.crackWidthMm != null && (
          <p className="mb-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
            <span className="font-semibold text-ink">Ancho de grieta:</span>{" "}
            <span className="font-data">{photo.crackWidthMm} mm</span>
          </p>
        )}

        {ai && (
          <div className="mb-3 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-sm">
            {ai.error ? (
              <p className="text-slate-600">{ai.error}</p>
            ) : (
              <>
                <p className="font-semibold text-brand-ink">
                  IA: {ai.patron ?? "—"}
                  {ai.severidad ? ` · severidad ${ai.severidad}` : ""}
                  {ai.ancho_mm_estimado != null ? ` · ~${ai.ancho_mm_estimado} mm` : ""}
                </p>
                {ai.resumen && <p className="mt-1 text-slate-600">{ai.resumen}</p>}
                {ai.recomendacion && <p className="mt-1 text-slate-500">{ai.recomendacion}</p>}
                <p className="mt-1 text-[11px] text-slate-400">Sugerencia de IA — el inspector decide.</p>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" size="md" onClick={onAnnotate}>
            <Icon name="pen" size={16} /> Anotar
          </Button>
          <Button variant="secondary" size="md" onClick={onMeasure}>
            <Icon name="ruler" size={16} /> Medir grieta
          </Button>
          <Button variant="secondary" size="md" onClick={analyze} disabled={aiBusy}>
            {aiBusy ? <Spinner /> : <Icon name="sparkles" size={16} />} Analizar IA
          </Button>
          <Button variant="danger" size="md" onClick={onDelete}>
            <Icon name="trash" size={16} /> Eliminar
          </Button>
        </div>
        <Button variant="primary" size="md" fullWidth className="mt-2" onClick={onClose}>
          Listo
        </Button>
      </div>
    </div>
  );
}
