// Lógica de sugerencia de cartel (ATC-20 adaptado). PURA y testeable.
// IMPORTANTE: solo SUGIERE. El inspector siempre puede anular (placardFinal).

import type { DamageBand, DetailedEval, Finding, Placard, Severity } from "./types";

export const SEVERITY_RANK: Record<Severity, number> = {
  ninguno: 0,
  leve: 1,
  moderado: 2,
  severo: 3,
};

/** Peligros generales que comprometen el EDIFICIO ENTERO. */
const WHOLE_BUILDING_GENERAL = new Set([
  "colapso_total_parcial",
  "inclinacion",
  "dano_estructural_visible",
  "movimiento_terreno",
]);
/** Peligros generales LOCALIZADOS (zona, no todo el edificio). */
const LOCALIZED_GENERAL = new Set(["peligro_caida", "otro_peligro"]);

const HIGH_DAMAGE: DamageBand[] = ["60-100", "100"];
const MID_DAMAGE: DamageBand[] = ["30-60"];

export interface PlacardInput {
  findings: Pick<Finding, "category" | "element" | "severity">[];
  damageBand?: DamageBand;
  isEssential?: boolean;
}

export interface PlacardSuggestion {
  placard: Placard;
  reasons: string[];
  barricadesNeeded: boolean;
  detailedEvalRecommended: DetailedEval[];
  defaultEntryRestrictions: string;
}

export function suggestPlacard(input: PlacardInput): PlacardSuggestion {
  const { findings, damageBand, isEssential } = input;
  const reasons: string[] = [];

  const sev = (f: Pick<Finding, "category" | "element" | "severity">) => SEVERITY_RANK[f.severity];
  const maxWhere = (pred: (f: PlacardInput["findings"][number]) => boolean) =>
    findings.filter(pred).reduce((m, f) => Math.max(m, sev(f)), 0);

  const wholeBuildingSev = maxWhere(
    (f) =>
      (f.category === "peligro_general" && WHOLE_BUILDING_GENERAL.has(f.element)) ||
      f.category === "estructural" ||
      f.category === "geotecnico",
  );
  const localizedSev = maxWhere(
    (f) => f.category === "peligro_general" && LOCALIZED_GENERAL.has(f.element),
  );
  const nonStructuralSev = maxWhere((f) => f.category === "no_estructural");
  const anyModerateOrWorse = findings.some((f) => sev(f) >= SEVERITY_RANK.moderado);
  const anyRecorded = findings.length > 0 || !!damageBand;

  let placard: Placard = "none";

  // --- ROJO: peligro al edificio entero ---
  if (wholeBuildingSev >= SEVERITY_RANK.severo) {
    placard = "rojo";
    reasons.push("Daño severo que compromete el edificio entero (colapso, inclinación, falla estructural o de terreno).");
  } else if (damageBand && HIGH_DAMAGE.includes(damageBand)) {
    placard = "rojo";
    reasons.push(`Banda de daño global muy alta (${damageBand}%).`);
  } else if (anyRecorded) {
    // --- AMARILLO: condiciones severas localizadas o estado general moderado ---
    const yellowTriggers: string[] = [];
    if (wholeBuildingSev >= SEVERITY_RANK.moderado)
      yellowTriggers.push("Daño moderado en elementos del edificio.");
    if (localizedSev >= SEVERITY_RANK.moderado)
      yellowTriggers.push("Peligro de caída localizado (fachada/parapeto/ornamento).");
    if (nonStructuralSev >= SEVERITY_RANK.severo)
      yellowTriggers.push("Daño no estructural severo (salidas, escaleras, servicios).");
    if (damageBand && MID_DAMAGE.includes(damageBand))
      yellowTriggers.push(`Banda de daño global intermedia (${damageBand}%).`);

    if (yellowTriggers.length > 0) {
      placard = "amarillo";
      reasons.push(...yellowTriggers);
    } else {
      // --- VERDE: solo leve/ninguno, sin peligros de caída ni de terreno ---
      placard = "verde";
      reasons.push("Solo daños leves o nulos; sin peligros de caída ni de terreno.");
    }
  }

  // --- Criterio conservador para edificios esenciales ---
  // Escala también por banda de daño (no solo por hallazgos): un esencial con
  // banda 30-60% sin hallazgos también debe endurecerse.
  const essentialEscalate =
    anyModerateOrWorse ||
    (!!damageBand && (MID_DAMAGE.includes(damageBand) || HIGH_DAMAGE.includes(damageBand)));
  if (isEssential && essentialEscalate) {
    if (placard === "verde") {
      placard = "amarillo";
      reasons.push("Edificio esencial con daño moderado: se aplica criterio más conservador.");
    } else if (placard === "amarillo" && (wholeBuildingSev >= SEVERITY_RANK.moderado || (damageBand && MID_DAMAGE.includes(damageBand)))) {
      placard = "rojo";
      reasons.push("Edificio esencial con daño estructural moderado o banda de daño alta: se eleva a INSEGURO.");
    }
  }

  // --- Recomendaciones de evaluación detallada ---
  const detailedEvalRecommended: DetailedEval[] = [];
  if (
    placard === "rojo" ||
    maxWhere((f) => f.category === "estructural") >= SEVERITY_RANK.moderado ||
    findings.some(
      (f) => f.category === "peligro_general" && WHOLE_BUILDING_GENERAL.has(f.element) && sev(f) >= SEVERITY_RANK.moderado,
    )
  ) {
    detailedEvalRecommended.push("estructural");
  }
  if (
    maxWhere((f) => f.category === "geotecnico") >= SEVERITY_RANK.leve ||
    findings.some((f) => f.element === "movimiento_terreno" && sev(f) >= SEVERITY_RANK.leve)
  ) {
    detailedEvalRecommended.push("geotecnico");
  }

  // --- Barricadas ---
  const barricadesNeeded =
    placard === "rojo" ||
    findings.some(
      (f) => f.category === "peligro_general" && LOCALIZED_GENERAL.has(f.element) && sev(f) >= SEVERITY_RANK.severo,
    );

  return {
    placard,
    reasons,
    barricadesNeeded,
    detailedEvalRecommended,
    defaultEntryRestrictions: PLACARD_META[placard].defaultRestrictions,
  };
}

export const PLACARD_META: Record<
  Placard,
  {
    label: string;
    sublabel: string;
    color: string;
    textOn: string;
    instruction: string;
    defaultRestrictions: string;
  }
> = {
  verde: {
    label: "INSPECCIONADO",
    sublabel: "Ingreso permitido",
    color: "#16a34a",
    textOn: "#ffffff",
    instruction:
      "No se observó peligro aparente. El edificio puede ocuparse. Reportar nuevos daños, especialmente tras réplicas.",
    defaultRestrictions: "Ninguna restricción. Reevaluar tras réplicas significativas.",
  },
  amarillo: {
    label: "USO RESTRINGIDO",
    sublabel: "Acceso limitado",
    color: "#d97706",
    textOn: "#ffffff",
    instruction:
      "Existen peligros. El ingreso es limitado: solo entradas breves y necesarias, evitando las áreas señaladas. Se requiere evaluación adicional.",
    defaultRestrictions:
      "Acceso limitado. No usar las áreas señaladas. Entrada breve solo para retirar pertenencias esenciales, bajo precaución.",
  },
  rojo: {
    label: "INSEGURO",
    sublabel: "Prohibido el ingreso",
    color: "#dc2626",
    textOn: "#ffffff",
    instruction:
      "Peligro grave. PROHIBIDO EL INGRESO por cualquier motivo. Mantener distancia; señalizar y acordonar el perímetro.",
    defaultRestrictions: "PROHIBIDO EL INGRESO. Peligro de colapso. No entrar por ningún motivo.",
  },
  none: {
    label: "SIN CLASIFICAR",
    sublabel: "Evaluación incompleta",
    color: "#64748b",
    textOn: "#ffffff",
    instruction: "La evaluación no ha sido completada.",
    defaultRestrictions: "",
  },
};
