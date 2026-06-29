"use client";
// Árbol de decisión del cartel (DECISION_TREE) como pasos numerados claros.
// Resalta ROJO/AMARILLO/VERDE con el color oficial del cartel. Offline.
import { DECISION_TREE } from "@/lib/catalog";
import { Card } from "@/components/ui";
import { PlacardHighlight } from "./PlacardHighlight";

export function DecisionTree() {
  return (
    <ol className="flex flex-col gap-3">
      {DECISION_TREE.map((step, i) => (
        <li key={i}>
          <Card className="flex gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white"
              aria-hidden
            >
              {i + 1}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <p className="text-base font-semibold leading-snug text-ink">
                <span className="sr-only">Paso {i + 1}. </span>
                {step.question}
              </p>
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-2 rounded-lg bg-slate-50 p-2">
                  <span className="shrink-0 font-extrabold text-verde-ink">Sí</span>
                  <span className="text-ink">
                    <PlacardHighlight text={step.ifYes} />
                  </span>
                </div>
                <div className="flex gap-2 rounded-lg bg-slate-50 p-2">
                  <span className="shrink-0 font-extrabold text-slate-600">No</span>
                  <span className="text-ink">
                    <PlacardHighlight text={step.ifNo} />
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </li>
      ))}
    </ol>
  );
}
