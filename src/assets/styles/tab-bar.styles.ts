import { StyleSheet } from 'react-native';
import { FONTS, RADIUS } from '@/src/constants/theme';

const createStyles = (COLORS: any) =>
    StyleSheet.create({
        container: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            alignItems: 'center',
            backgroundColor: 'transparent',
        },
        bar: {
            flexDirection: 'row',
            backgroundColor: 'rgba(17,17,24,0.85)',
            borderRadius: 40,
            padding: 6,
            gap: 6,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'rgba(139,127,212,0.12)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 24,
            elevation: 10,
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 30,
        },
        buttonFocused: {
            backgroundColor: COLORS.accent,
            // Active tab glow
            shadowColor: COLORS.accent,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
        },
        labelFocused: {
            fontFamily: FONTS.semibold,
            fontSize: 13,
            color: COLORS.text,
            marginLeft: 6,
        },
        nowPlayingBar: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'stretch',
            gap: 12,
            marginHorizontal: 20,
            marginBottom: 10,
            padding: 12,
            borderRadius: RADIUS.lg,
            borderWidth: 1,
            borderColor: 'rgba(139,127,212,0.15)',
            backgroundColor: 'rgba(17,17,24,0.85)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 24,
            elevation: 10,
        },
        nowPlayingIcon: {
            width: 26,
            height: 26,
            alignItems: 'center',
            justifyContent: 'center',
        },
        nowPlayingText: {
            flex: 1,
        },
        nowPlayingTitle: {
            fontSize: 14,
            fontFamily: FONTS.medium,
            color: COLORS.text,
        },
        nowPlayingMeta: {
            marginTop: 2,
            fontSize: 12,
            fontFamily: FONTS.regular,
            color: COLORS.neutral[500],
        },
        nowPlayingStopButton: {
            width: 34,
            height: 34,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

export default createStyles;
