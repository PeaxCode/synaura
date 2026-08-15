import { StyleSheet } from 'react-native';
import { FONTS } from '@/src/constants/theme';

const createStyles = (COLORS: any) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: COLORS.bg,
        },
        content: {
            flex: 1,
            padding: 28,
        },
        spacer: {
            flex: 1,
        },
        center: {
            alignItems: 'center',
            gap: 16,
        },
        wordmark: {
            color: COLORS.text,
            fontSize: 24,
            fontFamily: FONTS.medium,
            letterSpacing: 8,
            marginLeft: 8,
        },
        tagline: {
            color: COLORS.neutral[500],
            fontSize: 13,
            fontFamily: FONTS.regular,
        },
        bottom: {
            paddingBottom: 8,
        },
    });

export default createStyles;
