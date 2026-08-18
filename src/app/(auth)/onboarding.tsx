import createStyles, { ONBOARDING_PAGE_PADDING } from '@/src/assets/styles/onboarding.styles';
import { useMoodPreviewSound } from '@/src/hooks/useMoodPreviewSound';
import AmbientBackground from '@/src/components/AmbientBackground';
import PressableScale from '@/src/components/PressableScale';
import { COLORS, FONTS } from '@/src/constants/theme';
import {
    GOALS,
    GOAL_PHRASES,
    GoalId,
    HOURS,
    HOUR_PHRASES,
    HourId,
    PAD_CONTEXTS,
    PROOF_COPY,
    SENSITIVITIES,
    SENSITIVITY_PHRASES,
    SensitivityId,
    padQuadrant,
    saveOnboardingAnswers,
} from '@/src/data/onboarding';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useId, useState } from 'react';
import {
    LayoutChangeEvent,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
    useWindowDimensions,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    Easing,
    FadeIn,
    FadeInDown,
    SharedValue,
    ZoomIn,
    runOnJS,
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const PROGRESS_INDEX: Record<number, number> = { 3: 0, 4: 1, 5: 2, 6: 3, 7: 3, 8: 4 };

const SEGMENTS = 5;
const SELECT_DELAY = 420;
const BUILD_DURATION = 3400;

const RING_SIZE = 150;
const RING_INSET = 3;
const RING_SIDE = RING_SIZE - RING_INSET * 2;
const RING_CORNER = RING_SIDE * 0.26;
const RING_LENGTH = 4 * (RING_SIDE - 2 * RING_CORNER) + 2 * Math.PI * RING_CORNER;

interface AuraOrbProps {
    size?: number;
    rings?: boolean;
}

function AuraOrb({ size = 132, rings = true }: AuraOrbProps) {
    const ringA = useSharedValue(0);
    const ringB = useSharedValue(0);
    const breathe = useSharedValue(1);

    const core = size * 0.56;

    useEffect(() => {
        breathe.value = withRepeat(withTiming(1.06, { duration: 3400, easing: Easing.inOut(Easing.ease) }), -1, true);
        if (!rings)
            return;

        ringA.value = withRepeat(withTiming(1, { duration: 6000, easing: Easing.out(Easing.quad) }), -1, false);
        ringB.value = withDelay(
            2000,
            withRepeat(withTiming(1, { duration: 6000, easing: Easing.out(Easing.quad) }), -1, false),
        );
    }, [rings]);

    const coreStyle = useAnimatedStyle(() => ({
        transform: [{ scale: breathe.value }],
    }));

    const ringAStyle = useAnimatedStyle(() => ({
        opacity: (1 - ringA.value) * 0.5,
        transform: [{ scale: 1 + ringA.value * 0.72 }],
    }));

    const ringBStyle = useAnimatedStyle(() => ({
        opacity: (1 - ringB.value) * 0.36,
        transform: [{ scale: 1 + ringB.value * 0.72 }],
    }));

    return (
        <Animated.View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            {rings && (
                <>
                    <Animated.View
                        style={[
                            {
                                position: 'absolute',
                                width: core,
                                height: core,
                                borderRadius: core * 0.26,
                                borderWidth: 1,
                                borderColor: COLORS.accentRamp[400],
                            },
                            ringAStyle,
                        ]}
                    />
                    <Animated.View
                        style={[
                            {
                                position: 'absolute',
                                width: core,
                                height: core,
                                borderRadius: core * 0.26,
                                borderWidth: 1,
                                borderColor: COLORS.accentRamp[300],
                            },
                            ringBStyle,
                        ]}
                    />
                </>
            )}

            <Animated.View
                style={[
                    {
                        width: core,
                        height: core,
                        borderRadius: core * 0.26,
                        overflow: 'hidden',
                        shadowColor: COLORS.accentRamp[400],
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.55,
                        shadowRadius: 26,
                        elevation: 10,
                    },
                    coreStyle,
                ]}
            >
                <LinearGradient
                    colors={[COLORS.accentRamp[200], COLORS.accentRamp[400], COLORS.accentRamp[600], COLORS.accentRamp[800]]}
                    locations={[0, 0.34, 0.68, 1]}
                    start={{ x: 0.3, y: 0.24 }}
                    end={{ x: 1, y: 1 }}
                    style={{ flex: 1 }}
                />
            </Animated.View>
        </Animated.View>
    );
}

const HANDLE = 34;

interface MoodPadProps {
    size: number;
    position: SharedValue<{ x: number; y: number }>;
    onQuadrantChange: (index: number) => void;
    onPositionChange: (x: number, y: number) => void;
    onFirstTouch: () => void;
}

function MoodPad({ size, position, onQuadrantChange, onPositionChange, onFirstTouch }: MoodPadProps) {
    const quadrant = useSharedValue(-1);
    const touched = useSharedValue(false);

    function applyPoint(px: number, py: number) {
        'worklet';
        const x = Math.min(1, Math.max(0, px / size));
        const y = Math.min(1, Math.max(0, py / size));
        position.value = { x, y };
        runOnJS(onPositionChange)(x, y);

        const q = padQuadrant(x, y);
        if (q !== quadrant.value) {
            quadrant.value = q;
            runOnJS(onQuadrantChange)(q);
        }
        if (!touched.value) {
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

    const glowProps = useAnimatedProps(() => ({
        cx: position.value.x * size,
        cy: position.value.y * size,
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
                <Svg width={size} height={size} style={{ position: 'absolute' }}>
                    <Defs>
                        <RadialGradient id="padGlow">
                            <Stop offset="0" stopColor={COLORS.accent} stopOpacity={0.55} />
                            <Stop offset="0.55" stopColor={COLORS.accent} stopOpacity={0.14} />
                            <Stop offset="1" stopColor={COLORS.accent} stopOpacity={0} />
                        </RadialGradient>
                    </Defs>
                    <AnimatedCircle animatedProps={glowProps} r={size * 0.62} fill="url(#padGlow)" />
                </Svg>

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

const ORBIT_RADIUS = 8;
const ORBIT_DURATION = 2800;
const ORBIT_HEAD = 0.045;

interface OrbitButtonProps {
    label: string;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

function orbitDash(perimeter: number, factor: number) {
    return [perimeter * ORBIT_HEAD * factor, perimeter - perimeter * ORBIT_HEAD * factor];
}

function OrbitButton({ label, onPress, style, textStyle }: OrbitButtonProps) {
    const [box, setBox] = useState({ width: 0, height: 0 });
    const offset = useSharedValue(0);

    const inset = 1;
    const w = Math.max(0, box.width - inset * 2);
    const h = Math.max(0, box.height - inset * 2);
    const perimeter = w > 0 ? 2 * (w - 2 * ORBIT_RADIUS) + 2 * (h - 2 * ORBIT_RADIUS) + 2 * Math.PI * ORBIT_RADIUS : 0;

    useEffect(() => {
        if (perimeter <= 0)
            return;

        offset.value = 0;
        offset.value = withRepeat(
            withTiming(-perimeter, { duration: ORBIT_DURATION, easing: Easing.linear }),
            -1,
            false,
        );
    }, [perimeter]);

    function handleLayout(e: LayoutChangeEvent) {
        const { width, height } = e.nativeEvent.layout;
        setBox({ width, height });
    }

    const tipProps = useAnimatedProps(() => ({ strokeDashoffset: offset.value + perimeter * ORBIT_HEAD }));
    const haloProps = useAnimatedProps(() => ({ strokeDashoffset: offset.value + perimeter * ORBIT_HEAD * 2 }));

    return (
        <PressableScale
            style={[
                { minHeight: 52, borderRadius: ORBIT_RADIUS, alignItems: 'center', justifyContent: 'center' },
                style,
            ]}
            onPress={onPress}
            onLayout={handleLayout}
        >
            {perimeter > 0 && (
                <Svg width={box.width} height={box.height} style={StyleSheet.absoluteFill}>
                    <Rect
                        x={inset}
                        y={inset}
                        width={w}
                        height={h}
                        rx={ORBIT_RADIUS}
                        fill="none"
                        stroke="rgba(145,132,217,0.3)"
                        strokeWidth={1}
                    />

                    <AnimatedRect
                        animatedProps={haloProps}
                        x={inset}
                        y={inset}
                        width={w}
                        height={h}
                        rx={ORBIT_RADIUS}
                        fill="none"
                        stroke={COLORS.accentRamp[400]}
                        strokeWidth={6}
                        strokeOpacity={0.16}
                        strokeLinecap="round"
                        strokeDasharray={orbitDash(perimeter, 2)}
                    />
                    <AnimatedRect
                        animatedProps={tipProps}
                        x={inset}
                        y={inset}
                        width={w}
                        height={h}
                        rx={ORBIT_RADIUS}
                        fill="none"
                        stroke={COLORS.accentRamp[100]}
                        strokeWidth={2.2}
                        strokeLinecap="round"
                        strokeDasharray={orbitDash(perimeter, 1)}
                    />
                </Svg>
            )}

            <Text style={[{ fontSize: 15, fontFamily: FONTS.medium, color: COLORS.text }, textStyle]}>{label}</Text>
        </PressableScale>
    );
}

interface RadialGlowProps {
    size: number;
    color: string;
    opacity?: number;
    style?: StyleProp<ViewStyle>;
}

function RadialGlow({ size, color, opacity = 1, style }: RadialGlowProps) {
    const id = `glow-${useId().replace(/:/g, '')}`;

    return (
        <Svg width={size} height={size} style={style} pointerEvents="none">
            <Defs>
                <RadialGradient id={id}>
                    <Stop offset="0" stopColor={color} stopOpacity={opacity} />
                    <Stop offset="0.5" stopColor={color} stopOpacity={opacity * 0.4} />
                    <Stop offset="1" stopColor={color} stopOpacity={0} />
                </RadialGradient>
            </Defs>
            <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
        </Svg>
    );
}

const RISING_LINES = [
    { left: '22%', height: 0.44, duration: 3400, delay: 0 },
    { left: '74%', height: 0.34, duration: 4200, delay: 800 },
    { left: '50%', height: 0.26, duration: 5000, delay: 1500 },
];

interface RisingLinesProps {
    height: number;
}

function RisingLines({ height }: RisingLinesProps) {
    const a = useSharedValue(1);
    const b = useSharedValue(1);
    const c = useSharedValue(1);
    const progress = [a, b, c];

    useEffect(() => {
        RISING_LINES.forEach((line, i) => {
            progress[i].value = withDelay(
                line.delay,
                withRepeat(withTiming(0, { duration: line.duration, easing: Easing.linear }), -1, false),
            );
        });
    }, []);

    const styleA = useAnimatedStyle(() => ({ transform: [{ translateY: a.value * height }] }));
    const styleB = useAnimatedStyle(() => ({ transform: [{ translateY: b.value * height }] }));
    const styleC = useAnimatedStyle(() => ({ transform: [{ translateY: c.value * height }] }));
    const styles = [styleA, styleB, styleC];

    return (
        <>
            {RISING_LINES.map((line, i) => (
                <Animated.View
                    key={i}
                    style={[
                        {
                            position: 'absolute',
                            left: line.left as any,
                            top: 0,
                            width: 1.5,
                            height: height * line.height,
                        },
                        styles[i],
                    ]}
                    pointerEvents="none"
                >
                    <LinearGradient
                        colors={['transparent', 'rgba(255,255,255,0.85)', 'transparent']}
                        style={StyleSheet.absoluteFill}
                    />
                </Animated.View>
            ))}
        </>
    );
}

const WAVE_SAMPLES = 46;

interface SoundWaveProps {
    variant: 'noise' | 'calm';
    width: number;
    height: number;
}

function wavePath(width: number, height: number, phase: number, amp: number, freq: number, jitter: number) {
    'worklet';
    const mid = height / 2;
    const xs: number[] = [];
    const ys: number[] = [];

    for (let i = 0; i <= WAVE_SAMPLES; i++) {
        const t = i / WAVE_SAMPLES;
        const a = t * freq * Math.PI * 2;
        let w = Math.sin(a + phase);
        if (jitter > 0) {
            w =
                w * 0.62 +
                Math.sin(a * 1.9 + phase * 1.6) * 0.26 * jitter +
                Math.sin(a * 3.1 - phase * 2.1) * 0.12 * jitter;
        }
        xs.push(t * width);
        ys.push(mid - w * amp);
    }

    let d = 'M' + xs[0].toFixed(2) + ' ' + ys[0].toFixed(2);
    for (let i = 1; i < WAVE_SAMPLES; i++) {
        const mx = (xs[i] + xs[i + 1]) / 2;
        const my = (ys[i] + ys[i + 1]) / 2;
        d += 'Q' + xs[i].toFixed(2) + ' ' + ys[i].toFixed(2) + ' ' + mx.toFixed(2) + ' ' + my.toFixed(2);
    }
    d += 'L' + xs[WAVE_SAMPLES].toFixed(2) + ' ' + ys[WAVE_SAMPLES].toFixed(2);

    return d;
}

function SoundWave({ variant, width, height }: SoundWaveProps) {
    const phase = useSharedValue(0);
    const intensity = useSharedValue(0.12);
    const envelope = useSharedValue(0.28);

    useEffect(() => {
        if (variant === 'noise') {
            phase.value = withRepeat(withTiming(Math.PI * 2, { duration: 2400, easing: Easing.linear }), -1, false);
            intensity.value = withDelay(
                1500,
                withRepeat(withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }), -1, true),
            );
        } else {
            phase.value = withRepeat(withTiming(Math.PI * 2, { duration: 5600, easing: Easing.linear }), -1, false);
            envelope.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }),
                    withTiming(0.22, { duration: 3600, easing: Easing.out(Easing.quad) }),
                ),
                -1,
                false,
            );
        }
    }, [variant]);

    const noiseProps = useAnimatedProps(() => ({
        d: wavePath(
            width,
            height,
            phase.value,
            height * 0.42 * intensity.value,
            3 + intensity.value * 5,
            intensity.value,
        ),
    }));

    const calmLead = useAnimatedProps(() => ({
        d: wavePath(width, height, phase.value, height * 0.3 * envelope.value, 1.2, 0),
    }));

    const calmTrail = useAnimatedProps(() => ({
        d: wavePath(width, height, 1.2 - phase.value * 0.8, height * 0.19 * envelope.value, 0.9, 0),
    }));

    if (variant === 'noise') {
        return (
            <Svg width={width} height={height}>
                <Path
                    d={`M0 ${height / 2}L${width} ${height / 2}`}
                    stroke="rgba(233,233,237,0.14)"
                    strokeWidth={1}
                />
                <AnimatedPath
                    animatedProps={noiseProps}
                    fill="none"
                    stroke="rgba(233,233,237,0.55)"
                    strokeWidth={1.4}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            </Svg>
        );
    }

    return (
        <Svg width={width} height={height}>
            <AnimatedPath
                animatedProps={calmTrail}
                fill="none"
                stroke="rgba(145,132,217,0.5)"
                strokeWidth={1.2}
            />
            <AnimatedPath
                animatedProps={calmLead}
                fill="none"
                stroke={COLORS.accentRamp[400]}
                strokeWidth={1.6}
            />
        </Svg>
    );
}

export default function OnboardingScreen() {
    const styles = createStyles(COLORS);
    const { width, height } = useWindowDimensions();

    const [step, setStep] = useState(0);
    const [goal, setGoal] = useState<GoalId | null>(null);
    const [hour, setHour] = useState<HourId | null>(null);
    const [sensitivity, setSensitivity] = useState<SensitivityId | null>(null);
    const [quadrant, setQuadrant] = useState(padQuadrant(0.62, 0.24));
    const [dragged, setDragged] = useState(false);

    const padPosition = useSharedValue({ x: 0.62, y: 0.24 });
    const barGrow = useSharedValue(0);
    const ringGrow = useSharedValue(0);

    const { updatePosition } = useMoodPreviewSound(step === 8);

    const padSize = Math.min(262, width - ONBOARDING_PAGE_PADDING * 2 - 48);
    const waveWidth = width - ONBOARDING_PAGE_PADDING * 2 - 36;
    const proofBarHeight = Math.min(340, height * 0.4);
    const context = PAD_CONTEXTS[quadrant];
    const progressIndex = PROGRESS_INDEX[step];

    useEffect(() => {
        if (step === 6) {
            barGrow.value = 0;
            barGrow.value = withDelay(280, withTiming(1, { duration: 1100, easing: Easing.out(Easing.cubic) }));
        }

        if (step !== 9)
            return;

        ringGrow.value = 0;
        ringGrow.value = withTiming(1, { duration: BUILD_DURATION, easing: Easing.inOut(Easing.ease) });
        const timer = setTimeout(() => setStep(10), BUILD_DURATION + 200);
        return () => clearTimeout(timer);
    }, [step]);

    function pickGoal(id: GoalId) {
        setGoal(id);
        setTimeout(() => setStep(4), SELECT_DELAY);
    }

    function pickHour(id: HourId) {
        setHour(id);
        setTimeout(() => setStep(5), SELECT_DELAY);
    }

    function pickSensitivity(id: SensitivityId) {
        setSensitivity(id);
        setTimeout(() => setStep(6), SELECT_DELAY);
    }

    async function finishPad() {
        if (!goal || !hour || !sensitivity)
            return;

        const { x, y } = padPosition.value;
        const picked = PAD_CONTEXTS[padQuadrant(x, y)];
        await saveOnboardingAnswers({
            goal,
            hour,
            sensitivity,
            pad: { x, y },
            context: picked.id,
            preset: picked.preset,
        });
        setStep(9);
    }

    function goBack() {
        setStep((s) => Math.max(0, s - 1));
    }

    const synauraBarStyle = useAnimatedStyle(() => ({
        height: 30 + (proofBarHeight - 30) * barGrow.value,
    }));

    const baselineBarStyle = useAnimatedStyle(() => ({
        height: 30 + (proofBarHeight * 0.32 - 30) * barGrow.value,
    }));

    const ringProps = useAnimatedProps(() => ({
        strokeDashoffset: RING_LENGTH * (1 - ringGrow.value),
    }));

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar style="light" />
            <AmbientBackground />

            {/* CHROME */}
            <View style={styles.header}>
                {step > 0 && step < 9 && (
                    <PressableScale style={styles.backButton} onPress={goBack} hitSlop={8}>
                        <Ionicons name="chevron-back" size={22} color="rgba(233,233,237,0.6)" />
                    </PressableScale>
                )}

                {progressIndex !== undefined && (
                    <View style={styles.progressWrap} pointerEvents="none">
                        {Array.from({ length: SEGMENTS }).map((_, i) => (
                            <View key={i} style={[styles.segment, i <= progressIndex && styles.segmentOn]} />
                        ))}
                    </View>
                )}
            </View>

            {/* STEP 0 · BEGIN */}
            {step === 0 && (
                <Animated.View entering={FadeIn.duration(520)} style={styles.step}>
                    <View style={styles.centerBlock}>
                        <AuraOrb size={136} />
                        <Text style={styles.wordmark}>SYNAURA</Text>
                        <Text style={styles.tagline}>Sound you can see. Shaped by one finger.</Text>
                    </View>

                    <PressableScale style={styles.primaryButton} onPress={() => setStep(1)}>
                        <Text style={styles.primaryButtonText}>Begin</Text>
                    </PressableScale>
                </Animated.View>
            )}

            {/* STEP 1 · THE PROBLEM */}
            {step === 1 && (
                <Animated.View entering={FadeInDown.duration(420)} style={styles.step}>
                    <View style={styles.centerBlock}>
                        <View style={styles.waveWrap}>
                            <SoundWave variant="noise" width={waveWidth} height={150} />
                        </View>

                        <Text style={styles.storyTitle}>The world got loud</Text>
                        <Text style={styles.storyBody}>Your attention breaks every three minutes.</Text>
                    </View>

                    <PressableScale style={styles.primaryButton} onPress={() => setStep(2)}>
                        <Text style={styles.primaryButtonText}>Continue</Text>
                    </PressableScale>
                </Animated.View>
            )}

            {/* STEP 2 · THE ANSWER */}
            {step === 2 && (
                <Animated.View entering={FadeInDown.duration(420)} style={styles.step}>
                    <View style={styles.centerBlock}>
                        <View style={styles.waveWrap}>
                            <SoundWave variant="calm" width={waveWidth} height={150} />
                            <View style={styles.waveDot} />
                        </View>

                        <Text style={styles.storyTitle}>Sound can tune it back</Text>
                        <Text style={styles.storyBody}>A soundscape that holds your focus or calm.</Text>
                    </View>

                    <PressableScale style={styles.primaryButton} onPress={() => setStep(3)}>
                        <Text style={styles.primaryButtonText}>Continue</Text>
                    </PressableScale>
                </Animated.View>
            )}

            {/* STEP 3 · GOAL */}
            {step === 3 && (
                <Animated.View entering={FadeInDown.duration(420)} style={styles.step}>
                    <Text style={styles.questionTitle}>What do you need most?</Text>
                    <Text style={styles.questionSub}>Everything that follows is tuned from this.</Text>

                    <View style={styles.goalList}>
                        {GOALS.map((g) => (
                            <PressableScale
                                key={g.id}
                                style={[styles.optionCard, goal === g.id && styles.optionCardActive]}
                                onPress={() => pickGoal(g.id)}
                            >
                                <RadialGlow size={280} color={g.glow} style={styles.goalGlow} />

                                <Ionicons
                                    name={g.icon}
                                    size={52}
                                    color={goal === g.id ? COLORS.accentRamp[200] : 'rgba(233,233,237,0.6)'}
                                />
                                <Text style={styles.optionTitle}>{g.title}</Text>
                                <Text style={styles.optionSub}>{g.sub}</Text>
                            </PressableScale>
                        ))}
                    </View>
                </Animated.View>
            )}

            {/* STEP 4 · HARDEST HOUR */}
            {step === 4 && (
                <Animated.View entering={FadeInDown.duration(420)} style={styles.step}>
                    <Text style={styles.questionTitle}>
                        {goal === 'relax' ? 'When does tension peak?' : 'When is focus hardest?'}
                    </Text>
                    <Text style={styles.questionSub}>We shape the first session around it.</Text>

                    <View style={styles.hourGrid}>
                        {[HOURS.slice(0, 2), HOURS.slice(2)].map((row, r) => (
                            <View key={r} style={styles.hourRow}>
                                {row.map((h) => (
                                    <PressableScale
                                        key={h.id}
                                        style={[styles.optionCard, hour === h.id && styles.optionCardActive]}
                                        onPress={() => pickHour(h.id)}
                                    >
                                        <Ionicons
                                            name={h.icon}
                                            size={40}
                                            color={hour === h.id ? COLORS.accentRamp[200] : 'rgba(233,233,237,0.6)'}
                                        />
                                        <Text style={styles.optionTitle} numberOfLines={1}>
                                            {h.title}
                                        </Text>
                                        <Text style={styles.optionSub}>{h.sub}</Text>
                                    </PressableScale>
                                ))}
                            </View>
                        ))}
                    </View>
                </Animated.View>
            )}

            {/* STEP 5 · NOISE SENSITIVITY */}
            {step === 5 && (
                <Animated.View entering={FadeInDown.duration(420)} style={styles.step}>
                    <Text style={styles.questionTitle}>How easily does noise pull you away?</Text>
                    <Text style={styles.questionSub}>Sets how present the soundscape feels.</Text>

                    <View style={styles.senseList}>
                        {SENSITIVITIES.map((s) => (
                            <PressableScale
                                key={s.id}
                                style={[styles.optionCard, sensitivity === s.id && styles.optionCardActive]}
                                onPress={() => pickSensitivity(s.id)}
                            >
                                <View style={styles.senseBars}>
                                    {[12, 22, 34].map((h, i) => (
                                        <View
                                            key={i}
                                            style={[
                                                styles.senseBar,
                                                { height: h },
                                                i < s.level && styles.senseBarOn,
                                            ]}
                                        />
                                    ))}
                                </View>

                                <Text style={styles.optionTitle}>{s.title}</Text>
                                <Text style={styles.optionSub}>{s.sub}</Text>
                            </PressableScale>
                        ))}
                    </View>
                </Animated.View>
            )}

            {/* STEP 6 · SOCIAL PROOF */}
            {step === 6 && goal && (
                <Animated.View entering={FadeInDown.duration(420)} style={styles.step}>
                    <Text style={styles.questionTitle}>Good call.</Text>
                    <Text style={styles.questionSub}>{PROOF_COPY[goal].sub}</Text>

                    <View style={styles.proofRow}>
                        <View style={styles.proofColumn}>
                            <Animated.View style={[styles.proofBar, styles.proofBarGhost, baselineBarStyle]}>
                                <Text style={styles.proofValueGhost}>1x</Text>
                            </Animated.View>
                            <Text style={styles.proofLabel}>WITHOUT</Text>
                        </View>

                        <View style={styles.proofColumn}>
                            <Animated.View style={[styles.proofBar, synauraBarStyle]}>
                                <LinearGradient
                                    colors={[COLORS.accentRamp[400], COLORS.accentRamp[600]]}
                                    style={StyleSheet.absoluteFill}
                                />
                                <RisingLines height={proofBarHeight} />
                                <Text style={styles.proofValue}>3.2x</Text>
                            </Animated.View>
                            <Text style={styles.proofLabelBright}>WITH SYNAURA</Text>
                        </View>
                    </View>

                    <PressableScale style={styles.primaryButton} onPress={() => setStep(7)}>
                        <Text style={styles.primaryButtonText}>Continue</Text>
                    </PressableScale>
                </Animated.View>
            )}

            {/* STEP 7 · PRIMER */}
            {step === 7 && goal && hour && sensitivity && (
                <Animated.View entering={FadeInDown.duration(420)} style={styles.step}>
                    <Text style={styles.questionTitle}>Here is what we heard</Text>
                    <Text style={styles.questionSub}>One last step, and it's the fun one.</Text>

                    <View style={styles.primerList}>
                        <Animated.View entering={FadeInDown.delay(120).duration(560)} style={styles.primerRow}>
                            <Ionicons
                                name={goal === 'relax' ? 'cloud-outline' : 'pulse'}
                                size={28}
                                color={COLORS.accentRamp[300]}
                                style={styles.primerIcon}
                            />
                            <Text style={styles.primerText}>{GOAL_PHRASES[goal]}</Text>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(380).duration(560)} style={styles.primerRow}>
                            <Ionicons
                                name="time-outline"
                                size={28}
                                color={COLORS.accentRamp[300]}
                                style={styles.primerIcon}
                            />
                            <Text style={styles.primerText}>tuned to carry you through {HOUR_PHRASES[hour]}</Text>
                        </Animated.View>

                        <Animated.View entering={FadeInDown.delay(640).duration(560)} style={styles.primerRow}>
                            <Ionicons
                                name="headset-outline"
                                size={28}
                                color={COLORS.accentRamp[300]}
                                style={styles.primerIcon}
                            />
                            <Text style={styles.primerText}>{SENSITIVITY_PHRASES[sensitivity]}</Text>
                        </Animated.View>
                    </View>

                    <View style={{ flex: 1 }} />

                    <PressableScale style={styles.primaryButton} onPress={() => setStep(8)}>
                        <Text style={styles.primaryButtonText}>Tune my sound</Text>
                    </PressableScale>
                </Animated.View>
            )}

            {/* STEP 8 · THE PAD */}
            {step === 8 && (
                <Animated.View entering={FadeInDown.duration(420)} style={styles.step}>
                    <Text style={styles.questionTitle}>Drag the light</Text>
                    <Text style={styles.questionSub}>The sound follows your finger. Try it.</Text>

                    <View style={styles.padBlock}>
                        <Text style={styles.axisLabel}>ENERGY</Text>

                        <View style={styles.padRow}>
                            <View style={styles.axisSideWrap}>
                                <Text style={[styles.axisSide, { transform: [{ rotate: '-90deg' }] }]}>CLARITY</Text>
                            </View>

                            <MoodPad
                                size={padSize}
                                position={padPosition}
                                onQuadrantChange={setQuadrant}
                                onPositionChange={updatePosition}
                                onFirstTouch={() => setDragged(true)}
                            />

                            <View style={styles.axisSideWrap}>
                                <Text style={[styles.axisSide, { transform: [{ rotate: '90deg' }] }]}>WARMTH</Text>
                            </View>
                        </View>

                        <Text style={styles.axisLabel}>CALM</Text>

                        <View style={styles.padResult}>
                            <Text style={styles.padPreset}>{context.preset}</Text>
                            <Text style={styles.padContext}>Best for {context.label}</Text>
                        </View>
                    </View>

                    <PressableScale
                        style={dragged ? styles.primaryButton : styles.ghostButton}
                        onPress={finishPad}
                    >
                        <Text style={dragged ? styles.primaryButtonText : styles.ghostButtonText}>
                            {dragged ? 'Keep this sound' : 'Skip for now'}
                        </Text>
                    </PressableScale>
                </Animated.View>
            )}

            {/* STEP 9 · BUILDING */}
            {step === 9 && (
                <Animated.View entering={FadeIn.duration(420)} style={styles.step}>
                    <View style={styles.centerBlock}>
                        <View style={styles.ringWrap}>
                            <Svg width={RING_SIZE} height={RING_SIZE} style={{ position: 'absolute' }}>
                                <Rect
                                    x={RING_INSET}
                                    y={RING_INSET}
                                    width={RING_SIDE}
                                    height={RING_SIDE}
                                    rx={RING_CORNER}
                                    fill="none"
                                    stroke="rgba(233,233,237,0.1)"
                                    strokeWidth={3}
                                />
                                <AnimatedRect
                                    animatedProps={ringProps}
                                    x={RING_INSET}
                                    y={RING_INSET}
                                    width={RING_SIDE}
                                    height={RING_SIDE}
                                    rx={RING_CORNER}
                                    fill="none"
                                    stroke={COLORS.accentRamp[400]}
                                    strokeWidth={3}
                                    strokeLinecap="round"
                                    strokeDasharray={RING_LENGTH}
                                />
                            </Svg>

                            <AuraOrb size={92} rings={false} />
                        </View>

                        <Text style={styles.buildTitle}>Tuning your soundscape</Text>

                        <View style={styles.buildList}>
                            <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.buildRow}>
                                <Ionicons name="checkmark-circle" size={16} color={COLORS.accentRamp[400]} />
                                <Text style={styles.buildText}>listening to your {goal ?? 'focus'} answers</Text>
                            </Animated.View>

                            <Animated.View entering={FadeInDown.delay(1300).duration(500)} style={styles.buildRow}>
                                <Ionicons name="checkmark-circle" size={16} color={COLORS.accentRamp[400]} />
                                <Text style={styles.buildText}>
                                    shaping it for {hour ? HOUR_PHRASES[hour] : 'your day'}
                                </Text>
                            </Animated.View>

                            <Animated.View entering={FadeInDown.delay(2400).duration(500)} style={styles.buildRow}>
                                <Ionicons name="checkmark-circle" size={16} color={COLORS.accentRamp[400]} />
                                <Text style={styles.buildText}>layering rhythm and drone</Text>
                            </Animated.View>
                        </View>
                    </View>
                </Animated.View>
            )}

            {/* STEP 10 · READY */}
            {step === 10 && (
                <Animated.View entering={FadeIn.duration(500)} style={styles.step}>
                    <View style={styles.centerBlock}>
                        <Animated.View entering={ZoomIn.delay(300).duration(1000)} style={{ marginTop: 20, marginBottom: 6 }}>
                            <AuraOrb size={210} rings={false} />
                        </Animated.View>

                        <Animated.Text entering={FadeIn.delay(900).duration(900)} style={styles.auraTitle}>
                            Ready to listen
                        </Animated.Text>
                        <Animated.Text entering={FadeInDown.delay(1500).duration(700)} style={styles.auraSub}>
                            Saved and ready whenever you need it.
                        </Animated.Text>
                    </View>

                    <OrbitButton label="Continue" onPress={() => router.replace('/(auth)')} />
                </Animated.View>
            )}
        </SafeAreaView>
    );
}
