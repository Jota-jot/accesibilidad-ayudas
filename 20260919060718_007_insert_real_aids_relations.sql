-- Insert relations for 11 real aids using subqueries to resolve slugs

-- ============================================================
-- AYUDA 1: pev26-accesibilidad-edificios
-- ============================================================
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'pev26-accesibilidad-edificios' AND b.slug IN ('propietario','comunidad-de-propietarios','particular')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug = 'pev26-accesibilidad-edificios' AND act.slug IN ('ascensor','salvaescaleras','rampa','puertas-accesibles','eliminacion-barreras-arquitectonicas','adaptacion-de-edificio')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, acc.id FROM public.aid_programs a, public.accessibility_types acc
WHERE a.slug = 'pev26-accesibilidad-edificios' AND acc.slug IN ('accesibilidad-universal','accesibilidad-fisica','eliminacion-de-barreras','movilidad')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_financing (aid_id, max_amount, percentage, financing_description)
SELECT a.id, 22000.0, 80.0, 'Hasta 13.000 €/vivienda; hasta 18.000 € con discapacidad >=33% o persona >65; hasta 20.500 € con discapacidad >=65%; hasta 22.000 € para plena accesibilidad universal; hasta 70% del coste, ampliable al 80% en determinados casos.'
FROM public.aid_programs a WHERE a.slug = 'pev26-accesibilidad-edificios'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

INSERT INTO public.sources (name, source_type, url, publication_date, document_reference, verified, last_checked_at, aid_id)
SELECT 'BOE — RD 326/2026', 'boe', 'https://www.boe.es/eli/es/rd/2026/04/22/326/con', '2026-04-23', 'BOE-A-2026-8872', true, '2026-09-19', a.id
FROM public.aid_programs a WHERE a.slug = 'pev26-accesibilidad-edificios'
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = a.id);

-- ============================================================
-- AYUDA 2: pev26-accesibilidad-vivienda
-- ============================================================
INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug = 'pev26-accesibilidad-vivienda' AND act.slug IN ('salvaescaleras','rampa','puertas-accesibles','tecnologia-asistiva','domotica','adaptacion-de-vivienda')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, acc.id FROM public.aid_programs a, public.accessibility_types acc
WHERE a.slug = 'pev26-accesibilidad-vivienda' AND acc.slug IN ('accesibilidad-universal','accesibilidad-fisica','discapacidad','dependencia')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_financing (aid_id, max_amount, percentage, financing_description)
SELECT a.id, 18000.0, 80.0, 'Hasta el 80% del coste; límite 15.000 €/vivienda con discapacidad >=33% y 18.000 € con discapacidad >=65%.'
FROM public.aid_programs a WHERE a.slug = 'pev26-accesibilidad-vivienda'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

INSERT INTO public.sources (name, source_type, url, publication_date, document_reference, verified, last_checked_at, aid_id)
SELECT 'BOE — RD 326/2026, Cap. III', 'boe', 'https://www.boe.es/eli/es/rd/2026/04/22/326/con', '2026-04-23', 'BOE-A-2026-8872', true, '2026-09-19', a.id
FROM public.aid_programs a WHERE a.slug = 'pev26-accesibilidad-vivienda'
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = a.id);

-- ============================================================
-- AYUDA 3: mad-2026-productos-apoyo-discapacidad
-- ============================================================
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'mad-2026-productos-apoyo-discapacidad' AND b.slug IN ('particular','propietario')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug = 'mad-2026-productos-apoyo-discapacidad' AND act.slug IN ('tecnologia-asistiva','salvaescaleras','adaptacion-de-vivienda','bano-accesible')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, acc.id FROM public.aid_programs a, public.accessibility_types acc
WHERE a.slug = 'mad-2026-productos-apoyo-discapacidad' AND acc.slug IN ('discapacidad','accesibilidad-fisica','movilidad')
ON CONFLICT DO NOTHING;

INSERT INTO public.sources (name, source_type, url, verified, last_checked_at, aid_id)
SELECT 'Comunidad de Madrid — Sede electrónica', 'comunidad_autonoma', 'https://sede.comunidad.madrid/ayudas-becas-subvenciones/ayudas-autonomia-personas-discapacidad-0', false, null, a.id
FROM public.aid_programs a WHERE a.slug = 'mad-2026-productos-apoyo-discapacidad'
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = a.id);

-- ============================================================
-- AYUDA 4: gal-2026-vi420a-rehabilitacion-edificios
-- ============================================================
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'gal-2026-vi420a-rehabilitacion-edificios' AND b.slug IN ('comunidad-de-propietarios')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug = 'gal-2026-vi420a-rehabilitacion-edificios' AND act.slug IN ('ascensor','rampa','eliminacion-barreras-arquitectonicas','rehabilitacion-act','adaptacion-de-edificio')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, acc.id FROM public.aid_programs a, public.accessibility_types acc
WHERE a.slug = 'gal-2026-vi420a-rehabilitacion-edificios' AND acc.slug IN ('accesibilidad-universal','eliminacion-de-barreras','rehabilitacion')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_financing (aid_id, percentage, max_amount, financing_description)
SELECT a.id, 60.0, 6000.0, '60% de los costes subvencionables, hasta 6.000 €/vivienda.'
FROM public.aid_programs a WHERE a.slug = 'gal-2026-vi420a-rehabilitacion-edificios'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

INSERT INTO public.sources (name, source_type, url, verified, last_checked_at, aid_id)
SELECT 'IGVS — Xunta de Galicia', 'comunidad_autonoma', 'https://igvs.xunta.gal/es/ayudas/ayudas-las-comunidades-de-personas-propietarias-para-reparacion-rehabilitacion-yo-adaptacion-de-edificios-de-viviendas-protegidas-2026', false, null, a.id
FROM public.aid_programs a WHERE a.slug = 'gal-2026-vi420a-rehabilitacion-edificios'
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = a.id);

-- ============================================================
-- AYUDA 5: gal-2027-rehabilitacion-retroactiva
-- ============================================================
INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug = 'gal-2027-rehabilitacion-retroactiva' AND act.slug IN ('rehabilitacion-act','ascensor','rampa','eliminacion-barreras-arquitectonicas','adaptacion-de-edificio')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, acc.id FROM public.aid_programs a, public.accessibility_types acc
WHERE a.slug = 'gal-2027-rehabilitacion-retroactiva' AND acc.slug IN ('accesibilidad-universal','eliminacion-de-barreras','rehabilitacion')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_financing (aid_id, max_amount, financing_description)
SELECT a.id, 49000.0, 'Presupuesto anunciado: 13,6 M€; las ayudas acumuladas por accesibilidad, seguridad y habitabilidad pueden alcanzar 49.000 €/vivienda según la Xunta.'
FROM public.aid_programs a WHERE a.slug = 'gal-2027-rehabilitacion-retroactiva'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

INSERT INTO public.sources (name, source_type, url, verified, last_checked_at, aid_id)
SELECT 'IGVS — Anuncio rehabilitación retroactiva', 'portal_institucional', 'https://igvs.xunta.gal/es/el-igvs/actualidad/la-xunta-convocara-con-caracter-retroactivo-las-ayudas-para-rehabilitacion-edificatoria-con-un', false, null, a.id
FROM public.aid_programs a WHERE a.slug = 'gal-2027-rehabilitacion-retroactiva'
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = a.id);

-- ============================================================
-- AYUDA 6: ast-2026-ascensores-edificios
-- ============================================================
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'ast-2026-ascensores-edificios' AND b.slug IN ('comunidad-de-propietarios','propietario')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug = 'ast-2026-ascensores-edificios' AND act.slug IN ('ascensor','eliminacion-barreras-arquitectonicas','adaptacion-de-edificio')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, acc.id FROM public.aid_programs a, public.accessibility_types acc
WHERE a.slug = 'ast-2026-ascensores-edificios' AND acc.slug IN ('accesibilidad-universal','accesibilidad-fisica','eliminacion-de-barreras')
ON CONFLICT DO NOTHING;

INSERT INTO public.sources (name, source_type, url, verified, last_checked_at, aid_id)
SELECT 'Principado de Asturias', 'comunidad_autonoma', 'https://actualidad.asturias.es/es/-/ascensores248', false, null, a.id
FROM public.aid_programs a WHERE a.slug = 'ast-2026-ascensores-edificios'
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = a.id);

-- ============================================================
-- AYUDA 7: cat-ascensores-parque-publico
-- ============================================================
INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug = 'cat-ascensores-parque-publico' AND act.slug IN ('ascensor','rehabilitacion-act','adaptacion-de-edificio')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, acc.id FROM public.aid_programs a, public.accessibility_types acc
WHERE a.slug = 'cat-ascensores-parque-publico' AND acc.slug IN ('accesibilidad-universal','rehabilitacion')
ON CONFLICT DO NOTHING;

INSERT INTO public.sources (name, source_type, url, verified, last_checked_at, aid_id)
SELECT 'Agència de l''Habitatge de Catalunya', 'comunidad_autonoma', 'https://agenciahabitatge.gencat.cat/ca/Pagines/ajuts/cercador-ajuts.aspx', false, null, a.id
FROM public.aid_programs a WHERE a.slug = 'cat-ascensores-parque-publico'
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = a.id);

-- ============================================================
-- AYUDA 8: eus-2026-eraikal-vi-innovacion-accesibilidad
-- ============================================================
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'eus-2026-eraikal-vi-innovacion-accesibilidad' AND b.slug IN ('empresa','autonomo','profesional')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug = 'eus-2026-eraikal-vi-innovacion-accesibilidad' AND act.slug IN ('innovacion','tecnologia-asistiva')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, acc.id FROM public.aid_programs a, public.accessibility_types acc
WHERE a.slug = 'eus-2026-eraikal-vi-innovacion-accesibilidad' AND acc.slug IN ('accesibilidad-universal','accesibilidad-tecnologica')
ON CONFLICT DO NOTHING;

INSERT INTO public.sources (name, source_type, url, verified, last_checked_at, aid_id)
SELECT 'Gobierno Vasco — Eraikal 2026', 'comunidad_autonoma', 'https://www.euskadi.eus/ayuda_subvencion/2025/linea-vi-innovacion-en-accesibilidad-programa-eraikal-2026/web01-tramite/es/', false, null, a.id
FROM public.aid_programs a WHERE a.slug = 'eus-2026-eraikal-vi-innovacion-accesibilidad'
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = a.id);

-- ============================================================
-- AYUDA 9: and-2026-linea-2-discapacidad
-- ============================================================
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'and-2026-linea-2-discapacidad' AND b.slug IN ('particular')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug = 'and-2026-linea-2-discapacidad' AND act.slug IN ('tecnologia-asistiva','transporte','adaptacion-de-vivienda')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, acc.id FROM public.aid_programs a, public.accessibility_types acc
WHERE a.slug = 'and-2026-linea-2-discapacidad' AND acc.slug IN ('discapacidad','accesibilidad-sensorial','movilidad')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_financing (aid_id, max_amount, financing_description)
SELECT a.id, 6000.0, 'Adaptación de vehículo hasta 750 €; prótesis auditiva hasta 1.200 € (máx. 600 €/audífono); ocular hasta 400 €; dental hasta 600 €; otros productos de apoyo hasta 6.000 €.'
FROM public.aid_programs a WHERE a.slug = 'and-2026-linea-2-discapacidad'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

INSERT INTO public.sources (name, source_type, url, verified, last_checked_at, aid_id)
SELECT 'Junta de Andalucía — Procedimiento 24563', 'comunidad_autonoma', 'https://www.juntadeandalucia.es/servicios/procedimientos/detalle/24563.html', true, '2026-09-19', a.id
FROM public.aid_programs a WHERE a.slug = 'and-2026-linea-2-discapacidad'
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = a.id);

-- ============================================================
-- AYUDA 10: ara-2026-ayudas-individuales-discapacidad-dependencia
-- ============================================================
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'ara-2026-ayudas-individuales-discapacidad-dependencia' AND b.slug IN ('particular','propietario')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug = 'ara-2026-ayudas-individuales-discapacidad-dependencia' AND act.slug IN ('adaptacion-de-vivienda','bano-accesible','rampa','salvaescaleras','puertas-accesibles','tecnologia-asistiva','eliminacion-barreras-arquitectonicas')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, acc.id FROM public.aid_programs a, public.accessibility_types acc
WHERE a.slug = 'ara-2026-ayudas-individuales-discapacidad-dependencia' AND acc.slug IN ('discapacidad','dependencia','accesibilidad-fisica','movilidad')
ON CONFLICT DO NOTHING;

INSERT INTO public.sources (name, source_type, url, publication_date, document_reference, verified, last_checked_at, aid_id)
SELECT 'BOA — Gobierno de Aragón', 'diario_oficial', 'https://www.aragon.es/tramitador/-/tramite/ayudas-individuales-personas-grado-discapacidad-situacion-dependencia/convocatoria-2026', '2026-06-08', 'Procedimiento 11598', true, '2026-09-19', a.id
FROM public.aid_programs a WHERE a.slug = 'ara-2026-ayudas-individuales-discapacidad-dependencia'
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = a.id);

-- ============================================================
-- AYUDA 11: es-iva-reducido-accesibilidad
-- ============================================================
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'es-iva-reducido-accesibilidad' AND b.slug IN ('particular','comunidad-de-propietarios','propietario')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug = 'es-iva-reducido-accesibilidad' AND act.slug IN ('adaptacion-de-vivienda','eliminacion-barreras-arquitectonicas','tecnologia-asistiva','transporte')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, acc.id FROM public.aid_programs a, public.accessibility_types acc
WHERE a.slug = 'es-iva-reducido-accesibilidad' AND acc.slug IN ('accesibilidad-universal','discapacidad','movilidad')
ON CONFLICT DO NOTHING;

INSERT INTO public.aid_financing (aid_id, financing_description)
SELECT a.id, 'Tipo reducido del 10% y superreducido del 4% según el supuesto, en lugar del 21% general.'
FROM public.aid_programs a WHERE a.slug = 'es-iva-reducido-accesibilidad'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);
