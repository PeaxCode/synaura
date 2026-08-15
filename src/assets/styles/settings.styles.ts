import { StyleSheet } from 'react-native';
import { FONTS } from '@/src/constants/theme';

const createStyles = (COLORS: any) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: COLORS.bg,
        },
        content: {
            flex: 1,
            padding: 28,
            paddingBottom: 120,
        },
        title: {
            marginTop: 12,
            fontSize: 26,
            fontFamily: FONTS.semibold,
            letterSpacing: -0.4,
            color: COLORS.text,
        },
        section: {
            marginTop: 36,
            gap: 12,
        },
        sectionLabel: {
            fontSize: 11,
            fontFamily: FONTS.medium,
            letterSpacing: 1.4,
            color: COLORS.neutral[600],
        },
        email: {
            fontSize: 14,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[400],
        },
        signOutButton: {
            marginTop: 4,
            alignSelf: 'flex-start',
            minHeight: 48,
            paddingHorizontal: 24,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: COLORS.divider,
            alignItems: 'center',
            justifyContent: 'center',
        },
        signOutText: {
            color: COLORS.text,
            fontSize: 14,
            fontFamily: FONTS.medium,
        },
    });

export default createStyles;
