import type {
  User,
  AuthTokens,
  RegisterRequest,
  LoginRequest,
  PasswordResetRequest,
  PasswordResetConfirm,
  TwoFactorSetup,
  UpdateUserRequest,
  Session,
  Guild,
  GuildMember,
  Invite,
  CreateGuildRequest,
  UpdateGuildRequest,
  CreateInviteRequest,
  Channel,
  CreateChannelRequest,
  UpdateChannelRequest,
  Message,
  SendMessageRequest,
  EditMessageRequest,
  SearchMessagesRequest,
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  ApiResponse,
  PaginatedResponse,
  CursorPaginatedResponse,
  ErrorResponse,
  PresignedUploadResponse,
  UploadCompleteResponse,
  VoiceTokenResponse,
  VoiceRoom,
} from '@relayforge/types';

export interface ApiClientOptions {
  baseURL?: string;
  onTokenRefresh?: (tokens: AuthTokens) => void;
  onAuthError?: () => void;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, string[]>,
    public readonly requestId?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<AuthTokens> | null = null;
  private onTokenRefresh?: (tokens: AuthTokens) => void;
  private onAuthError?: () => void;

  constructor(options: ApiClientOptions = {}) {
    this.baseURL = options.baseURL ?? 'http://localhost:8080/api/v1';
    this.onTokenRefresh = options.onTokenRefresh;
    this.onAuthError = options.onAuthError;
  }

  // --- Token management ---

  setTokens(accessToken: string, refreshToken: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
  }

  // --- Generic helpers for app-specific endpoints ---

  async get<T>(
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
  ): Promise<ApiResponse<T>> {
    return this.request('GET', path, undefined, query);
  }

  async post<T = unknown>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request('POST', path, body);
  }

  async delete<T = void>(path: string): Promise<T> {
    return this.request('DELETE', path);
  }

  // --- Private fetch wrapper ---

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    query?: Record<string, string | number | boolean | undefined>,
    options?: { noAuth?: boolean; rawResponse?: boolean },
  ): Promise<T> {
    const url = new URL(`${this.baseURL}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (!options?.noAuth && this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const res = await fetch(url.toString(), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 401 && !options?.noAuth && this.refreshToken) {
      const tokens = await this.performTokenRefresh();
      this.setTokens(tokens.accessToken, tokens.refreshToken);
      this.onTokenRefresh?.(tokens);
      headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      const retryRes = await fetch(url.toString(), {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
      return this.handleResponse<T>(retryRes);
    }

    return this.handleResponse<T>(res);
  }

  private async handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
      let errorBody: ErrorResponse | null = null;
      try {
        errorBody = await res.json();
      } catch {
        // Response body might not be JSON
      }
      if (res.status === 401) {
        this.onAuthError?.();
      }
      throw new ApiError(
        res.status,
        errorBody?.error?.code ?? 'UNKNOWN_ERROR',
        errorBody?.error?.message ?? `HTTP ${res.status}`,
        errorBody?.error?.details,
        errorBody?.error?.requestId,
      );
    }

    if (res.status === 204) {
      return undefined as T;
    }

    const json = await res.json();
    return json as T;
  }

  private async performTokenRefresh(): Promise<AuthTokens> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.request<ApiResponse<AuthTokens>>(
      'POST',
      '/auth/refresh',
      { refreshToken: this.refreshToken },
      undefined,
      { noAuth: true },
    )
      .then((res) => {
        this.refreshPromise = null;
        return res.data;
      })
      .catch((err) => {
        this.refreshPromise = null;
        this.onAuthError?.();
        throw err;
      });

    return this.refreshPromise;
  }

  // --- Auth ---

  async register(data: RegisterRequest): Promise<ApiResponse<AuthTokens>> {
    return this.request('POST', '/auth/register', data, undefined, { noAuth: true });
  }

  async login(data: LoginRequest): Promise<ApiResponse<AuthTokens>> {
    return this.request('POST', '/auth/login', data, undefined, { noAuth: true });
  }

  async refreshTokens(): Promise<ApiResponse<AuthTokens>> {
    const tokens = await this.performTokenRefresh();
    return { data: tokens };
  }

  async logout(): Promise<void> {
    await this.request('POST', '/auth/logout');
    this.clearTokens();
  }

  async requestPasswordReset(
    data: PasswordResetRequest,
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request('POST', '/auth/password-reset', data, undefined, { noAuth: true });
  }

  async confirmPasswordReset(
    data: PasswordResetConfirm,
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request('POST', '/auth/password-reset/confirm', data, undefined, { noAuth: true });
  }

  // --- Users ---

  async getMe(): Promise<ApiResponse<User>> {
    return this.request('GET', '/users/me');
  }

  async updateMe(data: UpdateUserRequest): Promise<ApiResponse<User>> {
    return this.request('PATCH', '/users/me', data);
  }

  async listSessions(): Promise<ApiResponse<Session[]>> {
    return this.request('GET', '/users/me/sessions');
  }

  async revokeSession(sessionId: string): Promise<void> {
    return this.request('DELETE', `/users/me/sessions/${sessionId}`);
  }

  async enable2FA(): Promise<ApiResponse<TwoFactorSetup>> {
    return this.request('POST', '/users/me/2fa/enable');
  }

  async verify2FA(code: string): Promise<ApiResponse<{ backupCodes: string[] }>> {
    return this.request('POST', '/users/me/2fa/verify', { code });
  }

  async disable2FA(code: string): Promise<void> {
    return this.request('POST', '/users/me/2fa/disable', { code });
  }

  // --- Guilds ---

  async createGuild(data: CreateGuildRequest): Promise<ApiResponse<Guild>> {
    return this.request('POST', '/guilds', data);
  }

  async listGuilds(): Promise<ApiResponse<Guild[]>> {
    return this.request('GET', '/guilds');
  }

  async getGuild(guildId: string): Promise<ApiResponse<Guild>> {
    return this.request('GET', `/guilds/${guildId}`);
  }

  async updateGuild(guildId: string, data: UpdateGuildRequest): Promise<ApiResponse<Guild>> {
    return this.request('PATCH', `/guilds/${guildId}`, data);
  }

  async deleteGuild(guildId: string): Promise<void> {
    return this.request('DELETE', `/guilds/${guildId}`);
  }

  async listMembers(
    guildId: string,
    params?: { page?: number; pageSize?: number },
  ): Promise<PaginatedResponse<GuildMember>> {
    return this.request('GET', `/guilds/${guildId}/members`, undefined, {
      page: params?.page,
      pageSize: params?.pageSize,
    });
  }

  async joinGuild(inviteCode: string): Promise<ApiResponse<Guild>> {
    return this.request('POST', `/invites/${inviteCode}/join`);
  }

  async kickMember(guildId: string, userId: string): Promise<void> {
    return this.request('DELETE', `/guilds/${guildId}/members/${userId}`);
  }

  async createInvite(guildId: string, data: CreateInviteRequest): Promise<ApiResponse<Invite>> {
    return this.request('POST', `/guilds/${guildId}/invites`, data);
  }

  async listInvites(guildId: string): Promise<ApiResponse<Invite[]>> {
    return this.request('GET', `/guilds/${guildId}/invites`);
  }

  // --- Channels ---

  async createChannel(guildId: string, data: CreateChannelRequest): Promise<ApiResponse<Channel>> {
    return this.request('POST', `/guilds/${guildId}/channels`, data);
  }

  async listChannels(guildId: string): Promise<ApiResponse<Channel[]>> {
    return this.request('GET', `/guilds/${guildId}/channels`);
  }

  async getChannel(channelId: string): Promise<ApiResponse<Channel>> {
    return this.request('GET', `/channels/${channelId}`);
  }

  async updateChannel(
    channelId: string,
    data: UpdateChannelRequest,
  ): Promise<ApiResponse<Channel>> {
    return this.request('PATCH', `/channels/${channelId}`, data);
  }

  async deleteChannel(channelId: string): Promise<void> {
    return this.request('DELETE', `/channels/${channelId}`);
  }

  // --- Messages ---

  async listMessages(
    channelId: string,
    params?: { before?: string; after?: string; limit?: number },
  ): Promise<CursorPaginatedResponse<Message>> {
    return this.request('GET', `/channels/${channelId}/messages`, undefined, {
      before: params?.before,
      after: params?.after,
      limit: params?.limit,
    });
  }

  async sendMessage(channelId: string, data: SendMessageRequest): Promise<ApiResponse<Message>> {
    return this.request('POST', `/channels/${channelId}/messages`, data);
  }

  async editMessage(
    channelId: string,
    messageId: string,
    data: EditMessageRequest,
  ): Promise<ApiResponse<Message>> {
    return this.request('PATCH', `/channels/${channelId}/messages/${messageId}`, data);
  }

  async deleteMessage(channelId: string, messageId: string): Promise<void> {
    return this.request('DELETE', `/channels/${channelId}/messages/${messageId}`);
  }

  async searchMessages(
    channelId: string,
    params: SearchMessagesRequest,
  ): Promise<PaginatedResponse<Message>> {
    return this.request('GET', `/channels/${channelId}/messages/search`, undefined, {
      query: params.query,
      authorId: params.authorId,
      before: params.before,
      after: params.after,
      limit: params.limit,
    });
  }

  async listPins(channelId: string): Promise<ApiResponse<Message[]>> {
    return this.request('GET', `/channels/${channelId}/pins`);
  }

  async pinMessage(channelId: string, messageId: string): Promise<void> {
    return this.request('PUT', `/channels/${channelId}/pins/${messageId}`);
  }

  async unpinMessage(channelId: string, messageId: string): Promise<void> {
    return this.request('DELETE', `/channels/${channelId}/pins/${messageId}`);
  }

  async addReaction(channelId: string, messageId: string, emoji: string): Promise<void> {
    return this.request(
      'PUT',
      `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`,
    );
  }

  async removeReaction(channelId: string, messageId: string, emoji: string): Promise<void> {
    return this.request(
      'DELETE',
      `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`,
    );
  }

  // --- Roles ---

  async createRole(guildId: string, data: CreateRoleRequest): Promise<ApiResponse<Role>> {
    return this.request('POST', `/guilds/${guildId}/roles`, data);
  }

  async listRoles(guildId: string): Promise<ApiResponse<Role[]>> {
    return this.request('GET', `/guilds/${guildId}/roles`);
  }

  async updateRole(
    guildId: string,
    roleId: string,
    data: UpdateRoleRequest,
  ): Promise<ApiResponse<Role>> {
    return this.request('PATCH', `/guilds/${guildId}/roles/${roleId}`, data);
  }

  async deleteRole(guildId: string, roleId: string): Promise<void> {
    return this.request('DELETE', `/guilds/${guildId}/roles/${roleId}`);
  }

  async assignRole(guildId: string, userId: string, roleId: string): Promise<void> {
    return this.request('PUT', `/guilds/${guildId}/members/${userId}/roles/${roleId}`);
  }

  async removeRole(guildId: string, userId: string, roleId: string): Promise<void> {
    return this.request('DELETE', `/guilds/${guildId}/members/${userId}/roles/${roleId}`);
  }

  // --- Admin ---

  async listAllUsers(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<User>> {
    return this.request('GET', '/admin/users', undefined, {
      page: params?.page,
      pageSize: params?.pageSize,
    });
  }

  async listAllGuilds(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Guild>> {
    return this.request('GET', '/admin/guilds', undefined, {
      page: params?.page,
      pageSize: params?.pageSize,
    });
  }

  async disableUser(userId: string): Promise<void> {
    return this.request('POST', `/admin/users/${userId}/disable`);
  }

  async adminDeleteGuild(guildId: string): Promise<void> {
    return this.request('DELETE', `/admin/guilds/${guildId}`);
  }

  // --- Upload ---

  async createPresignedUpload(params: {
    filename: string;
    contentType: string;
    size: number;
  }): Promise<ApiResponse<PresignedUploadResponse>> {
    return this.request('POST', '/uploads/presign', params);
  }

  async completeUpload(uploadId: string): Promise<ApiResponse<UploadCompleteResponse>> {
    return this.request('POST', `/uploads/${uploadId}/complete`);
  }

  // --- Voice ---

  async getVoiceToken(
    guildId: string,
    channelId: string,
  ): Promise<ApiResponse<VoiceTokenResponse>> {
    return this.request('POST', `/guilds/${guildId}/channels/${channelId}/voice/token`);
  }

  async createRoom(guildId: string, channelId: string): Promise<ApiResponse<VoiceRoom>> {
    return this.request('POST', `/guilds/${guildId}/channels/${channelId}/voice/room`);
  }

  async deleteRoom(guildId: string, channelId: string): Promise<void> {
    return this.request('DELETE', `/guilds/${guildId}/channels/${channelId}/voice/room`);
  }

  async listRooms(guildId: string): Promise<ApiResponse<VoiceRoom[]>> {
    return this.request('GET', `/guilds/${guildId}/voice/rooms`);
  }
}
