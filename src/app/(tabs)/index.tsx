import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from '@/src/assets/styles/home.styles';
import AmbientBackground from '@/src/components/AmbientBackground';
import PressableScale from '@/src/components/PressableScale';
import { COLORS } from '@/src/constants/theme';
import { supabase } from '@/src/data/client';

type PresetPlayRow = {
    played_at: string;
    duration_seconds: number;
    presets: { name: string | null; mode: 'focus' | 'relax' } | null;
};

type RecentPlay = {
    presetName: string | null;
    mode: 'focus' | 'relax';
    durationSeconds: number;
};

// "Start a session" has no destination yet — the 4-axis pad screen is Faz 2.2
// work. Recent plays read from `preset_plays` (see database.md) — the query is
// real, it just has nothing to return until sessions can be saved (Faz 3.1).
export default function HomeScreen() {
    const styles = createStyles(COLORS);
    const [firstName, setFirstName] = useState<string | null>(null);
    const [recentPlays, setRecentPlays] = useState<RecentPlay[]>([]);

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data }) => {
            const user = data.session?.user;
            if (!user)
                return;

            const fullName = user.user_metadata?.full_name as string | undefined;
            setFirstName(fullName?.split(' ')[0] ?? null);

            const { data: plays } = await supabase
                .from('preset_plays')
                .select('played_at, duration_seconds, presets(name, mode)')
                .eq('user_id', user.id)
                .order('played_at', { ascending: false })
                .limit(10);

            setRecentPlays(
                ((plays ?? []) as unknown as PresetPlayRow[]).map((play) => ({
                    presetName: play.presets?.name ?? null,
                    mode: play.presets?.mode ?? 'focus',
                    durationSeconds: play.duration_seconds,
                })),
            );
        });
    }, []);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar style="light" />
            <AmbientBackground />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* BRAND */}
                <Text style={styles.brand}>SYNAURA</Text>

                {/* GREETING */}
                <Text style={styles.greeting}>{firstName ? `Welcome, ${firstName}` : 'Welcome'}</Text>
                <Text style={styles.headline}>Let's make your first soundscape.</Text>

                {/* START SESSION */}
                <View style={styles.ctaWrap}>
                    <PressableScale style={styles.ctaCard}>
                        <View style={styles.ctaIconBadge}>
                            <Ionicons name="play" size={32} color={COLORS.accent} />
                        </View>
                        <Text style={styles.ctaTitle}>Start a session</Text>
                        <Text style={styles.ctaSubtitle}>about 30 seconds to set up</Text>
                    </PressableScale>
                </View>

                {/* RECENT */}
                <View style={styles.recentSection}>
                    <Text style={styles.sectionLabel}>RECENT</Text>

                    {recentPlays.length > 0 ? (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.recentRow}
                        >
                            {recentPlays.map((play, i) => (
                                <View key={i} style={styles.recentCard}>
                                    <Text style={styles.recentCardTitle} numberOfLines={1}>
                                        {play.presetName ?? 'Untitled'}
                                    </Text>
                                    <Text style={styles.recentCardMeta}>
                                        {play.mode === 'relax' ? 'Relax' : 'Focus'} ·{' '}
                                        {Math.round(play.durationSeconds / 60)} min
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        <>
                            <Text style={styles.emptyTitle}>You haven't created a session yet</Text>
                            <Text style={styles.emptyBody}>
                                Anything you make can be saved here and replayed exactly.
                            </Text>
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
