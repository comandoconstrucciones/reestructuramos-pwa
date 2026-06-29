"use client";
// Resalta las palabras ROJO / AMARILLO / VERDE con el color oficial del cartel
// (PLACARD_META). Se usa en el árbol de decisión y en las implicaciones de los
// patrones de daño. 100% offline: solo lee constantes locales.
import { Fragment } from "react";
import { PLACARD_META } from "@/lib/placard";
import type { Placard } from "@/lib/types";

const WORD_TO_PLACARD: Record<string, Placard> = {
  ROJO: "rojo",
  AMARILLO: "amarillo",
  VERDE: "verde",
};

export function PlacardHighlight({ text }: { text: string }) {
  const parts = text.split(/(ROJO|AMARILLO|VERDE)/g);
  return (
    <>
      {parts.map((part, i) => {
        const placard = WORD_TO_PLACARD[part];
        if (!placard) return <Fragment key={i}>{part}</Fragment>;
        const meta = PLACARD_META[placard];
        return (
          <strong
            key={i}
            className="mx-0.5 inline-block rounded px-1.5 py-0.5 text-sm font-extrabold leading-tight"
            style={{ backgroundColor: meta.color, color: meta.textOn }}
          >
            {part}
          </strong>
        );
      })}
    </>
  );
}
