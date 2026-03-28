-- Run this in Supabase SQL Editor to set up the required table and RPC.

CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_key TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  tier TEXT NOT NULL DEFAULT 'FREE' CHECK (tier IN ('FREE', 'PRO')),
  monthly_usage_count INT4 NOT NULL DEFAULT 0
);

-- Atomic increment function used by the auth middleware
CREATE OR REPLACE FUNCTION increment_usage(uid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users SET monthly_usage_count = monthly_usage_count + 1 WHERE user_id = uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
