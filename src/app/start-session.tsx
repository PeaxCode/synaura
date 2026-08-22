import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ComponentProps, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, useSharedValue } from 'react-native-reanimated';
import createStyles from '@/src/assets/styles/start-session.styles';
import AxisPad from '@/src/components/AxisPad';
import ModalSheet from '@/src/components/ModalSheet';
import PressableScale from '@/src/components/PressableScale';
import TrackArtwork from '@/src/components/TrackArtwork';
import TrackGrid from '@/src/components/TrackGrid';
import { ACTIVITIES, ActivitySlug } from '@/src/data/activities';
import { LAST_SESSION_DURATION_KEY } from '@/src/constants/storage';
import { COLORS } from '@/src/constants/theme';
import { fetchPresetById } from '@/src/data/library';
import { AxisValues, Category, Mode, Track, fetchTrackById } from '@/src/data/tracks';
import { useTrackPreview } from '@/src/hooks/useTrackPreview';
import { usePlaybackStore } from '@/src/store/playbackStore';
import { useTracksStore } from '@/src/store/tracksStore';

type IoniconName = ComponentProps<typeof Ionicons>['name'];
type Step = 'track' | 'duration' | 'tune';
type TimerType = 'continuous' | 'cycles';
type CycleRhythm = 'classic' | 'deep';

const CATEGORY_ICONS: Record<Category, IoniconName> = {
    nature: 'leaf-outline',
    acoustic: 'musical-notes-outline',
    instrumental: 'disc-outline',
    lofi: 'headset-outline',
};

const DURATIONS: { value: string; unit: string; minutes: number | null }[] = [
    { value: '10', unit: 'min', minutes: 10 },
    { value: '25', unit: 'min', minutes: 25 },
    { value: '45', unit: 'min', minutes: 45 },
    { value: '60', unit: 'min', minutes: 60 },
    { value: '90', unit: 'min', minutes: 90 },
    { value: '∞', unit: 'No limit', minutes: null },
];

const DURATION_ROWS = [DURATIONS.slice(0, 2), DURATIONS.slice(2, 4), DURATIONS.slice(4, 6)];

const CLASSIC_CYCLES: { value: string; unit: string; minutes: number | null }[] = [
    { value: '2', unit: 'Cycles · 1h', minutes: 60 },
    { value: '3', unit: 'Cycles · 1.5h', minutes: 90 },
    { value: '4', unit: 'Cycles · 2h', minutes: 120 },
    { value: '∞', unit: 'Endless Flow', minutes: null },
];

const CLASSIC_ROWS = [CLASSIC_CYCLES.slice(0, 2), CLASSIC_CYCLES.slice(2, 4)];

const DEEP_CYCLES: { value: string; unit: string; minutes: number | null }[] = [
    { value: '1', unit: 'Deep · 1h', minutes: 60 },
    { value: '2', unit: 'Deep · 2h', minutes: 120 },
    { value: '3', unit: 'Deep · 3h', minutes: 180 },
    { value: '∞', unit: 'Endless Flow', minutes: null },
];

const DEEP_ROWS = [DEEP_CYCLES.slice(0, 2), DEEP_CYCLES.slice(2, 4)];

const PAD_SIZE_MAX = 260;

// Orchestrates the session creation flow: picking a track, setting a duration, and optionally tuning the mix before starting.
export default function StartSessionScreen() {
    const styles = createStyles(COLORS);
    const { width } = useWindowDimensions();
    const params = useLocalSearchParams<{ presetId?: string; trackId?: string; mode?: string; axisX?: string; axisY?: string; activity?: string }>();
    const [step, setStep] = useState<Step>(params.presetId || params.trackId ? 'duration' : 'track');
    const [timerType, setTimerType] = useState<TimerType>('continuous');
    const [cycleRhythm, setCycleRhythm] = useState<CycleRhythm>('classic');
    const currentActivity = ACTIVITIES.find((a) => a.slug === params.activity);

    // Set when arriving from a Home "Quick Start" activity card — suggests a
    // starting pad position for whichever track gets picked, instead of
    // skipping the pad (which would collapse into a fixed-category picker).
    const initialMode: Mode = params.mode === 'relax' ? 'relax' : 'focus';
    const suggestedAxis: AxisValues | null =
        params.axisX && params.axisY ? { x: parseFloat(params.axisX), y: parseFloat(params.axisY) } : null;
    const tracks = useTracksStore((state) => state.tracks);
    const isLoadingTracks = useTracksStore((state) => state.isLoading);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    const [selectedMinutes, setSelectedMinutes] = useState<number | null>(25);
    const [resumePresetId, setResumePresetId] = useState<string | null>(null);
    const [isStarting, setIsStarting] = useState(false);
    const [axisValues, setAxisValues] = useState<AxisValues>({ x: 0.5, y: 0.5 });
    const padPosition = useSharedValue<AxisValues>({ x: 0.5, y: 0.5 });
    const { playingSlug, loadingSlug, play, stop, updateAxis } = useTrackPreview();

    useEffect(() => {
        useTracksStore.getState().ensureLoaded();
        // Load smart default for session duration
        if (!params.presetId) {
            AsyncStorage.getItem(LAST_SESSION_DURATION_KEY).then((stored) => {
                if (stored !== null) {
                    setSelectedMinutes(stored === 'null' ? null : parseInt(stored, 10));
                }
            }).catch(() => { });
        }
    }, []);


    // Replaying anything opened from Library (a saved tune, or a plain track
    // from Favorites/Downloads/Recent) — skip track selection, land straight
    // on "Session length" so a duration always has to be (re)confirmed
    // instead of silently reusing/defaulting one for this particular replay.
    useEffect(() => {
        if (!params.presetId && !params.trackId) return;
        let cancelled = false;

        async function load() {
            if (params.presetId) {
                const preset = await fetchPresetById(params.presetId!);
                if (cancelled || !preset?.trackId) return;
                const track = await fetchTrackById(preset.trackId);
                if (cancelled || !track) return;
                setSelectedTrack(track);
                setAxisValues(preset.axisValues);
                padPosition.value = preset.axisValues;
                setSelectedMinutes(preset.durationMinutes);
                setResumePresetId(preset.id);
            } else if (params.trackId) {
                const track = await fetchTrackById(params.trackId);
                if (cancelled || !track) return;
                setSelectedTrack(track);
                setAxisValues(track.defaultAxisValues);
                padPosition.value = track.defaultAxisValues;
            }
        }

        load().catch(() => { });
        return () => { cancelled = true; };
    }, [params.presetId, params.trackId]);

    const padSize = Math.min(PAD_SIZE_MAX, width - 56 - 44);

    function handleSelectTrack(track: Track) {
        const startingAxis = suggestedAxis ?? track.defaultAxisValues;
        setSelectedTrack(track);
        setAxisValues(startingAxis);
        padPosition.value = startingAxis;
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
        // Persist smart default
        AsyncStorage.setItem(LAST_SESSION_DURATION_KEY, String(selectedMinutes ?? 'null')).catch(() => { });

        const store = usePlaybackStore.getState();
        const playing = store.playTrack(selectedTrack, axisValues, resumePresetId ?? undefined);
        router.replace('/player');
        // setSessionMinutes must run after playback is active so it can read isPlaying to start the timer.
        await playing;
        store.setSessionMinutes(selectedMinutes, timerType, cycleRhythm);
    }

    const trackSummaryContent = selectedTrack && (
        <>
            <TrackArtwork
                category={selectedTrack.category}
                mode={selectedTrack.mode}
                size="thumb"
            />
            <View style={{ gap: 2 }}>
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
                            {tracks.length === 0 && isLoadingTracks ? (
                                <ActivityIndicator style={{ marginTop: 20 }} color={COLORS.accent} />
                            ) : (
                                <TrackGrid
                                    tracks={tracks}
                                    activeSlug={playingSlug}
                                    loadingSlug={loadingSlug}
                                    onSelect={handleSelectTrack}
                                    initialMode={initialMode}
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

                            {/* TIMER TYPE TOGGLE — Continuous vs Flow Cycles */}
                            <View style={styles.timerTypeToggle}>
                                <PressableScale
                                    style={[styles.timerTypeButton, timerType === 'continuous' && styles.timerTypeButtonActive]}
                                    onPress={() => {
                                        setTimerType('continuous');
                                        if (selectedMinutes === null || selectedMinutes % 5 !== 0) setSelectedMinutes(25);
                                    }}
                                >
                                    <Text style={[styles.timerTypeButtonLabel, timerType === 'continuous' && styles.timerTypeButtonLabelActive]}>
                                        Continuous Timer
                                    </Text>
                                </PressableScale>
                                <PressableScale
                                    style={[styles.timerTypeButton, timerType === 'cycles' && styles.timerTypeButtonActive]}
                                    onPress={() => {
                                        setTimerType('cycles');
                                        if (selectedMinutes === null || selectedMinutes < 60) setSelectedMinutes(60);
                                    }}
                                >
                                    <Text style={[styles.timerTypeButtonLabel, timerType === 'cycles' && styles.timerTypeButtonLabelActive]}>
                                        Flow Cycles
                                    </Text>
                                </PressableScale>
                            </View>

                            {/* SUB-RHYTHM SWITCHER (When in Flow Cycles) */}
                            {timerType === 'cycles' && (
                                <View style={styles.rhythmRow}>
                                    <PressableScale
                                        style={[styles.rhythmChip, cycleRhythm === 'classic' && styles.rhythmChipActive]}
                                        onPress={() => {
                                            setCycleRhythm('classic');
                                            setSelectedMinutes(60);
                                        }}
                                    >
                                        <Ionicons name="timer-outline" size={13} color={cycleRhythm === 'classic' ? COLORS.accent : COLORS.neutral[400]} />
                                        <Text style={[styles.rhythmChipText, cycleRhythm === 'classic' && styles.rhythmChipTextActive]}>
                                            Classic (25/5m)
                                        </Text>
                                    </PressableScale>

                                    <PressableScale
                                        style={[styles.rhythmChip, cycleRhythm === 'deep' && styles.rhythmChipActive]}
                                        onPress={() => {
                                            setCycleRhythm('deep');
                                            setSelectedMinutes(60);
                                        }}
                                    >
                                        <Ionicons name="flash-outline" size={13} color={cycleRhythm === 'deep' ? COLORS.accent : COLORS.neutral[400]} />
                                        <Text style={[styles.rhythmChipText, cycleRhythm === 'deep' && styles.rhythmChipTextActive]}>
                                            Deep Work (50/10m)
                                        </Text>
                                    </PressableScale>
                                </View>
                            )}

                            <Text style={styles.sectionLabel}>
                                {timerType === 'continuous'
                                    ? 'SESSION LENGTH'
                                    : cycleRhythm === 'classic'
                                    ? 'CLASSIC SPRINTS (25M FOCUS / 5M REST)'
                                    : 'DEEP WORK BLOCKS (50M FOCUS / 10M REST)'}
                            </Text>

                            <View style={styles.durationGrid}>
                                {(timerType === 'continuous'
                                    ? DURATION_ROWS
                                    : (cycleRhythm === 'classic' ? CLASSIC_ROWS : DEEP_ROWS)
                                ).map((row, rowIndex) => (
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
