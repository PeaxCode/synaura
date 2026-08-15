import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps, Tabs } from 'expo-router/js-tabs';
import { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import createStyles from '@/src/assets/styles/tab-bar.styles';
import { COLORS } from '@/src/constants/theme';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const TAB_META: Record<string, { icon: IoniconName; iconFilled: IoniconName; label: string }> = {
    index: { icon: 'home-outline', iconFilled: 'home', label: 'Home' },
    library: { icon: 'disc-outline', iconFilled: 'disc', label: 'Library' },
    settings: { icon: 'settings-outline', iconFilled: 'settings', label: 'Settings' },
};

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const styles = createStyles(COLORS);
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
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
            <Tabs.Screen name="library" options={{ title: 'Library' }} />
            <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
        </Tabs>
    );
}
