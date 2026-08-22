import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';
import { COLORS } from '@/src/constants/theme';

const RING_COUNT = 5;
const STROKE_WIDTH = 1.5;

function TunnelRing({ index, size, time }: { index: number; size: number; time: SharedValue<number> }) {
    // Uses native transforms for scaling to avoid costly SVG redraws
    const animatedStyle = useAnimatedStyle(() => {
        // p goes from 0 to 1. As time increases, rings move forward.
        // We subtract time so the rings grow larger (p moves from 0 to 1).
        const rawP = (index / RING_COUNT) + time.value;
        const p = rawP % 1;

        // Softer curve for more even spacing (less bunching at the center)
        const fraction = Math.pow(p, 1.2);

        // Scale from 35% to 100% of size (starts around the timer instead of tiny)
        const scale = 0.35 + 0.65 * fraction;

        // Fade in from the center (p=0), fade out slightly at the edges (p=1)
        const opacity = p < 0.2 ? p * 5 * 0.4 : (1 - p) * 0.4 + 0.05;

        return {
            opacity,
            transform: [{ scale }],
        };
    });

    return (
        <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
            <Svg width={size} height={size}>
                <Rect
                    x={STROKE_WIDTH / 2}
                    y={STROKE_WIDTH / 2}
                    width={size - STROKE_WIDTH}
                    height={size - STROKE_WIDTH}
                    rx={8}
                    ry={8}
                    stroke={COLORS.accent}
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                />
            </Svg>
        </Animated.View>
    );
}

// Renders nested square outlines that grow outward (perspective tunnel effect).
export default function PerspectiveGrid({ size, isPlaying }: { size: number; isPlaying: boolean }) {
    const time = useSharedValue(0);

    useEffect(() => {
        // Animate time continuously from 0 to 1.
        if (isPlaying) {
            // Slightly faster, rhythmic forward motion during active playback
            time.value = withRepeat(
                withTiming(1, { duration: 5200, easing: Easing.linear }),
                -1,
                false
            );
        } else {
            // Calming, slow ambient drift when paused
            time.value = withRepeat(
                withTiming(1, { duration: 26000, easing: Easing.linear }),
                -1,
                false
            );
        }
    }, [isPlaying]);

    const rings = [];
    for (let i = 0; i < RING_COUNT; i++) {
        rings.push(<TunnelRing key={i} index={i} size={size} time={time} />);
    }

    return (
        <View style={{ width: size, height: size }}>
            {rings}
        </View>
    );
}
