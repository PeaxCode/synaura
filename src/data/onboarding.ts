import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ONBOARDING_ANSWERS_KEY, ONBOARDING_SEEN_KEY } from '@/src/constants/storage';
import { supabase } from '@/src/data/client';

type IconName = keyof typeof Ionicons.glyphMap;

export type GoalId = 'focus' | 'relax';
export type HourId = 'morning' | 'midday' | 'evening' | 'varies';
export type SensitivityId = 'low' | 'mid' | 'high';
export type ContextId = 'deep-work' | 'listening' | 'reading' | 'winding-down';

export type OnboardingAnswers = {
    goal: GoalId;
    hour: HourId;
    sensitivity: SensitivityId;
    pad: { x: number; y: number };
    context: ContextId;
    preset: string;
};

export const GOALS: { id: GoalId; title: string; sub: string; icon: IconName; glow: string }[] = [
    {
        id: 'focus',
        title: 'Focus',
        sub: 'steady rhythm, bright texture',
        icon: 'pulse',
        glow: 'rgba(181,171,252,0.35)',
    },
    {
        id: 'relax',
        title: 'Unwind',
        sub: 'warm drone, slow current',
        icon: 'cloud-outline',
        glow: 'rgba(126,166,255,0.28)',
    },
];

export const HOURS: { id: HourId; title: string; sub: string; icon: IconName }[] = [
    { id: 'morning', title: 'Slow mornings', sub: 'hard to get moving', icon: 'partly-sunny-outline' },
    { id: 'midday', title: 'The 2pm dip', sub: 'attention drops off', icon: 'sunny-outline' },
    { id: 'evening', title: 'Late evenings', sub: 'running on fumes', icon: 'moon-outline' },
    { id: 'varies', title: 'It varies', sub: 'no fixed pattern', icon: 'shuffle' },
];

export const SENSITIVITIES: { id: SensitivityId; title: string; sub: string; level: number }[] = [
    { id: 'low', title: 'Rarely', sub: 'I can work through most noise.', level: 1 },
    { id: 'mid', title: 'Sometimes', sub: 'Depends on the day and the task.', level: 2 },
    { id: 'high', title: 'Constantly', sub: 'Any sound or ping breaks me out.', level: 3 },
];

export const PAD_CONTEXTS: { id: ContextId; label: string; preset: string }[] = [
    { id: 'deep-work', label: 'hard work & problem solving', preset: 'Clear height' },
    { id: 'listening', label: 'lectures & listening', preset: 'Morning current' },
    { id: 'reading', label: 'reading & studying', preset: 'Slow ember' },
    { id: 'winding-down', label: 'winding down & rest', preset: 'Warm drift' },
];

export const HOUR_PHRASES: Record<HourId, string> = {
    morning: 'your mornings',
    midday: 'the afternoon dip',
    evening: 'your evenings',
    varies: 'whenever you need it',
};

export const GOAL_PHRASES: Record<GoalId, string> = {
    focus: 'a soundscape built for long, unbroken attention',
    relax: 'a soundscape that lets your shoulders drop',
};

export const SENSITIVITY_PHRASES: Record<SensitivityId, string> = {
    low: 'kept light, since noise rarely breaks you',
    mid: 'balanced — present when you need it, invisible when you don’t',
    high: 'present enough to mask a noisy room',
};

export const PROOF_COPY: Record<GoalId, { sub: string }> = {
    focus: {
        sub: 'Listeners who play Synaura report staying focused far longer.',
    },
    relax: {
        sub: 'Listeners who unwind with Synaura come back sharper.',
    },
};

export function padQuadrant(x: number, y: number) {
    'worklet';
    return (y <= 0.5 ? 0 : 2) + (x >= 0.5 ? 1 : 0);
}

export async function saveOnboardingAnswers(answers: OnboardingAnswers) {
    await AsyncStorage.multiSet([
        [ONBOARDING_ANSWERS_KEY, JSON.stringify(answers)],
        [ONBOARDING_SEEN_KEY, '1'],
    ]);
}

export async function readOnboardingAnswers(): Promise<OnboardingAnswers | null> {
    const raw = await AsyncStorage.getItem(ONBOARDING_ANSWERS_KEY);
    if (!raw)
        return null;

    try {
        return JSON.parse(raw) as OnboardingAnswers;
    } catch {
        return null;
    }
}

export async function syncOnboardingAnswersToProfile() {
    const { data } = await supabase.auth.getSession();
    const userId = data.session?.user.id;
    if (!userId)
        return;

    const answers = await readOnboardingAnswers();
    if (!answers)
        return;

    await supabase
        .from('profiles')
        .update({
            onboarding_answers: answers,
            default_mode: answers.goal,
            onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', userId);
}
