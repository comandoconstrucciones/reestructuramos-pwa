import { ImageResponse } from "next/og";

export const alt = "reestructuramos — Inspección estructural post-sismo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Tarjeta social (WhatsApp / X / etc.) al compartir el enlace.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0f172a",
          color: "#ffffff",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 96,
              height: 96,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", flex: 1, background: "#16a34a" }} />
            <div style={{ display: "flex", flex: 1, background: "#d97706" }} />
            <div style={{ display: "flex", flex: 1, background: "#dc2626" }} />
          </div>
          <div style={{ fontSize: 62, fontWeight: 800, letterSpacing: -1 }}>reestructuramos</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>
            Inspección estructural post-sismo
          </div>
          <div style={{ fontSize: 34, color: "#cbd5e1" }}>
            Clasifica edificios verde / amarillo / rojo · ATC-20 · COVENIN 1756
          </div>
          <div style={{ display: "flex", gap: 18, marginTop: 6, fontSize: 28, color: "#93c5fd" }}>
            <span>Gratis</span>
            <span>·</span>
            <span>Sin cuenta</span>
            <span>·</span>
            <span>Funciona sin conexión</span>
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 32, color: "#7dd3fc", fontWeight: 600 }}>
          app.reestructuramos.com
        </div>
      </div>
    ),
    { ...size },
  );
}
