/*
# Add document_type and requirement_type columns

1. Changes
- Add `document_type` column to `documents` table: classifies each document as
  'obligatorio', 'puede_ser_necesario', or 'recomendado'. Defaults to 'obligatorio'
  to preserve existing behavior.
- Add `requirement_type` column to `requirements` table: classifies each requirement
  as 'obligatorio', 'puede_ser_necesario', or 'recomendado'. Defaults to 'obligatorio'.
- Backfill existing rows to 'obligatorio' so current data stays consistent.

2. Security
- No RLS policy changes. Existing policies remain in effect.

3. Notes
- Columns are nullable-safe with a default, so no existing queries break.
- The frontend will use these columns to visually distinguish document/requirement
  categories in the aid detail page.
*/

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'document_type'
  ) THEN
    ALTER TABLE documents ADD COLUMN document_type text NOT NULL DEFAULT 'obligatorio';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'requirements' AND column_name = 'requirement_type'
  ) THEN
    ALTER TABLE requirements ADD COLUMN requirement_type text NOT NULL DEFAULT 'obligatorio';
  END IF;
END $$;
