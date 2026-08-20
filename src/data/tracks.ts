import { supabase } from '@/src/data/client';

export type StemLayer = 'rhythm' | 'pad' | 'melody' | 'brightness';
export type Mode = 'focus' | 'relax';
export type Category = 'nature' | 'acoustic' | 'instrumental' | 'lofi';

export interface AxisValues {
    x: number;
    y: number;
}

export interface Track {
    id: string;
    slug: string;
    name: string;
    category: Category;
    mode: Mode;
    defaultAxisValues: AxisValues;
    durationSeconds: number;
    isPremium: boolean;
    stemUrls: Record<StemLayer, string>;
    stemIds: Record<StemLayer, string>;
}

export const STEM_LAYERS: StemLayer[] = ['rhythm', 'pad', 'melody', 'brightness'];

export const CATEGORIES: { slug: Category; label: string }[] = [
    { slug: 'nature', label: 'Nature' },
    { slug: 'acoustic', label: 'Acoustic' },
    { slug: 'instrumental', label: 'Instrumental' },
    { slug: 'lofi', label: 'Lo-Fi' },
];


export const MODES: { slug: Mode; label: string }[] = [
    { slug: 'focus', label: 'Focus' },
    { slug: 'relax', label: 'Relax' },
];

interface TrackRow {
    id: string;
    slug: string;
    name: string;
    category: Category;
    mode: Mode;
    default_axis_values: AxisValues;
    stem_ids: string[];
    duration_seconds: number;
    is_premium: boolean;
}

interface StemRow {
    id: string;
    layer: StemLayer;
    storage_path: string;
}

const TRACK_COLUMNS = 'id, slug, name, category, mode, default_axis_values, stem_ids, duration_seconds, is_premium';

function stemPublicUrl(storagePath: string) {
    const { data } = supabase.storage.from('stems').getPublicUrl(storagePath);
    return data.publicUrl;
}

async function hydrateStemUrls(trackRows: TrackRow[]) {
    const stemIds = trackRows.flatMap((track) => track.stem_ids);
    const { data: stemRows, error } = await supabase.from('stems').select('id, layer, storage_path').in('id', stemIds);
    if (error) throw error;

    const stemsById = new Map((stemRows as StemRow[]).map((stem) => [stem.id, stem]));

    return trackRows.map((track) => {
        const stemUrls = {} as Record<StemLayer, string>;
        const stemIds = {} as Record<StemLayer, string>;
        for (const stemId of track.stem_ids) {
            const stem = stemsById.get(stemId);
            if (stem) {
                stemUrls[stem.layer] = stemPublicUrl(stem.storage_path);
                stemIds[stem.layer] = stemId;
            }
        }

        return {
            id: track.id,
            slug: track.slug,
            name: track.name,
            category: track.category,
            mode: track.mode,
            defaultAxisValues: track.default_axis_values,
            durationSeconds: track.duration_seconds,
            isPremium: track.is_premium,
            stemUrls,
            stemIds,
        };
    });
}

export async function fetchTracks(): Promise<Track[]> {
    const { data, error } = await supabase.from('tracks').select(TRACK_COLUMNS).order('sort_order');
    if (error) throw error;
    if (!data || data.length === 0) return [];

    return hydrateStemUrls(data as TrackRow[]);
}

export async function fetchTrackBySlug(slug: string): Promise<Track | null> {
    const { data, error } = await supabase.from('tracks').select(TRACK_COLUMNS).eq('slug', slug).maybeSingle();
    if (error) throw error;
    if (!data) return null;

    const [track] = await hydrateStemUrls([data as TrackRow]);
    return track;
}

export async function fetchTrackById(id: string): Promise<Track | null> {
    const { data, error } = await supabase.from('tracks').select(TRACK_COLUMNS).eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) return null;

    const [track] = await hydrateStemUrls([data as TrackRow]);
    return track;
}

export function tracksByMode(tracks: Track[], mode: Mode) {
    return tracks.filter((track) => track.mode === mode);
}

// Maps a 2D pad position to specific stem volume levels based on their poles.
const POLES: Record<StemLayer, AxisValues> = {
    brightness: { x: 0.5, y: 0 },
    rhythm: { x: 1, y: 0.5 },
    pad: { x: 0.5, y: 1 },
    melody: { x: 0, y: 0.5 },
};
const POLE_REACH = 1.25;
// Uses a steep falloff and low floor to clearly isolate layers when dragged to corners.
const POLE_CURVE = 2.0;
const GAIN_FLOOR = 0.02;

export function mixForAxis(x: number, y: number): Record<StemLayer, number> {
    const raw = {} as Record<StemLayer, number>;
    let top = 0;

    for (const layer of STEM_LAYERS) {
        const pole = POLES[layer];
        const distance = Math.hypot(x - pole.x, y - pole.y);
        const value = Math.max(0, 1 - distance / POLE_REACH) ** POLE_CURVE;
        raw[layer] = value;
        if (value > top) top = value;
    }
    if (top === 0) top = 1;

    const gains = {} as Record<StemLayer, number>;
    for (const layer of STEM_LAYERS)
        gains[layer] = GAIN_FLOOR + (1 - GAIN_FLOOR) * (raw[layer] / top);

    return gains;
}
