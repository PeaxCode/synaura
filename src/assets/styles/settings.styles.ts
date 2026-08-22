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
            paddingBottom: 120,
        },
        title: {
            marginBottom: 24,
            fontSize: 26,
            fontFamily: FONTS.semibold,
            letterSpacing: -0.5,
            color: COLORS.text,
        },
        profileCard: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            padding: 16,
            borderRadius: RADIUS.lg,
            backgroundColor: 'rgba(26, 28, 44, 0.55)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.06)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
        },
        avatar: {
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        },
        avatarText: {
            fontSize: 16,
            fontFamily: FONTS.bold,
            color: '#fff',
        },
        profileText: {
            flex: 1,
            gap: 3,
            minWidth: 0,
        },
        profileName: {
            fontSize: 15,
            fontFamily: FONTS.semibold,
            color: COLORS.text,
            letterSpacing: -0.1,
        },
        profileEmail: {
            fontSize: 12,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[400],
        },
        upgradeBadge: {
            paddingVertical: 5,
            paddingHorizontal: 12,
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: 'rgba(145, 132, 217, 0.5)',
            backgroundColor: 'rgba(145, 132, 217, 0.12)',
        },
        upgradeBadgeText: {
            fontSize: 12,
            fontFamily: FONTS.semibold,
            color: COLORS.accent,
            letterSpacing: 0.2,
        },
        section: {
            marginTop: 28,
        },
        sectionLabel: {
            marginBottom: 10,
            fontSize: 11,
            fontFamily: FONTS.semibold,
            letterSpacing: 1.8,
            color: COLORS.neutral[400],
        },
        sectionCard: {
            borderRadius: RADIUS.lg,
            backgroundColor: 'rgba(26, 28, 44, 0.5)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.06)',
            overflow: 'hidden',
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 52,
            paddingHorizontal: 16,
        },
        divider: {
            height: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            marginHorizontal: 16,
        },
        rowLabel: {
            fontSize: 14,
            fontFamily: FONTS.medium,
            color: COLORS.text,
        },
        rowValue: {
            fontSize: 13,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[400],
        },
        linkedText: {
            fontSize: 13,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[400],
        },
        linkButton: {
            paddingVertical: 4.5,
            paddingHorizontal: 13,
            borderRadius: RADIUS.md,
            borderWidth: 1,
            borderColor: 'rgba(145, 132, 217, 0.5)',
            backgroundColor: 'rgba(145, 132, 217, 0.1)',
        },
        linkButtonText: {
            fontSize: 12.5,
            fontFamily: FONTS.semibold,
            color: COLORS.accent,
        },
        errorText: {
            marginTop: 16,
            fontSize: 13,
            fontFamily: FONTS.regular,
            color: '#e0899a',
            textAlign: 'center',
        },
        deleteSection: {
            marginTop: 32,
            alignItems: 'center',
        },
        deleteRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingVertical: 10,
            paddingHorizontal: 16,
        },
        deleteLabel: {
            fontSize: 13.5,
            fontFamily: FONTS.medium,
            color: '#e0899a',
            opacity: 0.9,
        },
        spacer: {
            flex: 1,
            minHeight: 28,
        },
        footer: {
            textAlign: 'center',
            fontSize: 11.5,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[500],
            marginTop: 16,
        },
    });

export default createStyles;
