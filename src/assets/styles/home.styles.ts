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
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 110,
        },
        // HEADER
        headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 38,
        },
        headerTextWrap: {
            flex: 1,
        },
        brand: {
            fontSize: 11,
            fontFamily: FONTS.semibold,
            letterSpacing: 3.5,
            color: COLORS.accent,
            opacity: 0.9,
        },
        greeting: {
            marginTop: 4,
            fontSize: 26,
            fontFamily: FONTS.semibold,
            letterSpacing: -0.5,
            color: COLORS.text,
        },
        planBadge: {
            paddingVertical: 5,
            paddingHorizontal: 12,
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: 'rgba(145, 132, 217, 0.35)',
            backgroundColor: 'rgba(145, 132, 217, 0.08)',
        },
        planBadgeText: {
            fontSize: 12,
            fontFamily: FONTS.semibold,
            color: COLORS.accent,
            letterSpacing: 0.3,
        },

        // PRIMARY CTA LAUNCHER CARD
        ctaWrap: {
            marginBottom: 10,
        },
        ctaCard: {
            width: '100%',
            paddingVertical: 26,
            paddingHorizontal: 20,
            borderRadius: RADIUS.lg + 4,
            borderWidth: 1,
            borderColor: 'rgba(145, 132, 217, 0.22)',
            backgroundColor: 'rgba(26, 28, 44, 0.65)',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            overflow: 'hidden',
            shadowColor: COLORS.accent,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.16,
            shadowRadius: 28,
        },
        ctaIconBadge: {
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 2,
        },
        ctaTitle: {
            fontSize: 17,
            fontFamily: FONTS.semibold,
            color: COLORS.text,
            letterSpacing: -0.1,
            textAlign: 'center',
        },
        ctaSubtitle: {
            fontSize: 12,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[400],
            textAlign: 'center',
        },

        // SECTION HEADERS
        sectionHeader: {
            marginTop: 32,
            marginBottom: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        sectionLabel: {
            fontSize: 11,
            fontFamily: FONTS.semibold,
            letterSpacing: 1.8,
            color: COLORS.neutral[400],
        },

        // SOUNDSCAPE STATES (2x2 GRID)
        statesGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: 12,
        },
        stateCard: {
            width: '48%',
            paddingVertical: 16,
            paddingHorizontal: 14,
            borderRadius: RADIUS.lg,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.06)',
            backgroundColor: 'rgba(26, 28, 44, 0.5)',
            gap: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
        },
        stateLabel: {
            fontSize: 14.5,
            fontFamily: FONTS.semibold,
            color: COLORS.text,
            letterSpacing: -0.1,
        },
        stateDescription: {
            fontSize: 11.5,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[400],
        },

        // TODAY'S FLOW & STREAK WIDGET
        statsCard: {
            marginTop: 2,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 18,
            paddingHorizontal: 12,
            borderRadius: RADIUS.lg,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.06)',
            backgroundColor: 'rgba(26, 28, 44, 0.5)',
        },
        statCol: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
        },
        statVal: {
            fontSize: 16,
            fontFamily: FONTS.semibold,
            color: COLORS.text,
            letterSpacing: -0.2,
        },
        statLabel: {
            fontSize: 11,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[400],
        },
        statDivider: {
            width: 1,
            height: 26,
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
        },
    });

export default createStyles;

