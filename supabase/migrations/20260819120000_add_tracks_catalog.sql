-- TRACKS TABLE (Explore/Faz 2: curated 4-stem tracks, browsable by category)
CREATE TABLE IF NOT EXISTS tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(60) NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('nature', 'acoustic', 'instrumental', 'lofi')),
    mode VARCHAR(10) NOT NULL CHECK (mode IN ('focus', 'relax')),
    default_axis_values JSONB NOT NULL,
    stem_ids UUID[] NOT NULL,
    duration_seconds NUMERIC(6, 2) NOT NULL,
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TRACK_FAVORITES TABLE (favoriting a track's default mix, distinct from
-- presets.is_favorite which covers a user's own saved custom tunes)
CREATE TABLE IF NOT EXISTS track_favorites (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, track_id)
);

-- PRESETS: which track a saved custom tune was derived from (NULL for a
-- from-scratch pad session, once that exists)
ALTER TABLE presets ADD COLUMN IF NOT EXISTS track_id UUID REFERENCES tracks(id);

-- PRESET_PLAYS: a play now logs against a track's default mix OR a saved
-- preset, not always a preset — relax the old NOT NULL and require exactly
-- one of the two.
ALTER TABLE preset_plays ALTER COLUMN preset_id DROP NOT NULL;
ALTER TABLE preset_plays ADD COLUMN IF NOT EXISTS track_id UUID REFERENCES tracks(id) ON DELETE CASCADE;
ALTER TABLE preset_plays DROP CONSTRAINT IF EXISTS preset_plays_one_source_check;
ALTER TABLE preset_plays ADD CONSTRAINT preset_plays_one_source_check CHECK ((preset_id IS NULL) <> (track_id IS NULL));

-- ROW LEVEL SECURITY
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tracks_public_read ON tracks;
CREATE POLICY tracks_public_read ON tracks FOR SELECT USING (true);

ALTER TABLE track_favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS track_favorites_owner_select ON track_favorites;
CREATE POLICY track_favorites_owner_select ON track_favorites FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS track_favorites_owner_insert ON track_favorites;
CREATE POLICY track_favorites_owner_insert ON track_favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS track_favorites_owner_delete ON track_favorites;
CREATE POLICY track_favorites_owner_delete ON track_favorites FOR DELETE USING (auth.uid() = user_id);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_tracks_category_sort ON tracks(category, sort_order);
CREATE INDEX IF NOT EXISTS idx_tracks_mode ON tracks(mode);
CREATE INDEX IF NOT EXISTS idx_track_favorites_user ON track_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_preset_plays_track_id ON preset_plays(track_id);
CREATE INDEX IF NOT EXISTS idx_presets_track_id ON presets(track_id);
