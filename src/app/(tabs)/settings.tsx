import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from '@/src/assets/styles/settings.styles';
import { COLORS } from '@/src/constants/theme';
import { supabase } from '@/src/data/client';

export default function SettingsScreen() {
    const styles = createStyles(COLORS);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setEmail(data.session?.user.email ?? null);
        });
    }, []);

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.replace('/');
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar style="light" />

            <View style={styles.content}>
                <Text style={styles.title}>Settings</Text>

                {/* ACCOUNT */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>ACCOUNT</Text>
                    {email && <Text style={styles.email}>{email}</Text>}

                    <Pressable style={styles.signOutButton} onPress={handleSignOut}>
                        <Text style={styles.signOutText}>Sign out</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}
