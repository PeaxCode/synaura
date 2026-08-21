-- The melody layer was the last one still pointing at a raw .mp3 (see
-- 20260821020000's note — rhythm/pad/brightness already moved off .mp3).
-- react-native-audio-api's native iOS decoder needs FFmpeg linked in to
-- decode MP3, and enabling that hits an unresolved linker error in this
-- project's local build (DISABLE_AUDIOAPI_FFMPEG stays set in ios/Podfile
-- as a result). MiniAudio, the always-available fallback decoder, handles
-- AAC/.m4a natively — so melody moves to .m4a too, matching the other 3
-- layers and dropping the FFmpeg dependency entirely instead of fighting
-- the linker. Re-encoded from the same source files (tools/audio/downloads/)
-- at 192kbps AAC — same audio, smaller files, no format regression.
UPDATE stems SET storage_path = 'tracks/steady-focus/melody.m4a' WHERE storage_path = 'tracks/steady-focus/melody.mp3';
UPDATE stems SET storage_path = 'tracks/lofi-study/melody.m4a' WHERE storage_path = 'tracks/lofi-study/melody.mp3';
UPDATE stems SET storage_path = 'tracks/deep-sleep/melody.m4a' WHERE storage_path = 'tracks/deep-sleep/melody.mp3';
UPDATE stems SET storage_path = 'tracks/gentle-strings/melody.m4a' WHERE storage_path = 'tracks/gentle-strings/melody.mp3';
