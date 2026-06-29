// Compresión de imágenes en cliente (cuida memoria en Android de gama baja).
// Máx 1600px lado largo, JPEG ~0.7 — antes de guardar en Dexie o subir.

const MAX_DIM = 1600;
const QUALITY = 0.7;

export async function compressImage(
  input: Blob,
  maxDim = MAX_DIM,
  quality = QUALITY,
): Promise<Blob> {
  const bitmap = await loadBitmap(input);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas =
    typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(w, h)
      : Object.assign(document.createElement("canvas"), { width: w, height: h });
  const ctx = canvas.getContext("2d") as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D
    | null;
  if (!ctx) {
    if ("close" in bitmap) bitmap.close();
    return input; // sin canvas: devolver original
  }
  ctx.drawImage(bitmap as CanvasImageSource, 0, 0, w, h);
  if ("close" in bitmap) bitmap.close();

  if (canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob({ type: "image/jpeg", quality });
  }
  return new Promise((resolve) => {
    (canvas as HTMLCanvasElement).toBlob(
      (b) => resolve(b ?? input),
      "image/jpeg",
      quality,
    );
  });
}

async function loadBitmap(input: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap !== "undefined") {
    try {
      return await createImageBitmap(input);
    } catch {
      /* cae al respaldo */
    }
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(input);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen."));
    };
    img.src = url;
  });
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}
