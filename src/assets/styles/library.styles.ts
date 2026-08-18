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
            paddingBottom: 120,
        },
        title: {
            marginTop: 12,
            fontSize: 26,
            fontFamily: FONTS.semibold,
            letterSpacing: -0.4,
            color: COLORS.text,
        },
        emptyWrap: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
        },
        iconBadge: {
            width: 56,
            height: 56,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: COLORS.accent,
            backgroundColor: 'rgba(145,132,217,0.08)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
        },
        emptyTitle: {
            fontSize: 15,
            fontFamily: FONTS.medium,
            color: COLORS.text,
        },
        emptyBody: {
            fontSize: 13,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[500],
            textAlign: 'center',
            maxWidth: 240,
        },
    });

export default createStyles;
