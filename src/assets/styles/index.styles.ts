import { StyleSheet } from 'react-native';

const createStyles = (COLORS: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            backgroundColor: COLORS.bg,
        },
        wordmark: {
            color: COLORS.text,
            fontSize: 26,
            fontWeight: '500',
            letterSpacing: 6,
        },
        tagline: {
            color: COLORS.neutral[500],
            fontSize: 13,
        },
    });

export default createStyles;