// Motor de scoring FUNVISIS / IMME-UCV (López et al. 2023). Funciones PURAS,
// sin dependencias de UI. Implementa EXACTAMENTE las reglas de la planilla
// oficial "Evaluación Rápida de Daños en Edificaciones":
//   Sección 2 → riesgo externo (con regla de corte C)
//   Sección 3 → riesgo por daño Severo/Completo (con regla de corte C)
//   Sección 4 → riesgo por daño Moderado (% máximo entre tipos de elemento)
//   Sección 5 → riesgo de componentes no estructurales
//   Sección 6 → riesgo global = el más desfavorable
// La capa ATC-20 se DERIVA del resultado: A→verde(INSPECTED),
// B→amarillo(RESTRICTED), C→rojo(UNSAFE). El inspector siempre puede endurecer
// la etiqueta; para suavizarla se exige razón obligatoria.

import type { Placard } from "@/lib/types";
import type {
  AspectLevel,
  ComponentsInspection,
  ElementCount,
  ElementCountType,
  ExternalInspection,
  RiskLevel,
  SevereCounts,
} from "./types";

const RISK_RANK: Record<RiskLevel, number> = { A: 0, B: 1, C: 2 };

/** El más desfavorable de una lista de riesgos (ignora null/undefined). */
export function worstRisk(risks: ReadonlyArray<RiskLevel | null | undefined>): RiskLevel | null {
  let worst: RiskLevel | null = null;
  for (const r of risks) {
    if (r == null) continue;
    if (worst === null || RISK_RANK[r] > RISK_RANK[worst]) worst = r;
  }
  return worst;
}

// ============================================================================
// Sección 2 — Riesgo Externo
// ============================================================================

/** Mapea cada aspecto de la inspección externa a su nivel a/b/c.
 *  Los aspectos no respondidos quedan fuera (undefined). */
export function externalAspectLevels(ext: ExternalInspection): {
  collapse?: AspectLevel;
  adjacentDanger?: AspectLevel;
  geoDanger?: AspectLevel;
  settlement?: AspectLevel;
  tilt?: AspectLevel;
} {
  const three = (v?: "no" | "moderado" | "elevado"): AspectLevel | undefined =>
    v === undefined ? undefined : v === "no" ? "a" : v === "moderado" ? "b" : "c";
  return {
    // Colapso no tiene nivel b: es 'no' (a) o 'posible parcial/total' (c).
    collapse:
      ext.extCollapse === undefined ? undefined : ext.extCollapse === "no" ? "a" : "c",
    adjacentDanger: three(ext.extAdjacentDanger),
    geoDanger: three(ext.extGeoDanger),
    settlement:
      ext.extSettlement === undefined
        ? undefined
        : ext.extSettlement === "no"
          ? "a"
          : ext.extSettlement === "hasta_20cm"
            ? "b"
            : "c",
    tilt:
      ext.extTilt === undefined
        ? undefined
        : ext.extTilt === "no"
          ? "a"
          : ext.extTilt === "hasta_2cm_60cm"
            ? "b"
            : "c",
  };
}

export function isExternalComplete(ext: ExternalInspection): boolean {
  return (
    ext.extCollapse !== undefined &&
    ext.extAdjacentDanger !== undefined &&
    ext.extGeoDanger !== undefined &&
    ext.extSettlement !== undefined &&
    ext.extTilt !== undefined
  );
}

/** Riesgo externo: A si todos a; B si b≥1 y c=0; C si c≥1.
 *  Devuelve null si falta algún aspecto por responder. */
export function scoreExternal(ext: ExternalInspection): RiskLevel | null {
  if (!isExternalComplete(ext)) return null;
  const levels = Object.values(externalAspectLevels(ext)) as AspectLevel[];
  if (levels.some((l) => l === "c")) return "C";
  if (levels.some((l) => l === "b")) return "B";
  return "A";
}

// ============================================================================
// Sección 3 — Riesgo estructural por daño Severo/Completo
// ============================================================================

export function totalSevereMembers(counts: SevereCounts): number {
  return (
    counts.nSevereColumns +
    counts.nSevereConcreteWalls +
    counts.nSevereMasonryWalls +
    counts.nSevereBeams
  );
}

/** N = 0 → A (continuar); N ≥ 1 → C (corte: etiqueta roja, omitir 4 y 5). */
export function scoreSevere(counts: SevereCounts): Extract<RiskLevel, "A" | "C"> {
  return totalSevereMembers(counts) >= 1 ? "C" : "A";
}

// ============================================================================
// Sección 4 — Riesgo estructural por daño Moderado
// ============================================================================

/** % moderado de una fila de conteos, redondeado a 1 decimal (igual que la
 *  columna generada pct_moderate de la BD). */
export function pctModerate(row: Pick<ElementCount, "nNoMinor" | "nModerate">): number {
  const examined = row.nNoMinor + row.nModerate;
  if (examined <= 0) return 0;
  return Math.round((1000 * row.nModerate) / examined) / 10;
}

/** El riesgo se califica con el MAYOR % entre los tipos de elemento con
 *  miembros examinados. Devuelve null si no hay filas cuantificables. */
export function maxPctModerate(counts: ReadonlyArray<ElementCount>): number | null {
  const pcts = counts
    .filter((c) => c.nNoMinor + c.nModerate > 0)
    .map((c) => pctModerate(c));
  if (pcts.length === 0) return null;
  return Math.max(...pcts);
}

/** Regla oficial: < 10% → A; 10% a 30% (inclusive) → B; > 30% → C. */
export function riskFromModeratePct(pct: number): RiskLevel {
  if (pct < 10) return "A";
  if (pct <= 30) return "B";
  return "C";
}

export interface ModerateResult {
  risk: RiskLevel | null;
  /** % usado para calificar (máximo entre elementos, o estimación manual). */
  pct: number | null;
  /** true si se usó la estimación manual del inspector. */
  usedEstimate: boolean;
}

/** Sección 4 completa: usa los conteos; si no fue posible cuantificar
 *  (sin filas con miembros examinados), usa la estimación manual. */
export function scoreModerate(
  counts: ReadonlyArray<ElementCount>,
  moderatePctEstimated?: number | null,
): ModerateResult {
  const maxPct = maxPctModerate(counts);
  if (maxPct !== null) {
    return { risk: riskFromModeratePct(maxPct), pct: maxPct, usedEstimate: false };
  }
  if (moderatePctEstimated != null) {
    return {
      risk: riskFromModeratePct(moderatePctEstimated),
      pct: moderatePctEstimated,
      usedEstimate: true,
    };
  }
  return { risk: null, pct: null, usedEstimate: false };
}

// ============================================================================
// Sección 5 — Riesgo de componentes no estructurales
// ============================================================================

/** Fuga de gas fuerza el componente de servicios (gas/agua/electricidad) a c. */
export function effectiveComponents(comp: ComponentsInspection): ComponentsInspection {
  if (!comp.gasLeak) return comp;
  return { ...comp, compUtilities: "c" };
}

export function isComponentsComplete(comp: ComponentsInspection): boolean {
  const c = effectiveComponents(comp);
  return (
    c.compSlabs !== undefined &&
    c.compWallsStairsFacades !== undefined &&
    c.compTanksAntennas !== undefined &&
    c.compUtilities !== undefined &&
    c.compElevators !== undefined
  );
}

/** Regla oficial: A si todos a Ó exactamente un b y cero c ("Todos a ó b=1");
 *  B si b≥2 y c=0; C si c≥1. Devuelve null si falta algún componente. */
export function scoreComponents(comp: ComponentsInspection): RiskLevel | null {
  if (!isComponentsComplete(comp)) return null;
  const c = effectiveComponents(comp);
  const levels: AspectLevel[] = [
    c.compSlabs!,
    c.compWallsStairsFacades!,
    c.compTanksAntennas!,
    c.compUtilities!,
    c.compElevators!,
  ];
  const nB = levels.filter((l) => l === "b").length;
  const nC = levels.filter((l) => l === "c").length;
  if (nC >= 1) return "C";
  if (nB >= 2) return "B";
  return "A"; // todos a, o exactamente un b
}

// ============================================================================
// Sección 6 — Riesgo global, etiqueta y reglas de corte
// ============================================================================

/** Mapeo dual FUNVISIS → ATC-20: A→verde(INSPECTED), B→amarillo(RESTRICTED),
 *  C→rojo(UNSAFE). */
export function riskToPlacard(risk: RiskLevel): Extract<Placard, "verde" | "amarillo" | "rojo"> {
  return risk === "A" ? "verde" : risk === "B" ? "amarillo" : "rojo";
}

export function placardToRisk(placard: Placard): RiskLevel | null {
  switch (placard) {
    case "verde":
      return "A";
    case "amarillo":
      return "B";
    case "rojo":
      return "C";
    default:
      return null;
  }
}

/** Etiquetas de la Sección 6. Sublabels = recomendación de acceso OFICIAL de
 *  la planilla (Acceso permitido / restringido / no permitido). */
export const FUNVISIS_PLACARD_META: Record<
  RiskLevel,
  { label: string; sublabel: string; atc20: "INSPECTED" | "RESTRICTED" | "UNSAFE"; color: string }
> = {
  A: { label: "HABITABLE", sublabel: "Acceso permitido", atc20: "INSPECTED", color: "#16a34a" },
  B: { label: "ATENCIÓN", sublabel: "Acceso restringido", atc20: "RESTRICTED", color: "#d97706" },
  C: { label: "PELIGRO", sublabel: "Acceso no permitido", atc20: "UNSAFE", color: "#dc2626" },
};

/** NOTA IMPORTANTE oficial (pie de la planilla) + advertencia de las etiquetas. */
export const FUNVISIS_DISCLAIMER =
  "NOTA IMPORTANTE: Pueden existir situaciones no previstas que se escapan al " +
  "alcance de esta inspección. El responsable de la edificación y sus residentes " +
  "deben solicitar hacer los estudios adicionales y reparaciones requeridas. Las " +
  "condiciones de estabilidad de la edificación pueden cambiar y en dicho caso " +
  "deberán pedir una nueva evaluación a las autoridades. Esta decisión no " +
  "garantiza la seguridad ante eventos futuros adversos.";

export interface FunvisisInput {
  external: ExternalInspection;
  severe?: SevereCounts;
  elementCounts?: ReadonlyArray<ElementCount>;
  moderatePctEstimated?: number | null;
  components?: ComponentsInspection;
}

export interface FunvisisResult {
  riskExternal: RiskLevel | null;
  /** null cuando la sección se OMITE por regla de corte (o está incompleta). */
  riskSevere: Extract<RiskLevel, "A" | "C"> | null;
  riskModerate: RiskLevel | null;
  riskComponents: RiskLevel | null;
  moderatePct: number | null;
  riskOverall: RiskLevel | null;
  placardSuggested: Placard;
  /** Secciones de la planilla omitidas por regla de corte (3, 4, 5). */
  skippedSections: number[];
  /** Sección a la que la UI debe saltar (6 = Decisión final) o null. */
  cutTriggeredBy: "external" | "severe" | null;
}

/** Evalúa la planilla completa aplicando las REGLAS DE CORTE:
 *  - riesgo externo C → global C, secciones 3, 4 y 5 omitidas (null);
 *  - N severo ≥ 1 → global C, secciones 4 y 5 omitidas (null). */
export function computeFunvisis(input: FunvisisInput): FunvisisResult {
  const riskExternal = scoreExternal(input.external);

  // Regla de corte 1: riesgo externo Alto → no continuar la inspección interna.
  if (riskExternal === "C") {
    return {
      riskExternal,
      riskSevere: null,
      riskModerate: null,
      riskComponents: null,
      moderatePct: null,
      riskOverall: "C",
      placardSuggested: "rojo",
      skippedSections: [3, 4, 5],
      cutTriggeredBy: "external",
    };
  }

  const riskSevere = input.severe ? scoreSevere(input.severe) : null;

  // Regla de corte 2: cualquier miembro con daño Severo/Completo → rojo.
  if (riskSevere === "C") {
    return {
      riskExternal,
      riskSevere,
      riskModerate: null,
      riskComponents: null,
      moderatePct: null,
      riskOverall: "C",
      placardSuggested: "rojo",
      skippedSections: [4, 5],
      cutTriggeredBy: "severe",
    };
  }

  const moderate = scoreModerate(input.elementCounts ?? [], input.moderatePctEstimated);
  const riskComponents = input.components ? scoreComponents(input.components) : null;

  const riskOverall = worstRisk([riskExternal, riskSevere, moderate.risk, riskComponents]);

  return {
    riskExternal,
    riskSevere,
    riskModerate: moderate.risk,
    riskComponents,
    moderatePct: moderate.pct,
    riskOverall,
    placardSuggested: riskOverall ? riskToPlacard(riskOverall) : "none",
    skippedSections: [],
    cutTriggeredBy: null,
  };
}

// ============================================================================
// Override manual de la etiqueta
// ============================================================================

const PLACARD_RANK: Partial<Record<Placard, number>> = { verde: 0, amarillo: 1, rojo: 2 };

/** El inspector puede ENDURECER la etiqueta siempre; SUAVIZARLA exige razón. */
export function overrideNeedsReason(suggested: Placard, final: Placard): boolean {
  const s = PLACARD_RANK[suggested];
  const f = PLACARD_RANK[final];
  if (s === undefined || f === undefined) return false;
  return f < s; // suavizar = elegir una etiqueta menos severa que la sugerida
}

// ============================================================================
// Tabla de criterios de daño (2.6) + sugerencia de severidad por ancho de grieta
// ============================================================================

/** Clasificación FUNVISIS del daño de un miembro. */
export type DamageGrade = "sin_dano_leve" | "moderado" | "severo_completo";

export interface DamageCriterion {
  /** Tipo de elemento de la tabla oficial. */
  element: "concreto_elemento" | "muro_concreto" | "muro_mamposteria" | "acero_elemento";
  label: string;
  sinDanoLeve: string;
  moderado: string;
  severoCompleto: string;
  /** Umbrales de ancho de grieta en mm [leve<, moderado≤]; null si el criterio
   *  no es por grietas (acero: deformaciones/pandeo). */
  crackThresholdsMm: { minor: number; moderate: number } | null;
}

/** Tabla oficial de criterios de daño (planilla FUNVISIS, dorso). */
export const DAMAGE_CRITERIA: readonly DamageCriterion[] = [
  {
    element: "concreto_elemento",
    label: "Columna / viga / losa / unión de concreto armado",
    sinDanoLeve: "Grietas < 1 mm",
    moderado: "Grietas de 1–2 mm",
    severoCompleto:
      "Grietas > 2 mm, caída del recubrimiento, pandeo o fractura de barras, desplazamiento residual",
    crackThresholdsMm: { minor: 1, moderate: 2 },
  },
  {
    element: "muro_concreto",
    label: "Muro de concreto armado",
    sinDanoLeve: "Grietas < 2 mm",
    moderado: "Grietas de 2–6 mm",
    severoCompleto: "Grietas > 6 mm, caída del recubrimiento, pandeo de barras",
    crackThresholdsMm: { minor: 2, moderate: 6 },
  },
  {
    element: "muro_mamposteria",
    label: "Pared de relleno de mampostería",
    sinDanoLeve: "Grietas < 1 mm",
    moderado: "Grietas de 1–10 mm, diagonales, desprendimiento de zonas",
    severoCompleto: "Derrumbe parcial o total",
    crackThresholdsMm: { minor: 1, moderate: 10 },
  },
  {
    element: "acero_elemento",
    label: "Columna / viga / unión de acero",
    sinDanoLeve: "Deformaciones casi imperceptibles",
    moderado: "Pandeo incipiente en secciones",
    severoCompleto: "Pandeo local, fractura en sección / soldadura / tornillos / placa base",
    crackThresholdsMm: null,
  },
] as const;

/** Tipo de criterio aplicable a cada tipo de elemento de la Sección 4.
 *  `steel` = true cuando el material del edificio es acero (columna/viga). */
export function criterionForElementType(
  elementType: ElementCountType,
  steel = false,
): DamageCriterion {
  const find = (el: DamageCriterion["element"]): DamageCriterion =>
    DAMAGE_CRITERIA.find((c) => c.element === el)!;
  switch (elementType) {
    case "muro_concreto":
      return find("muro_concreto");
    case "muro_mamposteria":
      return find("muro_mamposteria");
    case "columna_union":
    case "viga_arriostramiento":
      return steel ? find("acero_elemento") : find("concreto_elemento");
  }
}

/** Sugiere la severidad según el ancho de grieta medido (fisurómetro digital)
 *  y el tipo de elemento. SOLO sugiere: el inspector confirma. Devuelve null
 *  si el criterio del elemento no es por grietas (acero) o el ancho no es
 *  válido. */
export function suggestGradeFromCrackWidth(
  elementType: ElementCountType,
  crackWidthMm: number,
  steel = false,
): DamageGrade | null {
  if (!Number.isFinite(crackWidthMm) || crackWidthMm < 0) return null;
  const criterion = criterionForElementType(elementType, steel);
  if (!criterion.crackThresholdsMm) return null;
  const { minor, moderate } = criterion.crackThresholdsMm;
  if (crackWidthMm < minor) return "sin_dano_leve";
  if (crackWidthMm <= moderate) return "moderado";
  return "severo_completo";
}
