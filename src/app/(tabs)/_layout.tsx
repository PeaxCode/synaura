import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps, Tabs } from 'expo-router/js-tabs';
import { router } from 'expo-router';
import { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import createStyles from '@/src/assets/styles/tab-bar.styles';
import PlayingIndicator from '@/src/components/PlayingIndicator';
import PressableScale from '@/src/components/PressableScale';
import { COLORS } from '@/src/constants/theme';
import { usePlaybackStore } from '@/src/store/playbackStore';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const TAB_META: Record<string, { icon: IoniconName; iconFilled: IoniconName; label: string }> = {
    index: { icon: 'home-outline', iconFilled: 'home', label: 'Home' },
    explore: { icon: 'compass-outline', iconFilled: 'compass', label: 'Explore' },
    library: { icon: 'albums-outline', iconFilled: 'albums', label: 'Library' },
    settings: { icon: 'settings-outline', iconFilled: 'settings', label: 'Settings' },
};

// Renders a persistent mini-player above the tab bar when a session is active, serving as a quick status and stop control.
function NowPlayingBar() {
    const styles = createStyles(COLORS);
    const currentTrack = usePlaybackStore((state) => state.currentTrack);
    const isPlaying = usePlaybackStore((state) => state.isPlaying);
    const isLoading = usePlaybackStore((state) => state.isLoading);
    const stop = usePlaybackStore((state) => state.stop);

    if (!currentTrack)
        return null;

    return (
        <PressableScale style={styles.nowPlayingBar} onPress={() => router.push('/player')}>
            <View style={styles.nowPlayingIcon}>
                {isLoading ? (
                    <ActivityIndicator size="small" color={COLORS.accent} />
                ) : (
                    <PlayingIndicator isPlaying={isPlaying} />
                )}
            </View>
            <View style={styles.nowPlayingText}>
                <Text style={styles.nowPlayingTitle} numberOfLines={1}>{currentTrack.name}</Text>
                <Text style={styles.nowPlayingMeta}>{isLoading ? 'Loading…' : isPlaying ? 'Playing' : 'Paused'}</Text>
            </View>
            <PressableScale style={styles.nowPlayingStopButton} onPress={stop}>
                <Ionicons name="stop" size={18} color={COLORS.neutral[400]} />
            </PressableScale>
        </PressableScale>
    );
}

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const styles = createStyles(COLORS);
    const insets = useSafeAreaInsets();

    // Hides the tab bar on routes that render full-screen like edit-profile.
    if (!TAB_META[state.routes[state.index].name])
        return null;

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
            <NowPlayingBar />

            <View style={styles.bar}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const meta = TAB_META[route.name];
                    if (!meta)
                        return null;

                    const isFocused = state.index === index;

                    function onPress() {
                        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                        if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
                    }

                    function onLongPress() {
                        navigation.emit({ type: 'tabLongPress', target: route.key });
                    }

                    return (
                        <Pressable
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={{ selected: isFocused }}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={[styles.button, isFocused && styles.buttonFocused]}
                        >
                            <Ionicons
                                name={isFocused ? meta.iconFilled : meta.icon}
                                size={21}
                                color={isFocused ? COLORS.text : COLORS.neutral[500]}
                            />
                            {isFocused && <Text style={styles.labelFocused}>{meta.label}</Text>}
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            tabBar={(props) => <TabBar {...props} />}
            screenOptions={{
                headerShown: false,
                sceneStyle: { backgroundColor: COLORS.bg },
            }}
        >
            <Tabs.Screen name="index" options={{ title: 'Home' }} />
            <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
            <Tabs.Screen name="library" options={{ title: 'Library' }} />
            <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
            <Tabs.Screen name="edit-profile" options={{ href: null }} />
        </Tabs>
    );
}
