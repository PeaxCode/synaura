import { create } from 'zustand';
import { fetchFavoriteTrackIds, fetchPresets, fetchRecentPlays, Preset, RecentPlay } from '@/src/data/library';

interface LibraryState {
    favoriteIds: Set<string>;
    presets: Preset[];
    recentPlays: RecentPlay[];
    isLoading: boolean;
    hasLoaded: boolean;
    fetchLibrary: (userId: string) => Promise<void>;
    refreshRecentPlays: (userId: string) => Promise<void>;
    addOptimisticRecentPlay: (play: RecentPlay) => void;
    setFavoriteIds: (updater: (prev: Set<string>) => Set<string>) => void;
    setPresets: (updater: (prev: Preset[]) => Preset[]) => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
    favoriteIds: new Set(),
    presets: [],
    recentPlays: [],
    isLoading: false,
    hasLoaded: false,

    fetchLibrary: async (userId: string) => {
        if (!userId) return;
        set({ isLoading: true });
        try {
            const [favoriteIdSet, presetRows, plays] = await Promise.all([
                fetchFavoriteTrackIds(userId),
                fetchPresets(userId),
                fetchRecentPlays(userId, 15),
            ]);
            set({
                favoriteIds: favoriteIdSet,
                presets: presetRows,
                recentPlays: plays,
                hasLoaded: true,
                isLoading: false,
            });
        } catch {
            set({ isLoading: false });
        }
    },

    refreshRecentPlays: async (userId: string) => {
        if (!userId) return;
        try {
            const plays = await fetchRecentPlays(userId, 15);
            set({ recentPlays: plays });
        } catch { }
    },

    addOptimisticRecentPlay: (play: RecentPlay) => {
        set((state) => ({
            recentPlays: [play, ...state.recentPlays.filter((p) => !(p.trackId === play.trackId && p.presetId === play.presetId))].slice(0, 15),
        }));
    },

    setFavoriteIds: (updater) => {
        set((state) => ({ favoriteIds: updater(state.favoriteIds) }));
    },

    setPresets: (updater) => {
        set((state) => ({ presets: updater(state.presets) }));
    },
}));
