"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { addPhoto, db, deletePhoto } from "@/lib/db";
import { compressImage } from "@/lib/image";
import { getCurrentPosition } from "@/lib/geo";
import { newId } from "@/lib/id";
import type { AnnotationData, Photo } from "@/lib/types";
import { AnnotationCanvas } from "./AnnotationCanvas";
import { Button } from "./ui/Button";
import { Spinner } from "./ui/Spinner";
import { Icon } from "./ui/Icon";
import { TextInput } from "./ui/Field";

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
      let blob: Blob;
      try {
        blob = await compressImage(file);
      } catch {
        blob = file; // si la compresión falla (HEIC/imagen corrupta/OOM), guarda el original
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
      const photo: Photo = {
        id: newId(),
        inspectionClientUuid,
        findingId: findingId ?? null,
        blob,
        originalBlob: blob, // evidencia base prístina (no se sobrescribe al anotar)
        lat,
        lng,
        capturedAt: new Date().toISOString(),
        annotationJson: null,
        storagePath: null,
        syncStatus: "pending",
      };
      await addPhoto(photo);
    } catch {
      // Nunca dejar que la evidencia desaparezca sin avisar (p.ej. cuota llena).
      setErr("No se pudo guardar la foto. Verifica el almacenamiento e intenta de nuevo.");
    } finally {
      setBusy(false);
    }
  }

  async function saveAnnotation(photo: Photo, data: AnnotationData, flattened: Blob) {
    await db.photos.update(photo.id, {
      blob: flattened,
      originalBlob: photo.originalBlob ?? photo.blob, // conserva la base prístina
      annotationJson: data,
      syncStatus: "pending",
      storagePath: null,
    });
    setAnnotating(null);
  }

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
          onDelete={async () => {
            await deletePhoto(editing.id);
            setEditing(null);
          }}
        />
      )}

      {annotating && (annotating.originalBlob ?? annotating.blob) && (
        <AnnotationCanvas
          src={(annotating.originalBlob ?? annotating.blob)!}
          initial={annotating.annotationJson}
          onCancel={() => setAnnotating(null)}
          onSave={(data, flattened) => saveAnnotation(annotating, data, flattened)}
        />
      )}
    </div>
  );
}

function useObjectUrl(blob?: Blob): string | null {
  // Crea el object URL en render (memoizado) y lo revoca al cambiar/desmontar.
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
      {photo.annotationJson && (
        <span className="absolute bottom-1 left-1 rounded bg-black/60 p-0.5 text-white">
          <Icon name="pen" size={11} />
        </span>
      )}
    </button>
  );
}

function PhotoEditor({
  photo,
  onClose,
  onAnnotate,
  onDelete,
}: {
  photo: Photo;
  onClose: () => void;
  onAnnotate: () => void;
  onDelete: () => void;
}) {
  const url = useObjectUrl(photo.blob);
  const [caption, setCaption] = useState(photo.caption ?? "");

  async function saveCaption(v: string) {
    setCaption(v);
    await db.photos.update(photo.id, { caption: v });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-t-2xl bg-white p-4"
        style={{ paddingBottom: "calc(var(--safe-bottom) + 1rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {url && <img src={url} alt="Evidencia" className="mb-3 max-h-72 w-full rounded-xl object-contain" />}
        <TextInput
          placeholder="Descripción de la foto (opcional)"
          value={caption}
          onChange={(e) => saveCaption(e.target.value)}
          className="mb-3"
        />
        <div className="grid grid-cols-3 gap-2">
          <Button variant="secondary" size="md" onClick={onAnnotate}>
            <Icon name="pen" size={16} /> Anotar
          </Button>
          <Button variant="danger" size="md" onClick={onDelete}>
            Eliminar
          </Button>
          <Button variant="primary" size="md" onClick={onClose}>
            Listo
          </Button>
        </div>
      </div>
    </div>
  );
}
