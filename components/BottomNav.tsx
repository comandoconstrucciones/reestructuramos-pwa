"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./ui/Icon";

const ITEMS: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Mapa", icon: "map" },
  { href: "/inspeccion/nueva", label: "Nueva", icon: "plus" },
  { href: "/inspecciones", label: "Mías", icon: "clipboard" },
  { href: "/guia", label: "Guía", icon: "book" },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="sticky bottom-0 z-30 flex items-stretch justify-around border-t border-line bg-white"
      style={{ paddingBottom: "var(--safe-bottom)" }}
    >
      {ITEMS.map((it) => {
        const active = it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-16 flex-1 flex-col items-center justify-center gap-1 text-xs font-semibold",
              active ? "text-brand" : "text-slate-500",
            )}
          >
            <Icon name={it.icon} size={24} strokeWidth={active ? 2.4 : 1.8} />
            <span>{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
