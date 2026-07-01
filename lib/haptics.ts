// Feedback háptico (vibración) para confirmar acciones con guantes / al sol.
// Se degrada a no-op si el dispositivo no lo soporta (iOS Safari no vibra).

export function haptic(pattern: number | number[]): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* sin soporte: no-op */
    }
  }
}

export const tap = () => haptic(12); // toque ligero (selección)
export const tapStrong = () => haptic(25); // acción confirmada (foto)
export const success = () => haptic([15, 40, 25]); // finalizado
export const warn = () => haptic([40, 30, 40]); // error / validación
