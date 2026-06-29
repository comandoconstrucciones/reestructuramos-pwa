import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { MapHome } from "@/components/map/MapHome";

export const metadata: Metadata = {
  title: "Mapa de daños",
};

// Pantalla principal: mapa de daños a pantalla completa (sin padding).
export default function HomePage() {
  return (
    <AppShell title="Mapa de daños" noPad>
      <MapHome />
    </AppShell>
  );
}
