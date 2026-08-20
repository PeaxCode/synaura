import { FONTS, RADIUS } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

const createStyles = (COLORS: any) =>
    StyleSheet.create({
        content: {
            flex: 1,
            padding: 28,
            paddingBottom: 56,
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
            borderWidth: 1,
            borderColor: COLORS.accent,
            backgroundColor: 'rgba(145,132,217,0.08)',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: COLORS.accent,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.35,
            shadowRadius: 30,
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
        transportRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            marginTop: 28,
        },
        sideButton: {
            width: 48,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
        },
        playButton: {
            width: 72,
            height: 72,
            borderRadius: RADIUS.lg,
            backgroundColor: COLORS.accent,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: COLORS.accent,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.45,
            shadowRadius: 16,
        },
    });

export default createStyles;
