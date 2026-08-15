-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    default_mode VARCHAR(10) CHECK (default_mode IN ('focus', 'relax')),
    onboarding_completed_at TIMESTAMPTZ,
    onboarding_answers JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- STEMS TABLE
CREATE TABLE IF NOT EXISTS stems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    layer VARCHAR(20) NOT NULL CHECK (layer IN ('rhythm', 'pad', 'melody', 'brightness')),
    storage_path TEXT NOT NULL UNIQUE,
    label TEXT,
    duration_seconds NUMERIC(6, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PRESETS TABLE
CREATE TABLE IF NOT EXISTS presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    mode VARCHAR(10) NOT NULL CHECK (mode IN ('focus', 'relax')),
    axis_values JSONB NOT NULL,
    stem_ids UUID[] NOT NULL,
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FEATURED_PRESETS TABLE
CREATE TABLE IF NOT EXISTS featured_presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    mode VARCHAR(10) NOT NULL CHECK (mode IN ('focus', 'relax')),
    axis_values JSONB NOT NULL,
    stem_ids UUID[] NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ENTITLEMENTS TABLE
CREATE TABLE IF NOT EXISTS entitlements (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    revenuecat_app_user_id TEXT NOT NULL,
    product_id TEXT,
    expires_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PRESET_PLAYS TABLE
CREATE TABLE IF NOT EXISTS preset_plays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    preset_id UUID NOT NULL REFERENCES presets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    duration_seconds NUMERIC(6, 2) NOT NULL,
    played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TRIGGERS
CREATE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER entitlements_set_updated_at
    BEFORE UPDATE ON entitlements
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_owner_select ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_owner_update ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

ALTER TABLE stems ENABLE ROW LEVEL SECURITY;
CREATE POLICY stems_public_read ON stems FOR SELECT USING (true);

ALTER TABLE presets ENABLE ROW LEVEL SECURITY;
CREATE POLICY presets_owner_select ON presets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY presets_owner_insert ON presets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY presets_owner_update ON presets FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY presets_owner_delete ON presets FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE featured_presets ENABLE ROW LEVEL SECURITY;
CREATE POLICY featured_presets_public_read ON featured_presets FOR SELECT USING (true);

ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;
CREATE POLICY entitlements_owner_read ON entitlements FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE preset_plays ENABLE ROW LEVEL SECURITY;
CREATE POLICY preset_plays_owner_select ON preset_plays FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY preset_plays_owner_insert ON preset_plays FOR INSERT WITH CHECK (auth.uid() = user_id);

-- STORAGE
INSERT INTO storage.buckets (id, name, public)
VALUES ('stems', 'stems', true)
ON CONFLICT (id) DO NOTHING;

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_presets_user_id ON presets(user_id);
CREATE INDEX IF NOT EXISTS idx_presets_user_created ON presets(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_presets_user_favorite ON presets(user_id) WHERE is_favorite = TRUE;
CREATE INDEX IF NOT EXISTS idx_presets_user_mode ON presets(user_id, mode);
CREATE INDEX IF NOT EXISTS idx_featured_presets_mode ON featured_presets(mode, sort_order);
CREATE INDEX IF NOT EXISTS idx_stems_layer ON stems(layer);
CREATE INDEX IF NOT EXISTS idx_preset_plays_user_played ON preset_plays(user_id, played_at DESC);
CREATE INDEX IF NOT EXISTS idx_preset_plays_preset_id ON preset_plays(preset_id);
