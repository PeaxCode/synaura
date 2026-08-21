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
            color: COLORS.accent,
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
            width: '68%',
            maxWidth: 280,
            aspectRatio: 1,
            borderRadius: RADIUS.lg,
            borderWidth: 1,
            borderColor: 'rgba(139,127,212,0.3)',
            backgroundColor: COLORS.surfaceElevated,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            overflow: 'hidden',
            // Purple glow shadow
            shadowColor: COLORS.accent,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.25,
            shadowRadius: 30,
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
            borderColor: 'rgba(139,127,212,0.15)',
            backgroundColor: 'rgba(17,17,24,0.7)',
            gap: 4,
            // Subtle purple glow
            shadowColor: COLORS.accent,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
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
            borderWidth: 1,
            borderColor: 'rgba(139,127,212,0.12)',
            backgroundColor: 'rgba(17,17,24,0.5)',
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
