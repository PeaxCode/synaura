import { COLORS } from '@/src/constants/theme';
import { supabase } from '@/src/data/client';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

// Intercepts OAuth deep links to cleanly route the user to the main app once the session is established.
export default function AuthCallbackScreen() {
    useEffect(() => {
        let settled = false;

        function finish(signedIn: boolean) {
            if (settled)
                return;
            settled = true;
            router.replace(signedIn ? '/(tabs)' : '/(auth)');
        }

        supabase.auth.getSession().then(({ data }) => {
            if (data.session)
                finish(true);
        });

        const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN')
                finish(true);
        });

        const timeout = setTimeout(() => finish(false), 5000);

        return () => {
            subscription.subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg }}>
            <ActivityIndicator color={COLORS.accent} />
        </View>
    );
}
