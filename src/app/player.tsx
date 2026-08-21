import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View, useWindowDimensions } from 'react-native';
import createStyles from '@/src/assets/styles/player.styles';
import DownloadRing from '@/src/components/DownloadRing';
import ModalSheet from '@/src/components/ModalSheet';
import PerspectiveGrid from '@/src/components/PerspectiveGrid';
import PressableScale from '@/src/components/PressableScale';
import { COLORS } from '@/src/constants/theme';
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

export default function PlayerScreen() {
    const styles = createStyles(COLORS);
    const [now, setNow] = useState(Date.now());
    const [isFavorited, setIsFavorited] = useState(false);
    const [isFavoriteBusy, setIsFavoriteBusy] = useState(false);
    const [savedPresetId, setSavedPresetId] = useState<string | null>(null);
    const [isSaveBusy, setIsSaveBusy] = useState(false);
    const isSaved = savedPresetId !== null;
    const [isOffline, setIsOffline] = useState(false);
    const [isOfflineBusy, setIsOfflineBusy] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const userId = useAuthStore((state) => state.user?.id);
    const currentTrack = usePlaybackStore((state) => state.currentTrack);
    const axisValues = usePlaybackStore((state) => state.axisValues);
    const sessionMinutes = usePlaybackStore((state) => state.sessionMinutes);
    const isPlaying = usePlaybackStore((state) => state.isPlaying);
    const isLoading = usePlaybackStore((state) => state.isLoading);
    const sessionEndAt = usePlaybackStore((state) => state.sessionEndAt);
    const pausedRemainingMs = usePlaybackStore((state) => state.pausedRemainingMs);
    const pause = usePlaybackStore((state) => state.pause);
    const resume = usePlaybackStore((state) => state.resume);
    const adjustSessionTime = usePlaybackStore((state) => state.adjustSessionTime);

    useEffect(() => {
        if (currentTrack) return;
        if (router.canGoBack()) router.back();
        else router.replace('/(tabs)');
    }, [currentTrack]);

    useEffect(() => {
        if (!sessionEndAt) return;
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [sessionEndAt]);

    // Resets per-session UI state and checks if the current track is already favorited or saved.
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

    // Local-file checks are synchronous (see src/data/offline.ts), so this just
    // re-reads state whenever the current track changes.
    useEffect(() => {
        setIsOffline(currentTrack ? isTrackOffline(currentTrack) : false);
    }, [currentTrack?.id]);

    if (!currentTrack)
        return null;

    const remainingMs = sessionEndAt ? sessionEndAt - now : pausedRemainingMs;
    const timerLabel = remainingMs === null ? '∞' : formatRemaining(remainingMs);
    // Session-elapsed progress, not track position — stems loop continuously,
    // so "how far into the track" isn't meaningful, but "how far into the
    // chosen session length" is. null (no bar) on an unlimited (∞) session,
    // since there's no total to measure progress against.
    const totalMs = sessionMinutes !== null ? sessionMinutes * 60 * 1000 : null;
    const progress = totalMs !== null && remainingMs !== null
        ? Math.min(1, Math.max(0, 1 - remainingMs / totalMs))
        : null;

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
            // best-effort — leave the button pressable so the user can retry
        } finally {
            setIsSaveBusy(false);
        }
    }

    // No entitlement check yet — offline is free for everyone until Faz 4.1
    // (RevenueCat) wires up a real gate here.
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
            // best-effort — leave the control pressable so the user can retry
        } finally {
            setIsOfflineBusy(false);
        }
    }

    return (
        <ModalSheet>
            <StatusBar style="light" />

            <View style={styles.content}>
                {/* Displays the session countdown timer as the central artwork. */}
                <View style={styles.artworkWrap}>
                    <View style={styles.artworkCard}>
                        <PerspectiveGrid size={280} isPlaying={isPlaying} />
                        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={styles.timerValue}>{timerLabel}</Text>
                        </View>
                    </View>
                    <Text style={styles.trackTitle}>{currentTrack.name}</Text>
                    <Text style={styles.trackMeta}>{currentTrack.mode === 'relax' ? 'Relax' : 'Focus'}</Text>

                    {progress !== null && (
                        <View style={styles.progressTrack}>
                            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                        </View>
                    )}
                </View>

                {/* TRANSPORT — ±15s to the session countdown flank play (no-op on an
                    unlimited/∞ session, dimmed in that case); save/favorite/download
                    moved into the ⋯ menu */}
                <View style={styles.transportRow}>
                    <PressableScale
                        style={styles.sideButton}
                        onPress={() => sessionMinutes !== null && adjustSessionTime(-SESSION_ADJUST_SECONDS)}
                    >
                        <Ionicons name="arrow-undo-outline" size={19} color={sessionMinutes === null ? COLORS.neutral[700] : COLORS.neutral[400]} />
                        <Text style={[styles.skipButtonLabel, sessionMinutes === null && styles.skipButtonLabelDisabled]}>
                            {SESSION_ADJUST_SECONDS}s
                        </Text>
                    </PressableScale>
                    <PressableScale style={styles.playButton} onPress={handlePlayPause}>
                        {isLoading ? (
                            <ActivityIndicator color={COLORS.bg} />
                        ) : (
                            <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color={COLORS.bg} />
                        )}
                    </PressableScale>
                    <PressableScale
                        style={styles.sideButton}
                        onPress={() => sessionMinutes !== null && adjustSessionTime(SESSION_ADJUST_SECONDS)}
                    >
                        <Ionicons name="arrow-redo-outline" size={19} color={sessionMinutes === null ? COLORS.neutral[700] : COLORS.neutral[400]} />
                        <Text style={[styles.skipButtonLabel, sessionMinutes === null && styles.skipButtonLabelDisabled]}>
                            {SESSION_ADJUST_SECONDS}s
                        </Text>
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
