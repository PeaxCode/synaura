import { FONTS, RADIUS } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

const createStyles = (COLORS: any) =>
    StyleSheet.create({
        content: {
            flex: 1,
            padding: 28,
            paddingBottom: 56,
            justifyContent: 'center',
        },
        artworkWrap: {
            marginTop: 20,
            alignItems: 'center',
        },
        artworkCard: {
            width: '84%',
            maxWidth: 320,
            aspectRatio: 1,
            borderRadius: RADIUS.lg,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            // Enhanced purple glow
            shadowColor: COLORS.accent,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.45,
            shadowRadius: 40,
        },
        timerValue: {
            fontSize: 56,
            fontFamily: FONTS.semibold,
            letterSpacing: -1,
            color: COLORS.text,
        },
        trackTitle: {
            marginTop: 24,
            fontSize: 24,
            fontFamily: FONTS.semibold,
            letterSpacing: -0.4,
            color: COLORS.text,
            textAlign: 'center',
        },
        trackMeta: {
            marginTop: 4,
            fontSize: 14,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[500],
        },
        // Session-elapsed progress, not scrubbable — no touch handling.
        progressTrack: {
            marginTop: 20,
            width: '84%',
            maxWidth: 320,
            height: 4,
            borderRadius: 2,
            backgroundColor: COLORS.divider,
            overflow: 'hidden',
        },
        progressFill: {
            height: '100%',
            borderRadius: 2,
            backgroundColor: COLORS.accent,
        },
        transportRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            marginTop: 28,
            position: 'relative',
        },
        sideButton: {
            width: 48,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
        },
        skipButtonLabel: {
            position: 'absolute',
            top: '100%',
            marginTop: 2,
            fontSize: 10,
            fontFamily: FONTS.medium,
            color: COLORS.neutral[400],
        },
        skipButtonLabelDisabled: {
            color: COLORS.neutral[700],
        },
        playButton: {
            width: 72,
            height: 72,
            borderRadius: RADIUS.lg,
            backgroundColor: COLORS.accent,
            alignItems: 'center',
            justifyContent: 'center',
            // Stronger glow
            shadowColor: COLORS.accent,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 24,
        },
        menuAnchor: {
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            justifyContent: 'center',
        },
        menuButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
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
            bottom: '100%',
            right: 0,
            marginBottom: 10,
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
    });

export default createStyles;
