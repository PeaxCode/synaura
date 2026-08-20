import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ComponentProps, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, useSharedValue } from 'react-native-reanimated';
import createStyles from '@/src/assets/styles/start-session.styles';
import AxisPad from '@/src/components/AxisPad';
import ModalSheet from '@/src/components/ModalSheet';
import PressableScale from '@/src/components/PressableScale';
import TrackGrid from '@/src/components/TrackGrid';
import { COLORS } from '@/src/constants/theme';
import { AxisValues, Category, Track, fetchTracks } from '@/src/data/tracks';
import { useTrackPreview } from '@/src/hooks/useTrackPreview';
import { usePlaybackStore } from '@/src/store/playbackStore';

type IoniconName = ComponentProps<typeof Ionicons>['name'];
type Step = 'track' | 'duration' | 'tune';

const CATEGORY_ICONS: Record<Category, IoniconName> = {
    nature: 'leaf-outline',
    acoustic: 'musical-notes-outline',
    instrumental: 'disc-outline',
    lofi: 'headset-outline',
};

const DURATIONS: { value: string; unit: string; minutes: number | null }[] = [
    { value: '5', unit: 'min', minutes: 5 },
    { value: '15', unit: 'min', minutes: 15 },
    { value: '30', unit: 'min', minutes: 30 },
    { value: '45', unit: 'min', minutes: 45 },
    { value: '60', unit: 'min', minutes: 60 },
    { value: '∞', unit: 'No limit', minutes: null },
];

const DURATION_ROWS = [DURATIONS.slice(0, 2), DURATIONS.slice(2, 4), DURATIONS.slice(4, 6)];

const PAD_SIZE_MAX = 260;

// Orchestrates the session creation flow: picking a track, setting a duration, and optionally tuning the mix before starting.
export default function StartSessionScreen() {
    const styles = createStyles(COLORS);
    const { width } = useWindowDimensions();
    const [step, setStep] = useState<Step>('track');
    const [tracks, setTracks] = useState<Track[]>([]);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    const [selectedMinutes, setSelectedMinutes] = useState<number | null>(null);
    const [isStarting, setIsStarting] = useState(false);
    const [axisValues, setAxisValues] = useState<AxisValues>({ x: 0.5, y: 0.5 });
    const padPosition = useSharedValue<AxisValues>({ x: 0.5, y: 0.5 });
    const { playingSlug, loadingSlug, play, stop, updateAxis } = useTrackPreview();

    useEffect(() => {
        fetchTracks().then(setTracks).catch(() => { });
    }, []);

    const padSize = Math.min(PAD_SIZE_MAX, width - 56 - 44);

    function handleSelectTrack(track: Track) {
        setSelectedTrack(track);
        setAxisValues(track.defaultAxisValues);
        padPosition.value = track.defaultAxisValues;
        play(track);
        setStep('duration');
    }

    function handlePadPosition(x: number, y: number) {
        setAxisValues({ x, y });
        updateAxis(x, y);
    }

    function handleBack() {
        setStep(step === 'tune' ? 'duration' : 'track');
    }

    async function handleStart() {
        if (!selectedTrack || isStarting) return;
        stop();
        setIsStarting(true);
        const store = usePlaybackStore.getState();
        // setSessionMinutes must run after playback is active so it can read isPlaying to start the timer.
        await store.playTrack(selectedTrack, axisValues);
        store.setSessionMinutes(selectedMinutes);
        router.replace('/player');
    }

    const trackSummaryContent = selectedTrack && (
        <>
            <View style={styles.selectedTrackIcon}>
                <Ionicons name={CATEGORY_ICONS[selectedTrack.category]} size={18} color={COLORS.accent} />
            </View>
            <View>
                <Text style={styles.selectedTrackTitle}>{selectedTrack.name}</Text>
                <Text style={styles.selectedTrackMeta}>{selectedTrack.mode === 'relax' ? 'Relax' : 'Focus'}</Text>
            </View>
        </>
    );

    return (
        <ModalSheet>
            <StatusBar style="light" />

            <View style={styles.content}>
                {/* HEADER */}
                <View style={styles.header}>
                    {step === 'track' && <Text style={styles.title}>Choose a sound</Text>}
                </View>

                {/* STEP 1 · TRACK */}
                {step === 'track' && (
                    <Animated.View entering={FadeIn.duration(200)} style={{ flex: 1 }}>
                        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                            {tracks.length === 0 ? (
                                <ActivityIndicator style={{ marginTop: 20 }} color={COLORS.accent} />
                            ) : (
                                <TrackGrid
                                    tracks={tracks}
                                    activeSlug={playingSlug}
                                    loadingSlug={loadingSlug}
                                    onSelect={handleSelectTrack}
                                />
                            )}
                        </ScrollView>
                    </Animated.View>
                )}

                {/* STEP 2 · DURATION */}
                {step === 'duration' && selectedTrack && (
                    <Animated.View entering={FadeIn.duration(200)} style={{ flex: 1 }}>
                        <View style={styles.stepBody}>
                            <PressableScale style={styles.selectedTrackCard} onPress={handleBack}>
                                {trackSummaryContent}
                            </PressableScale>

                            <Text style={styles.sectionLabel}>SESSION LENGTH</Text>
                            <View style={styles.durationGrid}>
                                {DURATION_ROWS.map((row, rowIndex) => (
                                    <View key={rowIndex} style={styles.durationGridRow}>
                                        {row.map((duration) => {
                                            const isActive = selectedMinutes === duration.minutes;
                                            return (
                                                <PressableScale
                                                    key={duration.value + duration.unit}
                                                    style={[styles.durationTile, isActive && styles.durationTileActive]}
                                                    onPress={() => setSelectedMinutes(duration.minutes)}
                                                >
                                                    <Text style={[styles.durationTileValue, isActive && styles.durationTileValueActive]}>
                                                        {duration.value}
                                                    </Text>
                                                    <Text style={[styles.durationTileUnit, isActive && styles.durationTileUnitActive]}>
                                                        {duration.unit}
                                                    </Text>
                                                </PressableScale>
                                            );
                                        })}
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.footer}>
                            <PressableScale
                                style={[styles.startButton, isStarting && styles.startButtonDisabled]}
                                onPress={handleStart}
                            >
                                {isStarting ? (
                                    <ActivityIndicator color={COLORS.accent} />
                                ) : (
                                    <Text style={styles.startButtonText}>Start session</Text>
                                )}
                            </PressableScale>
                            <PressableScale style={styles.secondaryButton} onPress={() => setStep('tune')}>
                                <Text style={styles.secondaryButtonText}>Customize tune</Text>
                            </PressableScale>
                        </View>
                    </Animated.View>
                )}

                {/* STEP 3 · TUNE */}
                {step === 'tune' && selectedTrack && (
                    <Animated.View entering={FadeIn.duration(200)} style={{ flex: 1 }}>
                        <View style={styles.stepBody}>
                            <View style={styles.selectedTrackCard}>
                                {trackSummaryContent}
                            </View>

                            <View style={styles.padWrap}>
                                <AxisPad size={padSize} position={padPosition} onPositionChange={handlePadPosition} />
                            </View>
                        </View>

                        <View style={styles.footer}>
                            <PressableScale style={styles.startButton} onPress={handleBack}>
                                <Text style={styles.startButtonText}>Set tune</Text>
                            </PressableScale>
                        </View>
                    </Animated.View>
                )}
            </View>
        </ModalSheet>
    );
}
