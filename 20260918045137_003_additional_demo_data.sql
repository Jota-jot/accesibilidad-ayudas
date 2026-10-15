/*
# Add additional demo aids, sources, and provinces

This migration adds:
1. Provinces for Comunidad de Madrid (so the province selector works)
2. Sources for existing 3 demo aids
3. 3 new DEMO aids: ascensor, salvaescaleras, espacio público
4. Full relations for all new demo aids (beneficiaries, actions, accessibility types,
   solutions, financing, requirements, documents, sources)
*/

-- ============================================================
-- Provinces for Comunidad de Madrid
-- ============================================================
INSERT INTO public.territories (name, slug, type, parent_id, code)
SELECT v.name, v.slug, 'provincia', c.id, v.code
FROM (VALUES
  ('Madrid', 'madrid-provincia', 'MD'),
  ('Guadalajara', 'guadalajara-provincia', 'GU'),
  ('Toledo', 'toledo-provincia', 'TO')
) AS v(name, slug, code)
CROSS JOIN (SELECT id FROM public.territories WHERE slug = 'comunidad-de-madrid') c
WHERE NOT EXISTS (SELECT 1 FROM public.territories t WHERE t.slug = v.slug);

-- Add Madrid city as a municipality
INSERT INTO public.territories (name, slug, type, parent_id, code)
SELECT 'Madrid', 'madrid-municipio', 'municipio', p.id, '28079'
FROM (SELECT id FROM public.territories WHERE slug = 'madrid-provincia') p
WHERE NOT EXISTS (SELECT 1 FROM public.territories t WHERE t.slug = 'madrid-municipio');

-- ============================================================
-- Sources for existing demo aids
-- ============================================================
INSERT INTO public.sources (name, source_type, url, verified, last_checked_at, aid_id)
SELECT '[DEMO] Fuente demostrativa — Plan Estatal', 'portal_institucional', NULL, false, now(), ap.id
FROM public.aid_programs ap WHERE ap.slug = 'demo-plan-estatal-accesibilidad-edificios'
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = ap.id);

INSERT INTO public.sources (name, source_type, url, verified, last_checked_at, aid_id)
SELECT '[DEMO] Fuente demostrativa — Comunidad de Madrid', 'comunidad_autonoma', NULL, false, now(), ap.id
FROM public.aid_programs ap WHERE ap.slug = 'demo-madrid-adaptacion-vivienda-discapacidad'
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = ap.id);

INSERT INTO public.sources (name, source_type, url, verified, last_checked_at, aid_id)
SELECT '[DEMO] Fuente demostrativa — Ayuntamiento', 'ayuntamiento', NULL, false, now(), ap.id
FROM public.aid_programs ap WHERE ap.slug = 'demo-municipal-eliminacion-barreras'
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = ap.id);

-- ============================================================
-- DEMO AID 4: Ascensor en edificios (Andalucía)
-- ============================================================
INSERT INTO public.aid_programs (
  title, slug, description, short_description,
  administration_level, administration_name, organism,
  status, territory_id, beneficiary_description, eligible_expenses,
  application_url, official_url, source_url, is_demo,
  indefinite_deadline, last_verified_at
)
SELECT
  '[DEMO] Ayuda para instalación de ascensor en edificios de Andalucía',
  'demo-andalucia-ascensor-edificios',
  'Programa demostrativo de ayudas para la instalación de ascensores en edificios de viviendas existentes en Andalucía. Esta ayuda es un ejemplo DEMO y no corresponde a una convocatoria real.',
  'Ayudas [DEMO] para instalar ascensores en edificios en Andalucía.',
  'autonomico', 'Junta de Andalucía [DEMO]', 'Consejería de Fomento [DEMO]',
  'abierta',
  (SELECT id FROM public.territories WHERE slug = 'andalucia'),
  'Comunidades de propietarios de edificios sin ascensor.',
  'Instalación de ascensores, adaptación de accesos al ascensor y eliminación de barreras en el portal.',
  NULL, NULL, NULL, true, false, now()
WHERE NOT EXISTS (SELECT 1 FROM public.aid_programs WHERE slug = 'demo-andalucia-ascensor-edificios');

INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'demo-andalucia-ascensor-edificios'
  AND b.slug IN ('comunidad-de-propietarios','propietario')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, ac.id FROM public.aid_programs a, public.actions ac
WHERE a.slug = 'demo-andalucia-ascensor-edificios'
  AND ac.slug IN ('ascensor','adaptacion-de-edificio','eliminacion-barreras-arquitectonicas')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, at.id FROM public.aid_programs a, public.accessibility_types at
WHERE a.slug = 'demo-andalucia-ascensor-edificios'
  AND at.slug IN ('accesibilidad-universal','accesibilidad-fisica','eliminacion-de-barreras','movilidad')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_solutions (aid_id, solution_id)
SELECT a.id, s.id FROM public.aid_programs a, public.solutions s
WHERE a.slug = 'demo-andalucia-ascensor-edificios'
  AND s.slug IN ('ascensor-sol')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_financing (aid_id, percentage, max_amount, financing_description)
SELECT a.id, 35.0, 12000.0, '[DEMO] Subvención de hasta el 35% del coste, con un máximo de 12.000 euros por ascensor instalado.'
FROM public.aid_programs a WHERE a.slug = 'demo-andalucia-ascensor-edificios'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

INSERT INTO public.requirements (aid_id, requirement_text, sort_order)
SELECT a.id, r.req, r.ord FROM public.aid_programs a
CROSS JOIN (VALUES
  ('[DEMO] El edificio debe tener al menos 6 viviendas.', 1),
  ('[DEMO] El ascensor debe dar servicio a todas las plantas.', 2),
  ('[DEMO] Acuerdo favorable de la comunidad de propietarios.', 3)
) AS r(req, ord)
WHERE a.slug = 'demo-andalucia-ascensor-edificios'
AND NOT EXISTS (SELECT 1 FROM public.requirements rq WHERE rq.aid_id = a.id);

INSERT INTO public.documents (aid_id, document_name, sort_order)
SELECT a.id, d.doc, d.ord FROM public.aid_programs a
CROSS JOIN (VALUES
  ('[DEMO] Proyecto técnico de instalación del ascensor', 1),
  ('[DEMO] Presupuesto de la empresa instaladora', 2),
  ('[DEMO] Acuerdo de la comunidad de propietarios', 3),
  ('[DEMO] Certificado de habitabilidad del edificio', 4)
) AS d(doc, ord)
WHERE a.slug = 'demo-andalucia-ascensor-edificios'
AND NOT EXISTS (SELECT 1 FROM public.documents doc WHERE doc.aid_id = a.id);

INSERT INTO public.sources (name, source_type, url, verified, last_checked_at, aid_id)
SELECT '[DEMO] Fuente demostrativa — Junta de Andalucía', 'comunidad_autonoma', NULL, false, now(), a.id
FROM public.aid_programs a WHERE a.slug = 'demo-andalucia-ascensor-edificios'
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = a.id);

-- ============================================================
-- DEMO AID 5: Salvaescaleras (Cataluña)
-- ============================================================
INSERT INTO public.aid_programs (
  title, slug, description, short_description,
  administration_level, administration_name, organism,
  status, territory_id, beneficiary_description, eligible_expenses,
  application_url, official_url, source_url, is_demo,
  indefinite_deadline, last_verified_at
)
SELECT
  '[DEMO] Ayuda para instalación de salvaescaleras en viviendas de Cataluña',
  'demo-cataluna-salvaescaleros',
  'Programa demostrativo de ayudas para la instalación de salvaescaleras en viviendas de personas con movilidad reducida en Cataluña. Esta ayuda es un ejemplo DEMO.',
  'Ayudas [DEMO] para instalar salvaescaleras en Cataluña.',
  'autonomico', 'Generalitat de Catalunya [DEMO]', 'Departament de Drets Socials [DEMO]',
  'abierta',
  (SELECT id FROM public.territories WHERE slug = 'cataluna'),
  'Personas con discapacidad o movilidad reducida, comunidades de propietarios.',
  'Instalación de salvaescaleras, plataformas elevadoras y rampas en viviendas y edificios.',
  NULL, NULL, NULL, true, false, now()
WHERE NOT EXISTS (SELECT 1 FROM public.aid_programs WHERE slug = 'demo-cataluna-salvaescaleros');

INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'demo-cataluna-salvaescaleros'
  AND b.slug IN ('particular','propietario','comunidad-de-propietarios')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, ac.id FROM public.aid_programs a, public.actions ac
WHERE a.slug = 'demo-cataluna-salvaescaleros'
  AND ac.slug IN ('salvaescaleras','plataforma-elevadora','rampa','adaptacion-de-vivienda')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, at.id FROM public.aid_programs a, public.accessibility_types at
WHERE a.slug = 'demo-cataluna-salvaescaleros'
  AND at.slug IN ('discapacidad','accesibilidad-fisica','movilidad','eliminacion-de-barreras')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_solutions (aid_id, solution_id)
SELECT a.id, s.id FROM public.aid_programs a, public.solutions s
WHERE a.slug = 'demo-cataluna-salvaescaleros'
  AND s.slug IN ('salvaescaleras-sol','plataforma-elevadora-sol','rampa-sol')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_financing (aid_id, max_amount, financing_description)
SELECT a.id, 4000.0, '[DEMO] Subvención a fondo perdido de hasta 4.000 euros por salvaescaleras instalado.'
FROM public.aid_programs a WHERE a.slug = 'demo-cataluna-salvaescaleros'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

INSERT INTO public.requirements (aid_id, requirement_text, sort_order)
SELECT a.id, r.req, r.ord FROM public.aid_programs a
CROSS JOIN (VALUES
  ('[DEMO] Certificado de discapacidad o de movilidad reducida.', 1),
  ('[DEMO] Residir en Cataluña.', 2),
  ('[DEMO] Que la vivienda sea el domicilio habitual.', 3)
) AS r(req, ord)
WHERE a.slug = 'demo-cataluna-salvaescaleros'
AND NOT EXISTS (SELECT 1 FROM public.requirements rq WHERE rq.aid_id = a.id);

INSERT INTO public.documents (aid_id, document_name, sort_order)
SELECT a.id, d.doc, d.ord FROM public.aid_programs a
CROSS JOIN (VALUES
  ('[DEMO] Certificado de discapacidad', 1),
  ('[DEMO] Presupuesto del salvaescaleras', 2),
  ('[DEMO] Empadronamiento en Cataluña', 3)
) AS d(doc, ord)
WHERE a.slug = 'demo-cataluna-salvaescaleros'
AND NOT EXISTS (SELECT 1 FROM public.documents doc WHERE doc.aid_id = a.id);

INSERT INTO public.sources (name, source_type, url, verified, last_checked_at, aid_id)
SELECT '[DEMO] Fuente demostrativa — Generalitat de Catalunya', 'comunidad_autonoma', NULL, false, now(), a.id
FROM public.aid_programs a WHERE a.slug = 'demo-cataluna-salvaescaleros'
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = a.id);

-- ============================================================
-- DEMO AID 6: Accesibilidad en espacio público (Galicia)
-- ============================================================
INSERT INTO public.aid_programs (
  title, slug, description, short_description,
  administration_level, administration_name, organism,
  status, territory_id, beneficiary_description, eligible_expenses,
  application_url, official_url, source_url, is_demo,
  indefinite_deadline, last_verified_at
)
SELECT
  '[DEMO] Ayuda para mejora de la accesibilidad en espacios públicos de Galicia',
  'demo-galicia-accesibilidad-espacio-publico',
  'Programa demostrativo de ayudas para la mejora de la accesibilidad en espacios públicos urbanos de Galicia. Esta ayuda es un ejemplo DEMO.',
  'Ayudas [DEMO] para mejorar la accesibilidad en espacios públicos en Galicia.',
  'autonomico', 'Xunta de Galicia [DEMO]', 'Consellería de Infraestruturas [DEMO]',
  'permanente',
  (SELECT id FROM public.territories WHERE slug = 'galicia'),
  'Municipios, diputaciones y entidades locales de Galicia.',
  'Adaptación de aceras, rampas, señalización accesible, eliminación de barreras en espacios públicos y transporte.',
  NULL, NULL, NULL, true, true, now()
WHERE NOT EXISTS (SELECT 1 FROM public.aid_programs WHERE slug = 'demo-galicia-accesibilidad-espacio-publico');

INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'demo-galicia-accesibilidad-espacio-publico'
  AND b.slug IN ('municipio','diputacion','administracion-publica','asociacion')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, ac.id FROM public.aid_programs a, public.actions ac
WHERE a.slug = 'demo-galicia-accesibilidad-espacio-publico'
  AND ac.slug IN ('espacio-publico','rampa','senalizacion','eliminacion-barreras-arquitectonicas','transporte')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, at.id FROM public.aid_programs a, public.accessibility_types at
WHERE a.slug = 'demo-galicia-accesibilidad-espacio-publico'
  AND at.slug IN ('accesibilidad-universal','accesibilidad-urbana','eliminacion-de-barreras','accesibilidad-sensorial')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_solutions (aid_id, solution_id)
SELECT a.id, s.id FROM public.aid_programs a, public.solutions s
WHERE a.slug = 'demo-galicia-accesibilidad-espacio-publico'
  AND s.slug IN ('rampa-sol','senalizacion-sol')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_financing (aid_id, percentage, max_amount, financing_description)
SELECT a.id, 60.0, 15000.0, '[DEMO] Subvención de hasta el 60% del coste, con un máximo de 15.000 euros por actuación.'
FROM public.aid_programs a WHERE a.slug = 'demo-galicia-accesibilidad-espacio-publico'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

INSERT INTO public.requirements (aid_id, requirement_text, sort_order)
SELECT a.id, r.req, r.ord FROM public.aid_programs a
CROSS JOIN (VALUES
  ('[DEMO] La actuación debe estar en un espacio público del municipio.', 1),
  ('[DEMO] El municipio debe estar al corriente de sus obligaciones tributarias.', 2),
  ('[DEMO] Presentar un plan de accesibilidad urbana.', 3)
) AS r(req, ord)
WHERE a.slug = 'demo-galicia-accesibilidad-espacio-publico'
AND NOT EXISTS (SELECT 1 FROM public.requirements rq WHERE rq.aid_id = a.id);

INSERT INTO public.documents (aid_id, document_name, sort_order)
SELECT a.id, d.doc, d.ord FROM public.aid_programs a
CROSS JOIN (VALUES
  ('[DEMO] Memoria técnica de la actuación', 1),
  ('[DEMO] Presupuesto detallado', 2),
  ('[DEMO] Plan de accesibilidad urbana', 3),
  ('[DEMO] Certificado de estar al corriente de pagos', 4)
) AS d(doc, ord)
WHERE a.slug = 'demo-galicia-accesibilidad-espacio-publico'
AND NOT EXISTS (SELECT 1 FROM public.documents doc WHERE doc.aid_id = a.id);

INSERT INTO public.sources (name, source_type, url, verified, last_checked_at, aid_id)
SELECT '[DEMO] Fuente demostrativa — Xunta de Galicia', 'comunidad_autonoma', NULL, false, now(), a.id
FROM public.aid_programs a WHERE a.slug = 'demo-galicia-accesibilidad-espacio-publico'
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = a.id);
