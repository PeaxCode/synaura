import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import createStyles from '@/src/assets/styles/track-grid.styles';
import PressableScale from '@/src/components/PressableScale';
import TrackArtwork from '@/src/components/TrackArtwork';
import { COLORS } from '@/src/constants/theme';
import { isTrackOffline } from '@/src/data/offline';
import { CATEGORIES, Category, Mode, MODES, Track, TRACK_DESCRIPTIONS, tracksByMode } from '@/src/data/tracks';

const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.label])) as Record<Category, string>;

interface Props {
    tracks: Track[];
    activeSlug: string | null;
    loadingSlug: string | null;
    onSelect: (track: Track) => void;
    cardBackground?: string;
    initialMode?: Mode;
}

// Renders a 2-column grid of tracks filtered by mode and category, used in Explore and session builder screens.
export default function TrackGrid({
    tracks,
    activeSlug,
    loadingSlug,
    onSelect,
    cardBackground = COLORS.surfaceElevated,
    initialMode = 'focus',
}: Props) {
    const styles = createStyles(COLORS);
    const [mode, setMode] = useState<Mode>(initialMode);
    const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

    const modeTracks = tracksByMode(tracks, mode);
    
    // Only display categories that actually contain tracks in the selected mode
    const presentCategories = new Set(modeTracks.map((t) => t.category));
    const availableCategories = CATEGORIES.filter((c) => presentCategories.has(c.slug));

    function handleModeChange(newMode: Mode) {
        setMode(newMode);
        setSelectedCategory('all');
    }

    const filteredTracks = selectedCategory === 'all'
        ? modeTracks
        : modeTracks.filter((t) => t.category === selectedCategory);

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
                            onPress={() => handleModeChange(m.slug)}
                        >
                            <Text style={[styles.modeButtonLabel, isActive && styles.modeButtonLabelActive]}>{m.label}</Text>
                        </PressableScale>
                    );
                })}
            </View>

            {/* CATEGORY REFINE FILTER CHIPS */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryFilterScroll}
            >
                <PressableScale
                    style={[styles.categoryChip, selectedCategory === 'all' && styles.categoryChipActive]}
                    onPress={() => setSelectedCategory('all')}
                >
                    <Text style={[styles.categoryChipLabel, selectedCategory === 'all' && styles.categoryChipLabelActive]}>
                        All ({modeTracks.length})
                    </Text>
                </PressableScale>
                {availableCategories.map((cat) => {
                    const isSelected = selectedCategory === cat.slug;
                    const count = modeTracks.filter((t) => t.category === cat.slug).length;
                    return (
                        <PressableScale
                            key={cat.slug}
                            style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                            onPress={() => setSelectedCategory(cat.slug)}
                        >
                            <Text style={[styles.categoryChipLabel, isSelected && styles.categoryChipLabelActive]}>
                                {cat.label} ({count})
                            </Text>
                        </PressableScale>
                    );
                })}
            </ScrollView>

            {/* TRACK GRID */}
            <View style={styles.grid}>
                {filteredTracks.length === 0 ? (
                    <View style={styles.emptyFilterBox}>
                        <Text style={styles.emptyFilterText}>No sounds in this category</Text>
                    </View>
                ) : (
                    filteredTracks.map((track) => {
                        const isActive = activeSlug === track.slug;
                        const isBuffering = loadingSlug === track.slug;
                        const isDownloaded = isTrackOffline(track);

                        return (
                            <PressableScale
                                key={track.slug}
                                style={[styles.trackCard, { backgroundColor: cardBackground }, isActive && styles.trackCardActive]}
                                onPress={() => onSelect(track)}
                            >
                                <TrackArtwork
                                    category={track.category}
                                    mode={track.mode}
                                    isActive={isActive}
                                    isBuffering={isBuffering}
                                    isDownloaded={isDownloaded}
                                    size="card"
                                />
                                <View style={styles.trackCardBody}>
                                    <Text style={styles.trackCardTitle} numberOfLines={1}>{track.name}</Text>
                                    <Text style={styles.trackCardMeta} numberOfLines={1}>
                                        {isBuffering ? 'Loading…' : isActive ? 'Playing' : TRACK_DESCRIPTIONS[track.slug]?.tagline ?? `${CATEGORY_LABELS[track.category]} · ${Math.round(track.durationSeconds)}s`}
                                    </Text>
                                </View>
                            </PressableScale>
                        );
                    })
                )}
            </View>
        </View>
    );
}

