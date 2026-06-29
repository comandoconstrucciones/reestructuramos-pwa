"use client";
import { useEffect, useState } from "react";
import { Card, CardTitle, Field, OptionGrid, TextInput, Toggle } from "@/components/ui";
import { CONSTRUCTION_TYPE_OPTIONS, OCCUPANCY_OPTIONS } from "@/lib/catalog";
import type {
  AreasInspected,
  ConstructionType,
  OccupancyType,
  Option,
} from "@/lib/types";
import type { StepProps } from "./types";
import { Stepper } from "./Stepper";

const AREAS_OPTIONS: Option<AreasInspected>[] = [
  { value: "exterior", label: "Solo exterior", description: "Evaluado desde afuera." },
  { value: "exterior_interior", label: "Exterior + interior", description: "Se ingresó al edificio." },
];

export function StepBuilding({ insp, update }: StepProps) {
  const b = insp.building;
  const [name, setName] = useState(b.name ?? "");

  // Valores por defecto concretos (una sola vez): la mayoría tiene ≥1 piso.
  useEffect(() => {
    if (b.nStoriesAbove == null || b.nStoriesBelow == null) {
      update((cur) => ({
        building: {
          ...cur.building,
          nStoriesAbove: cur.building.nStoriesAbove ?? 1,
          nStoriesBelow: cur.building.nStoriesBelow ?? 0,
        },
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function setBuilding(patch: Partial<typeof b>) {
    update((cur) => ({ building: { ...cur.building, ...patch } }));
  }

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardTitle>Tipología estructural</CardTitle>
        <p className="mb-3 mt-1 text-sm text-slate-500">¿Cómo está construido el edificio?</p>
        <OptionGrid<ConstructionType>
          options={CONSTRUCTION_TYPE_OPTIONS}
          value={b.constructionType}
          onChange={(v) => setBuilding({ constructionType: v as ConstructionType })}
        />
      </Card>

      <Card>
        <CardTitle>Número de pisos</CardTitle>
        <div className="mt-3 flex flex-col gap-4">
          <Field label="Sobre rasante (niveles)">
            <Stepper
              value={b.nStoriesAbove ?? 1}
              onChange={(n) => setBuilding({ nStoriesAbove: n })}
              min={0}
              max={150}
            />
          </Field>
          <Field label="Bajo rasante (sótanos)">
            <Stepper
              value={b.nStoriesBelow ?? 0}
              onChange={(n) => setBuilding({ nStoriesBelow: n })}
              min={0}
              max={20}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <CardTitle>Uso / ocupación</CardTitle>
        <div className="mt-3">
          <OptionGrid<OccupancyType>
            options={OCCUPANCY_OPTIONS}
            value={b.occupancyType}
            onChange={(v) => setBuilding({ occupancyType: v as OccupancyType })}
            columns={2}
          />
        </div>
      </Card>

      <Card>
        <Field label="Nombre o identificación" help="Opcional (p. ej. «Edif. Pacífico» o nº cívico).">
          <TextInput
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setBuilding({ name: e.target.value });
            }}
            placeholder="Nombre o número del edificio"
          />
        </Field>
      </Card>

      <Card>
        <CardTitle>Condiciones de riesgo</CardTitle>
        <div className="mt-3 flex flex-col gap-2">
          <Toggle
            checked={b.softStory}
            onChange={(v) => setBuilding({ softStory: v })}
            label="Planta baja blanda"
            description="Nivel inferior abierto/flexible (comercio, estacionamiento)."
          />
          <Toggle
            checked={b.shortColumn}
            onChange={(v) => setBuilding({ shortColumn: v })}
            label="Columna corta"
            description="Columnas acortadas por antepechos/muros parciales."
          />
          <Toggle
            checked={b.isEssential}
            onChange={(v) => setBuilding({ isEssential: v })}
            label="Edificio esencial"
            description="Hospital, escuela o refugio: se evalúa con criterio más estricto."
            emphasis
          />
        </div>
      </Card>

      <Card>
        <CardTitle>Áreas inspeccionadas</CardTitle>
        <div className="mt-3">
          <OptionGrid<AreasInspected>
            options={AREAS_OPTIONS}
            value={insp.areasInspected}
            onChange={(v) => update({ areasInspected: v as AreasInspected })}
            columns={2}
          />
        </div>
      </Card>
    </div>
  );
}
