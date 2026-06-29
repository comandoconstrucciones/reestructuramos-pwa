// Catálogos de dominio + contenido de la guía de campo + quiz de inducción.
// Todo en español es-VE. Consultable 100% offline.

import type {
  ConstructionType,
  DamageBand,
  DamagePattern,
  DetailedEval,
  ElementDef,
  GlossaryTerm,
  OccupancyType,
  Option,
  QuizQuestion,
  Role,
  Severity,
} from "./types";

export const CONSTRUCTION_TYPE_OPTIONS: Option<ConstructionType>[] = [
  { value: "portico_concreto", label: "Pórtico de concreto armado", description: "Columnas y vigas de concreto." },
  { value: "muro_concreto", label: "Muros de concreto", description: "Estructura a base de pantallas de concreto." },
  { value: "mamposteria_confinada", label: "Mampostería confinada", description: "Bloque/ladrillo confinado con columnas y vigas." },
  { value: "mamposteria_no_confinada", label: "Mampostería no confinada", description: "Bloque/ladrillo sin confinamiento (frágil)." },
  { value: "estructura_metalica", label: "Estructura metálica", description: "Perfiles de acero." },
  { value: "mixto", label: "Mixto", description: "Combinación de sistemas." },
  { value: "rancho_autoconstruccion", label: "Rancho / autoconstrucción", description: "Construcción informal sin ingeniería." },
  { value: "otro", label: "Otro", description: "Especificar en notas." },
];

export const OCCUPANCY_OPTIONS: Option<OccupancyType>[] = [
  { value: "vivienda", label: "Vivienda" },
  { value: "comercio", label: "Comercio" },
  { value: "oficinas", label: "Oficinas" },
  { value: "industrial", label: "Industrial" },
  { value: "gobierno", label: "Gobierno" },
  { value: "escuela", label: "Escuela" },
  { value: "hospital", label: "Hospital / salud" },
  { value: "religioso", label: "Religioso" },
  { value: "historico", label: "Histórico / patrimonial" },
  { value: "mixto", label: "Mixto" },
  { value: "otro", label: "Otro" },
];

export const SEVERITY_OPTIONS: { value: Severity; label: string; color: string; description: string }[] = [
  { value: "ninguno", label: "Ninguno", color: "#64748b", description: "Sin daño observable." },
  { value: "leve", label: "Leve", color: "#16a34a", description: "Daño cosmético; no afecta la seguridad." },
  { value: "moderado", label: "Moderado", color: "#d97706", description: "Daño apreciable; requiere atención." },
  { value: "severo", label: "Severo", color: "#dc2626", description: "Daño grave; compromete la seguridad." },
];

export const DAMAGE_BAND_OPTIONS: { value: DamageBand; label: string; description: string }[] = [
  { value: "0-1", label: "0–1%", description: "Prácticamente sin daño." },
  { value: "1-10", label: "1–10%", description: "Daño menor." },
  { value: "10-30", label: "10–30%", description: "Daño moderado." },
  { value: "30-60", label: "30–60%", description: "Daño importante." },
  { value: "60-100", label: "60–100%", description: "Daño grave / ruina." },
  { value: "100", label: "100%", description: "Colapso total." },
];

export const ROLE_OPTIONS: Option<Role>[] = [
  { value: "voluntario", label: "Voluntario" },
  { value: "ingeniero", label: "Ingeniero" },
  { value: "arquitecto", label: "Arquitecto" },
  { value: "coordinador", label: "Coordinador" },
];

export const DETAILED_EVAL_OPTIONS: Option<DetailedEval>[] = [
  { value: "estructural", label: "Estructural" },
  { value: "geotecnico", label: "Geotécnica" },
  { value: "otro", label: "Otra" },
];

// --- Elementos por categoría -----------------------------------------------

/** A. Peligros generales — Evaluación Rápida (los 6 ítems del asistente). */
export const GENERAL_HAZARDS: ElementDef[] = [
  {
    element: "colapso_total_parcial",
    label: "Colapso total o parcial",
    help: "Colapso, colapso parcial, o edificio fuera de su fundación.",
  },
  {
    element: "inclinacion",
    label: "Inclinación / desplome",
    help: "El edificio o un piso se ve inclinado o desplomado respecto a la vertical.",
  },
  {
    element: "dano_estructural_visible",
    label: "Daño estructural visible",
    help: "Agrietamiento estructural o distorsión (racking) de muros y pórticos.",
  },
  {
    element: "peligro_caida",
    label: "Peligro de caída",
    help: "Parapetos, fachadas, ornamentos, vidrios o chimeneas con riesgo de desprenderse.",
  },
  {
    element: "movimiento_terreno",
    label: "Movimiento del terreno",
    help: "Agrietamiento o deslizamiento del terreno, asentamiento bajo el edificio.",
  },
  {
    element: "otro_peligro",
    label: "Otro peligro",
    help: "Cualquier otro peligro relevante (especificar en notas).",
  },
];

/** B. Estructural — Evaluación Detallada (v2). */
export const STRUCTURAL_ELEMENTS: ElementDef[] = [
  { element: "fundaciones", label: "Fundaciones" },
  { element: "columnas", label: "Columnas" },
  { element: "vigas", label: "Vigas" },
  { element: "muros_estructurales", label: "Muros estructurales" },
  { element: "losas_techo", label: "Losas / techo" },
  { element: "diafragmas", label: "Diafragmas" },
  { element: "conexiones_nudos", label: "Conexiones / nudos" },
  { element: "arriostramientos", label: "Arriostramientos" },
];

/** C. No estructural — Evaluación Detallada (v2). */
export const NONSTRUCTURAL_ELEMENTS: ElementDef[] = [
  { element: "parapetos_ornamentos", label: "Parapetos / ornamentos" },
  { element: "fachada_vidrios", label: "Fachada / vidrios" },
  { element: "cielo_raso_luminarias", label: "Cielo raso / luminarias" },
  { element: "tabiques", label: "Tabiques" },
  { element: "escaleras_salidas", label: "Escaleras / salidas" },
  { element: "ascensores", label: "Ascensores" },
  { element: "servicios", label: "Servicios (gas/agua/electricidad)" },
  { element: "materiales_peligrosos", label: "Materiales peligrosos" },
];

/** D. Geotécnico — Evaluación Detallada (v2). */
export const GEOTECHNICAL_ELEMENTS: ElementDef[] = [
  { element: "falla_talud", label: "Falla de talud" },
  { element: "agrietamiento_suelo", label: "Agrietamiento del suelo" },
  { element: "asentamiento", label: "Asentamiento" },
  { element: "licuefaccion", label: "Licuefacción" },
];

export const ELEMENT_LABELS: Record<string, string> = Object.fromEntries(
  [...GENERAL_HAZARDS, ...STRUCTURAL_ELEMENTS, ...NONSTRUCTURAL_ELEMENTS, ...GEOTECHNICAL_ELEMENTS].map(
    (e) => [e.element, e.label],
  ),
);

export function getElementLabel(element: string): string {
  return ELEMENT_LABELS[element] ?? element;
}

// --- Guía de campo: patrones de daño ---------------------------------------

export const DAMAGE_PATTERNS: DamagePattern[] = [
  {
    id: "grieta_cosmetica",
    title: "Grieta cosmética (no estructural)",
    category: "cosmetica",
    severityHint: "leve",
    description: "Fisuras finas (< 1 mm) en acabados, frisos o tabiques, sin patrón diagonal definido.",
    whatToLookFor: "Líneas delgadas en revestimiento, mapeo superficial, sin desplazamiento ni continuidad hacia elementos estructurales.",
    implication: "Generalmente no compromete la seguridad. Reparable con resane.",
  },
  {
    id: "grieta_cortante_x",
    title: "Grieta en X por cortante",
    category: "estructural",
    severityHint: "severo",
    description: "Fisuras diagonales cruzadas (forma de X) en muros o columnas por esfuerzo cortante del sismo.",
    whatToLookFor: "Dos diagonales que se cruzan, a menudo anchas (> 2 mm), en mampostería o nudos. Indica demanda sísmica alta.",
    implication: "Daño estructural serio. Riesgo de pérdida de capacidad lateral. Tiende a ROJO/AMARILLO.",
  },
  {
    id: "grieta_flexion",
    title: "Falla por flexión",
    category: "estructural",
    severityHint: "moderado",
    description: "Grietas horizontales en vigas/columnas (tracción) en zonas de momento máximo, cerca de los apoyos.",
    whatToLookFor: "Fisuras perpendiculares al eje del elemento, en caras traccionadas; a veces fluencia del acero.",
    implication: "Daño estructural. Evaluar si hay pérdida de recubrimiento o pandeo de barras.",
  },
  {
    id: "aplastamiento_concreto",
    title: "Aplastamiento del concreto",
    category: "estructural",
    severityHint: "severo",
    description: "Trituración del concreto con desprendimiento de recubrimiento y exposición/pandeo de acero (típico en nudos y bases de columna).",
    whatToLookFor: "Concreto pulverizado, barras expuestas, estribos abiertos, acortamiento del elemento.",
    implication: "Compromiso grave de la capacidad de carga vertical. Fuerte indicio de ROJO.",
  },
  {
    id: "columna_corta",
    title: "Falla de columna corta",
    category: "estructural",
    severityHint: "severo",
    description: "Columna acortada por antepechos/muros parciales que concentra el cortante y falla en X de forma frágil.",
    whatToLookFor: "Columnas más cortas que sus vecinas (ventanas altas, mezzanines) con grietas diagonales y aplastamiento.",
    implication: "Falla frágil y peligrosa. Suele requerir evaluación detallada; tiende a ROJO.",
  },
  {
    id: "piso_blando",
    title: "Mecanismo de piso blando",
    category: "estructural",
    severityHint: "severo",
    description: "Planta baja mucho más flexible (comercio abierto, estacionamiento) que concentra el daño y puede colapsar ese nivel.",
    whatToLookFor: "Inclinación o desplome de la PB, columnas dañadas solo en planta baja, pisos superiores 'hundidos'.",
    implication: "Riesgo de colapso del nivel. Marcar piso blando; criterio conservador → ROJO/AMARILLO.",
  },
  {
    id: "separacion_terreno",
    title: "Asentamiento / movimiento del terreno",
    category: "geotecnica",
    severityHint: "moderado",
    description: "Hundimiento diferencial, grietas en el suelo o separación entre el edificio y aceras/escaleras exteriores.",
    whatToLookFor: "Escalones desnivelados, grietas en patios, puertas/ventanas desencuadradas, separación de juntas.",
    implication: "Puede indicar falla de fundación o del suelo. Recomendar evaluación geotécnica.",
  },
  {
    id: "volcamiento_no_estructural",
    title: "Peligro de caída (no estructural)",
    category: "estructural",
    severityHint: "moderado",
    description: "Parapetos, cornisas, fachadas, vidrios o equipos sueltos con riesgo de desprenderse sobre la vía.",
    whatToLookFor: "Elementos desprendidos o inclinados en altura, vidrios estrellados, antepechos agrietados.",
    implication: "Peligro para transeúntes. Acordonar la zona; suele implicar AMARILLO con barricadas.",
  },
];

// --- Guía de campo: árbol de decisión del cartel ---------------------------

export interface DecisionStep {
  question: string;
  ifYes: string;
  ifNo: string;
}
export const DECISION_TREE: DecisionStep[] = [
  {
    question: "¿Hay colapso, colapso parcial, inclinación global o el edificio salió de su fundación?",
    ifYes: "→ ROJO (INSEGURO). No entrar. Acordonar.",
    ifNo: "Continuar.",
  },
  {
    question: "¿Hay daño estructural severo y generalizado, o falla del terreno bajo el edificio?",
    ifYes: "→ ROJO (INSEGURO).",
    ifNo: "Continuar.",
  },
  {
    question: "¿La banda de daño global es ≥ 60%?",
    ifYes: "→ ROJO (INSEGURO).",
    ifNo: "Continuar.",
  },
  {
    question: "¿Hay daño moderado en elementos, peligros de caída localizados, o banda 30–60%?",
    ifYes: "→ AMARILLO (USO RESTRINGIDO). Limitar acceso; señalizar.",
    ifNo: "Continuar.",
  },
  {
    question: "¿Solo daños leves/nulos, sin peligros de caída ni de terreno?",
    ifYes: "→ VERDE (INSPECCIONADO). Reevaluar tras réplicas.",
    ifNo: "Ante la duda, usar el criterio más conservador (AMARILLO).",
  },
];

// --- Guía de campo: glosario -----------------------------------------------

export const GLOSSARY: GlossaryTerm[] = [
  { term: "ATC-20", definition: "Metodología del Applied Technology Council para evaluación rápida de seguridad de edificios tras un sismo." },
  { term: "COVENIN 1756", definition: "Norma venezolana de edificaciones sismorresistentes." },
  { term: "Cartel (placard)", definition: "Señal de resultado: verde (habitable), amarillo (uso restringido) o rojo (inseguro)." },
  { term: "Piso blando", definition: "Nivel mucho más flexible que los demás (p. ej. planta baja abierta), propenso a concentrar daño." },
  { term: "Columna corta", definition: "Columna acortada por muros parciales que falla de forma frágil por cortante." },
  { term: "Cortante", definition: "Esfuerzo lateral que produce grietas diagonales (en X) durante el sismo." },
  { term: "Racking", definition: "Distorsión angular de un muro o pórtico por desplazamiento lateral." },
  { term: "Edificio esencial", definition: "Hospital, escuela, bomberos, refugio: se evalúa con criterio más estricto." },
  { term: "Réplica", definition: "Sismo posterior al principal; puede agravar daños. Reevaluar siempre." },
  { term: "Diafragma", definition: "Elemento (losa) que distribuye las fuerzas sísmicas a los elementos verticales." },
];

// --- Inducción: mini-quiz de habilitación ----------------------------------

export const QUIZ_PASS_THRESHOLD = 0.8; // 80%

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "¿Qué significa un cartel ROJO?",
    options: [
      { id: "a", text: "El edificio es habitable" },
      { id: "b", text: "Inseguro: prohibido el ingreso" },
      { id: "c", text: "Uso restringido con precaución" },
    ],
    correct: "b",
    explanation: "Rojo = INSEGURO. Prohibido el ingreso por riesgo grave.",
  },
  {
    id: "q2",
    question: "Tras una réplica, ¿qué debe hacerse con un edificio ya inspeccionado?",
    options: [
      { id: "a", text: "Editar la inspección anterior" },
      { id: "b", text: "Crear una NUEVA inspección (re-inspección)" },
      { id: "c", text: "No hacer nada si ya tenía cartel" },
    ],
    correct: "b",
    explanation: "Nunca se sobrescribe el historial: una re-inspección es un registro nuevo.",
  },
  {
    id: "q3",
    question: "Una grieta diagonal en X ancha en un muro indica:",
    options: [
      { id: "a", text: "Daño cosmético sin importancia" },
      { id: "b", text: "Falla por cortante (daño estructural serio)" },
      { id: "c", text: "Humedad" },
    ],
    correct: "b",
    explanation: "La grieta en X es típica de falla por cortante: daño estructural serio.",
  },
  {
    id: "q4",
    question: "¿Por qué cada foto debe ir ligada a un hallazgo específico?",
    options: [
      { id: "a", text: "Para que el álbum se vea ordenado" },
      { id: "b", text: "Para que la evidencia respalde cada daño evaluado" },
      { id: "c", text: "No es necesario" },
    ],
    correct: "b",
    explanation: "La evidencia debe poder rastrearse al daño concreto; el 'álbum suelto' no sirve.",
  },
  {
    id: "q5",
    question: "Si dudas entre dos carteles, ¿qué criterio aplicas?",
    options: [
      { id: "a", text: "El menos restrictivo, para no alarmar" },
      { id: "b", text: "El más conservador (proteger vidas)" },
      { id: "c", text: "Lanzar una moneda" },
    ],
    correct: "b",
    explanation: "Ante la duda, prima la seguridad: usa el criterio más conservador.",
  },
];
