import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Platform, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import createAuthStyles from '@/src/assets/styles/auth.styles';
import createStyles from '@/src/assets/styles/welcome.styles';
import AmbientBackground from '@/src/components/AmbientBackground';
import LogoMark from '@/src/components/LogoMark';
import PressableScale from '@/src/components/PressableScale';
import { COLORS } from '@/src/constants/theme';
import { continueAsGuest, signInWithApple, signInWithGoogle } from '@/src/data/auth';

type Submitting = 'none' | 'guest' | 'google' | 'apple';

export default function WelcomeScreen() {
    const styles = createStyles(COLORS);
    const auth = createAuthStyles(COLORS);

    const [submitting, setSubmitting] = useState<Submitting>('none');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const busy = submitting !== 'none';

    async function handleGuest() {
        if (busy)
            return;
        setErrorMessage(null);
        setSubmitting('guest');
        try {
            await continueAsGuest();
            router.replace('/(tabs)');
        } catch (err: any) {
            setErrorMessage(err?.message ?? 'Could not continue as guest.');
        } finally {
            setSubmitting('none');
        }
    }

    async function handleGoogle() {
        if (busy)
            return;
        setErrorMessage(null);
        setSubmitting('google');
        try {
            const success = await signInWithGoogle();
            if (success) router.replace('/(tabs)');
        } catch (err: any) {
            setErrorMessage(err?.message ?? 'Google sign-in failed.');
        } finally {
            setSubmitting('none');
        }
    }

    async function handleApple() {
        if (busy)
            return;
        setErrorMessage(null);
        setSubmitting('apple');
        try {
            await signInWithApple();
            router.replace('/(tabs)');
        } catch (err: any) {
            if (err?.code !== 'ERR_REQUEST_CANCELED')
                setErrorMessage(err?.message ?? 'Apple sign-in failed.');
        } finally {
            setSubmitting('none');
        }
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar style="light" />
            <AmbientBackground />

            <View style={styles.content}>
                <View style={styles.spacer} />

                {/* BRAND */}
                <View style={styles.center}>
                    <LogoMark />
                    <Text style={styles.wordmark}>SYNAURA</Text>
                    <Text style={styles.tagline}>Sound, tuned to you.</Text>
                </View>

                <View style={styles.spacer} />

                {/* ACTIONS */}
                <View style={styles.bottom}>
                    <PressableScale
                        style={[auth.primaryButton, busy && { opacity: 0.6 }]}
                        onPress={handleGuest}
                        disabled={busy}
                    >
                        {submitting === 'guest' ? (
                            <ActivityIndicator color={COLORS.accent} />
                        ) : (
                            <Text style={auth.primaryButtonText}>Continue as Guest</Text>
                        )}
                    </PressableScale>

                    <View style={auth.divider}>
                        <View style={auth.dividerLine} />
                        <Text style={auth.dividerLabel}>OR</Text>
                        <View style={auth.dividerLine} />
                    </View>

                    {/* SOCIAL SIGN-IN */}
                    <View style={auth.socialRow}>
                        <PressableScale
                            style={[auth.socialButton, auth.googleButton, busy && { opacity: 0.6 }]}
                            onPress={handleGoogle}
                            disabled={busy}
                        >
                            {submitting === 'google' ? (
                                <ActivityIndicator color={COLORS.neutral[900]} />
                            ) : (
                                <>
                                    <Svg width={17} height={17} viewBox="0 0 48 48">
                                        <Path
                                            fill="#FFC107"
                                            d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.9 6.1 29.7 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
                                        />
                                        <Path
                                            fill="#FF3D00"
                                            d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.9 6.1 29.7 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                                        />
                                        <Path
                                            fill="#4CAF50"
                                            d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.5 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
                                        />
                                        <Path
                                            fill="#1976D2"
                                            d="M43.6 20.5H42V20H24v8h11.3c-1.1 3-3.3 5.5-6.1 7.1l6.2 5.2C39.9 36.9 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z"
                                        />
                                    </Svg>
                                    <Text style={auth.socialButtonTextGoogle}>Google</Text>
                                </>
                            )}
                        </PressableScale>

                        {Platform.OS === 'ios' && (
                            <PressableScale
                                style={[auth.socialButton, auth.appleButton, busy && { opacity: 0.6 }]}
                                onPress={handleApple}
                                disabled={busy}
                            >
                                {submitting === 'apple' ? (
                                    <ActivityIndicator color={COLORS.text} />
                                ) : (
                                    <>
                                        <Ionicons name="logo-apple" size={19} color={COLORS.text} />
                                        <Text style={auth.socialButtonTextApple}>Apple</Text>
                                    </>
                                )}
                            </PressableScale>
                        )}
                    </View>

                    {errorMessage && <Text style={auth.errorText}>{errorMessage}</Text>}
                </View>
            </View>
        </SafeAreaView>
    );
}
