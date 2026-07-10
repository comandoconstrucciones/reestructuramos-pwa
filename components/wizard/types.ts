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

/** Etiquetas (y orden) de los pasos del asistente — planilla FUNVISIS 1:1.
 *  Paso N del asistente = Sección N de la planilla (Secciones 6 y 7 = pasos
 *  6 y 7). Las reglas de corte saltan directo al paso 6 (Decisión final). */
export const WIZARD_STEPS = [
  "Información general",
  "Inspección externa",
  "Piso crítico",
  "Daño Moderado",
  "Componentes",
  "Decisión final",
  "Acciones y firmas",
] as const;

export const WIZARD_TOTAL = WIZARD_STEPS.length;

/** Índices (0-based) de los pasos clave para las reglas de corte. */
export const STEP_EXTERNAL = 1;
export const STEP_SEVERE = 2;
export const STEP_MODERATE = 3;
export const STEP_COMPONENTS = 4;
export const STEP_DECISION = 5;
export const STEP_ACTIONS = 6;
