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

const DESC =
  "Evalúa la seguridad de edificios tras el sismo (ATC-20 · COVENIN 1756). Gratis, sin cuenta y funciona sin conexión.";

export const metadata: Metadata = {
  metadataBase: new URL("https://app.reestructuramos.com"),
  applicationName: "reestructuramos",
  title: "reestructuramos — Inspección estructural post-sismo",
  description: DESC,
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
  openGraph: {
    type: "website",
    locale: "es_VE",
    url: "https://app.reestructuramos.com",
    siteName: "reestructuramos",
    title: "reestructuramos — Inspección estructural post-sismo",
    description: DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: "reestructuramos — Inspección estructural post-sismo",
    description: DESC,
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
