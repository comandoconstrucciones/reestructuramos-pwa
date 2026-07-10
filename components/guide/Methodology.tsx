"use client";
// Metodología oficial: documentos descargables (planilla, paper, manual de
// entrenamiento) + manual de campo (material y seguridad) de la planilla.
import { Card, CardTitle, Icon } from "@/components/ui";
import {
  FIELD_MATERIAL,
  FIELD_SAFETY,
  OFFICIAL_DOCS,
} from "@/lib/funvisis/catalog";
import { FUNVISIS_DISCLAIMER } from "@/lib/funvisis/scoring";

export function Methodology() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-slate-500">
        Este asistente replica 1:1 la metodología oficial venezolana{" "}
        <strong>«Evaluación Rápida de Daños en Edificaciones»</strong> (FUNVISIS / IMME-UCV,
        López et al. 2023). Aquí están los documentos fuente y el manual de campo.
      </p>

      {/* Documentos oficiales */}
      <Card>
        <CardTitle>Documentos oficiales</CardTitle>
        <p className="mb-3 mt-1 text-sm text-slate-500">
          Ábrelos con conexión al menos una vez para tenerlos disponibles sin red.
        </p>
        <div className="flex flex-col gap-2">
          {OFFICIAL_DOCS.map((doc) => (
            <a
              key={doc.file}
              href={doc.file}
              target="_blank"
              rel="noopener"
              className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 active:bg-slate-50"
            >
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-brand">
                <Icon name="book" size={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-ink">{doc.title}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">
                  {doc.description}
                </span>
                <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                  {doc.sizeLabel}
                </span>
              </span>
              <Icon name="download" size={18} className="mt-1 shrink-0 text-slate-400" />
            </a>
          ))}
        </div>
      </Card>

      {/* Material necesario (manual de campo oficial) */}
      <Card>
        <CardTitle>Material necesario</CardTitle>
        <p className="mb-2 mt-1 text-sm text-slate-500">
          Según el manual de campo de la planilla oficial.
        </p>
        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {FIELD_MATERIAL.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
              <Icon name="check" size={15} className="mt-0.5 shrink-0 text-verde" />
              {item}
            </li>
          ))}
        </ul>
      </Card>

      {/* Seguridad del inspector */}
      <Card>
        <CardTitle>Seguridad del inspector</CardTitle>
        <ul className="mt-2 flex flex-col gap-2">
          {FIELD_SAFETY.map((item) => (
            <li
              key={item}
              className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium leading-relaxed text-amber-900"
            >
              {item}
            </li>
          ))}
        </ul>
      </Card>

      {/* Nota oficial */}
      <p className="rounded-xl bg-slate-100 px-4 py-3 text-xs leading-relaxed text-slate-600">
        {FUNVISIS_DISCLAIMER}
      </p>
    </div>
  );
}
