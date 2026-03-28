-- Migration: Allow ENTERPRISE tier in users table
-- Drop existing check constraint on tier column and add one that includes ENTERPRISE
DO $$
BEGIN
  -- Try to drop any existing check constraint on tier
  EXECUTE (
    SELECT 'ALTER TABLE users DROP CONSTRAINT ' || conname
    FROM pg_constraint
    WHERE conrelid = 'users'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%tier%'
    LIMIT 1
  );
EXCEPTION WHEN OTHERS THEN
  NULL; -- No constraint exists, that's fine
END $$;

-- Add the new constraint allowing ENTERPRISE
ALTER TABLE users ADD CONSTRAINT users_tier_check
  CHECK (tier IN ('FREE', 'PRO', 'ENTERPRISE'));
