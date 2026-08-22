import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from '@/src/assets/styles/home.styles';
import AmbientBackground from '@/src/components/AmbientBackground';
import PressableScale from '@/src/components/PressableScale';
import { COLORS } from '@/src/constants/theme';
import { Activity, ACTIVITIES } from '@/src/data/activities';
import { RecentPlay } from '@/src/data/library';
import { useAuthStore } from '@/src/store/authStore';
import { useLibraryStore } from '@/src/store/libraryStore';
import { usePlaybackStore } from '@/src/store/playbackStore';
import { useTracksStore } from '@/src/store/tracksStore';

const styles = createStyles(COLORS);

function greetingForHour(hour: number) {
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}

function getTodayMinutes(recentPlays: RecentPlay[]) {
    const todayStr = new Date().toDateString();
    const todaySeconds = recentPlays
        .filter((p) => new Date(p.playedAt).toDateString() === todayStr)
        .reduce((sum, p) => sum + p.durationSeconds, 0);
    return Math.round(todaySeconds / 60);
}

function getDayStreak(recentPlays: RecentPlay[]) {
    if (recentPlays.length === 0) return 0;
    const days = new Set(recentPlays.map((p) => new Date(p.playedAt).toDateString()));
    const today = new Date();
    let streak = 0;
    const checkDate = new Date(today);

    if (!days.has(checkDate.toDateString())) {
        checkDate.setDate(checkDate.getDate() - 1);
    }

    while (days.has(checkDate.toDateString())) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
}

export default function HomeScreen() {
    const user = useAuthStore((state) => state.user);
    const userId = user?.id;
    const tracks = useTracksStore((state) => state.tracks);
    const recentPlays = useLibraryStore((state) => state.recentPlays);
    const fetchLibrary = useLibraryStore((state) => state.fetchLibrary);

    const hour = new Date().getHours();
    const greeting = greetingForHour(hour);

    const firstName = user?.user_metadata?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? '';

    const todayMinutes = useMemo(() => getTodayMinutes(recentPlays), [recentPlays]);
    const streakDays = useMemo(() => getDayStreak(recentPlays), [recentPlays]);
    const totalSessions = recentPlays.length;

    useEffect(() => {
        if (userId) {
            fetchLibrary(userId);
        }
        useTracksStore.getState().ensureLoaded();
    }, [userId, fetchLibrary]);

    async function handleInstantStart(activity: Activity) {
        const allTracks = useTracksStore.getState().tracks;
        const track = (activity.suggestedTrackSlug && allTracks.find((t) => t.slug === activity.suggestedTrackSlug))
            ?? allTracks.find((t) => t.mode === activity.mode)
            ?? allTracks[0];

        if (!track) {
            router.push({
                pathname: '/start-session',
                params: {
                    activity: activity.slug,
                    mode: activity.mode,
                    axisX: String(activity.axisValues.x),
                    axisY: String(activity.axisValues.y),
                    minutes: String(activity.suggestedMinutes),
                },
            });
            return;
        }

        const store = usePlaybackStore.getState();
        const playing = store.playTrack(track, activity.axisValues);
        router.push('/player');
        await playing;
        store.setSessionMinutes(activity.suggestedMinutes);
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
                {/* HEADER */}
                <View style={styles.headerRow}>
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.brand}>SYNAURA</Text>
                        <Text style={styles.greeting}>
                            {greeting}{firstName ? `, ${firstName}` : ''}
                        </Text>
                    </View>

                    <PressableScale style={styles.planBadge} onPress={handleUpgrade}>
                        <Text style={styles.planBadgeText}>Free</Text>
                    </PressableScale>
                </View>

                {/* PRIMARY CTA LAUNCHER */}
                <View style={styles.ctaWrap}>
                    <PressableScale style={styles.ctaCard} onPress={() => router.push('/start-session')}>
                        <View style={styles.ctaIconBadge}>
                            <Ionicons name="play" size={38} color={COLORS.accent} style={{ marginLeft: 3 }} />
                        </View>
                        <Text style={styles.ctaTitle}>Start a session</Text>
                        <Text style={styles.ctaSubtitle}>Tune your soundscape & flow</Text>
                    </PressableScale>
                </View>

                {/* QUICK START (2x2 GRID) */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionLabel}>QUICK START</Text>
                </View>

                <View style={styles.statesGrid}>
                    {ACTIVITIES.map((activity) => (
                        <PressableScale
                            key={activity.slug}
                            style={styles.stateCard}
                            onPress={() => handleInstantStart(activity)}
                        >
                            <Text style={styles.stateLabel}>{activity.label}</Text>
                            <Text style={styles.stateDescription} numberOfLines={1}>
                                {activity.description}
                            </Text>
                        </PressableScale>
                    ))}
                </View>

                {/* TODAY'S FLOW & STATS WIDGET */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionLabel}>TODAY'S FLOW</Text>
                </View>

                <View style={styles.statsCard}>
                    <View style={styles.statCol}>
                        <Text style={styles.statVal}>
                            {streakDays > 0 ? `${streakDays} ${streakDays === 1 ? 'Day' : 'Days'}` : '1 Day'}
                        </Text>
                        <Text style={styles.statLabel}>Streak</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statCol}>
                        <Text style={styles.statVal}>
                            {todayMinutes > 0 ? `${todayMinutes}m` : '0m'}
                        </Text>
                        <Text style={styles.statLabel}>Focus Time</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statCol}>
                        <Text style={styles.statVal}>
                            {totalSessions > 0 ? `${totalSessions}` : '0'}
                        </Text>
                        <Text style={styles.statLabel}>Sessions</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


