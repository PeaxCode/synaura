-- Correction to 20260821020000 and 20260821030000: both assumed .m4a was the
-- FFmpeg-free format and .mp3 needed FFmpeg — backwards. react-native-audio-api
-- only routes MP4/M4A/AAC through FFmpeg (see needsFFmpeg() in
-- AudioDecoding.h); MP3 decodes natively via MiniAudio's bundled dr_mp3, no
-- FFmpeg required. So melody.mp3 was always fine on its own — it was the
-- rhythm/pad/brightness *.m4a "silence loop" that needed the FFmpeg decoder
-- this project's local build has disabled (DISABLE_AUDIOAPI_FFMPEG, see
-- ios/Podfile — enabling it hits an unresolved native linker error). Since
-- decodeTrackBuffers Promise.all()s all 4 layers together, any one FFmpeg-only
-- layer failing broke session start for every track.
--
-- Fix: revert melody to .mp3 (MiniAudio-native, no format change needed) and
-- move the silence loop to uncompressed .wav (RIFF/WAVE — MiniAudio-native,
-- no FFmpeg) instead of .m4a. WAV is ~76x larger than the AAC loop but it's a
-- 2-second silent buffer either way, so the absolute bytes are still trivial.
UPDATE stems SET storage_path = 'tracks/steady-focus/melody.mp3' WHERE storage_path = 'tracks/steady-focus/melody.m4a';
UPDATE stems SET storage_path = 'tracks/lofi-study/melody.mp3' WHERE storage_path = 'tracks/lofi-study/melody.m4a';
UPDATE stems SET storage_path = 'tracks/deep-sleep/melody.mp3' WHERE storage_path = 'tracks/deep-sleep/melody.m4a';
UPDATE stems SET storage_path = 'tracks/gentle-strings/melody.mp3' WHERE storage_path = 'tracks/gentle-strings/melody.m4a';

UPDATE stems SET storage_path = 'tracks/steady-focus/rhythm.wav' WHERE storage_path = 'tracks/steady-focus/rhythm.m4a';
UPDATE stems SET storage_path = 'tracks/steady-focus/pad.wav' WHERE storage_path = 'tracks/steady-focus/pad.m4a';
UPDATE stems SET storage_path = 'tracks/steady-focus/brightness.wav' WHERE storage_path = 'tracks/steady-focus/brightness.m4a';

UPDATE stems SET storage_path = 'tracks/lofi-study/rhythm.wav' WHERE storage_path = 'tracks/lofi-study/rhythm.m4a';
UPDATE stems SET storage_path = 'tracks/lofi-study/pad.wav' WHERE storage_path = 'tracks/lofi-study/pad.m4a';
UPDATE stems SET storage_path = 'tracks/lofi-study/brightness.wav' WHERE storage_path = 'tracks/lofi-study/brightness.m4a';

UPDATE stems SET storage_path = 'tracks/deep-sleep/rhythm.wav' WHERE storage_path = 'tracks/deep-sleep/rhythm.m4a';
UPDATE stems SET storage_path = 'tracks/deep-sleep/pad.wav' WHERE storage_path = 'tracks/deep-sleep/pad.m4a';
UPDATE stems SET storage_path = 'tracks/deep-sleep/brightness.wav' WHERE storage_path = 'tracks/deep-sleep/brightness.m4a';

UPDATE stems SET storage_path = 'tracks/gentle-strings/rhythm.wav' WHERE storage_path = 'tracks/gentle-strings/rhythm.m4a';
UPDATE stems SET storage_path = 'tracks/gentle-strings/pad.wav' WHERE storage_path = 'tracks/gentle-strings/pad.m4a';
UPDATE stems SET storage_path = 'tracks/gentle-strings/brightness.wav' WHERE storage_path = 'tracks/gentle-strings/brightness.m4a';
