import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    Easing,
    SharedValue,
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Rect } from 'react-native-svg';
import { COLORS } from '@/src/constants/theme';

const RING_COUNT = 5;
const AnimatedRect = Animated.createAnimatedComponent(Rect);

function TunnelRing({ index, size, time }: { index: number; size: number; time: SharedValue<number> }) {
    const animatedProps = useAnimatedProps(() => {
        // p goes from 0 to 1. As time increases, rings move forward.
        // We subtract time so the rings grow larger (p moves from 0 to 1).
        const rawP = (index / RING_COUNT) + time.value;
        const p = rawP % 1;
        
        // Softer curve for more even spacing (less bunching at the center)
        const fraction = Math.pow(p, 1.2); 
        
        // Scale from 35% to 100% of size (starts around the timer instead of tiny)
        const s = size * 0.35 + (size * 0.65 * fraction);
        const offset = (size - s) / 2;
        
        // Fade in from the center (p=0), fade out slightly at the edges (p=1)
        const opacity = p < 0.2 ? p * 5 * 0.4 : (1 - p) * 0.4 + 0.05;
        
        return {
            x: offset,
            y: offset,
            width: s,
            height: s,
            opacity: opacity,
        };
    });

    return (
        <AnimatedRect
            rx={8}
            ry={8}
            stroke={COLORS.accent}
            strokeWidth={1.5}
            fill="none"
            animatedProps={animatedProps}
        />
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
            <Svg width={size} height={size}>
                {rings}
            </Svg>
        </View>
    );
}
