import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export type GlowBlobConfig = {
    size: number;
    top: number;
    left: number;
    color: string;
    animate?: boolean;
    halfDuration?: number;
    dx?: number;
    dy?: number;
    scaleFrom?: number;
    scaleTo?: number;
};

export default function GlowBlob({ config }: { config: GlowBlobConfig }) {
    const { size, top, left, color, animate = true, halfDuration = 15000, dx = 0, dy = 0, scaleFrom = 1, scaleTo = 1 } = config;
    const progress = useSharedValue(0);

    useEffect(() => {
        if (!animate) return;
        progress.value = withRepeat(
            withTiming(1, { duration: halfDuration, easing: Easing.inOut(Easing.ease) }),
            -1,
            true,
        );
    }, [animate]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: progress.value * dx },
            { translateY: progress.value * dy },
            { scale: scaleFrom + (scaleTo - scaleFrom) * progress.value },
        ],
    }));

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                {
                    position: 'absolute',
                    top,
                    left,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    overflow: 'hidden',
                },
                animatedStyle,
            ]}
        >
            <LinearGradient
                colors={[color, 'transparent']}
                start={{ x: 0.3, y: 0.25 }}
                end={{ x: 1, y: 1 }}
                style={{ width: '100%', height: '100%' }}
            />
        </Animated.View>
    );
}
