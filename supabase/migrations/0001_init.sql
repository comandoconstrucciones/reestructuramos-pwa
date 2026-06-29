-- reestructuramos — esquema inicial (PostgreSQL + PostGIS) con RLS.
-- Requiere además habilitar "Anonymous sign-ins" en Auth (ver README).

create extension if not exists postgis;

-- ===========================================================================
-- Tablas
-- ===========================================================================

create table if not exists inspectors (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  national_id text,
  role text not null default 'voluntario'
       check (role in ('voluntario','ingeniero','arquitecto','coordinador')),
  credential_level int not null default 1,
  phone text,
  email text,
  is_anonymous boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists buildings (
  id uuid primary key default gen_random_uuid(),
  name text,
  address text,
  lat double precision,
  lng double precision,
  geom geography(Point,4326),
  construction_type text check (construction_type in
    ('portico_concreto','muro_concreto','mamposteria_confinada',
     'mamposteria_no_confinada','estructura_metalica','mixto',
     'rancho_autoconstruccion','otro')),
  n_stories_above int,
  n_stories_below int,
  year_built int,
  occupancy_type text,
  footprint_area_m2 numeric,
  is_essential boolean default false,
  soft_story boolean default false,
  short_column boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists inspections (
  id uuid primary key default gen_random_uuid(),
  client_uuid uuid not null,
  building_id uuid references buildings(id),
  inspector_id uuid references inspectors(id),
  evaluation_level text not null default 'rapida'
       check (evaluation_level in ('rapida','detallada')),
  inspected_at timestamptz not null,
  areas_inspected text check (areas_inspected in ('exterior','exterior_interior')),
  lat double precision,
  lng double precision,
  geom geography(Point,4326),
  gps_accuracy_m numeric,
  estimated_damage_band text check (estimated_damage_band in
    ('0-1','1-10','10-30','30-60','60-100','100')),
  placard_suggested text check (placard_suggested in ('verde','amarillo','rojo','none')),
  placard_final text check (placard_final in ('verde','amarillo','rojo','none')),
  placard_override_reason text,
  previous_placard text,
  entry_restrictions text,
  barricades_needed boolean default false,
  detailed_eval_recommended text[],
  general_comments text,
  inspector_signature text,
  sync_status text not null default 'synced',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_uuid)
);

create table if not exists inspection_findings (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid references inspections(id) on delete cascade,
  category text not null check (category in
    ('peligro_general','estructural','no_estructural','geotecnico')),
  element text not null,
  severity text not null check (severity in ('ninguno','leve','moderado','severo')),
  notes text
);

create table if not exists finding_photos (
  id uuid primary key default gen_random_uuid(),
  inspection_id uuid references inspections(id) on delete cascade,
  finding_id uuid references inspection_findings(id) on delete set null,
  storage_path text,
  lat double precision,
  lng double precision,
  captured_at timestamptz,
  caption text,
  annotation_json jsonb,
  crack_width_mm numeric,
  ai_classification jsonb
);

create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  building_id uuid references buildings(id),
  inspector_id uuid references inspectors(id),
  zone text,
  status text default 'asignado' check (status in ('asignado','en_curso','completado')),
  assigned_by uuid references inspectors(id),
  created_at timestamptz not null default now()
);

-- Índices geoespaciales y de consulta
create index if not exists idx_buildings_geom on buildings using gist (geom);
create index if not exists idx_inspections_geom on inspections using gist (geom);
create index if not exists idx_inspections_building on inspections (building_id);
create index if not exists idx_inspections_inspector on inspections (inspector_id);
create index if not exists idx_findings_inspection on inspection_findings (inspection_id);
create index if not exists idx_photos_inspection on finding_photos (inspection_id);

-- ===========================================================================
-- Triggers: poblar geom desde lat/lng (el cliente solo envía lat/lng)
-- ===========================================================================

create or replace function set_geom_from_latlng() returns trigger
language plpgsql as $$
begin
  if new.lat is not null and new.lng is not null then
    new.geom := st_setsrid(st_makepoint(new.lng, new.lat), 4326)::geography;
  else
    new.geom := null;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_buildings_geom on buildings;
create trigger trg_buildings_geom before insert or update of lat, lng on buildings
  for each row execute function set_geom_from_latlng();

drop trigger if exists trg_inspections_geom on inspections;
create trigger trg_inspections_geom before insert or update of lat, lng on inspections
  for each row execute function set_geom_from_latlng();

-- ===========================================================================
-- Helpers de autorización (SECURITY DEFINER para evitar recursión de RLS)
-- ===========================================================================

create or replace function is_coordinator() returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from inspectors where id = auth.uid() and role = 'coordinador');
$$;

create or replace function owns_inspection(insp uuid) returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from inspections where id = insp and inspector_id = auth.uid());
$$;

-- ===========================================================================
-- Row Level Security
-- ===========================================================================

alter table inspectors enable row level security;
alter table buildings enable row level security;
alter table inspections enable row level security;
alter table inspection_findings enable row level security;
alter table finding_photos enable row level security;
alter table assignments enable row level security;

-- inspectors: datos personales restringidos al dueño o coordinador
drop policy if exists inspectors_select on inspectors;
create policy inspectors_select on inspectors for select
  using (id = auth.uid() or is_coordinator());
drop policy if exists inspectors_insert on inspectors;
create policy inspectors_insert on inspectors for insert
  with check (id = auth.uid());
drop policy if exists inspectors_update on inspectors;
create policy inspectors_update on inspectors for update
  using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists inspectors_delete on inspectors;
create policy inspectors_delete on inspectors for delete
  using (is_coordinator());

-- buildings: lectura pública (mapa); escritura de cualquier autenticado (infra compartida)
drop policy if exists buildings_select on buildings;
create policy buildings_select on buildings for select using (true);
drop policy if exists buildings_insert on buildings;
create policy buildings_insert on buildings for insert with check (auth.uid() is not null);
-- Solo coordinador puede MODIFICAR un edificio existente: evita que cualquier
-- anónimo sobrescriba datos de un edificio ajeno (p.ej. mover un hospital).
-- El flujo normal solo INSERTA edificios nuevos (insert-or-ignore en el cliente).
drop policy if exists buildings_update on buildings;
create policy buildings_update on buildings for update
  using (is_coordinator()) with check (is_coordinator());
drop policy if exists buildings_delete on buildings;
create policy buildings_delete on buildings for delete using (is_coordinator());

-- inspections: lectura pública; escritura solo del dueño (o coordinador). NUNCA de otro.
drop policy if exists inspections_select on inspections;
create policy inspections_select on inspections for select using (true);
drop policy if exists inspections_insert on inspections;
create policy inspections_insert on inspections for insert
  with check (inspector_id = auth.uid());
drop policy if exists inspections_update on inspections;
create policy inspections_update on inspections for update
  using (inspector_id = auth.uid() or is_coordinator())
  with check (inspector_id = auth.uid() or is_coordinator());
drop policy if exists inspections_delete on inspections;
create policy inspections_delete on inspections for delete
  using (inspector_id = auth.uid() or is_coordinator());

-- inspection_findings: lectura pública; escritura ligada al dueño de la inspección
drop policy if exists findings_select on inspection_findings;
create policy findings_select on inspection_findings for select using (true);
drop policy if exists findings_insert on inspection_findings;
create policy findings_insert on inspection_findings for insert
  with check (owns_inspection(inspection_id));
drop policy if exists findings_update on inspection_findings;
create policy findings_update on inspection_findings for update
  using (owns_inspection(inspection_id) or is_coordinator())
  with check (owns_inspection(inspection_id) or is_coordinator());
drop policy if exists findings_delete on inspection_findings;
create policy findings_delete on inspection_findings for delete
  using (owns_inspection(inspection_id) or is_coordinator());

-- finding_photos: igual patrón
drop policy if exists photos_select on finding_photos;
create policy photos_select on finding_photos for select using (true);
drop policy if exists photos_insert on finding_photos;
create policy photos_insert on finding_photos for insert
  with check (owns_inspection(inspection_id));
drop policy if exists photos_update on finding_photos;
create policy photos_update on finding_photos for update
  using (owns_inspection(inspection_id) or is_coordinator())
  with check (owns_inspection(inspection_id) or is_coordinator());
drop policy if exists photos_delete on finding_photos;
create policy photos_delete on finding_photos for delete
  using (owns_inspection(inspection_id) or is_coordinator());

-- assignments: lectura por dueño/coordinador; escritura por coordinador
drop policy if exists assignments_select on assignments;
create policy assignments_select on assignments for select
  using (inspector_id = auth.uid() or is_coordinator());
drop policy if exists assignments_write on assignments;
create policy assignments_write on assignments for all
  using (is_coordinator()) with check (is_coordinator());

-- ===========================================================================
-- Storage: bucket de fotos (lectura pública)
-- ===========================================================================

insert into storage.buckets (id, name, public)
values ('inspection-photos', 'inspection-photos', true)
on conflict (id) do nothing;

drop policy if exists photos_read on storage.objects;
create policy photos_read on storage.objects for select
  using (bucket_id = 'inspection-photos');
drop policy if exists photos_upload on storage.objects;
create policy photos_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'inspection-photos');
drop policy if exists photos_modify on storage.objects;
create policy photos_modify on storage.objects for update to authenticated
  using (bucket_id = 'inspection-photos' and owner = auth.uid());
drop policy if exists photos_remove on storage.objects;
create policy photos_remove on storage.objects for delete to authenticated
  using (bucket_id = 'inspection-photos' and (owner = auth.uid() or is_coordinator()));
