-- La planilla oficial FUNVISIS pide "Nombre y Apellido" + "Cédula de
-- Identidad" por cada inspector (Sección 1). Cambio aditivo.

ALTER TABLE public.inspection_inspectors
  ADD COLUMN IF NOT EXISTS national_id text;

NOTIFY pgrst, 'reload schema';
