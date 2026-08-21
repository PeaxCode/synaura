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
        title: {
            fontSize: 26,
            fontFamily: FONTS.semibold,
            letterSpacing: -0.4,
            color: COLORS.text,
        },
        stateIndicator: {
            marginTop: 32,
        },
        // Compact tabs to fit four items across the screen width.
        tabToggle: {
            flexDirection: 'row',
            gap: 6,
            marginTop: 24,
        },
        tabButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            paddingVertical: 10,
            paddingHorizontal: 2,
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.divider,
            backgroundColor: COLORS.surface,
        },
        tabButtonActive: {
            borderColor: COLORS.accent,
            backgroundColor: 'rgba(145,132,217,0.14)',
        },
        tabButtonLabel: {
            fontSize: 11,
            fontFamily: FONTS.medium,
            color: COLORS.neutral[400],
        },
        tabButtonLabelActive: {
            color: COLORS.accent,
        },
        // Square-ish tiles that share the TrackGrid visual language.
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: 12,
            marginTop: 20,
        },
        card: {
            width: '48%',
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.divider,
            backgroundColor: COLORS.surface,
            overflow: 'hidden',
        },
        // Square placeholder matching TrackGrid card proportions.
        cardArt: {
            width: '100%',
            aspectRatio: 1,
            backgroundColor: 'rgba(145,132,217,0.08)',
        },
        downloadedBadge: {
            position: 'absolute',
            top: 8,
            left: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 3,
            paddingVertical: 3,
            paddingHorizontal: 7,
            borderRadius: RADIUS.sm,
            backgroundColor: 'rgba(10,10,18,0.72)',
        },
        downloadedBadgeLabel: {
            fontSize: 10,
            fontFamily: FONTS.medium,
            color: COLORS.text,
        },
        cardBody: {
            padding: 12,
            gap: 4,
        },
        cardTitle: {
            fontSize: 14,
            fontFamily: FONTS.medium,
            color: COLORS.text,
        },
        cardSubtitle: {
            fontSize: 12,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[500],
        },
        emptyCard: {
            width: '100%',
            paddingVertical: 24,
            borderRadius: RADIUS.md,
            borderWidth: 1.5,
            borderStyle: 'dashed',
            borderColor: COLORS.divider,
            alignItems: 'center',
        },
        emptyText: {
            fontSize: 13.5,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[500],
        },
    });

export default createStyles;
