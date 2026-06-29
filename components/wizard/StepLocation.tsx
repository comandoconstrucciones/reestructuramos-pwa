"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card, CardTitle, Field, Icon, Spinner, TextInput } from "@/components/ui";
import { getCurrentPosition, reverseGeocode } from "@/lib/geo";
import type { StepProps } from "./types";

// Caracas como centro por defecto. OJO: NO importar nada de LeafletMap de forma
// estática (usa window/leaflet en el tope del módulo) -> rompería el SSR.
const DEFAULT_CENTER: [number, number] = [10.4806, -66.9036];

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-sky-100 text-slate-500">
      <Spinner />
      <span className="ml-2">Cargando mapa…</span>
    </div>
  ),
});

export function StepLocation({ insp, update }: StepProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // El texto de dirección se maneja localmente para no perder el cursor al
  // autoguardar; se persiste en cada cambio.
  const [address, setAddress] = useState(insp.building.address ?? "");
  const mapRef = useRef<import("leaflet").Map | null>(null);

  const picked =
    insp.lat != null && insp.lng != null ? { lat: insp.lat, lng: insp.lng } : null;
  const center: [number, number] = picked ? [picked.lat, picked.lng] : DEFAULT_CENTER;

  // Aplica coordenadas a la inspección y al edificio; intenta dirección si hay red.
  const applyCoords = useCallback(
    (lat: number, lng: number, accuracy?: number) => {
      update((cur) => ({
        lat,
        lng,
        gpsAccuracyM: accuracy,
        building: { ...cur.building, lat, lng },
      }));
      // Dirección en SEGUNDO PLANO: no bloquea el spinner ni la UI (offline
      // devuelve null de inmediato; online no detiene al inspector).
      if (!address.trim()) {
        void reverseGeocode(lat, lng).then((found) => {
          if (found) {
            setAddress(found);
            update((cur) => ({ building: { ...cur.building, address: found } }));
          }
        });
      }
    },
    [update, address],
  );

  // Recentra el mapa cuando aparece/cambia el punto elegido.
  useEffect(() => {
    if (picked && mapRef.current) mapRef.current.setView([picked.lat, picked.lng], 17);
  }, [picked?.lat, picked?.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  async function obtain() {
    setBusy(true);
    setError(null);
    try {
      const pos = await getCurrentPosition();
      applyCoords(pos.lat, pos.lng, pos.accuracy);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo obtener la ubicación.");
    } finally {
      setBusy(false);
    }
  }

  const handlePick = useCallback(
    (ll: { lat: number; lng: number }) => {
      applyCoords(ll.lat, ll.lng, undefined);
    },
    [applyCoords],
  );

  function onAddress(v: string) {
    setAddress(v);
    update((cur) => ({ building: { ...cur.building, address: v } }));
  }

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <CardTitle>Ubicación del edificio</CardTitle>
        <p className="mb-3 mt-1 text-sm text-slate-500">
          Captura el GPS y ajusta el punto sobre el mapa si hace falta.
        </p>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={obtain}
          disabled={busy}
        >
          {busy ? <Spinner /> : <Icon name="pin" size={20} />}
          {busy ? "Obteniendo…" : "Obtener mi ubicación"}
        </Button>

        {error && (
          <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-rojo-ink">
            {error}
          </p>
        )}

        <div className="mt-3 text-sm font-medium">
          {picked ? (
            insp.gpsAccuracyM != null ? (
              <span className="inline-flex items-center gap-1 text-verde-ink">
                <Icon name="check" size={15} /> GPS capturado · precisión ±
                {Math.round(insp.gpsAccuracyM)} m
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-brand">
                <Icon name="check" size={15} /> Ubicación fijada manualmente
              </span>
            )
          ) : (
            <span className="text-slate-500">Aún sin ubicación.</span>
          )}
          {picked && (
            <span className="font-data block text-slate-400">
              {insp.lat!.toFixed(5)}, {insp.lng!.toFixed(5)}
            </span>
          )}
        </div>
      </Card>

      <div className="h-72 w-full overflow-hidden rounded-2xl border border-slate-200">
        <LeafletMap
          className="h-full w-full"
          center={center}
          zoom={picked ? 17 : 13}
          pickMode
          picked={picked}
          onPick={handlePick}
          onReady={(m) => {
            mapRef.current = m;
          }}
        />
      </div>
      <p className="-mt-1 text-center text-xs text-slate-500">
        Toca el mapa o arrastra el marcador para corregir el punto.
      </p>

      <Card>
        <Field label="Dirección / referencia" help="Se autocompleta si hay red; puedes editarla.">
          <TextInput
            value={address}
            onChange={(e) => onAddress(e.target.value)}
            placeholder="Av., calle, sector, punto de referencia…"
            inputMode="text"
          />
        </Field>
      </Card>
    </div>
  );
}
