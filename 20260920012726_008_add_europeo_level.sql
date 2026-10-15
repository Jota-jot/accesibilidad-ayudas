-- Add 'europeo' to the administration_level CHECK constraint on aid_programs
ALTER TABLE public.aid_programs DROP CONSTRAINT IF EXISTS aid_programs_administration_level_check;
ALTER TABLE public.aid_programs ADD CONSTRAINT aid_programs_administration_level_check
  CHECK (administration_level = ANY (ARRAY['europeo'::text, 'estatal'::text, 'autonomico'::text, 'provincial'::text, 'municipal'::text]));

-- Add a European Union territory (parent of España)
INSERT INTO public.territories (id, name, slug, type, parent_id, code, active)
SELECT 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Unión Europea', 'union-europea', 'pais', NULL, 'EU', true
WHERE NOT EXISTS (SELECT 1 FROM public.territories WHERE slug = 'union-europea');

-- Make España a child of Unión Europea
UPDATE public.territories
SET parent_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
WHERE slug = 'espana' AND parent_id IS NULL;
