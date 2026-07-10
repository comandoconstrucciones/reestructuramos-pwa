// Tests del motor de scoring FUNVISIS (reglas exactas de la planilla oficial).
import { describe, expect, it } from "vitest";
import {
  computeFunvisis,
  externalAspectLevels,
  maxPctModerate,
  overrideNeedsReason,
  pctModerate,
  riskFromModeratePct,
  riskToPlacard,
  scoreComponents,
  scoreExternal,
  scoreModerate,
  scoreSevere,
  suggestGradeFromCrackWidth,
  totalSevereMembers,
  worstRisk,
} from "./scoring";
import type {
  ComponentsInspection,
  ElementCount,
  ExternalInspection,
  SevereCounts,
} from "./types";

const EXT_ALL_A: ExternalInspection = {
  extCollapse: "no",
  extAdjacentDanger: "no",
  extGeoDanger: "no",
  extSettlement: "no",
  extTilt: "no",
};

const SEVERE_ZERO: SevereCounts = {
  nSevereColumns: 0,
  nSevereConcreteWalls: 0,
  nSevereMasonryWalls: 0,
  nSevereBeams: 0,
};

const COMP_ALL_A: ComponentsInspection = {
  compSlabs: "a",
  compWallsStairsFacades: "a",
  compTanksAntennas: "a",
  compUtilities: "a",
  compElevators: "a",
  gasLeak: false,
};

function counts(rows: Array<[ElementCount["elementType"], number, number]>): ElementCount[] {
  return rows.map(([elementType, nNoMinor, nModerate]) => ({ elementType, nNoMinor, nModerate }));
}

// ---------------------------------------------------------------------------
// Sección 2 — Riesgo externo
// ---------------------------------------------------------------------------

describe("scoreExternal (Sección 2)", () => {
  it("todos los aspectos en a → A", () => {
    expect(scoreExternal(EXT_ALL_A)).toBe("A");
  });

  it("un solo b (sin c) → B", () => {
    expect(scoreExternal({ ...EXT_ALL_A, extAdjacentDanger: "moderado" })).toBe("B");
    expect(scoreExternal({ ...EXT_ALL_A, extSettlement: "hasta_20cm" })).toBe("B");
    expect(scoreExternal({ ...EXT_ALL_A, extTilt: "hasta_2cm_60cm" })).toBe("B");
  });

  it("varios b sin c siguen siendo B", () => {
    expect(
      scoreExternal({
        ...EXT_ALL_A,
        extAdjacentDanger: "moderado",
        extGeoDanger: "moderado",
        extSettlement: "hasta_20cm",
      }),
    ).toBe("B");
  });

  it("cualquier c → C", () => {
    expect(scoreExternal({ ...EXT_ALL_A, extGeoDanger: "elevado" })).toBe("C");
    expect(scoreExternal({ ...EXT_ALL_A, extSettlement: "mayor_20cm" })).toBe("C");
    expect(scoreExternal({ ...EXT_ALL_A, extTilt: "mayor_2cm_60cm" })).toBe("C");
  });

  it("colapso posible → C (no existe nivel b para colapso)", () => {
    expect(scoreExternal({ ...EXT_ALL_A, extCollapse: "posible_parcial_total" })).toBe("C");
    const levels = externalAspectLevels({ ...EXT_ALL_A, extCollapse: "posible_parcial_total" });
    expect(levels.collapse).toBe("c");
  });

  it("incompleta → null (no se puede calificar)", () => {
    expect(scoreExternal({ extCollapse: "no" })).toBeNull();
    expect(scoreExternal({})).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Sección 3 — Daño Severo/Completo
// ---------------------------------------------------------------------------

describe("scoreSevere (Sección 3)", () => {
  it("N = 0 → A (continuar inspección)", () => {
    expect(scoreSevere(SEVERE_ZERO)).toBe("A");
  });

  it("N ≥ 1 en cualquier contador → C", () => {
    expect(scoreSevere({ ...SEVERE_ZERO, nSevereColumns: 1 })).toBe("C");
    expect(scoreSevere({ ...SEVERE_ZERO, nSevereConcreteWalls: 1 })).toBe("C");
    expect(scoreSevere({ ...SEVERE_ZERO, nSevereMasonryWalls: 2 })).toBe("C");
    expect(scoreSevere({ ...SEVERE_ZERO, nSevereBeams: 3 })).toBe("C");
  });

  it("N suma los cuatro contadores", () => {
    expect(
      totalSevereMembers({
        nSevereColumns: 1,
        nSevereConcreteWalls: 2,
        nSevereMasonryWalls: 3,
        nSevereBeams: 4,
      }),
    ).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// Sección 4 — Daño Moderado (bordes 10% / 30%)
// ---------------------------------------------------------------------------

describe("riskFromModeratePct (Sección 4)", () => {
  it("9.9% → A (borde inferior exclusivo)", () => {
    expect(riskFromModeratePct(9.9)).toBe("A");
  });
  it("10% → B (inclusivo)", () => {
    expect(riskFromModeratePct(10)).toBe("B");
  });
  it("30% → B (inclusivo)", () => {
    expect(riskFromModeratePct(30)).toBe("B");
  });
  it("30.1% → C (borde superior exclusivo)", () => {
    expect(riskFromModeratePct(30.1)).toBe("C");
  });
  it("0% → A y 100% → C", () => {
    expect(riskFromModeratePct(0)).toBe("A");
    expect(riskFromModeratePct(100)).toBe("C");
  });
});

describe("pctModerate / maxPctModerate", () => {
  it("calcula % con redondeo a 1 decimal (igual que la BD)", () => {
    expect(pctModerate({ nNoMinor: 9, nModerate: 1 })).toBe(10);
    expect(pctModerate({ nNoMinor: 2, nModerate: 1 })).toBe(33.3);
    expect(pctModerate({ nNoMinor: 0, nModerate: 0 })).toBe(0);
  });

  it("usa el MAYOR % entre los tipos de elemento", () => {
    const rows = counts([
      ["columna_union", 19, 1], // 5%
      ["muro_mamposteria", 6, 4], // 40%
      ["viga_arriostramiento", 10, 0], // 0%
    ]);
    expect(maxPctModerate(rows)).toBe(40);
    expect(scoreModerate(rows).risk).toBe("C");
  });

  it("ignora filas sin miembros examinados", () => {
    expect(maxPctModerate(counts([["muro_concreto", 0, 0]]))).toBeNull();
  });
});

describe("scoreModerate — estimación manual", () => {
  it("sin conteos usa moderate_pct_estimated", () => {
    const r = scoreModerate([], 15);
    expect(r.risk).toBe("B");
    expect(r.usedEstimate).toBe(true);
    expect(r.pct).toBe(15);
  });

  it("con conteos NO usa la estimación", () => {
    const r = scoreModerate(counts([["columna_union", 19, 1]]), 90);
    expect(r.risk).toBe("A");
    expect(r.usedEstimate).toBe(false);
  });

  it("sin conteos ni estimación → null", () => {
    expect(scoreModerate([]).risk).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Sección 5 — Componentes no estructurales
// ---------------------------------------------------------------------------

describe("scoreComponents (Sección 5)", () => {
  it("todos a → A", () => {
    expect(scoreComponents(COMP_ALL_A)).toBe("A");
  });

  it("exactamente un b y cero c → A (regla oficial 'Todos a ó b=1')", () => {
    expect(scoreComponents({ ...COMP_ALL_A, compSlabs: "b" })).toBe("A");
  });

  it("dos b y cero c → B", () => {
    expect(scoreComponents({ ...COMP_ALL_A, compSlabs: "b", compElevators: "b" })).toBe("B");
  });

  it("un c → C (aunque el resto sea a)", () => {
    expect(scoreComponents({ ...COMP_ALL_A, compTanksAntennas: "c" })).toBe("C");
  });

  it("gas_leak fuerza compUtilities a c → C", () => {
    expect(scoreComponents({ ...COMP_ALL_A, gasLeak: true })).toBe("C");
  });

  it("gas_leak completa la sección aunque compUtilities no esté respondido", () => {
    expect(
      scoreComponents({
        compSlabs: "a",
        compWallsStairsFacades: "a",
        compTanksAntennas: "a",
        compElevators: "a",
        gasLeak: true,
      }),
    ).toBe("C");
  });

  it("incompleta → null", () => {
    expect(scoreComponents({ compSlabs: "a" })).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Sección 6 — Riesgo global + reglas de corte
// ---------------------------------------------------------------------------

describe("worstRisk / riskToPlacard", () => {
  it("el global es el más desfavorable", () => {
    expect(worstRisk(["A", "B", "A"])).toBe("B");
    expect(worstRisk(["A", "C", "B"])).toBe("C");
    expect(worstRisk(["A", "A"])).toBe("A");
  });
  it("ignora secciones omitidas (null)", () => {
    expect(worstRisk(["B", null, undefined])).toBe("B");
    expect(worstRisk([null, undefined])).toBeNull();
  });
  it("mapeo dual A/B/C → verde/amarillo/rojo", () => {
    expect(riskToPlacard("A")).toBe("verde");
    expect(riskToPlacard("B")).toBe("amarillo");
    expect(riskToPlacard("C")).toBe("rojo");
  });
});

describe("computeFunvisis — planilla completa", () => {
  it("todo limpio → A, etiqueta verde, sin cortes", () => {
    const r = computeFunvisis({
      external: EXT_ALL_A,
      severe: SEVERE_ZERO,
      elementCounts: counts([["columna_union", 20, 0]]),
      components: COMP_ALL_A,
    });
    expect(r.riskExternal).toBe("A");
    expect(r.riskSevere).toBe("A");
    expect(r.riskModerate).toBe("A");
    expect(r.riskComponents).toBe("A");
    expect(r.riskOverall).toBe("A");
    expect(r.placardSuggested).toBe("verde");
    expect(r.skippedSections).toEqual([]);
    expect(r.cutTriggeredBy).toBeNull();
  });

  it("REGLA DE CORTE: colapso posible → C, roja, omite secciones 3, 4 y 5", () => {
    const r = computeFunvisis({
      external: { ...EXT_ALL_A, extCollapse: "posible_parcial_total" },
      severe: SEVERE_ZERO,
      elementCounts: counts([["columna_union", 20, 0]]),
      components: COMP_ALL_A,
    });
    expect(r.riskExternal).toBe("C");
    expect(r.riskSevere).toBeNull();
    expect(r.riskModerate).toBeNull();
    expect(r.riskComponents).toBeNull();
    expect(r.riskOverall).toBe("C");
    expect(r.placardSuggested).toBe("rojo");
    expect(r.skippedSections).toEqual([3, 4, 5]);
    expect(r.cutTriggeredBy).toBe("external");
  });

  it("REGLA DE CORTE: N=1 severo → C, roja, omite secciones 4 y 5", () => {
    const r = computeFunvisis({
      external: EXT_ALL_A,
      severe: { ...SEVERE_ZERO, nSevereColumns: 1 },
      elementCounts: counts([["columna_union", 20, 0]]),
      components: COMP_ALL_A,
    });
    expect(r.riskSevere).toBe("C");
    expect(r.riskModerate).toBeNull();
    expect(r.riskComponents).toBeNull();
    expect(r.riskOverall).toBe("C");
    expect(r.placardSuggested).toBe("rojo");
    expect(r.skippedSections).toEqual([4, 5]);
    expect(r.cutTriggeredBy).toBe("severe");
  });

  it("overall = peor sección: externo B + moderado B + componentes C → C", () => {
    const r = computeFunvisis({
      external: { ...EXT_ALL_A, extAdjacentDanger: "moderado" },
      severe: SEVERE_ZERO,
      elementCounts: counts([["muro_mamposteria", 8, 2]]), // 20% → B
      components: { ...COMP_ALL_A, compUtilities: "c" },
    });
    expect(r.riskExternal).toBe("B");
    expect(r.riskModerate).toBe("B");
    expect(r.riskComponents).toBe("C");
    expect(r.riskOverall).toBe("C");
    expect(r.placardSuggested).toBe("rojo");
  });

  it("externo B con el resto A → B, etiqueta amarilla", () => {
    const r = computeFunvisis({
      external: { ...EXT_ALL_A, extTilt: "hasta_2cm_60cm" },
      severe: SEVERE_ZERO,
      elementCounts: counts([["columna_union", 20, 1]]), // 4.8% → A
      components: COMP_ALL_A,
    });
    expect(r.riskOverall).toBe("B");
    expect(r.placardSuggested).toBe("amarillo");
  });

  it("bordes 10%/30% se propagan al global", () => {
    const base = { external: EXT_ALL_A, severe: SEVERE_ZERO, components: COMP_ALL_A };
    expect(
      computeFunvisis({ ...base, elementCounts: counts([["muro_concreto", 90, 10]]) }).riskOverall,
    ).toBe("B"); // exactamente 10%
    expect(
      computeFunvisis({ ...base, elementCounts: counts([["muro_concreto", 70, 30]]) }).riskOverall,
    ).toBe("B"); // exactamente 30%
    expect(
      computeFunvisis({ ...base, elementCounts: counts([["muro_concreto", 6, 4]]) }).riskOverall,
    ).toBe("C"); // 40% > 30%
  });
});

// ---------------------------------------------------------------------------
// Override manual de la etiqueta
// ---------------------------------------------------------------------------

describe("overrideNeedsReason", () => {
  it("endurecer NUNCA exige razón (verde→amarillo, verde→rojo, amarillo→rojo)", () => {
    expect(overrideNeedsReason("verde", "amarillo")).toBe(false);
    expect(overrideNeedsReason("verde", "rojo")).toBe(false);
    expect(overrideNeedsReason("amarillo", "rojo")).toBe(false);
  });

  it("suavizar SIEMPRE exige razón (rojo→amarillo, rojo→verde, amarillo→verde)", () => {
    expect(overrideNeedsReason("rojo", "amarillo")).toBe(true);
    expect(overrideNeedsReason("rojo", "verde")).toBe(true);
    expect(overrideNeedsReason("amarillo", "verde")).toBe(true);
  });

  it("misma etiqueta o sin sugerencia → sin razón", () => {
    expect(overrideNeedsReason("amarillo", "amarillo")).toBe(false);
    expect(overrideNeedsReason("none", "rojo")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Fisurómetro digital: sugerencia por ancho de grieta (tabla DAMAGE_CRITERIA)
// ---------------------------------------------------------------------------

describe("suggestGradeFromCrackWidth", () => {
  it("concreto (columna/viga/unión): <1 leve, 1–2 moderado, >2 severo", () => {
    expect(suggestGradeFromCrackWidth("columna_union", 0.9)).toBe("sin_dano_leve");
    expect(suggestGradeFromCrackWidth("columna_union", 1)).toBe("moderado");
    expect(suggestGradeFromCrackWidth("columna_union", 2)).toBe("moderado");
    expect(suggestGradeFromCrackWidth("viga_arriostramiento", 2.1)).toBe("severo_completo");
  });

  it("muro de concreto: <2 leve, 2–6 moderado, >6 severo", () => {
    expect(suggestGradeFromCrackWidth("muro_concreto", 1.9)).toBe("sin_dano_leve");
    expect(suggestGradeFromCrackWidth("muro_concreto", 2)).toBe("moderado");
    expect(suggestGradeFromCrackWidth("muro_concreto", 6)).toBe("moderado");
    expect(suggestGradeFromCrackWidth("muro_concreto", 6.1)).toBe("severo_completo");
  });

  it("mampostería: <1 leve, 1–10 moderado, >10 severo", () => {
    expect(suggestGradeFromCrackWidth("muro_mamposteria", 0.5)).toBe("sin_dano_leve");
    expect(suggestGradeFromCrackWidth("muro_mamposteria", 5)).toBe("moderado");
    expect(suggestGradeFromCrackWidth("muro_mamposteria", 10.5)).toBe("severo_completo");
  });

  it("acero: el criterio no es por grietas → null", () => {
    expect(suggestGradeFromCrackWidth("columna_union", 3, true)).toBeNull();
  });

  it("ancho inválido → null", () => {
    expect(suggestGradeFromCrackWidth("columna_union", -1)).toBeNull();
    expect(suggestGradeFromCrackWidth("columna_union", Number.NaN)).toBeNull();
  });
});
