-- Alineación 1:1 con la planilla oficial "Evaluación Rápida de Daños en
-- Edificaciones" (FUNVISIS / IMME-UCV, López et al. 2023).
-- SOLO cambios ADITIVOS: la capa ATC-20 existente queda intacta y convive
-- con la capa FUNVISIS (A→verde/INSPECTED, B→amarillo/RESTRICTED, C→rojo/UNSAFE).

-- ===========================================================================
-- 1.1 buildings — identificación político-territorial + ocupantes
-- ===========================================================================

ALTER TABLE public.buildings
  ADD COLUMN IF NOT EXISTS estado text,
  ADD COLUMN IF NOT EXISTS municipio text,
  ADD COLUMN IF NOT EXISTS ciudad text,
  ADD COLUMN IF NOT EXISTS sector_calle text,
  ADD COLUMN IF NOT EXISTS n_occupants integer,
  ADD COLUMN IF NOT EXISTS n_semi_basements integer,
  -- Material según catálogo FUNVISIS. Va en columna nueva porque
  -- construction_type (ATC-20) tiene CHECK propio; la app deriva uno del otro.
  ADD COLUMN IF NOT EXISTS material text;

-- Los dashboards agregan por municipio.
CREATE INDEX IF NOT EXISTS idx_buildings_municipio ON public.buildings (municipio);

-- ===========================================================================
-- 1.2 Catálogos oficiales (validación en la app + zod; sin CHECK sobre
--     columnas existentes con datos)
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.catalog_occupancy (
  code text PRIMARY KEY,
  label text NOT NULL,
  sort int NOT NULL DEFAULT 0
);

INSERT INTO public.catalog_occupancy (code, label, sort) VALUES
  ('vivienda',            'Vivienda',                1),
  ('comercio_oficina',    'Comercio / Oficina',      2),
  ('gubernamental',       'Gubernamental',           3),
  ('educativo',           'Educativo',               4),
  ('medico_asistencial',  'Médico-asistencial',      5),
  ('seguridad',           'Seguridad',               6),
  ('industrial',          'Industrial',              7),
  ('cultural_recreativo', 'Cultural / Recreativo',   8),
  ('religioso',           'Religioso',               9),
  ('otros',               'Otros',                  10)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.catalog_material (
  code text PRIMARY KEY,
  label text NOT NULL,
  sort int NOT NULL DEFAULT 0
);

INSERT INTO public.catalog_material (code, label, sort) VALUES
  ('concreto',             'Concreto armado',        1),
  ('acero',                'Acero',                  2),
  ('mamposteria_formal',   'Mampostería formal',     3),
  ('mamposteria_informal', 'Mampostería informal',   4),
  ('otro',                 'Otro',                   5)
ON CONFLICT (code) DO NOTHING;

-- ===========================================================================
-- 1.3 inspections — planilla FUNVISIS (secciones 1–7)
-- ===========================================================================

ALTER TABLE public.inspections
  -- Encabezado
  ADD COLUMN IF NOT EXISTS planilla_no text,
  ADD COLUMN IF NOT EXISTS event_type text CHECK (event_type IN ('sismo','deslizamiento','asentamiento','explosion','incendio','inundacion','otro')),
  ADD COLUMN IF NOT EXISTS event_date date,
  ADD COLUMN IF NOT EXISTS time_start time,
  ADD COLUMN IF NOT EXISTS time_end time,
  -- Sección 2: Inspección externa (calificar sin ingresar)
  ADD COLUMN IF NOT EXISTS ext_collapse text CHECK (ext_collapse IN ('no','posible_parcial_total')),
  ADD COLUMN IF NOT EXISTS ext_adjacent_danger text CHECK (ext_adjacent_danger IN ('no','moderado','elevado')),
  ADD COLUMN IF NOT EXISTS ext_geo_danger text CHECK (ext_geo_danger IN ('no','moderado','elevado')),
  ADD COLUMN IF NOT EXISTS ext_settlement text CHECK (ext_settlement IN ('no','hasta_20cm','mayor_20cm')),
  ADD COLUMN IF NOT EXISTS ext_tilt text CHECK (ext_tilt IN ('no','hasta_2cm_60cm','mayor_2cm_60cm')),
  ADD COLUMN IF NOT EXISTS risk_external char(1) CHECK (risk_external IN ('A','B','C')),
  -- Sección 3: Piso crítico y daño Severo/Completo
  ADD COLUMN IF NOT EXISTS floors_inspected text,
  ADD COLUMN IF NOT EXISTS critical_floor text,
  ADD COLUMN IF NOT EXISTS access_members text CHECK (access_members IN ('todos','casi_todos','pocos','ninguno')),
  ADD COLUMN IF NOT EXISTS n_severe_columns integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS n_severe_concrete_walls integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS n_severe_masonry_walls integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS n_severe_beams integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS risk_severe char(1) CHECK (risk_severe IN ('A','C')),
  -- Sección 4: riesgo por daño moderado (los conteos van en tabla aparte)
  ADD COLUMN IF NOT EXISTS moderate_pct_estimated numeric,
  ADD COLUMN IF NOT EXISTS risk_moderate char(1) CHECK (risk_moderate IN ('A','B','C')),
  -- Sección 5: componentes no estructurales (a/b/c por componente)
  ADD COLUMN IF NOT EXISTS comp_slabs char(1) CHECK (comp_slabs IN ('a','b','c')),
  ADD COLUMN IF NOT EXISTS comp_walls_stairs_facades char(1) CHECK (comp_walls_stairs_facades IN ('a','b','c')),
  ADD COLUMN IF NOT EXISTS comp_tanks_antennas char(1) CHECK (comp_tanks_antennas IN ('a','b','c')),
  ADD COLUMN IF NOT EXISTS comp_utilities char(1) CHECK (comp_utilities IN ('a','b','c')),
  ADD COLUMN IF NOT EXISTS comp_elevators char(1) CHECK (comp_elevators IN ('a','b','c')),
  ADD COLUMN IF NOT EXISTS gas_leak boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS risk_components char(1) CHECK (risk_components IN ('A','B','C')),
  -- Sección 6: decisión final
  ADD COLUMN IF NOT EXISTS risk_overall char(1) CHECK (risk_overall IN ('A','B','C')),
  -- Sección 7: acciones recomendadas
  ADD COLUMN IF NOT EXISTS prevention_measures text[] DEFAULT '{}',
  -- Croquis
  ADD COLUMN IF NOT EXISTS sketch_storage_path text,
  ADD COLUMN IF NOT EXISTS observations text;

-- ===========================================================================
-- 1.4 Conteos de daño moderado por tipo de elemento (Sección 4)
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.inspection_element_counts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  element_type text NOT NULL CHECK (element_type IN ('columna_union','muro_concreto','muro_mamposteria','viga_arriostramiento')),
  n_no_minor integer NOT NULL DEFAULT 0 CHECK (n_no_minor >= 0),
  n_moderate integer NOT NULL DEFAULT 0 CHECK (n_moderate >= 0),
  n_examined integer GENERATED ALWAYS AS (n_no_minor + n_moderate) STORED,
  pct_moderate numeric GENERATED ALWAYS AS (
    CASE WHEN (n_no_minor + n_moderate) > 0
      THEN round(100.0 * n_moderate / (n_no_minor + n_moderate), 1)
      ELSE 0 END
  ) STORED,
  UNIQUE (inspection_id, element_type)
);

CREATE INDEX IF NOT EXISTS idx_element_counts_inspection
  ON public.inspection_element_counts (inspection_id);

-- ===========================================================================
-- 1.5 Inspectores múltiples y firmas (la planilla admite hasta 4)
-- ===========================================================================
-- Adaptación necesaria respecto al spec: inspectors.id referencia
-- auth.users(id), así que los co-inspectores de campo SIN cuenta no pueden
-- tener fila en inspectors. inspector_id queda NULLABLE y se añade full_name:
-- el líder (autenticado) lleva inspector_id + is_lead=true; los co-inspectores
-- llevan full_name + firma. UNIQUE(inspection_id, inspector_id) sigue
-- impidiendo duplicar a un inspector registrado (NULLs no chocan entre sí).

CREATE TABLE IF NOT EXISTS public.inspection_inspectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  inspector_id uuid REFERENCES public.inspectors(id),
  full_name text,
  signature_storage_path text,
  signed_at timestamptz,
  is_lead boolean DEFAULT false,
  UNIQUE (inspection_id, inspector_id)
);

CREATE INDEX IF NOT EXISTS idx_inspection_inspectors_inspection
  ON public.inspection_inspectors (inspection_id);

-- ===========================================================================
-- 1.6 Staging para importar QuickCheck Damage (ESRE)
-- ===========================================================================

CREATE TABLE IF NOT EXISTS public.quickcheck_import_staging (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_filename text,
  raw_row jsonb NOT NULL,
  mapped_inspection_id uuid REFERENCES public.inspections(id),
  import_status text DEFAULT 'pending' CHECK (import_status IN ('pending','mapped','error')),
  error_detail text,
  created_at timestamptz DEFAULT now()
);

-- ===========================================================================
-- 1.7 RLS — misma lógica que inspections / inspection_findings
-- ===========================================================================

ALTER TABLE public.catalog_occupancy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_material ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_element_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_inspectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quickcheck_import_staging ENABLE ROW LEVEL SECURITY;

-- Catálogos: lectura pública (la app los necesita para pintar la UI);
-- escritura solo coordinador.
DROP POLICY IF EXISTS catalog_occupancy_select ON public.catalog_occupancy;
CREATE POLICY catalog_occupancy_select ON public.catalog_occupancy FOR SELECT USING (true);
DROP POLICY IF EXISTS catalog_occupancy_write ON public.catalog_occupancy;
CREATE POLICY catalog_occupancy_write ON public.catalog_occupancy FOR ALL
  USING (is_coordinator()) WITH CHECK (is_coordinator());

DROP POLICY IF EXISTS catalog_material_select ON public.catalog_material;
CREATE POLICY catalog_material_select ON public.catalog_material FOR SELECT USING (true);
DROP POLICY IF EXISTS catalog_material_write ON public.catalog_material;
CREATE POLICY catalog_material_write ON public.catalog_material FOR ALL
  USING (is_coordinator()) WITH CHECK (is_coordinator());

-- inspection_element_counts: mismo patrón que inspection_findings
-- (dueño de la inspección o coordinador).
DROP POLICY IF EXISTS element_counts_select ON public.inspection_element_counts;
CREATE POLICY element_counts_select ON public.inspection_element_counts FOR SELECT
  USING (owns_inspection(inspection_id) OR is_coordinator());
DROP POLICY IF EXISTS element_counts_insert ON public.inspection_element_counts;
CREATE POLICY element_counts_insert ON public.inspection_element_counts FOR INSERT
  WITH CHECK (owns_inspection(inspection_id));
DROP POLICY IF EXISTS element_counts_update ON public.inspection_element_counts;
CREATE POLICY element_counts_update ON public.inspection_element_counts FOR UPDATE
  USING (owns_inspection(inspection_id) OR is_coordinator())
  WITH CHECK (owns_inspection(inspection_id) OR is_coordinator());
DROP POLICY IF EXISTS element_counts_delete ON public.inspection_element_counts;
CREATE POLICY element_counts_delete ON public.inspection_element_counts FOR DELETE
  USING (owns_inspection(inspection_id) OR is_coordinator());

-- inspection_inspectors: mismo patrón (contiene firmas => datos sensibles,
-- lectura restringida al dueño o coordinador, igual que finding_photos).
DROP POLICY IF EXISTS inspection_inspectors_select ON public.inspection_inspectors;
CREATE POLICY inspection_inspectors_select ON public.inspection_inspectors FOR SELECT
  USING (owns_inspection(inspection_id) OR is_coordinator());
DROP POLICY IF EXISTS inspection_inspectors_insert ON public.inspection_inspectors;
CREATE POLICY inspection_inspectors_insert ON public.inspection_inspectors FOR INSERT
  WITH CHECK (owns_inspection(inspection_id));
DROP POLICY IF EXISTS inspection_inspectors_update ON public.inspection_inspectors;
CREATE POLICY inspection_inspectors_update ON public.inspection_inspectors FOR UPDATE
  USING (owns_inspection(inspection_id) OR is_coordinator())
  WITH CHECK (owns_inspection(inspection_id) OR is_coordinator());
DROP POLICY IF EXISTS inspection_inspectors_delete ON public.inspection_inspectors;
CREATE POLICY inspection_inspectors_delete ON public.inspection_inspectors FOR DELETE
  USING (owns_inspection(inspection_id) OR is_coordinator());

-- quickcheck_import_staging: herramienta administrativa => solo coordinador
-- (equivale al rol que puede escribir sobre datos ajenos en inspections).
DROP POLICY IF EXISTS quickcheck_staging_all ON public.quickcheck_import_staging;
CREATE POLICY quickcheck_staging_all ON public.quickcheck_import_staging FOR ALL
  USING (is_coordinator()) WITH CHECK (is_coordinator());

-- ===========================================================================
-- Vista pública: añade columnas FUNVISIS SEGURAS (sin firmas, sin inspector,
-- sin comentarios) para el mapa/dashboard. Reemplazo aditivo de la vista.
-- ===========================================================================

DROP VIEW IF EXISTS public.inspections_public;
CREATE VIEW public.inspections_public
WITH (security_invoker = false) AS
SELECT
  i.id,
  i.client_uuid,
  i.building_id,
  i.lat,
  i.lng,
  i.placard_final,
  i.evaluation_level,
  i.inspected_at,
  i.event_type,
  i.event_date,
  i.risk_overall,
  b.name              AS building_name,
  b.address           AS address,
  b.construction_type AS construction_type,
  b.occupancy_type    AS occupancy_type,
  b.year_built        AS year_built,
  b.is_essential      AS is_essential,
  b.estado            AS estado,
  b.municipio         AS municipio,
  b.ciudad            AS ciudad
FROM public.inspections i
LEFT JOIN public.buildings b ON b.id = i.building_id;

GRANT SELECT ON public.inspections_public TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
