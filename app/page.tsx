import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { MapHome } from "@/components/map/MapHome";
import { ShareButton } from "@/components/ShareButton";

export const metadata: Metadata = {
  title: "Mapa de daños",
};

// Pantalla principal: mapa de daños a pantalla completa (sin padding).
export default function HomePage() {
  return (
    <AppShell
      title="Mapa de daños"
      noPad
      right={<ShareButton tone="dark" label="" url="https://app.reestructuramos.com" />}
    >
      <MapHome />
    </AppShell>
  );
}
