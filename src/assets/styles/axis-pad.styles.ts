import { StyleSheet } from 'react-native';
import { FONTS } from '@/src/constants/theme';

const createStyles = (COLORS: any) =>
    StyleSheet.create({
        block: {
            alignItems: 'center',
        },
        padRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        axisLabel: {
            marginVertical: 8,
            fontSize: 10,
            fontFamily: FONTS.medium,
            letterSpacing: 1.4,
            color: 'rgba(233,233,237,0.4)',
        },
        axisSideWrap: {
            width: 16,
            alignItems: 'center',
            justifyContent: 'center',
        },
        axisSide: {
            width: 80,
            textAlign: 'center',
            fontSize: 10,
            fontFamily: FONTS.medium,
            letterSpacing: 1.4,
            color: 'rgba(233,233,237,0.4)',
        },
    });

export default createStyles;
