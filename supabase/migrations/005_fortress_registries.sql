-- Migration 005: Fortress canonical truth registries
-- Supports Reliability Spec Sections 9, 18, 19, 20

-- ==========================================================================
-- Table: asset_registry
-- Canonical record of every brand asset (logos, favicons, fonts, etc.)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS asset_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_purpose text NOT NULL,
  canonical_path text NOT NULL,
  expected_sha256 text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'deprecated')),
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE (asset_purpose, status) -- only one active asset per purpose
);

CREATE INDEX IF NOT EXISTS idx_asset_registry_purpose ON asset_registry(asset_purpose);
CREATE INDEX IF NOT EXISTS idx_asset_registry_status ON asset_registry(status);

-- ==========================================================================
-- Table: route_manifest
-- Canonical record of every route and its expected DOM signature
-- ==========================================================================
CREATE TABLE IF NOT EXISTS route_manifest (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_path text NOT NULL UNIQUE,
  canonical_url text NOT NULL,
  expected_shell_signature text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  updated_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_route_manifest_path ON route_manifest(route_path);

-- ==========================================================================
-- Table: forbidden_content
-- Canonical list of patterns that must never appear in deployed code
-- ==========================================================================
CREATE TABLE IF NOT EXISTS forbidden_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_pattern text NOT NULL UNIQUE,
  category text NOT NULL CHECK (category IN ('prompt_leak', 'placeholder', 'internal_note')),
  created_at timestamptz NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forbidden_content_category ON forbidden_content(category);

-- ==========================================================================
-- Row Level Security
-- ==========================================================================
ALTER TABLE asset_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_manifest ENABLE ROW LEVEL SECURITY;
ALTER TABLE forbidden_content ENABLE ROW LEVEL SECURITY;

-- Service role (used by our Workers) gets full read access
CREATE POLICY "service_read_asset_registry" ON asset_registry
  FOR SELECT TO service_role USING (true);

CREATE POLICY "service_read_route_manifest" ON route_manifest
  FOR SELECT TO service_role USING (true);

CREATE POLICY "service_read_forbidden_content" ON forbidden_content
  FOR SELECT TO service_role USING (true);

-- Service role can also insert/update for management
CREATE POLICY "service_write_asset_registry" ON asset_registry
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_write_route_manifest" ON route_manifest
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_write_forbidden_content" ON forbidden_content
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==========================================================================
-- Seed data: default forbidden content patterns
-- ==========================================================================
INSERT INTO forbidden_content (keyword_pattern, category) VALUES
  ('TODO:', 'placeholder'),
  ('FIXME:', 'placeholder'),
  ('PLACEHOLDER:', 'placeholder'),
  ('Here is the code:', 'prompt_leak'),
  ('Certainly!', 'prompt_leak'),
  ('As an AI', 'prompt_leak'),
  ('I''d be happy to', 'prompt_leak'),
  ('Sure thing', 'prompt_leak'),
  ('INTERNAL NOTE:', 'internal_note'),
  ('DO NOT DEPLOY', 'internal_note')
ON CONFLICT (keyword_pattern) DO NOTHING;
