"use client";
// Paso 2 — Inspección Externa (planilla FUNVISIS, Sección 2).
// Los 5 aspectos se califican SIN ingresar a la edificación. Si el riesgo
// externo es C se aplica la REGLA DE CORTE: banner rojo y salto al paso 6.
import { useState } from "react";
import { Card, CardTitle } from "@/components/ui";
import {
  EXT_ADJACENT_DEF,
  EXT_COLLAPSE_DEF,
  EXT_GEO_DEF,
  EXT_SETTLEMENT_DEF,
  EXT_TILT_DEF,
  type ExternalAspectDef,
} from "@/lib/funvisis/catalog";
import { scoreExternal } from "@/lib/funvisis/scoring";
import type { Inspection } from "@/lib/types";
import type { StepProps } from "./types";
import { CutBanner, LevelRadioGroup, RiskChip } from "./funvisis-ui";

const ASPECTS: ExternalAspectDef<string>[] = [
  EXT_COLLAPSE_DEF,
  EXT_ADJACENT_DEF,
  EXT_GEO_DEF,
  EXT_SETTLEMENT_DEF,
  EXT_TILT_DEF,
];

/** Mini-ilustración: medición de inclinación con plomada de 60 cm. */
function PlumbDiagram() {
  return (
    <svg viewBox="0 0 200 120" className="h-28 w-full max-w-56" role="img" aria-label="Medición con plomada de 60 cm">
      {/* pared inclinada */}
      <polygon points="60,10 80,10 70,110 50,110" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
      {/* plomada vertical */}
      <line x1="78" y1="12" x2="78" y2="104" stroke="#0369a1" strokeWidth="2" strokeDasharray="4 3" />
      <circle cx="78" cy="106" r="5" fill="#0369a1" />
      {/* cota 60 cm */}
      <line x1="120" y1="12" x2="120" y2="104" stroke="#64748b" strokeWidth="1" />
      <line x1="114" y1="12" x2="126" y2="12" stroke="#64748b" strokeWidth="1" />
      <line x1="114" y1="104" x2="126" y2="104" stroke="#64748b" strokeWidth="1" />
      <text x="128" y="62" fontSize="11" fill="#475569">60 cm</text>
      {/* separación */}
      <line x1="66" y1="104" x2="73" y2="104" stroke="#dc2626" strokeWidth="3" />
      <text x="30" y="99" fontSize="11" fill="#dc2626" fontWeight="bold">≤2 cm→b</text>
      <text x="30" y="112" fontSize="11" fill="#dc2626" fontWeight="bold">&gt;2 cm→c</text>
    </svg>
  );
}

export function StepExternal({ insp, update }: StepProps) {
  const [showPlumb, setShowPlumb] = useState(false);
  const risk = scoreExternal(insp);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Califica desde afuera, sin ingresar.</p>
        <RiskChip risk={risk} />
      </div>

      {ASPECTS.map((def) => (
        <Card key={def.key}>
          <CardTitle className="text-base">{def.title}</CardTitle>
          {def.help && <p className="mb-3 mt-0.5 text-sm text-slate-500">{def.help}</p>}
          {def.key === "extTilt" && (
            <div className="mb-3">
              <button
                type="button"
                className="text-sm font-semibold text-brand underline"
                onClick={() => setShowPlumb((v) => !v)}
              >
                {showPlumb ? "Ocultar" : "¿Cómo medir con la plomada de 60 cm?"}
              </button>
              {showPlumb && (
                <div className="mt-2 rounded-xl bg-sky-50 p-3">
                  <PlumbDiagram />
                  <p className="mt-1 text-xs text-slate-600">
                    Cuelga una plomada (o el teléfono con una cuerda) pegada a la parte alta del
                    muro y mide la separación horizontal a 60 cm hacia abajo: hasta 2 cm es
                    inclinación moderada (b); más de 2 cm, elevada (c).
                  </p>
                </div>
              )}
            </div>
          )}
          <LevelRadioGroup
            options={def.options}
            value={insp[def.key] as string | undefined}
            onChange={(v) => update({ [def.key]: v } as Partial<Inspection>)}
          />
        </Card>
      ))}

      {risk === "C" && (
        <CutBanner
          title="Riesgo externo Alto — no continúe la inspección interna"
          detail="La planilla ordena detener la inspección: etiqueta roja (PELIGRO). Al tocar «Siguiente» pasarás directo a la Decisión final (las secciones 3, 4 y 5 se omiten)."
        />
      )}
      {risk === "B" && (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800">
          Riesgo externo Medio: continúa la inspección con precaución.
        </p>
      )}
    </div>
  );
}
