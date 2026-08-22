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

// Global in-memory cache for track catalog, preloaded on app launch
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
