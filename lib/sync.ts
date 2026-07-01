// Motor de sincronización propio: cola con reintentos y backoff exponencial.
// NO depende de Background Sync API (iOS Safari no la soporta bien).
// Se dispara al recuperar conectividad y periódicamente.

import {
  countPending,
  db,
  cacheRemoteInspections,
  getProfile,
  pendingInspections,
  setProfile,
} from "./db";
import { ensureAuth, getSupabase, STORAGE_BUCKET } from "./supabase";
import { useSyncStore } from "./store";
import type { Inspection, RemoteInspection } from "./types";

const BACKOFF_BASE_MS = 5000;
const BACKOFF_MAX_MS = 5 * 60 * 1000;
const POLL_INTERVAL_MS = 60 * 1000;

let started = false;
let pollTimer: ReturnType<typeof setInterval> | null = null;
let running = false;

function backoff(attempts: number): number {
  return Math.min(BACKOFF_BASE_MS * 2 ** attempts, BACKOFF_MAX_MS);
}

async function refreshPendingCount(): Promise<void> {
  useSyncStore.getState().setPendingCount(await countPending());
}

/** Sube una inspección completa (edificio → inspección → hallazgos → fotos). */
async function pushInspection(insp: Inspection, uid: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase no configurado");

  // 1) Edificio (compartido entre inspecciones)
  const b = insp.building;
  const { error: bErr } = await sb.from("buildings").upsert(
    {
      id: b.id,
      name: b.name ?? null,
      address: b.address ?? null,
      lat: b.lat ?? null,
      lng: b.lng ?? null,
      construction_type: b.constructionType ?? null,
      n_stories_above: b.nStoriesAbove ?? null,
      n_stories_below: b.nStoriesBelow ?? null,
      year_built: b.yearBuilt ?? null,
      occupancy_type: b.occupancyType ?? null,
      footprint_area_m2: b.footprintAreaM2 ?? null,
      is_essential: b.isEssential,
      soft_story: b.softStory,
      short_column: b.shortColumn,
    },
    // insert-or-ignore: NO actualizamos edificios ajenos (la RLS lo restringe a
    // coordinador). El snapshot por-inspección es la fuente de verdad de atributos.
    { onConflict: "id", ignoreDuplicates: true },
  );
  if (bErr) throw bErr;

  // 2) Inspección (id = client_uuid → idempotente)
  const { error: iErr } = await sb.from("inspections").upsert(
    {
      id: insp.clientUuid,
      client_uuid: insp.clientUuid,
      building_id: insp.buildingId,
      inspector_id: uid,
      evaluation_level: insp.evaluationLevel,
      inspected_at: insp.inspectedAt,
      areas_inspected: insp.areasInspected ?? null,
      lat: insp.lat ?? null,
      lng: insp.lng ?? null,
      gps_accuracy_m: insp.gpsAccuracyM ?? null,
      estimated_damage_band: insp.estimatedDamageBand ?? null,
      placard_suggested: insp.placardSuggested,
      placard_final: insp.placardFinal,
      placard_override_reason: insp.placardOverrideReason ?? null,
      previous_placard: insp.previousPlacard ?? null,
      entry_restrictions: insp.entryRestrictions ?? null,
      barricades_needed: insp.barricadesNeeded,
      detailed_eval_recommended: insp.detailedEvalRecommended,
      general_comments: insp.generalComments ?? null,
      inspector_signature: insp.inspectorSignature ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "client_uuid" },
  );
  if (iErr) throw iErr;

  // 3) Hallazgos
  if (insp.findings.length > 0) {
    const { error: fErr } = await sb.from("inspection_findings").upsert(
      insp.findings.map((f) => ({
        id: f.id,
        inspection_id: insp.clientUuid,
        category: f.category,
        element: f.element,
        severity: f.severity,
        notes: f.notes ?? null,
      })),
      { onConflict: "id" },
    );
    if (fErr) throw fErr;
  }

  // 4) Fotos: subir blob a Storage y registrar finding_photos
  const photos = await db.photos.where("inspectionClientUuid").equals(insp.clientUuid).toArray();
  for (const photo of photos) {
    if (photo.syncStatus === "synced" && photo.storagePath) continue;
    const path = `${insp.clientUuid}/${photo.id}.jpg`;
    if (photo.blob) {
      const { error: upErr } = await sb.storage
        .from(STORAGE_BUCKET)
        .upload(path, photo.blob, { upsert: true, contentType: "image/jpeg" });
      if (upErr) throw upErr;
    }
    const { error: pErr } = await sb.from("finding_photos").upsert(
      {
        id: photo.id,
        inspection_id: insp.clientUuid,
        finding_id: photo.findingId ?? null,
        storage_path: path,
        lat: photo.lat ?? null,
        lng: photo.lng ?? null,
        captured_at: photo.capturedAt,
        caption: photo.caption ?? null,
        annotation_json: photo.annotationJson ?? null,
        crack_width_mm: photo.crackWidthMm ?? null,
        ai_classification: photo.aiClassification ?? null,
      },
      { onConflict: "id" },
    );
    if (pErr) throw pErr;
    await db.photos.update(photo.id, { syncStatus: "synced", storagePath: path });
  }

  // 5) Inspección sincronizada
  await db.inspections.update(insp.clientUuid, {
    syncStatus: "synced",
    syncAttempts: 0,
    lastSyncError: null,
    nextSyncAt: undefined,
  });
  await db.buildings.update(insp.buildingId, { syncStatus: "synced" });
}

/** Procesa toda la cola pendiente. Idempotente y seguro de reintentar. */
export async function processQueue(): Promise<void> {
  if (running) return;
  if (typeof navigator !== "undefined" && !navigator.onLine) return;
  const sb = getSupabase();
  if (!sb) return;

  running = true;
  const store = useSyncStore.getState();
  store.setSyncing(true);
  try {
    const uid = await ensureAuth();
    if (!uid) return; // sin red/sesión: dejar pendiente
    try {
      await ensureInspectorRow(uid);
    } catch {
      // Sin fila de inspector, las inspecciones fallarían por FK con error opaco.
      store.setError("No se pudo registrar el inspector para sincronizar.");
      return;
    }

    let hadError = false;
    const queue = await pendingInspections();
    for (const insp of queue) {
      try {
        await pushInspection(insp, uid);
      } catch (err) {
        hadError = true;
        const attempts = (insp.syncAttempts ?? 0) + 1;
        await db.inspections.update(insp.clientUuid, {
          syncStatus: "error",
          syncAttempts: attempts,
          nextSyncAt: Date.now() + backoff(attempts),
          lastSyncError: err instanceof Error ? err.message : String(err),
        });
        store.setError(err instanceof Error ? err.message : String(err));
      }
    }
    // No enmascarar el error: solo limpiar lastError si TODO el lote subió bien.
    if (hadError) useSyncStore.setState({ lastSyncAt: Date.now() });
    else store.markSynced();
  } finally {
    running = false;
    store.setSyncing(false);
    await refreshPendingCount();
  }
}

/** Asegura que exista la fila del inspector en Supabase (datos del perfil). */
async function ensureInspectorRow(uid: string): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const profile = await getProfile();
  const { error } = await sb.from("inspectors").upsert(
    {
      id: uid,
      full_name: profile?.fullName ?? null,
      national_id: profile?.nationalId ?? null,
      role: profile?.role ?? "voluntario",
      credential_level: profile?.credentialLevel ?? 1,
      phone: profile?.phone ?? null,
      email: profile?.email ?? null,
      is_anonymous: profile?.isAnonymous ?? true,
    },
    { onConflict: "id" },
  );
  if (error) throw error;
  if (profile && profile.id !== uid) {
    await setProfile({ ...profile, id: uid });
  }
}

/** Baja inspecciones públicas para alimentar el mapa de daños (cuando hay red). */
export async function pullMapData(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  if (typeof navigator !== "undefined" && !navigator.onLine) return;
  try {
    // Lee de la VISTA pública (solo columnas seguras); nunca de la tabla base,
    // que expone firma/comentarios/inspector_id y queda restringida al dueño.
    const { data, error } = await sb
      .from("inspections_public")
      .select(
        "id, lat, lng, placard_final, evaluation_level, inspected_at, building_name, address, construction_type, is_essential",
      )
      .not("lat", "is", null)
      .order("inspected_at", { ascending: false })
      .limit(5000);
    if (error || !data) return;
    const now = Date.now();
    const items: RemoteInspection[] = data
      .filter((r): r is typeof r & { lat: number; lng: number } => r.lat != null && r.lng != null)
      .map((r) => ({
        id: r.id as string,
        lat: r.lat,
        lng: r.lng,
        placardFinal: (r.placard_final ?? "none") as RemoteInspection["placardFinal"],
        evaluationLevel: (r.evaluation_level ?? "rapida") as RemoteInspection["evaluationLevel"],
        inspectedAt: r.inspected_at as string,
        buildingName: r.building_name ?? null,
        address: r.address ?? null,
        constructionType: r.construction_type ?? null,
        isEssential: r.is_essential ?? null,
        cachedAt: now,
      }));
    await cacheRemoteInspections(items);
  } catch {
    /* silencioso: el mapa usa la caché local */
  }
}

/** Dispara sincronización + refresco del mapa (ambos seguros offline). */
export function triggerSync(): void {
  void processQueue();
  void pullMapData();
}

/** Arranca listeners de conectividad y el poll periódico. Llamar una vez. */
export function startSync(): void {
  if (started || typeof window === "undefined") return;
  started = true;

  const onOnline = () => {
    useSyncStore.getState().setOnline(true);
    triggerSync();
  };
  const onOffline = () => useSyncStore.getState().setOnline(false);
  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && navigator.onLine) triggerSync();
  });

  pollTimer = setInterval(() => {
    if (navigator.onLine) triggerSync();
  }, POLL_INTERVAL_MS);

  void refreshPendingCount();
  if (navigator.onLine) triggerSync();
}

export function stopSync(): void {
  if (pollTimer) clearInterval(pollTimer);
  pollTimer = null;
  started = false;
}
