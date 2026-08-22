import { Directory, File, Paths } from 'expo-file-system';
import { STEM_LAYERS, StemLayer, Track } from '@/src/data/tracks';

function trackDirectory(trackId: string) {
    return new Directory(Paths.document, 'offline-tracks', trackId);
}

// Preserves remote file extension (m4a/aac/mp3) for native audio decoding
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

// Downloads all 4 stem files for offline playback with progress reporting
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

// Returns local file URI if downloaded offline, otherwise falls back to remote Storage URL
export function resolvePlaybackStemUrls(track: Track): Record<StemLayer, string> {
    const urls = {} as Record<StemLayer, string>;
    for (const layer of STEM_LAYERS) {
        const remoteUrl = track.stemUrls[layer];
        const file = stemFile(track.id, layer, remoteUrl);
        urls[layer] = file.exists ? file.uri : remoteUrl;
    }
    return urls;
}
