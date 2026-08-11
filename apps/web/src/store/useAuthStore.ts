import { create } from 'zustand';
import { IUser } from '@boundup/shared';
import { apiFetch, setAuthToken, removeAuthToken, getAuthToken } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (updated: Partial<IUser>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  checkAuth: async () => {
    const token = getAuthToken();
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }
    try {
      const res = await apiFetch('/auth/me');
      if (res.success && res.data.user) {
        set({ user: res.data.user, isAuthenticated: true, isLoading: false, error: null });
        connectSocket();
      } else {
        removeAuthToken();
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (err: any) {
      removeAuthToken();
      set({ user: null, isAuthenticated: false, isLoading: false, error: err.message });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (res.success) {
        setAuthToken(res.data.token);
        set({ user: res.data.user, isAuthenticated: true, isLoading: false, error: null });
        connectSocket();
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Login failed' });
      throw err;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.success) {
        setAuthToken(res.data.token);
        set({ user: res.data.user, isAuthenticated: true, isLoading: false, error: null });
        connectSocket();
      }
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Registration failed' });
      throw err;
    }
  },

  logout: async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch (_) {}
    removeAuthToken();
    disconnectSocket();
    set({ user: null, isAuthenticated: false, isLoading: false, error: null });
  },

  updateUser: (updated) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updated } : null,
    }));
  },
}));
