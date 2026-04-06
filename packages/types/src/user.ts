export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
  status: UserStatus;
  customStatus: string | null;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface PublicUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  bio: string | null;
  status: UserStatus;
  customStatus: string | null;
}

export interface Session {
  id: string;
  userId: string;
  userAgent: string | null;
  ipAddress: string | null;
  lastActiveAt: string;
  createdAt: string;
  expiresAt: string;
  current?: boolean;
}

export interface Device {
  type: DeviceType;
  os: string;
  browser: string | null;
  appVersion: string | null;
}

export type DeviceType = 'web' | 'desktop' | 'mobile';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetRequestResponse {
  message: string;
  resetToken?: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface TwoFactorSetup {
  secret: string;
  url: string;
  backupCodes?: string[];
}

export interface UpdateUserRequest {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  status?: UserStatus;
  customStatus?: string | null;
}
