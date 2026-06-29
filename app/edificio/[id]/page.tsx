// Historial del edificio — destino del QR. Server Component: extrae el id del
// Promise `params` (Next 16) y delega en <BuildingHistory> (Client Component)
// que lee Dexie en vivo y, si hay red, completa con Supabase. Así cualquiera
// que escanee el QR ve el historial acumulado del edificio.

import { AppShell } from "@/components/AppShell";
import { BuildingHistory } from "@/components/building/BuildingHistory";

export default async function EdificioHistorialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell title="Historial del edificio" back>
      <BuildingHistory id={id} />
    </AppShell>
  );
}
