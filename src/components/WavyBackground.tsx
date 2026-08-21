import { useEffect, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '@/src/constants/theme';

type WaveConfig = {
    key: string;
    amplitude: number;
    period: number;
    yOffset: number;
    duration: number;
    opacity: number;
    thickness: number;
    direction: 1 | -1;
};

// Generates an SVG path string for a continuous smooth sine-like wave.
// It draws a wave from x=0 to x = period * 2, so it can be seamlessly translated by 'period'.
function generateWavePath(period: number, amplitude: number, yOffset: number) {
    const p = period;
    const a = amplitude;
    const y = yOffset;
    
    // M startX, startY
    // Q controlX, controlY, endX, endY
    // T endX, endY (smooth quadratic bezier, infers control point)
    return `M 0,${y} 
            Q ${p * 0.25},${y - a} ${p * 0.5},${y} 
            T ${p},${y} 
            T ${p * 1.5},${y} 
            T ${p * 2},${y}`;
}

function AnimatedWave({ config, screenWidth }: { config: WaveConfig; screenWidth: number }) {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, { duration: config.duration, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    const pathData = useMemo(() => {
        return generateWavePath(config.period, config.amplitude, config.yOffset);
    }, [config]);

    const animatedStyle = useAnimatedStyle(() => {
        // Translate by exactly one period to loop seamlessly
        const translation = progress.value * config.period * config.direction;
        return {
            transform: [{ translateX: translation }],
        };
    });

    return (
        <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} pointerEvents="none">
            {/* The SVG needs to be wide enough to contain the full 2x period path */}
            <Svg width={config.period * 2} height="100%" style={StyleSheet.absoluteFill}>
                <Path
                    d={pathData}
                    stroke={COLORS.accent}
                    strokeWidth={config.thickness}
                    fill="none"
                    opacity={config.opacity}
                />
            </Svg>
        </Animated.View>
    );
}

export default function WavyBackground() {
    const { width, height } = useWindowDimensions();

    const waves = useMemo<WaveConfig[]>(() => {
        // Create overlapping waves with different periods, amplitudes, and speeds.
        // We use multiples of screen width for period to ensure it spans the screen.
        return [
            { key: 'w1', amplitude: 80, period: width * 1.5, yOffset: height * 0.3, duration: 18000, opacity: 0.25, thickness: 1.5, direction: -1 },
            { key: 'w2', amplitude: 120, period: width * 2, yOffset: height * 0.5, duration: 25000, opacity: 0.18, thickness: 2, direction: 1 },
            { key: 'w3', amplitude: 60, period: width * 1.2, yOffset: height * 0.7, duration: 15000, opacity: 0.22, thickness: 1.2, direction: -1 },
            { key: 'w4', amplitude: 150, period: width * 2.5, yOffset: height * 0.4, duration: 32000, opacity: 0.15, thickness: 2.5, direction: 1 },
            { key: 'w5', amplitude: 40, period: width * 1.8, yOffset: height * 0.85, duration: 20000, opacity: 0.18, thickness: 1.5, direction: -1 },
        ];
    }, [width, height]);

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {waves.map((wave) => (
                <AnimatedWave key={wave.key} config={wave} screenWidth={width} />
            ))}
        </View>
    );
}
