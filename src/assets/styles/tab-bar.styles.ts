import { StyleSheet } from 'react-native';
import { FONTS } from '@/src/constants/theme';

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
            backgroundColor: COLORS.surface,
            borderRadius: 40,
            padding: 6,
            gap: 6,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: COLORS.divider,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.24,
            shadowRadius: 20,
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
        },
        labelFocused: {
            fontFamily: FONTS.semibold,
            fontSize: 13,
            color: COLORS.text,
            marginLeft: 6,
        },
    });

export default createStyles;
