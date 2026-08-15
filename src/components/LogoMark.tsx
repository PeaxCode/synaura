import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { COLORS } from '@/src/constants/theme';

export default function LogoMark({ size = 92, pulse = false }: { size?: number; pulse?: boolean }) {
    const opacity = useSharedValue(0.55);
    const scale = useSharedValue(1);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(0.9, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
            -1,
            true,
        );
        if (pulse) {
            scale.value = withRepeat(
                withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                -1,
                true,
            );
        }
    }, [pulse]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
    }));

    const dotSize = size * 0.41;

    return (
        <Animated.View
            style={[
                {
                    width: size,
                    height: size,
                    borderRadius: size * 0.26,
                    borderWidth: 1,
                    borderColor: 'rgba(145,132,217,0.55)',
                    alignItems: 'center',
                    justifyContent: 'center',
                },
                animatedStyle,
            ]}
        >
            <LinearGradient
                colors={[COLORS.accentRamp[300], COLORS.accentRamp[600]]}
                start={{ x: 0.34, y: 0.3 }}
                end={{ x: 1, y: 1 }}
                style={{
                    width: dotSize,
                    height: dotSize,
                    borderRadius: dotSize * 0.26,
                    overflow: 'hidden',
                }}
            />
        </Animated.View>
    );
}
