/*
# Seed Data: Spain Territories, Catalogs, and Demo Aids

## What this migration adds

1. territories — Spain (country), 17 autonomous communities + 2 autonomous cities
2. beneficiaries — 15 beneficiary types
3. accessibility_types — 13 accessibility categories
4. actions — 22 concrete intervention types
5. solutions — 10 solution/product types
6. 3 DEMO aid programs (clearly marked is_demo=true) with full relations

All demo aids are marked is_demo=true and contain no invented official URLs.
Official URLs are left NULL — the UI will show "Consultar convocatoria oficial".
*/

-- ============================================================
-- TERRITORIES: Spain + Communities + Autonomous Cities
-- ============================================================
INSERT INTO public.territories (name, slug, type, code) VALUES
  ('España', 'espana', 'pais', 'ES')
ON CONFLICT (slug) DO NOTHING;

-- Autonomous communities and cities (parent = España)
INSERT INTO public.territories (name, slug, type, parent_id, code)
SELECT v.name, v.slug, 'comunidad', p.id, v.code
FROM (VALUES
  ('Andalucía', 'andalucia', 'AN'),
  ('Aragón', 'aragon', 'AR'),
  ('Asturias', 'asturias', 'AS'),
  ('Illes Balears', 'illes-balears', 'IB'),
  ('Canarias', 'canarias', 'CN'),
  ('Cantabria', 'cantabria', 'CB'),
  ('Castilla-La Mancha', 'castilla-la-mancha', 'CM'),
  ('Castilla y León', 'castilla-y-leon', 'CL'),
  ('Cataluña', 'cataluna', 'CT'),
  ('Comunidad de Madrid', 'comunidad-de-madrid', 'MD'),
  ('Comunitat Valenciana', 'comunitat-valenciana', 'VC'),
  ('Extremadura', 'extremadura', 'EX'),
  ('Galicia', 'galicia', 'GA'),
  ('La Rioja', 'la-rioja', 'RI'),
  ('Navarra', 'navarra', 'NC'),
  ('País Vasco', 'pais-vasco', 'PV'),
  ('Región de Murcia', 'region-de-murcia', 'MC'),
  ('Ceuta', 'ceuta', 'CE'),
  ('Melilla', 'melilla', 'ML')
) AS v(name, slug, code)
CROSS JOIN (SELECT id FROM public.territories WHERE slug = 'espana') p
WHERE NOT EXISTS (SELECT 1 FROM public.territories t WHERE t.slug = v.slug);

-- ============================================================
-- BENEFICIARIES
-- ============================================================
INSERT INTO public.beneficiaries (name, slug, description) VALUES
  ('Particular', 'particular', 'Persona física que solicita la ayuda a título individual'),
  ('Propietario', 'propietario', 'Propietario de una vivienda o edificio'),
  ('Inquilino', 'inquilino', 'Inquilino de una vivienda'),
  ('Comunidad de propietarios', 'comunidad-de-propietarios', 'Comunidad de propietarios de un edificio'),
  ('Empresa', 'empresa', 'Empresa privada'),
  ('Autónomo', 'autonomo', 'Trabajador autónomo'),
  ('Asociación', 'asociacion', 'Asociación sin ánimo de lucro'),
  ('ONG', 'ong', 'Organización no gubernamental'),
  ('Fundación', 'fundacion', 'Fundación'),
  ('Entidad social', 'entidad-social', 'Entidad de iniciativa social'),
  ('Municipio', 'municipio', 'Ayuntamiento o entidad local'),
  ('Diputación', 'diputacion', 'Diputación provincial'),
  ('Administración pública', 'administracion-publica', 'Administración pública'),
  ('Profesional', 'profesional', 'Profesional o técnico'),
  ('Centro/entidad', 'centro-entidad', 'Centro o entidad prestadora de servicios'),
  ('Otro', 'otro', 'Otro tipo de beneficiario')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- ACCESSIBILITY TYPES
-- ============================================================
INSERT INTO public.accessibility_types (name, slug, description) VALUES
  ('Accesibilidad universal', 'accesibilidad-universal', 'Accesibilidad universal y diseño para todos'),
  ('Movilidad', 'movilidad', 'Movilidad y reducción de barreras de movilidad'),
  ('Discapacidad', 'discapacidad', 'Discapacidad y diversidad funcional'),
  ('Dependencia', 'dependencia', 'Situación de dependencia y cuidados'),
  ('Accesibilidad física', 'accesibilidad-fisica', 'Eliminación de barreras físicas'),
  ('Accesibilidad sensorial', 'accesibilidad-sensorial', 'Accesibilidad para personas con discapacidad sensorial'),
  ('Accesibilidad cognitiva', 'accesibilidad-cognitiva', 'Accesibilidad cognitiva y lectura fácil'),
  ('Accesibilidad digital', 'accesibilidad-digital', 'Accesibilidad digital y tecnológica'),
  ('Accesibilidad tecnológica', 'accesibilidad-tecnologica', 'Tecnologías de apoyo y asistivas'),
  ('Eliminación de barreras', 'eliminacion-de-barreras', 'Eliminación de barreras arquitectónicas'),
  ('Rehabilitación', 'rehabilitacion', 'Rehabilitación de edificios y viviendas'),
  ('Accesibilidad urbana', 'accesibilidad-urbana', 'Accesibilidad en el espacio urbano'),
  ('Accesibilidad rural', 'accesibilidad-rural', 'Accesibilidad en entornos rurales')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- ACTIONS
-- ============================================================
INSERT INTO public.actions (name, slug, description) VALUES
  ('Ascensor', 'ascensor', 'Instalación o adaptación de ascensor'),
  ('Plataforma elevadora', 'plataforma-elevadora', 'Instalación de plataforma elevadora vertical'),
  ('Salvaescaleras', 'salvaescaleras', 'Instalación de salvaescaleras'),
  ('Rampa', 'rampa', 'Construcción o adaptación de rampas'),
  ('Barandillas', 'barandillas', 'Instalación o adaptación de barandillas y pasamanos'),
  ('Puertas accesibles', 'puertas-accesibles', 'Adaptación de puertas y accesos'),
  ('Baño accesible', 'bano-accesible', 'Adaptación de baño para accesibilidad'),
  ('Adaptación de vivienda', 'adaptacion-de-vivienda', 'Adaptación de vivienda para personas con discapacidad o dependencia'),
  ('Adaptación de edificio', 'adaptacion-de-edificio', 'Adaptación de edificio para accesibilidad universal'),
  ('Eliminación de barreras arquitectónicas', 'eliminacion-barreras-arquitectonicas', 'Eliminación de barreras arquitectónicas en general'),
  ('Señalización', 'senalizacion', 'Señalización accesible y pictogramas'),
  ('Accesibilidad visual', 'accesibilidad-visual', 'Mejoras de accesibilidad visual'),
  ('Accesibilidad auditiva', 'accesibilidad-auditiva', 'Mejoras de accesibilidad auditiva'),
  ('Accesibilidad cognitiva', 'accesibilidad-cognitiva-act', 'Adaptaciones de accesibilidad cognitiva'),
  ('Tecnología asistiva', 'tecnologia-asistiva', 'Tecnologías de apoyo y productos de apoyo'),
  ('Domótica', 'domotica', 'Domótica y automatización del hogar'),
  ('Rehabilitación', 'rehabilitacion-act', 'Rehabilitación de edificios y viviendas'),
  ('Espacio público', 'espacio-publico', 'Accesibilidad en espacios públicos'),
  ('Transporte', 'transporte', 'Accesibilidad en el transporte'),
  ('Innovación', 'innovacion', 'Innovación y tecnología aplicada a accesibilidad'),
  ('Digitalización', 'digitalizacion', 'Digitalización y accesibilidad digital'),
  ('Otras', 'otras', 'Otras actuaciones relacionadas con accesibilidad')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SOLUTIONS
-- ============================================================
INSERT INTO public.solutions (name, slug, description) VALUES
  ('Ascensor', 'ascensor-sol', 'Ascensor accesible'),
  ('Salvaescaleras', 'salvaescaleras-sol', 'Salvaescaleras para personas con movilidad reducida'),
  ('Plataforma elevadora', 'plataforma-elevadora-sol', 'Plataforma elevadora vertical u horizontal'),
  ('Rampa', 'rampa-sol', 'Rampa fija o móvil para accesibilidad'),
  ('Baño accesible', 'bano-accesible-sol', 'Equipamiento y adaptación de baños accesibles'),
  ('Automatización de puertas', 'automatizacion-puertas-sol', 'Puertas automáticas y accesibles'),
  ('Señalización accesible', 'senalizacion-sol', 'Señalización, pictogramas y rotulación accesible'),
  ('Tecnología asistiva', 'tecnologia-asistiva-sol', 'Productos de apoyo y tecnología asistiva'),
  ('Soluciones digitales', 'soluciones-digitales-sol', 'Soluciones digitales para accesibilidad'),
  ('Domótica', 'domotica-sol', 'Sistemas domóticos para autonomía y accesibilidad')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- DEMO AID 1: Estatal — Plan de Vivienda (demo)
-- ============================================================
INSERT INTO public.aid_programs (
  title, slug, description, short_description,
  administration_level, administration_name, organism,
  status, territory_id, beneficiary_description, eligible_expenses,
  application_url, official_url, source_url, is_demo,
  indefinite_deadline, last_verified_at
)
SELECT
  '[DEMO] Plan Estatal de Vivienda — Ayudas para la accesibilidad en edificios',
  'demo-plan-estatal-accesibilidad-edificios',
  'Programa demostrativo de ayudas estatales para la mejora de la accesibilidad en edificios de vivienda. Esta ayuda es un ejemplo DEMO y no corresponde a una convocatoria real. Toda la información debe verificarse en fuentes oficiales.',
  'Ayudas estatales [DEMO] para mejorar la accesibilidad en edificios de vivienda.',
  'estatal', 'Ministerio de Vivienda [DEMO]', 'Ministerio de Vivienda y Agenda Urbana [DEMO]',
  'permanente',
  (SELECT id FROM public.territories WHERE slug = 'espana'),
  'Comunidades de propietarios, propietarios de viviendas y municipios.',
  'Instalación de ascensores, rampas, plataformas elevadoras y eliminación de barreras arquitectónicas.',
  NULL, NULL, NULL, true, true, now()
WHERE NOT EXISTS (SELECT 1 FROM public.aid_programs WHERE slug = 'demo-plan-estatal-accesibilidad-edificios');

-- Relations for DEMO aid 1
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'demo-plan-estatal-accesibilidad-edificios'
  AND b.slug IN ('comunidad-de-propietarios','propietario','municipio')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, ac.id FROM public.aid_programs a, public.actions ac
WHERE a.slug = 'demo-plan-estatal-accesibilidad-edificios'
  AND ac.slug IN ('ascensor','rampa','plataforma-elevadora','eliminacion-barreras-arquitectonicas','adaptacion-de-edificio')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, at.id FROM public.aid_programs a, public.accessibility_types at
WHERE a.slug = 'demo-plan-estatal-accesibilidad-edificios'
  AND at.slug IN ('accesibilidad-universal','accesibilidad-fisica','eliminacion-de-barreras')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_solutions (aid_id, solution_id)
SELECT a.id, s.id FROM public.aid_programs a, public.solutions s
WHERE a.slug = 'demo-plan-estatal-accesibilidad-edificios'
  AND s.slug IN ('ascensor-sol','rampa-sol','plataforma-elevadora-sol')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_financing (aid_id, percentage, max_amount, financing_description)
SELECT a.id, 40.0, 8000.0, '[DEMO] Subvención de hasta el 40% del coste, con un máximo de 8.000 euros por actuación.'
FROM public.aid_programs a WHERE a.slug = 'demo-plan-estatal-accesibilidad-edificios'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

INSERT INTO public.requirements (aid_id, requirement_text, sort_order)
SELECT a.id, r.req, r.ord FROM public.aid_programs a
CROSS JOIN (VALUES
  ('[DEMO] El edificio debe tener al menos 12 unidades de vivienda.', 1),
  ('[DEMO] La actuación debe estar incluida en un plan de accesibilidad.', 2),
  ('[DEMO] La comunidad de propietarios debe aprobar la obra por mayoría.', 3)
) AS r(req, ord)
WHERE a.slug = 'demo-plan-estatal-accesibilidad-edificios'
AND NOT EXISTS (SELECT 1 FROM public.requirements rq WHERE rq.aid_id = a.id);

INSERT INTO public.documents (aid_id, document_name, sort_order)
SELECT a.id, d.doc, d.ord FROM public.aid_programs a
CROSS JOIN (VALUES
  ('[DEMO] Certificado de eficiencia energética del edificio', 1),
  ('[DEMO] Proyecto técnico de la actuación', 2),
  ('[DEMO] Presupuesto de la obra', 3),
  ('[DEMO] Acuerdo de la comunidad de propietarios', 4)
) AS d(doc, ord)
WHERE a.slug = 'demo-plan-estatal-accesibilidad-edificios'
AND NOT EXISTS (SELECT 1 FROM public.documents doc WHERE doc.aid_id = a.id);

-- ============================================================
-- DEMO AID 2: Autonómico Madrid — Adaptación de vivienda (demo)
-- ============================================================
INSERT INTO public.aid_programs (
  title, slug, description, short_description,
  administration_level, administration_name, organism,
  status, territory_id, beneficiary_description, eligible_expenses,
  application_url, official_url, source_url, is_demo,
  indefinite_deadline, last_verified_at
)
SELECT
  '[DEMO] Ayuda de la Comunidad de Madrid para adaptación de viviendas de personas con discapacidad',
  'demo-madrid-adaptacion-vivienda-discapacidad',
  'Programa demostrativo de ayudas de la Comunidad de Madrid para la adaptación de viviendas de personas con discapacidad o dependencia. Esta ayuda es un ejemplo DEMO y no corresponde a una convocatoria real.',
  'Ayudas [DEMO] de la Comunidad de Madrid para adaptar viviendas de personas con discapacidad.',
  'autonomico', 'Comunidad de Madrid [DEMO]', 'Consejería de Políticas Sociales [DEMO]',
  'abierta',
  (SELECT id FROM public.territories WHERE slug = 'comunidad-de-madrid'),
  'Personas con discapacidad o en situación de dependencia, y sus familias.',
  'Adaptación de baños, cocinas, puertas, instalación de salvaescaleras, rampas y tecnología asistiva.',
  NULL, NULL, NULL, true, false, now()
WHERE NOT EXISTS (SELECT 1 FROM public.aid_programs WHERE slug = 'demo-madrid-adaptacion-vivienda-discapacidad');

INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'demo-madrid-adaptacion-vivienda-discapacidad'
  AND b.slug IN ('particular','propietario','inquilino')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, ac.id FROM public.aid_programs a, public.actions ac
WHERE a.slug = 'demo-madrid-adaptacion-vivienda-discapacidad'
  AND ac.slug IN ('adaptacion-de-vivienda','bano-accesible','rampa','salvaescalers','puertas-accesibles','tecnologia-asistiva')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, at.id FROM public.aid_programs a, public.accessibility_types at
WHERE a.slug = 'demo-madrid-adaptacion-vivienda-discapacidad'
  AND at.slug IN ('discapacidad','dependencia','accesibilidad-fisica')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_solutions (aid_id, solution_id)
SELECT a.id, s.id FROM public.aid_programs a, public.solutions s
WHERE a.slug = 'demo-madrid-adaptacion-vivienda-discapacidad'
  AND s.slug IN ('bano-accesible-sol','rampa-sol','salvaescaleras-sol','tecnologia-asistiva-sol')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_financing (aid_id, max_amount, financing_description)
SELECT a.id, 6000.0, '[DEMO] Subvención a fondo perdido de hasta 6.000 euros por vivienda.'
FROM public.aid_programs a WHERE a.slug = 'demo-madrid-adaptacion-vivienda-discapacidad'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

INSERT INTO public.requirements (aid_id, requirement_text, sort_order)
SELECT a.id, r.req, r.ord FROM public.aid_programs a
CROSS JOIN (VALUES
  ('[DEMO] Certificado de discapacidad igual o superior al 33%.', 1),
  ('[DEMO] Residir en la Comunidad de Madrid.', 2),
  ('[DEMO] Que la vivienda sea el domicilio habitual.', 3)
) AS r(req, ord)
WHERE a.slug = 'demo-madrid-adaptacion-vivienda-discapacidad'
AND NOT EXISTS (SELECT 1 FROM public.requirements rq WHERE rq.aid_id = a.id);

INSERT INTO public.documents (aid_id, document_name, sort_order)
SELECT a.id, d.doc, d.ord FROM public.aid_programs a
CROSS JOIN (VALUES
  ('[DEMO] Certificado de discapacidad', 1),
  ('[DEMO] Certificado de empadronamiento', 2),
  ('[DEMO] Presupuesto de las obras', 3),
  ('[DEMO] Escritura o contrato de alquiler', 4)
) AS d(doc, ord)
WHERE a.slug = 'demo-madrid-adaptacion-vivienda-discapacidad'
AND NOT EXISTS (SELECT 1 FROM public.documents doc WHERE doc.aid_id = a.id);

-- ============================================================
-- DEMO AID 3: Municipal — Eliminación de barreras (demo)
-- ============================================================
INSERT INTO public.aid_programs (
  title, slug, description, short_description,
  administration_level, administration_name, organism,
  status, territory_id, beneficiary_description, eligible_expenses,
  application_url, official_url, source_url, is_demo,
  indefinite_deadline, last_verified_at
)
SELECT
  '[DEMO] Ayuda municipal para la eliminación de barreras arquitectónicas',
  'demo-municipal-eliminacion-barreras',
  'Programa demostrativo de ayudas municipales para la eliminación de barreras arquitectónicas en espacios públicos y edificios municipales. Esta ayuda es un ejemplo DEMO.',
  'Ayudas [DEMO] municipales para eliminar barreras arquitectónicas.',
  'municipal', 'Ayuntamiento [DEMO]', 'Concejalía de Accesibilidad [DEMO]',
  'proxima',
  (SELECT id FROM public.territories WHERE slug = 'comunidad-de-madrid'),
  'Comunidades de propietarios, asociaciones de personas con discapacidad y municipios.',
  'Rampas, adaptación de aceras, señalización accesible y eliminación de barreras en edificios.',
  NULL, NULL, NULL, true, false, now()
WHERE NOT EXISTS (SELECT 1 FROM public.aid_programs WHERE slug = 'demo-municipal-eliminacion-barreras');

INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'demo-municipal-eliminacion-barreras'
  AND b.slug IN ('comunidad-de-propietarios','asociacion','municipio')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, ac.id FROM public.aid_programs a, public.actions ac
WHERE a.slug = 'demo-municipal-eliminacion-barreras'
  AND ac.slug IN ('rampa','eliminacion-barreras-arquitectonicas','senalizacion','espacio-publico')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, at.id FROM public.aid_programs a, public.accessibility_types at
WHERE a.slug = 'demo-municipal-eliminacion-barreras'
  AND at.slug IN ('accesibilidad-universal','accesibilidad-urbana','eliminacion-de-barreras')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_solutions (aid_id, solution_id)
SELECT a.id, s.id FROM public.aid_programs a, public.solutions s
WHERE a.slug = 'demo-municipal-eliminacion-barreras'
  AND s.slug IN ('rampa-sol','senalizacion-sol')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_financing (aid_id, percentage, min_amount, max_amount, financing_description)
SELECT a.id, 50.0, 500.0, 5000.0, '[DEMO] Subvención del 50% del coste, entre 500 y 5.000 euros.'
FROM public.aid_programs a WHERE a.slug = 'demo-municipal-eliminacion-barreras'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

INSERT INTO public.requirements (aid_id, requirement_text, sort_order)
SELECT a.id, r.req, r.ord FROM public.aid_programs a
CROSS JOIN (VALUES
  ('[DEMO] La actuación debe beneficiar a personas con movilidad reducida.', 1),
  ('[DEMO] El solicitante debe estar al corriente de pagos con el municipio.', 2)
) AS r(req, ord)
WHERE a.slug = 'demo-municipal-eliminacion-barreras'
AND NOT EXISTS (SELECT 1 FROM public.requirements rq WHERE rq.aid_id = a.id);

INSERT INTO public.documents (aid_id, document_name, sort_order)
SELECT a.id, d.doc, d.ord FROM public.aid_programs a
CROSS JOIN (VALUES
  ('[DEMO] Memoria de la actuación', 1),
  ('[DEMO] Presupuesto detallado', 2),
  ('[DEMO] Certificado de estar al corriente de pagos', 3)
) AS d(doc, ord)
WHERE a.slug = 'demo-municipal-eliminacion-barreras'
AND NOT EXISTS (SELECT 1 FROM public.documents doc WHERE doc.aid_id = a.id);
