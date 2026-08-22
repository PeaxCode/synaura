import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import { COLORS } from '@/src/constants/theme';

type LineConfig = {
    key: string;
    thickness: number;
    offsetX: number;
    lengthPct: number;
    duration: number;
    initialProgress: number;
    color: string;
    opacity: number;
    direction: 1 | -1;
};

function randomInRange(min: number, max: number) {
    return min + Math.random() * (max - min);
}

// Aurora ambient color palette (RGB)
const AURORA_PALETTE = [
    '139, 127, 212',
    '192, 132, 252',
    '59, 130, 246',
    '99, 102, 241',
    '165, 148, 255',
    '56, 189, 248',
];

function generateDiagonalConfigs(containerWidth: number, count: number, type: 'band' | 'beam' | 'line'): LineConfig[] {
    const configs: LineConfig[] = [];
    
    for (let i = 0; i < count; i++) {
        const color = AURORA_PALETTE[Math.floor(Math.random() * AURORA_PALETTE.length)];
        
        let thickness = 1.5;
        let opacity = 0.15;
        let duration = 15000;
        let lengthPct = 0.3;
        
        if (type === 'band') {
            thickness = randomInRange(70, 180);
            opacity = randomInRange(0.015, 0.035);
            duration = randomInRange(40000, 65000); 
            lengthPct = randomInRange(0.9, 1.5);
        } else if (type === 'beam') {
            thickness = randomInRange(5, 14);
            opacity = randomInRange(0.04, 0.08);
            duration = randomInRange(18000, 32000);
            lengthPct = randomInRange(0.4, 0.7);
        } else {
            thickness = randomInRange(1, 2.5);
            opacity = randomInRange(0.12, 0.26);
            duration = randomInRange(8000, 16000);
            lengthPct = randomInRange(0.18, 0.38);
        }

        configs.push({
            key: `${type}-${i}`,
            thickness,
            opacity,
            offsetX: randomInRange(0, containerWidth),
            lengthPct,
            duration,
            initialProgress: randomInRange(0.05, 0.95),
            color: `rgba(${color}, ${opacity})`,
            direction: Math.random() > 0.3 ? 1 : -1,
        });
    }
    return configs;
}

function DiagonalStreamElement({
    config,
    travelLength,
}: {
    config: LineConfig;
    travelLength: number;
}) {
    const progress = useRef(new Animated.Value(config.initialProgress)).current;
    const elementLength = travelLength * config.lengthPct;

    useEffect(() => {
        let isCancelled = false;

        // Animate from initial progress to 1, then loop continuously
        const remaining = Math.max(0.05, 1 - config.initialProgress);
        
        Animated.timing(progress, {
            toValue: 1,
            duration: config.duration * remaining,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished && !isCancelled) {
                progress.setValue(0);
                Animated.loop(
                    Animated.timing(progress, {
                        toValue: 1,
                        duration: config.duration,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    })
                ).start();
            }
        });

        return () => {
            isCancelled = true;
            progress.stopAnimation();
        };
    }, []);

    const offset = progress.interpolate({
        inputRange: [0, 1],
        outputRange: config.direction === 1 
            ? [-elementLength, travelLength] 
            : [travelLength, -elementLength]
    });

    return (
        <Animated.View
            pointerEvents="none"
            style={{
                position: 'absolute',
                left: config.offsetX,
                top: 0,
                width: config.thickness,
                height: elementLength,
                backgroundColor: config.color,
                borderRadius: config.thickness / 2,
                transform: [{ translateY: offset }],
            }}
        />
    );
}

function DiagonalStreamMatrix() {
    const { width, height } = useWindowDimensions();

    const containerWidth = width * 1.8;
    const containerHeight = height * 1.8;

    const configs = useMemo<LineConfig[]>(() => {
        return [
            ...generateDiagonalConfigs(containerWidth, 5, 'band'),
            ...generateDiagonalConfigs(containerWidth, 8, 'beam'),
            ...generateDiagonalConfigs(containerWidth, 16, 'line'),
        ];
    }, [containerWidth]);

    return (
        <View
            pointerEvents="none"
            style={{
                position: 'absolute',
                width: containerWidth,
                height: containerHeight,
                left: -(containerWidth - width) / 2,
                top: -(containerHeight - height) / 2,
                transform: [{ rotate: '-28deg' }],
            }}
        >
            {configs.map((config) => (
                <DiagonalStreamElement
                    key={config.key}
                    config={config}
                    travelLength={containerHeight}
                />
            ))}
        </View>
    );
}

export default function AmbientBackground() {
    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {/* BASE GRADIENT */}
            <LinearGradient
                colors={['rgba(10, 10, 16, 0.2)', COLORS.bg]}
                style={StyleSheet.absoluteFill}
            />

            {/* TOP AMBIENT GLOW */}
            <LinearGradient
                colors={['rgba(139, 127, 212, 0.08)', 'rgba(59, 130, 246, 0.03)', 'transparent']}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 0.6 }}
                style={StyleSheet.absoluteFill}
            />

            {/* DIAGONAL STREAM MATRIX */}
            <DiagonalStreamMatrix />
        </View>
    );
}
