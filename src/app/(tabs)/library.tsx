import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from '@/src/assets/styles/library.styles';
import AmbientBackground from '@/src/components/AmbientBackground';
import PressableScale from '@/src/components/PressableScale';
import TrackArtwork from '@/src/components/TrackArtwork';
import { COLORS } from '@/src/constants/theme';
import { Preset, RecentPlay, favoriteTrack, fetchFavoriteTrackIds, fetchPresets, fetchRecentPlays, unfavoriteTrack } from '@/src/data/library';
import { isTrackOffline, removeTrackOffline } from '@/src/data/offline';
import { Mode, Track } from '@/src/data/tracks';
import { useAuthStore } from '@/src/store/authStore';
import { useLibraryStore } from '@/src/store/libraryStore';
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
    const favoriteIds = useLibraryStore((state) => state.favoriteIds);
    const presets = useLibraryStore((state) => state.presets);
    const recentPlays = useLibraryStore((state) => state.recentPlays);
    const isLoading = useLibraryStore((state) => state.isLoading);
    const fetchLibrary = useLibraryStore((state) => state.fetchLibrary);
    const setFavoriteIds = useLibraryStore((state) => state.setFavoriteIds);
    const setPresets = useLibraryStore((state) => state.setPresets);

    // Tracks removed via the Downloads tab this session — isTrackOffline alone
    // can't reflect a delete until allTracks itself changes, so this filters
    // them out of the list immediately instead of waiting for a re-fetch.
    const [removedDownloadIds, setRemovedDownloadIds] = useState<Set<string>>(new Set());
    const [openMenuTrackId, setOpenMenuTrackId] = useState<string | null>(null);

    // Tracks come from the shared cache (warmed at app launch) instead of a
    // per-focus fetch — only favorites/presets/recent are user-specific and
    // need refreshing every time this tab regains focus.
    const allTracks = useTracksStore((state) => state.tracks);
    const favoriteTracks = allTracks.filter((track) => favoriteIds.has(track.id));
    // isTrackOffline is a synchronous filesystem check (src/data/offline.ts) —
    // recomputed on every render instead of cached, so it can never go stale.
    const downloadedTracks = allTracks.filter((track) => isTrackOffline(track) && !removedDownloadIds.has(track.id));

    // Switches to the specified tab if linked externally (e.g., from the Home screen's Recent section).
    useEffect(() => {
        if (isLibraryTab(params.tab)) setTab(params.tab);
    }, [params.tab]);

    // Re-fetches library data on every tab focus to stay in sync with changes made while the Player was open.
    useFocusEffect(
        useCallback(() => {
            useTracksStore.getState().ensureLoaded();
            if (userId) {
                fetchLibrary(userId);
            }
        }, [userId, fetchLibrary]),
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

    // No confirmation dialog — same immediate-delete behavior as the Player's
    // download toggle (src/app/player.tsx handleToggleOffline).
    function handleRemoveDownload(track: Track) {
        removeTrackOffline(track.id);
        setRemovedDownloadIds((prev) => new Set(prev).add(track.id));
        setOpenMenuTrackId(null);
    }

    async function handleToggleFavorite(track: Track) {
        if (!userId) return;
        const isFavorited = favoriteIds.has(track.id);
        setFavoriteIds((prev) => {
            const next = new Set(prev);
            if (isFavorited) next.delete(track.id);
            else next.add(track.id);
            return next;
        });
        try {
            if (isFavorited) await unfavoriteTrack(userId, track.id);
            else await favoriteTrack(userId, track.id);
        } catch {
            setFavoriteIds((prev) => {
                const next = new Set(prev);
                if (isFavorited) next.add(track.id);
                else next.delete(track.id);
                return next;
            });
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
                                        <TrackArtwork
                                            category={track.category}
                                            mode={track.mode}
                                            isDownloaded={isTrackOffline(track)}
                                            size="card"
                                        />
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
                                presets.map((preset) => {
                                    const track = allTracks.find((t) => t.id === preset.trackId);
                                    return (
                                        <PressableScale key={preset.id} style={styles.card} onPress={() => handlePlayPreset(preset)}>
                                            <TrackArtwork
                                                category={track?.category}
                                                mode={preset.mode}
                                                size="card"
                                            />
                                            <View style={styles.cardBody}>
                                                <Text style={styles.cardTitle} numberOfLines={1}>{preset.name ?? 'Untitled'}</Text>
                                                <Text style={styles.cardSubtitle}>
                                                    {`Custom · ${MODE_LABEL[preset.mode]} · ${formatDurationLabel(preset.durationMinutes)}`}
                                                </Text>
                                            </View>
                                        </PressableScale>
                                    );
                                })
                            )
                        )}

                        {tab === 'downloaded' && (
                            downloadedTracks.length === 0 ? (
                                <View style={styles.emptyCard}>
                                    <Text style={styles.emptyText}>No downloads yet</Text>
                                </View>
                            ) : (
                                <View style={styles.listContainer}>
                                    {downloadedTracks.map((track, i) => {
                                        const isFavorited = favoriteIds.has(track.id);
                                        const isMenuOpen = openMenuTrackId === track.id;
                                        return (
                                            <View key={track.id} style={isMenuOpen ? { zIndex: 20 } : undefined}>
                                                <View style={styles.listRow}>
                                                    <PressableScale style={styles.listRowBody} onPress={() => handlePlayTrack(track)}>
                                                        <TrackArtwork
                                                            category={track.category}
                                                            mode={track.mode}
                                                            size="thumb"
                                                        />
                                                        <View style={styles.listRowText}>
                                                            <Text style={styles.cardTitle} numberOfLines={1}>{track.name}</Text>
                                                            <Text style={styles.cardSubtitle}>{MODE_LABEL[track.mode]}</Text>
                                                        </View>
                                                    </PressableScale>

                                                    <View style={styles.listRowActions}>
                                                        <View style={styles.menuAnchor}>
                                                            <PressableScale
                                                                style={styles.listRowIconButton}
                                                                onPress={() => setOpenMenuTrackId(isMenuOpen ? null : track.id)}
                                                            >
                                                                <Ionicons name="ellipsis-horizontal" size={18} color={COLORS.neutral[400]} />
                                                            </PressableScale>

                                                            {isMenuOpen && (
                                                                <>
                                                                    <Pressable style={styles.menuBackdrop} onPress={() => setOpenMenuTrackId(null)} />
                                                                    <View style={styles.menu}>
                                                                        <PressableScale
                                                                            style={styles.menuRow}
                                                                            onPress={() => { handleToggleFavorite(track); setOpenMenuTrackId(null); }}
                                                                        >
                                                                            <Ionicons name={isFavorited ? 'heart' : 'heart-outline'} size={18} color={isFavorited ? COLORS.accent : COLORS.neutral[300]} />
                                                                            <Text style={[styles.menuRowLabel, isFavorited && styles.menuRowLabelActive]}>
                                                                                {isFavorited ? 'Favorited' : 'Favorite'}
                                                                            </Text>
                                                                        </PressableScale>

                                                                        <PressableScale style={styles.menuRow} onPress={() => handleRemoveDownload(track)}>
                                                                            <Ionicons name="trash-outline" size={18} color={COLORS.neutral[300]} />
                                                                            <Text style={styles.menuRowLabel}>Remove Download</Text>
                                                                        </PressableScale>
                                                                    </View>
                                                                </>
                                                            )}
                                                        </View>
                                                    </View>
                                                </View>
                                                {i !== downloadedTracks.length - 1 && <View style={styles.listDivider} />}
                                            </View>
                                        );
                                    })}
                                </View>
                            )
                        )}

                        {tab === 'recent' && (
                            recentPlays.length === 0 ? (
                                <View style={styles.emptyCard}>
                                    <Text style={styles.emptyText}>No sessions yet</Text>
                                </View>
                            ) : (
                                <View style={styles.listContainer}>
                                    {recentPlays.map((play, i) => {
                                        const track = allTracks.find((t) => t.id === play.trackId);
                                        return (
                                            <View key={i}>
                                                <View style={styles.listRow}>
                                                    <PressableScale style={styles.listRowBody} onPress={() => handlePlayRecent(play)}>
                                                        <TrackArtwork
                                                            category={track?.category}
                                                            mode={play.mode}
                                                            size="thumb"
                                                        />
                                                        <View style={styles.listRowText}>
                                                            <Text style={styles.cardTitle} numberOfLines={1}>{play.name ?? 'Untitled'}</Text>
                                                            <Text style={styles.cardSubtitle}>
                                                                {`${MODE_LABEL[play.mode]} · ${formatPlayedMinutes(play.durationSeconds)} min`}
                                                            </Text>
                                                        </View>
                                                    </PressableScale>
                                                </View>
                                                {i !== recentPlays.length - 1 && <View style={styles.listDivider} />}
                                            </View>
                                        );
                                    })}
                                </View>
                            )
                        )}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
