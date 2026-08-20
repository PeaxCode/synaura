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
            padding: 28,
            paddingTop: 20,
            paddingBottom: 120,
        },
        header: {
            gap: 6,
        },
        title: {
            fontSize: 26,
            fontFamily: FONTS.semibold,
            letterSpacing: -0.4,
            color: COLORS.text,
        },
        stateIndicator: {
            marginTop: 32,
        },
        // Mirrors library.styles.ts's empty-state box so both tabs share a visual language.
        emptyWrap: {
            marginTop: 32,
            alignItems: 'center',
        },
        emptyBox: {
            paddingVertical: 28,
            paddingHorizontal: 32,
            borderRadius: RADIUS.lg,
            borderWidth: 1.5,
            borderStyle: 'dashed',
            borderColor: COLORS.divider,
            alignItems: 'center',
            gap: 10,
        },
        emptyIcon: {
            width: 26,
            height: 26,
            alignItems: 'center',
            justifyContent: 'center',
        },
        emptyTitle: {
            fontSize: 14,
            fontFamily: FONTS.medium,
            color: COLORS.neutral[400],
            textAlign: 'center',
        },
    });

export default createStyles;
