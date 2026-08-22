import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import createStyles from '@/src/assets/styles/index.styles';
import AmbientBackground from '@/src/components/AmbientBackground';
import LogoMark from '@/src/components/LogoMark';
import { ONBOARDING_SEEN_KEY } from '@/src/constants/storage';
import { COLORS } from '@/src/constants/theme';
import { supabase } from '@/src/data/client';

const styles = createStyles(COLORS);
const MIN_SPLASH_MS = 700;

async function loadInitialRoute(): Promise<Href> {
    const { data } = await supabase.auth.getSession();
    if (data.session)
        return '/(tabs)';

    const onboardingSeen = await AsyncStorage.getItem(ONBOARDING_SEEN_KEY);
    return onboardingSeen ? '/(auth)' : '/onboarding';
}

export default function SplashScreen() {
    useEffect(() => {
        let cancelled = false;

        Promise.all([loadInitialRoute(), new Promise((resolve) => setTimeout(resolve, MIN_SPLASH_MS))]).then(
            ([route]) => {
                if (!cancelled) router.replace(route);
            },
        );

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <AmbientBackground />

            <View style={styles.center}>
                <LogoMark pulse />
                <Text style={styles.wordmark}>SYNAURA</Text>
                <Text style={styles.tagline}>Sound, tuned to you.</Text>
            </View>
        </View>
    );
}
