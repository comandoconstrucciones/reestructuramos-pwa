# reestructuramos

PWA **offline-first** para **evaluación rápida de seguridad estructural de edificios después de un terremoto**, para Venezuela (inicialmente Caracas), tras los sismos **M7.2 + M7.5 del 24 de junio de 2026**. Sistema universal de carteles **verde / amarillo / rojo** basado en **ATC-20**, adaptado a **COVENIN 1756**. También sirve como herramienta de inducción/formación de inspectores.

> Acceso público y anónimo. Funciona al 100% sin conexión y sincroniza sola cuando vuelve la red.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Dexie (IndexedDB) · Supabase (Postgres + PostGIS + Storage + Auth anónima + RLS) · Leaflet + OpenStreetMap (tiles con caché offline) · jsPDF · Service Worker propio.

## Puesta en marcha

```bash
pnpm install
cp .env.example .env.local   # (opcional) credenciales de Supabase
pnpm dev
```

La app corre **sin Supabase** (todo local). Para habilitar sincronización y el mapa colaborativo, configura `.env.local`.

### Configurar Supabase

1. Crea un proyecto en Supabase.
2. Aplica la migración `supabase/migrations/0001_init.sql` (SQL Editor o `supabase db push`).
3. **Auth → habilita "Anonymous sign-ins".**
4. Verifica que exista el bucket público `inspection-photos` (lo crea la migración).
5. Copia `Project URL` y `anon public key` a `.env.local`.

## Scripts

| Comando | Descripción |
|---|---|
| `pnpm dev` | Desarrollo |
| `pnpm build` | Build de producción (Turbopack) |
| `pnpm start` | Servir build |
| `pnpm typecheck` | Chequeo de tipos (`tsc --noEmit`) |
| `pnpm lint` | ESLint |
| `pnpm gen:icons` | Regenerar íconos PWA |

## Arquitectura (resumen)

- **Local-first**: toda escritura va primero a IndexedDB (Dexie). Ver `lib/db.ts`.
- **Sincronización**: cola propia con backoff exponencial (`lib/sync.ts`); no depende de Background Sync API.
- **Offline shell**: service worker en `public/sw.js` (NetworkFirst para navegación, CacheFirst para assets y tiles).
- **Mapa**: Leaflet con capa de tiles cacheada en IndexedDB + precarga de área (`components/map/`).
- **Lógica de cartel**: `lib/placard.ts` (sugiere; el inspector decide).
- Ver `CLAUDE.md` para convenciones de Next 16 y el mapa de rutas.

## Despliegue

Pensado para **Vercel**. Configurar las variables `NEXT_PUBLIC_SUPABASE_*`. El service worker requiere HTTPS (Vercel lo provee).

## Nota legal

Formulario **original** inspirado en la metodología ATC-20 (conceptos y lógica de triaje de uso libre). No reproduce el layout propietario de ATC. Diseñado como instrumento venezolano alineado a COVENIN 1756.
