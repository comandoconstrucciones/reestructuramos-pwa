// Contratos compartidos del asistente de Evaluación Rápida.
// Las pantallas viven en components/wizard/* y la orquestación en
// app/inspeccion/nueva/page.tsx.

import type { Inspection } from "@/lib/types";

/**
 * Actualiza el borrador y AUTOGUARDA (Dexie) en cada cambio.
 * - Forma objeto: parche directo (feedback optimista inmediato).
 * - Forma función: recibe la inspección MÁS FRESCA de Dexie (incluye, p. ej.,
 *   los photoIds que añadió PhotoCapture) y devuelve el parche. Úsala siempre
 *   que el nuevo valor dependa del estado actual (hallazgos, edificio…).
 */
export type InspUpdate = (
  patch: Partial<Inspection> | ((current: Inspection) => Partial<Inspection>),
) => void;

export interface StepProps {
  insp: Inspection;
  update: InspUpdate;
  /** Solo Resultado: drena la cola de autosave y finaliza atómicamente. */
  finalize?: () => Promise<void>;
}

/** Etiquetas (y orden) de los pasos del asistente. */
export const WIZARD_STEPS = [
  "Ubicación",
  "Edificio",
  "Peligros",
  "Daño global",
  "Resultado",
] as const;

export const WIZARD_TOTAL = WIZARD_STEPS.length;
