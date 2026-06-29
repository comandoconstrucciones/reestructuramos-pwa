// Generación de códigos QR 100% en cliente (offline). Usa la librería `qrcode`.
// El QR de los carteles apunta al historial del edificio (/edificio/[id]).

import QRCode from "qrcode";

/**
 * Devuelve un PNG (data URL) con el QR del texto dado.
 * Alta corrección de errores y negro sólido sobre blanco: máxima
 * legibilidad cuando se imprime y se escanea en campo.
 */
export async function qrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: "M",
    margin: 1,
    scale: 8,
    color: { dark: "#000000", light: "#ffffff" },
  });
}
