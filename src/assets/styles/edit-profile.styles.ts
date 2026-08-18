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
        backButton: {
            width: 44,
            height: 44,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: COLORS.divider,
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerBlock: {
            marginTop: 12,
            alignItems: 'center',
        },
        headline: {
            marginTop: 20,
            gap: 8,
            alignItems: 'center',
        },
        title: {
            fontSize: 26,
            fontFamily: FONTS.semibold,
            letterSpacing: -0.4,
            color: COLORS.text,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 14,
            fontFamily: FONTS.regular,
            lineHeight: 21,
            color: COLORS.neutral[500],
            textAlign: 'center',
            maxWidth: 290,
        },
        fields: {
            marginTop: 40,
            gap: 18,
        },
        iconBadge: {
            width: 58,
            height: 58,
            borderRadius: 15,
            borderWidth: 1.5,
            borderColor: 'rgba(145,132,217,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

export default createStyles;
