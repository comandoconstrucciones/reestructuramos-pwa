// Capa de tiles con caché offline en IndexedDB (Dexie) + precarga de área.
import L from "leaflet";
import { getTile, putTile } from "@/lib/db";

export const OSM_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const OSM_ATTRIB = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

async function loadTileInto(
  img: HTMLImageElement,
  key: string,
  url: string,
  done: (err: Error | null, tile?: HTMLElement) => void,
) {
  try {
    const cached = await getTile(key);
    let blob: Blob | undefined = cached?.blob;
    if (!blob) {
      const res = await fetch(url);
      if (res.ok) {
        blob = await res.blob();
        await putTile({ key, blob, fetchedAt: Date.now() });
      }
    }
    if (blob) {
      const objUrl = URL.createObjectURL(blob);
      img.onload = () => {
        URL.revokeObjectURL(objUrl);
        done(null, img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        done(new Error("tile error"));
      };
      img.src = objUrl;
    } else {
      done(new Error("sin tile"));
    }
  } catch (e) {
    done(e instanceof Error ? e : new Error("tile error"));
  }
}

/** TileLayer que sirve desde IndexedDB y cae a la red, guardando lo que baja. */
export function createOfflineTileLayer(): L.TileLayer {
  const Layer = L.TileLayer.extend({
    createTile(this: L.TileLayer, coords: L.Coords, done: (e: Error | null, t?: HTMLElement) => void) {
      const img = document.createElement("img");
      img.setAttribute("role", "presentation");
      img.alt = "";
      const key = `${coords.z}/${coords.x}/${coords.y}`;
      const url = (this as unknown as { getTileUrl: (c: L.Coords) => string }).getTileUrl(coords);
      void loadTileInto(img, key, url, done);
      return img;
    },
  });
  return new (Layer as unknown as new (url: string, opts: L.TileLayerOptions) => L.TileLayer)(OSM_URL, {
    attribution: OSM_ATTRIB,
    maxZoom: 19,
    crossOrigin: true,
  });
}

// --- Precarga de área de trabajo -------------------------------------------

function lon2tile(lon: number, z: number) {
  return Math.floor(((lon + 180) / 360) * 2 ** z);
}
function lat2tile(lat: number, z: number) {
  const r = (lat * Math.PI) / 180;
  return Math.floor(((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * 2 ** z);
}

const MAX_PRECACHE = 1500; // tope de tiles para no agotar la red/almacenamiento

/** Descarga y guarda los tiles del área visible para los zooms indicados. */
export async function precacheBounds(
  bounds: L.LatLngBounds,
  zooms: number[],
  onProgress?: (done: number, total: number) => void,
): Promise<{ fetched: number; total: number; capped: boolean }> {
  const jobs: { key: string; url: string }[] = [];
  for (const z of zooms) {
    const x0 = lon2tile(bounds.getWest(), z);
    const x1 = lon2tile(bounds.getEast(), z);
    const y0 = lat2tile(bounds.getNorth(), z);
    const y1 = lat2tile(bounds.getSouth(), z);
    for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++) {
      for (let y = Math.min(y0, y1); y <= Math.max(y0, y1); y++) {
        jobs.push({
          key: `${z}/${x}/${y}`,
          url: OSM_URL.replace("{z}", String(z)).replace("{x}", String(x)).replace("{y}", String(y)),
        });
      }
    }
  }
  const capped = jobs.length > MAX_PRECACHE;
  const list = jobs.slice(0, MAX_PRECACHE);
  let done = 0;
  const CONCURRENCY = 6;
  let cursor = 0;
  async function worker() {
    while (cursor < list.length) {
      const job = list[cursor++];
      try {
        if (!(await getTile(job.key))) {
          const res = await fetch(job.url);
          if (res.ok) await putTile({ key: job.key, blob: await res.blob(), fetchedAt: Date.now() });
        }
      } catch {
        /* ignorar tile fallido */
      }
      done++;
      onProgress?.(done, list.length);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  return { fetched: done, total: list.length, capped };
}
