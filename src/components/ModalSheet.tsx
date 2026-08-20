import { router } from 'expo-router';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AmbientBackground from '@/src/components/AmbientBackground';
import ModalGrabber from '@/src/components/ModalGrabber';
import { COLORS } from '@/src/constants/theme';

const SHEET_MARGIN = 12;
const SHEET_RADIUS = 28;
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 800;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function dismiss() {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
}

// A floating modal card that dismisses on backdrop tap or downward pan gesture.
export default function ModalSheet({ children }: { children: ReactNode }) {
    const insets = useSafeAreaInsets();
    const translateY = useSharedValue(0);

    const dragHandle = Gesture.Pan()
        .onUpdate((e) => {
            translateY.value = Math.max(0, e.translationY);
        })
        .onEnd((e) => {
            if (translateY.value > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) {
                runOnJS(dismiss)();
                return;
            }
            translateY.value = withSpring(0, { damping: 20, stiffness: 250 });
        });

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Pressable style={styles.backdrop} onPress={dismiss}>
            <AnimatedPressable
                style={[styles.sheet, { marginBottom: Math.max(insets.bottom, SHEET_MARGIN) }, sheetStyle]}
                onPress={() => {}}
            >
                <AmbientBackground />
                <GestureDetector gesture={dragHandle}>
                    <View style={styles.grabberZone}>
                        <ModalGrabber />
                    </View>
                </GestureDetector>
                {children}
            </AnimatedPressable>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(8,9,16,0.6)',
    },
    sheet: {
        height: '85%',
        marginHorizontal: SHEET_MARGIN,
        borderRadius: SHEET_RADIUS,
        overflow: 'hidden',
        backgroundColor: COLORS.bg,
    },
    grabberZone: {
        paddingVertical: 10,
    },
});
