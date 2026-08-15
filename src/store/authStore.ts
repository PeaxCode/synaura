import { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

interface AuthState {
    session: Session | null;
    user: User | null;
    setSession: (session: Session | null) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    session: null,
    user: null,
    isLoading: true,
    setSession: (session) => set({ session, user: session?.user ?? null }),
    setIsLoading: (isLoading) => set({ isLoading }),
}));
