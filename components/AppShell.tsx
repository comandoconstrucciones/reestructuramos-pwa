"use client";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useSyncStore } from "@/lib/store";
import { cn } from "@/lib/cn";
import { Icon } from "./ui/Icon";
import { SyncStatusBar } from "./SyncStatusBar";
import { BottomNav } from "./BottomNav";
import { InstallPrompt } from "./InstallPrompt";
import { SunModeToggle } from "./SunModeToggle";

/** Marco común: barra superior + estado de sync + contenido + navegación inferior. */
export function AppShell({
  title,
  children,
  back,
  right,
  hideNav,
  noPad,
}: {
  title?: string;
  children: ReactNode;
  back?: boolean;
  right?: ReactNode;
  hideNav?: boolean;
  noPad?: boolean;
}) {
  const router = useRouter();
  const online = useSyncStore((s) => s.online);

  return (
    <div className="flex min-h-dvh flex-col">
      {title !== undefined && (
        <header
          className="sticky top-0 z-30 flex items-center gap-1.5 border-b border-white/10 bg-ink px-3 text-white"
          style={{ paddingTop: "var(--safe-top)", minHeight: 56 }}
        >
          {back && (
            <button
              onClick={() => router.back()}
              aria-label="Volver"
              className="touch-target -ml-1 flex items-center justify-center rounded-lg"
            >
              <Icon name="chevronLeft" size={26} />
            </button>
          )}
          <h1 className="flex-1 truncate py-3 text-base font-semibold tracking-tight">{title}</h1>
          <SunModeToggle />
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full ring-2 ring-white/20",
              online ? "bg-verde" : "bg-amarillo",
            )}
            title={online ? "En línea" : "Sin conexión"}
          />
          {right}
        </header>
      )}
      <SyncStatusBar />
      <InstallPrompt />
      <main className={noPad ? "flex min-h-0 flex-1 flex-col" : "flex-1 p-4"}>{children}</main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
