import type { paths } from './generated/relayforge.js';

export type OpenApiPath = keyof paths;

const API_PREFIX = '/api/v1';

export const API_PATHS = {
  authRegister: '/api/v1/auth/register',
  authLogin: '/api/v1/auth/login',
  authRefresh: '/api/v1/auth/refresh',
  authLogout: '/api/v1/auth/logout',
  authPasswordResetRequest: '/api/v1/auth/password-reset/request',
  authPasswordResetConfirm: '/api/v1/auth/password-reset/confirm',
  users: '/api/v1/users',
  userMe: '/api/v1/users/me',
  userSessions: '/api/v1/users/me/sessions',
  userSession: '/api/v1/users/me/sessions/{sessionID}',
  user2FAEnable: '/api/v1/users/me/2fa/enable',
  user2FAVerify: '/api/v1/users/me/2fa/verify',
  user2FADisable: '/api/v1/users/me/2fa/disable',
  user: '/api/v1/users/{userID}',
  guilds: '/api/v1/guilds',
  guild: '/api/v1/guilds/{guildID}',
  guildMembers: '/api/v1/guilds/{guildID}/members',
  guildMember: '/api/v1/guilds/{guildID}/members/{userID}',
  guildInvites: '/api/v1/guilds/{guildID}/invites',
  guildChannels: '/api/v1/guilds/{guildID}/channels',
  guildChannel: '/api/v1/guilds/{guildID}/channels/{channelID}',
  guildRoles: '/api/v1/guilds/{guildID}/roles',
  guildRole: '/api/v1/guilds/{guildID}/roles/{roleID}',
  guildRoleMember: '/api/v1/guilds/{guildID}/roles/{roleID}/members/{userID}',
  channelMessages: '/api/v1/channels/{channelID}/messages',
  channelMessageSearch: '/api/v1/channels/{channelID}/messages/search',
  channelMessagePins: '/api/v1/channels/{channelID}/messages/pins',
  channelMessage: '/api/v1/channels/{channelID}/messages/{messageID}',
  channelMessagePin: '/api/v1/channels/{channelID}/messages/{messageID}/pin',
  channelMessageReactions: '/api/v1/channels/{channelID}/messages/{messageID}/reactions',
  channelMessageReaction: '/api/v1/channels/{channelID}/messages/{messageID}/reactions/{emoji}',
  dms: '/api/v1/dms',
  dm: '/api/v1/dms/{dmChannelID}',
  dmMessages: '/api/v1/dms/{dmChannelID}/messages',
  dmMessage: '/api/v1/dms/{dmChannelID}/messages/{messageID}',
  adminDashboardStats: '/api/v1/admin/dashboard/stats',
  adminDashboardActivity: '/api/v1/admin/dashboard/activity',
  adminUsers: '/api/v1/admin/users',
  adminUserDisable: '/api/v1/admin/users/{userID}/disable',
  adminUserEnable: '/api/v1/admin/users/{userID}/enable',
  adminGuilds: '/api/v1/admin/guilds',
  adminGuild: '/api/v1/admin/guilds/{guildID}',
  adminAudit: '/api/v1/admin/audit',
  adminReports: '/api/v1/admin/reports',
  adminReportResolve: '/api/v1/admin/reports/{reportID}/resolve',
  adminReportDismiss: '/api/v1/admin/reports/{reportID}/dismiss',
  adminSettings: '/api/v1/admin/settings',
  mediaUploadPresign: '/api/v1/media/upload/presign',
  mediaUploadComplete: '/api/v1/media/upload/complete',
  mediaFile: '/api/v1/media/files/{fileID}',
  voiceToken: '/api/v1/voice/token',
  voiceRooms: '/api/v1/voice/rooms',
  voiceRoom: '/api/v1/voice/rooms/{roomName}',
} as const satisfies Record<string, OpenApiPath>;

export function buildPath(
  template: OpenApiPath,
  params: Record<string, string | number> = {},
): string {
  const path = template.startsWith(API_PREFIX) ? template.slice(API_PREFIX.length) : template;
  return Object.entries(params).reduce(
    (current, [key, value]) => current.replaceAll(`{${key}}`, encodeURIComponent(String(value))),
    path || '/',
  );
}
