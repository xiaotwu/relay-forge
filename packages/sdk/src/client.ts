import type {
  User,
  PublicUser,
  AuthTokens,
  RegisterRequest,
  LoginRequest,
  PasswordResetRequest,
  PasswordResetRequestResponse,
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
  DMChannel,
  DMMessage,
  CreateDMChannelRequest,
  UpdateDMChannelRequest,
  SendDMRequest,
  ApiResponse,
  PaginatedResponse,
  CursorPaginatedResponse,
  ErrorResponse,
  PresignedUploadResponse,
  UploadCompleteResponse,
  VoiceTokenResponse,
  VoiceRoom,
} from '@relayforge/types';
import { API_PATHS, buildPath } from './paths.js';

export interface ApiClientOptions {
  baseURL?: string;
  mediaBaseURL?: string;
  onTokenRefresh?: (tokens: AuthTokens) => void;
  onAuthError?: () => void;
}

function toCamelCase(key: string): string {
  return key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
}

function toSnakeCase(key: string): string {
  return key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

function normalizeKeys<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeKeys(item)) as T;
  }

  if (value && typeof value === 'object' && value.constructor === Object) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        toCamelCase(key),
        normalizeKeys(nestedValue),
      ]),
    ) as T;
  }

  return value;
}

function normalizeRequestKeys<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeRequestKeys(item)) as T;
  }

  if (value && typeof value === 'object' && value.constructor === Object) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        toSnakeCase(key),
        normalizeRequestKeys(nestedValue),
      ]),
    ) as T;
  }

  return value;
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
  private mediaBaseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<AuthTokens> | null = null;
  private onTokenRefresh?: (tokens: AuthTokens) => void;
  private onAuthError?: () => void;

  constructor(options: ApiClientOptions = {}) {
    this.baseURL = options.baseURL ?? 'http://localhost:8080/api/v1';
    this.mediaBaseURL = options.mediaBaseURL ?? 'http://localhost:8082/api/v1';
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
    options?: { noAuth?: boolean; rawResponse?: boolean; baseURL?: string },
  ): Promise<T> {
    const url = new URL(`${options?.baseURL ?? this.baseURL}${path}`);
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
      body: body ? JSON.stringify(normalizeRequestKeys(body)) : undefined,
    });

    if (res.status === 401 && !options?.noAuth && this.refreshToken) {
      const tokens = await this.performTokenRefresh();
      this.setTokens(tokens.accessToken, tokens.refreshToken);
      this.onTokenRefresh?.(tokens);
      headers['Authorization'] = `Bearer ${tokens.accessToken}`;
      const retryRes = await fetch(url.toString(), {
        method,
        headers,
        body: body ? JSON.stringify(normalizeRequestKeys(body)) : undefined,
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
    return normalizeKeys(json) as T;
  }

  private async performTokenRefresh(): Promise<AuthTokens> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.request<ApiResponse<AuthTokens>>(
      'POST',
      buildPath(API_PATHS.authRefresh),
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
    return this.request('POST', buildPath(API_PATHS.authRegister), data, undefined, { noAuth: true });
  }

  async login(data: LoginRequest): Promise<ApiResponse<AuthTokens>> {
    return this.request('POST', buildPath(API_PATHS.authLogin), data, undefined, { noAuth: true });
  }

  async refreshTokens(): Promise<ApiResponse<AuthTokens>> {
    const tokens = await this.performTokenRefresh();
    return { data: tokens };
  }

  async logout(): Promise<void> {
    await this.request('POST', buildPath(API_PATHS.authLogout), {
      refreshToken: this.refreshToken ?? undefined,
    });
    this.clearTokens();
  }

  async requestPasswordReset(
    data: PasswordResetRequest,
  ): Promise<ApiResponse<PasswordResetRequestResponse>> {
    return this.request('POST', buildPath(API_PATHS.authPasswordResetRequest), data, undefined, {
      noAuth: true,
    });
  }

  async confirmPasswordReset(
    data: PasswordResetConfirm,
  ): Promise<ApiResponse<{ message: string }>> {
    return this.request('POST', buildPath(API_PATHS.authPasswordResetConfirm), data, undefined, {
      noAuth: true,
    });
  }

  // --- Users ---

  async getMe(): Promise<ApiResponse<User>> {
    return this.request('GET', buildPath(API_PATHS.userMe));
  }

  async updateMe(data: UpdateUserRequest): Promise<ApiResponse<User>> {
    return this.request('PATCH', buildPath(API_PATHS.userMe), data);
  }

  async getUser(userId: string): Promise<ApiResponse<PublicUser>> {
    return this.request('GET', buildPath(API_PATHS.user, { userID: userId }));
  }

  async searchUsers(query: string): Promise<ApiResponse<PublicUser[]>> {
    return this.request('GET', buildPath(API_PATHS.users), undefined, { q: query });
  }

  async listSessions(): Promise<ApiResponse<Session[]>> {
    return this.request('GET', buildPath(API_PATHS.userSessions));
  }

  async revokeSession(sessionId: string): Promise<void> {
    return this.request('DELETE', buildPath(API_PATHS.userSession, { sessionID: sessionId }));
  }

  async enable2FA(): Promise<ApiResponse<TwoFactorSetup>> {
    return this.request('POST', buildPath(API_PATHS.user2FAEnable));
  }

  async verify2FA(code: string): Promise<ApiResponse<{ backupCodes: string[] }>> {
    return this.request('POST', buildPath(API_PATHS.user2FAVerify), { code });
  }

  async disable2FA(code: string): Promise<void> {
    return this.request('POST', buildPath(API_PATHS.user2FADisable), { code });
  }

  // --- Guilds ---

  async createGuild(data: CreateGuildRequest): Promise<ApiResponse<Guild>> {
    return this.request('POST', buildPath(API_PATHS.guilds), data);
  }

  async listGuilds(): Promise<ApiResponse<Guild[]>> {
    return this.request('GET', buildPath(API_PATHS.guilds));
  }

  async getGuild(guildId: string): Promise<ApiResponse<Guild>> {
    return this.request('GET', buildPath(API_PATHS.guild, { guildID: guildId }));
  }

  async updateGuild(guildId: string, data: UpdateGuildRequest): Promise<ApiResponse<Guild>> {
    return this.request('PATCH', buildPath(API_PATHS.guild, { guildID: guildId }), data);
  }

  async deleteGuild(guildId: string): Promise<void> {
    return this.request('DELETE', buildPath(API_PATHS.guild, { guildID: guildId }));
  }

  async listMembers(
    guildId: string,
    params?: { page?: number; pageSize?: number },
  ): Promise<PaginatedResponse<GuildMember>> {
    const pageSize = params?.pageSize ?? 50;
    const page = params?.page ?? 1;
    return this.request('GET', buildPath(API_PATHS.guildMembers, { guildID: guildId }), undefined, {
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
  }

  async joinGuild(guildId: string, inviteCode: string): Promise<ApiResponse<{ message: string }>> {
    return this.request('POST', buildPath(API_PATHS.guildMembers, { guildID: guildId }), {
      inviteCode,
    });
  }

  async kickMember(guildId: string, userId: string): Promise<void> {
    return this.request('DELETE', buildPath(API_PATHS.guildMember, { guildID: guildId, userID: userId }));
  }

  async createInvite(guildId: string, data: CreateInviteRequest): Promise<ApiResponse<Invite>> {
    return this.request('POST', buildPath(API_PATHS.guildInvites, { guildID: guildId }), data);
  }

  async listInvites(guildId: string): Promise<ApiResponse<Invite[]>> {
    return this.request('GET', buildPath(API_PATHS.guildInvites, { guildID: guildId }));
  }

  // --- Channels ---

  async createChannel(guildId: string, data: CreateChannelRequest): Promise<ApiResponse<Channel>> {
    return this.request('POST', buildPath(API_PATHS.guildChannels, { guildID: guildId }), data);
  }

  async listChannels(guildId: string): Promise<ApiResponse<Channel[]>> {
    return this.request('GET', buildPath(API_PATHS.guildChannels, { guildID: guildId }));
  }

  async getChannel(guildId: string, channelId: string): Promise<ApiResponse<Channel>> {
    return this.request(
      'GET',
      buildPath(API_PATHS.guildChannel, { guildID: guildId, channelID: channelId }),
    );
  }

  async updateChannel(
    guildId: string,
    channelId: string,
    data: UpdateChannelRequest,
  ): Promise<ApiResponse<Channel>> {
    return this.request(
      'PATCH',
      buildPath(API_PATHS.guildChannel, { guildID: guildId, channelID: channelId }),
      data,
    );
  }

  async deleteChannel(guildId: string, channelId: string): Promise<void> {
    return this.request(
      'DELETE',
      buildPath(API_PATHS.guildChannel, { guildID: guildId, channelID: channelId }),
    );
  }

  // --- Messages ---

  async listMessages(
    channelId: string,
    params?: { before?: string; after?: string; limit?: number },
  ): Promise<CursorPaginatedResponse<Message>> {
    return this.request('GET', buildPath(API_PATHS.channelMessages, { channelID: channelId }), undefined, {
      before: params?.before,
      after: params?.after,
      limit: params?.limit,
    });
  }

  async sendMessage(channelId: string, data: SendMessageRequest): Promise<ApiResponse<Message>> {
    return this.request('POST', buildPath(API_PATHS.channelMessages, { channelID: channelId }), data);
  }

  async editMessage(
    channelId: string,
    messageId: string,
    data: EditMessageRequest,
  ): Promise<ApiResponse<Message>> {
    return this.request(
      'PATCH',
      buildPath(API_PATHS.channelMessage, { channelID: channelId, messageID: messageId }),
      data,
    );
  }

  async deleteMessage(channelId: string, messageId: string): Promise<void> {
    return this.request(
      'DELETE',
      buildPath(API_PATHS.channelMessage, { channelID: channelId, messageID: messageId }),
    );
  }

  async searchMessages(
    channelId: string,
    params: SearchMessagesRequest,
  ): Promise<PaginatedResponse<Message>> {
    return this.request('GET', buildPath(API_PATHS.channelMessageSearch, { channelID: channelId }), undefined, {
      q: params.query,
      authorId: params.authorId,
      before: params.before,
      after: params.after,
      limit: params.limit,
    });
  }

  async listPins(channelId: string): Promise<ApiResponse<Message[]>> {
    return this.request('GET', buildPath(API_PATHS.channelMessagePins, { channelID: channelId }));
  }

  async pinMessage(channelId: string, messageId: string): Promise<void> {
    return this.request(
      'POST',
      buildPath(API_PATHS.channelMessagePin, { channelID: channelId, messageID: messageId }),
    );
  }

  async unpinMessage(channelId: string, messageId: string): Promise<void> {
    return this.request(
      'DELETE',
      buildPath(API_PATHS.channelMessagePin, { channelID: channelId, messageID: messageId }),
    );
  }

  async addReaction(channelId: string, messageId: string, emoji: string): Promise<void> {
    return this.request(
      'POST',
      buildPath(API_PATHS.channelMessageReactions, { channelID: channelId, messageID: messageId }),
      { emoji },
    );
  }

  async removeReaction(channelId: string, messageId: string, emoji: string): Promise<void> {
    return this.request(
      'DELETE',
      buildPath(API_PATHS.channelMessageReaction, {
        channelID: channelId,
        messageID: messageId,
        emoji,
      }),
    );
  }

  // --- Roles ---

  async createRole(guildId: string, data: CreateRoleRequest): Promise<ApiResponse<Role>> {
    return this.request('POST', buildPath(API_PATHS.guildRoles, { guildID: guildId }), data);
  }

  async listRoles(guildId: string): Promise<ApiResponse<Role[]>> {
    return this.request('GET', buildPath(API_PATHS.guildRoles, { guildID: guildId }));
  }

  async updateRole(
    guildId: string,
    roleId: string,
    data: UpdateRoleRequest,
  ): Promise<ApiResponse<Role>> {
    return this.request(
      'PATCH',
      buildPath(API_PATHS.guildRole, { guildID: guildId, roleID: roleId }),
      data,
    );
  }

  async deleteRole(guildId: string, roleId: string): Promise<void> {
    return this.request('DELETE', buildPath(API_PATHS.guildRole, { guildID: guildId, roleID: roleId }));
  }

  async assignRole(guildId: string, userId: string, roleId: string): Promise<void> {
    return this.request(
      'POST',
      buildPath(API_PATHS.guildRoleMember, { guildID: guildId, roleID: roleId, userID: userId }),
    );
  }

  async removeRole(guildId: string, userId: string, roleId: string): Promise<void> {
    return this.request(
      'DELETE',
      buildPath(API_PATHS.guildRoleMember, { guildID: guildId, roleID: roleId, userID: userId }),
    );
  }

  // --- Admin ---

  async listAllUsers(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<User>> {
    const pageSize = params?.pageSize ?? 50;
    const page = params?.page ?? 1;
    return this.request('GET', buildPath(API_PATHS.adminUsers), undefined, {
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
  }

  async listAllGuilds(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedResponse<Guild>> {
    const pageSize = params?.pageSize ?? 50;
    const page = params?.page ?? 1;
    return this.request('GET', buildPath(API_PATHS.adminGuilds), undefined, {
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
  }

  async disableUser(userId: string): Promise<void> {
    return this.request('POST', buildPath(API_PATHS.adminUserDisable, { userID: userId }));
  }

  async enableUser(userId: string): Promise<void> {
    return this.request('POST', buildPath(API_PATHS.adminUserEnable, { userID: userId }));
  }

  async getAdminDashboardStats<T = unknown>(): Promise<ApiResponse<T>> {
    return this.request('GET', buildPath(API_PATHS.adminDashboardStats));
  }

  async getAdminDashboardActivity<T = unknown>(): Promise<ApiResponse<T>> {
    return this.request('GET', buildPath(API_PATHS.adminDashboardActivity));
  }

  async listAuditLogs<T = unknown>(params?: {
    limit?: number;
    offset?: number;
    action?: string;
  }): Promise<ApiResponse<T> & { meta?: unknown }> {
    return this.request('GET', buildPath(API_PATHS.adminAudit), undefined, params);
  }

  async listReports<T = unknown>(params?: {
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<T> & { meta?: unknown }> {
    return this.request('GET', buildPath(API_PATHS.adminReports), undefined, params);
  }

  async resolveReport(reportId: string): Promise<void> {
    return this.request('POST', buildPath(API_PATHS.adminReportResolve, { reportID: reportId }));
  }

  async dismissReport(reportId: string): Promise<void> {
    return this.request('POST', buildPath(API_PATHS.adminReportDismiss, { reportID: reportId }));
  }

  async getAdminSettings<T = unknown>(): Promise<ApiResponse<T>> {
    return this.request('GET', buildPath(API_PATHS.adminSettings));
  }

  async updateAdminSettings<T = unknown>(settings: T): Promise<ApiResponse<T>> {
    return this.request('POST', buildPath(API_PATHS.adminSettings), settings);
  }

  async adminDeleteGuild(guildId: string): Promise<void> {
    return this.request('DELETE', buildPath(API_PATHS.adminGuild, { guildID: guildId }));
  }

  // --- Upload ---

  async createPresignedUpload(params: {
    filename: string;
    contentType: string;
    size: number;
  }): Promise<PresignedUploadResponse> {
    return this.request(
      'POST',
      buildPath(API_PATHS.mediaUploadPresign),
      {
        fileName: params.filename,
        contentType: params.contentType,
        fileSize: params.size,
      },
      undefined,
      { baseURL: this.mediaBaseURL },
    );
  }

  async completeUpload(params: {
    fileId: string;
    key: string;
    filename: string;
    contentType: string;
    size: number;
    ownerType: 'dm_channel' | 'channel' | 'guild' | 'user_profile';
    ownerId: string;
  }): Promise<UploadCompleteResponse> {
    return this.request(
      'POST',
      buildPath(API_PATHS.mediaUploadComplete),
      {
        fileId: params.fileId,
        key: params.key,
        fileName: params.filename,
        contentType: params.contentType,
        fileSize: params.size,
        ownerType: params.ownerType,
        ownerId: params.ownerId,
      },
      undefined,
      { baseURL: this.mediaBaseURL },
    );
  }

  // --- Voice ---

  async getVoiceToken(params: {
    roomName: string;
    identity: string;
    displayName?: string;
    canPublish?: boolean;
    canSubscribe?: boolean;
  }): Promise<VoiceTokenResponse> {
    return this.request(
      'POST',
      buildPath(API_PATHS.voiceToken),
      {
        roomName: params.roomName,
        identity: params.identity,
        displayName: params.displayName,
        canPublish: params.canPublish ?? true,
        canSubscribe: params.canSubscribe ?? true,
      },
      undefined,
      { baseURL: this.mediaBaseURL },
    );
  }

  async createRoom(params: { name: string; maxParticipants?: number }): Promise<VoiceRoom> {
    return this.request(
      'POST',
      buildPath(API_PATHS.voiceRooms),
      { name: params.name, maxParticipants: params.maxParticipants },
      undefined,
      { baseURL: this.mediaBaseURL },
    );
  }

  async deleteRoom(roomName: string): Promise<void> {
    return this.request(
      'DELETE',
      buildPath(API_PATHS.voiceRoom, { roomName }),
      undefined,
      undefined,
      {
        baseURL: this.mediaBaseURL,
      },
    );
  }

  async listRooms(): Promise<{ rooms: VoiceRoom[] }> {
    return this.request('GET', buildPath(API_PATHS.voiceRooms), undefined, undefined, {
      baseURL: this.mediaBaseURL,
    });
  }

  // --- Direct Messages ---

  async listDMChannels(): Promise<ApiResponse<DMChannel[]>> {
    return this.request('GET', buildPath(API_PATHS.dms));
  }

  async createDMChannel(data: CreateDMChannelRequest): Promise<ApiResponse<DMChannel>> {
    return this.request('POST', buildPath(API_PATHS.dms), data);
  }

  async updateDMChannel(
    dmChannelId: string,
    data: UpdateDMChannelRequest,
  ): Promise<ApiResponse<DMChannel>> {
    return this.request('PATCH', buildPath(API_PATHS.dm, { dmChannelID: dmChannelId }), data);
  }

  async listDMMessages(dmChannelId: string): Promise<ApiResponse<DMMessage[]>> {
    return this.request('GET', buildPath(API_PATHS.dmMessages, { dmChannelID: dmChannelId }));
  }

  async sendDMMessage(dmChannelId: string, data: SendDMRequest): Promise<ApiResponse<DMMessage>> {
    return this.request('POST', buildPath(API_PATHS.dmMessages, { dmChannelID: dmChannelId }), data);
  }

  async deleteDMMessage(dmChannelId: string, messageId: string): Promise<void> {
    return this.request(
      'DELETE',
      buildPath(API_PATHS.dmMessage, { dmChannelID: dmChannelId, messageID: messageId }),
    );
  }
}
