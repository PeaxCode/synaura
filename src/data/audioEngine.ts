import { AxisValues, STEM_LAYERS, StemLayer, Track, mixForAxis } from '@/src/data/tracks';
import { AudioBuffer, AudioBufferSourceNode, AudioContext, GainNode } from 'react-native-audio-api';

export const FADE_IN_SECONDS = 1.2;
export const FADE_OUT_SECONDS = 1.0;
export const START_LEAD_SECONDS = 0.15;

export interface StemVoice {
    source: AudioBufferSourceNode;
    gain: GainNode;
}

// In-memory LRU cache for decoded stem AudioBuffers (max 6 tracks)
const MAX_CACHED_TRACKS = 6;
const bufferCache = new Map<string, Record<StemLayer, AudioBuffer>>();

// Decodes raw audio file URLs into AudioBuffers with in-memory caching
export async function decodeTrackBuffers(context: AudioContext, track: Track) {
    const cached = bufferCache.get(track.id);
    if (cached) {
        // Re-insert to keep LRU order
        bufferCache.delete(track.id);
        bufferCache.set(track.id, cached);
        return cached;
    }

    const decoded = await Promise.all(STEM_LAYERS.map((layer) => context.decodeAudioData(track.stemUrls[layer])));
    const buffers = {} as Record<StemLayer, AudioBuffer>;
    STEM_LAYERS.forEach((layer, i) => { buffers[layer] = decoded[i]; });

    bufferCache.set(track.id, buffers);
    if (bufferCache.size > MAX_CACHED_TRACKS) {
        const oldestKey = bufferCache.keys().next().value;
        if (oldestKey !== undefined) bufferCache.delete(oldestKey);
    }

    return buffers;
}

// Initializes audio sources and gain nodes for all layers, starting them with a synchronized fade-in.
export function startVoices(
    context: AudioContext,
    track: Track,
    axis: AxisValues,
    buffers: Partial<Record<StemLayer, AudioBuffer>>,
    offsetSeconds: number,
) {
    const gains = mixForAxis(axis.x, axis.y);
    const startAt = context.currentTime + START_LEAD_SECONDS;
    const offset = offsetSeconds % track.durationSeconds;
    const voices = {} as Record<StemLayer, StemVoice>;

    for (const layer of STEM_LAYERS) {
        const source = context.createBufferSource();
        source.buffer = buffers[layer] ?? null;
        source.loop = true;

        const gain = context.createGain();
        gain.gain.value = 0;

        source.connect(gain);
        gain.connect(context.destination);
        source.start(startAt, offset);
        gain.gain.setValueAtTime(0, startAt);
        gain.gain.linearRampToValueAtTime(gains[layer], startAt + FADE_IN_SECONDS);

        voices[layer] = { source, gain };
    }

    return { voices, startAt };
}

// Schedules a smooth fade-out for all active stems before shutting down the audio context.
export function fadeOutAndClose(context: AudioContext, voices: Partial<Record<StemLayer, StemVoice>>) {
    const now = context.currentTime;
    for (const layer of STEM_LAYERS) {
        const voice = voices[layer];
        if (!voice) continue;
        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
        voice.gain.gain.linearRampToValueAtTime(0, now + FADE_OUT_SECONDS);
        voice.source.stop(now + FADE_OUT_SECONDS);
    }
    setTimeout(() => context.close().catch(() => { }), FADE_OUT_SECONDS * 1000 + 100);
}
