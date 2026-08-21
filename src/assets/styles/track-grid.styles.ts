import { StyleSheet } from 'react-native';
import { FONTS, RADIUS } from '@/src/constants/theme';

const createStyles = (COLORS: any) =>
    StyleSheet.create({
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
            borderColor: 'rgba(139,127,212,0.4)',
            backgroundColor: COLORS.accentTint,
        },
        modeButtonLabel: {
            fontSize: 11,
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
            borderColor: 'rgba(139,127,212,0.1)',
            overflow: 'hidden',
            // Subtle card glow
            shadowColor: COLORS.accent,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 10,
        },
        trackCardActive: {
            borderColor: 'rgba(139,127,212,0.4)',
            shadowOpacity: 0.2,
        },
        trackCardArt: {
            width: '100%',
            aspectRatio: 1,
            backgroundColor: 'rgba(139,127,212,0.04)',
            overflow: 'hidden',
        },
        trackCardArtActive: {
            backgroundColor: 'rgba(139,127,212,0.1)',
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
