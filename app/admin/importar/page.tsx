"use client";
// Importador de QuickCheck Damage (ESRE): acepta el zip exportado por la app
// oficial (contiene un SQLite «db_hazard …»), vuelca TODAS las filas crudas a
// quickcheck_import_staging (jsonb) y mapea best-effort a buildings +
// inspections. Tolerante a errores: si la estructura interna no coincide, todo
// queda en staging con error_detail (nunca falla el lote completo).
// Requiere sesión con rol coordinador (RLS de la tabla de staging).
import { useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button, Card, CardTitle, Spinner } from "@/components/ui";
import { newId } from "@/lib/id";
import { ensureAuth, getSupabase } from "@/lib/supabase";
import type { Json } from "@/lib/database.types";

type Progress = { phase: string; detail?: string };
type Summary = {
  tables: number;
  rows: number;
  staged: number;
  mapped: number;
  errors: number;
  notes: string[];
};

// --- Heurísticas de mapeo (estructura interna desconocida => best-effort) ---

const LAT_KEYS = ["lat", "latitude", "latitud", "gps_lat", "y"];
const LNG_KEYS = ["lng", "lon", "long", "longitude", "longitud", "gps_lng", "x"];
const NAME_KEYS = ["name", "nombre", "building", "edificio", "edificacion", "title"];
const ADDRESS_KEYS = ["address", "direccion", "dir", "street", "calle", "sector"];
const TAG_KEYS = ["tag", "placard", "etiqueta", "color", "safety", "riesgo", "risk", "estado_edificio"];
const DATE_KEYS = ["inspected_at", "fecha", "date", "created_at", "timestamp", "fecha_inspeccion"];

function findKey(row: Record<string, unknown>, candidates: string[]): string | null {
  const keys = Object.keys(row);
  for (const cand of candidates) {
    const hit = keys.find((k) => k.toLowerCase() === cand || k.toLowerCase().includes(cand));
    if (hit) return hit;
  }
  return null;
}

function toNumber(v: unknown): number | null {
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

function guessPlacard(v: unknown): "verde" | "amarillo" | "rojo" | null {
  const s = String(v ?? "").toLowerCase();
  if (/green|verde|habitable|inspected|^g$|^a$/.test(s)) return "verde";
  if (/yellow|amarill|restrin|restrict|atencion|^y$|^b$/.test(s)) return "amarillo";
  if (/red|rojo|unsafe|peligro|inseguro|^r$|^c$/.test(s)) return "rojo";
  return null;
}

export default function ImportarQuickCheckPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    setSummary(null);
    const notes: string[] = [];
    try {
      const sb = getSupabase();
      if (!sb) throw new Error("Supabase no está configurado en esta instalación.");
      const uid = await ensureAuth();
      if (!uid) throw new Error("Sin sesión. Inicia sesión (coordinador) en /cuenta e intenta de nuevo.");

      // 1) Obtener los bytes del SQLite (del zip o directo)
      setProgress({ phase: "Leyendo archivo…" });
      let dbBytes: Uint8Array | null = null;
      let sourceName = file.name;
      if (/\.zip$/i.test(file.name)) {
        const { default: JSZip } = await import("jszip");
        const zip = await JSZip.loadAsync(await file.arrayBuffer());
        const entries = Object.values(zip.files).filter((f) => !f.dir);
        const dbEntry =
          entries.find((f) => /\.(db|sqlite|sqlite3)$/i.test(f.name)) ??
          entries.find((f) => /db_hazard/i.test(f.name)) ??
          entries[0];
        if (!dbEntry) throw new Error("El zip está vacío.");
        sourceName = `${file.name}::${dbEntry.name}`;
        dbBytes = await dbEntry.async("uint8array");
      } else {
        dbBytes = new Uint8Array(await file.arrayBuffer());
      }

      // 2) Abrir el SQLite con sql.js (WASM local => funciona offline)
      setProgress({ phase: "Abriendo base SQLite…" });
      const initSqlJs = (await import("sql.js")).default;
      const SQL = await initSqlJs({ locateFile: () => "/sql-wasm.wasm" });
      const sqlite = new SQL.Database(dbBytes);

      // 3) Volcar todas las tablas a staging como jsonb crudo
      const tablesRes = sqlite.exec(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
      );
      const tableNames: string[] = tablesRes[0]?.values.map((v) => String(v[0])) ?? [];
      if (tableNames.length === 0) notes.push("El SQLite no contiene tablas de usuario.");

      let totalRows = 0;
      let staged = 0;
      let mapped = 0;
      let errors = 0;
      const stagingRows: { id: string; row: Record<string, unknown>; table: string }[] = [];

      for (const table of tableNames) {
        setProgress({ phase: "Volcando a staging…", detail: table });
        let res;
        try {
          res = sqlite.exec(`SELECT * FROM "${table.replaceAll('"', '""')}"`);
        } catch {
          notes.push(`No se pudo leer la tabla ${table}.`);
          continue;
        }
        const cols = res[0]?.columns ?? [];
        const values = res[0]?.values ?? [];
        for (const rowVals of values) {
          const row: Record<string, unknown> = {};
          cols.forEach((c, i) => {
            const v = rowVals[i];
            // Blobs no van al jsonb (solo su tamaño, para diagnóstico).
            row[c] = v instanceof Uint8Array ? `<blob ${v.length} bytes>` : v;
          });
          stagingRows.push({ id: newId(), row, table });
          totalRows++;
        }
      }
      sqlite.close();

      // Insertar staging por lotes (200)
      for (let i = 0; i < stagingRows.length; i += 200) {
        const batch = stagingRows.slice(i, i + 200);
        const { error: sErr } = await sb.from("quickcheck_import_staging").insert(
          batch.map((r) => ({
            id: r.id,
            source_filename: sourceName,
            raw_row: { table: r.table, data: r.row } as Json,
          })),
        );
        if (sErr) {
          throw new Error(
            sErr.message.includes("row-level security")
              ? "Permiso denegado: el importador requiere rol coordinador."
              : `Error volcando a staging: ${sErr.message}`,
          );
        }
        staged += batch.length;
        setProgress({ phase: "Volcando a staging…", detail: `${staged}/${stagingRows.length}` });
      }

      // 4) Mapeo best-effort: filas con lat/lng => buildings + inspections
      setProgress({ phase: "Mapeando inspecciones…" });
      for (const item of stagingRows) {
        const latKey = findKey(item.row, LAT_KEYS);
        const lngKey = findKey(item.row, LNG_KEYS);
        const lat = latKey ? toNumber(item.row[latKey]) : null;
        const lng = lngKey ? toNumber(item.row[lngKey]) : null;
        // Solo se mapean filas geolocalizadas plausibles (el resto queda pending).
        if (lat == null || lng == null || Math.abs(lat) > 90 || Math.abs(lng) > 180 || (lat === 0 && lng === 0)) {
          continue;
        }
        try {
          const nameKey = findKey(item.row, NAME_KEYS);
          const addressKey = findKey(item.row, ADDRESS_KEYS);
          const tagKey = findKey(item.row, TAG_KEYS);
          const dateKey = findKey(item.row, DATE_KEYS);
          const placard = tagKey ? guessPlacard(item.row[tagKey]) : null;
          const when = dateKey ? new Date(String(item.row[dateKey])) : null;
          const inspectedAt =
            when && !Number.isNaN(when.getTime()) ? when.toISOString() : new Date().toISOString();

          const buildingId = newId();
          const { error: bErr } = await sb.from("buildings").insert({
            id: buildingId,
            name: nameKey ? String(item.row[nameKey] ?? "").slice(0, 200) || null : null,
            address: addressKey ? String(item.row[addressKey] ?? "").slice(0, 300) || null : null,
            lat,
            lng,
          });
          if (bErr) throw bErr;

          const inspectionId = newId();
          const { error: iErr } = await sb.from("inspections").insert({
            id: inspectionId,
            client_uuid: inspectionId,
            building_id: buildingId,
            inspector_id: uid,
            evaluation_level: "rapida",
            inspected_at: inspectedAt,
            lat,
            lng,
            placard_suggested: "none",
            placard_final: placard ?? "none",
            general_comments: `Importado de QuickCheck Damage (${sourceName}, tabla ${item.table}).`,
          });
          if (iErr) throw iErr;

          const { error: uErr } = await sb
            .from("quickcheck_import_staging")
            .update({ mapped_inspection_id: inspectionId, import_status: "mapped" })
            .eq("id", item.id);
          if (uErr) throw uErr;
          mapped++;
        } catch (e) {
          errors++;
          await sb
            .from("quickcheck_import_staging")
            .update({
              import_status: "error",
              error_detail: e instanceof Error ? e.message : String(e),
            })
            .eq("id", item.id);
        }
      }

      if (mapped === 0 && totalRows > 0) {
        notes.push(
          "Ninguna fila coincidió con la estructura esperada: todo quedó en staging (pending) para mapeo manual.",
        );
      }
      setSummary({ tables: tableNames.length, rows: totalRows, staged, mapped, errors, notes });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  return (
    <AppShell title="Importar QuickCheck" back>
      <div className="mx-auto flex max-w-lg flex-col gap-4 pb-6">
        <Card>
          <CardTitle>Importar desde QuickCheck Damage</CardTitle>
          <p className="mb-3 mt-1 text-sm text-slate-500">
            Sube el zip exportado por la app oficial QuickCheck Damage (contiene una base SQLite
            «db_hazard …»). Todas las filas se conservan crudas en staging; las que tengan
            coordenadas se convierten en edificaciones e inspecciones.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".zip,.db,.sqlite,.sqlite3,application/zip"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (f) void handleFile(f);
            }}
          />
          <Button fullWidth size="lg" disabled={busy} onClick={() => inputRef.current?.click()}>
            {busy ? <Spinner /> : null}
            {busy ? (progress ? `${progress.phase} ${progress.detail ?? ""}` : "Importando…") : "Elegir archivo…"}
          </Button>
          <p className="mt-2 text-xs text-slate-400">
            Requiere sesión de coordinador (inicia sesión en /cuenta).
          </p>
        </Card>

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-rojo-ink">{error}</div>
        )}

        {summary && (
          <Card>
            <CardTitle>Resultado de la importación</CardTitle>
            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Tablas leídas</dt><dd className="font-bold">{summary.tables}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Filas encontradas</dt><dd className="font-bold">{summary.rows}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Volcadas a staging</dt><dd className="font-bold">{summary.staged}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Mapeadas a inspecciones</dt><dd className="font-bold text-verde-ink">{summary.mapped}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">Con error (en staging)</dt><dd className="font-bold text-rojo">{summary.errors}</dd></div>
            </dl>
            {summary.notes.length > 0 && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-slate-500">
                {summary.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </div>
    </AppShell>
  );
}
