import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import { COLORS } from '@/src/constants/theme';

interface BarConfig {
    delay: number;
    min: number;
}

interface Props {
    // Animates when true; stays at resting height when false to indicate a paused track.
    isPlaying?: boolean;
}

const BARS: BarConfig[] = [
    { delay: 0, min: 0.35 },
    { delay: 120, min: 0.55 },
    { delay: 240, min: 0.3 },
];

function Bar({ delay, min, isPlaying }: BarConfig & { isPlaying: boolean }) {
    const scale = useSharedValue(min);

    useEffect(() => {
        if (isPlaying) {
            scale.value = withDelay(
                delay,
                withRepeat(withTiming(1, { duration: 420, easing: Easing.inOut(Easing.ease) }), -1, true),
            );
        } else {
            scale.value = withTiming(min, { duration: 200 });
        }
    }, [delay, min, isPlaying]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scaleY: scale.value }],
    }));

    return <Animated.View style={[{ width: 3, height: 14, borderRadius: 2, backgroundColor: COLORS.accent }, animatedStyle]} />;
}

// An equalizer animation that replaces static play/pause icons for currently playing tracks.
export default function PlayingIndicator({ isPlaying = true }: Props) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 14 }}>
            {BARS.map((bar, i) => (
                <Bar key={i} delay={bar.delay} min={bar.min} isPlaying={isPlaying} />
            ))}
        </View>
    );
}
