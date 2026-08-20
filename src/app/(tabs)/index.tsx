import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from '@/src/assets/styles/home.styles';
import AmbientBackground from '@/src/components/AmbientBackground';
import PressableScale from '@/src/components/PressableScale';
import { COLORS } from '@/src/constants/theme';
import { RecentPlay, fetchRecentPlays } from '@/src/data/library';
import { useAuthStore } from '@/src/store/authStore';

function greetingForHour(hour: number) {
    if (hour < 12)
        return 'Good morning';
    if (hour < 18)
        return 'Good afternoon';
    return 'Good evening';
}

// Renders the Home screen with a primary "Start a session" CTA and a horizontal list of recent plays.
export default function HomeScreen() {
    const styles = createStyles(COLORS);
    const userId = useAuthStore((state) => state.user?.id);
    const [recentPlays, setRecentPlays] = useState<RecentPlay[]>([]);

    const greeting = greetingForHour(new Date().getHours());

    // Re-fetches recent plays every time the tab gains focus so it reflects sessions completed while away.
    useFocusEffect(
        useCallback(() => {
            if (!userId) return;

            fetchRecentPlays(userId, 5).then(setRecentPlays).catch(() => { });
        }, [userId]),
    );

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
                    <PressableScale style={styles.ctaCard} onPress={() => router.push('/start-session')}>
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
                                <PressableScale
                                    key={i}
                                    style={styles.recentCard}
                                    onPress={() => router.push('/library?tab=recent')}
                                >
                                    <Text style={styles.recentCardTitle} numberOfLines={1}>
                                        {play.name ?? 'Untitled'}
                                    </Text>
                                    <Text style={styles.recentCardMeta}>
                                        {play.mode === 'relax' ? 'Relax' : 'Focus'} ·{' '}
                                        {Math.max(1, Math.round(play.durationSeconds / 60))} min
                                    </Text>
                                </PressableScale>
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
