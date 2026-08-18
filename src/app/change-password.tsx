import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { ActivityIndicator, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createAuthStyles from '@/src/assets/styles/auth.styles';
import createStyles from '@/src/assets/styles/change-password.styles';
import PressableScale from '@/src/components/PressableScale';
import { COLORS } from '@/src/constants/theme';
import { changePassword } from '@/src/data/auth';

export default function ChangePasswordScreen() {
    const styles = createStyles(COLORS);
    const auth = createAuthStyles(COLORS);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    const confirmRef = useRef<TextInput>(null);

    async function handleSubmit() {
        if (submitting)
            return;
        setErrorMessage(null);

        if (password.length < 8)
            return setErrorMessage('Password must be at least 8 characters.');
        if (password !== confirmPassword)
            return setErrorMessage('Passwords do not match.');

        setSubmitting(true);
        try {
            await changePassword(password);
            setDone(true);
        } catch (err: any) {
            setErrorMessage(err?.message ?? 'Could not update your password.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar style="light" />

            {done ? (
                <View style={styles.content}>
                    <View style={styles.sentWrap}>
                        <View style={styles.iconBadge}>
                            <Ionicons name="checkmark-circle-outline" size={24} color={COLORS.accentRamp[400]} />
                        </View>
                        <Text style={styles.sentTitle}>Password updated</Text>
                        <Text style={styles.sentBody}>Your password has been changed.</Text>
                    </View>

                    <PressableScale style={auth.primaryButton} onPress={() => router.back()}>
                        <Text style={auth.primaryButtonText}>Done</Text>
                    </PressableScale>
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
                            <Ionicons name="key-outline" size={32} color={COLORS.accentRamp[400]} />
                        </View>

                        <View style={styles.headline}>
                            <Text style={styles.title}>Change password</Text>
                            <Text style={styles.subtitle}>Choose a new password for your account.</Text>
                        </View>
                    </View>

                    {/* FIELDS */}
                    <View style={styles.fields}>
                        <View style={auth.field}>
                            <Text style={auth.label}>New password</Text>
                            <View style={auth.passwordWrap}>
                                <TextInput
                                    style={[auth.input, { paddingRight: 44 }]}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    textContentType="newPassword"
                                    passwordRules="minlength: 8;"
                                    autoComplete="new-password"
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    onSubmitEditing={() => confirmRef.current?.focus()}
                                />
                                <PressableScale
                                    style={auth.eyeButton}
                                    onPress={() => setShowPassword((v) => !v)}
                                    hitSlop={8}
                                >
                                    <Ionicons
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={17}
                                        color={COLORS.neutral[500]}
                                    />
                                </PressableScale>
                            </View>
                            <Text style={auth.passwordHint}>At least 8 characters</Text>
                        </View>

                        <View style={auth.field}>
                            <Text style={auth.label}>Confirm new password</Text>
                            <TextInput
                                ref={confirmRef}
                                style={auth.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                textContentType="newPassword"
                                autoComplete="new-password"
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit}
                            />
                        </View>

                        <PressableScale
                            style={[auth.primaryButton, submitting && { opacity: 0.6 }]}
                            onPress={handleSubmit}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color={COLORS.accent} />
                            ) : (
                                <Text style={auth.primaryButtonText}>Update password</Text>
                            )}
                        </PressableScale>

                        {errorMessage && <Text style={auth.errorText}>{errorMessage}</Text>}
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}
