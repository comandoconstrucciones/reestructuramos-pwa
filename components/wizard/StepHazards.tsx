"use client";
import { useEffect, useState } from "react";
import { Button, Card, CardTitle, Icon, SeverityPicker } from "@/components/ui";
import { PhotoCapture } from "@/components/PhotoCapture";
import { Inclinometer } from "@/components/Inclinometer";
import { GENERAL_HAZARDS } from "@/lib/catalog";
import { newId } from "@/lib/id";
import type { Finding, Severity } from "@/lib/types";
import type { StepProps } from "./types";

export function StepHazards({ insp, update }: StepProps) {
  const [measuring, setMeasuring] = useState(false);

  const findingFor = (element: string): Finding | undefined =>
    insp.findings.find((f) => f.category === "peligro_general" && f.element === element);

  function addNote(element: string, text: string) {
    update((cur) => ({
      findings: cur.findings.map((f) =>
        f.category === "peligro_general" && f.element === element
          ? { ...f, notes: [f.notes?.trim(), text].filter(Boolean).join(" · ") }
          : f,
      ),
    }));
  }

  function setSeverity(element: string, severity: Severity) {
    // Forma función: opera sobre la inspección MÁS FRESCA de Dexie, así no se
    // pisan los photoIds que PhotoCapture pudo añadir al hallazgo.
    update((cur) => {
      const findings = [...cur.findings];
      const idx = findings.findIndex(
        (f) => f.category === "peligro_general" && f.element === element,
      );
      if (idx >= 0) {
        findings[idx] = { ...findings[idx], severity };
      } else {
        findings.push({
          id: newId(),
          category: "peligro_general",
          element,
          severity,
          photoIds: [],
        });
      }
      return { findings };
    });
  }

  // Materializa los 6 peligros con severidad 'ninguno' al entrar: deja constancia
  // de que CADA peligro fue evaluado (distingue "sin peligro" de "omitido").
  useEffect(() => {
    update((cur) => {
      const missing = GENERAL_HAZARDS.filter(
        (h) => !cur.findings.some((f) => f.category === "peligro_general" && f.element === h.element),
      );
      if (missing.length === 0) return {};
      return {
        findings: [
          ...cur.findings,
          ...missing.map((h) => ({
            id: newId(),
            category: "peligro_general" as const,
            element: h.element,
            severity: "ninguno" as const,
            photoIds: [],
          })),
        ],
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-500">
        Marca la severidad de cada peligro. Adjunta una foto a cada uno que observes.
      </p>
      {GENERAL_HAZARDS.map((h) => {
        const f = findingFor(h.element);
        const sev = f?.severity ?? "ninguno";
        const hasEvidence = !!f && sev !== "ninguno";
        return (
          <Card key={h.element}>
            <CardTitle className="text-base">{h.label}</CardTitle>
            {h.help && <p className="mb-3 mt-0.5 text-sm text-slate-500">{h.help}</p>}
            <SeverityPicker value={sev} onChange={(s) => setSeverity(h.element, s)} />
            {h.element === "inclinacion" && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                {f?.notes && (
                  <p className="mb-2 text-sm font-semibold text-brand-ink">{f.notes}</p>
                )}
                {measuring ? (
                  <Inclinometer
                    onCapture={(t) => {
                      addNote("inclinacion", t);
                      setMeasuring(false);
                    }}
                  />
                ) : (
                  <Button variant="secondary" size="md" onClick={() => setMeasuring(true)}>
                    <Icon name="level" size={18} /> Medir con el teléfono
                  </Button>
                )}
              </div>
            )}
            {hasEvidence && (
              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="mb-2 text-sm font-semibold text-slate-600">
                  Evidencia fotográfica
                </p>
                <PhotoCapture
                  inspectionClientUuid={insp.clientUuid}
                  findingId={f!.id}
                  compact
                />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
