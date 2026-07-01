import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

// Tipografía de ingeniería: Plex Sans (UI) + Plex Mono (datos/coordenadas).
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "reestructuramos",
  title: "reestructuramos — Inspección estructural post-sismo",
  description:
    "Evaluación rápida de seguridad estructural de edificios después de un terremoto (ATC-20 adaptado a Venezuela). Funciona sin conexión.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "reestructuramos",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon-180.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-VE" className={`${plexSans.variable} ${plexMono.variable}`}>
      <body className="min-h-dvh">
        {/* Aplica el modo sol antes de pintar (evita parpadeo). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('sunmode')==='1')document.documentElement.dataset.sun='1'}catch(e){}`,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
