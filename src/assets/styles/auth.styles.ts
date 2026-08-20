import { StyleSheet } from 'react-native';
import { FONTS } from '@/src/constants/theme';

const createStyles = (COLORS: any) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: COLORS.bg,
        },
        scroll: {
            flexGrow: 1,
            padding: 28,
            paddingBottom: 40,
        },

        topRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginLeft: -14,
        },
        backButton: {
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
        },
        brand: {
            fontSize: 13,
            fontFamily: FONTS.medium,
            letterSpacing: 4,
            color: COLORS.neutral[400],
        },
        headline: {
            marginTop: 104,
            gap: 6,
        },
        title: {
            fontSize: 26,
            fontFamily: FONTS.semibold,
            letterSpacing: -0.4,
            color: COLORS.text,
        },
        subtitle: {
            fontSize: 14,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[500],
        },

        fields: {
            marginTop: 24,
            gap: 14,
        },
        field: {
            gap: 5,
        },
        label: {
            fontSize: 12,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[400],
        },
        input: {
            minHeight: 50,
            fontSize: 15,
            fontFamily: FONTS.regular,
            color: COLORS.text,
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.divider,
            borderRadius: 8,
            paddingHorizontal: 14,
        },
        passwordWrap: {
            position: 'relative',
            justifyContent: 'center',
        },
        eyeButton: {
            position: 'absolute',
            right: 12,
            height: 50,
            justifyContent: 'center',
        },
        forgot: {
            alignSelf: 'flex-end',
            marginTop: -6,
        },
        forgotText: {
            fontSize: 13,
            fontFamily: FONTS.regular,
            color: COLORS.accent,
        },
        passwordHint: {
            marginTop: 2,
            fontSize: 12,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[600],
        },
        actions: {
            marginTop: 8,
        },
        primaryButton: {
            height: 52,
            marginTop: 4,
            borderWidth: 1,
            borderColor: COLORS.accent,
            borderRadius: 8,
            alignItems: 'center',
            justifyContent: 'center',
            // iOS-only glow since Android's elevation draws a dark shadow through transparent fills.
            shadowColor: COLORS.accent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
        },
        primaryButtonText: {
            fontSize: 15,
            fontFamily: FONTS.medium,
            color: COLORS.accent,
        },
        divider: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            marginTop: 20,
            marginBottom: 20,
        },
        dividerLine: {
            flex: 1,
            height: 1,
            backgroundColor: COLORS.divider,
        },
        dividerLabel: {
            fontSize: 11,
            fontFamily: FONTS.regular,
            letterSpacing: 1.4,
            color: COLORS.neutral[600],
        },
        socialRow: {
            flexDirection: 'row',
            gap: 12,
        },
        socialButton: {
            flex: 1,
            height: 52,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            borderRadius: 8,
        },
        googleButton: {
            backgroundColor: COLORS.neutral[100],
        },
        appleButton: {
            backgroundColor: 'rgba(233,233,237,0.08)',
            borderWidth: 1.5,
            borderColor: COLORS.divider,
        },
        socialButtonTextGoogle: {
            fontSize: 14,
            fontFamily: FONTS.medium,
            color: COLORS.neutral[900],
        },
        socialButtonTextApple: {
            fontSize: 14,
            fontFamily: FONTS.medium,
            color: COLORS.text,
        },
        errorText: {
            marginTop: 14,
            fontSize: 13,
            fontFamily: FONTS.regular,
            color: '#e0899a',
            textAlign: 'center',
        },
        switchMode: {
            marginTop: 22,
            alignItems: 'center',
        },
        spacer: {
            flex: 1,
        },
        switchModeText: {
            fontSize: 13,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[500],
        },
        switchModeAccent: {
            fontFamily: FONTS.medium,
            color: COLORS.accent,
        },
    });

export default createStyles;
