import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from '@/src/assets/styles/explore.styles';
import AmbientBackground from '@/src/components/AmbientBackground';
import TrackGrid from '@/src/components/TrackGrid';
import { COLORS } from '@/src/constants/theme';
import { Track } from '@/src/data/tracks';
import { useTrackPreview } from '@/src/hooks/useTrackPreview';
import { useTracksStore } from '@/src/store/tracksStore';

// Renders a browse-only catalog where tapping a track plays a local preview, decoupled from the app-wide session player.
export default function ExploreScreen() {
    const styles = createStyles(COLORS);
    const tracks = useTracksStore((state) => state.tracks);
    const isLoadingTracks = useTracksStore((state) => state.isLoading);
    const loadError = useTracksStore((state) => state.error);
    const { playingSlug, loadingSlug, play, stop } = useTrackPreview();

    useEffect(() => {
        useTracksStore.getState().ensureLoaded();
    }, []);

    function handleTrackPress(track: Track) {
        if (playingSlug === track.slug) stop();
        else play(track);
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar style="light" />
            <AmbientBackground />

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.title}>Explore</Text>
                </View>

                {/* LOADING / ERROR / EMPTY */}
                {isLoadingTracks && <ActivityIndicator style={styles.stateIndicator} color={COLORS.accent} />}
                {!isLoadingTracks && loadError && (
                    <View style={styles.emptyWrap}>
                        <View style={styles.emptyBox}>
                            <View style={styles.emptyIcon}>
                                <Ionicons name="alert-circle-outline" size={22} color={COLORS.neutral[400]} />
                            </View>
                            <Text style={styles.emptyTitle}>{loadError}</Text>
                        </View>
                    </View>
                )}
                {!isLoadingTracks && !loadError && tracks.length === 0 && (
                    <View style={styles.emptyWrap}>
                        <View style={styles.emptyBox}>
                            <View style={styles.emptyIcon}>
                                <Ionicons name="compass-outline" size={22} color={COLORS.neutral[400]} />
                            </View>
                            <Text style={styles.emptyTitle}>No sounds available right now</Text>
                        </View>
                    </View>
                )}

                <TrackGrid tracks={tracks} activeSlug={playingSlug} loadingSlug={loadingSlug} onSelect={handleTrackPress} />
            </ScrollView>
        </SafeAreaView>
    );
}
