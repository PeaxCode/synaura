import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    SharedValue,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { COLORS } from '@/src/constants/theme';
import { padQuadrant } from '@/src/data/onboarding';

const HANDLE = 34;
const GLOW_RADIUS_RATIO = 0.62;

interface Props {
    size: number;
    position: SharedValue<{ x: number; y: number }>;
    onPositionChange: (x: number, y: number) => void;
    onQuadrantChange?: (index: number) => void;
    onFirstTouch?: () => void;
}

// Renders a 2D touch pad that drives stem mixing or onboarding answers based on the selected position.
export default function MoodPad({ size, position, onPositionChange, onQuadrantChange, onFirstTouch }: Props) {
    const quadrant = useSharedValue(-1);
    const touched = useSharedValue(false);
    const glowRadius = size * GLOW_RADIUS_RATIO;
    const glowSize = glowRadius * 2;

    function applyPoint(px: number, py: number) {
        'worklet';
        const x = Math.min(1, Math.max(0, px / size));
        const y = Math.min(1, Math.max(0, py / size));
        position.value = { x, y };
        runOnJS(onPositionChange)(x, y);

        if (onQuadrantChange) {
            const q = padQuadrant(x, y);
            if (q !== quadrant.value) {
                quadrant.value = q;
                runOnJS(onQuadrantChange)(q);
            }
        }
        if (onFirstTouch && !touched.value) {
            touched.value = true;
            runOnJS(onFirstTouch)();
        }
    }

    const pan = Gesture.Pan()
        .minDistance(0)
        .onBegin((e) => {
            applyPoint(e.x, e.y);
        })
        .onUpdate((e) => {
            applyPoint(e.x, e.y);
        });

    // Uses native transforms to position glow without triggering SVG canvas redraws
    const glowStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: position.value.x * size - glowRadius },
            { translateY: position.value.y * size - glowRadius },
        ],
    }));

    const handleStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: position.value.x * size - HANDLE / 2 },
            { translateY: position.value.y * size - HANDLE / 2 },
        ],
    }));

    return (
        <GestureDetector gesture={pan}>
            <Animated.View
                style={{
                    width: size,
                    height: size,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: COLORS.divider,
                    backgroundColor: '#181a2a',
                    overflow: 'hidden',
                }}
            >
                <Animated.View style={[{ position: 'absolute', width: glowSize, height: glowSize }, glowStyle]}>
                    <Svg width={glowSize} height={glowSize}>
                        <Defs>
                            <RadialGradient id="padGlow">
                                <Stop offset="0" stopColor={COLORS.accent} stopOpacity={0.55} />
                                <Stop offset="0.55" stopColor={COLORS.accent} stopOpacity={0.14} />
                                <Stop offset="1" stopColor={COLORS.accent} stopOpacity={0} />
                            </RadialGradient>
                        </Defs>
                        <Circle cx={glowRadius} cy={glowRadius} r={glowRadius} fill="url(#padGlow)" />
                    </Svg>
                </Animated.View>

                <View style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(233,233,237,0.1)' }} />
                <View style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(233,233,237,0.1)' }} />

                <Animated.View
                    style={[
                        {
                            position: 'absolute',
                            width: HANDLE,
                            height: HANDLE,
                            borderRadius: 11,
                            backgroundColor: COLORS.accentRamp[200],
                            shadowColor: COLORS.accentRamp[300],
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.8,
                            shadowRadius: 16,
                            elevation: 8,
                        },
                        handleStyle,
                    ]}
                />
            </Animated.View>
        </GestureDetector>
    );
}
