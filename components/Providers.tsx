"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ensureProfile, setProfile } from "@/lib/db";
import { startSync, triggerSync } from "@/lib/sync";
import { getSupabase } from "@/lib/supabase";
import { useSyncStore } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
      }),
  );

  useEffect(() => {
    // Estado de conectividad inicial
    useSyncStore.getState().setOnline(navigator.onLine);

    // Perfil local + motor de sincronización
    void ensureProfile();
    startSync();

    // Registrar el service worker (solo en producción para no chocar con HMR)
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        /* sin SW: la app sigue funcionando, sin caché offline del shell */
      });
    }

    // Si el inspector inicia sesión con correo (login opcional), captura su
    // identidad permanente en el perfil local y sincroniza.
    const sb = getSupabase();
    const sub = sb?.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (user && !user.is_anonymous && user.email) {
        void (async () => {
          const p = await ensureProfile();
          await setProfile({ ...p, id: user.id, email: user.email!, isAnonymous: false });
          triggerSync();
        })();
      }
    });
    return () => sub?.data.subscription.unsubscribe();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
