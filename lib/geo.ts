// Geolocalización + reverse geocoding. La captura es PUNTUAL (no watch continuo)
// para cuidar batería. El reverse geocoding solo se intenta si hay red.

export interface FixedPosition {
  lat: number;
  lng: number;
  accuracy: number; // metros
  capturedAt: string; // ISO
}

export class GeolocationUnavailable extends Error {}

/** Captura una posición GPS de alta precisión (una sola lectura). */
export function getCurrentPosition(timeoutMs = 15000): Promise<FixedPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      reject(new GeolocationUnavailable("Este dispositivo no tiene GPS disponible."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          capturedAt: new Date(pos.timestamp).toISOString(),
        }),
      (err) => reject(new Error(geoErrorMessage(err))),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 0 },
    );
  });
}

function geoErrorMessage(err: GeolocationPositionError): string {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return "Permiso de ubicación denegado. Actívalo para registrar el GPS.";
    case err.POSITION_UNAVAILABLE:
      return "No se pudo obtener la ubicación. Intenta a cielo abierto.";
    case err.TIMEOUT:
      return "La ubicación tardó demasiado. Reintenta.";
    default:
      return "Error al obtener la ubicación.";
  }
}

/** Dirección aproximada vía Nominatim (OSM). Devuelve null si no hay red o falla. */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return null;
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=es`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = (await res.json()) as { display_name?: string };
    return data.display_name ?? null;
  } catch {
    return null;
  }
}

/** Distancia Haversine en metros (para detectar edificios cercanos ya inspeccionados). */
export function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
