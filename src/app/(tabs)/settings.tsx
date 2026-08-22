import { Ionicons } from '@expo/vector-icons';
import { User, UserIdentity } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from '@/src/assets/styles/settings.styles';
import AmbientBackground from '@/src/components/AmbientBackground';
import PressableScale from '@/src/components/PressableScale';
import { COLORS } from '@/src/constants/theme';
import { deleteAccount, linkGoogleAccount } from '@/src/data/auth';
import { supabase } from '@/src/data/client';

type Busy = 'none' | 'google' | 'delete';

// Placeholder destination for both — swap for dedicated pages once they exist.
const LEGAL_URL = 'http://maslaking.com';

function openLegalUrl() {
    WebBrowser.openBrowserAsync(LEGAL_URL);
}

export default function SettingsScreen() {
    const styles = createStyles(COLORS);
    const [user, setUser] = useState<User | null>(null);
    const [identities, setIdentities] = useState<UserIdentity[]>([]);
    const [busy, setBusy] = useState<Busy>('none');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const fullName = user?.user_metadata?.full_name as string | undefined;
    const googleIdentity = identities.find((i) => i.provider === 'google');
    const appleIdentity = identities.find((i) => i.provider === 'apple');
    const isGuest = !!user?.is_anonymous;

    const initial = (fullName ? fullName[0] : (user?.email ? user.email[0] : 'S')).toUpperCase();

    useFocusEffect(
        useCallback(() => {
            refreshAuthState();
        }, []),
    );

    async function refreshAuthState() {
        const [{ data: sessionData }, { data: identityData }] = await Promise.all([
            supabase.auth.getSession(),
            supabase.auth.getUserIdentities(),
        ]);
        setUser(sessionData.session?.user ?? null);
        setIdentities(identityData?.identities ?? []);
    }

    function handleSignOut() {
        if (isGuest) {
            Alert.alert(
                'Sign out as guest?',
                "You haven't linked a Google account. Signing out will permanently erase this guest account and everything in it.",
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Sign out', style: 'destructive', onPress: doSignOut },
                ],
            );
            return;
        }

        doSignOut();
    }

    async function doSignOut() {
        await supabase.auth.signOut();
        router.replace('/(auth)');
    }

    function handleGoogleRow() {
        if (busy !== 'none' || googleIdentity)
            return;

        handleLinkGoogle();
    }

    async function handleLinkGoogle() {
        setErrorMessage(null);
        setBusy('google');
        try {
            const success = await linkGoogleAccount();
            if (!success)
                setErrorMessage('Google sign-in was cancelled or did not complete. Please try again.');
        } catch (err: any) {
            setErrorMessage(err?.message ?? 'Could not link your Google account.');
        } finally {
            // Refetches auth state from the server regardless of outcome to ensure the UI stays synchronized.
            await refreshAuthState();
            setBusy('none');
        }
    }

    async function handleDeleteAccount() {
        if (busy !== 'none')
            return;
        setErrorMessage(null);
        setBusy('delete');
        try {
            await deleteAccount();
            router.replace('/(auth)');
        } catch (err: any) {
            setErrorMessage(err?.message ?? 'Could not delete your account.');
            setBusy('none');
        }
    }

    function confirmDeleteAccount() {
        Alert.alert(
            'Delete account',
            'This permanently deletes your account and everything in it. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: handleDeleteAccount },
            ],
        );
    }

    function handleUpgrade() {
        Alert.alert(
            'Synaura Pro',
            'Unlock all neuro-acoustic soundscapes, unlimited offline sessions, and custom frequencies.',
            [{ text: 'Got it', style: 'default' }]
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar style="light" />
            <AmbientBackground />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Settings</Text>

                {/* PROFILE */}
                <PressableScale style={styles.profileCard} onPress={() => router.push('/edit-profile')}>
                    <LinearGradient
                        colors={['#8B7FD4', '#5D5294']}
                        start={{ x: 0.2, y: 0.2 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.avatar}
                    >
                        <Text style={styles.avatarText}>{initial}</Text>
                    </LinearGradient>
                    <View style={styles.profileText}>
                        <Text style={styles.profileName} numberOfLines={1}>
                            {fullName || user?.email || 'Guest'}
                        </Text>
                        <Text style={styles.profileEmail} numberOfLines={1}>
                            {fullName && user?.email ? user.email : 'Free tier'}
                        </Text>
                    </View>

                    <PressableScale
                        style={styles.upgradeBadge}
                        onPress={(e) => {
                            e.stopPropagation?.();
                            handleUpgrade();
                        }}
                    >
                        <Text style={styles.upgradeBadgeText}>Upgrade</Text>
                    </PressableScale>
                </PressableScale>

                {/* ACCOUNT */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>ACCOUNT</Text>

                    <View style={styles.sectionCard}>
                        {!appleIdentity && (
                            <>
                                <PressableScale
                                    style={styles.row}
                                    onPress={handleGoogleRow}
                                    disabled={busy !== 'none' || !!googleIdentity}
                                >
                                    <Text style={styles.rowLabel}>Google account</Text>
                                    {busy === 'google' ? (
                                        <ActivityIndicator size="small" color={COLORS.accent} />
                                    ) : googleIdentity ? (
                                        <Text style={styles.linkedText}>Linked</Text>
                                    ) : (
                                        <View style={styles.linkButton}>
                                            <Text style={styles.linkButtonText}>Link</Text>
                                        </View>
                                    )}
                                </PressableScale>
                                <View style={styles.divider} />
                            </>
                        )}

                        <PressableScale style={styles.row} onPress={handleSignOut}>
                            <Text style={styles.rowLabel}>Sign out</Text>
                            <Ionicons name="log-out-outline" size={18} color={COLORS.neutral[400]} />
                        </PressableScale>
                    </View>
                </View>

                {/* ABOUT */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>ABOUT</Text>

                    <View style={styles.sectionCard}>
                        <PressableScale style={styles.row} onPress={openLegalUrl}>
                            <Text style={styles.rowLabel}>Privacy Policy</Text>
                            <Ionicons name="open-outline" size={16} color={COLORS.neutral[400]} />
                        </PressableScale>
                        <View style={styles.divider} />
                        <PressableScale style={styles.row} onPress={openLegalUrl}>
                            <Text style={styles.rowLabel}>Terms of Service</Text>
                            <Ionicons name="open-outline" size={16} color={COLORS.neutral[400]} />
                        </PressableScale>
                    </View>
                </View>

                {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

                {/* DELETE ACCOUNT */}
                <View style={styles.deleteSection}>
                    <PressableScale style={styles.deleteRow} onPress={confirmDeleteAccount} disabled={busy !== 'none'}>
                        {busy === 'delete' ? (
                            <ActivityIndicator size="small" color="#e0899a" />
                        ) : (
                            <>
                                <Ionicons name="trash-outline" size={15} color="#e0899a" />
                                <Text style={styles.deleteLabel}>Delete account</Text>
                            </>
                        )}
                    </PressableScale>
                </View>

                <View style={styles.spacer} />
                <Text style={styles.footer}>
                    Synaura {Constants.expoConfig?.version ?? '1.0.0'} · not a medical device
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

