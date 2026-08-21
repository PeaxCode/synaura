import { create } from 'zustand';
import { Track, fetchTracks } from '@/src/data/tracks';

interface TracksState {
    tracks: Track[];
    isLoading: boolean;
    error: string | null;
    hasLoaded: boolean;
    ensureLoaded: () => void;
    refresh: () => void;
}

let inFlight: Promise<void> | null = null;

// Global cache for the tracks catalog. Warmed once from the root layout as
// soon as the app launches, so by the time a screen that needs it (Explore,
// start-session, Library) mounts, the data is already there instead of each
// one triggering its own fetch + stem-URL hydration round trip.
export const useTracksStore = create<TracksState>((set, get) => ({
    tracks: [],
    isLoading: false,
    error: null,
    hasLoaded: false,
    ensureLoaded: () => {
        if (get().hasLoaded || inFlight) return;
        get().refresh();
    },
    refresh: () => {
        set({ isLoading: true, error: null });
        inFlight = fetchTracks()
            .then((tracks) => set({ tracks, hasLoaded: true }))
            .catch((err) => set({ error: err?.message ?? 'Could not load sounds.' }))
            .finally(() => {
                inFlight = null;
                set({ isLoading: false });
            });
    },
}));
