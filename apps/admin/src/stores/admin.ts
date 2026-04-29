import { create } from 'zustand';
import { ApiClient } from '@relayforge/sdk';
import { API_BASE_URL } from '@relayforge/config';

const LS_ADMIN_TOKEN = 'rf_admin_token';

let adminClient: ApiClient | null = null;

function getAdminClient(): ApiClient {
  if (!adminClient) {
    adminClient = new ApiClient({
      baseURL: API_BASE_URL,
      onTokenRefresh: () => {},
      onAuthError: () => {
        useAdminStore.getState().logout();
      },
    });
  }
  return adminClient;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'disabled' | 'banned';
  createdAt: string;
}

export interface AdminGuild {
  id: string;
  name: string;
  ownerUsername: string;
  memberCount: number;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
  details?: string;
}

export interface Report {
  id: string;
  reporter: string;
  target: string;
  reason: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: string;
}

interface Envelope<T> {
  data: T;
  meta?: {
    total?: number;
    limit?: number;
    offset?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  };
}

interface AdminState {
  isAuthenticated: boolean;
  isLoading: boolean;
  adminEmail: string | null;

  users: AdminUser[];
  usersTotal: number;
  usersPage: number;

  guilds: AdminGuild[];
  guildsTotal: number;
  guildsPage: number;

  auditLogs: AuditEntry[];
  auditTotal: number;
  auditPage: number;

  reports: Report[];
  reportsTotal: number;
  reportsPage: number;

  loginAdmin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;

  fetchUsers: (page?: number, search?: string) => Promise<void>;
  disableUser: (userId: string) => Promise<void>;
  enableUser: (userId: string) => Promise<void>;

  fetchGuilds: (page?: number, search?: string) => Promise<void>;
  deleteGuild: (guildId: string) => Promise<void>;

  fetchAuditLogs: (page?: number, actionFilter?: string) => Promise<void>;

  fetchReports: (page?: number) => Promise<void>;
  resolveReport: (reportId: string) => Promise<void>;
  dismissReport: (reportId: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  adminEmail: null,

  users: [],
  usersTotal: 0,
  usersPage: 1,

  guilds: [],
  guildsTotal: 0,
  guildsPage: 1,

  auditLogs: [],
  auditTotal: 0,
  auditPage: 1,

  reports: [],
  reportsTotal: 0,
  reportsPage: 1,

  initialize: () => {
    const token = localStorage.getItem(LS_ADMIN_TOKEN);
    if (token) {
      const client = getAdminClient();
      client.setTokens(token, '');
      set({ isAuthenticated: true, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  loginAdmin: async (email: string, password: string) => {
    const client = getAdminClient();
    const res = await client.login({ email, password });
    const { accessToken } = res.data;
    localStorage.setItem(LS_ADMIN_TOKEN, accessToken);
    client.setTokens(accessToken, '');
    set({ isAuthenticated: true, adminEmail: email });
  },

  logout: () => {
    localStorage.removeItem(LS_ADMIN_TOKEN);
    getAdminClient().clearTokens();
    set({
      isAuthenticated: false,
      adminEmail: null,
      isLoading: false,
    });
  },

  fetchUsers: async (page = 1, _search?: string) => {
    try {
      const client = getAdminClient();
      const offset = (page - 1) * 20;
      const res = await client.get<AdminUser[]>(
        `/admin/users?limit=20&offset=${offset}${_search ? `&search=${encodeURIComponent(_search)}` : ''}`,
      );
      const envelope = res as Envelope<AdminUser[]>;
      set({
        users: envelope.data ?? [],
        usersTotal: envelope.meta?.total ?? envelope.data?.length ?? 0,
        usersPage: page,
      });
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  },

  disableUser: async (userId: string) => {
    try {
      const client = getAdminClient();
      await client.post(`/admin/users/${userId}/disable`, {});
      const { usersPage } = get();
      await get().fetchUsers(usersPage);
    } catch (err) {
      console.error('Failed to disable user:', err);
      throw err;
    }
  },

  enableUser: async (userId: string) => {
    try {
      const client = getAdminClient();
      await client.post(`/admin/users/${userId}/enable`, {});
      const { usersPage } = get();
      await get().fetchUsers(usersPage);
    } catch (err) {
      console.error('Failed to enable user:', err);
      throw err;
    }
  },

  fetchGuilds: async (page = 1, _search?: string) => {
    try {
      const client = getAdminClient();
      const offset = (page - 1) * 20;
      const res = await client.get<AdminGuild[]>(
        `/admin/guilds?limit=20&offset=${offset}${_search ? `&search=${encodeURIComponent(_search)}` : ''}`,
      );
      const envelope = res as Envelope<AdminGuild[]>;
      set({
        guilds: envelope.data ?? [],
        guildsTotal: envelope.meta?.total ?? envelope.data?.length ?? 0,
        guildsPage: page,
      });
    } catch (err) {
      console.error('Failed to fetch guilds:', err);
    }
  },

  deleteGuild: async (guildId: string) => {
    try {
      const client = getAdminClient();
      await client.delete(`/admin/guilds/${guildId}`);
      const { guildsPage } = get();
      await get().fetchGuilds(guildsPage);
    } catch (err) {
      console.error('Failed to delete guild:', err);
      throw err;
    }
  },

  fetchAuditLogs: async (page = 1, actionFilter?: string) => {
    try {
      const client = getAdminClient();
      const offset = (page - 1) * 25;
      const res = await client.get<AuditEntry[]>(
        `/admin/audit?limit=25&offset=${offset}${actionFilter ? `&action=${encodeURIComponent(actionFilter)}` : ''}`,
      );
      const envelope = res as Envelope<AuditEntry[]>;
      set({
        auditLogs: envelope.data ?? [],
        auditTotal: envelope.meta?.total ?? envelope.data?.length ?? 0,
        auditPage: page,
      });
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    }
  },

  fetchReports: async (page = 1) => {
    try {
      const client = getAdminClient();
      const offset = (page - 1) * 20;
      const res = await client.get<Report[]>(`/admin/reports?limit=20&offset=${offset}`);
      const envelope = res as Envelope<Report[]>;
      set({
        reports: envelope.data ?? [],
        reportsTotal: envelope.meta?.total ?? envelope.data?.length ?? 0,
        reportsPage: page,
      });
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    }
  },

  resolveReport: async (reportId: string) => {
    try {
      const client = getAdminClient();
      await client.post(`/admin/reports/${reportId}/resolve`, {});
      const { reportsPage } = get();
      await get().fetchReports(reportsPage);
    } catch (err) {
      console.error('Failed to resolve report:', err);
      throw err;
    }
  },

  dismissReport: async (reportId: string) => {
    try {
      const client = getAdminClient();
      await client.post(`/admin/reports/${reportId}/dismiss`, {});
      const { reportsPage } = get();
      await get().fetchReports(reportsPage);
    } catch (err) {
      console.error('Failed to dismiss report:', err);
      throw err;
    }
  },
}));
