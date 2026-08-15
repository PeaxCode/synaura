import { ReactNode } from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style'> & {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    scaleTo?: number;
};

// Small tactile press feedback — shrinks slightly on press-in, springs back on release.
export default function PressableScale({ children, style, scaleTo = 0.96, onPressIn, onPressOut, ...rest }: Props) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <AnimatedPressable
            style={[style, animatedStyle]}
            onPressIn={(e) => {
                scale.value = withTiming(scaleTo, { duration: 90 });
                onPressIn?.(e);
            }}
            onPressOut={(e) => {
                scale.value = withTiming(1, { duration: 140 });
                onPressOut?.(e);
            }}
            {...rest}
        >
            {children}
        </AnimatedPressable>
    );
}
