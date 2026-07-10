# reestructuramos — guía para agentes de código

PWA **offline-first** de inspección estructural post-sismo alineada 1:1 con la metodología oficial
venezolana **"Evaluación Rápida de Daños en Edificaciones" (FUNVISIS / IMME-UCV, López et al. 2023)**.
FUNVISIS es la capa PRIMARIA de captura; la capa ATC-20 convive y se DERIVA del mapeo
A→verde(INSPECTED), B→amarillo(RESTRICTED), C→rojo(UNSAFE). No romper ninguna de las dos.
Stack: **Next.js 16 (App Router) + React 19.2 + TypeScript + Tailwind v4 + Dexie + Supabase + Leaflet + zod + vitest**.

## ⚠️ Esto NO es el Next.js que conoces (Next 16 — breaking changes)

- **Turbopack es el bundler por defecto** de `next dev` y `next build`. NO agregues `webpack` a `next.config.ts` (rompería el build). El service worker es manual (`public/sw.js`), no un plugin.
- **`params` y `searchParams` son `Promise`** en `page`/`layout`/`route`. Siempre `const { id } = await params;`. Usa el helper `PageProps<'/ruta/[id]'>` (corre `pnpm next typegen` si lo necesitas).
- `middleware` se llama `proxy` ahora (no lo usamos).
- Lint: `pnpm lint` (ESLint flat config). `next lint` ya no existe.
- `metadata`/`generateMetadata` solo en Server Components. Para `viewport`/`themeColor` usa el export `viewport` (no dentro de `metadata`).
- Manifest: `app/manifest.ts` (ya existe). Íconos en `/public` (ya generados).

## Principios innegociables (del brief)

1. **Offline-first real**: todo funciona sin red. Las pantallas son **Client Components** que leen de **Dexie** con `useLiveQuery`. Nunca bloquees la UI esperando la red.
2. **Cero pérdida de datos**: escribe local primero (Dexie). El asistente autoguarda en cada paso (`drafts`).
3. **Evidencia ligada al hallazgo**: cada foto va atada a `inspectionClientUuid` y opcionalmente a un `findingId`. Prohibido el "álbum suelto".
4. **Nunca sobrescribir historial**: re-inspección = registro NUEVO (`client_uuid` nuevo).
5. **Sugiere, no decide**: guarda `placardSuggested` y `placardFinal` por separado.
6. **Antifraude**: GPS + timestamp embebidos en inspección y en cada foto.
7. **UX de campo**: targets ≥48px (`.touch-target`), alto contraste, tema claro, mínima escritura, una pregunta por pantalla.

## Contratos compartidos (YA EXISTEN — impórtalos, no los redefinas)

- `@/lib/types` — todos los tipos de dominio y enums (`Inspection`, `Building`, `Finding`, `Photo`, `Placard`, `Severity`, etc.).
- `@/lib/catalog` — catálogos: tipologías, ocupación, elementos por categoría, bandas de daño, y **contenido de la guía de campo** (patrones de daño, árbol de decisión, glosario).
- `@/lib/db` — instancia Dexie `db` + helpers (`saveDraft`, `loadDraft`, `finalizeInspection`, `listInspections`, `savePhoto`, etc.).
- `@/lib/placard` — `suggestPlacard(input)` (función pura) + textos de cartel.
- `@/lib/geo` — `getCurrentPosition()`, `reverseGeocode()`.
- `@/lib/image` — `compressImage(file|blob)` (máx 1600px, JPEG ~0.7).
- `@/lib/id` — `newId()` (uuid v4 vía `crypto.randomUUID`).
- `@/lib/cn` — `cn(...)` (clsx + tailwind-merge).
- `@/lib/supabase` — `getSupabase()` tipado con `Database` (o null si no configurado), `isSupabaseConfigured`.
- `@/lib/database.types` — tipos generados de Supabase (regenerar vía MCP, NO editar a mano).
- `@/lib/funvisis/types` — enums/tipos de la planilla FUNVISIS (evento, aspectos externos, conteos, componentes, medidas, firmas).
- `@/lib/funvisis/scoring` — motor PURO de la planilla: `scoreExternal/scoreSevere/scoreModerate/scoreComponents/computeFunvisis`, reglas de corte, `DAMAGE_CRITERIA`, `suggestGradeFromCrackWidth`, `overrideNeedsReason`. Tests en `scoring.test.ts` (`pnpm test`) — NO tocar las reglas sin tests en verde.
- `@/lib/funvisis/catalog` — textos oficiales es-VE de la planilla (aspectos, componentes, medidas, catálogos de uso/material).
- `@/lib/funvisis/validation` — schemas zod por paso del asistente (`validateStep`).
- `@/lib/funvisis/normalize` — normalización legado↔FUNVISIS (detailed evals, material→tipología ATC-20, nº de planilla).
- `@/lib/funvisis/pdf` — `buildPlanillaPdf` (planilla oficial 2 págs.) y `buildEtiquetaPdf` (media carta).
- `@/lib/funvisis/export` — filas planas + `buildCsv`/`buildGeoJson` con mapeo dual `placard_atc20`/`etiqueta_funvisis`.
- `@/lib/sync` — `syncEngine` (cola con backoff) + `useSyncStatus()`.
- `@/lib/store` — Zustand: estado online/offline y de sincronización.
- Componentes en `@/components/ui` (Button, Card, SeverityPicker, Toggle, Stepper, Sheet…), `@/components/PhotoCapture`, `@/components/AnnotationCanvas`, `@/components/BottomNav`, `@/components/map/*`.

## Mapa de rutas (App Router)

- `/` — Mapa de daños (pines por cartel) + botón "Nueva inspección".
- `/onboarding` — inducción + mini-quiz.
- `/inspeccion/nueva` — asistente de Evaluación Rápida: **7 pasos = planilla FUNVISIS** (1 Información general, 2 Inspección externa, 3 Piso crítico, 4 Daño Moderado, 5 Componentes, 6 Decisión final, 7 Acciones y firmas). Reglas de corte: riesgo externo C o N severo ≥ 1 saltan al paso 6 y omiten las secciones intermedias.
- `/inspecciones` — mis inspecciones + estado de sync.
- `/inspeccion/[clientUuid]` — resultado/cartel + PDF + QR.
- `/edificio/[id]` — historial del edificio (destino del QR).
- `/guia` — guía de campo offline.
- `/admin` — dashboard: mapa semáforo, filtros (evento/municipio/fecha/sync), contadores y exports CSV/GeoJSON.
- `/admin/importar` — importador del zip de QuickCheck Damage (JSZip + sql.js con `/sql-wasm.wasm` local → `quickcheck_import_staging`; requiere coordinador).

## Reglas de oro al implementar

- `"use client"` en toda pantalla que use Dexie/estado/eventos.
- Lee datos con `useLiveQuery` de `dexie-react-hooks` para reactividad offline.
- No instales dependencias nuevas (ya están todas, incl. zod, jszip, sql.js, vitest). No toques `package.json`, `next.config.ts`, `app/globals.css`, ni los archivos de `@/lib/*` salvo que sean tuyos.
- Español es-VE en toda la UI. Identificadores en inglés.
- Verifica con `pnpm typecheck` y `pnpm build` antes de dar por hecho algo.

## Scripts

- `pnpm dev` — desarrollo. `pnpm build` — build prod (Turbopack). `pnpm start` — servir.
- `pnpm typecheck` — `tsc --noEmit`. `pnpm lint` — ESLint. `pnpm test` — vitest (motor FUNVISIS). `pnpm gen:icons` — regenerar íconos.
