import { StyleSheet } from 'react-native';
import { FONTS } from '@/src/constants/theme';

const createStyles = (COLORS: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.bg,
        },
        title: {
            color: COLORS.text,
            fontSize: 20,
            fontFamily: FONTS.semibold,
        },
    });

export default createStyles;
