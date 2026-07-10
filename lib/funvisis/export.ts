// Exports del dashboard: CSV plano (una fila por inspección con todos los
// campos FUNVISIS) y GeoJSON (QGIS / entidades). Ambos incluyen el mapeo dual
// placard_atc20 (INSPECTED/RESTRICTED/UNSAFE) y etiqueta_funvisis (A/B/C).

import type { Inspection, Placard } from "@/lib/types";
import { FUNVISIS_PLACARD_META, pctModerate, placardToRisk } from "./scoring";
import { normalizeDetailedEvals } from "./normalize";
import { ELEMENT_COUNT_TYPES } from "./types";

/** Fila plana del export (nombres = columnas del CSV). */
export type ExportRow = Record<string, string | number | boolean | null>;

const ATC20_LABEL: Record<Placard, string> = {
  verde: "INSPECTED",
  amarillo: "RESTRICTED",
  rojo: "UNSAFE",
  none: "",
};

function etiquetaFunvisis(placard: Placard, riskOverall?: string | null): string {
  const risk = placardToRisk(placard) ?? (riskOverall as "A" | "B" | "C" | null);
  if (!risk) return "";
  const meta = FUNVISIS_PLACARD_META[risk];
  return `${risk} — ${meta.label} / ${meta.sublabel}`;
}

/** Construye la fila de export desde una inspección local (Dexie). */
export function exportRowFromInspection(insp: Inspection): ExportRow {
  const b = insp.building;
  const counts = insp.elementCounts ?? [];
  const countCols: ExportRow = {};
  for (const type of ELEMENT_COUNT_TYPES) {
    const row = counts.find((c) => c.elementType === type);
    const examined = row ? row.nNoMinor + row.nModerate : 0;
    countCols[`count_${type}_no_minor`] = row?.nNoMinor ?? null;
    countCols[`count_${type}_moderate`] = row?.nModerate ?? null;
    countCols[`count_${type}_pct`] = row && examined > 0 ? pctModerate(row) : null;
  }
  return {
    id: insp.clientUuid,
    planilla_no: insp.planillaNo ?? null,
    event_type: insp.eventType ?? null,
    event_date: insp.eventDate ?? null,
    time_start: insp.timeStart ?? null,
    time_end: insp.timeEnd ?? null,
    inspected_at: insp.inspectedAt ?? null,
    estado: b.estado ?? null,
    municipio: b.municipio ?? null,
    ciudad: b.ciudad ?? null,
    sector_calle: b.sectorCalle ?? null,
    direccion: b.address ?? null,
    edificacion: b.name ?? null,
    uso: b.occupancyType ?? null,
    material: b.material ?? null,
    pisos: b.nStoriesAbove ?? null,
    sotanos: b.nStoriesBelow ?? null,
    semisotanos: b.nSemiBasements ?? null,
    ocupantes: b.nOccupants ?? null,
    ano_construccion: b.yearBuilt ?? null,
    lat: insp.lat ?? null,
    lng: insp.lng ?? null,
    gps_precision_m: insp.gpsAccuracyM ?? null,
    ext_collapse: insp.extCollapse ?? null,
    ext_adjacent_danger: insp.extAdjacentDanger ?? null,
    ext_geo_danger: insp.extGeoDanger ?? null,
    ext_settlement: insp.extSettlement ?? null,
    ext_tilt: insp.extTilt ?? null,
    risk_external: insp.riskExternal ?? null,
    floors_inspected: insp.floorsInspected ?? null,
    critical_floor: insp.criticalFloor ?? null,
    access_members: insp.accessMembers ?? null,
    n_severe_columns: insp.nSevereColumns ?? 0,
    n_severe_concrete_walls: insp.nSevereConcreteWalls ?? 0,
    n_severe_masonry_walls: insp.nSevereMasonryWalls ?? 0,
    n_severe_beams: insp.nSevereBeams ?? 0,
    risk_severe: insp.riskSevere ?? null,
    ...countCols,
    moderate_pct_estimated: insp.moderatePctEstimated ?? null,
    risk_moderate: insp.riskModerate ?? null,
    comp_slabs: insp.compSlabs ?? null,
    comp_walls_stairs_facades: insp.compWallsStairsFacades ?? null,
    comp_tanks_antennas: insp.compTanksAntennas ?? null,
    comp_utilities: insp.compUtilities ?? null,
    comp_elevators: insp.compElevators ?? null,
    gas_leak: insp.gasLeak ?? false,
    risk_components: insp.riskComponents ?? null,
    risk_overall: insp.riskOverall ?? null,
    etiqueta_funvisis: etiquetaFunvisis(insp.placardFinal, insp.riskOverall),
    placard_atc20: ATC20_LABEL[insp.placardFinal] ?? "",
    placard_final: insp.placardFinal,
    placard_suggested: insp.placardSuggested,
    placard_override_reason: insp.placardOverrideReason ?? null,
    detailed_eval_recommended: normalizeDetailedEvals(insp.detailedEvalRecommended).join("; "),
    prevention_measures: (insp.preventionMeasures ?? []).join("; "),
    observations: insp.observations ?? null,
    comentarios: insp.generalComments ?? null,
    sync_status: insp.syncStatus,
  };
}

/** Fila de export desde el registro remoto (inspections + buildings + counts). */
export function exportRowFromRemote(
  i: Record<string, unknown>,
  b: Record<string, unknown> | null,
  counts: { element_type: string; n_no_minor: number; n_moderate: number; pct_moderate?: number | null }[],
): ExportRow {
  const s = (v: unknown): string | null => (v == null ? null : String(v));
  const n = (v: unknown): number | null => (typeof v === "number" ? v : v == null ? null : Number(v));
  const countCols: ExportRow = {};
  for (const type of ELEMENT_COUNT_TYPES) {
    const row = counts.find((c) => c.element_type === type);
    const examined = row ? row.n_no_minor + row.n_moderate : 0;
    countCols[`count_${type}_no_minor`] = row?.n_no_minor ?? null;
    countCols[`count_${type}_moderate`] = row?.n_moderate ?? null;
    countCols[`count_${type}_pct`] =
      row && examined > 0
        ? (row.pct_moderate ?? pctModerate({ nNoMinor: row.n_no_minor, nModerate: row.n_moderate }))
        : null;
  }
  const placardFinal = (s(i.placard_final) ?? "none") as Placard;
  return {
    id: s(i.id),
    planilla_no: s(i.planilla_no),
    event_type: s(i.event_type),
    event_date: s(i.event_date),
    time_start: s(i.time_start),
    time_end: s(i.time_end),
    inspected_at: s(i.inspected_at),
    estado: s(b?.estado),
    municipio: s(b?.municipio),
    ciudad: s(b?.ciudad),
    sector_calle: s(b?.sector_calle),
    direccion: s(b?.address),
    edificacion: s(b?.name),
    uso: s(b?.occupancy_type),
    material: s(b?.material),
    pisos: n(b?.n_stories_above),
    sotanos: n(b?.n_stories_below),
    semisotanos: n(b?.n_semi_basements),
    ocupantes: n(b?.n_occupants),
    ano_construccion: n(b?.year_built),
    lat: n(i.lat),
    lng: n(i.lng),
    gps_precision_m: n(i.gps_accuracy_m),
    ext_collapse: s(i.ext_collapse),
    ext_adjacent_danger: s(i.ext_adjacent_danger),
    ext_geo_danger: s(i.ext_geo_danger),
    ext_settlement: s(i.ext_settlement),
    ext_tilt: s(i.ext_tilt),
    risk_external: s(i.risk_external),
    floors_inspected: s(i.floors_inspected),
    critical_floor: s(i.critical_floor),
    access_members: s(i.access_members),
    n_severe_columns: n(i.n_severe_columns) ?? 0,
    n_severe_concrete_walls: n(i.n_severe_concrete_walls) ?? 0,
    n_severe_masonry_walls: n(i.n_severe_masonry_walls) ?? 0,
    n_severe_beams: n(i.n_severe_beams) ?? 0,
    risk_severe: s(i.risk_severe),
    ...countCols,
    moderate_pct_estimated: n(i.moderate_pct_estimated),
    risk_moderate: s(i.risk_moderate),
    comp_slabs: s(i.comp_slabs),
    comp_walls_stairs_facades: s(i.comp_walls_stairs_facades),
    comp_tanks_antennas: s(i.comp_tanks_antennas),
    comp_utilities: s(i.comp_utilities),
    comp_elevators: s(i.comp_elevators),
    gas_leak: i.gas_leak === true,
    risk_components: s(i.risk_components),
    risk_overall: s(i.risk_overall),
    etiqueta_funvisis: etiquetaFunvisis(placardFinal, s(i.risk_overall)),
    placard_atc20: ATC20_LABEL[placardFinal] ?? "",
    placard_final: placardFinal,
    placard_suggested: s(i.placard_suggested) ?? "none",
    placard_override_reason: s(i.placard_override_reason),
    detailed_eval_recommended: Array.isArray(i.detailed_eval_recommended)
      ? (i.detailed_eval_recommended as string[]).join("; ")
      : null,
    prevention_measures: Array.isArray(i.prevention_measures)
      ? (i.prevention_measures as string[]).join("; ")
      : null,
    observations: s(i.observations),
    comentarios: s(i.general_comments),
    sync_status: "synced",
  };
}

/** Orden estable de columnas (la unión de claves de todas las filas). */
export function exportColumns(rows: ExportRow[]): string[] {
  const cols: string[] = [];
  for (const row of rows) {
    for (const key of Object.keys(row)) if (!cols.includes(key)) cols.push(key);
  }
  return cols;
}

function csvCell(v: string | number | boolean | null): string {
  if (v == null) return "";
  const str = String(v);
  return /[",\n;]/.test(str) ? `"${str.replaceAll('"', '""')}"` : str;
}

/** CSV plano con BOM (Excel es-VE friendly). */
export function buildCsv(rows: ExportRow[]): string {
  const cols = exportColumns(rows);
  const lines = [cols.join(",")];
  for (const row of rows) {
    lines.push(cols.map((c) => csvCell(row[c] ?? null)).join(","));
  }
  return "﻿" + lines.join("\n");
}

/** GeoJSON FeatureCollection (solo filas con coordenadas). */
export function buildGeoJson(rows: ExportRow[]): string {
  const features = rows
    .filter((r) => typeof r.lat === "number" && typeof r.lng === "number")
    .map((r) => {
      const { lat, lng, ...properties } = r;
      return {
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: [lng as number, lat as number] },
        properties,
      };
    });
  return JSON.stringify({ type: "FeatureCollection", features }, null, 1);
}
