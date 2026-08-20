import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from '@/src/assets/styles/library.styles';
import AmbientBackground from '@/src/components/AmbientBackground';
import PressableScale from '@/src/components/PressableScale';
import { COLORS } from '@/src/constants/theme';
import { Preset, RecentPlay, fetchFavoriteTrackIds, fetchPresetById, fetchPresets, fetchRecentPlays } from '@/src/data/library';
import { Mode, Track, fetchTrackById, fetchTracks } from '@/src/data/tracks';
import { useAuthStore } from '@/src/store/authStore';
import { usePlaybackStore } from '@/src/store/playbackStore';

type LibraryTab = 'favorites' | 'tunes' | 'recent';

const TABS: { slug: LibraryTab; label: string }[] = [
    { slug: 'favorites', label: 'Favorites' },
    { slug: 'tunes', label: 'My Tunes' },
    { slug: 'recent', label: 'Recent' },
];

const MODE_LABEL: Record<Mode, string> = { focus: 'Focus', relax: 'Relax' };

function isLibraryTab(value: string | string[] | undefined): value is LibraryTab {
    return value === 'favorites' || value === 'tunes' || value === 'recent';
}

function formatDurationLabel(minutes: number | null) {
    return minutes === null ? 'No limit' : `${minutes} min`;
}

// Formats logged play duration into minutes, ensuring it's at least 1 minute so actual sessions never show as 0.
function formatPlayedMinutes(durationSeconds: number) {
    return Math.max(1, Math.round(durationSeconds / 60));
}

// Tabbed screen for managing favorite tracks, custom saved presets, and recent play history.
export default function LibraryScreen() {
    const styles = createStyles(COLORS);
    const params = useLocalSearchParams<{ tab?: string }>();
    const userId = useAuthStore((state) => state.user?.id);
    const playTrack = usePlaybackStore((state) => state.playTrack);
    const setSessionMinutes = usePlaybackStore((state) => state.setSessionMinutes);

    const [tab, setTab] = useState<LibraryTab>('favorites');
    const [isLoading, setIsLoading] = useState(true);
    const [favoriteTracks, setFavoriteTracks] = useState<Track[]>([]);
    const [presets, setPresets] = useState<Preset[]>([]);
    const [recentPlays, setRecentPlays] = useState<RecentPlay[]>([]);
    const [replayingId, setReplayingId] = useState<string | null>(null);

    // Switches to the specified tab if linked externally (e.g., from the Home screen's Recent section).
    useEffect(() => {
        if (isLibraryTab(params.tab)) setTab(params.tab);
    }, [params.tab]);

    // Re-fetches library data on every tab focus to stay in sync with changes made while the Player was open.
    useFocusEffect(
        useCallback(() => {
            if (!userId) { setIsLoading(false); return; }

            let cancelled = false;
            Promise.all([fetchTracks(), fetchFavoriteTrackIds(userId), fetchPresets(userId), fetchRecentPlays(userId, 10)])
                .then(([tracks, favoriteIds, presetRows, plays]) => {
                    if (cancelled) return;
                    setFavoriteTracks(tracks.filter((track) => favoriteIds.has(track.id)));
                    setPresets(presetRows);
                    setRecentPlays(plays);
                })
                .catch(() => { })
                .finally(() => { if (!cancelled) setIsLoading(false); });

            return () => { cancelled = true; };
        }, [userId]),
    );

    async function handlePlayTrack(track: Track) {
        if (replayingId) return;
        setReplayingId(track.id);
        try {
            await playTrack(track);
            router.push('/player');
        } finally {
            setReplayingId(null);
        }
    }

    async function handlePlayPreset(preset: Preset) {
        if (replayingId || !preset.trackId) return;
        setReplayingId(preset.id);
        try {
            const track = await fetchTrackById(preset.trackId);
            if (track) {
                await playTrack(track, preset.axisValues, preset.id);
                setSessionMinutes(preset.durationMinutes);
                router.push('/player');
            }
        } finally {
            setReplayingId(null);
        }
    }

    // Resolves a recent play into a replayable session by determining if it was a custom preset or a default track.
    async function handlePlayRecent(play: RecentPlay) {
        const replayKey = play.presetId ?? play.trackId;
        if (replayingId || !replayKey) return;
        setReplayingId(replayKey);
        try {
            if (play.presetId) {
                const preset = await fetchPresetById(play.presetId);
                if (!preset?.trackId) return;
                const track = await fetchTrackById(preset.trackId);
                if (!track) return;
                await playTrack(track, preset.axisValues, preset.id);
                setSessionMinutes(preset.durationMinutes);
            } else if (play.trackId) {
                const track = await fetchTrackById(play.trackId);
                if (!track) return;
                await playTrack(track);
            }
            router.push('/player');
        } finally {
            setReplayingId(null);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar style="light" />
            <AmbientBackground />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Library</Text>

                {/* TAB TOGGLE */}
                <View style={styles.tabToggle}>
                    {TABS.map((t) => {
                        const isActive = tab === t.slug;
                        return (
                            <PressableScale
                                key={t.slug}
                                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                                onPress={() => setTab(t.slug)}
                            >
                                <Text style={[styles.tabButtonLabel, isActive && styles.tabButtonLabelActive]}>{t.label}</Text>
                            </PressableScale>
                        );
                    })}
                </View>

                {isLoading && <ActivityIndicator style={styles.stateIndicator} color={COLORS.accent} />}

                {!isLoading && (
                    <View style={styles.grid}>
                        {tab === 'favorites' && (
                            favoriteTracks.length === 0 ? (
                                <View style={styles.emptyCard}>
                                    <Text style={styles.emptyText}>No favorites yet</Text>
                                </View>
                            ) : (
                                favoriteTracks.map((track) => (
                                    <PressableScale key={track.id} style={styles.card} onPress={() => handlePlayTrack(track)}>
                                        <View style={styles.cardArt} />
                                        <View style={styles.cardBody}>
                                            <Text style={styles.cardTitle} numberOfLines={1}>{track.name}</Text>
                                            <Text style={styles.cardSubtitle}>
                                                {replayingId === track.id ? 'Loading…' : MODE_LABEL[track.mode]}
                                            </Text>
                                        </View>
                                    </PressableScale>
                                ))
                            )
                        )}

                        {tab === 'tunes' && (
                            presets.length === 0 ? (
                                <View style={styles.emptyCard}>
                                    <Text style={styles.emptyText}>No custom tunes yet</Text>
                                </View>
                            ) : (
                                presets.map((preset) => (
                                    <PressableScale key={preset.id} style={styles.card} onPress={() => handlePlayPreset(preset)}>
                                        <View style={styles.cardArt} />
                                        <View style={styles.cardBody}>
                                            <Text style={styles.cardTitle} numberOfLines={1}>{preset.name ?? 'Untitled'}</Text>
                                            <Text style={styles.cardSubtitle}>
                                                {replayingId === preset.id
                                                    ? 'Loading…'
                                                    : `Custom · ${MODE_LABEL[preset.mode]} · ${formatDurationLabel(preset.durationMinutes)}`}
                                            </Text>
                                        </View>
                                    </PressableScale>
                                ))
                            )
                        )}

                        {tab === 'recent' && (
                            recentPlays.length === 0 ? (
                                <View style={styles.emptyCard}>
                                    <Text style={styles.emptyText}>No sessions yet</Text>
                                </View>
                            ) : (
                                recentPlays.map((play, i) => {
                                    const replayKey = play.presetId ?? play.trackId;
                                    return (
                                        <PressableScale key={i} style={styles.card} onPress={() => handlePlayRecent(play)}>
                                            <View style={styles.cardArt} />
                                            <View style={styles.cardBody}>
                                                <Text style={styles.cardTitle} numberOfLines={1}>{play.name ?? 'Untitled'}</Text>
                                                <Text style={styles.cardSubtitle}>
                                                    {replayKey && replayingId === replayKey
                                                        ? 'Loading…'
                                                        : `${MODE_LABEL[play.mode]} · ${formatPlayedMinutes(play.durationSeconds)} min`}
                                                </Text>
                                            </View>
                                        </PressableScale>
                                    );
                                })
                            )
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
