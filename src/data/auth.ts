import { supabase } from '@/src/data/client';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export async function continueAsGuest() {
    const { error } = await supabase.auth.signInAnonymously();
    if (error)
        throw error;
}

// Initiates a Google OAuth flow using a secure web browser session and handles the redirect callback.
export async function signInWithGoogle(): Promise<boolean> {
    const redirectTo = Linking.createURL('callback');

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
    });
    if (error)
        throw error;

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type === 'success' && result.url)
        return await applySessionFromUrl(result.url);

    return false;
}

// Initiates a native Apple Sign-In flow (iOS only) and exchanges the identity token with Supabase.
export async function signInWithApple() {
    if (Platform.OS !== 'ios')
        return;

    const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
    });

    if (!credential.identityToken)
        throw new Error('Apple sign-in did not return an identity token.');

    const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
    });
    if (error)
        throw error;

    const { givenName, familyName } = credential.fullName ?? {};
    if (givenName)
        await syncFullNameIfMissing([givenName, familyName].filter(Boolean).join(' '));
}

export async function updateFullName(fullName: string) {
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    if (error)
        throw error;
}

export async function linkGoogleAccount(): Promise<boolean> {
    const redirectTo = Linking.createURL('callback');

    const { data, error } = await supabase.auth.linkIdentity({
        provider: 'google',
        options: { redirectTo, skipBrowserRedirect: true },
    });
    if (error)
        throw error;

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type === 'success' && result.url)
        return await applySessionFromUrl(result.url);

    return false;
}

export async function deleteAccount() {
    const { error } = await supabase.functions.invoke('delete-account');
    if (error)
        throw error;

    await supabase.auth.signOut();
}

function parseCallbackParams(url: string): URLSearchParams {
    const fragment = url.split('#')[1] ?? url.split('?')[1] ?? '';
    return new URLSearchParams(fragment);
}

// Parses access and refresh tokens from an OAuth callback URL to establish the Supabase session locally.
async function applySessionFromUrl(url: string): Promise<boolean> {
    const params = parseCallbackParams(url);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (!access_token || !refresh_token)
        return false;

    const { error } = await supabase.auth.setSession({ access_token, refresh_token });
    if (error)
        throw error;

    await syncFullNameFromGoogle();
    return true;
}

async function syncFullNameIfMissing(fullName: string) {
    const { data } = await supabase.auth.getUser();
    if (data.user?.user_metadata?.full_name)
        return;

    await supabase.auth.updateUser({ data: { full_name: fullName } });
}

async function syncFullNameFromGoogle() {
    try {
        const { data } = await supabase.auth.getUser();
        const google = data.user?.identities?.find((i) => i.provider === 'google');
        const identityData = google?.identity_data as Record<string, string> | undefined;
        if (!identityData)
            return;

        const fullName =
            identityData.full_name ??
            identityData.name ??
            [identityData.given_name, identityData.family_name].filter(Boolean).join(' ');

        if (fullName)
            await syncFullNameIfMissing(fullName);
    } catch {

    }
}
