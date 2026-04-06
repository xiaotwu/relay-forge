import { create } from 'zustand';
import type { User, AuthTokens } from '@relayforge/types';
import { ApiClient } from '@relayforge/sdk';
import { getCurrentConnection } from '@/lib/serverConnections';

const AUTH_STORAGE_PREFIX = 'rf_auth';

let apiClient: ApiClient | null = null;
let apiClientBaseURL: string | null = null;

function getTokenStorageKeys(connectionId: string) {
  return {
    access: `${AUTH_STORAGE_PREFIX}:${connectionId}:access_token`,
    refresh: `${AUTH_STORAGE_PREFIX}:${connectionId}:refresh_token`,
  };
}

function readStoredTokens(connectionId: string) {
  const keys = getTokenStorageKeys(connectionId);
  return {
    accessToken: localStorage.getItem(keys.access),
    refreshToken: localStorage.getItem(keys.refresh),
  };
}

function writeStoredTokens(connectionId: string, accessToken: string, refreshToken: string) {
  const keys = getTokenStorageKeys(connectionId);
  localStorage.setItem(keys.access, accessToken);
  localStorage.setItem(keys.refresh, refreshToken);
}

function clearStoredTokens(connectionId: string) {
  const keys = getTokenStorageKeys(connectionId);
  localStorage.removeItem(keys.access);
  localStorage.removeItem(keys.refresh);
}

function normalizeUser(user: User | null): User | null {
  if (!user) return null;

  const raw = user as User & {
    isVerified?: boolean;
    isDisabled?: boolean;
    twoFactorEnabled?: boolean;
    emailVerified?: boolean;
    disabled?: boolean;
  };

  return {
    ...user,
    displayName: user.displayName ?? user.username,
    avatarUrl: user.avatarUrl ?? null,
    bannerUrl: user.bannerUrl ?? null,
    bio: user.bio ?? null,
    customStatus: user.customStatus ?? null,
    twoFactorEnabled: raw.twoFactorEnabled ?? false,
    emailVerified: raw.emailVerified ?? raw.isVerified ?? false,
    disabled: raw.disabled ?? raw.isDisabled ?? false,
  };
}

export function getApiClient(): ApiClient {
  const connection = getCurrentConnection();
  const baseURL = connection.apiBaseUrl;
  if (!apiClient || apiClientBaseURL !== baseURL) {
    apiClient = new ApiClient({
      baseURL,
      onTokenRefresh: (tokens: AuthTokens) => {
        useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken);
      },
      onAuthError: () => {
        useAuthStore.getState().logout();
      },
    });
    apiClientBaseURL = baseURL;
    const { accessToken, refreshToken } = readStoredTokens(connection.id);
    if (accessToken && refreshToken) {
      apiClient.setTokens(accessToken, refreshToken);
    }
  }
  return apiClient;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string, twoFactorCode?: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setTokens: (accessToken: string, refreshToken: string) => {
    writeStoredTokens(getCurrentConnection().id, accessToken, refreshToken);
    getApiClient().setTokens(accessToken, refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  setUser: (user: User | null) => {
    set({ user: normalizeUser(user) });
  },

  login: async (email: string, password: string, twoFactorCode?: string) => {
    const client = getApiClient();
    const res = await client.login({ email, password, twoFactorCode });
    const { accessToken, refreshToken } = res.data;
    get().setTokens(accessToken, refreshToken);
    client.setTokens(accessToken, refreshToken);
    const userRes = await client.getMe();
    set({ user: normalizeUser(userRes.data), isAuthenticated: true });
  },

  register: async (username: string, email: string, password: string) => {
    const client = getApiClient();
    const res = await client.register({ username, email, password });
    const { accessToken, refreshToken } = res.data;
    get().setTokens(accessToken, refreshToken);
    client.setTokens(accessToken, refreshToken);
    const userRes = await client.getMe();
    set({ user: normalizeUser(userRes.data), isAuthenticated: true });
  },

  logout: () => {
    clearStoredTokens(getCurrentConnection().id);
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
    set({ isLoading: true });

    const connection = getCurrentConnection();
    const { accessToken, refreshToken } = readStoredTokens(connection.id);

    if (!accessToken || !refreshToken) {
      getApiClient().clearTokens();
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    const client = getApiClient();
    client.setTokens(accessToken, refreshToken);
    set({ accessToken, refreshToken });

    try {
      const userRes = await client.getMe();
      set({ user: normalizeUser(userRes.data), isAuthenticated: true, isLoading: false });
    } catch {
      get().logout();
    }
  },
}));
