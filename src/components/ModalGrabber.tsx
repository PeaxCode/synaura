import { View } from 'react-native';
import { COLORS } from '@/src/constants/theme';

// A purely decorative visual drag handle for the ModalSheet.
export default function ModalGrabber() {
    return (
        <View style={{ alignItems: 'center' }}>
            <View style={{ width: 56, height: 5, borderRadius: 2.5, backgroundColor: COLORS.neutral[700] }} />
        </View>
    );
}
