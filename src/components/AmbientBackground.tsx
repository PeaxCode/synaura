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
import { COLORS } from '@/src/constants/theme';

type LineConfig = {
    key: string;
    axis: 'vertical' | 'horizontal';
    offsetPct: number; // left% for vertical lines, top% for horizontal lines
    lengthPct: number; // height% (vertical) or width% (horizontal), of screen size
    duration: number;
    delay: number;
    color: string;
};

const LINES: LineConfig[] = [
    { key: 'v1', axis: 'vertical', offsetPct: 0.14, lengthPct: 0.34, duration: 12000, delay: 0, color: 'rgba(145,132,217,0.9)' },
    { key: 'v2', axis: 'vertical', offsetPct: 0.47, lengthPct: 0.24, duration: 16000, delay: 4000, color: 'rgba(181,171,252,0.9)' },
    { key: 'v3', axis: 'vertical', offsetPct: 0.83, lengthPct: 0.30, duration: 14000, delay: 7000, color: 'rgba(121,108,191,0.9)' },
    { key: 'h1', axis: 'horizontal', offsetPct: 0.34, lengthPct: 0.28, duration: 19000, delay: 2000, color: 'rgba(145,132,217,0.9)' },
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
        ? { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } }
        : { start: { x: 0, y: 0 }, end: { x: 1, y: 0 } };

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
        <View style={[StyleSheet.absoluteFill, { opacity: 0.5 }]} pointerEvents="none">
            {configs.map((line) => (
                <FlowLine key={line.key} config={line} screenWidth={width} screenHeight={height} />
            ))}
        </View>
    );
}

export default function AmbientBackground({ showLines = true }: { showLines?: boolean }) {
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <LinearGradient
                colors={['rgba(16,18,32,0.2)', COLORS.bg]}
                style={StyleSheet.absoluteFill}
            />

            {showLines && <FlowLines />}
        </View>
    );
}
