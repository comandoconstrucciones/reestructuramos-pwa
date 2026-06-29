"use client";
import { useSyncStore } from "@/lib/store";
import { triggerSync } from "@/lib/sync";
import { isSupabaseConfigured } from "@/lib/supabase";

/** Barra siempre visible con el estado de conectividad y la cola de subida. */
export function SyncStatusBar() {
  const { online, syncing, pendingCount, lastError } = useSyncStore();

  if (!isSupabaseConfigured) {
    return online ? null : <Bar tone="amber">Sin conexión — los datos se guardan en este dispositivo.</Bar>;
  }

  if (!online) {
    return (
      <Bar tone="amber">
        Sin conexión — guardando local.{pendingCount > 0 && ` ${pendingCount} por subir.`}
      </Bar>
    );
  }
  if (syncing) return <Bar tone="sky">Sincronizando…</Bar>;
  if (pendingCount > 0) {
    return (
      <Bar tone="amber">
        <span>{pendingCount} inspección(es) por subir</span>
        <button onClick={triggerSync} className="ml-auto rounded-lg bg-white/70 px-3 py-1 font-bold text-amber-900">
          Reintentar
        </button>
      </Bar>
    );
  }
  if (lastError) {
    return (
      <Bar tone="red">
        <span>Error al sincronizar</span>
        <button onClick={triggerSync} className="ml-auto rounded-lg bg-white/80 px-3 py-1 font-bold text-rojo">
          Reintentar
        </button>
      </Bar>
    );
  }
  return null;
}

function Bar({ tone, children }: { tone: "amber" | "sky" | "red"; children: React.ReactNode }) {
  const bg = tone === "amber" ? "bg-amber-100 text-amber-900" : tone === "sky" ? "bg-sky-100 text-sky-900" : "bg-red-100 text-rojo";
  return <div className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold ${bg}`}>{children}</div>;
}
