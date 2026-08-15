import { StyleSheet } from 'react-native';
import { FONTS } from '@/src/constants/theme';

export const ONBOARDING_PAGE_PADDING = 28;

const createStyles = (COLORS: any) =>
    StyleSheet.create({
        safeArea: {
            flex: 1,
            backgroundColor: COLORS.bg,
        },

        /* CHROME */
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            height: 52,
            paddingHorizontal: 12,
            zIndex: 5,
        },
        backButton: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        progressWrap: {
            position: 'absolute',
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 6,
        },
        segment: {
            width: 30,
            height: 3,
            borderRadius: 2,
            backgroundColor: 'rgba(233,233,237,0.14)',
        },
        segmentOn: {
            backgroundColor: COLORS.accentRamp[400],
        },

        /* STEP SHELL */
        step: {
            flex: 1,
            paddingHorizontal: ONBOARDING_PAGE_PADDING,
            paddingBottom: 24,
        },
        centerBlock: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },

        /* BEGIN */
        wordmark: {
            marginTop: 34,
            fontSize: 34,
            fontFamily: FONTS.semibold,
            letterSpacing: 5,
            color: COLORS.text,
        },
        tagline: {
            marginTop: 14,
            maxWidth: 250,
            fontSize: 15,
            fontFamily: FONTS.regular,
            lineHeight: 23,
            textAlign: 'center',
            color: 'rgba(233,233,237,0.55)',
        },

        /* STORY */
        waveWrap: {
            marginBottom: 46,
            alignItems: 'center',
            justifyContent: 'center',
        },
        waveDot: {
            position: 'absolute',
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: COLORS.accentRamp[200],
            shadowColor: COLORS.accentRamp[300],
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: 14,
            elevation: 8,
        },
        storyTitle: {
            maxWidth: 290,
            fontSize: 28,
            fontFamily: FONTS.semibold,
            lineHeight: 34,
            letterSpacing: -0.4,
            textAlign: 'center',
            color: COLORS.text,
        },
        storyBody: {
            marginTop: 14,
            maxWidth: 280,
            fontSize: 15,
            fontFamily: FONTS.regular,
            lineHeight: 24,
            textAlign: 'center',
            color: 'rgba(233,233,237,0.55)',
        },

        /* QUESTION HEADERS */
        questionTitle: {
            fontSize: 28,
            fontFamily: FONTS.semibold,
            lineHeight: 33,
            letterSpacing: -0.4,
            color: COLORS.text,
        },
        questionSub: {
            marginTop: 8,
            fontSize: 14,
            fontFamily: FONTS.regular,
            lineHeight: 21,
            color: 'rgba(233,233,237,0.55)',
        },

        /* OPTIONS — one card anatomy for every question */
        optionCard: {
            flex: 1,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: 'rgba(233,233,237,0.09)',
            backgroundColor: 'rgba(35,37,50,0.75)',
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            overflow: 'hidden',
        },
        optionCardActive: {
            borderColor: 'rgba(181,171,252,0.4)',
            backgroundColor: 'rgba(145,132,217,0.16)',
        },
        optionTitle: {
            fontSize: 17,
            fontFamily: FONTS.semibold,
            letterSpacing: -0.2,
            textAlign: 'center',
            color: COLORS.text,
        },
        optionSub: {
            marginTop: -6,
            fontSize: 12.5,
            fontFamily: FONTS.regular,
            lineHeight: 18,
            textAlign: 'center',
            color: 'rgba(233,233,237,0.5)',
        },

        goalList: {
            flex: 1,
            gap: 14,
            marginTop: 26,
        },
        goalGlow: {
            position: 'absolute',
            right: -80,
            top: -80,
        },

        hourGrid: {
            flex: 1,
            gap: 12,
            marginTop: 28,
        },
        hourRow: {
            flex: 1,
            flexDirection: 'row',
            gap: 12,
        },

        senseList: {
            flex: 1,
            gap: 12,
            marginTop: 28,
        },
        senseBars: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 5,
            height: 34,
        },
        senseBar: {
            width: 6,
            borderRadius: 3,
            backgroundColor: 'rgba(233,233,237,0.15)',
        },
        senseBarOn: {
            backgroundColor: COLORS.accentRamp[300],
        },
        senseFootnote: {
            marginTop: 18,
            fontSize: 12,
            fontFamily: FONTS.regular,
            lineHeight: 19,
            textAlign: 'center',
            color: 'rgba(233,233,237,0.38)',
        },

        /* PROOF — baseline left, Synaura right */
        proofRow: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: 38,
            paddingVertical: 30,
        },
        proofColumn: {
            alignItems: 'center',
            gap: 12,
        },
        proofBar: {
            width: 94,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        },
        proofBarGhost: {
            borderWidth: 1,
            borderColor: 'rgba(233,233,237,0.14)',
            backgroundColor: 'rgba(233,233,237,0.09)',
        },
        proofValue: {
            fontSize: 27,
            fontFamily: FONTS.semibold,
            letterSpacing: -0.4,
            color: COLORS.neutral[900],
        },
        proofValueGhost: {
            fontSize: 19,
            fontFamily: FONTS.semibold,
            color: 'rgba(233,233,237,0.7)',
        },
        proofMetric: {
            marginTop: 2,
            fontSize: 9,
            fontFamily: FONTS.medium,
            letterSpacing: 1.3,
            textAlign: 'center',
            color: 'rgba(41,43,49,0.7)',
        },
        proofMetricGhost: {
            marginTop: 2,
            fontSize: 9,
            fontFamily: FONTS.medium,
            letterSpacing: 1.3,
            color: 'rgba(233,233,237,0.4)',
        },
        proofLabel: {
            fontSize: 10,
            fontFamily: FONTS.medium,
            letterSpacing: 1.2,
            color: 'rgba(233,233,237,0.4)',
        },
        proofLabelBright: {
            fontSize: 10,
            fontFamily: FONTS.medium,
            letterSpacing: 1.2,
            color: 'rgba(233,233,237,0.75)',
        },
        proofCaption: {
            marginBottom: 18,
            fontSize: 11,
            fontFamily: FONTS.regular,
            textAlign: 'center',
            color: 'rgba(233,233,237,0.35)',
        },

        /* PRIMER */
        primerList: {
            gap: 24,
            marginTop: 42,
        },
        primerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 18,
        },
        // Fixed width, no chrome — keeps the three lines of text left-aligned
        // with each other even though the glyphs differ in width.
        primerIcon: {
            width: 30,
            textAlign: 'center',
        },
        primerText: {
            flex: 1,
            fontSize: 14.5,
            fontFamily: FONTS.regular,
            lineHeight: 22,
            color: 'rgba(233,233,237,0.8)',
        },

        /* PAD */
        padBlock: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        padRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        axisLabel: {
            marginVertical: 8,
            fontSize: 10,
            fontFamily: FONTS.medium,
            letterSpacing: 1.4,
            color: 'rgba(233,233,237,0.4)',
        },
        axisSideWrap: {
            width: 16,
            alignItems: 'center',
            justifyContent: 'center',
        },
        axisSide: {
            width: 80,
            textAlign: 'center',
            fontSize: 10,
            fontFamily: FONTS.medium,
            letterSpacing: 1.4,
            color: 'rgba(233,233,237,0.4)',
        },
        padResult: {
            marginTop: 26,
            alignItems: 'center',
            gap: 6,
        },
        padPreset: {
            fontSize: 19,
            fontFamily: FONTS.semibold,
            letterSpacing: -0.2,
            color: COLORS.accentRamp[300],
        },
        padContext: {
            fontSize: 13.5,
            fontFamily: FONTS.regular,
            textAlign: 'center',
            color: 'rgba(233,233,237,0.55)',
        },

        /* BUILDING */
        ringWrap: {
            width: 150,
            height: 150,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 34,
        },
        buildTitle: {
            fontSize: 26,
            fontFamily: FONTS.semibold,
            letterSpacing: -0.4,
            color: COLORS.text,
        },
        buildList: {
            gap: 12,
            marginTop: 26,
        },
        buildRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        buildText: {
            fontSize: 13,
            fontFamily: FONTS.regular,
            color: 'rgba(233,233,237,0.65)',
        },

        /* FIRST AURA */
        auraKicker: {
            fontSize: 11,
            fontFamily: FONTS.medium,
            letterSpacing: 2.2,
            textAlign: 'center',
            color: 'rgba(233,233,237,0.45)',
        },
        auraTitle: {
            fontSize: 24,
            fontFamily: FONTS.semibold,
            letterSpacing: 3,
            color: COLORS.text,
        },
        auraSub: {
            marginTop: 12,
            fontSize: 13,
            fontFamily: FONTS.regular,
            textAlign: 'center',
            color: 'rgba(233,233,237,0.5)',
        },

        /* ACTIONS */
        primaryButton: {
            minHeight: 52,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: COLORS.accent,
            alignItems: 'center',
            justifyContent: 'center',
            // iOS-only glow on purpose. Android's `elevation` would draw its
            // shadow straight through the transparent fill as a dark slab, so
            // this button stays a clean outline there.
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
        ghostButton: {
            minHeight: 52,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: 'rgba(233,233,237,0.12)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        ghostButtonText: {
            fontSize: 15,
            fontFamily: FONTS.medium,
            color: 'rgba(233,233,237,0.45)',
        },
    });

export default createStyles;
