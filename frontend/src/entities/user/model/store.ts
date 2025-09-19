import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as authApi from '../api/authApi';
import type { User, RegisterData } from './types';
import { getErrorMessages } from '@/shared/lib/errorHandler';

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: Record<string, string> | null;
}

interface AuthActions {
  init: () => Promise<void>;
  login: (credentials: { username: string; password: string }) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<{ success: boolean; errors?: Record<string, string> }>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
  setError: (field: keyof AuthState['error'], message: string) => void;
  clearError: () => void;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      init: async () => {
        if (get().isInitialized) return;

        set({ isLoading: true });
        try {
          const refreshToken = get().refreshToken;
          if (refreshToken) {
            const newAccessToken = await get().refreshAccessToken();
            if (newAccessToken) {
              await get().fetchUser();
            }
          }
        } catch (error) {
          console.error("Auth initialization failed:", error);
          // logout() сбросит все токены
          get().logout();
        } finally {
          set({ isInitialized: true, isLoading: false });
        }
      },
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { access, refresh } = await authApi.loginUser(credentials);
          set({ accessToken: access, refreshToken: refresh });
          await get().fetchUser();
          return true;
        } catch (error) {
          set({ error: getErrorMessages(error), isAuthenticated: false });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.registerUser(userData);
          const loginSuccess = await get().login({ username: userData.username, password: userData.password });
          if (!loginSuccess) {
            set({ error: { general: "Регистрация прошла успешно, но автоматический вход не удался. Попробуйте войти вручную." } });
            return { success: false, errors: { general: "Регистрация прошла успешно, но автоматический вход не удался. Попробуйте войти вручную." } };
          }
          return { success: true };
        } catch (error) {
          const errors = getErrorMessages(error);
          set({ error: errors });
          return { success: false, errors };
        } finally {
          set({ isLoading: false });
        }
      },
      logout: () => {
        set({ ...initialState, isInitialized: true });
      },
      fetchUser: async () => {
        try {
          const user = await authApi.fetchCurrentUser();
          set({ user, isAuthenticated: true, error: null });
        } catch (error) {
          get().logout();
          throw error;
        }
      },
      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().logout();
          return null;
        }
        try {
          const { access } = await authApi.refreshAuthToken(refreshToken);
          set({ accessToken: access });
          return access;
        } catch (error) {
          get().logout();
          return null;
        }
      },
      setError: (field, message) => {
        set((state) => ({
          error: { ...state.error, [field]: message }
        }));
      },
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);