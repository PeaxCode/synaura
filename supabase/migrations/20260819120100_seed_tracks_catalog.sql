-- SEED: test-content tracks catalog (tools/audio/generate_stems.py placeholder
-- content, Faz 2 dev/testing — swapped for real EachLabs stems later, same shape).

-- STEMS
INSERT INTO stems (layer, storage_path, label, duration_seconds) VALUES
    ('rhythm', 'tracks/rain-on-leaves/rhythm.m4a', 'Rain on Leaves — Rhythm', 30.0),
    ('pad', 'tracks/rain-on-leaves/pad.m4a', 'Rain on Leaves — Pad', 30.0),
    ('melody', 'tracks/rain-on-leaves/melody.m4a', 'Rain on Leaves — Melody', 30.0),
    ('brightness', 'tracks/rain-on-leaves/brightness.m4a', 'Rain on Leaves — Brightness', 30.0),
    ('rhythm', 'tracks/river-flow/rhythm.m4a', 'River Flow — Rhythm', 30.0),
    ('pad', 'tracks/river-flow/pad.m4a', 'River Flow — Pad', 30.0),
    ('melody', 'tracks/river-flow/melody.m4a', 'River Flow — Melody', 30.0),
    ('brightness', 'tracks/river-flow/brightness.m4a', 'River Flow — Brightness', 30.0),
    ('rhythm', 'tracks/night-forest/rhythm.m4a', 'Night Forest — Rhythm', 30.0),
    ('pad', 'tracks/night-forest/pad.m4a', 'Night Forest — Pad', 30.0),
    ('melody', 'tracks/night-forest/melody.m4a', 'Night Forest — Melody', 30.0),
    ('brightness', 'tracks/night-forest/brightness.m4a', 'Night Forest — Brightness', 30.0),
    ('rhythm', 'tracks/acoustic-dawn/rhythm.m4a', 'Acoustic Dawn — Rhythm', 30.0),
    ('pad', 'tracks/acoustic-dawn/pad.m4a', 'Acoustic Dawn — Pad', 30.0),
    ('melody', 'tracks/acoustic-dawn/melody.m4a', 'Acoustic Dawn — Melody', 30.0),
    ('brightness', 'tracks/acoustic-dawn/brightness.m4a', 'Acoustic Dawn — Brightness', 30.0),
    ('rhythm', 'tracks/deep-drift/rhythm.m4a', 'Deep Drift — Rhythm', 30.0),
    ('pad', 'tracks/deep-drift/pad.m4a', 'Deep Drift — Pad', 30.0),
    ('melody', 'tracks/deep-drift/melody.m4a', 'Deep Drift — Melody', 30.0),
    ('brightness', 'tracks/deep-drift/brightness.m4a', 'Deep Drift — Brightness', 30.0),
    ('rhythm', 'tracks/lofi-dust/rhythm.m4a', 'Lofi Dust — Rhythm', 30.0),
    ('pad', 'tracks/lofi-dust/pad.m4a', 'Lofi Dust — Pad', 30.0),
    ('melody', 'tracks/lofi-dust/melody.m4a', 'Lofi Dust — Melody', 30.0),
    ('brightness', 'tracks/lofi-dust/brightness.m4a', 'Lofi Dust — Brightness', 30.0)
ON CONFLICT (storage_path) DO NOTHING;

-- TRACKS
INSERT INTO tracks (slug, name, category, mode, default_axis_values, stem_ids, duration_seconds, is_premium, sort_order)
SELECT
    'rain-on-leaves', 'Rain on Leaves', 'nature', 'relax',
    '{"x": 0.42, "y": 0.62}'::jsonb,
    ARRAY[
        (SELECT id FROM stems WHERE storage_path = 'tracks/rain-on-leaves/rhythm.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/rain-on-leaves/pad.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/rain-on-leaves/melody.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/rain-on-leaves/brightness.m4a')
    ],
    30.0, FALSE, 0
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tracks (slug, name, category, mode, default_axis_values, stem_ids, duration_seconds, is_premium, sort_order)
SELECT
    'river-flow', 'River Flow', 'nature', 'relax',
    '{"x": 0.5, "y": 0.55}'::jsonb,
    ARRAY[
        (SELECT id FROM stems WHERE storage_path = 'tracks/river-flow/rhythm.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/river-flow/pad.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/river-flow/melody.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/river-flow/brightness.m4a')
    ],
    30.0, FALSE, 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tracks (slug, name, category, mode, default_axis_values, stem_ids, duration_seconds, is_premium, sort_order)
SELECT
    'night-forest', 'Night Forest', 'nature', 'relax',
    '{"x": 0.38, "y": 0.7}'::jsonb,
    ARRAY[
        (SELECT id FROM stems WHERE storage_path = 'tracks/night-forest/rhythm.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/night-forest/pad.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/night-forest/melody.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/night-forest/brightness.m4a')
    ],
    30.0, FALSE, 2
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tracks (slug, name, category, mode, default_axis_values, stem_ids, duration_seconds, is_premium, sort_order)
SELECT
    'acoustic-dawn', 'Acoustic Dawn', 'acoustic', 'focus',
    '{"x": 0.55, "y": 0.45}'::jsonb,
    ARRAY[
        (SELECT id FROM stems WHERE storage_path = 'tracks/acoustic-dawn/rhythm.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/acoustic-dawn/pad.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/acoustic-dawn/melody.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/acoustic-dawn/brightness.m4a')
    ],
    30.0, FALSE, 3
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tracks (slug, name, category, mode, default_axis_values, stem_ids, duration_seconds, is_premium, sort_order)
SELECT
    'deep-drift', 'Deep Drift', 'instrumental', 'relax',
    '{"x": 0.45, "y": 0.68}'::jsonb,
    ARRAY[
        (SELECT id FROM stems WHERE storage_path = 'tracks/deep-drift/rhythm.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/deep-drift/pad.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/deep-drift/melody.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/deep-drift/brightness.m4a')
    ],
    30.0, FALSE, 4
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tracks (slug, name, category, mode, default_axis_values, stem_ids, duration_seconds, is_premium, sort_order)
SELECT
    'lofi-dust', 'Lofi Dust', 'lofi', 'focus',
    '{"x": 0.62, "y": 0.5}'::jsonb,
    ARRAY[
        (SELECT id FROM stems WHERE storage_path = 'tracks/lofi-dust/rhythm.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/lofi-dust/pad.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/lofi-dust/melody.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/lofi-dust/brightness.m4a')
    ],
    30.0, FALSE, 5
ON CONFLICT (slug) DO NOTHING;
