// Tipos de dominio y enums. Identificadores en inglés; valores de enum en español
// porque coinciden 1:1 con los CHECK de PostgreSQL (ver supabase/migrations).

export const CONSTRUCTION_TYPES = [
  "portico_concreto",
  "muro_concreto",
  "mamposteria_confinada",
  "mamposteria_no_confinada",
  "estructura_metalica",
  "mixto",
  "rancho_autoconstruccion",
  "otro",
] as const;
export type ConstructionType = (typeof CONSTRUCTION_TYPES)[number];

export const OCCUPANCY_TYPES = [
  "vivienda",
  "comercio",
  "oficinas",
  "industrial",
  "gobierno",
  "escuela",
  "hospital",
  "religioso",
  "historico",
  "mixto",
  "otro",
] as const;
export type OccupancyType = (typeof OCCUPANCY_TYPES)[number];

export const SEVERITIES = ["ninguno", "leve", "moderado", "severo"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const FINDING_CATEGORIES = [
  "peligro_general",
  "estructural",
  "no_estructural",
  "geotecnico",
] as const;
export type FindingCategory = (typeof FINDING_CATEGORIES)[number];

export const PLACARDS = ["verde", "amarillo", "rojo", "none"] as const;
export type Placard = (typeof PLACARDS)[number];

export const EVALUATION_LEVELS = ["rapida", "detallada"] as const;
export type EvaluationLevel = (typeof EVALUATION_LEVELS)[number];

export const AREAS_INSPECTED = ["exterior", "exterior_interior"] as const;
export type AreasInspected = (typeof AREAS_INSPECTED)[number];

export const DAMAGE_BANDS = ["0-1", "1-10", "10-30", "30-60", "60-100", "100"] as const;
export type DamageBand = (typeof DAMAGE_BANDS)[number];

export const DETAILED_EVALS = ["estructural", "geotecnico", "otro"] as const;
export type DetailedEval = (typeof DETAILED_EVALS)[number];

export const ROLES = ["voluntario", "ingeniero", "arquitecto", "coordinador"] as const;
export type Role = (typeof ROLES)[number];

/** Estado de sincronización local (no existe en el servidor). */
export type SyncStatus = "pending" | "synced" | "error";

/** Estado de la inspección en el ciclo de vida local. */
export type InspectionStatus = "draft" | "complete";

// ---------------------------------------------------------------------------

export interface InspectorProfile {
  id: string; // uuid: anon uid de Supabase cuando exista; si no, uuid local
  fullName?: string;
  nationalId?: string; // cédula (opcional para anónimos)
  role: Role;
  credentialLevel: number; // 1=rápida, 2=detallada, 3=coordinador
  phone?: string;
  email?: string;
  isAnonymous: boolean;
  onboardedAt?: string;
  quizPassed?: boolean;
  createdAt: string; // ISO
}

export interface Building {
  id: string; // uuid generado en cliente (= id del servidor)
  name?: string;
  address?: string;
  lat?: number;
  lng?: number;
  constructionType?: ConstructionType;
  nStoriesAbove?: number;
  nStoriesBelow?: number;
  yearBuilt?: number;
  occupancyType?: OccupancyType;
  footprintAreaM2?: number;
  isEssential: boolean;
  softStory: boolean;
  shortColumn: boolean;
  createdAt: string;
  syncStatus: SyncStatus;
}

/** Una marca dibujada sobre una foto (canvas de anotación). */
export interface Annotation {
  type: "arrow" | "circle" | "rect" | "free" | "text";
  color: string;
  points: { x: number; y: number }[]; // normalizados 0..1 sobre la imagen
  text?: string;
  width?: number;
}
export interface AnnotationData {
  shapes: Annotation[];
  imageW: number;
  imageH: number;
}

export interface Photo {
  id: string;
  inspectionClientUuid: string;
  findingId?: string | null; // ligada a un hallazgo específico (o null = general)
  blob?: Blob; // bytes locales (puede ir aplanada con anotaciones) hasta subir
  originalBlob?: Blob; // foto prístina sin anotar (evidencia base, no se sobrescribe)
  storagePath?: string | null; // ruta en Supabase Storage tras subir
  lat?: number;
  lng?: number;
  capturedAt: string; // ISO
  caption?: string;
  annotationJson?: AnnotationData | null;
  crackWidthMm?: number | null; // v2
  aiClassification?: unknown; // v2
  syncStatus: SyncStatus;
}

export interface Finding {
  id: string;
  category: FindingCategory;
  element: string; // ver catalog.ts
  severity: Severity;
  notes?: string;
  photoIds: string[]; // referencias locales a Photo.id (conveniencia)
}

export interface Inspection {
  clientUuid: string; // PK local; también se usa como id del servidor
  buildingId: string;
  building: Building; // snapshot denormalizado (offline-first, PDF, historial)
  inspectorId?: string | null;
  evaluationLevel: EvaluationLevel;
  inspectedAt: string; // ISO, se fija al crear
  areasInspected?: AreasInspected;
  lat?: number;
  lng?: number;
  gpsAccuracyM?: number;
  estimatedDamageBand?: DamageBand;
  placardSuggested: Placard;
  placardFinal: Placard;
  placardManual?: boolean; // true = el inspector eligió el cartel a mano (anulación real)
  placardOverrideReason?: string;
  previousPlacard?: Placard | null;
  entryRestrictions?: string;
  barricadesNeeded: boolean;
  detailedEvalRecommended: DetailedEval[];
  generalComments?: string;
  inspectorSignature?: string; // nombre o dataURL de firma
  findings: Finding[];
  // --- metadatos locales ---
  status: InspectionStatus;
  step: number; // paso del asistente (para reanudar)
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  syncStatus: SyncStatus;
  syncAttempts: number;
  nextSyncAt?: number; // epoch ms (backoff)
  lastSyncError?: string | null;
}

/** Inspección pública cacheada para el mapa (se baja de Supabase cuando hay red). */
export interface RemoteInspection {
  id: string;
  lat: number;
  lng: number;
  placardFinal: Placard;
  buildingName?: string | null;
  address?: string | null;
  constructionType?: ConstructionType | null;
  evaluationLevel: EvaluationLevel;
  isEssential?: boolean | null;
  inspectedAt: string;
  cachedAt: number;
}

/** Tile de mapa cacheado en IndexedDB. */
export interface MapTile {
  key: string; // "z/x/y"
  blob: Blob;
  fetchedAt: number;
}

/** Par clave-valor para preferencias/estado (perfil, flags). */
export interface KV {
  key: string;
  value: unknown;
}

// --- Catálogo / UI ---------------------------------------------------------

export interface Option<T extends string = string> {
  value: T;
  label: string;
  description?: string;
}

export interface ElementDef {
  element: string;
  label: string;
  help?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correct: string; // id de la opción correcta
  explanation: string;
}

export interface DamagePattern {
  id: string;
  title: string;
  category: "cosmetica" | "estructural" | "geotecnica";
  severityHint: Severity;
  description: string;
  whatToLookFor: string;
  implication: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}
