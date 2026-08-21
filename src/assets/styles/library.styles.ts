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
            borderColor: 'rgba(139,127,212,0.4)',
            backgroundColor: COLORS.accentTint,
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
            borderColor: 'rgba(139,127,212,0.1)',
            backgroundColor: COLORS.surfaceElevated,
            overflow: 'hidden',
            shadowColor: COLORS.accent,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
        },
        // Square placeholder matching TrackGrid card proportions.
        cardArt: {
            width: '100%',
            aspectRatio: 1,
            backgroundColor: 'rgba(139,127,212,0.04)',
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
            backgroundColor: 'rgba(8,8,12,0.72)',
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
        // Row layout for the Downloads and Recent tabs.
        listContainer: {
            width: '100%',
            marginTop: 20,
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: 'rgba(139,127,212,0.1)',
            backgroundColor: COLORS.surfaceElevated,
        },
        listDivider: {
            height: 1,
            backgroundColor: 'rgba(139,127,212,0.08)',
            marginHorizontal: '10%',
        },
        listRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingVertical: 12,
            paddingHorizontal: 14,
        },
        listRowArt: {
            width: 44,
            height: 44,
            borderRadius: RADIUS.sm,
            backgroundColor: 'rgba(139,127,212,0.06)',
        },
        listRowBody: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        listRowText: {
            flex: 1,
            gap: 4,
        },
        listRowActions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
        },
        listRowIconButton: {
            width: 34,
            height: 34,
            alignItems: 'center',
            justifyContent: 'center',
        },
        menuAnchor: {
            position: 'relative',
        },
        menuBackdrop: {
            position: 'absolute',
            top: -1000,
            bottom: -1000,
            left: -1000,
            right: -1000,
        },
        menu: {
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 6,
            minWidth: 190,
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: 'rgba(139,127,212,0.15)',
            backgroundColor: COLORS.surfaceElevated,
            paddingVertical: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 16,
            elevation: 8,
            zIndex: 20,
        },
        menuRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            paddingVertical: 10,
            paddingHorizontal: 14,
        },
        menuRowLabel: {
            fontSize: 14,
            fontFamily: FONTS.medium,
            color: COLORS.neutral[300],
        },
        menuRowLabelActive: {
            color: COLORS.accent,
        },
        emptyCard: {
            width: '100%',
            paddingVertical: 24,
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: 'rgba(139,127,212,0.12)',
            backgroundColor: 'rgba(17,17,24,0.5)',
            alignItems: 'center',
        },
        emptyText: {
            fontSize: 13.5,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[500],
        },
    });

export default createStyles;
