import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createAuthStyles from '@/src/assets/styles/auth.styles';
import createStyles from '@/src/assets/styles/edit-profile.styles';
import PressableScale from '@/src/components/PressableScale';
import { COLORS } from '@/src/constants/theme';
import { updateFullName } from '@/src/data/auth';
import { supabase } from '@/src/data/client';

export default function EditProfileScreen() {
    const styles = createStyles(COLORS);
    const auth = createAuthStyles(COLORS);

    const [fullName, setFullName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setFullName((data.session?.user.user_metadata?.full_name as string | undefined) ?? '');
        });
    }, []);

    async function handleSave() {
        if (submitting)
            return;
        setErrorMessage(null);

        if (!fullName.trim())
            return setErrorMessage('Name is required.');

        setSubmitting(true);
        try {
            await updateFullName(fullName.trim());
            router.back();
        } catch (err: any) {
            setErrorMessage(err?.message ?? 'Could not update your name.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            <StatusBar style="light" />

            <View style={styles.content}>
                {/* BACK */}
                <PressableScale style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
                    <Ionicons name="arrow-back" size={18} color={COLORS.text} />
                </PressableScale>

                {/* ICON + HEADLINE */}
                <View style={styles.headerBlock}>
                    <View style={styles.iconBadge}>
                        <Ionicons name="person-outline" size={32} color={COLORS.accentRamp[400]} />
                    </View>

                    <View style={styles.headline}>
                        <Text style={styles.title}>Edit profile</Text>
                        <Text style={styles.subtitle}>This is how your name appears across Synaura.</Text>
                    </View>
                </View>

                {/* FIELDS */}
                <View style={styles.fields}>
                    <View style={auth.field}>
                        <Text style={auth.label}>Full name</Text>
                        <TextInput
                            style={auth.input}
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="none"
                            textContentType="name"
                            autoComplete="name"
                            returnKeyType="done"
                            onSubmitEditing={handleSave}
                        />
                    </View>

                    <PressableScale
                        style={[auth.primaryButton, submitting && { opacity: 0.6 }]}
                        onPress={handleSave}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator color={COLORS.accent} />
                        ) : (
                            <Text style={auth.primaryButtonText}>Save</Text>
                        )}
                    </PressableScale>

                    {errorMessage && <Text style={auth.errorText}>{errorMessage}</Text>}
                </View>
            </View>
        </SafeAreaView>
    );
}
