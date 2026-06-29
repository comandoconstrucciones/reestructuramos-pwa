"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { PLACARD_META } from "@/lib/placard";
import type { Placard } from "@/lib/types";
import { createOfflineTileLayer } from "./offlineTiles";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  placard?: Placard;
  label?: string;
  onClick?: () => void;
}

export const CARACAS: [number, number] = [10.4806, -66.9036];

function pinIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "rx-pin",
    html: `<svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 27 15 27s15-16.5 15-27C30 6.7 23.3 0 15 0z" fill="${color}" stroke="#fff" stroke-width="2"/>
      <circle cx="15" cy="15" r="5.5" fill="#fff"/>
    </svg>`,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -38],
  });
}

export function LeafletMap({
  markers = [],
  center = CARACAS,
  zoom = 13,
  className,
  pickMode = false,
  picked = null,
  onPick,
  onReady,
}: {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  pickMode?: boolean;
  picked?: { lat: number; lng: number } | null;
  onPick?: (latlng: { lat: number; lng: number }) => void;
  onReady?: (map: L.Map) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayer = useRef<L.LayerGroup | null>(null);
  const pickedMarker = useRef<L.Marker | null>(null);
  const onPickRef = useRef(onPick);
  useEffect(() => {
    onPickRef.current = onPick;
  });

  // Montaje del mapa (una sola vez)
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { center, zoom, zoomControl: true, attributionControl: true });
    createOfflineTileLayer().addTo(map);
    markerLayer.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    map.on("click", (e: L.LeafletMouseEvent) => {
      onPickRef.current?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    onReady?.(map);
    // Recalcular tamaño tras montaje (contenedores flex)
    setTimeout(() => map.invalidateSize(), 120);
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualizar marcadores
  useEffect(() => {
    const group = markerLayer.current;
    if (!group) return;
    group.clearLayers();
    for (const m of markers) {
      const color = m.placard ? PLACARD_META[m.placard].color : "#0369a1";
      const marker = L.marker([m.lat, m.lng], { icon: pinIcon(color) });
      if (m.label) marker.bindPopup(m.label);
      if (m.onClick) marker.on("click", m.onClick);
      marker.addTo(group);
    }
  }, [markers]);

  // Marcador del punto elegido (modo selección)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !pickMode) return;
    if (picked) {
      if (!pickedMarker.current) {
        pickedMarker.current = L.marker([picked.lat, picked.lng], {
          icon: pinIcon("#dc2626"),
          draggable: true,
        }).addTo(map);
        pickedMarker.current.on("dragend", () => {
          const ll = pickedMarker.current!.getLatLng();
          onPickRef.current?.({ lat: ll.lat, lng: ll.lng });
        });
      } else {
        pickedMarker.current.setLatLng([picked.lat, picked.lng]);
      }
    }
  }, [picked, pickMode]);

  return <div ref={containerRef} className={className} style={{ minHeight: 240 }} />;
}

export default LeafletMap;
