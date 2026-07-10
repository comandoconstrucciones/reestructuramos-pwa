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
  title: "Colapso de la edificación",
  help: "¿La edificación colapsó total o parcialmente, o puede hacerlo?",
  options: [
    { value: "no", label: "No", level: "a" },
    { value: "posible_parcial_total", label: "Posible / parcial / total", level: "c" },
  ],
};

export const EXT_ADJACENT_DEF: ExternalAspectDef<ExtDanger> = {
  key: "extAdjacentDanger",
  title: "Peligro por edificaciones o elementos adyacentes",
  help: "Riesgo de caída de edificaciones vecinas, tanques, antenas, postes u objetos sobre esta edificación.",
  options: [
    { value: "no", label: "No", level: "a" },
    { value: "moderado", label: "Moderado", level: "b" },
    { value: "elevado", label: "Elevado", level: "c" },
  ],
};

export const EXT_GEO_DEF: ExternalAspectDef<ExtDanger> = {
  key: "extGeoDanger",
  title: "Peligro geológico / geotécnico",
  help: "Deslizamiento, grietas en el terreno, hundimiento o movimiento del suelo alrededor de la edificación.",
  options: [
    { value: "no", label: "No", level: "a" },
    { value: "moderado", label: "Moderado", level: "b" },
    { value: "elevado", label: "Elevado", level: "c" },
  ],
};

export const EXT_SETTLEMENT_DEF: ExternalAspectDef<ExtSettlement> = {
  key: "extSettlement",
  title: "Asentamiento de la edificación",
  help: "Hundimiento visible de la edificación respecto al terreno o aceras.",
  options: [
    { value: "no", label: "No", level: "a" },
    { value: "hasta_20cm", label: "Hasta 20 cm", level: "b" },
    { value: "mayor_20cm", label: "Mayor de 20 cm", level: "c" },
  ],
};

export const EXT_TILT_DEF: ExternalAspectDef<ExtTilt> = {
  key: "extTilt",
  title: "Inclinación de la edificación",
  help:
    "Medida con plomada de 60 cm: cuelga la plomada y mide la separación horizontal " +
    "a 60 cm de altura. Hasta 2 cm de separación en 60 cm = moderada; más de 2 cm = elevada.",
  options: [
    { value: "no", label: "No", level: "a" },
    { value: "hasta_2cm_60cm", label: "Hasta 2 cm en 60 cm", level: "b" },
    { value: "mayor_2cm_60cm", label: "Mayor de 2 cm en 60 cm", level: "c" },
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

export const COMPONENT_DEFS: ComponentDef[] = [
  {
    key: "compSlabs",
    title: "Losas, balcones y techos",
    levels: {
      a: "Sin daño o daño leve",
      b: "Daño moderado sin riesgo de caída",
      c: "Daño severo o riesgo de caída de partes",
    },
  },
  {
    key: "compWallsStairsFacades",
    title: "Paredes, escaleras y fachadas",
    levels: {
      a: "Sin daño o daño leve",
      b: "Daño moderado sin riesgo de caída",
      c: "Daño severo, riesgo de caída o escaleras inutilizables",
    },
  },
  {
    key: "compTanksAntennas",
    title: "Tanques, antenas y avisos",
    levels: {
      a: "Sin daño o daño leve",
      b: "Daño moderado sin riesgo de caída",
      c: "Riesgo de volcamiento o caída",
    },
  },
  {
    key: "compUtilities",
    title: "Servicios: gas, agua y electricidad",
    levels: {
      a: "Sin daño aparente en las instalaciones",
      b: "Daño moderado (filtraciones, cables sueltos) sin peligro inmediato",
      c: "Fuga de gas, cables energizados expuestos o rotura mayor",
    },
  },
  {
    key: "compElevators",
    title: "Ascensores y equipos",
    levels: {
      a: "Sin daño o daño leve",
      b: "Daño moderado; requiere revisión antes de usar",
      c: "Daño severo o fuera de servicio por el evento",
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
