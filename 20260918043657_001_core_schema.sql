/*
# Core Schema: Accesibilidad Ayudas España

This migration creates the foundational schema for a platform that helps people
find accessibility-related public aids/subsidies in Spain.

## New Tables

1. territories — Hierarchical geographic structure (Spain → CCAA → Province → Municipality)
2. beneficiaries — Types of aid applicants
3. accessibility_types — Categories of accessibility
4. actions — Concrete interventions
5. solutions — Products/services linked to actions
6. aid_programs — The main table for aid/subsidy programs
7. sources — Official publication sources (references aid_programs)
8. aid_financing — Financing details per aid
9. requirements — Eligibility requirements per aid
10. documents — Required documentation per aid
11. aid_beneficiaries — M2M: aids ↔ beneficiaries
12. aid_actions — M2M: aids ↔ actions
13. aid_accessibility_types — M2M: aids ↔ accessibility_types
14. aid_solutions — M2M: aids ↔ solutions
15. aid_territories — M2M: aids ↔ territories
16. profiles — User profiles linked to auth.users
17. saved_aids — Users' bookmarked aids
18. alerts — User-defined alert criteria

## Security (RLS)

- Catalog tables: public read, no frontend writes.
- aid_programs + related: public read, admin-only writes.
- profiles: self-scoped.
- saved_aids, alerts: owner-scoped CRUD.
- Admin detection via is_admin() checking raw_app_meta_data role='admin'.
*/

-- ============================================================
-- HELPER: is_admin()
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- ============================================================
-- territories
-- ============================================================
CREATE TABLE IF NOT EXISTS public.territories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  type text NOT NULL CHECK (type IN ('pais','comunidad','provincia','municipio')),
  parent_id uuid REFERENCES public.territories(id) ON DELETE CASCADE,
  code text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS territories_slug_key ON public.territories(slug);
CREATE INDEX IF NOT EXISTS territories_parent_id_idx ON public.territories(parent_id);
CREATE INDEX IF NOT EXISTS territories_type_idx ON public.territories(type);

ALTER TABLE public.territories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_territories" ON public.territories;
CREATE POLICY "public_read_territories" ON public.territories
  FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- beneficiaries
-- ============================================================
CREATE TABLE IF NOT EXISTS public.beneficiaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.beneficiaries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_beneficiaries" ON public.beneficiaries;
CREATE POLICY "public_read_beneficiaries" ON public.beneficiaries
  FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- accessibility_types
-- ============================================================
CREATE TABLE IF NOT EXISTS public.accessibility_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.accessibility_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_accessibility_types" ON public.accessibility_types;
CREATE POLICY "public_read_accessibility_types" ON public.accessibility_types
  FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- actions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_actions" ON public.actions;
CREATE POLICY "public_read_actions" ON public.actions
  FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- solutions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.solutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_solutions" ON public.solutions;
CREATE POLICY "public_read_solutions" ON public.solutions
  FOR SELECT TO anon, authenticated USING (true);

-- ============================================================
-- aid_programs
-- ============================================================
CREATE TABLE IF NOT EXISTS public.aid_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL,
  description text,
  short_description text,
  administration_level text NOT NULL CHECK (administration_level IN ('estatal','autonomico','provincial','municipal')),
  administration_name text,
  organism text,
  status text NOT NULL DEFAULT 'abierta' CHECK (status IN ('abierta','proxima','cerrada','permanente','suspendida')),
  call_number text,
  publication_date date,
  opening_date date,
  closing_date date,
  indefinite_deadline boolean NOT NULL DEFAULT false,
  territory_id uuid REFERENCES public.territories(id) ON DELETE SET NULL,
  beneficiary_description text,
  eligible_expenses text,
  application_url text,
  official_url text,
  source_url text,
  contact_information text,
  notes text,
  last_verified_at timestamptz,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS aid_programs_slug_key ON public.aid_programs(slug);
CREATE INDEX IF NOT EXISTS aid_programs_status_idx ON public.aid_programs(status);
CREATE INDEX IF NOT EXISTS aid_programs_territory_id_idx ON public.aid_programs(territory_id);
CREATE INDEX IF NOT EXISTS aid_programs_admin_level_idx ON public.aid_programs(administration_level);

ALTER TABLE public.aid_programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_aid_programs" ON public.aid_programs;
CREATE POLICY "public_read_aid_programs" ON public.aid_programs
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_aid_programs" ON public.aid_programs;
CREATE POLICY "admin_insert_aid_programs" ON public.aid_programs
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_update_aid_programs" ON public.aid_programs;
CREATE POLICY "admin_update_aid_programs" ON public.aid_programs
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "admin_delete_aid_programs" ON public.aid_programs;
CREATE POLICY "admin_delete_aid_programs" ON public.aid_programs
  FOR DELETE TO authenticated USING (public.is_admin());

-- ============================================================
-- sources (references aid_programs)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  source_type text NOT NULL CHECK (source_type IN (
    'boe','organismo_estatal','comunidad_autonoma','diputacion',
    'ayuntamiento','diario_oficial','portal_institucional','otra_fuente_oficial'
  )),
  url text,
  publication_date date,
  document_reference text,
  verified boolean NOT NULL DEFAULT false,
  last_checked_at timestamptz,
  aid_id uuid REFERENCES public.aid_programs(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_sources" ON public.sources;
CREATE POLICY "public_read_sources" ON public.sources
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_write_sources" ON public.sources;
CREATE POLICY "admin_write_sources" ON public.sources
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================
-- aid_financing
-- ============================================================
CREATE TABLE IF NOT EXISTS public.aid_financing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aid_id uuid NOT NULL REFERENCES public.aid_programs(id) ON DELETE CASCADE,
  amount numeric,
  percentage numeric,
  min_amount numeric,
  max_amount numeric,
  amount_unit text,
  financing_description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS aid_financing_aid_id_idx ON public.aid_financing(aid_id);

ALTER TABLE public.aid_financing ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_aid_financing" ON public.aid_financing;
CREATE POLICY "public_read_aid_financing" ON public.aid_financing
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_write_aid_financing" ON public.aid_financing;
CREATE POLICY "admin_write_aid_financing" ON public.aid_financing
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================
-- requirements
-- ============================================================
CREATE TABLE IF NOT EXISTS public.requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aid_id uuid NOT NULL REFERENCES public.aid_programs(id) ON DELETE CASCADE,
  requirement_text text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS requirements_aid_id_idx ON public.requirements(aid_id);

ALTER TABLE public.requirements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_requirements" ON public.requirements;
CREATE POLICY "public_read_requirements" ON public.requirements
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_write_requirements" ON public.requirements;
CREATE POLICY "admin_write_requirements" ON public.requirements
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================
-- documents
-- ============================================================
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  aid_id uuid NOT NULL REFERENCES public.aid_programs(id) ON DELETE CASCADE,
  document_name text NOT NULL,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS documents_aid_id_idx ON public.documents(aid_id);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_documents" ON public.documents;
CREATE POLICY "public_read_documents" ON public.documents
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_write_documents" ON public.documents;
CREATE POLICY "admin_write_documents" ON public.documents
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================
-- Junction tables (M2M)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.aid_beneficiaries (
  aid_id uuid NOT NULL REFERENCES public.aid_programs(id) ON DELETE CASCADE,
  beneficiary_id uuid NOT NULL REFERENCES public.beneficiaries(id) ON DELETE CASCADE,
  PRIMARY KEY (aid_id, beneficiary_id)
);
ALTER TABLE public.aid_beneficiaries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_aid_beneficiaries" ON public.aid_beneficiaries;
CREATE POLICY "public_read_aid_beneficiaries" ON public.aid_beneficiaries
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_write_aid_beneficiaries" ON public.aid_beneficiaries;
CREATE POLICY "admin_write_aid_beneficiaries" ON public.aid_beneficiaries
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS public.aid_actions (
  aid_id uuid NOT NULL REFERENCES public.aid_programs(id) ON DELETE CASCADE,
  action_id uuid NOT NULL REFERENCES public.actions(id) ON DELETE CASCADE,
  PRIMARY KEY (aid_id, action_id)
);
ALTER TABLE public.aid_actions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_aid_actions" ON public.aid_actions;
CREATE POLICY "public_read_aid_actions" ON public.aid_actions
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_write_aid_actions" ON public.aid_actions;
CREATE POLICY "admin_write_aid_actions" ON public.aid_actions
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS public.aid_accessibility_types (
  aid_id uuid NOT NULL REFERENCES public.aid_programs(id) ON DELETE CASCADE,
  accessibility_type_id uuid NOT NULL REFERENCES public.accessibility_types(id) ON DELETE CASCADE,
  PRIMARY KEY (aid_id, accessibility_type_id)
);
ALTER TABLE public.aid_accessibility_types ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_aid_accessibility_types" ON public.aid_accessibility_types;
CREATE POLICY "public_read_aid_accessibility_types" ON public.aid_accessibility_types
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_write_aid_accessibility_types" ON public.aid_accessibility_types;
CREATE POLICY "admin_write_aid_accessibility_types" ON public.aid_accessibility_types
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS public.aid_solutions (
  aid_id uuid NOT NULL REFERENCES public.aid_programs(id) ON DELETE CASCADE,
  solution_id uuid NOT NULL REFERENCES public.solutions(id) ON DELETE CASCADE,
  PRIMARY KEY (aid_id, solution_id)
);
ALTER TABLE public.aid_solutions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_aid_solutions" ON public.aid_solutions;
CREATE POLICY "public_read_aid_solutions" ON public.aid_solutions
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_write_aid_solutions" ON public.aid_solutions;
CREATE POLICY "admin_write_aid_solutions" ON public.aid_solutions
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE IF NOT EXISTS public.aid_territories (
  aid_id uuid NOT NULL REFERENCES public.aid_programs(id) ON DELETE CASCADE,
  territory_id uuid NOT NULL REFERENCES public.territories(id) ON DELETE CASCADE,
  PRIMARY KEY (aid_id, territory_id)
);
ALTER TABLE public.aid_territories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_aid_territories" ON public.aid_territories;
CREATE POLICY "public_read_aid_territories" ON public.aid_territories
  FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin_write_aid_territories" ON public.aid_territories;
CREATE POLICY "admin_write_aid_territories" ON public.aid_territories
  FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================
-- profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  user_type text NOT NULL DEFAULT 'particular' CHECK (user_type IN (
    'particular','profesional','entidad','administracion','administrador'
  )),
  phone text,
  company_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_own_profile" ON public.profiles;
CREATE POLICY "read_own_profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;
CREATE POLICY "insert_own_profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "update_own_profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ============================================================
-- saved_aids
-- ============================================================
CREATE TABLE IF NOT EXISTS public.saved_aids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  aid_id uuid NOT NULL REFERENCES public.aid_programs(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, aid_id)
);
CREATE INDEX IF NOT EXISTS saved_aids_user_id_idx ON public.saved_aids(user_id);

ALTER TABLE public.saved_aids ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_saved_aids" ON public.saved_aids;
CREATE POLICY "select_own_saved_aids" ON public.saved_aids
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_saved_aids" ON public.saved_aids;
CREATE POLICY "insert_own_saved_aids" ON public.saved_aids
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_saved_aids" ON public.saved_aids;
CREATE POLICY "delete_own_saved_aids" ON public.saved_aids
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- alerts
-- ============================================================
CREATE TABLE IF NOT EXISTS public.alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  territory_id uuid REFERENCES public.territories(id) ON DELETE SET NULL,
  beneficiary_id uuid REFERENCES public.beneficiaries(id) ON DELETE SET NULL,
  action_id uuid REFERENCES public.actions(id) ON DELETE SET NULL,
  accessibility_type_id uuid REFERENCES public.accessibility_types(id) ON DELETE SET NULL,
  keywords text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS alerts_user_id_idx ON public.alerts(user_id);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_alerts" ON public.alerts;
CREATE POLICY "select_own_alerts" ON public.alerts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_alerts" ON public.alerts;
CREATE POLICY "insert_own_alerts" ON public.alerts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_alerts" ON public.alerts;
CREATE POLICY "update_own_alerts" ON public.alerts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_alerts" ON public.alerts;
CREATE POLICY "delete_own_alerts" ON public.alerts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- updated_at triggers
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS aid_programs_updated_at ON public.aid_programs;
CREATE TRIGGER aid_programs_updated_at
  BEFORE UPDATE ON public.aid_programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_type)
  VALUES (NEW.id, 'particular')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
