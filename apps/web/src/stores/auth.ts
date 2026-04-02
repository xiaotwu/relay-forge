import { create } from 'zustand';
import type { User, AuthTokens } from '@relayforge/types';
import { ApiClient } from '@relayforge/sdk';
import { API_BASE_URL } from '@relayforge/config';

const LS_ACCESS_TOKEN = 'rf_access_token';
const LS_REFRESH_TOKEN = 'rf_refresh_token';

let apiClient: ApiClient | null = null;

export function getApiClient(): ApiClient {
  if (!apiClient) {
    apiClient = new ApiClient({
      baseURL: API_BASE_URL,
      onTokenRefresh: (tokens: AuthTokens) => {
        useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken);
      },
      onAuthError: () => {
        useAuthStore.getState().logout();
      },
    });
  }
  return apiClient;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem(LS_ACCESS_TOKEN, accessToken);
    localStorage.setItem(LS_REFRESH_TOKEN, refreshToken);
    getApiClient().setTokens(accessToken, refreshToken);
    set({ accessToken, refreshToken });
  },

  login: async (email: string, password: string) => {
    const client = getApiClient();
    const res = await client.login({ email, password });
    const { accessToken, refreshToken } = res.data;
    get().setTokens(accessToken, refreshToken);
    client.setTokens(accessToken, refreshToken);
    const userRes = await client.getMe();
    set({ user: userRes.data, isAuthenticated: true });
  },

  register: async (username: string, email: string, password: string) => {
    const client = getApiClient();
    const res = await client.register({ username, email, password });
    const { accessToken, refreshToken } = res.data;
    get().setTokens(accessToken, refreshToken);
    client.setTokens(accessToken, refreshToken);
    const userRes = await client.getMe();
    set({ user: userRes.data, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(LS_ACCESS_TOKEN);
    localStorage.removeItem(LS_REFRESH_TOKEN);
    getApiClient().clearTokens();
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initialize: async () => {
    const accessToken = localStorage.getItem(LS_ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(LS_REFRESH_TOKEN);

    if (!accessToken || !refreshToken) {
      set({ isLoading: false });
      return;
    }

    const client = getApiClient();
    client.setTokens(accessToken, refreshToken);
    set({ accessToken, refreshToken });

    try {
      const userRes = await client.getMe();
      set({ user: userRes.data, isAuthenticated: true, isLoading: false });
    } catch {
      get().logout();
    }
  },
}));
