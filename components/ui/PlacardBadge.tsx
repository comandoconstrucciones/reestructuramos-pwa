import { cn } from "@/lib/cn";
import { PLACARD_META } from "@/lib/placard";
import type { Placard } from "@/lib/types";

export function PlacardBadge({
  placard,
  size = "md",
  showSub = true,
  className,
}: {
  placard: Placard;
  size?: "sm" | "md" | "lg";
  showSub?: boolean;
  className?: string;
}) {
  const meta = PLACARD_META[placard];
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl text-center font-extrabold",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2 text-lg",
        size === "lg" && "px-6 py-5 text-3xl",
        className,
      )}
      style={{ backgroundColor: meta.color, color: meta.textOn }}
    >
      <span className="leading-tight">{meta.label}</span>
      {showSub && <span className={cn("font-semibold", size === "lg" ? "text-base" : "text-xs")}>{meta.sublabel}</span>}
    </div>
  );
}

/** Pequeño punto de color para listas/leyendas. */
export function PlacardDot({ placard }: { placard: Placard }) {
  return (
    <span
      className="inline-block h-3.5 w-3.5 rounded-full ring-2 ring-white"
      style={{ backgroundColor: PLACARD_META[placard].color }}
    />
  );
}
