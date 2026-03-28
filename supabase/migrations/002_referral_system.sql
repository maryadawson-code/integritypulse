-- Migration: Add referral system columns to users table
-- Run this against your Supabase project via the SQL editor or CLI.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES users(user_id),
  ADD COLUMN IF NOT EXISTS monthly_limit int4 NOT NULL DEFAULT 25;

-- Generate a referral code for existing users that don't have one
UPDATE users
SET referral_code = LOWER(SUBSTR(MD5(user_id::text || NOW()::text), 1, 8))
WHERE referral_code IS NULL;

-- Make referral_code NOT NULL going forward
ALTER TABLE users ALTER COLUMN referral_code SET NOT NULL;

-- Index for fast referral lookups
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
