import * as AppleAuthentication from 'expo-apple-authentication';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { supabase } from './client';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
}

export async function signUpWithEmail(email: string, password: string, fullName?: string) {
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: fullName ? { data: { full_name: fullName } } : undefined,
    });
    if (error) throw error;
}

// The emailed link lands on the `auth/callback` deep link with a recovery
// session — a dedicated "set new password" screen is a follow-up, not yet built.
export async function sendPasswordReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: Linking.createURL('auth/callback'),
    });
    if (error) throw error;
}

// Resolves to false when the user cancels/dismisses the sheet — callers must
// check this before navigating, since a cancel is not an error.
export async function signInWithGoogle(): Promise<boolean> {
    const redirectTo = Linking.createURL('auth/callback');

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
    });
    if (error) throw error;

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== 'success' || !result.url) return false;

    return applySessionFromUrl(result.url);
}

// Sign in with Apple is iOS-only — callers should hide/disable this on Android.
export async function signInWithApple() {
    if (Platform.OS !== 'ios')
        return;

    const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
    });

    if (!credential.identityToken) {
        throw new Error('Apple sign-in did not return an identity token.');
    }

    const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
    });
    if (error) throw error;
}

// OAuth redirect comes back as `synaura://auth/callback#access_token=...&refresh_token=...`
async function applySessionFromUrl(url: string): Promise<boolean> {
    const fragment = url.split('#')[1] ?? url.split('?')[1] ?? '';
    const params = new URLSearchParams(fragment);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    if (!access_token || !refresh_token) return false;

    const { error } = await supabase.auth.setSession({ access_token, refresh_token });
    if (error) throw error;
    return true;
}
