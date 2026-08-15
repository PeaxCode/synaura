import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import createStyles from '@/src/assets/styles/index.styles';
import AmbientBackground from '@/src/components/AmbientBackground';
import LogoMark from '@/src/components/LogoMark';
import { COLORS } from '@/src/constants/theme';

const SPLASH_DURATION_MS = 1500;

export default function SplashScreen() {
    const styles = createStyles(COLORS);

    useEffect(() => {
        const timer = setTimeout(() => router.replace('/onboarding'), SPLASH_DURATION_MS);
        return () => clearTimeout(timer);
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
