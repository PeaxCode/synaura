export const COLORS = {
    // Ultra-deep black base — Endel/Brain.fm-level darkness.
    bg: '#08080C',
    surface: '#111118',
    surfaceElevated: '#1a1a24',
    text: '#e9e9ed',
    accent: '#8B7FD4',
    accentBright: '#A594FF',
    accent2: '#a7a1db',
    accentGlow: 'rgba(139,127,212,0.35)',
    accentTint: 'rgba(139,127,212,0.08)',
    divider: 'rgba(233,233,237,0.08)',

    neutral: {
        100: '#f3f5fe',
        200: '#e4e7f5',
        300: '#cfd3e5',
        400: '#b2b6ca',
        500: '#9397ab',
        600: '#75798c',
        700: '#595d6c',
        800: '#3f424d',
        900: '#292b31',
    },
    accentRamp: {
        100: '#f5f4ff',
        200: '#e7e5fe',
        300: '#d2cefd',
        400: '#b5abfc',
        500: '#968ae0',
        600: '#796cbf',
        700: '#5d5294',
        800: '#423a6a',
        900: '#2b2741',
    },
    accent2Ramp: {
        100: '#f5f4ff',
        200: '#e7e5fe',
        300: '#d2cefd',
        400: '#b5afe8',
        500: '#9690c9',
        600: '#7972a9',
        700: '#5c5783',
        800: '#423e5d',
        900: '#2b293a',
    },
    section: '#262a60',
    sectionGlow: '#353b80',
    sectionGhost: '#4c5397',
} as const;

export const RADIUS = {
    sm: 4,
    md: 8,
    lg: 14,
} as const;

export const SPACE = {
    1: 2.8,
    2: 5.6,
    3: 8.4,
    4: 11.2,
    6: 16.8,
    8: 22.4,
} as const;

export const FONTS = {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
} as const;