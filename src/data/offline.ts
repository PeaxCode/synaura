import { Directory, File, Paths } from 'expo-file-system';
import { STEM_LAYERS, StemLayer, Track } from '@/src/data/tracks';

function trackDirectory(trackId: string) {
    return new Directory(Paths.document, 'offline-tracks', trackId);
}

// Stem layers aren't all the same remote format any more (real track vs. the
// procedural silence loop on the other 3, see 21.08 roadmap note) — the local
// file keeps whatever extension the source actually has instead of assuming
// mp3, so the native decoder isn't handed a mislabeled file.
function extensionFromUrl(url: string): string {
    const match = /\.([a-zA-Z0-9]+)(?:\?.*)?$/.exec(url);
    return match ? match[1] : 'mp3';
}

function stemFile(trackId: string, layer: StemLayer, remoteUrl: string) {
    return new File(trackDirectory(trackId), `${layer}.${extensionFromUrl(remoteUrl)}`);
}

export function isTrackOffline(track: Track): boolean {
    return STEM_LAYERS.every((layer) => stemFile(track.id, layer, track.stemUrls[layer]).exists);
}

// Downloads all 4 stem files for a track to local storage — no entitlement
// check here (Faz 4.1/RevenueCat isn't wired up yet), the caller gates access.
// `onProgress` reports the average fraction complete across all 4 layers.
export async function downloadTrackOffline(track: Track, onProgress?: (fraction: number) => void): Promise<void> {
    const dir = trackDirectory(track.id);
    if (!dir.exists) dir.create({ intermediates: true, idempotent: true });

    const progressByLayer: Partial<Record<StemLayer, number>> = {};
    function reportProgress() {
        if (!onProgress) return;
        const total = STEM_LAYERS.reduce((sum, layer) => sum + (progressByLayer[layer] ?? 0), 0);
        onProgress(total / STEM_LAYERS.length);
    }

    await Promise.all(
        STEM_LAYERS.map((layer) =>
            File.downloadFileAsync(track.stemUrls[layer], stemFile(track.id, layer, track.stemUrls[layer]), {
                onProgress: ({ bytesWritten, totalBytes }) => {
                    progressByLayer[layer] = totalBytes > 0 ? bytesWritten / totalBytes : 0;
                    reportProgress();
                },
            }),
        ),
    );
    onProgress?.(1);
}

export function removeTrackOffline(trackId: string): void {
    const dir = trackDirectory(trackId);
    if (dir.exists) dir.delete();
}

// What the audio engine should actually decode from — a local file for any
// layer that's been downloaded, the remote Storage URL otherwise. A partial
// download (e.g. interrupted mid-way) just falls back per-layer instead of
// blocking playback entirely.
export function resolvePlaybackStemUrls(track: Track): Record<StemLayer, string> {
    const urls = {} as Record<StemLayer, string>;
    for (const layer of STEM_LAYERS) {
        const remoteUrl = track.stemUrls[layer];
        const file = stemFile(track.id, layer, remoteUrl);
        urls[layer] = file.exists ? file.uri : remoteUrl;
    }
    return urls;
}
