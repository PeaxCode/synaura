-- The 4 real tracks added in the previous migration had the same full song
-- uploaded to all 4 stem slots — every play/preview/download fetched and
-- decoded 4 copies of the same (up to 16MB) file in parallel, which was slow
-- enough to time out and leave the UI stuck in "Loading…" (decodeTrackBuffers
-- rejecting with no catch anywhere upstream — see player.tsx/useTrackPreview
-- fixes in the same commit). Only `melody` keeps the real song now; the other
-- 3 layers point at a shared 2-second silent loop, so the pad still works as
-- a continuous intensity gesture on the melody layer (mixForAxis computes its
-- gain independently of what the other layers contain) at 1/4 the bandwidth.
UPDATE stems SET storage_path = 'tracks/steady-focus/rhythm.m4a' WHERE storage_path = 'tracks/steady-focus/rhythm.mp3';
UPDATE stems SET storage_path = 'tracks/steady-focus/pad.m4a' WHERE storage_path = 'tracks/steady-focus/pad.mp3';
UPDATE stems SET storage_path = 'tracks/steady-focus/brightness.m4a' WHERE storage_path = 'tracks/steady-focus/brightness.mp3';

UPDATE stems SET storage_path = 'tracks/lofi-study/rhythm.m4a' WHERE storage_path = 'tracks/lofi-study/rhythm.mp3';
UPDATE stems SET storage_path = 'tracks/lofi-study/pad.m4a' WHERE storage_path = 'tracks/lofi-study/pad.mp3';
UPDATE stems SET storage_path = 'tracks/lofi-study/brightness.m4a' WHERE storage_path = 'tracks/lofi-study/brightness.mp3';

UPDATE stems SET storage_path = 'tracks/deep-sleep/rhythm.m4a' WHERE storage_path = 'tracks/deep-sleep/rhythm.mp3';
UPDATE stems SET storage_path = 'tracks/deep-sleep/pad.m4a' WHERE storage_path = 'tracks/deep-sleep/pad.mp3';
UPDATE stems SET storage_path = 'tracks/deep-sleep/brightness.m4a' WHERE storage_path = 'tracks/deep-sleep/brightness.mp3';

UPDATE stems SET storage_path = 'tracks/gentle-strings/rhythm.m4a' WHERE storage_path = 'tracks/gentle-strings/rhythm.mp3';
UPDATE stems SET storage_path = 'tracks/gentle-strings/pad.m4a' WHERE storage_path = 'tracks/gentle-strings/pad.mp3';
UPDATE stems SET storage_path = 'tracks/gentle-strings/brightness.m4a' WHERE storage_path = 'tracks/gentle-strings/brightness.mp3';
