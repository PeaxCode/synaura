import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View, useWindowDimensions } from 'react-native';
import createStyles from '@/src/assets/styles/player.styles';
import DownloadRing from '@/src/components/DownloadRing';
import ModalSheet from '@/src/components/ModalSheet';
import PerspectiveGrid from '@/src/components/PerspectiveGrid';
import PressableScale from '@/src/components/PressableScale';
import { COLORS, FONTS } from '@/src/constants/theme';
import { deletePreset, favoriteTrack, fetchFavoriteTrackIds, findPresetByTrack, savePreset, unfavoriteTrack } from '@/src/data/library';
import { downloadTrackOffline, isTrackOffline, removeTrackOffline } from '@/src/data/offline';
import { useAuthStore } from '@/src/store/authStore';
import { usePlaybackStore } from '@/src/store/playbackStore';

const SESSION_ADJUST_SECONDS = 15;

function formatRemaining(ms: number) {
    const totalSeconds = Math.max(0, Math.round(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const styles = createStyles(COLORS);

export default function PlayerScreen() {
    // 1. Hooks & State
    const [now, setNow] = useState(Date.now());
    const [isFavorited, setIsFavorited] = useState(false);
    const [isFavoriteBusy, setIsFavoriteBusy] = useState(false);
    const [savedPresetId, setSavedPresetId] = useState<string | null>(null);
    const [isSaveBusy, setIsSaveBusy] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [isOfflineBusy, setIsOfflineBusy] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const userId = useAuthStore((state) => state.user?.id);
    const currentTrack = usePlaybackStore((state) => state.currentTrack);
    const axisValues = usePlaybackStore((state) => state.axisValues);
    const sessionMode = usePlaybackStore((state) => state.sessionMode);
    const cycleRhythm = usePlaybackStore((state) => state.cycleRhythm);
    const sessionMinutes = usePlaybackStore((state) => state.sessionMinutes);
    const isPlaying = usePlaybackStore((state) => state.isPlaying);
    const isLoading = usePlaybackStore((state) => state.isLoading);
    const sessionEndAt = usePlaybackStore((state) => state.sessionEndAt);
    const pausedRemainingMs = usePlaybackStore((state) => state.pausedRemainingMs);
    const sessionPlaySeconds = usePlaybackStore((state) => state.sessionPlaySeconds);
    const playSegmentStartedAt = usePlaybackStore((state) => state.playSegmentStartedAt);
    const pause = usePlaybackStore((state) => state.pause);
    const resume = usePlaybackStore((state) => state.resume);
    const adjustSessionTime = usePlaybackStore((state) => state.adjustSessionTime);

    // 2. Derived & Computed State
    const isSaved = savedPresetId !== null;
    const isCycles = sessionMode === 'cycles';
    const totalMs = sessionMinutes !== null ? sessionMinutes * 60 * 1000 : null;
    const remainingMs = sessionEndAt ? Math.max(0, sessionEndAt - now) : pausedRemainingMs;

    const isDeepRhythm = cycleRhythm === 'deep';
    const FOCUS_MINUTES = isDeepRhythm ? 50 : 25;
    const REST_MINUTES = isDeepRhythm ? 10 : 5;
    const CYCLE_MINUTES = FOCUS_MINUTES + REST_MINUTES;

    const CYCLE_MS = CYCLE_MINUTES * 60 * 1000;
    const FOCUS_MS = FOCUS_MINUTES * 60 * 1000;
    const REST_MS = REST_MINUTES * 60 * 1000;

    let timerLabel = remainingMs === null ? '∞' : formatRemaining(remainingMs);
    let isFocusPhase = true;
    let currentCycleIndex = 1;
    let totalCyclesText = '1';
    let cyclePhaseProgress = 0;

    if (isCycles) {
        let elapsedMs = 0;
        if (totalMs !== null && remainingMs !== null && sessionMinutes !== null) {
            elapsedMs = Math.max(0, totalMs - remainingMs);
            const totalCount = Math.max(1, Math.round(sessionMinutes / CYCLE_MINUTES));
            currentCycleIndex = Math.min(totalCount, Math.floor(elapsedMs / CYCLE_MS) + 1);
            totalCyclesText = String(totalCount);
        } else {
            const segmentSeconds = playSegmentStartedAt ? (now - playSegmentStartedAt) / 1000 : 0;
            elapsedMs = Math.max(0, (sessionPlaySeconds + segmentSeconds) * 1000);
            currentCycleIndex = Math.floor(elapsedMs / CYCLE_MS) + 1;
            totalCyclesText = '∞';
        }

        const elapsedInCurrentCycle = elapsedMs % CYCLE_MS;
        isFocusPhase = elapsedInCurrentCycle < FOCUS_MS;
        if (isFocusPhase) {
            const phaseRemaining = Math.max(0, FOCUS_MS - elapsedInCurrentCycle);
            timerLabel = formatRemaining(phaseRemaining);
            cyclePhaseProgress = Math.min(1, Math.max(0, elapsedInCurrentCycle / FOCUS_MS));
        } else {
            const phaseRemaining = Math.max(0, CYCLE_MS - elapsedInCurrentCycle);
            timerLabel = formatRemaining(phaseRemaining);
            cyclePhaseProgress = Math.min(1, Math.max(0, (elapsedInCurrentCycle - FOCUS_MS) / REST_MS));
        }
    }

    const progress = totalMs !== null && remainingMs !== null
        ? Math.min(1, Math.max(0, 1 - remainingMs / totalMs))
        : null;

    // 3. Effects & Lifecycles
    useEffect(() => {
        if (currentTrack) return;
        if (router.canGoBack()) router.back();
        else router.replace('/(tabs)');
    }, [currentTrack]);

    useEffect(() => {
        if (!isPlaying && !sessionEndAt) return;
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [isPlaying, sessionEndAt]);

    useEffect(() => {
        setSavedPresetId(null);
        setIsFavorited(false);
        if (!userId || !currentTrack) return;

        let cancelled = false;
        Promise.all([fetchFavoriteTrackIds(userId), findPresetByTrack(userId, currentTrack.id)])
            .then(([ids, preset]) => {
                if (cancelled) return;
                setIsFavorited(ids.has(currentTrack.id));
                setSavedPresetId(preset?.id ?? null);
            })
            .catch(() => { });
        return () => { cancelled = true; };
    }, [userId, currentTrack?.id]);

    useEffect(() => {
        setIsOffline(currentTrack ? isTrackOffline(currentTrack) : false);
    }, [currentTrack?.id]);

    // 4. Action Handlers
    function handlePlayPause() {
        if (isPlaying) pause();
        else resume();
    }

    async function handleToggleFavorite() {
        if (!userId || !currentTrack || isFavoriteBusy) return;
        setIsFavoriteBusy(true);
        const next = !isFavorited;
        setIsFavorited(next);
        try {
            if (next) await favoriteTrack(userId, currentTrack.id);
            else await unfavoriteTrack(userId, currentTrack.id);
        } catch {
            setIsFavorited(!next);
        } finally {
            setIsFavoriteBusy(false);
        }
    }

    async function handleToggleSave() {
        if (!userId || !currentTrack || isSaveBusy) return;
        setIsSaveBusy(true);
        try {
            if (savedPresetId) {
                await deletePreset(savedPresetId);
                setSavedPresetId(null);
            } else {
                const preset = await savePreset(userId, currentTrack, axisValues, sessionMinutes);
                setSavedPresetId(preset.id);
            }
        } catch {
        } finally {
            setIsSaveBusy(false);
        }
    }

    async function handleToggleOffline() {
        if (!currentTrack || isOfflineBusy) return;
        setIsOfflineBusy(true);
        setDownloadProgress(0);
        try {
            if (isOffline) {
                removeTrackOffline(currentTrack.id);
                setIsOffline(false);
            } else {
                await downloadTrackOffline(currentTrack, setDownloadProgress);
                setIsOffline(true);
            }
        } catch {
        } finally {
            setIsOfflineBusy(false);
        }
    }

    // 5. Guard Clause
    if (!currentTrack)
        return null;

    // 6. JSX Render
    return (
        <ModalSheet>
            <StatusBar style="light" />

            <View style={styles.content}>
                {/* CENTRAL TIMER ARTWORK */}
                <View style={styles.artworkWrap}>
                    <View style={styles.artworkCard}>
                        <PerspectiveGrid size={280} isPlaying={isPlaying} />
                        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={styles.timerValue}>{timerLabel}</Text>
                            {isCycles && (
                                <Text style={[styles.timerSubLabel, { color: isFocusPhase ? COLORS.accent : '#48d597' }]}>
                                    {isFocusPhase ? 'FOCUS PHASE' : 'REST PHASE'}
                                </Text>
                            )}
                        </View>
                    </View>

                    <Text style={styles.trackTitle}>{currentTrack.name}</Text>
                    <Text style={styles.trackMeta}>
                        {currentTrack.mode === 'relax' ? 'Relax' : 'Focus'}
                        {isCycles ? ` · Cycle ${currentCycleIndex} of ${totalCyclesText}` : ''}
                    </Text>

                    {/* PROGRESS BAR — Segmented in Cycles mode, Continuous in Timer mode */}
                    {isCycles ? (
                        <View style={styles.cycleProgressRow}>
                            <View style={styles.cycleSegmentWrap}>
                                <View style={styles.cycleSegmentTrack}>
                                    <View
                                        style={[
                                            styles.cycleSegmentFill,
                                            {
                                                width: isFocusPhase ? `${cyclePhaseProgress * 100}%` : '100%',
                                                backgroundColor: COLORS.accent,
                                            }
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.cycleSegmentText, isFocusPhase && styles.cycleSegmentTextActive]}>
                                    {FOCUS_MINUTES}m Focus
                                </Text>
                            </View>
                            <View style={styles.cycleSegmentWrap}>
                                <View style={styles.cycleSegmentTrack}>
                                    <View
                                        style={[
                                            styles.cycleSegmentFill,
                                            {
                                                width: !isFocusPhase ? `${cyclePhaseProgress * 100}%` : '0%',
                                                backgroundColor: '#48d597',
                                            }
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.cycleSegmentText, !isFocusPhase && { color: '#48d597', fontFamily: FONTS.semibold }]}>
                                    {REST_MINUTES}m Rest
                                </Text>
                            </View>
                        </View>
                    ) : (
                        progress !== null && (
                            <View style={styles.progressTrack}>
                                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                            </View>
                        )
                    )}
                </View>

                {/* TRANSPORT — ±15s to the session countdown flank play (no-op on an
                    unlimited/∞ session, dimmed in that case); save/favorite/download
                    moved into the ⋯ menu */}
                <View style={styles.transportRow}>
                    <PressableScale
                        style={[styles.jumpButton, sessionMinutes === null && styles.jumpButtonDisabled]}
                        onPress={() => sessionMinutes !== null && adjustSessionTime(SESSION_ADJUST_SECONDS)}
                        disabled={sessionMinutes === null}
                    >
                        <MaterialCommunityIcons
                            name="rewind-15"
                            size={26}
                            color={sessionMinutes === null ? COLORS.neutral[600] : COLORS.text}
                        />
                    </PressableScale>

                    <PressableScale style={styles.playButton} onPress={handlePlayPause}>
                        {isLoading ? (
                            <ActivityIndicator color={COLORS.bg} />
                        ) : (
                            <Ionicons name={isPlaying ? 'pause' : 'play'} size={30} color={COLORS.bg} />
                        )}
                    </PressableScale>

                    <PressableScale
                        style={[styles.jumpButton, sessionMinutes === null && styles.jumpButtonDisabled]}
                        onPress={() => sessionMinutes !== null && adjustSessionTime(-SESSION_ADJUST_SECONDS)}
                        disabled={sessionMinutes === null}
                    >
                        <MaterialCommunityIcons
                            name="fast-forward-15"
                            size={26}
                            color={sessionMinutes === null ? COLORS.neutral[600] : COLORS.text}
                        />
                    </PressableScale>

                    <View style={styles.menuAnchor}>
                        <PressableScale style={styles.menuButton} onPress={() => setIsMenuOpen((v) => !v)}>
                            <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.neutral[400]} />
                        </PressableScale>

                        {isMenuOpen && (
                            <>
                                <Pressable style={styles.menuBackdrop} onPress={() => setIsMenuOpen(false)} />
                                <View style={styles.menu}>
                                    <PressableScale
                                        style={styles.menuRow}
                                        onPress={handleToggleSave}
                                    >
                                        {isSaveBusy ? (
                                            <ActivityIndicator size="small" color={COLORS.accent} />
                                        ) : (
                                            <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={18} color={isSaved ? COLORS.accent : COLORS.neutral[300]} />
                                        )}
                                        <Text style={[styles.menuRowLabel, isSaved && styles.menuRowLabelActive]}>
                                            {isSaved ? 'Saved to Library' : 'Save to Library'}
                                        </Text>
                                    </PressableScale>

                                    <PressableScale
                                        style={styles.menuRow}
                                        onPress={handleToggleFavorite}
                                    >
                                        <Ionicons name={isFavorited ? 'heart' : 'heart-outline'} size={18} color={isFavorited ? COLORS.accent : COLORS.neutral[300]} />
                                        <Text style={[styles.menuRowLabel, isFavorited && styles.menuRowLabelActive]}>
                                            {isFavorited ? 'Favorited' : 'Favorite'}
                                        </Text>
                                    </PressableScale>

                                    <PressableScale
                                        style={styles.menuRow}
                                        onPress={handleToggleOffline}
                                    >
                                        <DownloadRing
                                            size={18}
                                            progress={downloadProgress}
                                            isDownloading={isOfflineBusy}
                                            isDownloaded={isOffline}
                                            color={COLORS.accent}
                                            trackColor={COLORS.neutral[300]}
                                        />
                                        <Text style={[styles.menuRowLabel, isOffline && styles.menuRowLabelActive]}>
                                            {isOffline ? 'Downloaded' : isOfflineBusy ? 'Downloading…' : 'Download'}
                                        </Text>
                                    </PressableScale>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </View>
        </ModalSheet>
    );
}
