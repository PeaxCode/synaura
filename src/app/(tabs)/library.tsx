import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from '@/src/assets/styles/library.styles';
import AmbientBackground from '@/src/components/AmbientBackground';
import PressableScale from '@/src/components/PressableScale';
import { COLORS } from '@/src/constants/theme';
import { Preset, RecentPlay, fetchFavoriteTrackIds, fetchPresets, fetchRecentPlays } from '@/src/data/library';
import { isTrackOffline } from '@/src/data/offline';
import { Mode, Track } from '@/src/data/tracks';
import { useAuthStore } from '@/src/store/authStore';
import { useTracksStore } from '@/src/store/tracksStore';

type LibraryTab = 'favorites' | 'tunes' | 'recent' | 'downloaded';

const TABS: { slug: LibraryTab; label: string }[] = [
    { slug: 'favorites', label: 'Favorites' },
    { slug: 'tunes', label: 'My Tunes' },
    { slug: 'recent', label: 'Recent' },
    { slug: 'downloaded', label: 'Downloads' },
];

const MODE_LABEL: Record<Mode, string> = { focus: 'Focus', relax: 'Relax' };

function isLibraryTab(value: string | string[] | undefined): value is LibraryTab {
    return value === 'favorites' || value === 'tunes' || value === 'recent' || value === 'downloaded';
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

    const [tab, setTab] = useState<LibraryTab>('favorites');
    const [isLoading, setIsLoading] = useState(true);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
    const [presets, setPresets] = useState<Preset[]>([]);
    const [recentPlays, setRecentPlays] = useState<RecentPlay[]>([]);

    // Tracks come from the shared cache (warmed at app launch) instead of a
    // per-focus fetch — only favorites/presets/recent are user-specific and
    // need refreshing every time this tab regains focus.
    const allTracks = useTracksStore((state) => state.tracks);
    const favoriteTracks = allTracks.filter((track) => favoriteIds.has(track.id));
    // isTrackOffline is a synchronous filesystem check (src/data/offline.ts) —
    // recomputed on every render instead of cached, so it can never go stale.
    const downloadedTracks = allTracks.filter((track) => isTrackOffline(track));

    // Switches to the specified tab if linked externally (e.g., from the Home screen's Recent section).
    useEffect(() => {
        if (isLibraryTab(params.tab)) setTab(params.tab);
    }, [params.tab]);

    // Re-fetches library data on every tab focus to stay in sync with changes made while the Player was open.
    useFocusEffect(
        useCallback(() => {
            useTracksStore.getState().ensureLoaded();
            if (!userId) { setIsLoading(false); return; }

            let cancelled = false;
            Promise.all([fetchFavoriteTrackIds(userId), fetchPresets(userId), fetchRecentPlays(userId, 10)])
                .then(([favoriteIdSet, presetRows, plays]) => {
                    if (cancelled) return;
                    setFavoriteIds(favoriteIdSet);
                    setPresets(presetRows);
                    setRecentPlays(plays);
                })
                .catch(() => { })
                .finally(() => { if (!cancelled) setIsLoading(false); });

            return () => { cancelled = true; };
        }, [userId]),
    );

    // Sends the user to start-session's duration step instead of replaying
    // immediately — every tune opened from Library (favorite, download, or
    // recent) asks for a session length instead of silently defaulting one.
    function handlePlayTrack(track: Track) {
        router.push({ pathname: '/start-session', params: { trackId: track.id } });
    }

    // Sends the user to start-session's duration step instead of replaying
    // immediately — otherwise the tune's saved duration gets silently
    // reapplied with no way to change it for this particular replay.
    function handlePlayPreset(preset: Preset) {
        router.push({ pathname: '/start-session', params: { presetId: preset.id } });
    }

    // Same duration-ask treatment as favorites/tunes — resolving which
    // preset/track a recent play maps to happens in start-session itself,
    // this just forwards whichever id it logged.
    function handlePlayRecent(play: RecentPlay) {
        if (play.presetId) {
            router.push({ pathname: '/start-session', params: { presetId: play.presetId } });
        } else if (play.trackId) {
            router.push({ pathname: '/start-session', params: { trackId: play.trackId } });
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
                                <Text style={[styles.tabButtonLabel, isActive && styles.tabButtonLabelActive]} numberOfLines={1}>{t.label}</Text>
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
                                        <View style={styles.cardArt}>
                                            {isTrackOffline(track) && (
                                                <View style={styles.downloadedBadge}>
                                                    <Ionicons name="checkmark-circle" size={12} color={COLORS.accent} />
                                                    <Text style={styles.downloadedBadgeLabel}>Downloaded</Text>
                                                </View>
                                            )}
                                        </View>
                                        <View style={styles.cardBody}>
                                            <Text style={styles.cardTitle} numberOfLines={1}>{track.name}</Text>
                                            <Text style={styles.cardSubtitle}>{MODE_LABEL[track.mode]}</Text>
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
                                                {`Custom · ${MODE_LABEL[preset.mode]} · ${formatDurationLabel(preset.durationMinutes)}`}
                                            </Text>
                                        </View>
                                    </PressableScale>
                                ))
                            )
                        )}

                        {tab === 'downloaded' && (
                            downloadedTracks.length === 0 ? (
                                <View style={styles.emptyCard}>
                                    <Text style={styles.emptyText}>No downloads yet</Text>
                                </View>
                            ) : (
                                downloadedTracks.map((track) => (
                                    <PressableScale key={track.id} style={styles.card} onPress={() => handlePlayTrack(track)}>
                                        <View style={styles.cardArt} />
                                        <View style={styles.cardBody}>
                                            <Text style={styles.cardTitle} numberOfLines={1}>{track.name}</Text>
                                            <Text style={styles.cardSubtitle}>{MODE_LABEL[track.mode]}</Text>
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
                                recentPlays.map((play, i) => (
                                    <PressableScale key={i} style={styles.card} onPress={() => handlePlayRecent(play)}>
                                        <View style={styles.cardArt} />
                                        <View style={styles.cardBody}>
                                            <Text style={styles.cardTitle} numberOfLines={1}>{play.name ?? 'Untitled'}</Text>
                                            <Text style={styles.cardSubtitle}>
                                                {`${MODE_LABEL[play.mode]} · ${formatPlayedMinutes(play.durationSeconds)} min`}
                                            </Text>
                                        </View>
                                    </PressableScale>
                                ))
                            )
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
