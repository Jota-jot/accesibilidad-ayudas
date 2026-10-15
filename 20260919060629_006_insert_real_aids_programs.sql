-- Insert 11 real verified aids from AYUDAS_REALES_BOLT.txt
-- All ON CONFLICT DO NOTHING to prevent duplicates
-- Statuses: marco_estatal, cerrada, proxima, resuelta, revisar, vigente

-- ============================================================
-- AYUDA 1: Plan Estatal — accesibilidad en edificios (MARCO_ESTATAL)
-- ============================================================
INSERT INTO public.aid_programs (external_id, title, slug, description, short_description, administration_level, administration_name, organism, status, aid_type, territory_id, beneficiary_description, eligible_expenses, official_url, source_url, normative_reference, notes, is_demo, archived, indefinite_deadline, publication_date, opening_date, closing_date, last_verified_at)
VALUES (
  'ES-PEV26-ACC-EDIFICIOS',
  'Plan Estatal de Vivienda 2026-2030 — accesibilidad en edificios y viviendas unifamiliares',
  'pev26-accesibilidad-edificios',
  'Línea de financiación del Plan Estatal de Vivienda 2026-2030 para actuaciones de accesibilidad en edificios de viviendas y viviendas unifamiliares. Son actuaciones subvencionables: instalación de ascensores, salvaescaleras, rampas, automatismos para apertura de puertas, y cualquier medida de accesibilidad que facilite la autonomía y la vida independiente de personas con movilidad reducida. Las comunidades autónomas y Ceuta/Melilla desarrollan las convocatorias concretas vía convenio. No es una convocatoria abierta a ciudadanos directamente.',
  'Marco estatal para ayudas de accesibilidad en edificios. Las convocatorias las desarrollan las CCAA.',
  'estatal', 'Ministerio de Vivienda y Agenda Urbana', 'Ministerio de Vivienda y Agenda Urbana',
  'marco_estatal', 'MARCO_NORMATIVO',
  '2f7d71ad-bfe4-4f52-89d1-84e37371b33b',
  'Propietarios, comunidades de propietarios y otros beneficiarios según convocatoria autonómica.',
  'Instalación de ascensores, salvaescaleras, rampas, automatismos de puertas, dispositivos de accesibilidad y otras medidas para autonomía y vida independiente.',
  'https://www.boe.es/eli/es/rd/2026/04/22/326/con',
  'https://www.boe.es/eli/es/rd/2026/04/22/326/con',
  'RD 326/2026, BOE 23/04/2026',
  'RD 326/2026, publicado en BOE 23/04/2026, en vigor 24/04/2026. No es una convocatoria abierta a ciudadanos: las CCAA y Ceuta/Melilla desarrollan las convocatorias vía convenio.',
  false, false, false, '2026-04-23', '2026-04-24', '2030-12-31', '2026-09-19'
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- AYUDA 2: Plan Estatal — accesibilidad dentro de la vivienda (MARCO_ESTATAL)
-- ============================================================
INSERT INTO public.aid_programs (external_id, title, slug, description, short_description, administration_level, administration_name, organism, status, aid_type, territory_id, beneficiary_description, eligible_expenses, official_url, source_url, normative_reference, notes, is_demo, archived, indefinite_deadline, publication_date, opening_date, closing_date, last_verified_at)
VALUES (
  'ES-PEV26-ACC-VIVIENDA',
  'Plan Estatal de Vivienda 2026-2030 — accesibilidad dentro de la vivienda',
  'pev26-accesibilidad-vivienda',
  'Línea de financiación del Cap. III del RD 326/2026 para actuaciones de accesibilidad dentro de la vivienda. Incluye salvaescaleras, rampas, automatismos, productos de apoyo, domótica, sistemas de información/comunicación/aviso, bucles magnéticos y mejoras DB-SUA. La solicitud concreta depende de la convocatoria territorial correspondiente.',
  'Marco estatal para ayudas de accesibilidad dentro de la vivienda. Las convocatorias las desarrollan las CCAA.',
  'estatal', 'Ministerio de Vivienda y Agenda Urbana', 'Ministerio de Vivienda y Agenda Urbana',
  'marco_estatal', 'MARCO_NORMATIVO',
  '2f7d71ad-bfe4-4f52-89d1-84e37371b33b',
  'Personas propietarias, usufructuarias y otros beneficiarios según convocatoria.',
  'Salvaescaleras, rampas, automatismos, productos de apoyo, domótica, sistemas de información/comunicación/aviso, bucles magnéticos y mejoras DB-SUA.',
  'https://www.boe.es/eli/es/rd/2026/04/22/326/con',
  'https://www.boe.es/eli/es/rd/2026/04/22/326/con',
  'RD 326/2026, Cap. III',
  'Cap. III del RD 326/2026. La solicitud concreta depende de la convocatoria territorial correspondiente.',
  false, false, false, '2026-04-23', '2026-04-24', '2030-12-31', '2026-09-19'
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- AYUDA 3: Madrid — productos de apoyo (CERRADA)
-- ============================================================
INSERT INTO public.aid_programs (external_id, title, slug, description, short_description, administration_level, administration_name, organism, status, aid_type, territory_id, beneficiary_description, eligible_expenses, official_url, source_url, notes, is_demo, archived, indefinite_deadline, opening_date, closing_date)
VALUES (
  'MAD-2026-A945',
  'Ayudas para adquirir productos de apoyo y para la movilidad de personas con discapacidad (2026)',
  'mad-2026-productos-apoyo-discapacidad',
  'Ayudas de la Comunidad de Madrid para personas con discapacidad física, intelectual o sensorial >=33% en situación de dificultad o vulnerabilidad social. Incluye dispositivos electrónicos de comunicación, audífonos, alarmas, camas articuladas, ayudas para baño, grúas, plataformas o salvaescaleras, lupas y ayudas de movilidad.',
  'Ayudas de Madrid para productos de apoyo y movilidad de personas con discapacidad.',
  'autonomico', 'Comunidad de Madrid', 'Comunidad de Madrid — Consejería de Familia y Asuntos Sociales',
  'cerrada', 'CONVOCATORIA',
  '8bd39aec-99d8-4215-9cbc-9c7b66b913f1',
  'Personas con discapacidad física, intelectual o sensorial >=33% en situación de dificultad o vulnerabilidad social y residentes en Madrid.',
  'Dispositivos electrónicos de comunicación, audífonos, alarmas, camas articuladas, ayudas para baño, grúas, plataformas o salvaescaleras, lupas y ayudas de movilidad.',
  'https://sede.comunidad.madrid/ayudas-becas-subvenciones/ayudas-autonomia-personas-discapacidad-0',
  'https://sede.comunidad.madrid/ayudas-becas-subvenciones/ayudas-autonomia-personas-discapacidad-0',
  'La sede oficial la muestra como En tramitación; el plazo de solicitud terminó el 27/04/2026. Convocatoria de repetición anual: revisar marzo-abril de 2027.',
  false, false, false, '2026-04-07', '2026-04-27'
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- AYUDA 4: Galicia — VI420A (CERRADA)
-- ============================================================
INSERT INTO public.aid_programs (external_id, title, slug, description, short_description, administration_level, administration_name, organism, status, aid_type, territory_id, beneficiary_description, eligible_expenses, official_url, source_url, notes, is_demo, archived, indefinite_deadline, opening_date, closing_date)
VALUES (
  'GAL-2026-VI420A',
  'Ayudas a comunidades de propietarios para reparación, rehabilitación y/o adaptación de edificios de viviendas protegidas (VI420A)',
  'gal-2026-vi420a-rehabilitacion-edificios',
  'Ayudas del IGVS para comunidades de propietarios de edificios de viviendas de protección pública. Incluye supresión de barreras arquitectónicas, ascensores, rampas y otros dispositivos de accesibilidad, además de reparación y rehabilitación.',
  'Ayudas de Galicia para rehabilitación y accesibilidad en edificios de viviendas protegidas.',
  'autonomico', 'Xunta de Galicia', 'Instituto Galego da Vivenda e Solo (IGVS)',
  'cerrada', 'CONVOCATORIA',
  '2c587123-2887-4d88-80c8-c7a17dccf382',
  'Comunidades de propietarios de edificios de viviendas de protección pública promovidos por el IGVS.',
  'Supresión de barreras arquitectónicas, ascensores, rampas y otros dispositivos de accesibilidad, además de reparación y rehabilitación.',
  'https://igvs.xunta.gal/es/ayudas/ayudas-las-comunidades-de-personas-propietarias-para-reparacion-rehabilitacion-yo-adaptacion-de-edificios-de-viviendas-protegidas-2026',
  'https://igvs.xunta.gal/es/ayudas/ayudas-las-comunidades-de-personas-propietarias-para-reparacion-rehabilitacion-yo-adaptacion-de-edificios-de-viviendas-protegidas-2026',
  'Convocatoria 2026 cerrada. Se convoca habitualmente en el primer trimestre: revisar febrero de 2027.',
  false, false, false, '2026-02-21', '2026-04-21'
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- AYUDA 5: Galicia — próxima rehabilitación retroactiva (PROXIMA)
-- ============================================================
INSERT INTO public.aid_programs (external_id, title, slug, description, short_description, administration_level, administration_name, organism, status, aid_type, territory_id, beneficiary_description, eligible_expenses, official_url, source_url, notes, is_demo, archived, indefinite_deadline)
VALUES (
  'GAL-2027-REHAB-RETRO',
  'Próxima convocatoria de ayudas para rehabilitación edificatoria con carácter retroactivo',
  'gal-2027-rehabilitacion-retroactiva',
  'Convocatoria anunciada por la Xunta de Galicia para rehabilitación edificatoria con carácter retroactivo. Incluye rehabilitación, accesibilidad, seguridad y habitabilidad. Presupuesto anunciado: 13,6 M€. Las ayudas acumuladas por accesibilidad, seguridad y habitabilidad pueden alcanzar 49.000 €/vivienda según la Xunta.',
  'Próxima convocatoria de Galicia para rehabilitación edificatoria con carácter retroactivo.',
  'autonomico', 'Xunta de Galicia', 'Instituto Galego da Vivenda e Solo (IGVS)',
  'proxima', 'CONVOCATORIA',
  '2c587123-2887-4d88-80c8-c7a17dccf382',
  'Edificios residenciales, viviendas unifamiliares y actuaciones dentro de viviendas, según convocatoria.',
  'Rehabilitación, accesibilidad, seguridad y habitabilidad.',
  'https://igvs.xunta.gal/es/el-igvs/actualidad/la-xunta-convocara-con-caracter-retroactivo-las-ayudas-para-rehabilitacion-edificatoria-con-un',
  'https://igvs.xunta.gal/es/el-igvs/actualidad/la-xunta-convocara-con-caracter-retroactivo-las-ayudas-para-rehabilitacion-edificatoria-con-un',
  'Anunciada el 09/09/2026: convocatoria a finales de 2026 y solicitudes en enero de 2027, con carácter retroactivo para obras iniciadas en 2026 y no finalizadas. FECHAS NO OFICIALES (anuncio de prensa), no publicar como plazo firme.',
  false, false, false
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- AYUDA 6: Asturias — ascensores (RESUELTA)
-- ============================================================
INSERT INTO public.aid_programs (external_id, title, slug, description, short_description, administration_level, administration_name, organism, status, aid_type, territory_id, beneficiary_description, eligible_expenses, official_url, source_url, notes, is_demo, archived, indefinite_deadline)
VALUES (
  'AST-2026-ASCENSORES',
  'Ayudas para instalación de ascensores en edificios residenciales',
  'ast-2026-ascensores-edificios',
  'Ayudas del Principado de Asturias para instalación de ascensores en edificios residenciales. 16 M€ de inversión para 180 edificios, según información oficial de 24/08/2026. Resolución publicada en el BOPA el 24/08/2026.',
  'Ayudas de Asturias para instalación de ascensores en edificios residenciales.',
  'autonomico', 'Principado de Asturias', 'Principado de Asturias — Consejería de Vivienda',
  'resuelta', 'CONVOCATORIA',
  'c9baf9e9-e065-4dc3-97b9-3ab009209121',
  'Comunidades de propietarios / edificios residenciales incluidos en la convocatoria.',
  'Instalación de ascensores y eliminación de barreras arquitectónicas.',
  'https://actualidad.asturias.es/es/-/ascensores248',
  'https://actualidad.asturias.es/es/-/ascensores248',
  'Resolución publicada en el BOPA el 24/08/2026 (fecha de resolución, NO de apertura de plazo). No mostrar como convocatoria abierta.',
  false, false, false
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- AYUDA 7: Cataluña — ascensores parque público (REVISAR)
-- ============================================================
INSERT INTO public.aid_programs (external_id, title, slug, description, short_description, administration_level, administration_name, organism, status, aid_type, territory_id, beneficiary_description, eligible_expenses, official_url, source_url, notes, is_demo, archived, indefinite_deadline)
VALUES (
  'CAT-ASCENSORES-PARQUE-PUBLICO',
  'Subvenciones para rehabilitar edificios residenciales de barrios del parque público de viviendas — ascensores',
  'cat-ascensores-parque-publico',
  'Programa de la Agència de l''Habitatge de Catalunya para rehabilitación de edificios residenciales del parque público. Incluye mejora de eficiencia energética, sostenibilidad, conservación, seguridad y accesibilidad, con actuaciones relacionadas con ascensores.',
  'Programa de Cataluña para rehabilitación y accesibilidad en edificios del parque público.',
  'autonomico', 'Generalitat de Catalunya', 'Agència de l''Habitatge de Catalunya',
  'revisar', 'PROGRAMA',
  'b5a94da4-011c-4702-aeb8-a970c1a35fa4',
  'Entidades y ciudadanía, según la ficha del programa.',
  'Mejora de eficiencia energética, sostenibilidad, conservación, seguridad y accesibilidad; incluye actuaciones relacionadas con ascensores.',
  'https://agenciahabitatge.gencat.cat/ca/Pagines/ajuts/cercador-ajuts.aspx',
  'https://agenciahabitatge.gencat.cat/ca/Pagines/ajuts/cercador-ajuts.aspx',
  'FALTA FICHA CONCRETA. El buscador lo muestra como Actiu, pero la URL es un buscador genérico, no la convocatoria. No publicar como abierta hasta sustituir por la URL de la ficha y fijar fechas.',
  false, false, false
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- AYUDA 8: País Vasco — Eraikal Línea VI (REVISAR)
-- ============================================================
INSERT INTO public.aid_programs (external_id, title, slug, description, short_description, administration_level, administration_name, organism, status, aid_type, territory_id, beneficiary_description, eligible_expenses, official_url, source_url, notes, is_demo, archived, indefinite_deadline)
VALUES (
  'EUS-2026-ERAIKAL-VI',
  'Línea VI: Innovación en Accesibilidad — Programa Eraikal 2026',
  'eus-2026-eraikal-vi-innovacion-accesibilidad',
  'Línea de innovación en accesibilidad del Programa Eraikal 2026 del Gobierno Vasco. Dirigida a empresas y agentes del sector de la edificación. Incluye estudios de impacto de mejoras de accesibilidad, diseño, prototipado y fabricación de productos y soluciones constructivas para mejorar la accesibilidad.',
  'Ayuda a innovación empresarial en accesibilidad del País Vasco. No es para adaptación de vivienda concreta.',
  'autonomico', 'Gobierno Vasco', 'Gobierno Vasco — Dpto. de Vivienda',
  'revisar', 'CONVOCATORIA',
  '95f25814-6c24-4e75-8a40-2b7cffca75f8',
  'Empresas y agentes del sector de la edificación, según bases del programa Eraikal 2026.',
  'Estudios de impacto de mejoras de accesibilidad; estudios comparados; diseño, prototipado y fabricación de productos, soluciones constructivas o sistemas para mejorar la accesibilidad.',
  'https://www.euskadi.eus/ayuda_subvencion/2025/linea-vi-innovacion-en-accesibilidad-programa-eraikal-2026/web01-tramite/es/',
  'https://www.euskadi.eus/ayuda_subvencion/2025/linea-vi-innovacion-en-accesibilidad-programa-eraikal-2026/web01-tramite/es/',
  'Ayuda a innovación empresarial en accesibilidad, NO a la adaptación de una vivienda concreta. Faltan fechas de plazo.',
  false, false, false
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- AYUDA 9: Andalucía — Línea 2 (CERRADA)
-- ============================================================
INSERT INTO public.aid_programs (external_id, title, slug, description, short_description, administration_level, administration_name, organism, status, aid_type, territory_id, beneficiary_description, eligible_expenses, official_url, source_url, notes, normative_reference, is_demo, archived, indefinite_deadline, opening_date, closing_date, last_verified_at)
VALUES (
  'AND-2026-L2-24563',
  'Línea 2 — Subvenciones individuales para personas con discapacidad (2026)',
  'and-2026-linea-2-discapacidad',
  'Subvenciones individuales de la Junta de Andalucía para personas con discapacidad >=33%. Incluye adaptación de vehículos, prótesis y órtesis (auditivas, oculares, dentales), adquisición, renovación o reparación de productos de apoyo y recursos tecnológicos para comunicación y autonomía.',
  'Ayudas de Andalucía para personas con discapacidad: productos de apoyo, prótesis, adaptación de vehículos.',
  'autonomico', 'Junta de Andalucía', 'Junta de Andalucía — Consejería de Inclusión Social',
  'cerrada', 'CONVOCATORIA',
  'fa701dd7-9446-4cc3-ad91-5fa66f122bf6',
  'Personas físicas con discapacidad >=33%, vecindad administrativa en Andalucía y renta per cápita de la unidad de convivencia no superior a 1,25 veces el IPREM.',
  'Adaptación de vehículo a motor; prótesis y órtesis (auditivas, oculares, dentales); adquisición, renovación o reparación de productos de apoyo; recursos tecnológicos para comunicación y autonomía.',
  'https://www.juntadeandalucia.es/servicios/procedimientos/detalle/24563.html',
  'https://www.juntadeandalucia.es/servicios/procedimientos/detalle/24563.html',
  'Concurrencia competitiva, 15 días hábiles desde el extracto en BOJA. Productos de apoyo requieren informe favorable del Centro de Valoración y Orientación. Convocatoria anual: revisar mayo de 2027.',
  'Procedimiento 24563',
  false, false, false, '2026-05-27', '2026-06-16', '2026-09-19'
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- AYUDA 10: Aragón — ayudas individuales (CERRADA)
-- ============================================================
INSERT INTO public.aid_programs (external_id, title, slug, description, short_description, administration_level, administration_name, organism, status, aid_type, territory_id, beneficiary_description, eligible_expenses, official_url, source_url, notes, normative_reference, is_demo, archived, indefinite_deadline, opening_date, closing_date, last_verified_at)
VALUES (
  'ARA-2026-11598',
  'Ayudas individuales para personas con grado de discapacidad y personas en situación de dependencia (2026)',
  'ara-2026-ayudas-individuales-discapacidad-dependencia',
  'Ayudas del Gobierno de Aragón para personas con discapacidad >=33% o dependencia grado II/III. Incluye adaptación de la vivienda habitual (baño, cocina, eliminación de barreras, rampas, salvaescaleras, puertas automáticas), adaptación de vehículos, ayudas técnicas y tecnológicas, y productos de apoyo.',
  'Ayudas de Aragón para personas con discapacidad o dependencia: adaptación de vivienda, productos de apoyo.',
  'autonomico', 'Gobierno de Aragón', 'Gobierno de Aragón — IASS',
  'cerrada', 'CONVOCATORIA',
  '7667b3ee-dc06-49c5-aec0-8b18dd547f9c',
  'Personas con discapacidad >=33% o dependencia grado II/III, empadronadas y residentes en Aragón al menos un año antes del fin de plazo.',
  'Adaptación de la vivienda habitual (baño, cocina, eliminación de barreras, rampas, salvaescaleras, puertas automáticas); adaptación de vehículos; ayudas técnicas y tecnológicas (camas articuladas, grúas, colchones antiescaras, tabletas, sistemas de comunicación); productos de apoyo.',
  'https://www.aragon.es/tramitador/-/tramite/ayudas-individuales-personas-grado-discapacidad-situacion-dependencia/convocatoria-2026',
  'https://www.aragon.es/tramitador/-/tramite/ayudas-individuales-personas-grado-discapacidad-situacion-dependencia/convocatoria-2026',
  'Orden DBF/819/2026, de 19 de mayo; convocatoria publicada en BOA el 08/06/2026. Bases: Orden CDS/329/2023. Procedimiento 11598. Convocatoria anual: revisar mayo-junio de 2027.',
  'Orden DBF/819/2026; BOA 08/06/2026',
  false, false, false, '2026-06-09', '2026-07-06', '2026-09-19'
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- AYUDA 11: IVA reducido en accesibilidad (VIGENTE)
-- ============================================================
INSERT INTO public.aid_programs (external_id, title, slug, description, short_description, administration_level, administration_name, organism, status, aid_type, territory_id, beneficiary_description, eligible_expenses, official_url, source_url, notes, normative_reference, is_demo, archived, indefinite_deadline)
VALUES (
  'ES-IVA-ACCESIBILIDAD',
  'Tipos reducidos de IVA en obras de accesibilidad, productos de apoyo y vehículos para personas con movilidad reducida',
  'es-iva-reducido-accesibilidad',
  'Beneficio fiscal estatal: tipos reducidos de IVA (10% y superreducido del 4%) aplicables a obras de adaptación y supresión de barreras en vivienda, adquisición de prótesis, órtesis y productos de apoyo, y adquisición y adaptación de vehículos para personas con movilidad reducida, en lugar del 21% general.',
  'Tipos reducidos de IVA para obras y productos de accesibilidad.',
  'estatal', 'Agencia Tributaria (AEAT)', 'Agencia Tributaria (AEAT)',
  'vigente', 'BENEFICIO_FISCAL',
  '2f7d71ad-bfe4-4f52-89d1-84e37371b33b',
  'Personas con discapacidad y comunidades de propietarios que ejecutan obras de accesibilidad.',
  'Obras de adaptación y supresión de barreras en vivienda; adquisición de prótesis, órtesis y productos de apoyo; adquisición y adaptación de vehículos para personas con movilidad reducida.',
  NULL, NULL,
  'NO VERIFICADO EN ESTA REVISIÓN. Beneficio fiscal permanente, no convocatoria: en la app debe filtrarse aparte de las ayudas con plazo. Confirmar supuestos y tipos exactos con AEAT antes de publicar.',
  'Ley 37/1992 del IVA',
  false, false, true
) ON CONFLICT (slug) DO NOTHING;
