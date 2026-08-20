import { StyleSheet } from 'react-native';
import { FONTS, RADIUS } from '@/src/constants/theme';

const createStyles = (COLORS: any) =>
    StyleSheet.create({
        content: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            paddingHorizontal: 28,
            paddingTop: 20,
        },
        title: {
            fontSize: 22,
            fontFamily: FONTS.semibold,
            letterSpacing: -0.4,
            color: COLORS.text,
        },
        closeButton: {
            width: 40,
            height: 40,
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: COLORS.divider,
            alignItems: 'center',
            justifyContent: 'center',
        },
        scroll: {
            paddingHorizontal: 28,
            paddingTop: 8,
            paddingBottom: 24,
        },
        stepBody: {
            flex: 1,
            paddingHorizontal: 28,
            paddingTop: 8,
        },
        sectionLabel: {
            marginTop: 34,
            fontSize: 11,
            fontFamily: FONTS.medium,
            letterSpacing: 1.4,
            color: COLORS.neutral[500],
        },
        selectedTrackCard: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginTop: 20,
            padding: 14,
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.divider,
            backgroundColor: COLORS.surface,
        },
        selectedTrackIcon: {
            width: 22,
            height: 22,
            alignItems: 'center',
            justifyContent: 'center',
        },
        selectedTrackTitle: {
            fontSize: 14,
            fontFamily: FONTS.medium,
            color: COLORS.text,
        },
        selectedTrackMeta: {
            marginTop: 2,
            fontSize: 12,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[500],
        },
        durationGrid: {
            marginTop: 14,
            gap: 10,
        },
        durationGridRow: {
            flexDirection: 'row',
            gap: 10,
        },
        durationTile: {
            flex: 1,
            aspectRatio: 2.1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.divider,
            backgroundColor: COLORS.surface,
        },
        durationTileActive: {
            borderColor: COLORS.accent,
            backgroundColor: 'rgba(145,132,217,0.14)',
        },
        durationTileValue: {
            fontSize: 28,
            fontFamily: FONTS.semibold,
            letterSpacing: -0.5,
            color: COLORS.text,
        },
        durationTileValueActive: {
            color: COLORS.accent,
        },
        durationTileUnit: {
            fontSize: 12,
            fontFamily: FONTS.medium,
            color: COLORS.neutral[400],
        },
        durationTileUnitActive: {
            color: COLORS.accent,
        },
        padWrap: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        footer: {
            padding: 28,
            paddingTop: 12,
        },
        startButton: {
            paddingVertical: 16,
            borderRadius: RADIUS.md,
            backgroundColor: COLORS.accent,
            alignItems: 'center',
            justifyContent: 'center',
        },
        startButtonDisabled: {
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.divider,
        },
        startButtonText: {
            fontSize: 15,
            fontFamily: FONTS.semibold,
            color: COLORS.bg,
        },
        startButtonTextDisabled: {
            color: COLORS.neutral[500],
        },
        secondaryButton: {
            marginTop: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingVertical: 15,
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.divider,
        },
        secondaryButtonText: {
            fontSize: 14,
            fontFamily: FONTS.medium,
            color: COLORS.text,
        },
    });

export default createStyles;
