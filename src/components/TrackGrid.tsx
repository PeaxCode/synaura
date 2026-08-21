import { useState } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import createStyles from '@/src/assets/styles/track-grid.styles';
import MiniEqualizer from '@/src/components/MiniEqualizer';
import PressableScale from '@/src/components/PressableScale';
import { COLORS } from '@/src/constants/theme';
import { CATEGORIES, Category, Mode, MODES, Track, tracksByMode } from '@/src/data/tracks';

const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.label])) as Record<Category, string>;

interface Props {
    tracks: Track[];
    activeSlug: string | null;
    loadingSlug: string | null;
    onSelect: (track: Track) => void;
    cardBackground?: string;
}

// Renders a 2-column grid of tracks filtered by mode, used in Explore and session builder screens.
export default function TrackGrid({ tracks, activeSlug, loadingSlug, onSelect, cardBackground = COLORS.surfaceElevated }: Props) {
    const styles = createStyles(COLORS);
    const [mode, setMode] = useState<Mode>('focus');
    const modeTracks = tracksByMode(tracks, mode);
    // Removed layout measurement since we don't render art anymore

    return (
        <View>
            {/* MODE TOGGLE */}
            <View style={styles.modeToggle}>
                {MODES.map((m) => {
                    const isActive = mode === m.slug;
                    return (
                        <PressableScale
                            key={m.slug}
                            style={[styles.modeButton, isActive && styles.modeButtonActive]}
                            onPress={() => setMode(m.slug)}
                        >
                            <Text style={[styles.modeButtonLabel, isActive && styles.modeButtonLabelActive]}>{m.label}</Text>
                        </PressableScale>
                    );
                })}
            </View>

            {/* TRACK GRID */}
            <View style={styles.grid}>
                {modeTracks.map((track) => {
                    const isActive = activeSlug === track.slug;
                    const isBuffering = loadingSlug === track.slug;

                    return (
                        <PressableScale
                            key={track.slug}
                            style={[styles.trackCard, { backgroundColor: cardBackground }, isActive && styles.trackCardActive]}
                            onPress={() => onSelect(track)}
                        >
                            <View style={[styles.trackCardArt, isActive && styles.trackCardArtActive]}>
                                {/* Future: users can upload their own images here */}
                            </View>
                            <View style={styles.trackCardBody}>
                                <Text style={styles.trackCardTitle} numberOfLines={1}>{track.name}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    {isActive && !isBuffering && <MiniEqualizer />}
                                    <Text style={styles.trackCardMeta}>
                                        {isBuffering ? 'Loading…' : isActive ? 'Playing' : `${CATEGORY_LABELS[track.category]} · ${Math.round(track.durationSeconds)}s`}
                                    </Text>
                                </View>
                            </View>
                        </PressableScale>
                    );
                })}
            </View>
        </View>
    );
}
