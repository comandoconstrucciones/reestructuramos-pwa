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
import type { Json } from "./database.types";
import type { CoInspector } from "./funvisis/types";
import type { Inspection, RemoteInspection } from "./types";

/** dataURL (firma/croquis) → Blob binario para subir a Storage. */
function dataUrlToBlob(dataUrl: string): Blob {
  const [head, body] = dataUrl.split(",");
  const mime = head.match(/data:(.*?);/)?.[1] ?? "image/png";
  const bin = atob(body);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

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
      // Planilla FUNVISIS — Sección 1
      estado: b.estado ?? null,
      municipio: b.municipio ?? null,
      ciudad: b.ciudad ?? null,
      sector_calle: b.sectorCalle ?? null,
      n_occupants: b.nOccupants ?? null,
      n_semi_basements: b.nSemiBasements ?? null,
      material: b.material ?? null,
    },
    // insert-or-ignore: NO actualizamos edificios ajenos (la RLS lo restringe a
    // coordinador). El snapshot por-inspección es la fuente de verdad de atributos.
    { onConflict: "id", ignoreDuplicates: true },
  );
  if (bErr) throw bErr;

  // 1b) Croquis de la planta del piso crítico a Storage (antes del upsert de la
  // inspección, para incluir sketch_storage_path en la misma escritura).
  let sketchPath = insp.sketchStoragePath ?? null;
  if (insp.sketchBlob && !sketchPath) {
    const path = `${insp.clientUuid}/croquis.png`;
    const { error: skErr } = await sb.storage
      .from(STORAGE_BUCKET)
      .upload(path, insp.sketchBlob, { upsert: true, contentType: "image/png" });
    if (skErr) throw skErr;
    sketchPath = path;
    await db.inspections.update(insp.clientUuid, { sketchStoragePath: path });
  }

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
      // --- Planilla FUNVISIS ------------------------------------------------
      planilla_no: insp.planillaNo ?? null,
      event_type: insp.eventType ?? null,
      event_date: insp.eventDate ?? null,
      time_start: insp.timeStart ?? null,
      time_end: insp.timeEnd ?? null,
      ext_collapse: insp.extCollapse ?? null,
      ext_adjacent_danger: insp.extAdjacentDanger ?? null,
      ext_geo_danger: insp.extGeoDanger ?? null,
      ext_settlement: insp.extSettlement ?? null,
      ext_tilt: insp.extTilt ?? null,
      risk_external: insp.riskExternal ?? null,
      floors_inspected: insp.floorsInspected ?? null,
      critical_floor: insp.criticalFloor ?? null,
      access_members: insp.accessMembers ?? null,
      n_severe_columns: insp.nSevereColumns ?? 0,
      n_severe_concrete_walls: insp.nSevereConcreteWalls ?? 0,
      n_severe_masonry_walls: insp.nSevereMasonryWalls ?? 0,
      n_severe_beams: insp.nSevereBeams ?? 0,
      risk_severe: insp.riskSevere === "B" ? null : (insp.riskSevere ?? null),
      moderate_pct_estimated: insp.moderatePctEstimated ?? null,
      risk_moderate: insp.riskModerate ?? null,
      comp_slabs: insp.compSlabs ?? null,
      comp_walls_stairs_facades: insp.compWallsStairsFacades ?? null,
      comp_tanks_antennas: insp.compTanksAntennas ?? null,
      comp_utilities: insp.compUtilities ?? null,
      comp_elevators: insp.compElevators ?? null,
      gas_leak: insp.gasLeak ?? false,
      risk_components: insp.riskComponents ?? null,
      risk_overall: insp.riskOverall ?? null,
      prevention_measures: insp.preventionMeasures ?? [],
      sketch_storage_path: sketchPath,
      observations: insp.observations ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "client_uuid" },
  );
  if (iErr) throw iErr;

  // 2b) Conteos de daño moderado (Sección 4) — idempotente por
  // (inspection_id, element_type).
  const counts = (insp.elementCounts ?? []).filter((c) => c.nNoMinor + c.nModerate > 0);
  if (counts.length > 0) {
    const { error: cErr } = await sb.from("inspection_element_counts").upsert(
      counts.map((c) => ({
        inspection_id: insp.clientUuid,
        element_type: c.elementType,
        n_no_minor: c.nNoMinor,
        n_moderate: c.nModerate,
      })),
      { onConflict: "inspection_id,element_type" },
    );
    if (cErr) throw cErr;
  }

  // 2c) Inspectores y firmas (hasta 4). El líder autenticado SIEMPRE queda
  // replicado en la tabla puente con is_lead = true (retrocompatibilidad).
  {
    const roster: CoInspector[] = [...(insp.inspectors ?? [])];
    if (!roster.some((p) => p.isLead)) {
      roster.unshift({
        inspectorId: uid,
        fullName:
          insp.inspectorSignature && !insp.inspectorSignature.startsWith("data:image")
            ? insp.inspectorSignature
            : "Inspector líder",
        isLead: true,
        signedAt: insp.completedAt ?? null,
      });
    }
    const rows: {
      inspection_id: string;
      inspector_id: string | null;
      full_name: string | null;
      national_id: string | null;
      signature_storage_path: string | null;
      signed_at: string | null;
      is_lead: boolean;
    }[] = [];
    for (let i = 0; i < roster.length; i++) {
      const person = roster[i];
      let sigPath = person.signatureStoragePath ?? null;
      if (person.signatureDataUrl && !sigPath) {
        const path = `${insp.clientUuid}/firma-${i + 1}.png`;
        const { error: sErr } = await sb.storage
          .from(STORAGE_BUCKET)
          .upload(path, dataUrlToBlob(person.signatureDataUrl), {
            upsert: true,
            contentType: "image/png",
          });
        if (sErr) throw sErr;
        sigPath = path;
      }
      rows.push({
        inspection_id: insp.clientUuid,
        inspector_id: person.isLead ? uid : (person.inspectorId ?? null),
        full_name: person.fullName || null,
        national_id: person.nationalId || null,
        signature_storage_path: sigPath,
        signed_at: person.signedAt ?? null,
        is_lead: person.isLead,
      });
    }
    // delete + insert: los co-inspectores sin cuenta (inspector_id null) no
    // tienen clave natural, así que el reintento sería duplicante con upsert.
    const { error: dErr } = await sb
      .from("inspection_inspectors")
      .delete()
      .eq("inspection_id", insp.clientUuid);
    if (dErr) throw dErr;
    const { error: iiErr } = await sb.from("inspection_inspectors").insert(rows);
    if (iiErr) throw iiErr;
    // Persiste las rutas de firma localmente (no volver a subir en reintentos).
    await db.inspections.update(insp.clientUuid, {
      inspectors: roster.map((p, i) => ({
        ...p,
        signatureStoragePath: rows[i].signature_storage_path,
      })),
    });
  }

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
        annotation_json: (photo.annotationJson ?? null) as unknown as Json,
        crack_width_mm: photo.crackWidthMm ?? null,
        ai_classification: (photo.aiClassification ?? null) as Json,
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
        constructionType: (r.construction_type ?? null) as RemoteInspection["constructionType"],
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
