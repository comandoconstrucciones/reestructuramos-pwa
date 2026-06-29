"use client";
import { AppShell } from "@/components/AppShell";
import { Card, CardTitle } from "@/components/ui";
import { Inclinometer } from "@/components/Inclinometer";
import { Compass } from "@/components/Compass";

export default function NivelPage() {
  return (
    <AppShell title="Nivel, plomada y brújula" back>
      <div className="mx-auto flex max-w-lg flex-col gap-4">
        <Card>
          <CardTitle>Mide el desplome con tu teléfono</CardTitle>
          <p className="mt-1 text-sm text-slate-600">
            Comprueba si una columna o muro está <strong>a plomo</strong> (vertical), o si una
            viga/piso está nivelado. Apoya el sensor del peligro de “inclinación / desplome”.
          </p>
        </Card>
        <Card>
          <CardTitle className="mb-3">Nivel y plomada</CardTitle>
          <Inclinometer />
        </Card>
        <Card>
          <CardTitle className="mb-3">Orientación (brújula)</CardTitle>
          <Compass />
        </Card>
      </div>
    </AppShell>
  );
}
