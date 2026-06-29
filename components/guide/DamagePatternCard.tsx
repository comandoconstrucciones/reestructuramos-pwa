"use client";
// Tarjeta escaneable de un patrón de daño: título, chip de categoría, chip de
// severidad sugerida (color de SEVERITY_OPTIONS), descripción, "Qué buscar" e
// "Implicación" (con resaltado de carteles). Alto contraste, tema claro.
import type { DamagePattern } from "@/lib/types";
import { SEVERITY_OPTIONS } from "@/lib/catalog";
import { Card } from "@/components/ui";
import { PlacardHighlight } from "./PlacardHighlight";

const CATEGORY_META: Record<DamagePattern["category"], { label: string; color: string }> = {
  cosmetica: { label: "Cosmética", color: "#0369a1" },
  estructural: { label: "Estructural", color: "#4338ca" },
  geotecnica: { label: "Geotécnica", color: "#92400e" },
};

export function DamagePatternCard({ pattern }: { pattern: DamagePattern }) {
  const sev = SEVERITY_OPTIONS.find((o) => o.value === pattern.severityHint);
  const cat = CATEGORY_META[pattern.category];

  return (
    <Card className="flex flex-col gap-3">
      <h3 className="text-lg font-bold text-ink">{pattern.title}</h3>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className="rounded-full border-2 bg-white px-3 py-0.5 text-sm font-bold"
          style={{ color: cat.color, borderColor: cat.color }}
        >
          {cat.label}
        </span>
        {sev && (
          <span
            className="rounded-full px-3 py-0.5 text-sm font-bold text-white"
            style={{ backgroundColor: sev.color }}
          >
            Severidad: {sev.label}
          </span>
        )}
      </div>

      <p className="text-base leading-snug text-ink">{pattern.description}</p>

      <div className="rounded-xl bg-slate-50 p-3">
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">Qué buscar</p>
        <p className="text-base leading-snug text-ink">{pattern.whatToLookFor}</p>
      </div>

      <div
        className="rounded-xl border-l-4 bg-slate-50 p-3"
        style={{ borderColor: sev?.color ?? "#64748b" }}
      >
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">Implicación</p>
        <p className="text-base leading-snug text-ink">
          <PlacardHighlight text={pattern.implication} />
        </p>
      </div>
    </Card>
  );
}
