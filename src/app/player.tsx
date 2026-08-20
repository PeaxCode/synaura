import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import createStyles from '@/src/assets/styles/player.styles';
import ModalSheet from '@/src/components/ModalSheet';
import PressableScale from '@/src/components/PressableScale';
import { COLORS } from '@/src/constants/theme';
import { deletePreset, favoriteTrack, fetchFavoriteTrackIds, findPresetByTrack, savePreset, unfavoriteTrack } from '@/src/data/library';
import { useAuthStore } from '@/src/store/authStore';
import { usePlaybackStore } from '@/src/store/playbackStore';

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

    if (!currentTrack)
        return null;

    const remainingMs = sessionEndAt ? sessionEndAt - now : pausedRemainingMs;
    const timerLabel = remainingMs === null ? '∞' : formatRemaining(remainingMs);

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

    return (
        <ModalSheet>
            <StatusBar style="light" />

            <View style={styles.content}>
                {/* Displays the session countdown timer as the central artwork. */}
                <View style={styles.artworkWrap}>
                    <View style={styles.artworkCard}>
                        <Text style={styles.timerValue}>{timerLabel}</Text>
                    </View>
                    <Text style={styles.trackTitle}>{currentTrack.name}</Text>
                    <Text style={styles.trackMeta}>{currentTrack.mode === 'relax' ? 'Relax' : 'Focus'}</Text>
                </View>

                <View style={{ flex: 1, minHeight: 24 }} />

                {/* TRANSPORT — save/favorite flank play where skip back/forward used to be */}
                <View style={styles.transportRow}>
                    <PressableScale style={styles.sideButton} onPress={handleToggleSave}>
                        {isSaveBusy ? (
                            <ActivityIndicator size="small" color={COLORS.accent} />
                        ) : (
                            <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} size={22} color={isSaved ? COLORS.accent : COLORS.neutral[400]} />
                        )}
                    </PressableScale>
                    <PressableScale style={styles.playButton} onPress={handlePlayPause}>
                        {isLoading ? (
                            <ActivityIndicator color={COLORS.bg} />
                        ) : (
                            <Ionicons name={isPlaying ? 'pause' : 'play'} size={28} color={COLORS.bg} />
                        )}
                    </PressableScale>
                    <PressableScale style={styles.sideButton} onPress={handleToggleFavorite}>
                        <Ionicons name={isFavorited ? 'heart' : 'heart-outline'} size={22} color={isFavorited ? COLORS.accent : COLORS.neutral[400]} />
                    </PressableScale>
                </View>
            </View>
        </ModalSheet>
    );
}
