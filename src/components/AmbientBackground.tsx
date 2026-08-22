import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
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

function generateWavePath(period: number, amplitude: number, yOffset: number) {
    const p = period;
    const a = amplitude;
    const y = yOffset;
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
        const translation = progress.value * config.period * config.direction;
        return {
            transform: [{ translateX: translation }],
        };
    });

    return (
        <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} pointerEvents="none">
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

function WavyBackground() {
    const { width, height } = useWindowDimensions();

    const waves = useMemo<WaveConfig[]>(() => {
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

type LineConfig = {
    key: string;
    axis: 'vertical' | 'horizontal';
    offsetPct: number;
    lengthPct: number;
    duration: number;
    delay: number;
    color: string;
};

const LINES: LineConfig[] = [
    { key: 'v1', axis: 'vertical', offsetPct: 0.14, lengthPct: 0.34, duration: 12000, delay: 0, color: 'rgba(139,127,212,0.9)' },
    { key: 'v2', axis: 'vertical', offsetPct: 0.47, lengthPct: 0.24, duration: 16000, delay: 4000, color: 'rgba(165,148,255,0.9)' },
    { key: 'v3', axis: 'vertical', offsetPct: 0.83, lengthPct: 0.30, duration: 14000, delay: 7000, color: 'rgba(121,108,191,0.9)' },
    { key: 'h1', axis: 'horizontal', offsetPct: 0.34, lengthPct: 0.28, duration: 19000, delay: 2000, color: 'rgba(139,127,212,0.9)' },
    { key: 'h2', axis: 'horizontal', offsetPct: 0.71, lengthPct: 0.22, duration: 23000, delay: 9000, color: 'rgba(93,82,148,0.9)' },
];

const LENGTH_PCT_RANGE: [number, number] = [0.18, 0.38];
const DURATION_RANGE: [number, number] = [9000, 25000];

function randomInRange([min, max]: [number, number]) {
    return min + Math.random() * (max - min);
}

const HALO_THICKNESS = 9;
const CORE_THICKNESS = 1.25;

function FlowLine({ config, screenWidth, screenHeight }: { config: LineConfig; screenWidth: number; screenHeight: number }) {
    const progress = useSharedValue(0);
    const isVertical = config.axis === 'vertical';
    const length = (isVertical ? screenHeight : screenWidth) * config.lengthPct;
    const travel = (isVertical ? screenHeight : screenWidth) + length;
    const fixed = isVertical ? config.offsetPct * screenWidth : config.offsetPct * screenHeight;

    useEffect(() => {
        progress.value = withDelay(
            config.delay,
            withRepeat(withTiming(1, { duration: config.duration, easing: Easing.linear }), -1, false),
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const offset = -length + progress.value * travel;
        return {
            transform: isVertical ? [{ translateY: offset }] : [{ translateX: offset }],
        };
    });

    const haloBoxStyle = isVertical
        ? { position: 'absolute' as const, left: fixed - HALO_THICKNESS / 2, top: 0, width: HALO_THICKNESS, height: length }
        : { position: 'absolute' as const, top: fixed - HALO_THICKNESS / 2, left: 0, height: HALO_THICKNESS, width: length };

    const coreBoxStyle = isVertical
        ? {
              position: 'absolute' as const,
              left: (HALO_THICKNESS - CORE_THICKNESS) / 2,
              top: 0,
              width: CORE_THICKNESS,
              height: length,
          }
        : {
              position: 'absolute' as const,
              top: (HALO_THICKNESS - CORE_THICKNESS) / 2,
              left: 0,
              height: CORE_THICKNESS,
              width: length,
          };

    const haloEdge = isVertical
        ? { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } }
        : { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };
    const coreEdge = isVertical
        ? { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } }
        : { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };

    return (
        <Animated.View pointerEvents="none" style={[haloBoxStyle, animatedStyle]}>
            <View style={[StyleSheet.absoluteFill, { opacity: 0.24 }]}>
                <LinearGradient
                    colors={['transparent', config.color, 'transparent']}
                    start={haloEdge.start}
                    end={haloEdge.end}
                    style={StyleSheet.absoluteFill}
                />
            </View>
            <View style={coreBoxStyle}>
                <LinearGradient
                    colors={['transparent', config.color, config.color, 'transparent']}
                    locations={[0, 0.55, 0.94, 1]}
                    start={coreEdge.start}
                    end={coreEdge.end}
                    style={StyleSheet.absoluteFill}
                />
            </View>
        </Animated.View>
    );
}

function FlowLines() {
    const { width, height } = useWindowDimensions();

    const configs = useMemo<LineConfig[]>(
        () =>
            LINES.map((line) => ({
                ...line,
                lengthPct: randomInRange(LENGTH_PCT_RANGE),
                duration: randomInRange(DURATION_RANGE),
            })),
        [],
    );

    return (
        <View style={[StyleSheet.absoluteFill, { opacity: 0.25 }]} pointerEvents="none">
            {configs.map((line) => (
                <FlowLine key={line.key} config={line} screenWidth={width} screenHeight={height} />
            ))}
        </View>
    );
}

export default function AmbientBackground({ showLines = true, showGeometry = true }: { showLines?: boolean; showGeometry?: boolean }) {
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* Base gradient — ultra-dark fade */}
            <LinearGradient
                colors={['rgba(8,8,12,0.15)', COLORS.bg]}
                style={StyleSheet.absoluteFill}
            />

            {/* Subtle top-center radial glow */}
            <LinearGradient
                colors={['rgba(139,127,212,0.06)', 'transparent']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.5 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Wavy background layer instead of geometric */}
            {showGeometry && <WavyBackground />}

            {/* Flow lines on top */}
            {showLines && <FlowLines />}
        </View>
    );
}
