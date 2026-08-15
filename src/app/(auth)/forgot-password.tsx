import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createAuthStyles from '@/src/assets/styles/auth.styles';
import createStyles from '@/src/assets/styles/forgot-password.styles';
import GlowBlob from '@/src/components/GlowBlob';
import PressableScale from '@/src/components/PressableScale';
import { COLORS } from '@/src/constants/theme';
import { sendPasswordReset } from '@/src/data/auth';

export default function ForgotPasswordScreen() {
    const styles = createStyles(COLORS);
    const auth = createAuthStyles(COLORS);
    const { width } = useWindowDimensions();

    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleSend() {
        if (submitting || !email.trim())
            return;
        setErrorMessage(null);
        setSubmitting(true);
        try {
            await sendPasswordReset(email.trim());
            setSent(true);
        } catch (err: any) {
            setErrorMessage(err?.message ?? 'Could not send the reset link.');
        } finally {
            setSubmitting(false);
        }
    }

    const glowSize = width * 1.4;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar style="light" />

            <GlowBlob
                config={{
                    size: glowSize,
                    top: -glowSize * 0.42,
                    left: width / 2 - glowSize / 2,
                    color: 'rgba(145,132,217,0.24)',
                    animate: false,
                }}
            />

            {sent ? (
                <View style={styles.content}>
                    <View style={styles.sentWrap}>
                        <View style={styles.iconBadge}>
                            <Ionicons name="mail-outline" size={24} color={COLORS.accentRamp[400]} />
                        </View>
                        <Text style={styles.sentTitle}>Check your inbox</Text>
                        <Text style={styles.sentBody}>
                            We sent a reset link to {email.trim()}. It expires in an hour.
                        </Text>
                    </View>

                    <View style={styles.sentActions}>
                        <PressableScale
                            style={[styles.secondaryButton, submitting && { opacity: 0.6 }]}
                            onPress={handleSend}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color={COLORS.text} />
                            ) : (
                                <Text style={styles.secondaryButtonText}>Resend link</Text>
                            )}
                        </PressableScale>
                        <Pressable style={styles.link} onPress={() => router.push('/auth')}>
                            <Text style={styles.linkText}>Back to sign in</Text>
                        </Pressable>
                    </View>
                </View>
            ) : (
                <View style={styles.content}>
                    {/* BACK */}
                    <PressableScale style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
                        <Ionicons name="arrow-back" size={18} color={COLORS.text} />
                    </PressableScale>

                    {/* ICON + HEADLINE */}
                    <View style={styles.headerBlock}>
                        <View style={styles.iconBadge}>
                            <Ionicons name="lock-closed-outline" size={32} color={COLORS.accentRamp[400]} />
                        </View>

                        <View style={styles.headline}>
                            <Text style={styles.title}>Reset your password</Text>
                            <Text style={styles.subtitle}>
                                Enter the email you signed up with and we'll send you a reset link.
                            </Text>
                        </View>
                    </View>

                    {/* FIELDS */}
                    <View style={styles.fields}>
                        <View style={auth.field}>
                            <Text style={auth.label}>Email</Text>
                            <TextInput
                                style={auth.input}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                textContentType="emailAddress"
                                autoComplete="email"
                                returnKeyType="send"
                                onSubmitEditing={handleSend}
                            />
                        </View>

                        <PressableScale
                            style={[auth.primaryButton, (submitting || !email.trim()) && { opacity: 0.6 }]}
                            onPress={handleSend}
                            disabled={submitting || !email.trim()}
                        >
                            {submitting ? (
                                <ActivityIndicator color={COLORS.accent} />
                            ) : (
                                <Text style={auth.primaryButtonText}>Send reset link</Text>
                            )}
                        </PressableScale>

                        {errorMessage && <Text style={auth.errorText}>{errorMessage}</Text>}
                    </View>

                    <View style={styles.spacer} />

                    <Pressable style={styles.link} onPress={() => router.push('/auth')}>
                        <Text style={styles.linkText}>Back to sign in</Text>
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
}
