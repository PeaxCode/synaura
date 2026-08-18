import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import createStyles from '@/src/assets/styles/library.styles';
import { COLORS } from '@/src/constants/theme';

// Placeholder — real library list is Faz 3.1 work.
export default function LibraryScreen() {
    const styles = createStyles(COLORS);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <StatusBar style="light" />

            <View style={styles.content}>
                <Text style={styles.title}>Library</Text>

                <View style={styles.emptyWrap}>
                    <View style={styles.iconBadge}>
                        <Ionicons name="disc-outline" size={28} color={COLORS.accent} />
                    </View>
                    <Text style={styles.emptyTitle}>No saved sounds yet</Text>
                    <Text style={styles.emptyBody}>Start a session and save it here to build your library.</Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
