-- Faz 2's procedurally-generated placeholder catalog (tools/audio/generate_stems.py,
-- 10 tracks) is replaced with 4 real, licensed tracks (Pixabay Content License —
-- free for commercial use, no attribution required) as a closer-to-real-content
-- test ahead of the actual EachLabs-generated stems. These are single mixed
-- files, not 4 separated layers, so the same source file is uploaded to all 4
-- stem slots per track — the 4-axis pad still works, but for these 4 tracks it
-- behaves as an overall intensity gesture (every layer carries identical audio)
-- rather than a textural blend. Acceptable for test content; real stems restore
-- true blending.

-- Clear dependent rows first (presets.track_id has no ON DELETE action, so old
-- tracks can't be dropped while anything still points at them). This project
-- has no real users yet — every presets/preset_plays/track_favorites row up to
-- this point is dev/test data from this session.
DELETE FROM preset_plays;
DELETE FROM track_favorites;
DELETE FROM presets;
DELETE FROM tracks;
DELETE FROM stems WHERE storage_path LIKE 'tracks/%';

-- STEMS — same source file uploaded to all 4 layer paths per track (see note above).
INSERT INTO stems (layer, storage_path, label, duration_seconds) VALUES
    ('rhythm', 'tracks/steady-focus/rhythm.mp3', 'Steady Focus — Rhythm', 502.0),
    ('pad', 'tracks/steady-focus/pad.mp3', 'Steady Focus — Pad', 502.0),
    ('melody', 'tracks/steady-focus/melody.mp3', 'Steady Focus — Melody', 502.0),
    ('brightness', 'tracks/steady-focus/brightness.mp3', 'Steady Focus — Brightness', 502.0),
    ('rhythm', 'tracks/lofi-study/rhythm.mp3', 'Lofi Study — Rhythm', 147.0),
    ('pad', 'tracks/lofi-study/pad.mp3', 'Lofi Study — Pad', 147.0),
    ('melody', 'tracks/lofi-study/melody.mp3', 'Lofi Study — Melody', 147.0),
    ('brightness', 'tracks/lofi-study/brightness.mp3', 'Lofi Study — Brightness', 147.0),
    ('rhythm', 'tracks/deep-sleep/rhythm.mp3', 'Deep Sleep — Rhythm', 352.0),
    ('pad', 'tracks/deep-sleep/pad.mp3', 'Deep Sleep — Pad', 352.0),
    ('melody', 'tracks/deep-sleep/melody.mp3', 'Deep Sleep — Melody', 352.0),
    ('brightness', 'tracks/deep-sleep/brightness.mp3', 'Deep Sleep — Brightness', 352.0),
    ('rhythm', 'tracks/gentle-strings/rhythm.mp3', 'Gentle Strings — Rhythm', 50.0),
    ('pad', 'tracks/gentle-strings/pad.mp3', 'Gentle Strings — Pad', 50.0),
    ('melody', 'tracks/gentle-strings/melody.mp3', 'Gentle Strings — Melody', 50.0),
    ('brightness', 'tracks/gentle-strings/brightness.mp3', 'Gentle Strings — Brightness', 50.0)
ON CONFLICT (storage_path) DO NOTHING;

-- TRACKS
INSERT INTO tracks (slug, name, category, mode, default_axis_values, stem_ids, duration_seconds, is_premium, sort_order)
SELECT
    'steady-focus', 'Steady Focus', 'instrumental', 'focus',
    '{"x": 0.58, "y": 0.42}'::jsonb,
    ARRAY[
        (SELECT id FROM stems WHERE storage_path = 'tracks/steady-focus/rhythm.mp3'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/steady-focus/pad.mp3'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/steady-focus/melody.mp3'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/steady-focus/brightness.mp3')
    ],
    502.0, FALSE, 0
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tracks (slug, name, category, mode, default_axis_values, stem_ids, duration_seconds, is_premium, sort_order)
SELECT
    'lofi-study', 'Lofi Study', 'lofi', 'focus',
    '{"x": 0.62, "y": 0.48}'::jsonb,
    ARRAY[
        (SELECT id FROM stems WHERE storage_path = 'tracks/lofi-study/rhythm.mp3'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/lofi-study/pad.mp3'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/lofi-study/melody.mp3'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/lofi-study/brightness.mp3')
    ],
    147.0, FALSE, 1
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tracks (slug, name, category, mode, default_axis_values, stem_ids, duration_seconds, is_premium, sort_order)
SELECT
    'deep-sleep', 'Deep Sleep', 'instrumental', 'relax',
    '{"x": 0.45, "y": 0.65}'::jsonb,
    ARRAY[
        (SELECT id FROM stems WHERE storage_path = 'tracks/deep-sleep/rhythm.mp3'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/deep-sleep/pad.mp3'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/deep-sleep/melody.mp3'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/deep-sleep/brightness.mp3')
    ],
    352.0, FALSE, 2
ON CONFLICT (slug) DO NOTHING;

INSERT INTO tracks (slug, name, category, mode, default_axis_values, stem_ids, duration_seconds, is_premium, sort_order)
SELECT
    'gentle-strings', 'Gentle Strings', 'acoustic', 'relax',
    '{"x": 0.42, "y": 0.6}'::jsonb,
    ARRAY[
        (SELECT id FROM stems WHERE storage_path = 'tracks/gentle-strings/rhythm.mp3'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/gentle-strings/pad.mp3'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/gentle-strings/melody.mp3'),
        (SELECT id FROM stems WHERE storage_path = 'tracks/gentle-strings/brightness.mp3')
    ],
    50.0, FALSE, 3
ON CONFLICT (slug) DO NOTHING;
