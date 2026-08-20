-- Presets didn't record the session length chosen in start-session's
-- duration step (5/15/30/45/60 min or no limit) — every saved tune looked
-- the same regardless of how long the session was meant to run, and
-- replaying one always fell back to "no limit". NULL = no limit, matching
-- `playbackStore.setSessionMinutes(null)`.
ALTER TABLE presets ADD COLUMN IF NOT EXISTS duration_minutes INT
    CHECK (duration_minutes IS NULL OR duration_minutes > 0);
