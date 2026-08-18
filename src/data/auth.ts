import * as AppleAuthentication from 'expo-apple-authentication';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { supabase } from '@/src/data/client';

WebBrowser.maybeCompleteAuthSession();

// The account model is guest-first: every user starts anonymous
// (`auth.users.is_anonymous = true`) and can later attach Apple/Google to
// keep their data. Requires "Allow anonymous sign-ins" enabled in the
// Supabase Dashboard (Authentication → Settings) — not just config.toml.
export async function continueAsGuest() {
    const { error } = await supabase.auth.signInAnonymously();
    if (error)
        throw error;
}

export async function signInWithGoogle(): Promise<boolean> {
    const redirectTo = Linking.createURL('auth/callback');

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

    // Apple only returns the name on the very first authorization ever granted
    // to this app — it's absent from the identity token itself, so it has to
    // be synced onto the user's metadata here or it's lost for good.
    const { givenName, familyName } = credential.fullName ?? {};
    if (givenName)
        await syncFullNameIfMissing([givenName, familyName].filter(Boolean).join(' '));
}

export async function updateFullName(fullName: string) {
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    if (error)
        throw error;
}

// Attaches Google to the signed-in (guest) user so they keep their data —
// Supabase promotes the account off `is_anonymous` once the identity links.
export async function linkGoogleAccount(): Promise<boolean> {
    const redirectTo = Linking.createURL('auth/callback');

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

// Deleting the row itself needs the service-role key, which the client must
// never hold — the actual delete happens server-side in the `delete-account`
// Edge Function, authenticated by the caller's own session.
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

// Only fills in a name that's still missing — never overwrites one the user
// (or a future "edit profile" screen) may already have set.
async function syncFullNameIfMissing(fullName: string) {
    const { data } = await supabase.auth.getUser();
    if (data.user?.user_metadata?.full_name)
        return;

    await supabase.auth.updateUser({ data: { full_name: fullName } });
}

// Supabase doesn't reliably promote Google's name onto `user_metadata` for a
// *linked* identity the way it does on first signup, so this backfills it
// from the Google identity's own `identity_data` — same idea as the Apple
// sync above. Best-effort: a failed name sync shouldn't block sign-in.
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
        // best-effort — see comment above
    }
}
