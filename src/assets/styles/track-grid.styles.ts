import { StyleSheet } from 'react-native';
import { FONTS, RADIUS } from '@/src/constants/theme';

const createStyles = (COLORS: any) =>
    StyleSheet.create({
        modeToggle: {
            flexDirection: 'row',
            gap: 8,
            marginTop: 20,
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
            fontSize: 12,
            fontFamily: FONTS.medium,
            color: COLORS.neutral[400],
        },
        modeButtonLabelActive: {
            color: COLORS.accent,
        },
        categoryFilterScroll: {
            marginTop: 14,
            gap: 6,
            paddingRight: 20,
        },
        categoryChip: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: RADIUS.sm + 2,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.06)',
            backgroundColor: 'rgba(26, 28, 44, 0.4)',
        },
        categoryChipActive: {
            borderColor: 'rgba(145, 132, 217, 0.4)',
            backgroundColor: 'rgba(145, 132, 217, 0.12)',
        },
        categoryChipLabel: {
            fontSize: 11.5,
            fontFamily: FONTS.medium,
            color: COLORS.neutral[400],
        },
        categoryChipLabelActive: {
            color: COLORS.text,
            fontFamily: FONTS.semibold,
        },
        grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            rowGap: 14,
            marginTop: 16,
        },
        trackCard: {
            width: '48%',
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.06)',
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
        },
        trackCardActive: {
            borderColor: 'rgba(145, 132, 217, 0.5)',
            shadowColor: COLORS.accent,
            shadowOpacity: 0.25,
        },
        trackCardBody: {
            padding: 11,
            gap: 3,
        },
        trackCardTitle: {
            fontSize: 13.5,
            fontFamily: FONTS.medium,
            color: COLORS.text,
            letterSpacing: -0.1,
        },
        trackCardMeta: {
            fontSize: 11.5,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[500],
        },
        emptyFilterBox: {
            width: '100%',
            paddingVertical: 32,
            alignItems: 'center',
            justifyContent: 'center',
        },
        emptyFilterText: {
            fontSize: 13,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[500],
        },
    });

export default createStyles;

