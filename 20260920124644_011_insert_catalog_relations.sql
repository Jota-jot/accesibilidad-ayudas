-- Insert relations for the 35 catalog aids, matching by slug

-- Helper: we use subqueries to get IDs from slugs

-- ============================================================
-- AID_BENEFICIARIES
-- ============================================================
-- particular (7240d6c2...), propietario (bee62889...), comunidad-de-propietarios (bb2142bc...), inquilino (8c55482d...),
-- empresa (8125f279...), municipio (873c47f0...), administracion-publica (4ea7c239...), entidad-social (d0437104...),
-- asociacion (5042b223...), diputacion (82f1ed4e...), ong (d034f217...), fundacion (3baca040...), autonomo (8df33119...)

-- 1. Andalucía vivienda protegida alquiler: promotores públicos/privados → administracion-publica, empresa
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'and-2026-vivienda-protegida-alquiler'
AND b.slug IN ('administracion-publica','empresa') ON CONFLICT DO NOTHING;

-- 2. Andalucía alquiler vulnerables: inquilino, particular
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'and-alquiler-vulnerables'
AND b.slug IN ('inquilino','particular') ON CONFLICT DO NOTHING;

-- 3. Aragón Zaragoza: propietario, comunidad-de-propietarios, inquilino
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'ara-2026-rehabilitacion-zaragoza'
AND b.slug IN ('propietario','comunidad-de-propietarios','inquilino') ON CONFLICT DO NOTHING;

-- 4. Asturias accesibilidad edificios: comunidad-de-propietarios, propietario
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'ast-2026-accesibilidad-edificios'
AND b.slug IN ('comunidad-de-propietarios','propietario') ON CONFLICT DO NOTHING;

-- 5. Cantabria rehabilitación pública: municipio, administracion-publica
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'cant-2026-rehabilitacion-edificios-publicos'
AND b.slug IN ('municipio','administracion-publica') ON CONFLICT DO NOTHING;

-- 6. CLM FEDER: propietario, comunidad-de-propietarios
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'clm-2026-rehabilitacion-feder'
AND b.slug IN ('propietario','comunidad-de-propietarios') ON CONFLICT DO NOTHING;

-- 7. CyL alquiler: inquilino
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'cyl-2025-ayuda-alquiler'
AND b.slug = 'inquilino' ON CONFLICT DO NOTHING;

-- 8. CyL inundaciones: propietario
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'cyl-2026-recuperacion-inundaciones'
AND b.slug = 'propietario' ON CONFLICT DO NOTHING;

-- 9. CyL incendios: propietario
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'cyl-2026-recuperacion-incendios'
AND b.slug = 'propietario' ON CONFLICT DO NOTHING;

-- 10. Cat rural: propietario
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'cat-2026-rehabilitacion-mundo-rural'
AND b.slug = 'propietario' ON CONFLICT DO NOTHING;

-- 11. Cat NGEU: propietario, comunidad-de-propietarios
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'cat-ngeu-rehabilitacion-residencial'
AND b.slug IN ('propietario','comunidad-de-propietarios') ON CONFLICT DO NOTHING;

-- 12. Madrid Impulso: propietario, comunidad-de-propietarios
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'mad-2026-impulso-vivienda'
AND b.slug IN ('propietario','comunidad-de-propietarios') ON CONFLICT DO NOTHING;

-- 13. Madrid PRTR energía: propietario, comunidad-de-propietarios
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'mad-prtr-rehabilitacion-energetica'
AND b.slug IN ('propietario','comunidad-de-propietarios') ON CONFLICT DO NOTHING;

-- 14. Madrid accesibilidad: propietario, comunidad-de-propietarios
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'mad-2025-rehabilitacion-accesibilidad'
AND b.slug IN ('propietario','comunidad-de-propietarios') ON CONFLICT DO NOTHING;

-- 15. CV Bono Alquiler Joven: particular
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'cv-2026-bono-alquiler-joven'
AND b.slug = 'particular' ON CONFLICT DO NOTHING;

-- 16. CV DANA alquiler: inquilino
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'cv-2026-dana-alquiler'
AND b.slug = 'inquilino' ON CONFLICT DO NOTHING;

-- 17. CV incendio alquiler: inquilino
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'cv-2026-urgencia-alquiler-incendio'
AND b.slug = 'inquilino' ON CONFLICT DO NOTHING;

-- 18. CV PLAN ADHA: administracion-publica, municipio
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'cv-2026-plan-adha-adquisicion'
AND b.slug IN ('administracion-publica','municipio') ON CONFLICT DO NOTHING;

-- 19. Extremadura rural: propietario
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'ext-2026-rehabilitacion-rural'
AND b.slug = 'propietario' ON CONFLICT DO NOTHING;

-- 20. Galicia VI435E: propietario
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'gal-2026-vi435e-rehabilitacion-rural'
AND b.slug = 'propietario' ON CONFLICT DO NOTHING;

-- 21. Galicia Fogar Vivo: propietario
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'gal-2026-fogar-vivo'
AND b.slug = 'propietario' ON CONFLICT DO NOTHING;

-- 22. La Rioja energía: propietario
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'rioj-2026-eficiencia-energetica'
AND b.slug = 'propietario' ON CONFLICT DO NOTHING;

-- 23. Baleares Lloguer Segur: propietario
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'ib-lloguer-segur'
AND b.slug = 'propietario' ON CONFLICT DO NOTHING;

-- 24. Canarias adquisición jóvenes: particular
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'can-2026-adquisicion-vivienda-jovenes'
AND b.slug = 'particular' ON CONFLICT DO NOTHING;

-- 25. Canarias despoblación: municipio, particular
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'can-2026-despoblacion-rural'
AND b.slug IN ('municipio','particular') ON CONFLICT DO NOTHING;

-- 26. Navarra rehabilitación: propietario, comunidad-de-propietarios
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'nav-2026-rehabilitacion-calificacion-protegida'
AND b.slug IN ('propietario','comunidad-de-propietarios') ON CONFLICT DO NOTHING;

-- 27. Navarra bolsa alquiler: propietario
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'nav-2026-adecuacion-bolsa-alquiler'
AND b.slug = 'propietario' ON CONFLICT DO NOTHING;

-- 28. País Vasco CAPV: propietario, comunidad-de-propietarios
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'pva-2026-marco-capv-vivienda-rehabilitacion'
AND b.slug IN ('propietario','comunidad-de-propietarios') ON CONFLICT DO NOTHING;

-- 29-31. Murcia三条: propietario, comunidad-de-propietarios
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug IN ('mur-2026-eficiencia-energetica','mur-2026-libro-edificio-rehabilitacion','mur-2026-rehabilitacion-edificio')
AND b.slug IN ('propietario','comunidad-de-propietarios') ON CONFLICT DO NOTHING;

-- 32. Plan Estatal: particular, propietario, comunidad-de-propietarios
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'es-2026-plan-estatal-vivienda-2026-2030'
AND b.slug IN ('particular','propietario','comunidad-de-propietarios','inquilino') ON CONFLICT DO NOTHING;

-- 33. PRTR estatal: comunidad-de-propietarios, propietario
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'es-prtr-rehabilitacion-residencial'
AND b.slug IN ('comunidad-de-propietarios','propietario') ON CONFLICT DO NOTHING;

-- 34. Ceuta: particular, inquilino
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'ceu-2026-lineas-vivienda-bono-alquiler'
AND b.slug IN ('particular','inquilino') ON CONFLICT DO NOTHING;

-- 35. Melilla: inquilino
INSERT INTO public.aid_beneficiaries (aid_id, beneficiary_id)
SELECT a.id, b.id FROM public.aid_programs a, public.beneficiaries b
WHERE a.slug = 'mel-2026-alquiler-modernizacion'
AND b.slug = 'inquilino' ON CONFLICT DO NOTHING;

-- ============================================================
-- AID_ACTIONS
-- ============================================================
-- Actions slugs: rehabilitacion-act, ascensor, eliminacion-barreras-arquitectonicas, adaptacion-de-edificio, adaptacion-de-vivienda,
-- alquiler-vivienda-asequible, eficiencia-energetica, adquisicion-vivienda, recuperacion-viviendas, conservacion-habitabilidad, despoblacion

-- All rehabilitation/energía aids
INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug IN (
  'ara-2026-rehabilitacion-zaragoza','ast-2026-accesibilidad-edificios','cant-2026-rehabilitacion-edificios-publicos',
  'clm-2026-rehabilitacion-feder','cat-2026-rehabilitacion-mundo-rural','cat-ngeu-rehabilitacion-residencial',
  'mad-prtr-rehabilitacion-energetica','mad-2025-rehabilitacion-accesibilidad',
  'ext-2026-rehabilitacion-rural','gal-2026-vi435e-rehabilitacion-rural','gal-2026-fogar-vivo',
  'rioj-2026-eficiencia-energetica','nav-2026-rehabilitacion-calificacion-protegida',
  'pva-2026-marco-capv-vivienda-rehabilitacion','mur-2026-eficiencia-energetica',
  'mur-2026-libro-edificio-rehabilitacion','mur-2026-rehabilitacion-edificio',
  'es-prtr-rehabilitacion-residencial'
) AND act.slug = 'rehabilitacion-act' ON CONFLICT DO NOTHING;

-- Efficiency energy
INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug IN (
  'ara-2026-rehabilitacion-zaragoza','clm-2026-rehabilitacion-feder','cat-ngeu-rehabilitacion-residencial',
  'mad-prtr-rehabilitacion-energetica','rioj-2026-eficiencia-energetica',
  'mur-2026-eficiencia-energetica','mur-2026-rehabilitacion-edificio',
  'es-prtr-rehabilitacion-residencial','ext-2026-rehabilitacion-rural',
  'gal-2026-vi435e-rehabilitacion-rural','gal-2026-fogar-vivo',
  'pva-2026-marco-capv-vivienda-rehabilitacion','nav-2026-rehabilitacion-calificacion-protegida'
) AND act.slug = 'eficiencia-energetica' ON CONFLICT DO NOTHING;

-- Accessibility actions (ascensor, eliminacion-barreras, adaptacion-edificio)
INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug IN (
  'ast-2026-accesibilidad-edificios','mad-2025-rehabilitacion-accesibilidad',
  'nav-2026-rehabilitacion-calificacion-protegida','pva-2026-marco-capv-vivienda-rehabilitacion',
  'ara-2026-rehabilitacion-zaragoza','clm-2026-rehabilitacion-feder',
  'gal-2026-fogar-vivo','ext-2026-rehabilitacion-rural',
  'cat-ngeu-rehabilitacion-residencial','mad-2026-impulso-vivienda',
  'es-2026-plan-estatal-vivienda-2026-2030','es-prtr-rehabilitacion-residencial'
) AND act.slug = 'eliminacion-barreras-arquitectonicas' ON CONFLICT DO NOTHING;

INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug IN (
  'ast-2026-accesibilidad-edificios','mad-2025-rehabilitacion-accesibilidad',
  'nav-2026-rehabilitacion-calificacion-protegida',
  'ara-2026-rehabilitacion-zaragoza','clm-2026-rehabilitacion-feder',
  'gal-2026-fogar-vivo','pva-2026-marco-capv-vivienda-rehabilitacion',
  'mad-2026-impulso-vivienda'
) AND act.slug = 'ascensor' ON CONFLICT DO NOTHING;

INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug IN (
  'ast-2026-accesibilidad-edificios','mad-2025-rehabilitacion-accesibilidad',
  'nav-2026-rehabilitacion-calificacion-protegida','pva-2026-marbo-capv-vivienda-rehabilitacion',
  'pva-2026-marco-capv-vivienda-rehabilitacion','ara-2026-rehabilitacion-zaragoza',
  'clm-2026-rehabilitacion-feder','gal-2026-fogar-vivo','ext-2026-rehabilitacion-rural',
  'mad-2026-impulso-vivienda','cat-2026-rehabilitacion-mundo-rural'
) AND act.slug = 'adaptacion-de-edificio' ON CONFLICT DO NOTHING;

-- Alquiler
INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug IN (
  'and-2026-vivienda-protegida-alquiler','and-alquiler-vulnerables',
  'cyl-2025-ayuda-alquiler','ara-2026-rehabilitacion-zaragoza',
  'cv-2026-bono-alquiler-joven','cv-2026-dana-alquiler','cv-2026-urgencia-alquiler-incendio',
  'ib-lloguer-segur','nav-2026-adecuacion-bolsa-alquiler',
  'ceu-2026-lineas-vivienda-bono-alquiler','mel-2026-alquiler-modernizacion',
  'es-2026-plan-estatal-vivienda-2026-2030','mad-2026-impulso-vivienda'
) AND act.slug = 'alquiler-vivienda-asequible' ON CONFLICT DO NOTHING;

-- Adquisición vivienda
INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug IN ('can-2026-adquisicion-vivienda-jovenes','cv-2026-plan-adha-adquisicion')
AND act.slug = 'adquisicion-vivienda' ON CONFLICT DO NOTHING;

-- Recuperación viviendas
INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug IN ('cyl-2026-recuperacion-inundaciones','cyl-2026-recuperacion-incendios')
AND act.slug = 'recuperacion-viviendas' ON CONFLICT DO NOTHING;

-- Conservación/habitabilidad
INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug IN ('nav-2026-rehabilitacion-calificacion-protegida','pva-2026-marco-capv-vivienda-rehabilitacion',
  'cant-2026-rehabilitacion-edificios-publicos','mur-2026-libro-edificio-rehabilitacion')
AND act.slug = 'conservacion-habitabilidad' ON CONFLICT DO NOTHING;

-- Despoblación
INSERT INTO public.aid_actions (aid_id, action_id)
SELECT a.id, act.id FROM public.aid_programs a, public.actions act
WHERE a.slug IN ('can-2026-despoblacion-rural','cat-2026-rehabilitacion-mundo-rural','ext-2026-rehabilitacion-rural')
AND act.slug = 'despoblacion' ON CONFLICT DO NOTHING;

-- ============================================================
-- AID_ACCESSIBILITY_TYPES
-- ============================================================
-- accessibility_types slugs: accesibilidad-universal, eliminacion-de-barreras, accesibilidad-fisica, accesibilidad-rural, rehabilitacion, rehabilitacion-energetica

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, acc.id FROM public.aid_programs a, public.accessibility_types acc
WHERE a.slug IN (
  'ast-2026-accesibilidad-edificios','mad-2025-rehabilitacion-accesibilidad',
  'nav-2026-rehabilitacion-calificacion-protegida','pva-2026-marco-capv-vivienda-rehabilitacion',
  'ara-2026-rehabilitacion-zaragoza','clm-2026-rehabilitacion-feder',
  'gal-2026-fogar-vivo','ext-2026-rehabilitacion-rural',
  'cat-ngeu-rehabilitacion-residencial','mad-2026-impulso-vivienda',
  'es-2026-plan-estatal-vivienda-2026-2030','es-prtr-rehabilitacion-residencial',
  'cat-2026-rehabilitacion-mundo-rural','gal-2026-vi435e-rehabilitacion-rural',
  'mur-2026-rehabilitacion-edificio','mur-2026-eficiencia-energetica',
  'mad-prtr-rehabilitacion-energetica','rioj-2026-eficiencia-energetica'
) AND acc.slug = 'accesibilidad-universal' ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, acc.id FROM public.aid_programs a, public.accessibility_types acc
WHERE a.slug IN (
  'ast-2026-accesibilidad-edificios','mad-2025-rehabilitacion-accesibilidad',
  'nav-2026-rehabilitacion-calificacion-protegida','ara-2026-rehabilitacion-zaragoza',
  'gal-2026-fogar-vivo','mad-2026-impulso-vivienda'
) AND acc.slug = 'eliminacion-de-barreras' ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, acc.id FROM public.aid_programs a, public.accessibility_types acc
WHERE a.slug IN (
  'ast-2026-accesibilidad-edificios','mad-2025-rehabilitacion-accesibilidad',
  'nav-2026-rehabilitacion-calificacion-protegida','mad-2026-impulso-vivienda',
  'es-2026-plan-estatal-vivienda-2026-2030'
) AND acc.slug = 'accesibilidad-fisica' ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, acc.id FROM public.aid_programs a, public.accessibility_types acc
WHERE a.slug IN (
  'cat-2026-rehabilitacion-mundo-rural','gal-2026-vi435e-rehabilitacion-rural',
  'ext-2026-rehabilitacion-rural','can-2026-despoblacion-rural'
) AND acc.slug = 'accesibilidad-rural' ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, acc.id FROM public.aid_programs a, public.accessibility_types acc
WHERE a.slug IN (
  'ara-2026-rehabilitacion-zaragoza','clm-2026-rehabilitacion-feder',
  'cat-ngeu-rehabilitacion-residencial','mad-prtr-rehabilitacion-energetica',
  'rioj-2026-eficiencia-energetica','mur-2026-eficiencia-energetica',
  'mur-2026-rehabilitacion-edificio','es-prtr-rehabilitacion-residencial',
  'ext-2026-rehabilitacion-rural','gal-2026-vi435e-rehabilitacion-rural',
  'gal-2026-fogar-vivo','pva-2026-marco-capv-vivienda-rehabilitacion',
  'nav-2026-rehabilitacion-calificacion-protegida','cat-2026-rehabilitacion-mundo-rural'
) AND acc.slug = 'rehabilitacion' ON CONFLICT DO NOTHING;

INSERT INTO public.aid_accessibility_types (aid_id, accessibility_type_id)
SELECT a.id, acc.id FROM public.aid_programs a, public.accessibility_types acc
WHERE a.slug IN (
  'ara-2026-rehabilitacion-zaragoza','clm-2026-rehabilitacion-feder',
  'cat-ngeu-rehabilitacion-residencial','mad-prtr-rehabilitacion-energetica',
  'rioj-2026-eficiencia-energetica','mur-2026-eficiencia-energetica',
  'mur-2026-rehabilitacion-edificio','es-prtr-rehabilitacion-residencial'
) AND acc.slug = 'rehabilitacion-energetica' ON CONFLICT DO NOTHING;

-- ============================================================
-- AID_FINANCING (for aids with known amounts)
-- ============================================================
-- 3. Aragón Zaragoza
INSERT INTO public.aid_financing (aid_id, financing_description)
SELECT a.id, 'Líneas de financiación para energía, accesibilidad, bajos ingresos y alquiler asequible.'
FROM public.aid_programs a WHERE a.slug = 'ara-2026-rehabilitacion-zaragoza'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

-- 6. CLM FEDER
INSERT INTO public.aid_financing (aid_id, percentage, financing_description)
SELECT a.id, 70.0, 'Hasta 60–70 % de subvención, con incremento en zonas despobladas. Fondos FEDER.'
FROM public.aid_programs a WHERE a.slug = 'clm-2026-rehabilitacion-feder'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

-- 14. Madrid accesibilidad
INSERT INTO public.aid_financing (aid_id, max_amount, financing_description)
SELECT a.id, 12500.0, 'Hasta 12.500 € por vivienda unifamiliar en la línea de accesibilidad.'
FROM public.aid_programs a WHERE a.slug = 'mad-2025-rehabilitacion-accesibilidad'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

-- 12. Madrid Impulso
INSERT INTO public.aid_financing (aid_id, percentage, financing_description)
SELECT a.id, 100.0, 'Hasta 100 % de subvención en municipios de menos de 5.000 habitantes.'
FROM public.aid_programs a WHERE a.slug = 'mad-2026-impulso-vivienda'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

-- 19. Extremadura rural
INSERT INTO public.aid_financing (aid_id, max_amount, percentage, financing_description)
SELECT a.id, 14000.0, 70.0, 'Hasta 50–70 %, máximo 14.000 € para obras completas y 9.000 € para obras parciales.'
FROM public.aid_programs a WHERE a.slug = 'ext-2026-rehabilitacion-rural'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

-- 20. Galicia VI435E
INSERT INTO public.aid_financing (aid_id, max_amount, percentage, financing_description)
SELECT a.id, 30000.0, 75.0, '75 % de subvención, máximo 30.000 €.'
FROM public.aid_programs a WHERE a.slug = 'gal-2026-vi435e-rehabilitacion-rural'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

-- 21. Galicia Fogar Vivo
INSERT INTO public.aid_financing (aid_id, max_amount, financing_description)
SELECT a.id, 16000.0, 'Máximo global de 16.000 € por vivienda.'
FROM public.aid_programs a WHERE a.slug = 'gal-2026-fogar-vivo'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

-- 22. La Rioja energía
INSERT INTO public.aid_financing (aid_id, max_amount, percentage, financing_description)
SELECT a.id, 3000.0, 40.0, '40 % de subvención, máximo 3.000 €.'
FROM public.aid_programs a WHERE a.slug = 'rioj-2026-eficiencia-energetica'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

-- 23. Baleares Lloguer Segur
INSERT INTO public.aid_financing (aid_id, max_amount, financing_description)
SELECT a.id, 50000.0, 'Anticipo de hasta 50.000 € de rentas futuras para obras de rehabilitación.'
FROM public.aid_programs a WHERE a.slug = 'ib-lloguer-segur'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

-- 27. Navarra bolsa alquiler
INSERT INTO public.aid_financing (aid_id, amount, financing_description)
SELECT a.id, 200000.0, 'Medida 2026 con presupuesto de 200.000 €.'
FROM public.aid_programs a WHERE a.slug = 'nav-2026-adecuacion-bolsa-alquiler'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

-- 5. Cantabria edificios públicos
INSERT INTO public.aid_financing (aid_id, amount, financing_description)
SELECT a.id, 1500000.0, 'Presupuesto total de 1.500.000 €.'
FROM public.aid_programs a WHERE a.slug = 'cant-2026-rehabilitacion-edificios-publicos'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

-- 31. Murcia rehabilitación edificio (reducción 30%)
INSERT INTO public.aid_financing (aid_id, financing_description)
SELECT a.id, 'Subvención para rehabilitación energética que exige reducción mínima del 30 % de energía primaria no renovable.'
FROM public.aid_programs a WHERE a.slug = 'mur-2026-rehabilitacion-edificio'
AND NOT EXISTS (SELECT 1 FROM public.aid_financing f WHERE f.aid_id = a.id);

-- ============================================================
-- SOURCES (official URLs for all 35 aids)
-- ============================================================
INSERT INTO public.sources (name, source_type, url, verified, last_checked_at, aid_id, publication_date)
SELECT a.title, 'comunidad_autonoma', a.official_url, true, '2026-09-20', a.id, a.publication_date
FROM public.aid_programs a
WHERE a.slug IN (
  'and-2026-vivienda-protegida-alquiler','and-alquiler-vulnerables','ara-2026-rehabilitacion-zaragoza',
  'ast-2026-accesibilidad-edificios','cant-2026-rehabilitacion-edificios-publicos','clm-2026-rehabilitacion-feder',
  'cyl-2025-ayuda-alquiler','cyl-2026-recuperacion-inundaciones','cyl-2026-recuperacion-incendios',
  'cat-2026-rehabilitacion-mundo-rural','cat-ngeu-rehabilitacion-residencial',
  'mad-2026-impulso-vivienda','mad-prtr-rehabilitacion-energetica','mad-2025-rehabilitacion-accesibilidad',
  'cv-2026-bono-alquiler-joven','cv-2026-dana-alquiler','cv-2026-urgencia-alquiler-incendio',
  'cv-2026-plan-adha-adquisicion','ext-2026-rehabilitacion-rural',
  'gal-2026-vi435e-rehabilitacion-rural','gal-2026-fogar-vivo',
  'rioj-2026-eficiencia-energetica','ib-lloguer-segur',
  'can-2026-adquisicion-vivienda-jovenes','can-2026-despoblacion-rural',
  'nav-2026-rehabilitacion-calificacion-protegida','nav-2026-adecuacion-bolsa-alquiler',
  'pva-2026-marco-capv-vivienda-rehabilitacion',
  'mur-2026-eficiencia-energetica','mur-2026-libro-edificio-rehabilitacion','mur-2026-rehabilitacion-edificio',
  'ceu-2026-lineas-vivienda-bono-alquiler','mel-2026-alquiler-modernizacion'
)
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = a.id);

-- State-level sources (BOE)
INSERT INTO public.sources (name, source_type, url, verified, last_checked_at, aid_id, publication_date, document_reference)
SELECT a.title, 'boe', a.official_url, true, '2026-09-20', a.id, a.publication_date, a.normative_reference
FROM public.aid_programs a
WHERE a.slug IN ('es-2026-plan-estatal-vivienda-2026-2030','es-prtr-rehabilitacion-residencial')
AND NOT EXISTS (SELECT 1 FROM public.sources s WHERE s.aid_id = a.id);
