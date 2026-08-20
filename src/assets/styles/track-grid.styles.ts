import { StyleSheet } from 'react-native';
import { FONTS, RADIUS } from '@/src/constants/theme';

const createStyles = (COLORS: any) =>
    StyleSheet.create({
        // Matches the size of Library's tab toggle so both read as category pickers.
        modeToggle: {
            flexDirection: 'row',
            gap: 8,
            marginTop: 24,
        },
        modeButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            paddingVertical: 10,
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.divider,
            backgroundColor: COLORS.surface,
        },
        modeButtonActive: {
            borderColor: COLORS.accent,
            backgroundColor: 'rgba(145,132,217,0.14)',
        },
        modeButtonLabel: {
            fontSize: 12,
            fontFamily: FONTS.medium,
            color: COLORS.neutral[400],
        },
        modeButtonLabelActive: {
            color: COLORS.accent,
        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: 12,
            marginTop: 20,
        },
        trackCard: {
            width: '48%',
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: COLORS.divider,
            overflow: 'hidden',
        },
        trackCardActive: {
            borderColor: COLORS.accent,
        },
        // Square placeholder representing cover art to establish a music app layout.
        trackCardArt: {
            width: '100%',
            aspectRatio: 1,
            backgroundColor: 'rgba(145,132,217,0.08)',
        },
        trackCardArtActive: {
            backgroundColor: 'rgba(145,132,217,0.2)',
        },
        trackCardBody: {
            padding: 12,
            gap: 4,
        },
        trackCardTitle: {
            fontSize: 14,
            fontFamily: FONTS.medium,
            color: COLORS.text,
        },
        trackCardMeta: {
            fontSize: 12,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[500],
        },
    });

export default createStyles;
