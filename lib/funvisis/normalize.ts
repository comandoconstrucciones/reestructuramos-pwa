// Normalización entre la capa legada (ATC-20) y la capa FUNVISIS.

import type { ConstructionType, DetailedEval } from "@/lib/types";
import type { FunvisisDetailedEval, FunvisisMaterial } from "./types";

/** detailed_eval_recommended: normaliza los valores legados a los oficiales
 *  de la planilla (estructura, geologia_geotecnia, instalaciones, otra). */
export function normalizeDetailedEval(value: DetailedEval): FunvisisDetailedEval {
  switch (value) {
    case "estructural":
    case "estructura":
      return "estructura";
    case "geotecnico":
    case "geologia_geotecnia":
      return "geologia_geotecnia";
    case "instalaciones":
      return "instalaciones";
    default:
      return "otra";
  }
}

export function normalizeDetailedEvals(values: DetailedEval[] | undefined): FunvisisDetailedEval[] {
  return [...new Set((values ?? []).map(normalizeDetailedEval))];
}

/** Deriva la tipología ATC-20 desde el material FUNVISIS (retrocompatibilidad
 *  del esquema: construction_type tiene CHECK propio). */
export function materialToConstructionType(material: FunvisisMaterial): ConstructionType {
  switch (material) {
    case "concreto":
      return "portico_concreto";
    case "acero":
      return "estructura_metalica";
    case "mamposteria_formal":
      return "mamposteria_confinada";
    case "mamposteria_informal":
      return "mamposteria_no_confinada";
    case "otro":
      return "otro";
  }
}

/** Nº de planilla legible: FV-AAAAMMDD-XXXX (XXXX = inicio del client_uuid). */
export function buildPlanillaNo(clientUuid: string, date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `FV-${y}${m}${d}-${clientUuid.slice(0, 4).toUpperCase()}`;
}

/** HH:MM local (para time_start / time_end de la planilla). */
export function toHHMM(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
