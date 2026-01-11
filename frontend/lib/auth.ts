/**
 * Authentication utilities and state management
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, TokenResponse, User } from '@/types';
import { api } from './api';

interface AuthStore extends AuthState {
  tokens: TokenResponse | null;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const tokens = await api.login({ email, password });
          api.setAccessToken(tokens.accessToken);

          // Fetch user profile
          const user = await api.getMe();

          set({
            tokens,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (email: string, password: string, name: string) => {
        set({ isLoading: true });
        try {
          const tokens = await api.register({ email, password, name });
          api.setAccessToken(tokens.accessToken);

          // Fetch user profile
          const user = await api.getMe();

          set({
            tokens,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        api.setAccessToken(null);
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
        });
      },

      refreshAuth: async () => {
        const { tokens } = get();
        if (!tokens?.refreshToken) {
          get().logout();
          return;
        }

        try {
          const newTokens = await api.refreshToken(tokens.refreshToken);
          api.setAccessToken(newTokens.accessToken);
          set({ tokens: newTokens });
        } catch {
          get().logout();
        }
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        tokens: state.tokens,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // Restore API token on rehydration
        if (state?.tokens?.accessToken) {
          api.setAccessToken(state.tokens.accessToken);
        }
        // Mark hydration as complete
        state?.setHasHydrated(true);
      },
    }
  )
);

// Initialize auth state from storage
export function initializeAuth() {
  const state = useAuthStore.getState();
  if (state.tokens?.accessToken) {
    api.setAccessToken(state.tokens.accessToken);
  }
}
