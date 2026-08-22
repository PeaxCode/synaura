import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ComponentProps } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import MiniEqualizer from '@/src/components/MiniEqualizer';
import { COLORS, FONTS, RADIUS } from '@/src/constants/theme';
import { Category, Mode } from '@/src/data/tracks';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface Props {
    category?: Category;
    mode?: Mode;
    imageUrl?: string;
    size?: 'card' | 'thumb' | 'large';
    isActive?: boolean;
    isBuffering?: boolean;
    isDownloaded?: boolean;
}

interface Palette {
    colors: [string, string, string];
    accent: string;
    icon: IoniconName;
    label: string;
}

const PALETTES: Record<Category, Palette> = {
    nature: {
        colors: ['#07241e', '#0f483c', '#041410'],
        accent: '#48d597',
        icon: 'leaf-outline',
        label: 'Nature',
    },
    acoustic: {
        colors: ['#28160a', '#4d2812', '#140a04'],
        accent: '#f59e0b',
        icon: 'musical-notes-outline',
        label: 'Acoustic',
    },
    instrumental: {
        colors: ['#120f30', '#251c5e', '#09071c'],
        accent: '#8b5cf6',
        icon: 'pulse-outline',
        label: 'Instrumental',
    },
    lofi: {
        colors: ['#260d28', '#4b154f', '#120414'],
        accent: '#ec4899',
        icon: 'headset-outline',
        label: 'Lo-Fi',
    },
};

const DEFAULT_FOCUS_PALETTE: Palette = {
    colors: ['#120f30', '#251c5e', '#09071c'],
    accent: COLORS.accent,
    icon: 'musical-notes-outline',
    label: 'Focus Ambient',
};

const DEFAULT_RELAX_PALETTE: Palette = {
    colors: ['#07241e', '#0f483c', '#041410'],
    accent: '#48d597',
    icon: 'leaf-outline',
    label: 'Relax Ambient',
};

export default function TrackArtwork({
    category,
    mode,
    imageUrl,
    size = 'card',
    isActive = false,
    isBuffering = false,
    isDownloaded = false,
}: Props) {
    const palette = (category && PALETTES[category])
        ? PALETTES[category]
        : mode === 'relax'
        ? DEFAULT_RELAX_PALETTE
        : DEFAULT_FOCUS_PALETTE;

    if (size === 'thumb') {
        return (
            <View style={styles.thumbContainer}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={StyleSheet.absoluteFill} />
                ) : (
                    <LinearGradient
                        colors={palette.colors}
                        start={{ x: 0.1, y: 0.1 }}
                        end={{ x: 0.9, y: 0.9 }}
                        style={styles.thumbGradient}
                    >
                        <Ionicons name={palette.icon} size={18} color={palette.accent} />
                    </LinearGradient>
                )}
            </View>
        );
    }

    return (
        <View style={[styles.cardContainer, isActive && styles.cardContainerActive]}>
            {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            ) : (
                <LinearGradient
                    colors={palette.colors}
                    start={{ x: 0.1, y: 0 }}
                    end={{ x: 0.9, y: 1 }}
                    style={styles.cardGradient}
                >
                    {/* AMBIENT BACKGROUND GRAPHIC PATTERNS */}
                    <Svg style={StyleSheet.absoluteFill} viewBox="0 0 160 160">
                        <Circle cx="80" cy="80" r="64" stroke={palette.accent} strokeWidth="1" strokeOpacity="0.08" fill="none" />
                        <Circle cx="80" cy="80" r="46" stroke={palette.accent} strokeWidth="1" strokeOpacity="0.12" strokeDasharray="3 3" fill="none" />
                        <Circle cx="80" cy="80" r="28" stroke={palette.accent} strokeWidth="1" strokeOpacity="0.15" fill="none" />
                    </Svg>

                    {/* AMBIENT CENTER BADGE */}
                    <View style={[styles.centerBadge, { borderColor: `${palette.accent}30` }]}>
                        <Ionicons name={palette.icon} size={24} color={palette.accent} />
                    </View>
                </LinearGradient>
            )}

            {/* TOP MODE TAG */}
            {mode && (
                <View style={styles.modeTag}>
                    <Text style={styles.modeTagText}>{mode === 'relax' ? 'Relax' : 'Focus'}</Text>
                </View>
            )}

            {/* ACTIVE PLAYING / BUFFERING OVERLAY */}
            {isActive && (
                <View style={styles.activeOverlay}>
                    {!isBuffering && (
                        <View style={styles.equalizerBadge}>
                            <MiniEqualizer />
                        </View>
                    )}
                </View>
            )}

            {/* DOWNLOADED BADGE — Bottom Right */}
            {isDownloaded && (
                <View style={styles.downloadedBadge}>
                    <Ionicons name="checkmark-circle" size={11} color={COLORS.accent} />
                    <Text style={styles.downloadedBadgeText}>Saved</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        aspectRatio: 1,
        borderTopLeftRadius: RADIUS.md - 1,
        borderTopRightRadius: RADIUS.md - 1,
        overflow: 'hidden',
        backgroundColor: '#12131e',
    },
    cardContainerActive: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(145,132,217,0.3)',
    },
    cardGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbContainer: {
        width: 44,
        height: 44,
        borderRadius: RADIUS.sm + 2,
        overflow: 'hidden',
        backgroundColor: '#12131e',
    },
    thumbGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    centerBadge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderWidth: 1,
    },
    modeTag: {
        position: 'absolute',
        top: 8,
        right: 8,
        paddingVertical: 2.5,
        paddingHorizontal: 7,
        borderRadius: RADIUS.sm,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    modeTagText: {
        fontSize: 10,
        fontFamily: FONTS.medium,
        color: COLORS.text,
        letterSpacing: 0.2,
    },
    downloadedBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        paddingVertical: 2,
        paddingHorizontal: 6,
        borderRadius: RADIUS.sm,
        backgroundColor: 'rgba(0,0,0,0.65)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    downloadedBadgeText: {
        fontSize: 9.5,
        fontFamily: FONTS.medium,
        color: COLORS.neutral[300],
    },
    activeOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(14, 15, 25, 0.4)',
    },
    equalizerBadge: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: RADIUS.md,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        borderWidth: 1,
        borderColor: 'rgba(145, 132, 217, 0.3)',
    },
});

