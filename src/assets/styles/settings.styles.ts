import { StyleSheet } from 'react-native';
import { FONTS } from '@/src/constants/theme';

const createStyles = (COLORS: any) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: COLORS.bg,
        },
        content: {
            flexGrow: 1,
            padding: 24,
            paddingTop: 20,
            paddingBottom: 120,
        },
        title: {
            marginBottom: 20,
            fontSize: 26,
            fontFamily: FONTS.semibold,
            letterSpacing: -0.4,
            color: COLORS.text,
        },
        profileCard: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            padding: 14,
            borderRadius: 14,
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.divider,
        },
        avatar: {
            width: 42,
            height: 42,
            borderRadius: 11,
            overflow: 'hidden',
        },
        profileText: {
            flex: 1,
            gap: 2,
            minWidth: 0,
        },
        profileLineRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            minWidth: 0,
        },
        profileLineText: {
            flexShrink: 1,
        },
        profileName: {
            fontSize: 14,
            fontFamily: FONTS.medium,
            color: COLORS.text,
        },
        profileEmail: {
            fontSize: 12,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[500],
        },
        section: {
            marginTop: 28,
        },
        sectionLabel: {
            marginBottom: 8,
            marginLeft: 4,
            fontSize: 11,
            fontFamily: FONTS.medium,
            letterSpacing: 1.4,
            color: COLORS.neutral[500],
        },
        sectionCard: {
            borderRadius: 14,
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.divider,
            overflow: 'hidden',
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 52,
            paddingHorizontal: 14,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(233,233,237,0.07)',
        },
        rowLast: {
            borderBottomWidth: 0,
        },
        rowLabel: {
            fontSize: 14.5,
            fontFamily: FONTS.regular,
            color: COLORS.text,
        },
        rowValue: {
            fontSize: 13,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[500],
        },
        rowValueAccent: {
            fontFamily: FONTS.medium,
            color: COLORS.accent,
        },
        errorText: {
            marginTop: 20,
            fontSize: 13,
            fontFamily: FONTS.regular,
            color: '#e0899a',
            textAlign: 'center',
        },
        deleteSection: {
            marginTop: 36,
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
            fontSize: 14,
            fontFamily: FONTS.medium,
            color: '#e0899a',
        },
        spacer: {
            flex: 1,
            minHeight: 28,
        },
        footer: {
            textAlign: 'center',
            fontSize: 11,
            fontFamily: FONTS.regular,
            color: 'rgba(233,233,237,0.28)',
        },
    });

export default createStyles;
