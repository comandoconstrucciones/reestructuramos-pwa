"use client";
import { Card, CardTitle, OptionGrid } from "@/components/ui";
import { DAMAGE_BAND_OPTIONS } from "@/lib/catalog";
import type { DamageBand } from "@/lib/types";
import type { StepProps } from "./types";

export function StepDamage({ insp, update }: StepProps) {
  return (
    <Card>
      <CardTitle>Daño global estimado</CardTitle>
      <p className="mb-3 mt-1 text-sm text-slate-500">
        Porcentaje aproximado del edificio que se ve afectado.
      </p>
      <OptionGrid<DamageBand>
        options={DAMAGE_BAND_OPTIONS}
        value={insp.estimatedDamageBand}
        onChange={(v) => update({ estimatedDamageBand: v as DamageBand })}
      />
    </Card>
  );
}
