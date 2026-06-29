// IndexedDB vía Dexie — fuente de verdad LOCAL (local-first).
// Toda escritura ocurre aquí primero; la sincronización con Supabase es secundaria.

import Dexie, { type Table } from "dexie";
import { newId } from "./id";
import type {
  Building,
  Finding,
  Inspection,
  InspectorProfile,
  MapTile,
  Photo,
  Placard,
  RemoteInspection,
  KV,
} from "./types";

class AppDB extends Dexie {
  inspections!: Table<Inspection, string>;
  photos!: Table<Photo, string>;
  buildings!: Table<Building, string>;
  remoteInspections!: Table<RemoteInspection, string>;
  tiles!: Table<MapTile, string>;
  kv!: Table<KV, string>;

  constructor() {
    super("reestructuramos");
    this.version(1).stores({
      inspections: "clientUuid, status, syncStatus, buildingId, updatedAt, nextSyncAt",
      photos: "id, inspectionClientUuid, findingId, syncStatus",
      buildings: "id, syncStatus, name",
      remoteInspections: "id, placardFinal, cachedAt",
      tiles: "key, fetchedAt",
      kv: "key",
    });
  }
}

export const db = new AppDB();

// --- Perfil del inspector (kv singleton) -----------------------------------

const PROFILE_KEY = "inspector_profile";

export async function getProfile(): Promise<InspectorProfile | null> {
  const row = await db.kv.get(PROFILE_KEY);
  return (row?.value as InspectorProfile) ?? null;
}

export async function setProfile(profile: InspectorProfile): Promise<void> {
  await db.kv.put({ key: PROFILE_KEY, value: profile });
}

export async function ensureProfile(): Promise<InspectorProfile> {
  const existing = await getProfile();
  if (existing) return existing;
  const profile: InspectorProfile = {
    id: newId(),
    role: "voluntario",
    credentialLevel: 1,
    isAnonymous: true,
    createdAt: new Date().toISOString(),
  };
  await setProfile(profile);
  return profile;
}

export async function getFlag(key: string): Promise<unknown> {
  return (await db.kv.get(key))?.value;
}
export async function setFlag(key: string, value: unknown): Promise<void> {
  await db.kv.put({ key, value });
}

// --- Inspecciones ----------------------------------------------------------

export function newBuilding(partial: Partial<Building> = {}): Building {
  return {
    id: newId(),
    isEssential: false,
    softStory: false,
    shortColumn: false,
    createdAt: new Date().toISOString(),
    syncStatus: "pending",
    ...partial,
  };
}

/** Crea (y persiste) un borrador de evaluación rápida.
 *  Para una RE-INSPECCIÓN, pasa el edificio existente (mismo id) y el cartel
 *  previo: así múltiples inspecciones comparten building_id y el historial se
 *  agrega (nunca se sobrescribe el registro anterior). */
export async function createDraftInspection(opts?: {
  building?: Building;
  previousPlacard?: Placard | null;
}): Promise<Inspection> {
  const now = new Date().toISOString();
  const building = opts?.building
    ? { ...opts.building, syncStatus: "pending" as const }
    : newBuilding();
  const insp: Inspection = {
    clientUuid: newId(),
    buildingId: building.id,
    building,
    inspectorId: null,
    evaluationLevel: "rapida",
    inspectedAt: now,
    previousPlacard: opts?.previousPlacard ?? null,
    placardSuggested: "none",
    placardFinal: "none",
    barricadesNeeded: false,
    detailedEvalRecommended: [],
    findings: [],
    status: "draft",
    step: 0,
    createdAt: now,
    updatedAt: now,
    syncStatus: "pending",
    syncAttempts: 0,
  };
  await db.inspections.put(insp);
  return insp;
}

/** RE-INSPECCIÓN sobre un edificio existente: registro NUEVO que comparte
 *  building_id con las inspecciones previas y arrastra el cartel anterior. */
export async function createReinspection(buildingId: string): Promise<Inspection> {
  const prior = await inspectionsForBuilding(buildingId);
  const last = prior[0];
  const base: Building =
    last?.building ?? (await db.buildings.get(buildingId)) ?? newBuilding({ id: buildingId });
  return createDraftInspection({
    building: { ...base, id: buildingId },
    previousPlacard: last?.placardFinal ?? null,
  });
}

/** Guarda cambios de un borrador (autosave). Actualiza updatedAt. */
export async function saveInspection(
  insp: Inspection,
  patch?: Partial<Inspection>,
): Promise<Inspection> {
  const next: Inspection = { ...insp, ...patch, updatedAt: new Date().toISOString() };
  await db.inspections.put(next);
  return next;
}

/**
 * Escritura PARCIAL: actualiza SOLO las claves del patch (Dexie update). No
 * reescribe el registro completo, así un autosave en vuelo NUNCA puede resucitar
 * `status`/`completedAt`/`syncStatus` y revertir un finalize. Úsalo en el autosave.
 */
export async function patchInspection(
  clientUuid: string,
  patch: Partial<Inspection>,
): Promise<void> {
  await db.inspections.update(clientUuid, { ...patch, updatedAt: new Date().toISOString() });
}

export async function getInspection(clientUuid: string): Promise<Inspection | undefined> {
  return db.inspections.get(clientUuid);
}

export async function listInspections(): Promise<Inspection[]> {
  const all = await db.inspections.toArray();
  return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function listDrafts(): Promise<Inspection[]> {
  const drafts = await db.inspections.where("status").equals("draft").toArray();
  return drafts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** Marca el borrador como completado, registra el edificio y lo encola para sync. */
export async function finalizeInspection(clientUuid: string): Promise<void> {
  await db.transaction("rw", db.inspections, db.buildings, async () => {
    const insp = await db.inspections.get(clientUuid);
    if (!insp) return;
    const now = new Date().toISOString();
    await db.buildings.put({ ...insp.building, syncStatus: "pending" });
    await db.inspections.put({
      ...insp,
      status: "complete",
      // Sella la fecha efectiva al finalizar (no al crear el borrador).
      inspectedAt: now,
      completedAt: now,
      updatedAt: now,
      syncStatus: "pending",
      syncAttempts: 0,
      nextSyncAt: undefined,
      lastSyncError: null,
    });
  });
}

export async function deleteInspection(clientUuid: string): Promise<void> {
  await db.transaction("rw", db.inspections, db.photos, async () => {
    await db.photos.where("inspectionClientUuid").equals(clientUuid).delete();
    await db.inspections.delete(clientUuid);
  });
}

// --- Hallazgos (anidados en la inspección) ---------------------------------

export async function upsertFinding(clientUuid: string, finding: Finding): Promise<void> {
  const insp = await db.inspections.get(clientUuid);
  if (!insp) return;
  const idx = insp.findings.findIndex((f) => f.id === finding.id);
  const findings = [...insp.findings];
  if (idx >= 0) findings[idx] = finding;
  else findings.push(finding);
  await saveInspection(insp, { findings });
}

// --- Fotos (SIEMPRE ligadas a una inspección; opcional a un hallazgo) -------

/** Guarda la foto y la vincula al hallazgo dentro de la inspección, atómicamente. */
export async function addPhoto(photo: Photo): Promise<void> {
  await db.transaction("rw", db.photos, db.inspections, async () => {
    await db.photos.put(photo);
    if (photo.findingId) {
      const insp = await db.inspections.get(photo.inspectionClientUuid);
      if (insp) {
        const findings = insp.findings.map((f) =>
          f.id === photo.findingId && !f.photoIds.includes(photo.id)
            ? { ...f, photoIds: [...f.photoIds, photo.id] }
            : f,
        );
        await db.inspections.put({ ...insp, findings, updatedAt: new Date().toISOString() });
      }
    }
  });
}

export async function deletePhoto(id: string): Promise<void> {
  await db.transaction("rw", db.photos, db.inspections, async () => {
    const photo = await db.photos.get(id);
    await db.photos.delete(id);
    if (photo) {
      const insp = await db.inspections.get(photo.inspectionClientUuid);
      if (insp) {
        const findings = insp.findings.map((f) => ({
          ...f,
          photoIds: f.photoIds.filter((pid) => pid !== id),
        }));
        await db.inspections.put({ ...insp, findings, updatedAt: new Date().toISOString() });
      }
    }
  });
}

export async function getPhoto(id: string): Promise<Photo | undefined> {
  return db.photos.get(id);
}

export async function listPhotos(clientUuid: string): Promise<Photo[]> {
  return db.photos.where("inspectionClientUuid").equals(clientUuid).toArray();
}

// --- Edificios -------------------------------------------------------------

export async function listBuildings(): Promise<Building[]> {
  return db.buildings.toArray();
}

export async function inspectionsForBuilding(buildingId: string): Promise<Inspection[]> {
  const list = await db.inspections.where("buildingId").equals(buildingId).toArray();
  return list.sort((a, b) => (b.inspectedAt || "").localeCompare(a.inspectedAt || ""));
}

// --- Caché de inspecciones remotas (para el mapa) --------------------------

export async function cacheRemoteInspections(items: RemoteInspection[]): Promise<void> {
  await db.remoteInspections.bulkPut(items);
}
export async function listRemoteInspections(): Promise<RemoteInspection[]> {
  return db.remoteInspections.toArray();
}

// --- Tiles de mapa offline -------------------------------------------------

export async function getTile(key: string): Promise<MapTile | undefined> {
  return db.tiles.get(key);
}
export async function putTile(tile: MapTile): Promise<void> {
  await db.tiles.put(tile);
}
export async function countTiles(): Promise<number> {
  return db.tiles.count();
}
export async function clearTiles(): Promise<void> {
  await db.tiles.clear();
}

// --- Cola de sincronización ------------------------------------------------

/** Inspecciones completas pendientes de subir cuyo backoff ya venció. */
export async function pendingInspections(): Promise<Inspection[]> {
  const now = Date.now();
  const list = await db.inspections.where("status").equals("complete").toArray();
  return list.filter(
    (i) =>
      (i.syncStatus === "pending" || i.syncStatus === "error") &&
      (i.nextSyncAt == null || i.nextSyncAt <= now),
  );
}

export async function countPending(): Promise<number> {
  const list = await db.inspections.where("status").equals("complete").toArray();
  return list.filter((i) => i.syncStatus === "pending" || i.syncStatus === "error").length;
}
