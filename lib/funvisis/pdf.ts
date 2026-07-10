// PDFs de la capa FUNVISIS — 100% en cliente (offline), con jsPDF.
//  · buildPlanillaPdf: réplica de la planilla oficial (2 páginas: planilla +
//    croquis/firmas) con las secciones numeradas 1–7 y el semáforo de la 6.
//  · buildEtiquetaPdf: etiqueta imprimible media carta (verde/amarilla/roja)
//    con la leyenda "NO REMUEVA, ALTERE O CUBRA ESTA ETIQUETA".

import { jsPDF } from "jspdf";
import { blobToDataUrl } from "@/lib/image";
import type { Inspection } from "@/lib/types";
import {
  ACCESS_MEMBERS_OPTIONS,
  COMPONENT_DEFS,
  ELEMENT_COUNT_LABELS,
  EVENT_TYPE_OPTIONS,
  FUNVISIS_DETAILED_EVAL_OPTIONS,
  FUNVISIS_MATERIAL_OPTIONS,
  FUNVISIS_OCCUPANCY_OPTIONS,
  PREVENTION_MEASURE_OPTIONS,
  SEVERE_COUNTER_DEFS,
} from "./catalog";
import { normalizeDetailedEvals } from "./normalize";
import {
  computeFunvisis,
  externalAspectLevels,
  FUNVISIS_DISCLAIMER,
  FUNVISIS_PLACARD_META,
  pctModerate,
  placardToRisk,
} from "./scoring";
import type { RiskLevel } from "./types";

const INK = "#0f172a";
const MUTED = "#64748b";
const LINE = "#cbd5e1";
const HEADER_BG = "#0c4a6e";

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function optLabel(opts: { value: string; label: string }[], v?: string | null): string {
  if (!v) return "—";
  return opts.find((o) => o.value === v)?.label ?? v;
}

/** Resultado FUNVISIS coherente: usa los riesgos sellados si existen; si no,
 *  los recalcula con el motor puro. */
function resolveResult(insp: Inspection) {
  const computed = computeFunvisis({
    external: insp,
    severe: {
      nSevereColumns: insp.nSevereColumns ?? 0,
      nSevereConcreteWalls: insp.nSevereConcreteWalls ?? 0,
      nSevereMasonryWalls: insp.nSevereMasonryWalls ?? 0,
      nSevereBeams: insp.nSevereBeams ?? 0,
    },
    elementCounts: insp.elementCounts ?? [],
    moderatePctEstimated: insp.moderatePctEstimated,
    components: insp,
  });
  return {
    riskExternal: insp.riskExternal ?? computed.riskExternal,
    riskSevere: insp.riskSevere ?? computed.riskSevere,
    riskModerate: insp.riskModerate ?? computed.riskModerate,
    riskComponents: insp.riskComponents ?? computed.riskComponents,
    riskOverall: insp.riskOverall ?? computed.riskOverall,
    skippedSections: computed.skippedSections,
  };
}

// ============================================================================
// Planilla oficial (2 páginas)
// ============================================================================

export async function buildPlanillaPdf(inspection: Inspection): Promise<Blob> {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentW = pageW - margin * 2;
  let y = margin;

  const b = inspection.building;
  const r = resolveResult(inspection);

  const ink = () => {
    const [rr, g, bl] = hexToRgb(INK);
    doc.setTextColor(rr, g, bl);
  };
  const muted = () => {
    const [rr, g, bl] = hexToRgb(MUTED);
    doc.setTextColor(rr, g, bl);
  };

  function line(x1: number, y1: number, x2: number, y2: number) {
    const [rr, g, bl] = hexToRgb(LINE);
    doc.setDrawColor(rr, g, bl);
    doc.setLineWidth(0.25);
    doc.line(x1, y1, x2, y2);
  }

  function sectionHeader(num: string, title: string) {
    const h = 6.5;
    const [rr, g, bl] = hexToRgb(HEADER_BG);
    doc.setFillColor(rr, g, bl);
    doc.rect(margin, y, contentW, h, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.text(`${num}. ${title}`, margin + 2, y + 4.4);
    y += h + 2.5;
  }

  function riskBox(risk: RiskLevel | null, x: number, w = 22) {
    const h = 6;
    if (risk) {
      const [rr, g, bl] = hexToRgb(FUNVISIS_PLACARD_META[risk].color);
      doc.setFillColor(rr, g, bl);
      doc.roundedRect(x, y - 4.5, w, h, 1, 1, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(`Riesgo ${risk}`, x + w / 2, y - 0.4, { align: "center" });
    } else {
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(x, y - 4.5, w, h, 1, 1, "F");
      muted();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("Omitida", x + w / 2, y - 0.6, { align: "center" });
    }
    ink();
  }

  function kv(k: string, v: string, x: number, w: number) {
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    muted();
    doc.text(k.toUpperCase(), x, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    ink();
    const lines = doc.splitTextToSize(v || "—", w) as string[];
    doc.text(lines[0] ?? "—", x, y + 4);
  }

  function mark(checked: boolean, x: number, label: string, maxW?: number) {
    doc.setDrawColor(100, 116, 139);
    doc.setLineWidth(0.3);
    doc.rect(x, y - 2.8, 3.2, 3.2);
    if (checked) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      ink();
      doc.text("X", x + 0.7, y);
    }
    doc.setFont("helvetica", checked ? "bold" : "normal");
    doc.setFontSize(8.5);
    ink();
    const text = maxW ? (doc.splitTextToSize(label, maxW) as string[])[0] : label;
    doc.text(text, x + 4.5, y);
  }

  // ---- Encabezado -----------------------------------------------------------
  {
    const [rr, g, bl] = hexToRgb(HEADER_BG);
    doc.setFillColor(rr, g, bl);
    doc.rect(0, 0, pageW, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12.5);
    doc.text("EVALUACIÓN RÁPIDA DE DAÑOS EN EDIFICACIONES", margin, 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      "Metodología FUNVISIS / IMME-UCV · Generado con reestructuramos (documento de campo, no oficial)",
      margin,
      13.5,
    );
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`Planilla N° ${inspection.planillaNo ?? "—"}`, pageW - margin, 8, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(
      `${optLabel(EVENT_TYPE_OPTIONS, inspection.eventType)} · Evento: ${inspection.eventDate ?? "—"}`,
      pageW - margin,
      13.5,
      { align: "right" },
    );
  }
  y = 24;

  // ---- 1. Información general ----------------------------------------------
  sectionHeader("1", "INFORMACIÓN GENERAL");
  y += 3;
  const col = contentW / 4;
  kv("Estado", b.estado ?? "—", margin, col - 3);
  kv("Municipio", b.municipio ?? "—", margin + col, col - 3);
  kv("Ciudad", b.ciudad ?? "—", margin + col * 2, col - 3);
  kv("Sector / calle", b.sectorCalle ?? "—", margin + col * 3, col - 3);
  y += 9;
  kv("Edificación", b.name ?? "—", margin, col * 2 - 3);
  kv("Uso", optLabel(FUNVISIS_OCCUPANCY_OPTIONS, b.occupancyType), margin + col * 2, col - 3);
  kv("Material", optLabel(FUNVISIS_MATERIAL_OPTIONS, b.material), margin + col * 3, col - 3);
  y += 9;
  kv("Pisos", String(b.nStoriesAbove ?? "—"), margin, col - 3);
  kv("Sótanos", String(b.nStoriesBelow ?? "—"), margin + col * 0.7, col - 3);
  kv("Semisót.", String(b.nSemiBasements ?? "—"), margin + col * 1.4, col - 3);
  kv("Ocupantes", String(b.nOccupants ?? "—"), margin + col * 2.1, col - 3);
  kv("Año", b.yearBuilt != null ? String(b.yearBuilt) : "—", margin + col * 2.8, col - 3);
  kv(
    "GPS",
    inspection.lat != null && inspection.lng != null
      ? `${inspection.lat.toFixed(5)}, ${inspection.lng.toFixed(5)}`
      : "—",
    margin + col * 3.4,
    col,
  );
  y += 9;
  kv("Dirección", b.address ?? "—", margin, contentW * 0.62);
  kv("Inicio", `${inspection.eventDate ?? "—"} ${inspection.timeStart ?? ""}`, margin + contentW * 0.65, col - 3);
  kv("Fin", inspection.timeEnd ?? "—", margin + contentW * 0.85, col - 3);
  y += 8;
  line(margin, y, pageW - margin, y);
  y += 5;

  // ---- 2. Inspección externa -------------------------------------------------
  sectionHeader("2", "INSPECCIÓN EXTERNA (calificar sin ingresar)");
  y += 2.5;
  const levels = externalAspectLevels(inspection);
  const extRows: { label: string; value: string; level?: string }[] = [
    {
      label: "Colapso de la edificación",
      value: inspection.extCollapse === "posible_parcial_total" ? "Posible / parcial / total" : inspection.extCollapse === "no" ? "No" : "—",
      level: levels.collapse,
    },
    {
      label: "Peligro por adyacentes",
      value: inspection.extAdjacentDanger ?? "—",
      level: levels.adjacentDanger,
    },
    {
      label: "Peligro geológico / geotécnico",
      value: inspection.extGeoDanger ?? "—",
      level: levels.geoDanger,
    },
    {
      label: "Asentamiento",
      value:
        inspection.extSettlement === "hasta_20cm"
          ? "Hasta 20 cm"
          : inspection.extSettlement === "mayor_20cm"
            ? "Mayor de 20 cm"
            : inspection.extSettlement === "no"
              ? "No"
              : "—",
      level: levels.settlement,
    },
    {
      label: "Inclinación (plomada 2 cm / 60 cm)",
      value:
        inspection.extTilt === "hasta_2cm_60cm"
          ? "Hasta 2 cm en 60 cm"
          : inspection.extTilt === "mayor_2cm_60cm"
            ? "Mayor de 2 cm en 60 cm"
            : inspection.extTilt === "no"
              ? "No"
              : "—",
      level: levels.tilt,
    },
  ];
  for (const row of extRows) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    ink();
    doc.text(row.label, margin, y);
    doc.setFont("helvetica", "bold");
    doc.text(row.value.charAt(0).toUpperCase() + row.value.slice(1), margin + 92, y);
    doc.setFont("helvetica", "bold");
    muted();
    doc.text(row.level ? `(${row.level})` : "", pageW - margin - 30, y);
    ink();
    y += 5;
  }
  y += 1;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Riesgo externo:", margin, y);
  riskBox(r.riskExternal, margin + 30);
  if (r.riskExternal === "C") {
    doc.setFontSize(8);
    const [rr, g, bl] = hexToRgb("#dc2626");
    doc.setTextColor(rr, g, bl);
    doc.text("Riesgo Alto: NO se continúa la inspección interna (secciones 3–5 omitidas).", margin + 56, y);
    ink();
  }
  y += 6;
  line(margin, y, pageW - margin, y);
  y += 5;

  // ---- 3. Piso crítico y daño Severo/Completo --------------------------------
  sectionHeader("3", "PISO CRÍTICO Y DAÑO SEVERO/COMPLETO");
  y += 3;
  kv("Pisos inspeccionados", inspection.floorsInspected ?? "—", margin, col * 1.3);
  kv("Piso crítico", inspection.criticalFloor ?? "—", margin + col * 1.4, col - 3);
  kv("Acceso a miembros", optLabel(ACCESS_MEMBERS_OPTIONS, inspection.accessMembers), margin + col * 2.4, col * 1.4);
  y += 9;
  {
    let x = margin;
    for (const def of SEVERE_COUNTER_DEFS) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      ink();
      doc.text(`${def.label}:`, x, y);
      doc.setFont("helvetica", "bold");
      doc.text(String(inspection[def.key] ?? 0), x + doc.getTextWidth(`${def.label}: `) + 1, y);
      x += contentW / 4 + 2;
    }
  }
  y += 5.5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Riesgo por daño Severo/Completo:", margin, y);
  riskBox(r.riskSevere, margin + 60);
  y += 6;
  line(margin, y, pageW - margin, y);
  y += 5;

  // ---- 4. Daño moderado --------------------------------------------------------
  sectionHeader("4", "RIESGO ESTRUCTURAL POR DAÑO MODERADO");
  y += 2.5;
  {
    // Tabla: elemento | sin daño/menor | moderado | examinados | %
    const cols = [contentW * 0.4, contentW * 0.16, contentW * 0.14, contentW * 0.15, contentW * 0.15];
    const xs = [margin];
    for (let i = 0; i < cols.length - 1; i++) xs.push(xs[i] + cols[i]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    muted();
    doc.text("TIPO DE ELEMENTO", xs[0], y);
    doc.text("SIN DAÑO/MENOR", xs[1], y);
    doc.text("MODERADO", xs[2], y);
    doc.text("EXAMINADOS", xs[3], y);
    doc.text("% MODERADO", xs[4], y);
    y += 4;
    ink();
    const counts = inspection.elementCounts ?? [];
    for (const [type, label] of Object.entries(ELEMENT_COUNT_LABELS)) {
      const row = counts.find((c) => c.elementType === type);
      const examined = row ? row.nNoMinor + row.nModerate : 0;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(label, xs[0], y);
      doc.text(row ? String(row.nNoMinor) : "—", xs[1] + 8, y);
      doc.text(row ? String(row.nModerate) : "—", xs[2] + 6, y);
      doc.text(examined > 0 ? String(examined) : "—", xs[3] + 8, y);
      doc.setFont("helvetica", "bold");
      doc.text(row && examined > 0 ? `${pctModerate(row)}%` : "—", xs[4] + 8, y);
      y += 4.6;
    }
  }
  if (inspection.moderatePctEstimated != null) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`Estimación manual del inspector: ${inspection.moderatePctEstimated}%`, margin, y);
    y += 4.5;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Riesgo por daño Moderado (<10% A · 10–30% B · >30% C):", margin, y);
  riskBox(r.riskModerate, margin + 96);
  y += 6;
  line(margin, y, pageW - margin, y);
  y += 5;

  // ---- 5. Componentes no estructurales -----------------------------------------
  sectionHeader("5", "COMPONENTES NO ESTRUCTURALES");
  y += 2.5;
  for (const def of COMPONENT_DEFS) {
    const value = inspection[def.key];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    ink();
    doc.text(def.title, margin, y);
    let x = margin + 92;
    for (const lvl of ["a", "b", "c"] as const) {
      mark(value === lvl, x, lvl);
      x += 14;
    }
    y += 5;
  }
  mark(inspection.gasLeak === true, margin, "Fuga de gas (fuerza servicios a «c»)", contentW);
  y += 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("Riesgo de componentes:", margin, y);
  riskBox(r.riskComponents, margin + 44);
  y += 6;
  line(margin, y, pageW - margin, y);
  y += 5;

  // ---- 6. Decisión final (semáforo) ---------------------------------------------
  sectionHeader("6", "DECISIÓN FINAL — RIESGO GLOBAL Y ETIQUETA");
  y += 2;
  {
    const boxW = (contentW - 8) / 3;
    const boxH = 13;
    const finalRisk = placardToRisk(inspection.placardFinal) ?? r.riskOverall;
    (Object.keys(FUNVISIS_PLACARD_META) as RiskLevel[]).forEach((risk, i) => {
      const meta = FUNVISIS_PLACARD_META[risk];
      const x = margin + i * (boxW + 4);
      const selected = finalRisk === risk;
      const [rr, g, bl] = hexToRgb(meta.color);
      if (selected) {
        doc.setFillColor(rr, g, bl);
        doc.roundedRect(x, y, boxW, boxH, 1.5, 1.5, "F");
        doc.setTextColor(255, 255, 255);
      } else {
        doc.setDrawColor(rr, g, bl);
        doc.setLineWidth(0.5);
        doc.roundedRect(x, y, boxW, boxH, 1.5, 1.5, "S");
        doc.setTextColor(rr, g, bl);
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`${risk} — ${meta.label}`, x + boxW / 2, y + 5.5, { align: "center" });
      doc.setFontSize(8);
      doc.text(meta.sublabel.toUpperCase(), x + boxW / 2, y + 10, { align: "center" });
    });
    y += boxH + 5;
    ink();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const sugg = inspection.placardSuggested !== "none" ? placardToRisk(inspection.placardSuggested) : r.riskOverall;
    doc.text(
      `Riesgo global calculado: ${r.riskOverall ?? "—"} · Etiqueta sugerida: ${sugg ?? "—"} · Etiqueta final del inspector: ${placardToRisk(inspection.placardFinal) ?? "—"}`,
      margin,
      y,
    );
    y += 4.5;
    if (inspection.placardOverrideReason) {
      doc.text(`Motivo del ajuste: ${inspection.placardOverrideReason}`, margin, y);
      y += 4.5;
    }
    muted();
    doc.setFontSize(7);
    const disc = doc.splitTextToSize(FUNVISIS_DISCLAIMER, contentW) as string[];
    doc.text(disc, margin, y);
    y += disc.length * 3 + 2;
    ink();
  }
  line(margin, y, pageW - margin, y);
  y += 5;

  // ---- 7. Acciones recomendadas ---------------------------------------------------
  sectionHeader("7", "ACCIONES RECOMENDADAS");
  y += 2.5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  muted();
  doc.text("SE RECOMIENDA INSPECCIÓN DETALLADA DE:", margin, y);
  y += 4.5;
  ink();
  {
    const evals = normalizeDetailedEvals(inspection.detailedEvalRecommended);
    let x = margin;
    for (const opt of FUNVISIS_DETAILED_EVAL_OPTIONS) {
      mark(evals.includes(opt.value), x, opt.label);
      x += contentW / 4;
    }
  }
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  muted();
  doc.text("MEDIDAS DE PREVENCIÓN:", margin, y);
  y += 4.5;
  ink();
  {
    const measures = inspection.preventionMeasures ?? [];
    let x = margin;
    let count = 0;
    for (const opt of PREVENTION_MEASURE_OPTIONS) {
      mark(measures.includes(opt.value), x, opt.label);
      x += contentW / 3;
      count++;
      if (count % 3 === 0) {
        x = margin;
        y += 5;
      }
    }
    if (count % 3 !== 0) y += 5;
  }

  // ================================================================================
  // Página 2: croquis + observaciones + firmas
  // ================================================================================
  doc.addPage();
  y = margin;
  {
    const [rr, g, bl] = hexToRgb(HEADER_BG);
    doc.setFillColor(rr, g, bl);
    doc.rect(0, 0, pageW, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(
      `Planilla N° ${inspection.planillaNo ?? "—"} — Croquis y firmas`,
      margin,
      7.5,
    );
  }
  y = 18;

  sectionHeader("6b", "CROQUIS DE LA PLANTA DEL PISO CRÍTICO");
  y += 2;
  {
    const frameH = 110;
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.4);
    doc.rect(margin, y, contentW, frameH);
    if (inspection.sketchBlob) {
      try {
        const dataUrl = await blobToDataUrl(inspection.sketchBlob);
        const props = doc.getImageProperties(dataUrl);
        const ratio = props.height / props.width;
        let w = contentW - 4;
        let h = w * ratio;
        if (h > frameH - 4) {
          h = frameH - 4;
          w = h / ratio;
        }
        doc.addImage(dataUrl, "PNG", margin + (contentW - w) / 2, y + (frameH - h) / 2, w, h);
      } catch {
        /* marco vacío */
      }
    } else {
      muted();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Sin croquis registrado", pageW / 2, y + frameH / 2, { align: "center" });
      ink();
    }
    y += frameH + 6;
  }

  if (inspection.observations) {
    sectionHeader("6c", "OBSERVACIONES");
    y += 2;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    ink();
    const lines = doc.splitTextToSize(inspection.observations, contentW) as string[];
    doc.text(lines, margin, y);
    y += lines.length * 4.2 + 4;
  }

  sectionHeader("7b", "INSPECTORES Y FIRMAS");
  y += 2;
  {
    const roster = inspection.inspectors ?? [];
    const boxW = (contentW - 6) / 2;
    const boxH = 34;
    for (let i = 0; i < Math.max(roster.length, 1); i++) {
      const person = roster[i];
      const x = margin + (i % 2) * (boxW + 6);
      if (i % 2 === 0 && i > 0) y += boxH + 4;
      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.3);
      doc.rect(x, y, boxW, boxH);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      muted();
      doc.text(person?.isLead ? "INSPECTOR LÍDER" : `INSPECTOR ${i + 1}`, x + 2, y + 4.5);
      ink();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.text(person?.fullName || "—", x + 2, y + 9.5);
      if (person?.signatureDataUrl) {
        try {
          doc.addImage(person.signatureDataUrl, "PNG", x + 2, y + 11, boxW - 4, 16);
        } catch {
          /* sin firma renderizable */
        }
      }
      doc.setFontSize(7);
      muted();
      doc.text(
        person?.signedAt ? `Firmado: ${new Date(person.signedAt).toLocaleString("es-VE")}` : "Sin firma",
        x + 2,
        y + boxH - 2,
      );
      ink();
    }
    y += boxH + 6;
  }

  // Pie en ambas páginas
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    line(margin, pageH - 11, pageW - margin, pageH - 11);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    muted();
    doc.text(
      "Planilla según metodología FUNVISIS / IMME-UCV (López et al. 2023) · reestructuramos · Documento de campo, no oficial.",
      margin,
      pageH - 7,
    );
    doc.text(`Página ${i} de ${pages}`, pageW - margin, pageH - 7, { align: "right" });
  }

  return doc.output("blob");
}

// ============================================================================
// Etiqueta imprimible (media carta, 215.9 × 139.7 mm)
// ============================================================================

export function buildEtiquetaPdf(inspection: Inspection): Blob {
  const risk = placardToRisk(inspection.placardFinal) ?? resolveResult(inspection).riskOverall ?? "C";
  const meta = FUNVISIS_PLACARD_META[risk];
  const doc = new jsPDF({ unit: "mm", format: [215.9, 139.7], orientation: "landscape", compress: true });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 8;
  const [rr, g, bl] = hexToRgb(meta.color);

  // Marco grueso del color de la etiqueta
  doc.setDrawColor(rr, g, bl);
  doc.setLineWidth(3);
  doc.rect(margin / 2, margin / 2, pageW - margin, pageH - margin);

  // Franja superior
  doc.setFillColor(rr, g, bl);
  doc.rect(margin / 2 + 1.5, margin / 2 + 1.5, pageW - margin - 3, 34, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.text(meta.label, pageW / 2, margin / 2 + 17, { align: "center" });
  doc.setFontSize(16);
  doc.text(meta.sublabel.toUpperCase(), pageW / 2, margin / 2 + 28, { align: "center" });

  // Datos de la inspección
  let y = 52;
  const ink = () => doc.setTextColor(30, 41, 59);
  ink();

  function row(k: string, v: string) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(k, margin + 4, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11.5);
    ink();
    const lines = doc.splitTextToSize(v || "—", pageW - margin * 2 - 60) as string[];
    doc.text(lines[0] ?? "—", margin + 52, y);
    y += 7;
  }

  const b = inspection.building;
  row("Edificación:", b.name || "—");
  row("Dirección:", [b.address, b.sectorCalle].filter(Boolean).join(" · ") || "—");
  row("Municipio / Estado:", [b.municipio, b.estado].filter(Boolean).join(" / ") || "—");
  row("Planilla N°:", inspection.planillaNo ?? "—");
  row(
    "Inspección:",
    `${(inspection.completedAt ?? inspection.inspectedAt ?? "").slice(0, 10) || "—"} · Riesgo global: ${risk}`,
  );

  // Instrucción según etiqueta
  y += 2;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(rr, g, bl);
  const instruction =
    risk === "A"
      ? "Habitable. No se observó peligro aparente. Reporte nuevos daños, especialmente tras réplicas."
      : risk === "B"
        ? "Uso restringido. Solo entradas breves y necesarias. Se requiere evaluación adicional."
        : "PELIGRO. No entre ni ocupe la edificación por ningún motivo. Manténgase alejado.";
  const instLines = doc.splitTextToSize(instruction, pageW - margin * 2 - 8) as string[];
  doc.text(instLines, margin + 4, y);
  y += instLines.length * 5;

  // Leyenda oficial
  doc.setFillColor(15, 23, 42);
  doc.rect(margin / 2 + 1.5, pageH - margin / 2 - 13.5, pageW - margin - 3, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("NO REMUEVA, ALTERE O CUBRA ESTA ETIQUETA", pageW / 2, pageH - margin / 2 - 5.5, {
    align: "center",
  });

  return doc.output("blob");
}
