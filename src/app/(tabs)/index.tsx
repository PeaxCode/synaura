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

function greetingForHour(hour: number) {
    if (hour < 12)
        return 'Good morning';
    if (hour < 18)
        return 'Good afternoon';
    return 'Good evening';
}

// "Start a session" has no destination yet — the 4-axis pad screen is Faz 2.2
// work. Recent plays read from `preset_plays` (see database.md) — the query is
// real, it just has nothing to return until sessions can be saved (Faz 3.1).
export default function HomeScreen() {
    const styles = createStyles(COLORS);
    const [recentPlays, setRecentPlays] = useState<RecentPlay[]>([]);

    const greeting = greetingForHour(new Date().getHours());

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data }) => {
            const user = data.session?.user;
            if (!user)
                return;

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
                <Text style={styles.greeting}>{greeting}</Text>

                {/* START SESSION */}
                <View style={styles.ctaWrap}>
                    <PressableScale style={styles.ctaCard}>
                        <View style={styles.ctaIconBadge}>
                            <Ionicons name="play" size={44} color={COLORS.accent} />
                        </View>
                        <Text style={styles.ctaTitle}>Start a session</Text>
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
                        <View style={styles.emptyBox}>
                            <Text style={styles.emptyTitle}>No sessions yet</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
