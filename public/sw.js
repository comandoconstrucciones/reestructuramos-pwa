/* Service worker de reestructuramos — offline-first, escrito a mano (sin plugin).
 * Estrategias:
 *  - Navegaciones: NetworkFirst con respaldo a caché y a "/".
 *  - /_next/static y assets hasheados: CacheFirst (inmutables).
 *  - Tiles OSM: CacheFirst con expiración suave.
 *  - Supabase (API/Storage/Auth): se deja pasar a la red (los datos viven en IndexedDB).
 */
const VERSION = "v2";
const SHELL = `reestructuramos-shell-${VERSION}`;
const STATIC = `reestructuramos-static-${VERSION}`;
const TILES = `reestructuramos-tiles-${VERSION}`;
const RUNTIME = `reestructuramos-runtime-${VERSION}`;
const KNOWN = [SHELL, STATIC, TILES, RUNTIME];

const APP_SHELL = [
  "/",
  "/onboarding",
  "/inspeccion/nueva",
  "/inspecciones",
  "/guia",
  "/offline.html",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
];

const TILE_MAX_ENTRIES = 3000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL);
      // Cachea cada ruta de forma tolerante: un fallo no rompe la instalación.
      await Promise.all(
        APP_SHELL.map(async (url) => {
          try {
            const res = await fetch(url, { cache: "no-cache" });
            if (res.ok) await cache.put(url, res.clone());
          } catch {
            /* ignorar: se cacheará en tiempo de ejecución */
          }
        }),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.filter((n) => !KNOWN.includes(n)).map((n) => caches.delete(n)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Supabase: siempre red (la app maneja el offline con su cola local).
  if (url.hostname.endsWith(".supabase.co")) return;

  // Tiles de OpenStreetMap: CacheFirst.
  if (url.hostname.endsWith("tile.openstreetmap.org")) {
    event.respondWith(cacheFirst(request, TILES, TILE_MAX_ENTRIES));
    return;
  }

  // Nominatim (reverse geocode): solo red, sin cachear.
  if (url.hostname.endsWith("nominatim.openstreetmap.org")) return;

  // Resto: solo mismo origen.
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(navigationHandler(request));
    return;
  }

  if (url.pathname.startsWith("/_next/static") || /\.(?:js|css|woff2?|png|jpg|jpeg|svg|webp|ico)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, RUNTIME));
});

async function navigationHandler(request) {
  const cache = await caches.open(SHELL);
  try {
    const fresh = await fetch(request);
    if (fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch {
    // 1) ¿La ruta exacta está cacheada (visitada antes online)? Sírvela.
    const exact = await cache.match(request);
    if (exact) return exact;
    // 2) Si es la home, sírvela. Si no, NO mostrar el mapa por una ruta ajena:
    //    usar el fallback offline que resuelve la ruta desde IndexedDB.
    const url = new URL(request.url);
    if (url.pathname === "/") {
      const home = await cache.match("/");
      if (home) return home;
    }
    const offline = await cache.match("/offline.html");
    return (
      offline ||
      (await cache.match("/")) ||
      new Response("Sin conexión.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } })
    );
  }
}

async function cacheFirst(request, cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const fresh = await fetch(request);
    if (fresh.ok) {
      cache.put(request, fresh.clone());
      if (maxEntries) trimCache(cacheName, maxEntries);
    }
    return fresh;
  } catch {
    return cached || Response.error();
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => cached);
  return cached || network;
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  for (let i = 0; i < keys.length - maxEntries; i++) await cache.delete(keys[i]);
}
