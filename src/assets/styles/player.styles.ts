import { FONTS, RADIUS } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

const createStyles = (COLORS: any) =>
    StyleSheet.create({
        // No more flex-spacer between the artwork block and the transport row —
        // centering the two as a group keeps them close together regardless of
        // how tall the artwork block is (e.g. with/without the progress bar),
        // instead of transport always being pinned to the very bottom.
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
        // `position: relative` so the ⋯ menu button/dropdown (menuAnchor) can
        // pin itself to this row's right edge without disturbing the centered
        // skip/play/skip group.
        transportRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            marginTop: 28,
            position: 'relative',
        },
        // Flat, no box — icon + color/label carries state, no background/border.
        // The label is positioned absolutely (not stacked in normal flow) so it
        // doesn't push the icon off-center — the icon alone determines this
        // button's center, which is what lines it up with playButton's icon on
        // the same row (both boxes share transportRow's `alignItems: center`,
        // but only if each box's *content* is actually centered within it).
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
            shadowColor: COLORS.accent,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.45,
            shadowRadius: 16,
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
        // Oversized, invisible — the anchor itself is only 40×40, so a same-size
        // backdrop wouldn't catch taps anywhere else on screen to dismiss.
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
            borderColor: COLORS.divider,
            backgroundColor: COLORS.surface,
            paddingVertical: 6,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
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
