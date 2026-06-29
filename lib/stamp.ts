// Sello de proveniencia: quema coords + fecha/hora + ID sobre la imagen, para
// que el JPEG exportado lleve su cadena de evidencia (antifraude). El original
// prístino se conserva aparte (Photo.originalBlob).

function fmt(iso?: string): string {
  if (!iso) return new Date().toLocaleString("es-VE");
  try {
    return new Date(iso).toLocaleString("es-VE", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return iso;
  }
}

async function toImage(blob: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap !== "undefined") {
    try {
      return await createImageBitmap(blob);
    } catch {
      /* fallback */
    }
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("img"));
    };
    img.src = url;
  });
}

export async function stampProvenance(
  blob: Blob,
  info: { lat?: number; lng?: number; capturedAt?: string; id?: string },
): Promise<Blob> {
  try {
    const img = await toImage(blob);
    const w = (img as ImageBitmap).width;
    const h = (img as ImageBitmap).height;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return blob;
    ctx.drawImage(img as CanvasImageSource, 0, 0, w, h);
    if ("close" in img) (img as ImageBitmap).close();

    const lines = [`reestructuramos · ${fmt(info.capturedAt)}`];
    if (info.lat != null && info.lng != null) {
      lines.push(`GPS ${info.lat.toFixed(5)}, ${info.lng.toFixed(5)}`);
    }
    if (info.id) lines.push(`ID ${info.id.slice(0, 8)}`);

    const fontSize = Math.max(13, Math.round(w * 0.025));
    const lineH = Math.round(fontSize * 1.35);
    const pad = Math.round(fontSize * 0.6);
    const barH = lineH * lines.length + pad * 2;

    ctx.fillStyle = "rgba(15,23,42,0.72)";
    ctx.fillRect(0, h - barH, w, barH);
    ctx.fillStyle = "#ffffff";
    ctx.font = `${fontSize}px ui-monospace, "Cascadia Mono", Menlo, monospace`;
    ctx.textBaseline = "top";
    let y = h - barH + pad;
    for (const ln of lines) {
      ctx.fillText(ln, pad, y);
      y += lineH;
    }

    return await new Promise<Blob>((res) =>
      canvas.toBlob((b) => res(b ?? blob), "image/jpeg", 0.85),
    );
  } catch {
    return blob; // ante cualquier fallo, devolver la imagen sin sello (no perderla)
  }
}
