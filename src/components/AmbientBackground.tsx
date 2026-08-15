import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import FlowLines from '@/src/components/FlowLines';
import GlowBlob, { GlowBlobConfig } from '@/src/components/GlowBlob';
import { COLORS } from '@/src/constants/theme';

// Ambient drift-blob + flowing-line motif from the v2 design prototype — shared
// between the splash, onboarding, welcome, and auth screens so they all read as
// the same living background.
export default function AmbientBackground() {
    const { width, height } = useWindowDimensions();

    const blobs: GlowBlobConfig[] = [
        {
            size: width * 1.1,
            top: -height * 0.16,
            left: -width * 0.35,
            color: 'rgba(145,132,217,0.42)',
            halfDuration: 13000,
            dx: -width * 0.06,
            dy: height * 0.04,
            scaleFrom: 1,
            scaleTo: 1.12,
        },
        {
            size: width * 1.05,
            top: height * 0.32,
            left: width * 0.2,
            color: 'rgba(76,83,151,0.5)',
            halfDuration: 17000,
            dx: width * 0.07,
            dy: -height * 0.05,
            scaleFrom: 1.05,
            scaleTo: 0.95,
        },
    ];

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {blobs.map((b, i) => (
                <GlowBlob key={i} config={b} />
            ))}

            <LinearGradient
                colors={['rgba(16,18,32,0.2)', COLORS.bg]}
                style={StyleSheet.absoluteFill}
            />

            <FlowLines />
        </View>
    );
}
