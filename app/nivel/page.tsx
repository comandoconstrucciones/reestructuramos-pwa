"use client";
import { AppShell } from "@/components/AppShell";
import { Card, CardTitle } from "@/components/ui";
import { Inclinometer } from "@/components/Inclinometer";

export default function NivelPage() {
  return (
    <AppShell title="Nivel y plomada" back>
      <div className="mx-auto flex max-w-lg flex-col gap-4">
        <Card>
          <CardTitle>Mide el desplome con tu teléfono</CardTitle>
          <p className="mt-1 text-sm text-slate-600">
            Comprueba si una columna o muro está <strong>a plomo</strong> (vertical), o si una
            viga/piso está nivelado. Apoya el sensor del peligro de “inclinación / desplome”.
          </p>
        </Card>
        <Card>
          <Inclinometer />
        </Card>
      </div>
    </AppShell>
  );
}
