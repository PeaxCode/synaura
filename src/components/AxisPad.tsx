import { Text, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import createStyles from '@/src/assets/styles/axis-pad.styles';
import MoodPad from '@/src/components/MoodPad';
import { COLORS } from '@/src/constants/theme';

interface Props {
    size: number;
    position: SharedValue<{ x: number; y: number }>;
    onPositionChange: (x: number, y: number) => void;
}

const styles = createStyles(COLORS);

// Renders a MoodPad with labels indicating which musical stem each edge controls.
export default function AxisPad({ size, position, onPositionChange }: Props) {

    return (
        <View style={styles.block}>
            <Text style={styles.axisLabel}>BRIGHTNESS</Text>

            <View style={styles.padRow}>
                <View style={styles.axisSideWrap}>
                    <Text style={[styles.axisSide, { transform: [{ rotate: '-90deg' }] }]}>MELODY</Text>
                </View>

                <MoodPad size={size} position={position} onPositionChange={onPositionChange} />

                <View style={styles.axisSideWrap}>
                    <Text style={[styles.axisSide, { transform: [{ rotate: '90deg' }] }]}>RHYTHM</Text>
                </View>
            </View>

            <Text style={styles.axisLabel}>DEPTH</Text>
        </View>
    );
}
