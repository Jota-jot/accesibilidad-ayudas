-- Add missing actions for the new catalog
INSERT INTO public.actions (name, slug, description, active) VALUES
  ('Alquiler y vivienda asequible', 'alquiler-vivienda-asequible', 'Ayudas relacionadas con el acceso y mantenimiento de vivienda en alquiler', true),
  ('Eficiencia energética', 'eficiencia-energetica', 'Mejora de la eficiencia energética y rehabilitación energética de edificios', true),
  ('Adquisición de vivienda', 'adquisicion-vivienda', 'Programas de ayuda para la adquisición de vivienda', true),
  ('Recuperación de viviendas', 'recuperacion-viviendas', 'Reparación y recuperación de viviendas afectadas por desastres naturales', true),
  ('Conservación y habitabilidad', 'conservacion-habitabilidad', 'Obras de conservación, habitabilidad y mejora de condiciones de vivienda', true),
  ('Lucha contra la despoblación', 'despoblacion', 'Medidas para fijar población en municipios rurales', true)
ON CONFLICT (slug) DO NOTHING;

-- Add missing accessibility type for energy efficiency context
INSERT INTO public.accessibility_types (name, slug, description, active) VALUES
  ('Rehabilitación energética', 'rehabilitacion-energetica', 'Mejoras de eficiencia energética con componente de accesibilidad', true)
ON CONFLICT (slug) DO NOTHING;
