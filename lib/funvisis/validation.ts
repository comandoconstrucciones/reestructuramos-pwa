// Validación zod POR PASO del asistente FUNVISIS. Los CHECK de la BD son la
// última línea de defensa; esta es la primera. Cada schema valida el
// subconjunto de la inspección que captura ese paso.

import { z } from "zod";
import type { Inspection } from "@/lib/types";
import {
  ACCESS_MEMBERS_VALUES,
  ELEMENT_COUNT_TYPES,
  EVENT_TYPES,
  EXT_COLLAPSE_VALUES,
  EXT_DANGER_VALUES,
  EXT_SETTLEMENT_VALUES,
  EXT_TILT_VALUES,
  FUNVISIS_DETAILED_EVALS,
  FUNVISIS_MATERIALS,
  FUNVISIS_OCCUPANCIES,
  MAX_INSPECTORS,
  PREVENTION_MEASURES,
} from "./types";

const aspectLevel = z.enum(["a", "b", "c"]);
const nonNegInt = z.number().int().min(0);

// Paso 1 — Información general
export const stepGeneralSchema = z.object({
  eventType: z.enum(EVENT_TYPES),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha del evento inválida"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  building: z.object({
    estado: z.string().trim().min(1, "Indica el estado"),
    municipio: z.string().trim().min(1, "Indica el municipio"),
    ciudad: z.string().trim().optional(),
    sectorCalle: z.string().trim().optional(),
    nOccupants: nonNegInt.optional(),
    nStoriesAbove: nonNegInt,
    nStoriesBelow: nonNegInt.optional(),
    nSemiBasements: nonNegInt.optional(),
    yearBuilt: z.number().int().min(1500).max(2100).optional(),
    occupancyType: z.enum(FUNVISIS_OCCUPANCIES),
    material: z.enum(FUNVISIS_MATERIALS),
  }),
});

// Paso 2 — Inspección externa (los 5 aspectos son obligatorios)
export const stepExternalSchema = z.object({
  extCollapse: z.enum(EXT_COLLAPSE_VALUES),
  extAdjacentDanger: z.enum(EXT_DANGER_VALUES),
  extGeoDanger: z.enum(EXT_DANGER_VALUES),
  extSettlement: z.enum(EXT_SETTLEMENT_VALUES),
  extTilt: z.enum(EXT_TILT_VALUES),
});

// Paso 3 — Piso crítico / daño Severo-Completo
export const stepSevereSchema = z.object({
  floorsInspected: z.string().trim().min(1, "Indica los pisos inspeccionados"),
  criticalFloor: z.string().trim().min(1, "Indica el piso crítico"),
  accessMembers: z.enum(ACCESS_MEMBERS_VALUES),
  nSevereColumns: nonNegInt,
  nSevereConcreteWalls: nonNegInt,
  nSevereMasonryWalls: nonNegInt,
  nSevereBeams: nonNegInt,
});

// Paso 4 — Daño moderado: o hay conteos con miembros examinados, o estimación manual
export const elementCountSchema = z.object({
  elementType: z.enum(ELEMENT_COUNT_TYPES),
  nNoMinor: nonNegInt,
  nModerate: nonNegInt,
});

export const stepModerateSchema = z
  .object({
    elementCounts: z.array(elementCountSchema).default([]),
    moderatePctEstimated: z.number().min(0).max(100).nullish(),
  })
  .refine(
    (v) =>
      v.elementCounts.some((c) => c.nNoMinor + c.nModerate > 0) ||
      v.moderatePctEstimated != null,
    { message: "Cuantifica al menos un tipo de elemento o registra la estimación manual (%)" },
  );

// Paso 5 — Componentes no estructurales (los 5 obligatorios; gas_leak fuerza c)
export const stepComponentsSchema = z.object({
  compSlabs: aspectLevel,
  compWallsStairsFacades: aspectLevel,
  compTanksAntennas: aspectLevel,
  compUtilities: aspectLevel,
  compElevators: aspectLevel,
  gasLeak: z.boolean().default(false),
});

// Paso 6 — Decisión final
export const stepDecisionSchema = z.object({
  placardFinal: z.enum(["verde", "amarillo", "rojo"]),
  placardOverrideReason: z.string().trim().optional(),
  observations: z.string().trim().optional(),
});

// Paso 7 — Acciones recomendadas y firmas
export const stepActionsSchema = z.object({
  detailedEvalRecommended: z.array(z.enum(FUNVISIS_DETAILED_EVALS)).default([]),
  preventionMeasures: z.array(z.enum(PREVENTION_MEASURES)).default([]),
  inspectors: z
    .array(
      z.object({
        fullName: z.string().trim().min(1, "Nombre del inspector"),
        signatureDataUrl: z.string().startsWith("data:image", "Falta la firma").nullish(),
        isLead: z.boolean(),
      }),
    )
    .min(1, "Se requiere al menos un inspector con firma")
    .max(MAX_INSPECTORS, `Máximo ${MAX_INSPECTORS} inspectores`)
    .refine((list) => list.every((i) => !!i.signatureDataUrl), {
      message: "Cada inspector debe firmar",
    }),
});

export type StepIssues = string[];

/** Valida un paso contra la inspección actual; devuelve la lista de errores
 *  legibles (vacía si el paso está completo). */
export function validateStep(step: number, insp: Inspection): StepIssues {
  const pick = (): z.ZodSafeParseResult<unknown> => {
    switch (step) {
      case 0:
        return stepGeneralSchema.safeParse({
          eventType: insp.eventType,
          eventDate: insp.eventDate,
          lat: insp.lat,
          lng: insp.lng,
          building: insp.building,
        });
      case 1:
        return stepExternalSchema.safeParse(insp);
      case 2:
        return stepSevereSchema.safeParse(insp);
      case 3:
        return stepModerateSchema.safeParse({
          elementCounts: insp.elementCounts ?? [],
          moderatePctEstimated: insp.moderatePctEstimated,
        });
      case 4:
        return stepComponentsSchema.safeParse({ gasLeak: false, ...insp });
      case 5:
        return stepDecisionSchema.safeParse(insp);
      case 6:
        return stepActionsSchema.safeParse({
          detailedEvalRecommended: insp.detailedEvalRecommended ?? [],
          preventionMeasures: insp.preventionMeasures ?? [],
          inspectors: insp.inspectors ?? [],
        });
      default:
        return z.object({}).safeParse({});
    }
  };
  const res = pick();
  if (res.success) return [];
  const seen = new Set<string>();
  const issues: string[] = [];
  for (const issue of res.error.issues) {
    const msg =
      issue.code === "invalid_type" || issue.code === "invalid_value"
        ? humanizeFieldError(issue.path.map(String))
        : issue.message;
    if (!seen.has(msg)) {
      seen.add(msg);
      issues.push(msg);
    }
  }
  return issues;
}

const FIELD_LABELS: Record<string, string> = {
  eventType: "Selecciona el tipo de evento",
  eventDate: "Indica la fecha del evento",
  lat: "Captura la ubicación GPS",
  lng: "Captura la ubicación GPS",
  estado: "Indica el estado",
  municipio: "Indica el municipio",
  occupancyType: "Selecciona el uso de la edificación",
  material: "Selecciona el material",
  nStoriesAbove: "Indica el número de pisos",
  extCollapse: "Responde: colapso de la edificación",
  extAdjacentDanger: "Responde: peligro por adyacentes",
  extGeoDanger: "Responde: peligro geológico/geotécnico",
  extSettlement: "Responde: asentamiento",
  extTilt: "Responde: inclinación",
  floorsInspected: "Indica los pisos inspeccionados",
  criticalFloor: "Indica el piso crítico",
  accessMembers: "Indica el acceso a los miembros",
  compSlabs: "Califica: losas, balcones y techos",
  compWallsStairsFacades: "Califica: paredes, escaleras y fachadas",
  compTanksAntennas: "Califica: tanques, antenas y avisos",
  compUtilities: "Califica: servicios (gas/agua/electricidad)",
  compElevators: "Califica: ascensores y equipos",
  placardFinal: "Selecciona la etiqueta definitiva",
  inspectors: "Registra al menos un inspector con firma",
};

function humanizeFieldError(path: string[]): string {
  for (let i = path.length - 1; i >= 0; i--) {
    const label = FIELD_LABELS[path[i]];
    if (label) return label;
  }
  return `Completa el campo: ${path.join(".") || "requerido"}`;
}
