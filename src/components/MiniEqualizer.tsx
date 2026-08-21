import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { COLORS } from '@/src/constants/theme';

function Bar({ delay, duration }: { delay: number; duration: number }) {
    const scaleY = useSharedValue(0.3);

    useEffect(() => {
        scaleY.value = withDelay(
            delay,
            withRepeat(
                withSequence(
                    withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0.3, { duration: duration * 1.1, easing: Easing.inOut(Easing.ease) }),
                ),
                -1,
                true,
            ),
        );
    }, []);

    const style = useAnimatedStyle(() => ({
        transform: [{ scaleY: scaleY.value }],
    }));

    return <Animated.View style={[styles.bar, style]} />;
}

export default function MiniEqualizer() {
    return (
        <View style={styles.container}>
            <Bar delay={0} duration={350} />
            <Bar delay={150} duration={450} />
            <Bar delay={75} duration={300} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        width: 14,
        height: 12,
        marginBottom: 1,
    },
    bar: {
        width: 3,
        height: '100%',
        backgroundColor: COLORS.accent,
        borderRadius: 1.5,
    },
});
