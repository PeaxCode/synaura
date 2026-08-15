import { StyleSheet } from 'react-native';
import { FONTS } from '@/src/constants/theme';

const createStyles = (COLORS: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.bg,
        },
        center: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
        },
        wordmark: {
            color: COLORS.text,
            fontSize: 26,
            fontFamily: FONTS.medium,
            letterSpacing: 9,
            marginLeft: 9,
        },
        tagline: {
            color: COLORS.neutral[500],
            fontSize: 13,
            fontFamily: FONTS.regular,
        },
    });

export default createStyles;
