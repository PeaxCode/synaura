import { StyleSheet } from 'react-native';
import { FONTS, RADIUS } from '@/src/constants/theme';

const createStyles = (COLORS: any) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: COLORS.bg,
        },
        content: {
            flexGrow: 1,
            padding: 28,
            paddingTop: 20,
            paddingBottom: 120,
        },
        brand: {
            fontSize: 13,
            fontFamily: FONTS.medium,
            letterSpacing: 4,
            color: COLORS.neutral[400],
        },
        greeting: {
            marginTop: 6,
            fontSize: 28,
            fontFamily: FONTS.semibold,
            letterSpacing: -0.4,
            color: COLORS.text,
        },
        ctaWrap: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        ctaCard: {
            width: '62%',
            maxWidth: 260,
            aspectRatio: 1,
            borderRadius: RADIUS.lg,
            borderWidth: 1,
            borderColor: COLORS.accent,
            backgroundColor: 'rgba(145,132,217,0.08)',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
        },
        ctaIconBadge: {
            width: 56,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 6,
        },
        ctaTitle: {
            fontSize: 18,
            fontFamily: FONTS.semibold,
            color: COLORS.accent,
            textAlign: 'center',
        },
        recentSection: {
            marginTop: 12,
        },
        sectionLabel: {
            fontSize: 11,
            fontFamily: FONTS.medium,
            letterSpacing: 1.4,
            color: COLORS.neutral[600],
        },
        recentRow: {
            marginTop: 14,
            gap: 12,
            paddingRight: 28,
        },
        recentCard: {
            width: 148,
            padding: 14,
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.divider,
            backgroundColor: COLORS.surface,
            gap: 4,
        },
        recentCardTitle: {
            fontSize: 14,
            fontFamily: FONTS.medium,
            color: COLORS.text,
        },
        recentCardMeta: {
            fontSize: 12,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[500],
        },
        emptyBox: {
            marginTop: 14,
            paddingVertical: 28,
            paddingHorizontal: 20,
            borderRadius: RADIUS.lg,
            borderWidth: 1.5,
            borderStyle: 'dashed',
            borderColor: COLORS.divider,
            alignItems: 'center',
        },
        emptyTitle: {
            fontSize: 14,
            fontFamily: FONTS.medium,
            color: COLORS.neutral[400],
            textAlign: 'center',
        },
    });

export default createStyles;
