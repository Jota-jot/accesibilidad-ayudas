/*
# Schema updates for real aid data

Changes:
1. Add 'vigente' status — program is active but no open call right now
2. Add 'archived' boolean to aid_programs — allows archiving without deleting
3. Add 'normative_reference' text column — stores BOE/DOE/DOG reference
4. Add 'duplicated_from' uuid column — tracks duplicated aids for the "duplicate as draft" feature
*/

-- Add new status value 'vigente' to the CHECK constraint
ALTER TABLE public.aid_programs DROP CONSTRAINT IF EXISTS aid_programs_status_check;
ALTER TABLE public.aid_programs ADD CONSTRAINT aid_programs_status_check
  CHECK (status IN ('abierta','proxima','cerrada','permanente','suspendida','vigente'));

-- Add archived flag
ALTER TABLE public.aid_programs ADD COLUMN IF NOT EXISTS archived boolean NOT NULL DEFAULT false;

-- Add normative reference (e.g. "BOE-A-2026-8872", "RD 326/2026")
ALTER TABLE public.aid_programs ADD COLUMN IF NOT EXISTS normative_reference text;

-- Add duplicated_from for tracking duplicated drafts
ALTER TABLE public.aid_programs ADD COLUMN IF NOT EXISTS duplicated_from uuid REFERENCES public.aid_programs(id) ON DELETE SET NULL;

-- Create index for archived filtering
CREATE INDEX IF NOT EXISTS aid_programs_archived_idx ON public.aid_programs(archived);

-- Update RLS: archived aids should still be readable (admin can unarchive)
-- No policy change needed since existing SELECT policy uses true.
