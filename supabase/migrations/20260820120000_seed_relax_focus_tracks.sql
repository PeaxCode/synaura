-- SEED: 4 more test-content tracks (tools/audio/generate_stems.py placeholder
-- content), filling in the mode each existing category was missing so every
-- category has both a focus and a relax track — Explore groups by mode now,
-- not category (see src/components/TrackGrid.tsx).

-- STEMS
INSERT INTO stems (layer, storage_path, label, duration_seconds) VALUES
    ('rhythm', 'tracks/morning-birdsong/rhythm.m4a', 'Morning Birdsong — Rhythm', 30.0),
    ('pad', 'tracks/morning-birdsong/pad.m4a', 'Morning Birdsong — Pad', 30.0),
    ('melody', 'tracks/morning-birdsong/melody.m4a', 'Morning Birdsong — Melody', 30.0),
    ('brightness', 'tracks/morning-birdsong/brightness.m4a', 'Morning Birdsong — Brightness', 30.0),
    ('rhythm', 'tracks/evening-strings/rhythm.m4a', 'Evening Strings — Rhythm', 30.0),
    ('pad', 'tracks/evening-strings/pad.m4a', 'Evening Strings — Pad', 30.0),
    ('melody', 'tracks/evening-strings/melody.m4a', 'Evening Strings — Melody', 30.0),
    ('brightness', 'tracks/evening-strings/brightness.m4a', 'Evening Strings — Brightness', 30.0),
    ('rhythm', 'tracks/steady-current/rhythm.m4a', 'Steady Current — Rhythm', 30.0),
    ('pad', 'tracks/steady-current/pad.m4a', 'Steady Current — Pad', 30.0),
    ('melody', 'tracks/steady-current/melody.m4a', 'Steady Current — Melody', 30.0),
    ('brightness', 'tracks/steady-current/brightness.m4a', 'Steady Current — Brightness', 30.0),
    ('rhythm', 'tracks/slow-tape/rhythm.m4a', 'Slow Tape — Rhythm', 30.0),
    ('pad', 'tracks/slow-tape/pad.m4a', 'Slow Tape — Pad', 30.0),
    ('melody', 'tracks/slow-tape/melody.m4a', 'Slow Tape — Melody', 30.0),
    ('brightness', 'tracks/slow-tape/brightness.m4a', 'Slow Tape — Brightness', 30.0)
ON CONFLICT (storage_path) DO NOTHING;

-- TRACKS
INSERT INTO tracks (slug, name, category, mode, default_axis_values, stem_ids, duration_seconds, is_premium, sort_order)
SELECT
    'morning-birdsong', 'Morning Birdsong', 'nature', 'focus',
    '{"x": 0.62, "y": 0.38}'::jsonb,
    ARRAY[
        (SELECT id FROM stems WHERE storage_path = 'tracks/morning-birdsong/rhythm.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/morning-birdsong/pad.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/morning-birdsong/melody.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/morning-birdsong/brightness.m4a')
    ],
    30.0, FALSE, 6
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tracks (slug, name, category, mode, default_axis_values, stem_ids, duration_seconds, is_premium, sort_order)
SELECT
    'evening-strings', 'Evening Strings', 'acoustic', 'relax',
    '{"x": 0.4, "y": 0.6}'::jsonb,
    ARRAY[
        (SELECT id FROM stems WHERE storage_path = 'tracks/evening-strings/rhythm.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/evening-strings/pad.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/evening-strings/melody.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/evening-strings/brightness.m4a')
    ],
    30.0, FALSE, 7
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tracks (slug, name, category, mode, default_axis_values, stem_ids, duration_seconds, is_premium, sort_order)
SELECT
    'steady-current', 'Steady Current', 'instrumental', 'focus',
    '{"x": 0.58, "y": 0.46}'::jsonb,
    ARRAY[
        (SELECT id FROM stems WHERE storage_path = 'tracks/steady-current/rhythm.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/steady-current/pad.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/steady-current/melody.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/steady-current/brightness.m4a')
    ],
    30.0, FALSE, 8
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tracks (slug, name, category, mode, default_axis_values, stem_ids, duration_seconds, is_premium, sort_order)
SELECT
    'slow-tape', 'Slow Tape', 'lofi', 'relax',
    '{"x": 0.46, "y": 0.62}'::jsonb,
    ARRAY[
        (SELECT id FROM stems WHERE storage_path = 'tracks/slow-tape/rhythm.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/slow-tape/pad.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/slow-tape/melody.m4a'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/slow-tape/brightness.m4a')
    ],
    30.0, FALSE, 9
ON CONFLICT (slug) DO NOTHING;
