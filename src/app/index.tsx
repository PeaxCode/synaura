import createStyles from '@/src/assets/styles/index.styles';
import { COLORS } from '@/src/constants/theme';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function IndexScreen() {
  const styles = createStyles(COLORS);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.wordmark}>SYNAURA</Text>
      <Text style={styles.tagline}>Sound, tuned to you.</Text>
    </View>
  );
}