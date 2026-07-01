"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { tap } from "@/lib/haptics";
import { Icon } from "./ui/Icon";

// Compartir nativo (Web Share API) con respaldo a copiar el enlace.
export function ShareButton({
  url,
  title = "reestructuramos",
  text = "Evalúa la seguridad de edificios tras el sismo. Gratis, sin cuenta y funciona sin conexión.",
  label = "Compartir",
  tone = "light",
  className,
}: {
  url?: string;
  title?: string;
  text?: string;
  label?: string;
  tone?: "light" | "dark" | "solid";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    tap();
    const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
    const data: ShareData = { title, text, url: shareUrl };
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share(data);
        return;
      } catch {
        return; // el usuario canceló
      }
    }
    // Respaldo (escritorio / sin Web Share): copiar al portapapeles.
    try {
      await navigator.clipboard.writeText(`${text} ${shareUrl}`.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* sin portapapeles */
    }
  }

  const styles =
    tone === "solid"
      ? "bg-brand text-white active:bg-brand-dark"
      : tone === "dark"
        ? "text-white"
        : "border border-slate-300 bg-white text-brand active:bg-slate-50";

  return (
    <button
      type="button"
      onClick={onShare}
      aria-label="Compartir"
      className={cn(
        "touch-target inline-flex items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold",
        styles,
        className,
      )}
    >
      <Icon name="share" size={18} />
      {copied ? "¡Enlace copiado!" : label}
    </button>
  );
}
