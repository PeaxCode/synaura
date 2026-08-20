import { StemVoice, decodeTrackBuffers, fadeOutAndClose, startVoices } from '@/src/data/audioEngine';
import { logPresetPlay } from '@/src/data/library';
import { AxisValues, STEM_LAYERS, StemLayer, Track, mixForAxis } from '@/src/data/tracks';
import { useAuthStore } from '@/src/store/authStore';
import { AudioBuffer, AudioContext } from 'react-native-audio-api';
import { create } from 'zustand';

const GAIN_SMOOTH_SECONDS = 0.15;
const MIN_LOGGABLE_SECONDS = 3;

interface PlaybackState {
    context: AudioContext | null;
    voices: Partial<Record<StemLayer, StemVoice>>;
    buffers: Partial<Record<StemLayer, AudioBuffer>>;
    currentTrack: Track | null;
    currentPresetId: string | null;
    axisValues: AxisValues;
    isLoading: boolean;
    isPlaying: boolean;
    loadToken: number;
    sessionMinutes: number | null;
    sessionEndAt: number | null;
    sessionTimer: ReturnType<typeof setTimeout> | null;
    pausedRemainingMs: number | null;
    playbackStartedAt: number;
    pausedOffsetSeconds: number;
    sessionPlaySeconds: number;
    playSegmentStartedAt: number | null;
    playTrack: (track: Track, axis?: AxisValues, presetId?: string) => Promise<void>;
    updateAxis: (x: number, y: number) => void;
    setSessionMinutes: (minutes: number | null) => void;
    pause: () => void;
    resume: () => Promise<void>;
    stop: () => void;
}

// Global state for managing background audio playback, stem mixing, and session countdown timers.
export const usePlaybackStore = create<PlaybackState>((set, get) => ({
    context: null,
    voices: {},
    buffers: {},
    currentTrack: null,
    currentPresetId: null,
    axisValues: { x: 0.5, y: 0.5 },
    isLoading: false,
    isPlaying: false,
    loadToken: 0,
    sessionMinutes: null,
    sessionEndAt: null,
    sessionTimer: null,
    pausedRemainingMs: null,
    playbackStartedAt: 0,
    pausedOffsetSeconds: 0,
    sessionPlaySeconds: 0,
    playSegmentStartedAt: null,

    async playTrack(track, axis, presetId) {
        const token = get().loadToken + 1;
        get().stop();
        set({
            loadToken: token,
            isLoading: true,
            currentTrack: track,
            currentPresetId: presetId ?? null,
            sessionPlaySeconds: 0,
            playSegmentStartedAt: Date.now(),
        });

        const context = new AudioContext();
        await context.resume();

        const startAxis = axis ?? track.defaultAxisValues;
        const buffers = await decodeTrackBuffers(context, track);

        if (get().loadToken !== token) {
            context.close().catch(() => { });
            return;
        }

        const { voices, startAt } = startVoices(context, track, startAxis, buffers, 0);

        set({
            context,
            voices,
            buffers,
            axisValues: startAxis,
            isLoading: false,
            isPlaying: true,
            playbackStartedAt: startAt,
            pausedOffsetSeconds: 0,
        });
    },

    updateAxis(x, y) {
        const { context, voices } = get();
        if (!context) return;

        const gains = mixForAxis(x, y);
        const now = context.currentTime;
        for (const layer of STEM_LAYERS) {
            const voice = voices[layer];
            if (voice) voice.gain.gain.setTargetAtTime(gains[layer], now, GAIN_SMOOTH_SECONDS);
        }

        set({ axisValues: { x, y } });
    },

    setSessionMinutes(minutes) {
        const { sessionTimer, isPlaying } = get();
        if (sessionTimer) clearTimeout(sessionTimer);

        if (minutes === null) {
            set({ sessionMinutes: null, sessionEndAt: null, sessionTimer: null, pausedRemainingMs: null });
            return;
        }

        const ms = minutes * 60 * 1000;
        if (isPlaying) {
            const timer = setTimeout(() => get().stop(), ms);
            set({ sessionMinutes: minutes, sessionEndAt: Date.now() + ms, sessionTimer: timer, pausedRemainingMs: null });
        } else {
            set({ sessionMinutes: minutes, sessionEndAt: null, sessionTimer: null, pausedRemainingMs: ms });
        }
    },

    pause() {
        const {
            context, voices, currentTrack, playbackStartedAt, pausedOffsetSeconds,
            sessionEndAt, sessionTimer, sessionPlaySeconds, playSegmentStartedAt,
        } = get();
        if (!context || !currentTrack) return;

        if (sessionTimer) clearTimeout(sessionTimer);
        const pausedRemainingMs = sessionEndAt ? Math.max(0, sessionEndAt - Date.now()) : null;

        const elapsed = Math.max(0, context.currentTime - playbackStartedAt);
        const totalOffset = (pausedOffsetSeconds + elapsed) % currentTrack.durationSeconds;
        const segmentSeconds = playSegmentStartedAt ? (Date.now() - playSegmentStartedAt) / 1000 : 0;

        fadeOutAndClose(context, voices);
        set({
            context: null,
            voices: {},
            isPlaying: false,
            pausedOffsetSeconds: totalOffset,
            sessionEndAt: null,
            sessionTimer: null,
            pausedRemainingMs,
            sessionPlaySeconds: sessionPlaySeconds + segmentSeconds,
            playSegmentStartedAt: null,
        });
    },

    async resume() {
        const { currentTrack, buffers, axisValues, pausedOffsetSeconds, pausedRemainingMs, loadToken } = get();
        if (!currentTrack || Object.keys(buffers).length === 0) return;

        const token = loadToken + 1;
        set({ loadToken: token, isLoading: true });

        const context = new AudioContext();
        await context.resume();

        if (get().loadToken !== token) {
            context.close().catch(() => { });
            return;
        }

        const { voices, startAt } = startVoices(context, currentTrack, axisValues, buffers, pausedOffsetSeconds);

        const sessionTimer = pausedRemainingMs === null ? null : setTimeout(() => get().stop(), pausedRemainingMs);
        const sessionEndAt = pausedRemainingMs === null ? null : Date.now() + pausedRemainingMs;

        set({
            context,
            voices,
            isLoading: false,
            isPlaying: true,
            playbackStartedAt: startAt,
            sessionEndAt,
            sessionTimer,
            pausedRemainingMs: null,
            playSegmentStartedAt: Date.now(),
        });
    },

    stop() {
        const {
            context, voices, loadToken, sessionTimer,
            currentTrack, currentPresetId, sessionPlaySeconds, playSegmentStartedAt,
        } = get();
        if (sessionTimer) clearTimeout(sessionTimer);

        if (currentTrack) {
            const segmentSeconds = playSegmentStartedAt ? (Date.now() - playSegmentStartedAt) / 1000 : 0;
            const totalSeconds = Math.round(sessionPlaySeconds + segmentSeconds);
            const userId = useAuthStore.getState().user?.id;
            if (userId && totalSeconds >= MIN_LOGGABLE_SECONDS) {
                logPresetPlay({
                    userId,
                    trackId: currentTrack.id,
                    presetId: currentPresetId,
                    durationSeconds: totalSeconds,
                }).catch(() => { });
            }
        }

        set({
            loadToken: loadToken + 1,
            context: null,
            voices: {},
            buffers: {},
            currentTrack: null,
            currentPresetId: null,
            isPlaying: false,
            isLoading: false,
            sessionMinutes: null,
            sessionEndAt: null,
            sessionTimer: null,
            pausedRemainingMs: null,
            playbackStartedAt: 0,
            pausedOffsetSeconds: 0,
            sessionPlaySeconds: 0,
            playSegmentStartedAt: null,
        });
        if (!context) return;

        fadeOutAndClose(context, voices);
    },
}));
