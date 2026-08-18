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
import PressableScale from '@/src/components/PressableScale';
import { COLORS } from '@/src/constants/theme';
import { deleteAccount, linkGoogleAccount, unlinkGoogleAccount } from '@/src/data/auth';
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
    const hasEmailIdentity = identities.some((i) => i.provider === 'email');
    const googleIdentity = identities.find((i) => i.provider === 'google');
    const canUnlinkGoogle = identities.length > 1;

    useFocusEffect(
        useCallback(() => {
            supabase.auth.getSession().then(({ data }) => {
                setUser(data.session?.user ?? null);
            });
            supabase.auth.getUserIdentities().then(({ data }) => {
                setIdentities(data?.identities ?? []);
            });
        }, []),
    );

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.replace('/');
    }

    async function handleGoogleRow() {
        if (busy !== 'none')
            return;
        setErrorMessage(null);
        setBusy('google');
        try {
            if (googleIdentity) {
                if (!canUnlinkGoogle)
                    throw new Error('Add another sign-in method before unlinking Google.');
                await unlinkGoogleAccount(googleIdentity);
                setIdentities((prev) => prev.filter((i) => i.identity_id !== googleIdentity.identity_id));
            } else {
                const success = await linkGoogleAccount();
                if (success) {
                    const { data } = await supabase.auth.getUserIdentities();
                    setIdentities(data?.identities ?? []);
                }
            }
        } catch (err: any) {
            setErrorMessage(err?.message ?? 'Could not update your Google account.');
        } finally {
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
            router.replace('/');
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

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar style="light" />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Settings</Text>

                {/* PROFILE */}
                <PressableScale style={styles.profileCard} onPress={() => router.push('/edit-profile')}>
                    <LinearGradient
                        colors={[COLORS.accentRamp[400], COLORS.accentRamp[700]]}
                        start={{ x: 0.36, y: 0.3 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.avatar}
                    />
                    <View style={styles.profileText}>
                        <Text style={styles.profileName} numberOfLines={1}>
                            {fullName || user?.email}
                        </Text>
                        {fullName && user?.email && (
                            <Text style={styles.profileEmail} numberOfLines={1}>
                                {user.email}
                            </Text>
                        )}
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={COLORS.neutral[500]} />
                </PressableScale>

                {/* ACCOUNT */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>ACCOUNT</Text>

                    <View style={styles.sectionCard}>
                        {hasEmailIdentity && (
                            <PressableScale style={styles.row} onPress={() => router.push('/change-password')}>
                                <Text style={styles.rowLabel}>Change password</Text>
                                <Ionicons name="chevron-forward" size={18} color={COLORS.neutral[500]} />
                            </PressableScale>
                        )}

                        <PressableScale style={styles.row} onPress={handleGoogleRow} disabled={busy !== 'none'}>
                            <Text style={styles.rowLabel}>Google account</Text>
                            {busy === 'google' ? (
                                <ActivityIndicator color={COLORS.neutral[500]} />
                            ) : (
                                <Text style={[styles.rowValue, !googleIdentity && styles.rowValueAccent]}>
                                    {googleIdentity ? 'Linked' : 'Link'}
                                </Text>
                            )}
                        </PressableScale>

                        <PressableScale style={[styles.row, styles.rowLast]} onPress={handleSignOut}>
                            <Text style={styles.rowLabel}>Sign out</Text>
                            <Ionicons name="log-out-outline" size={18} color={COLORS.neutral[500]} />
                        </PressableScale>
                    </View>
                </View>

                {/* ABOUT */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>ABOUT</Text>

                    <View style={styles.sectionCard}>
                        <PressableScale style={styles.row} onPress={openLegalUrl}>
                            <Text style={styles.rowLabel}>Privacy Policy</Text>
                            <Ionicons name="open-outline" size={18} color={COLORS.neutral[500]} />
                        </PressableScale>
                        <PressableScale style={[styles.row, styles.rowLast]} onPress={openLegalUrl}>
                            <Text style={styles.rowLabel}>Terms of Service</Text>
                            <Ionicons name="open-outline" size={18} color={COLORS.neutral[500]} />
                        </PressableScale>
                    </View>
                </View>

                {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

                {/* DELETE ACCOUNT */}
                <View style={styles.deleteSection}>
                    <PressableScale style={styles.deleteRow} onPress={confirmDeleteAccount} disabled={busy !== 'none'}>
                        {busy === 'delete' ? (
                            <ActivityIndicator color="#e0899a" />
                        ) : (
                            <>
                                <Ionicons name="trash-outline" size={16} color="#e0899a" />
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
