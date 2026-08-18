import { supabase } from '@/src/data/client';
import { useEffect, useRef } from 'react';
import { AudioBuffer, AudioBufferSourceNode, AudioContext, BiquadFilterNode, GainNode } from 'react-native-audio-api';

const PREVIEW_TRACK_PATH = 'preview/onboarding-tone.mp3';
const FADE_IN_SECONDS = 0.6;
const FADE_OUT_SECONDS = 0.35;
const PREVIEW_GAIN = 0.9;
const FILTER_SMOOTH_SECONDS = 0.08;
const RATE_SMOOTH_SECONDS = 0.12;
const FILTER_MIN_HZ = 400;
const FILTER_MAX_HZ = 18000;
const RATE_MIN = 0.82;
const RATE_MAX = 1.18;

function frequencyForX(x: number) {
    const t = Math.min(1, Math.max(0, x));
    return FILTER_MAX_HZ * (FILTER_MIN_HZ / FILTER_MAX_HZ) ** t;
}

function playbackRateForY(y: number) {
    const t = Math.min(1, Math.max(0, y));
    return RATE_MAX - (RATE_MAX - RATE_MIN) * t;
}

export function useMoodPreviewSound(active: boolean) {
    const contextRef = useRef<AudioContext | null>(null);
    const bufferRef = useRef<AudioBuffer | null>(null);
    const bufferPromiseRef = useRef<Promise<AudioBuffer> | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const filterRef = useRef<BiquadFilterNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);
    const startedRef = useRef(false);

    useEffect(() => {
        const context = new AudioContext();
        contextRef.current = context;

        async function preload() {
            await context.resume();
            const { data } = supabase.storage.from('stems').getPublicUrl(PREVIEW_TRACK_PATH);
            const buffer = await context.decodeAudioData(data.publicUrl);
            bufferRef.current = buffer;
            return buffer;
        }

        bufferPromiseRef.current = preload();
        bufferPromiseRef.current.catch((err) => console.warn('[useMoodPreviewSound] failed to preload preview audio', err));

        return () => {
            contextRef.current = null;
            context.close().catch(() => { });
        };
    }, []);

    useEffect(() => {
        if (!active) return;

        const context = contextRef.current;
        if (!context) return;

        let cancelled = false;

        async function start(ctx: AudioContext) {
            const buffer = bufferRef.current ?? (await bufferPromiseRef.current);
            if (cancelled || !buffer) return;

            const source = ctx.createBufferSource({ pitchCorrection: false });
            source.buffer = buffer;
            source.loop = true;
            source.loopStart = buffer.duration / 2;
            source.loopEnd = buffer.duration;

            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = FILTER_MAX_HZ;
            filter.Q.value = 0.7;

            const gain = ctx.createGain();
            gain.gain.value = 0;

            source.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            source.start(ctx.currentTime, buffer.duration / 2);
            gain.gain.linearRampToValueAtTime(PREVIEW_GAIN, ctx.currentTime + FADE_IN_SECONDS);

            sourceRef.current = source;
            filterRef.current = filter;
            gainRef.current = gain;
            startedRef.current = true;
        }

        start(context).catch((err) => console.warn('[useMoodPreviewSound] failed to start preview audio', err));

        return () => {
            cancelled = true;

            if (startedRef.current && gainRef.current && sourceRef.current) {
                const now = context.currentTime;
                gainRef.current.gain.cancelScheduledValues(now);
                gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, now);
                gainRef.current.gain.linearRampToValueAtTime(0, now + FADE_OUT_SECONDS);
                sourceRef.current.stop(now + FADE_OUT_SECONDS);
            }

            startedRef.current = false;
            sourceRef.current = null;
            filterRef.current = null;
            gainRef.current = null;
        };
    }, [active]);

    function updatePosition(x: number, y: number) {
        const filter = filterRef.current;
        const source = sourceRef.current;
        const context = contextRef.current;
        if (!filter || !source || !context) return;

        const now = context.currentTime;
        filter.frequency.setTargetAtTime(frequencyForX(x), now, FILTER_SMOOTH_SECONDS);
        source.playbackRate.setTargetAtTime(playbackRateForY(y), now, RATE_SMOOTH_SECONDS);
    }

    return { updatePosition };
}
