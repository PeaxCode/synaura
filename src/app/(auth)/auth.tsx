import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from '@/src/assets/styles/auth.styles';
import AmbientBackground from '@/src/components/AmbientBackground';
import PressableScale from '@/src/components/PressableScale';
import { COLORS } from '@/src/constants/theme';
import { signInWithEmail, signUpWithEmail } from '@/src/data/auth';

type Mode = 'login' | 'register';

const COPY: Record<Mode, { title: string; subtitle: string; cta: string }> = {
    login: {
        title: 'Welcome',
        subtitle: 'Your library is where you left it.',
        cta: 'Sign in',
    },
    register: {
        title: 'Create your account',
        subtitle: 'Fill in your details and you\'re in.',
        cta: 'Create account',
    },
};

export default function AuthScreen() {
    const styles = createStyles(COLORS);
    const params = useLocalSearchParams<{ mode?: string }>();

    const [mode, setMode] = useState<Mode>(params.mode === 'register' ? 'register' : 'login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    const copy = COPY[mode];

    function switchMode() {
        setMode((m) => (m === 'login' ? 'register' : 'login'));
        setErrorMessage(null);
    }

    async function handleSubmit() {
        if (submitting)
            return;
        setErrorMessage(null);

        if (mode === 'register' && !name.trim()) { setErrorMessage('Name is required.'); return; }

        setSubmitting(true);
        try {
            if (mode === 'login') {
                await signInWithEmail(email.trim(), password);
            } else {
                await signUpWithEmail(email.trim(), password, name.trim());
            }
            router.replace('/(tabs)');
        } catch (err: any) {
            setErrorMessage(err?.message ?? 'Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar style="light" />

            <AmbientBackground />

            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* BRAND */}
                <View style={styles.topRow}>
                    <PressableScale style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
                        <Ionicons name="chevron-back" size={22} color="rgba(233,233,237,0.6)" />
                    </PressableScale>
                    <Text style={styles.brand}>SYNAURA</Text>
                </View>

                {/* HEADLINE */}
                <View style={styles.headline}>
                    <Text style={styles.title}>{copy.title}</Text>
                    <Text style={styles.subtitle}>{copy.subtitle}</Text>
                </View>

                {/* FIELDS */}
                <View style={styles.fields}>
                    {mode === 'register' && (
                        <View style={styles.field}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                                textContentType="name"
                                autoComplete="name"
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onSubmitEditing={() => emailRef.current?.focus()}
                            />
                        </View>
                    )}

                    <View style={styles.field}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            ref={emailRef}
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            textContentType="emailAddress"
                            autoComplete="email"
                            returnKeyType="next"
                            blurOnSubmit={false}
                            onSubmitEditing={() => passwordRef.current?.focus()}
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordWrap}>
                            <TextInput
                                ref={passwordRef}
                                style={[styles.input, { paddingRight: 44 }]}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                textContentType={mode === 'login' ? 'password' : 'newPassword'}
                                passwordRules={mode === 'register' ? 'minlength: 8;' : undefined}
                                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                                returnKeyType="done"
                                onSubmitEditing={handleSubmit}
                            />
                            <PressableScale
                                style={styles.eyeButton}
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
                        {mode === 'register' && <Text style={styles.passwordHint}>At least 8 characters</Text>}
                    </View>

                    {mode === 'login' && (
                        <Pressable style={styles.forgot} onPress={() => router.push('/forgot-password')}>
                            <Text style={styles.forgotText}>Forgot password?</Text>
                        </Pressable>
                    )}
                </View>

                <View style={styles.spacer} />

                {/* ACTIONS */}
                <View style={styles.actions}>
                    <PressableScale
                        style={[styles.primaryButton, submitting && { opacity: 0.6 }]}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator color={COLORS.accent} />
                        ) : (
                            <Text style={styles.primaryButtonText}>{copy.cta}</Text>
                        )}
                    </PressableScale>

                    {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
                </View>

                {/* SWITCH MODE */}
                <Pressable style={styles.switchMode} onPress={switchMode}>
                    <Text style={styles.switchModeText}>
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <Text style={styles.switchModeAccent}>{mode === 'login' ? 'Sign up' : 'Sign in'}</Text>
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}
