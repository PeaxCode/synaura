import { StemVoice, decodeTrackBuffers, fadeOutAndClose, startVoices } from '@/src/data/audioEngine';
import { STEM_LAYERS, StemLayer, Track, mixForAxis } from '@/src/data/tracks';
import { useEffect, useRef, useState } from 'react';
import { AudioContext } from 'react-native-audio-api';

// Manages local, isolated audio playback for previewing tracks before starting a full session.
export function useTrackPreview() {
    const contextRef = useRef<AudioContext | null>(null);
    const voicesRef = useRef<Partial<Record<StemLayer, StemVoice>>>({});
    const tokenRef = useRef(0);

    const [playingSlug, setPlayingSlug] = useState<string | null>(null);
    const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

    function stop() {
        tokenRef.current += 1;
        const context = contextRef.current;
        const voices = voicesRef.current;
        contextRef.current = null;
        voicesRef.current = {};
        setPlayingSlug(null);
        setLoadingSlug(null);
        if (context) fadeOutAndClose(context, voices);
    }

    async function play(track: Track) {
        stop();
        const token = tokenRef.current;
        setLoadingSlug(track.slug);

        const context = new AudioContext();
        await context.resume();
        const buffers = await decodeTrackBuffers(context, track);

        if (tokenRef.current !== token) {
            context.close().catch(() => { });
            return;
        }

        const { voices } = startVoices(context, track, track.defaultAxisValues, buffers, 0);
        contextRef.current = context;
        voicesRef.current = voices;
        setLoadingSlug(null);
        setPlayingSlug(track.slug);
    }

    function updateAxis(x: number, y: number) {
        const context = contextRef.current;
        if (!context) return;

        const gains = mixForAxis(x, y);
        const now = context.currentTime;
        for (const layer of STEM_LAYERS) {
            const voice = voicesRef.current[layer];
            if (voice) voice.gain.gain.setTargetAtTime(gains[layer], now, 0.15);
        }
    }

    useEffect(() => () => stop(), []);

    return { playingSlug, loadingSlug, play, stop, updateAxis };
}
