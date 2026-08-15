// Device-local flag (not per-account) — onboarding is a first-run-on-this-device
// experience, checked before any session exists, so it can't live on `profiles`.
export const ONBOARDING_SEEN_KEY = 'synaura.onboardingSeen';

// The onboarding answers are given before sign-up, so they wait here until
// there's a user row to sync them onto (see services/onboarding.ts).
export const ONBOARDING_ANSWERS_KEY = 'synaura.onboardingAnswers';
