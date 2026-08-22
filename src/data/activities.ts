import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AxisValues, Mode } from '@/src/data/tracks';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type ActivitySlug = 'deep_focus' | 'light_focus' | 'zen_breathe' | 'unwind';

export interface Activity {
    slug: ActivitySlug;
    label: string;
    description: string;
    mode: Mode;
    icon: IoniconName;
    suggestedMinutes: number;
    suggestedTrackSlug?: string;
    axisValues: AxisValues;
}

// 4 Core Soundscape States matching deep work, light study, mindful breathing, and rest
export const ACTIVITIES: Activity[] = [
    {
        slug: 'deep_focus',
        label: 'Deep Work',
        description: 'Focus · 50 min',
        mode: 'focus',
        icon: 'flash-outline',
        suggestedMinutes: 50,
        suggestedTrackSlug: 'steady-current',
        axisValues: { x: 0.75, y: 0.25 },
    },
    {
        slug: 'light_focus',
        label: 'Light Flow',
        description: 'Focus · 25 min',
        mode: 'focus',
        icon: 'bulb-outline',
        suggestedMinutes: 25,
        suggestedTrackSlug: 'lofi-study',
        axisValues: { x: 0.45, y: 0.4 },
    },
    {
        slug: 'zen_breathe',
        label: 'Breathe',
        description: 'Relax · 10 min',
        mode: 'relax',
        icon: 'leaf-outline',
        suggestedMinutes: 10,
        suggestedTrackSlug: 'warm-rain',
        axisValues: { x: 0.2, y: 0.8 },
    },
    {
        slug: 'unwind',
        label: 'Deep Rest',
        description: 'Relax · 45 min',
        mode: 'relax',
        icon: 'moon-outline',
        suggestedMinutes: 45,
        suggestedTrackSlug: 'evening-strings',
        axisValues: { x: 0.35, y: 0.75 },
    },
];

export interface CircadianRecommendation {
    tag: string;
    title: string;
    subtitle: string;
    icon: IoniconName;
    mode: Mode;
    suggestedMinutes: number;
    activitySlug: ActivitySlug;
    suggestedTrackSlug: string;
    axisValues: AxisValues;
}

export function getCircadianRecommendation(hour: number = new Date().getHours()): CircadianRecommendation {
    if (hour >= 5 && hour < 12) {
        return {
            tag: 'MORNING CLARITY',
            title: 'Awaken & Align',
            subtitle: 'Clear morning fog and build steady creative momentum.',
            icon: 'partly-sunny-outline',
            mode: 'focus',
            suggestedMinutes: 25,
            activitySlug: 'light_focus',
            suggestedTrackSlug: 'morning-birdsong',
            axisValues: { x: 0.45, y: 0.4 },
        };
    } else if (hour >= 12 && hour < 17) {
        return {
            tag: 'AFTERNOON SPRINT',
            title: 'Beat the 2pm Dip',
            subtitle: 'High-frequency binaural flow for unbroken deep attention.',
            icon: 'flash-outline',
            mode: 'focus',
            suggestedMinutes: 25,
            activitySlug: 'deep_focus',
            suggestedTrackSlug: 'steady-current',
            axisValues: { x: 0.75, y: 0.25 },
        };
    } else if (hour >= 17 && hour < 22) {
        return {
            tag: 'EVENING RESET',
            title: 'Decompress & Release',
            subtitle: 'Harmonic resonance to ease mental tension after work.',
            icon: 'leaf-outline',
            mode: 'relax',
            suggestedMinutes: 25,
            activitySlug: 'zen_breathe',
            suggestedTrackSlug: 'evening-strings',
            axisValues: { x: 0.2, y: 0.8 },
        };
    } else {
        return {
            tag: 'NIGHT SOUNDSCAPE',
            title: 'Deep Rest & Sleep',
            subtitle: 'Subterranean drone to quiet the brain and prepare for rest.',
            icon: 'moon-outline',
            mode: 'relax',
            suggestedMinutes: 45,
            activitySlug: 'unwind',
            suggestedTrackSlug: 'slow-tape',
            axisValues: { x: 0.35, y: 0.75 },
        };
    }
}
