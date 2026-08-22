import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { AudioManager, PlaybackNotificationManager } from 'react-native-audio-api';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { supabase } from '@/src/data/client';
import { syncOnboardingAnswersToProfile } from '@/src/data/onboarding';
import { useAuthStore } from '@/src/store/authStore';
import { usePlaybackStore } from '@/src/store/playbackStore';
import { useTracksStore } from '@/src/store/tracksStore';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

// Configures a transparent modal presentation with native gestures disabled since ModalSheet handles its own dismissal pan gesture.
const MODAL_SCREEN_OPTIONS = {
    presentation: 'transparentModal' as const,
    animation: 'slide_from_bottom' as const,
    contentStyle: { backgroundColor: 'transparent' },
    gestureEnabled: false,
};

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    useEffect(() => {
        if (!fontsLoaded && !fontError)
            return;
        SplashScreen.hideAsync();
    }, [fontsLoaded, fontError]);

    // Subscribes to Supabase auth state to initialize and update the global app-wide auth store.
    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            useAuthStore.getState().setSession(data.session);
            useAuthStore.getState().setIsLoading(false);
        });

        const { data } = supabase.auth.onAuthStateChange((event, session) => {
            useAuthStore.getState().setSession(session);
            if (event === 'SIGNED_IN')
                syncOnboardingAnswersToProfile();
        });

        return () => data.subscription.unsubscribe();
    }, []);

    // Preloads the track catalog on launch
    useEffect(() => {
        useTracksStore.getState().ensureLoaded();
    }, []);

    // Configures background audio session and lock screen controls
    useEffect(() => {
        AudioManager.setAudioSessionOptions({ iosCategory: 'playback' });
        AudioManager.requestNotificationPermissions().catch(() => { });

        const subscriptions = [
            PlaybackNotificationManager.addEventListener('playbackNotificationPlay', () => usePlaybackStore.getState().resume()),
            PlaybackNotificationManager.addEventListener('playbackNotificationPause', () => usePlaybackStore.getState().pause()),
            PlaybackNotificationManager.addEventListener('playbackNotificationStop', () => usePlaybackStore.getState().stop()),
        ];

        return () => subscriptions.forEach((sub) => sub?.remove());
    }, []);

    if (!fontsLoaded && !fontError)
        return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="start-session" options={MODAL_SCREEN_OPTIONS} />
                    <Stack.Screen name="player" options={MODAL_SCREEN_OPTIONS} />
                </Stack>
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
}
