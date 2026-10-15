/*
# Add new status values and insert real verified aids

New statuses: en_tramitacion, resuelta, marco_estatal, revisar
These map to the user's requirements:
- MARCO_ESTATAL = RD 326/2026 framework (not an open call)
- RESUELTA = resolved, no longer accepting applications
- EN_TRAMITACION = under administrative processing
- REVISAR = needs review before publishing as open
*/

-- Update status constraint
ALTER TABLE public.aid_programs DROP CONSTRAINT IF EXISTS aid_programs_status_check;
ALTER TABLE public.aid_programs ADD CONSTRAINT aid_programs_status_check
  CHECK (status IN (
    'abierta','proxima','cerrada','permanente','suspendida','vigente',
    'en_tramitacion','resuelta','marco_estatal','revisar'
  ));

-- Add external_id column for the custom IDs from the source file (ES-PEV26-ACC-EDIFICIOS etc.)
ALTER TABLE public.aid_programs ADD COLUMN IF NOT EXISTS external_id text;

-- Add aid_type column for MARCO_NORMATIVO / CONVOCATORIA / PROGRAMA / BENEFICIO_FISCAL
ALTER TABLE public.aid_programs ADD COLUMN IF NOT EXISTS aid_type text;

-- Add verification_date column (separate from last_verified_at to match source format)
-- last_verified_at already exists, we'll reuse it.
