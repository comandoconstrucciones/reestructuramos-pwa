"use client";
// Paso 1 — Información General (planilla FUNVISIS, Sección 1 + encabezado).
import { useState } from "react";
import { Card, CardTitle, Field, OptionGrid, TextInput, Toggle } from "@/components/ui";
import {
  EVENT_TYPE_OPTIONS,
  FUNVISIS_MATERIAL_OPTIONS,
  FUNVISIS_OCCUPANCY_OPTIONS,
} from "@/lib/funvisis/catalog";
import { materialToConstructionType } from "@/lib/funvisis/normalize";
import type { EventType, FunvisisMaterial, FunvisisOccupancy } from "@/lib/funvisis/types";
import type { Building } from "@/lib/types";
import type { StepProps } from "./types";
import { StepLocation } from "./StepLocation";
import { Stepper } from "./Stepper";

export function StepGeneral({ insp, update, finalize }: StepProps) {
  const b = insp.building;
  // Texto local para no perder el cursor con el autoguardado (patrón del repo).
  const [estado, setEstado] = useState(b.estado ?? "");
  const [municipio, setMunicipio] = useState(b.municipio ?? "");
  const [ciudad, setCiudad] = useState(b.ciudad ?? "");
  const [sector, setSector] = useState(b.sectorCalle ?? "");
  const [name, setName] = useState(b.name ?? "");
  const [yearBuilt, setYearBuilt] = useState(b.yearBuilt != null ? String(b.yearBuilt) : "");

  function setBuilding(patch: Partial<Building>) {
    update((cur) => ({ building: { ...cur.building, ...patch } }));
  }

  const startedAt = new Date(insp.createdAt);

  return (
    <div className="flex flex-col gap-3">
      {/* Encabezado de la planilla: evento y fechas */}
      <Card>
        <CardTitle>Evento</CardTitle>
        <p className="mb-3 mt-1 text-sm text-slate-500">Tipo de evento que motiva la inspección.</p>
        <OptionGrid<EventType>
          options={EVENT_TYPE_OPTIONS}
          value={insp.eventType}
          onChange={(v) => update({ eventType: v as EventType })}
          columns={2}
        />
        <div className="mt-4 flex flex-col gap-3">
          <Field label="Fecha del evento">
            <TextInput
              type="date"
              value={insp.eventDate ?? ""}
              onChange={(e) => update({ eventDate: e.target.value })}
            />
          </Field>
          <p className="text-sm text-slate-500">
            Inicio de inspección:{" "}
            <strong className="text-ink">
              {startedAt.toLocaleDateString("es-VE")} · {insp.timeStart ?? "—"}
            </strong>{" "}
            · La hora de fin se sella al guardar.
          </p>
        </div>
      </Card>

      {/* Ubicación (GPS + mapa + dirección) — bloque existente reutilizado */}
      <StepLocation insp={insp} update={update} finalize={finalize} />

      {/* Identificación político-territorial */}
      <Card>
        <CardTitle>Identificación</CardTitle>
        <div className="mt-3 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Estado" required>
              <TextInput
                value={estado}
                onChange={(e) => {
                  setEstado(e.target.value);
                  setBuilding({ estado: e.target.value });
                }}
                placeholder="p. ej. Miranda"
              />
            </Field>
            <Field label="Municipio" required>
              <TextInput
                value={municipio}
                onChange={(e) => {
                  setMunicipio(e.target.value);
                  setBuilding({ municipio: e.target.value });
                }}
                placeholder="p. ej. Chacao"
              />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Ciudad">
              <TextInput
                value={ciudad}
                onChange={(e) => {
                  setCiudad(e.target.value);
                  setBuilding({ ciudad: e.target.value });
                }}
                placeholder="p. ej. Caracas"
              />
            </Field>
            <Field label="Sector / calle">
              <TextInput
                value={sector}
                onChange={(e) => {
                  setSector(e.target.value);
                  setBuilding({ sectorCalle: e.target.value });
                }}
                placeholder="Sector, urbanización…"
              />
            </Field>
          </div>
          <Field label="Nombre o identificación de la edificación" help="Opcional (p. ej. «Edif. Pacífico»).">
            <TextInput
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setBuilding({ name: e.target.value });
              }}
              placeholder="Nombre o número"
            />
          </Field>
        </div>
      </Card>

      {/* Datos de la edificación */}
      <Card>
        <CardTitle>La edificación</CardTitle>
        <div className="mt-3 flex flex-col gap-4">
          <Field label="Nº de personas que la ocupan (aprox.)">
            <Stepper
              value={b.nOccupants ?? 0}
              onChange={(n) => setBuilding({ nOccupants: n })}
              max={5000}
            />
          </Field>
          <Field label="Pisos sobre el nivel de la calle" required>
            <Stepper
              value={b.nStoriesAbove ?? 1}
              onChange={(n) => setBuilding({ nStoriesAbove: n })}
              min={0}
              max={150}
            />
          </Field>
          <Field label="Semisótanos">
            <Stepper
              value={b.nSemiBasements ?? 0}
              onChange={(n) => setBuilding({ nSemiBasements: n })}
              max={5}
            />
          </Field>
          <Field label="Sótanos">
            <Stepper
              value={b.nStoriesBelow ?? 0}
              onChange={(n) => setBuilding({ nStoriesBelow: n })}
              max={20}
            />
          </Field>
          <Field label="Año de construcción (aprox.)">
            <TextInput
              type="number"
              inputMode="numeric"
              value={yearBuilt}
              onChange={(e) => {
                setYearBuilt(e.target.value);
                const n = parseInt(e.target.value, 10);
                setBuilding({ yearBuilt: Number.isFinite(n) ? n : undefined });
              }}
              placeholder="p. ej. 1978"
            />
          </Field>
        </div>
      </Card>

      {/* Uso (catálogo oficial) */}
      <Card>
        <CardTitle>Uso de la edificación</CardTitle>
        <div className="mt-3">
          <OptionGrid<FunvisisOccupancy>
            options={FUNVISIS_OCCUPANCY_OPTIONS}
            value={insp.building.occupancyType as FunvisisOccupancy | undefined}
            onChange={(v) => {
              const occupancy = v as FunvisisOccupancy;
              setBuilding({
                occupancyType: occupancy,
                // Esenciales para la capa ATC-20: salud, educación, seguridad.
                isEssential: ["medico_asistencial", "educativo", "seguridad"].includes(occupancy),
              });
            }}
            columns={2}
          />
        </div>
      </Card>

      {/* Material (catálogo oficial) */}
      <Card>
        <CardTitle>Material de construcción</CardTitle>
        <div className="mt-3">
          <OptionGrid<FunvisisMaterial>
            options={FUNVISIS_MATERIAL_OPTIONS}
            value={b.material}
            onChange={(v) => {
              const material = v as FunvisisMaterial;
              setBuilding({
                material,
                // Deriva la tipología ATC-20 (retrocompatibilidad).
                constructionType: materialToConstructionType(material),
              });
            }}
          />
        </div>
      </Card>

      {/* Condiciones de riesgo (capa ATC-20, se mantienen) */}
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
        </div>
      </Card>
    </div>
  );
}
