// Catálogo UI de la planilla FUNVISIS: textos oficiales en español venezolano.
// Terminología exacta de la planilla (no traducir términos técnicos).

import type { Option } from "@/lib/types";
import type {
  AccessMembers,
  AspectLevel,
  ComponentKey,
  ElementCountType,
  EventType,
  ExtCollapse,
  ExtDanger,
  ExtSettlement,
  ExtTilt,
  FunvisisDetailedEval,
  FunvisisMaterial,
  FunvisisOccupancy,
  PreventionMeasure,
  RiskLevel,
} from "./types";

// --- Encabezado ---------------------------------------------------------------

export const EVENT_TYPE_OPTIONS: Option<EventType>[] = [
  { value: "sismo", label: "Sismo" },
  { value: "deslizamiento", label: "Deslizamiento" },
  { value: "asentamiento", label: "Asentamiento" },
  { value: "explosion", label: "Explosión" },
  { value: "incendio", label: "Incendio" },
  { value: "inundacion", label: "Inundación" },
  { value: "otro", label: "Otro" },
];

// --- Sección 1: catálogos oficiales -------------------------------------------

export const FUNVISIS_OCCUPANCY_OPTIONS: Option<FunvisisOccupancy>[] = [
  { value: "vivienda", label: "Vivienda" },
  { value: "comercio_oficina", label: "Comercio / Oficina" },
  { value: "gubernamental", label: "Gubernamental" },
  { value: "educativo", label: "Educativo" },
  { value: "medico_asistencial", label: "Médico-asistencial" },
  { value: "seguridad", label: "Seguridad" },
  { value: "industrial", label: "Industrial" },
  { value: "cultural_recreativo", label: "Cultural / Recreativo" },
  { value: "religioso", label: "Religioso" },
  { value: "otros", label: "Otros" },
];

export const FUNVISIS_MATERIAL_OPTIONS: Option<FunvisisMaterial>[] = [
  { value: "concreto", label: "Concreto armado", description: "Pórticos o muros de concreto." },
  { value: "acero", label: "Acero", description: "Perfiles metálicos." },
  { value: "mamposteria_formal", label: "Mampostería formal", description: "Bloque/ladrillo con confinamiento y proyecto." },
  { value: "mamposteria_informal", label: "Mampostería informal", description: "Autoconstrucción sin confinamiento ni proyecto." },
  { value: "otro", label: "Otro", description: "Madera, prefabricado, etc." },
];

// --- Sección 2: inspección externa (textos oficiales) --------------------------

export interface ExternalAspectDef<T extends string> {
  key: "extCollapse" | "extAdjacentDanger" | "extGeoDanger" | "extSettlement" | "extTilt";
  title: string;
  help?: string;
  options: { value: T; label: string; level: AspectLevel }[];
}

export const EXT_COLLAPSE_DEF: ExternalAspectDef<ExtCollapse> = {
  key: "extCollapse",
  title: "Colapso de la estructura",
  help: "¿La estructura colapsó total o parcialmente, o puede hacerlo?",
  options: [
    { value: "no", label: "No", level: "a" },
    { value: "posible_parcial_total", label: "Posible, parcial o total", level: "c" },
  ],
};

export const EXT_ADJACENT_DEF: ExternalAspectDef<ExtDanger> = {
  key: "extAdjacentDanger",
  title: "Peligro por edificios aledaños",
  help: "Riesgo de caída de edificaciones vecinas, tanques, antenas, postes u objetos sobre esta edificación.",
  options: [
    { value: "no", label: "No", level: "a" },
    { value: "moderado", label: "Moderado", level: "b" },
    { value: "elevado", label: "Elevado", level: "c" },
  ],
};

export const EXT_GEO_DEF: ExternalAspectDef<ExtDanger> = {
  key: "extGeoDanger",
  title: "Peligro geológico o geotécnico",
  help: "Deslizamiento, licuación, socavación o agrietamiento del terreno (manual de campo oficial).",
  options: [
    { value: "no", label: "No", level: "a" },
    { value: "moderado", label: "Moderado", level: "b" },
    { value: "elevado", label: "Elevado", level: "c" },
  ],
};

export const EXT_SETTLEMENT_DEF: ExternalAspectDef<ExtSettlement> = {
  key: "extSettlement",
  title: "Asentamiento del edificio",
  help: "Hundimiento visible de la edificación respecto al terreno o aceras.",
  options: [
    { value: "no", label: "No", level: "a" },
    { value: "hasta_20cm", label: "Hasta 20 cm", level: "b" },
    { value: "mayor_20cm", label: "Mayor que 20 cm", level: "c" },
  ],
};

export const EXT_TILT_DEF: ExternalAspectDef<ExtTilt> = {
  key: "extTilt",
  title: "Inclinación del edificio",
  help:
    "Cuelga la plomada de 60 cm de longitud sobre la pared inclinada del edificio y mide la " +
    "distancia horizontal d (cm): sin inclinación; d ≤ 2 cm; o d > 2 cm (manual de campo oficial).",
  options: [
    { value: "no", label: "No", level: "a" },
    { value: "hasta_2cm_60cm", label: "Hasta 2 cm/60 cm", level: "b" },
    { value: "mayor_2cm_60cm", label: "Mayor que 2 cm/60 cm", level: "c" },
  ],
};

// --- Sección 3 ------------------------------------------------------------------

export const ACCESS_MEMBERS_OPTIONS: Option<AccessMembers>[] = [
  { value: "todos", label: "Todos", description: "Se pudo revisar todos los miembros." },
  { value: "casi_todos", label: "Casi todos" },
  { value: "pocos", label: "Pocos" },
  { value: "ninguno", label: "Ninguno", description: "Sin acceso a los miembros estructurales." },
];

export const SEVERE_COUNTER_DEFS: {
  key: "nSevereColumns" | "nSevereConcreteWalls" | "nSevereMasonryWalls" | "nSevereBeams";
  label: string;
}[] = [
  { key: "nSevereColumns", label: "Columnas y uniones" },
  { key: "nSevereConcreteWalls", label: "Muros de concreto armado" },
  { key: "nSevereMasonryWalls", label: "Paredes de mampostería" },
  { key: "nSevereBeams", label: "Vigas y arriostramientos" },
];

// --- Sección 4 ------------------------------------------------------------------

export const ELEMENT_COUNT_LABELS: Record<ElementCountType, string> = {
  columna_union: "Columnas y uniones",
  muro_concreto: "Muros de concreto armado",
  muro_mamposteria: "Paredes de mampostería",
  viga_arriostramiento: "Vigas y arriostramientos",
};

export const ELEMENT_COUNT_OPTIONS: Option<ElementCountType>[] = (
  Object.entries(ELEMENT_COUNT_LABELS) as [ElementCountType, string][]
).map(([value, label]) => ({ value, label }));

// --- Sección 5: componentes no estructurales (textos oficiales) -----------------

export interface ComponentDef {
  key: ComponentKey;
  title: string;
  /** Descripción de los niveles a / b / c con el texto oficial. */
  levels: Record<AspectLevel, string>;
}

// Textos oficiales de la planilla (columnas a. Bajo / b. Medio / c. Alto).
// "Riesgo de caída" = compromete la seguridad de los ocupantes.
export const COMPONENT_DEFS: ComponentDef[] = [
  {
    key: "compSlabs",
    title: "Losas / balcones / techos",
    levels: {
      a: "Sin o poco daño",
      b: "Grietas o deformación visible",
      c: "Riesgo de colapso",
    },
  },
  {
    key: "compWallsStairsFacades",
    title: "Paredes / escaleras / fachadas",
    levels: {
      a: "Sin o poco daño",
      b: "Grietas o separación",
      c: "Riesgo de caída",
    },
  },
  {
    key: "compTanksAntennas",
    title: "Tanques / antenas / avisos / similar",
    levels: {
      a: "Sin o poco daño",
      b: "Deformación visible",
      c: "Riesgo de caída",
    },
  },
  {
    key: "compUtilities",
    title: "Gas, agua y electricidad",
    levels: {
      a: "Sin o poco daño",
      b: "Separación y/o deformación",
      c: "Fuga de gas",
    },
  },
  {
    key: "compElevators",
    title: "Ascensores, equipos y otros",
    levels: {
      a: "Sin o poco daño",
      b: "Separación y/o deformación",
      c: "Riesgo de caída",
    },
  },
];

// --- Sección 7 -------------------------------------------------------------------

export const FUNVISIS_DETAILED_EVAL_OPTIONS: Option<FunvisisDetailedEval>[] = [
  { value: "estructura", label: "Estructura" },
  { value: "geologia_geotecnia", label: "Geología / Geotecnia" },
  { value: "instalaciones", label: "Instalaciones" },
  { value: "otra", label: "Otra" },
];

export const PREVENTION_MEASURE_OPTIONS: Option<PreventionMeasure>[] = [
  { value: "acordonar", label: "Acordonar", description: "Aislar el perímetro de peligro." },
  { value: "cerrar_calles", label: "Cerrar calles" },
  { value: "apuntalar", label: "Apuntalar", description: "Soporte temporal de elementos dañados." },
  { value: "desconectar_gas", label: "Desconectar el gas" },
  { value: "desconectar_electricidad", label: "Desconectar la electricidad" },
  { value: "otra", label: "Otra" },
];

// --- Etiquetas de riesgo para la UI -----------------------------------------------

export const RISK_LABELS: Record<RiskLevel, string> = {
  A: "A — Bajo",
  B: "B — Medio",
  C: "C — Alto",
};

export const SECTION_RISK_TITLES: { key: string; title: string }[] = [
  { key: "riskExternal", title: "2. Riesgo externo" },
  { key: "riskSevere", title: "3. Daño Severo/Completo" },
  { key: "riskModerate", title: "4. Daño Moderado" },
  { key: "riskComponents", title: "5. Componentes no estructurales" },
];

// --- Documentos oficiales de la metodología (servidos desde /public/docs) ----

export interface OfficialDoc {
  file: string;
  title: string;
  description: string;
  sizeLabel: string;
}

export const OFFICIAL_DOCS: OfficialDoc[] = [
  {
    file: "/docs/planilla-oficial-funvisis.pdf",
    title: "Planilla oficial + Manual de campo",
    description:
      "«Evaluación Rápida de Daños en Edificaciones» — FUNVISIS / Ministerio del Poder Popular " +
      "para Relaciones Interiores, Justicia y Paz. Es la planilla que este asistente replica 1:1 " +
      "(2 páginas: formulario y manual de campo con la tabla de criterios de daño).",
    sizeLabel: "PDF · 0,4 MB",
  },
  {
    file: "/docs/metodologia-lopez-2023.pdf",
    title: "Metodología completa (López et al., 2023)",
    description:
      "López O. A., Coronel G., Ginés C., Fierro F., Marinilli A. y Urich A. «Evaluación Rápida de " +
      "Daños en Edificaciones», Boletín de la Academia Nacional de la Ingeniería y el Hábitat " +
      "N.º 61, Caracas, oct.–dic. 2023, pp. 8–31. Fundamento técnico de todo el instrumento.",
    sizeLabel: "PDF · 2,2 MB",
  },
  {
    file: "/docs/manual-entrenamiento-imme-ucv.pdf",
    title: "Manual de entrenamiento (IMME-UCV)",
    description:
      "«Evaluación Rápida de Daño Post-Desastre» — material del taller de formación de inspectores " +
      "(López, Coronel y Rojas, IMME, Facultad de Ingeniería UCV): guía gráfica de daños, " +
      "comentarios y ejemplo de aplicación. Base del entrenamiento previo al trabajo de campo.",
    sizeLabel: "PDF · 8,9 MB",
  },
];

// --- Manual de campo (planilla oficial, página 2) -----------------------------

/** MATERIAL NECESARIO según el manual de campo oficial. */
export const FIELD_MATERIAL: string[] = [
  "Identificación institucional",
  "Libreta, lápiz o bolígrafo y tabla de apoyo",
  "Dispositivo móvil con cámara e internet",
  "Fisurómetro",
  "Cinta métrica",
  "Plomada de 60 cm",
  "Martillo",
  "Linterna",
  "Líquidos para hidratación",
  "Tapabocas y gel desinfectante",
  "Etiquetas (verde, amarilla, roja)",
];

/** SEGURIDAD del inspector según el manual de campo oficial. */
export const FIELD_SAFETY: string[] = [
  "Cada inspector debe llevar casco, botas y lentes de seguridad, así como chaleco con cintas reflectantes y/o colores resaltantes.",
  "Antes de entrar a la edificación, recorra el perímetro y verifique que no haya peligro de derrumbe.",
  "Evite exponerse o colocarse debajo de objetos en peligro de caer.",
  "No toque ni se exponga a cables de energía eléctrica.",
  "Si huele a gas: contacte al propietario y cierre la fuente de gas, notifique a los bomberos, desaloje y acordone el lugar.",
];
