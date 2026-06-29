import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "reestructuramos — Inspección estructural post-sismo",
    short_name: "reestructuramos",
    description:
      "Evaluación rápida de seguridad estructural de edificios después de un terremoto (ATC-20 adaptado a Venezuela / COVENIN 1756). Funciona sin conexión.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    lang: "es-VE",
    dir: "ltr",
    categories: ["utilities", "productivity", "government"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      {
        name: "Nueva inspección",
        short_name: "Inspeccionar",
        description: "Iniciar una evaluación rápida",
        url: "/inspeccion/nueva",
      },
      { name: "Mapa de daños", short_name: "Mapa", url: "/" },
    ],
  };
}
