import { supabase } from '@/src/data/client';
import { AxisValues, Mode, STEM_LAYERS, Track } from '@/src/data/tracks';

export interface Preset {
    id: string;
    name: string | null;
    mode: Mode;
    axisValues: AxisValues;
    trackId: string | null;
    durationMinutes: number | null;
    isFavorite: boolean;
    createdAt: string;
}

export interface RecentPlay {
    playedAt: string;
    durationSeconds: number;
    name: string | null;
    mode: Mode;
    trackId: string | null;
    presetId: string | null;
}

interface PresetRow {
    id: string;
    name: string | null;
    mode: Mode;
    axis_values: AxisValues;
    track_id: string | null;
    duration_minutes: number | null;
    is_favorite: boolean;
    created_at: string;
}

const PRESET_COLUMNS = 'id, name, mode, axis_values, track_id, duration_minutes, is_favorite, created_at';

function presetFromRow(row: PresetRow): Preset {
    return {
        id: row.id,
        name: row.name,
        mode: row.mode,
        axisValues: row.axis_values,
        trackId: row.track_id,
        durationMinutes: row.duration_minutes,
        isFavorite: row.is_favorite,
        createdAt: row.created_at,
    };
}

// Fetches the user's custom saved presets, putting favorites at the top.
export async function fetchPresets(userId: string): Promise<Preset[]> {
    const { data, error } = await supabase
        .from('presets')
        .select(PRESET_COLUMNS)
        .eq('user_id', userId)
        .order('is_favorite', { ascending: false })
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as PresetRow[]).map(presetFromRow);
}

// Saves the current session's axis mix and duration as a replayable preset.
export async function savePreset(userId: string, track: Track, axisValues: AxisValues, durationMinutes: number | null): Promise<Preset> {
    const { data, error } = await supabase
        .from('presets')
        .insert({
            user_id: userId,
            name: track.name,
            mode: track.mode,
            axis_values: axisValues,
            stem_ids: STEM_LAYERS.map((layer) => track.stemIds[layer]),
            track_id: track.id,
            duration_minutes: durationMinutes,
        })
        .select(PRESET_COLUMNS)
        .single();
    if (error) throw error;
    return presetFromRow(data as PresetRow);
}

// Fetches IDs of tracks the user has favorited.
export async function fetchFavoriteTrackIds(userId: string): Promise<Set<string>> {
    const { data, error } = await supabase.from('track_favorites').select('track_id').eq('user_id', userId);
    if (error) throw error;
    return new Set((data ?? []).map((row) => row.track_id as string));
}

// Checks if the user has already saved a preset for this specific track.
export async function findPresetByTrack(userId: string, trackId: string): Promise<Preset | null> {
    const { data, error } = await supabase
        .from('presets')
        .select(PRESET_COLUMNS)
        .eq('user_id', userId)
        .eq('track_id', trackId)
        .limit(1)
        .maybeSingle();
    if (error) throw error;
    return data ? presetFromRow(data as PresetRow) : null;
}

export async function deletePreset(presetId: string): Promise<void> {
    const { error } = await supabase.from('presets').delete().eq('id', presetId);
    if (error) throw error;
}

// Fetches a complete preset by ID so it can be replayed from Recent plays.
export async function fetchPresetById(presetId: string): Promise<Preset | null> {
    const { data, error } = await supabase
        .from('presets')
        .select(PRESET_COLUMNS)
        .eq('id', presetId)
        .maybeSingle();
    if (error) throw error;
    return data ? presetFromRow(data as PresetRow) : null;
}

export async function favoriteTrack(userId: string, trackId: string): Promise<void> {
    const { error } = await supabase.from('track_favorites').insert({ user_id: userId, track_id: trackId });
    if (error) throw error;
}

export async function unfavoriteTrack(userId: string, trackId: string): Promise<void> {
    const { error } = await supabase.from('track_favorites').delete().eq('user_id', userId).eq('track_id', trackId);
    if (error) throw error;
}

interface LogPresetPlayArgs {
    userId: string;
    trackId: string | null;
    presetId: string | null;
    durationSeconds: number;
}

// Logs a completed session, recording the duration against either a track or a preset.
export async function logPresetPlay({ userId, trackId, presetId, durationSeconds }: LogPresetPlayArgs): Promise<void> {
    const { error } = await supabase.from('preset_plays').insert({
        user_id: userId,
        track_id: presetId ? null : trackId,
        preset_id: presetId,
        duration_seconds: durationSeconds,
    });
    if (error) throw error;
}

interface RecentPlayRow {
    played_at: string;
    duration_seconds: number;
    track_id: string | null;
    preset_id: string | null;
    presets: { name: string | null; mode: Mode } | null;
    tracks: { name: string | null; mode: Mode } | null;
}

// Fetches recent plays, resolving whether the play was from a track or a preset.
export async function fetchRecentPlays(userId: string, limit: number): Promise<RecentPlay[]> {
    const { data, error } = await supabase
        .from('preset_plays')
        .select('played_at, duration_seconds, track_id, preset_id, presets(name, mode), tracks(name, mode)')
        .eq('user_id', userId)
        .order('played_at', { ascending: false })
        .limit(limit);
    if (error) throw error;

    return ((data ?? []) as unknown as RecentPlayRow[]).map((row) => {
        const source = row.presets ?? row.tracks;
        return {
            playedAt: row.played_at,
            durationSeconds: row.duration_seconds,
            name: source?.name ?? null,
            mode: source?.mode ?? 'focus',
            trackId: row.track_id,
            presetId: row.preset_id,
        };
    });
}
