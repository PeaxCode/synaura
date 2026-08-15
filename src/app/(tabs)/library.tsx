import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import createStyles from '@/src/assets/styles/library.styles';
import { COLORS } from '@/src/constants/theme';

// Placeholder — real library list is Faz 3.1 work.
export default function LibraryScreen() {
    const styles = createStyles(COLORS);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Text style={styles.title}>Library</Text>
        </View>
    );
}
