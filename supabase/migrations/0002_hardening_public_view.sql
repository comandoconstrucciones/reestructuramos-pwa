-- Endurecimiento de privacidad (issue #1, Build4Venezuela).
-- Problema: las políticas de lectura `using (true)` en inspections /
-- inspection_findings / finding_photos dejaban que cualquier cliente anónimo
-- leyera TODAS las columnas (firma del inspector, comentarios libres,
-- inspector_id, coordenadas), cuando el mapa/historial solo necesitan un
-- subconjunto seguro.
--
-- Solución: exponer SOLO columnas seguras vía la vista `inspections_public`,
-- y restringir la lectura de las tablas base al dueño (o coordinador).

-- 1) Vista pública con columnas seguras (lo que el mapa y el historial usan).
--    security_invoker=false => corre como owner y expone estas columnas de
--    todas las filas, sin revelar las sensibles.
create or replace view inspections_public
with (security_invoker = false) as
select
  i.id,
  i.client_uuid,
  i.building_id,
  i.lat,
  i.lng,
  i.placard_final,
  i.evaluation_level,
  i.inspected_at,
  b.name              as building_name,
  b.address           as address,
  b.construction_type as construction_type,
  b.occupancy_type    as occupancy_type,
  b.year_built        as year_built,
  b.is_essential      as is_essential
from inspections i
left join buildings b on b.id = i.building_id;

grant select on inspections_public to anon, authenticated;

-- 2) Restringir la lectura de las tablas base al dueño (o coordinador).
drop policy if exists inspections_select on inspections;
create policy inspections_select on inspections for select
  using (inspector_id = auth.uid() or is_coordinator());

drop policy if exists findings_select on inspection_findings;
create policy findings_select on inspection_findings for select
  using (owns_inspection(inspection_id) or is_coordinator());

drop policy if exists photos_select on finding_photos;
create policy photos_select on finding_photos for select
  using (owns_inspection(inspection_id) or is_coordinator());

notify pgrst, 'reload schema';
