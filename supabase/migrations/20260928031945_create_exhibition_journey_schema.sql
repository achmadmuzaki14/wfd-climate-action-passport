/*
# Create Exhibition Journey Schema

## Overview
This migration creates the database schema for an interactive 5-station exhibition experience.
Participants progress through 5 stations sequentially: Panel, Let's Read, VR, Forest Product, Photo Story.
Each station requires facilitator approval (via code entry or QR scan) to complete.

## New Tables

### 1. participants
- `id` (uuid, primary key) — unique participant identifier
- `display_name` (text) — optional name entered at welcome
- `created_at` (timestamptz) — when the participant started
- `completed_at` (timestamptz) — when all 5 stations are done (null until complete)

### 2. station_progress
- `id` (uuid, primary key)
- `participant_id` (uuid, foreign key to participants) — who this progress belongs to
- `station_slug` (text) — one of: 'panel', 'lets_read', 'vr', 'forest_product', 'photo_story'
- `status` (text) — one of: 'not_started', 'in_progress', 'submitted', 'approved'
- `answers` (jsonb) — participant's question answers (for forest_product, photo_story)
- `submitted_at` (timestamptz) — when answers were submitted for review
- `approved_at` (timestamptz) — when facilitator approved
- `created_at` (timestamptz)
- Unique constraint on (participant_id, station_slug) — one row per station per participant

### 3. facilitator_codes
- `id` (uuid, primary key)
- `code` (text, not null) — the actual code string (e.g., 'PANEL-2026', 'WFD-APPROVE')
- `code_type` (text) — 'panel' for panel station, 'wfd' for general WFD approval, 'vr' for VR station
- `is_active` (boolean, default true)
- `created_at` (timestamptz)

## Security
- RLS enabled on all tables.
- This is a no-auth app (no sign-in screen) — all policies use `TO anon, authenticated` with `USING (true)` / `WITH CHECK (true)` because the data is intentionally public/shared across exhibition participants and facilitators.
- facilitator_codes table: SELECT only (codes are read-only from the client; inserts/updates are done via migrations/SQL).

## Seed Data
- Inserts default facilitator codes: PANEL-2026 (panel), WFD-APPROVE (wfd), VR-SCAN-2026 (vr)
*/

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_participants" ON participants;
CREATE POLICY "anon_select_participants" ON participants FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_participants" ON participants;
CREATE POLICY "anon_insert_participants" ON participants FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_participants" ON participants;
CREATE POLICY "anon_update_participants" ON participants FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_participants" ON participants;
CREATE POLICY "anon_delete_participants" ON participants FOR DELETE
  TO anon, authenticated USING (true);

-- Station progress table
CREATE TABLE IF NOT EXISTS station_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  station_slug text NOT NULL,
  status text NOT NULL DEFAULT 'not_started',
  answers jsonb,
  submitted_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(participant_id, station_slug)
);

ALTER TABLE station_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_station_progress" ON station_progress;
CREATE POLICY "anon_select_station_progress" ON station_progress FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_station_progress" ON station_progress;
CREATE POLICY "anon_insert_station_progress" ON station_progress FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_station_progress" ON station_progress;
CREATE POLICY "anon_update_station_progress" ON station_progress FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_station_progress" ON station_progress;
CREATE POLICY "anon_delete_station_progress" ON station_progress FOR DELETE
  TO anon, authenticated USING (true);

-- Facilitator codes table
CREATE TABLE IF NOT EXISTS facilitator_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  code_type text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE facilitator_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_facilitator_codes" ON facilitator_codes;
CREATE POLICY "anon_select_facilitator_codes" ON facilitator_codes FOR SELECT
  TO anon, authenticated USING (true);

-- Seed default facilitator codes
INSERT INTO facilitator_codes (code, code_type, is_active) VALUES
  ('PANEL-2026', 'panel', true),
  ('WFD-APPROVE', 'wfd', true),
  ('VR-SCAN-2026', 'vr', true)
ON CONFLICT DO NOTHING;

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_station_progress_participant ON station_progress(participant_id);
CREATE INDEX IF NOT EXISTS idx_facilitator_codes_type ON facilitator_codes(code_type) WHERE is_active = true;
