// Tipos de dominio de la planilla FUNVISIS / IMME-UCV "Evaluación Rápida de
// Daños en Edificaciones" (López et al. 2023). Valores de enum en español
// porque coinciden 1:1 con los CHECK de PostgreSQL (migración 0003).
// Este módulo NO importa nada: es la base compartida de scoring, UI y sync.

// --- Encabezado --------------------------------------------------------------

export const EVENT_TYPES = [
  "sismo",
  "deslizamiento",
  "asentamiento",
  "explosion",
  "incendio",
  "inundacion",
  "otro",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

// --- Catálogos oficiales (tablas catalog_occupancy / catalog_material) ------

export const FUNVISIS_OCCUPANCIES = [
  "vivienda",
  "comercio_oficina",
  "gubernamental",
  "educativo",
  "medico_asistencial",
  "seguridad",
  "industrial",
  "cultural_recreativo",
  "religioso",
  "otros",
] as const;
export type FunvisisOccupancy = (typeof FUNVISIS_OCCUPANCIES)[number];

export const FUNVISIS_MATERIALS = [
  "concreto",
  "acero",
  "mamposteria_formal",
  "mamposteria_informal",
  "otro",
] as const;
export type FunvisisMaterial = (typeof FUNVISIS_MATERIALS)[number];

// --- Niveles de riesgo -------------------------------------------------------

/** Riesgo de sección/global: A (bajo/verde), B (medio/amarillo), C (alto/rojo). */
export type RiskLevel = "A" | "B" | "C";
/** Nivel por aspecto/componente dentro de una sección: a, b, c. */
export type AspectLevel = "a" | "b" | "c";

// --- Sección 2: Inspección externa -------------------------------------------

export const EXT_COLLAPSE_VALUES = ["no", "posible_parcial_total"] as const;
export type ExtCollapse = (typeof EXT_COLLAPSE_VALUES)[number];

export const EXT_DANGER_VALUES = ["no", "moderado", "elevado"] as const;
export type ExtDanger = (typeof EXT_DANGER_VALUES)[number];

export const EXT_SETTLEMENT_VALUES = ["no", "hasta_20cm", "mayor_20cm"] as const;
export type ExtSettlement = (typeof EXT_SETTLEMENT_VALUES)[number];

export const EXT_TILT_VALUES = ["no", "hasta_2cm_60cm", "mayor_2cm_60cm"] as const;
export type ExtTilt = (typeof EXT_TILT_VALUES)[number];

export interface ExternalInspection {
  extCollapse?: ExtCollapse;
  extAdjacentDanger?: ExtDanger;
  extGeoDanger?: ExtDanger;
  extSettlement?: ExtSettlement;
  extTilt?: ExtTilt;
}

// --- Sección 3: Piso crítico / daño Severo-Completo --------------------------

export const ACCESS_MEMBERS_VALUES = ["todos", "casi_todos", "pocos", "ninguno"] as const;
export type AccessMembers = (typeof ACCESS_MEMBERS_VALUES)[number];

export interface SevereCounts {
  nSevereColumns: number;
  nSevereConcreteWalls: number;
  nSevereMasonryWalls: number;
  nSevereBeams: number;
}

// --- Sección 4: daño moderado (conteos por tipo de elemento) -----------------

export const ELEMENT_COUNT_TYPES = [
  "columna_union",
  "muro_concreto",
  "muro_mamposteria",
  "viga_arriostramiento",
] as const;
export type ElementCountType = (typeof ELEMENT_COUNT_TYPES)[number];

export interface ElementCount {
  elementType: ElementCountType;
  /** Miembros examinados SIN daño o con daño menor. */
  nNoMinor: number;
  /** Miembros examinados con daño Moderado. */
  nModerate: number;
}

// --- Sección 5: componentes no estructurales ---------------------------------

export const COMPONENT_KEYS = [
  "compSlabs",
  "compWallsStairsFacades",
  "compTanksAntennas",
  "compUtilities",
  "compElevators",
] as const;
export type ComponentKey = (typeof COMPONENT_KEYS)[number];

export interface ComponentsInspection {
  compSlabs?: AspectLevel;
  compWallsStairsFacades?: AspectLevel;
  compTanksAntennas?: AspectLevel;
  compUtilities?: AspectLevel;
  compElevators?: AspectLevel;
  gasLeak?: boolean;
}

// --- Sección 7: acciones recomendadas -----------------------------------------

export const FUNVISIS_DETAILED_EVALS = [
  "estructura",
  "geologia_geotecnia",
  "instalaciones",
  "otra",
] as const;
export type FunvisisDetailedEval = (typeof FUNVISIS_DETAILED_EVALS)[number];

export const PREVENTION_MEASURES = [
  "acordonar",
  "cerrar_calles",
  "apuntalar",
  "desconectar_gas",
  "desconectar_electricidad",
  "otra",
] as const;
export type PreventionMeasure = (typeof PREVENTION_MEASURES)[number];

// --- Firmas (la planilla admite hasta 4 inspectores) -------------------------

export const MAX_INSPECTORS = 4;

/** Inspector asociado a la inspección, capturado localmente (tabla puente
 *  inspection_inspectors en el servidor). El líder autenticado lleva
 *  inspectorId; los co-inspectores de campo solo nombre + firma. */
export interface CoInspector {
  /** uid de Supabase si es el inspector autenticado (líder). */
  inspectorId?: string | null;
  fullName: string;
  /** Cédula de identidad (la planilla oficial la pide por inspector). */
  nationalId?: string | null;
  /** Firma dibujada (dataURL PNG); se sube a Storage al sincronizar. */
  signatureDataUrl?: string | null;
  /** Ruta en Storage tras subir. */
  signatureStoragePath?: string | null;
  signedAt?: string | null; // ISO
  isLead: boolean;
}
