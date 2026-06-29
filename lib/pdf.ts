// Generación del PDF del reporte de inspección — 100% en cliente (offline).
// Usa jsPDF (sin plugins): encabezado, franja del cartel, datos del edificio,
// tabla de hallazgos, restricciones, comentarios, ubicación, firma y fotos.

import { jsPDF } from "jspdf";
import {
  CONSTRUCTION_TYPE_OPTIONS,
  DAMAGE_BAND_OPTIONS,
  DETAILED_EVAL_OPTIONS,
  OCCUPANCY_OPTIONS,
  SEVERITY_OPTIONS,
  getElementLabel,
} from "@/lib/catalog";
import { blobToDataUrl } from "@/lib/image";
import { PLACARD_META } from "@/lib/placard";
import { qrDataUrl } from "@/lib/qr";
import type { Inspection, Photo } from "@/lib/types";

const BRAND = "#0369a1";
const BRAND_INK = "#0c4a6e";

const EVAL_LEVEL_LABELS: Record<string, string> = {
  rapida: "Evaluación rápida",
  detallada: "Evaluación detallada",
};
const AREAS_LABELS: Record<string, string> = {
  exterior: "Solo exterior",
  exterior_interior: "Exterior e interior",
};
const CATEGORY_LABELS: Record<string, string> = {
  peligro_general: "Peligro general",
  estructural: "Estructural",
  no_estructural: "No estructural",
  geotecnico: "Geotécnico",
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function optLabel(opts: { value: string; label: string }[], v?: string | null): string {
  if (!v) return "—";
  return opts.find((o) => o.value === v)?.label ?? v;
}

function fmtDateTime(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  try {
    return d.toLocaleString("es-VE", { dateStyle: "long", timeStyle: "short" });
  } catch {
    return d.toISOString();
  }
}

export async function buildInspectionPdf(
  inspection: Inspection,
  photos: Photo[],
): Promise<Blob> {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentW = pageW - margin * 2;
  const bottomLimit = pageH - 18; // espacio para el pie
  let y = margin;

  const meta = PLACARD_META[inspection.placardFinal] ?? PLACARD_META.none;
  const b = inspection.building;

  function ensure(space: number) {
    if (y + space > bottomLimit) {
      doc.addPage();
      y = margin;
    }
  }

  function sectionTitle(t: string) {
    ensure(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const [r, g, bl] = hexToRgb(BRAND_INK);
    doc.setTextColor(r, g, bl);
    doc.text(t, margin, y);
    y += 1.5;
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageW - margin, y);
    y += 5;
  }

  function keyVal(k: string, v: string) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const label = `${k}: `;
    const labelW = doc.getTextWidth(label);
    doc.setFont("helvetica", "normal");
    const valLines = doc.splitTextToSize(v || "—", contentW - labelW) as string[];
    ensure(valLines.length * 5 + 1);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(90, 90, 90);
    doc.text(label, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 30, 30);
    doc.text(valLines, margin + labelW, y);
    y += valLines.length * 5 + 1;
  }

  function paragraph(text: string) {
    if (!text) return;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    const lines = doc.splitTextToSize(text, contentW) as string[];
    for (const line of lines) {
      ensure(5);
      doc.text(line, margin, y);
      y += 5;
    }
    y += 1;
  }

  // ---- Encabezado (página 1) ----------------------------------------------
  {
    const [r, g, bl] = hexToRgb(BRAND);
    doc.setFillColor(r, g, bl);
    doc.rect(0, 0, pageW, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("reestructuramos", margin, 9);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Reporte de inspección estructural post-sismo", margin, 15.5);
  }
  y = 26;

  // ---- Franja del cartel + QR del historial -------------------------------
  {
    const qrSize = 26;
    const bandW = contentW - qrSize - 6;
    const bandH = 24;
    const [r, g, bl] = hexToRgb(meta.color);
    doc.setFillColor(r, g, bl);
    doc.roundedRect(margin, y, bandW, bandH, 2, 2, "F");
    const [tr, tg, tb] = hexToRgb(meta.textOn);
    doc.setTextColor(tr, tg, tb);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(meta.label, margin + bandW / 2, y + 11, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(meta.sublabel, margin + bandW / 2, y + 18, { align: "center" });

    const historyUrl =
      (typeof window !== "undefined" ? window.location.origin : "") +
      "/edificio/" +
      inspection.buildingId;
    try {
      const qr = await qrDataUrl(historyUrl);
      doc.addImage(qr, "PNG", margin + bandW + 6, y, qrSize, qrSize);
      doc.setFontSize(6.5);
      doc.setTextColor(110, 110, 110);
      doc.text("Historial", margin + bandW + 6 + qrSize / 2, y + qrSize + 3, {
        align: "center",
      });
    } catch {
      /* sin QR: no es crítico para el reporte */
    }
    y += bandH + 10;
  }

  // ---- Identificación del edificio ----------------------------------------
  sectionTitle("Identificación del edificio");
  keyVal("Nombre / referencia", b.name || "—");
  keyVal("Dirección", b.address || "—");
  keyVal("Tipo de construcción", optLabel(CONSTRUCTION_TYPE_OPTIONS, b.constructionType));
  keyVal("Ocupación", optLabel(OCCUPANCY_OPTIONS, b.occupancyType));
  keyVal(
    "Niveles",
    `${b.nStoriesAbove ?? "—"} sobre rasante · ${b.nStoriesBelow ?? "—"} bajo rasante`,
  );
  keyVal("Año de construcción", b.yearBuilt != null ? String(b.yearBuilt) : "—");
  keyVal("Área de huella", b.footprintAreaM2 != null ? `${b.footprintAreaM2} m²` : "—");
  {
    const flags: string[] = [];
    if (b.isEssential) flags.push("Edificio esencial");
    if (b.softStory) flags.push("Piso blando");
    if (b.shortColumn) flags.push("Columna corta");
    keyVal("Características", flags.length ? flags.join("; ") : "Ninguna");
  }
  y += 2;

  // ---- Resultado de la evaluación -----------------------------------------
  sectionTitle("Resultado de la evaluación");
  keyVal("Cartel final", meta.label);
  keyVal(
    "Cartel sugerido por el sistema",
    (PLACARD_META[inspection.placardSuggested] ?? PLACARD_META.none).label,
  );
  if (inspection.placardOverrideReason)
    keyVal("Motivo de anulación", inspection.placardOverrideReason);
  if (inspection.previousPlacard && inspection.previousPlacard !== "none")
    keyVal("Cartel previo", (PLACARD_META[inspection.previousPlacard] ?? PLACARD_META.none).label);
  keyVal("Nivel de evaluación", EVAL_LEVEL_LABELS[inspection.evaluationLevel] ?? inspection.evaluationLevel);
  if (inspection.areasInspected)
    keyVal("Áreas inspeccionadas", AREAS_LABELS[inspection.areasInspected] ?? inspection.areasInspected);
  keyVal("Banda de daño estimada", optLabel(DAMAGE_BAND_OPTIONS, inspection.estimatedDamageBand));
  y += 1;
  paragraph(meta.instruction);
  y += 1;

  // ---- Hallazgos -----------------------------------------------------------
  sectionTitle(`Hallazgos (${inspection.findings.length})`);
  if (inspection.findings.length === 0) {
    paragraph("Sin hallazgos registrados.");
  } else {
    const colEl = margin;
    const colSev = margin + 70;
    const colNotes = margin + 110;
    const notesW = pageW - margin - colNotes;
    // Cabecera
    ensure(9);
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y - 4, contentW, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(51, 51, 51);
    doc.text("Elemento", colEl + 1.5, y);
    doc.text("Severidad", colSev + 1.5, y);
    doc.text("Notas", colNotes + 1.5, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    for (const f of inspection.findings) {
      const elText = `${getElementLabel(f.element)}`;
      const elLines = doc.splitTextToSize(elText, 66) as string[];
      const catLine = CATEGORY_LABELS[f.category] ?? f.category;
      const noteLines = doc.splitTextToSize(f.notes || "—", notesW - 2) as string[];
      const rows = Math.max(elLines.length + 1, noteLines.length, 1);
      const rowH = rows * 4.4 + 2;
      ensure(rowH);
      const sevMeta = SEVERITY_OPTIONS.find((s) => s.value === f.severity);
      // Elemento + categoría
      doc.setFontSize(9.5);
      doc.setTextColor(30, 30, 30);
      doc.text(elLines, colEl + 1.5, y);
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text(catLine, colEl + 1.5, y + elLines.length * 4.4);
      // Severidad con punto de color
      doc.setFontSize(9.5);
      if (sevMeta) {
        const [r, g, bl] = hexToRgb(sevMeta.color);
        doc.setFillColor(r, g, bl);
        doc.circle(colSev + 2, y - 1.1, 1.3, "F");
        doc.setTextColor(40, 40, 40);
        doc.text(sevMeta.label, colSev + 5, y);
      } else {
        doc.setTextColor(40, 40, 40);
        doc.text(f.severity, colSev + 1.5, y);
      }
      // Notas
      doc.setTextColor(60, 60, 60);
      doc.text(noteLines, colNotes + 1.5, y);
      y += rowH;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(margin, y - 1, pageW - margin, y - 1);
    }
  }
  y += 3;

  // ---- Restricciones y medidas --------------------------------------------
  sectionTitle("Restricciones y medidas");
  keyVal("Restricciones de entrada", inspection.entryRestrictions || meta.defaultRestrictions || "—");
  keyVal("Barricadas necesarias", inspection.barricadesNeeded ? "Sí" : "No");
  {
    const evals = inspection.detailedEvalRecommended
      .map((e) => optLabel(DETAILED_EVAL_OPTIONS, e))
      .join(", ");
    keyVal("Evaluación detallada recomendada", evals || "Ninguna");
  }
  y += 2;

  // ---- Comentarios ---------------------------------------------------------
  if (inspection.generalComments) {
    sectionTitle("Comentarios del inspector");
    paragraph(inspection.generalComments);
    y += 1;
  }

  // ---- Ubicación y fecha ---------------------------------------------------
  sectionTitle("Ubicación y fecha");
  keyVal(
    "Coordenadas (lat, lng)",
    inspection.lat != null && inspection.lng != null
      ? `${inspection.lat.toFixed(6)}, ${inspection.lng.toFixed(6)}`
      : "No registradas",
  );
  keyVal(
    "Precisión GPS",
    inspection.gpsAccuracyM != null ? `± ${Math.round(inspection.gpsAccuracyM)} m` : "—",
  );
  keyVal("Fecha de inspección", fmtDateTime(inspection.inspectedAt));
  if (inspection.completedAt) keyVal("Finalizada", fmtDateTime(inspection.completedAt));
  y += 2;

  // ---- Inspector / firma ---------------------------------------------------
  sectionTitle("Inspector responsable");
  {
    const sig = inspection.inspectorSignature;
    if (sig && sig.startsWith("data:image")) {
      try {
        const props = doc.getImageProperties(sig);
        const w = 50;
        const h = Math.min(25, (w * props.height) / props.width);
        ensure(h + 8);
        doc.addImage(sig, "PNG", margin, y, w, h);
        y += h + 2;
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text("Firma del inspector", margin, y);
        y += 5;
      } catch {
        keyVal("Inspector", "Firma adjunta");
      }
    } else {
      keyVal("Inspector / firma", sig || "—");
    }
  }
  y += 2;

  // ---- Evidencia fotográfica ----------------------------------------------
  if (photos.length > 0) {
    sectionTitle(`Evidencia fotográfica (${photos.length})`);
    for (const p of photos) {
      const caption: string[] = [];
      if (p.caption) caption.push(p.caption);
      caption.push(fmtDateTime(p.capturedAt));
      if (p.lat != null && p.lng != null)
        caption.push(`GPS ${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`);

      if (p.blob) {
        let dataUrl: string;
        try {
          dataUrl = await blobToDataUrl(p.blob);
        } catch {
          continue;
        }
        let imgW = 110;
        let imgH = 73;
        try {
          const props = doc.getImageProperties(dataUrl);
          const ratio = props.height / props.width;
          imgW = 110;
          imgH = imgW * ratio;
          const maxH = 95;
          if (imgH > maxH) {
            imgH = maxH;
            imgW = imgH / ratio;
          }
        } catch {
          /* usa el tamaño por defecto */
        }
        ensure(imgH + 12);
        const fmt = dataUrl.includes("image/png") ? "PNG" : "JPEG";
        doc.addImage(dataUrl, fmt, margin, y, imgW, imgH, undefined, "FAST");
        y += imgH + 3;
      }
      doc.setFontSize(8);
      doc.setTextColor(110, 110, 110);
      const capLines = doc.splitTextToSize(caption.join(" · "), contentW) as string[];
      ensure(capLines.length * 4 + 3);
      doc.text(capLines, margin, y);
      y += capLines.length * 4 + 5;
    }
  }

  // ---- Pie en todas las páginas -------------------------------------------
  const pages = doc.getNumberOfPages();
  const legal =
    "Metodología ATC-20 adaptada / COVENIN 1756. Documento NO oficial: sin aval de autoridad competente. Solo orientativo.";
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, pageH - 13, pageW - margin, pageH - 13);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.8);
    doc.setTextColor(125, 125, 125);
    const ll = doc.splitTextToSize(legal, contentW - 26) as string[];
    doc.text(ll, margin, pageH - 9);
    doc.text(`Página ${i} de ${pages}`, pageW - margin, pageH - 9, { align: "right" });
  }

  return doc.output("blob");
}
