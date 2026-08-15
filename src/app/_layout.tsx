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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { supabase } from '@/src/data/client';
import { syncOnboardingAnswersToProfile } from '@/src/data/onboarding';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

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

    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN')
                syncOnboardingAnswersToProfile();
        });

        return () => data.subscription.unsubscribe();
    }, []);

    if (!fontsLoaded && !fontError)
        return null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <Stack screenOptions={{ headerShown: false }} />
            </KeyboardAvoidingView>
        </GestureHandlerRootView>
    );
}
