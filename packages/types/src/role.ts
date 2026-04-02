export interface Role {
  id: string;
  guildId: string;
  name: string;
  color: number | null;
  hoist: boolean;
  position: number;
  permissions: string;
  mentionable: boolean;
  managed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  color?: number;
  hoist?: boolean;
  permissions?: string;
  mentionable?: boolean;
}

export interface UpdateRoleRequest {
  name?: string;
  color?: number | null;
  hoist?: boolean;
  position?: number;
  permissions?: string;
  mentionable?: boolean;
}

/**
 * Permission bitfield constants.
 * Permissions are stored as a string-encoded bigint bitfield.
 */
export const Permission = {
  /** View channels and read messages */
  VIEW_CHANNEL: 1n << 0n,
  /** Send messages in text channels */
  SEND_MESSAGES: 1n << 1n,
  /** Send embedded links and rich content */
  EMBED_LINKS: 1n << 2n,
  /** Attach files to messages */
  ATTACH_FILES: 1n << 3n,
  /** Add reactions to messages */
  ADD_REACTIONS: 1n << 4n,
  /** Use external emojis */
  USE_EXTERNAL_EMOJIS: 1n << 5n,
  /** Read message history */
  READ_MESSAGE_HISTORY: 1n << 6n,
  /** Mention @everyone, @here, and all roles */
  MENTION_EVERYONE: 1n << 7n,
  /** Delete messages by other users */
  MANAGE_MESSAGES: 1n << 8n,
  /** Create, edit, and delete channels */
  MANAGE_CHANNELS: 1n << 9n,
  /** Create, edit, and delete roles */
  MANAGE_ROLES: 1n << 10n,
  /** Edit guild settings, name, icon, etc. */
  MANAGE_GUILD: 1n << 11n,
  /** Create and manage invites */
  MANAGE_INVITES: 1n << 12n,
  /** Create and manage webhooks */
  MANAGE_WEBHOOKS: 1n << 13n,
  /** Manage custom emojis */
  MANAGE_EMOJIS: 1n << 14n,
  /** Kick members from the guild */
  KICK_MEMBERS: 1n << 15n,
  /** Ban members from the guild */
  BAN_MEMBERS: 1n << 16n,
  /** Change own nickname */
  CHANGE_NICKNAME: 1n << 17n,
  /** Change other members' nicknames */
  MANAGE_NICKNAMES: 1n << 18n,
  /** Connect to voice channels */
  CONNECT: 1n << 19n,
  /** Speak in voice channels */
  SPEAK: 1n << 20n,
  /** Use video in voice channels */
  VIDEO: 1n << 21n,
  /** Mute other members in voice */
  MUTE_MEMBERS: 1n << 22n,
  /** Deafen other members in voice */
  DEAFEN_MEMBERS: 1n << 23n,
  /** Move members between voice channels */
  MOVE_MEMBERS: 1n << 24n,
  /** Use voice activity detection */
  USE_VAD: 1n << 25n,
  /** Speak in stage channels */
  REQUEST_TO_SPEAK: 1n << 26n,
  /** Pin messages in channels */
  PIN_MESSAGES: 1n << 27n,
  /** Create polls */
  CREATE_POLLS: 1n << 28n,
  /** Full administrator access, bypasses all permission checks */
  ADMIN: 1n << 31n,
} as const;

export type PermissionKey = keyof typeof Permission;

/**
 * Check if a permission bitfield includes a specific permission.
 */
export function hasPermission(permissions: bigint | string, permission: bigint): boolean {
  const perms = typeof permissions === 'string' ? BigInt(permissions) : permissions;
  if (perms & Permission.ADMIN) return true;
  return (perms & permission) === permission;
}

/**
 * Combine multiple permissions into a single bitfield.
 */
export function combinePermissions(...perms: bigint[]): bigint {
  return perms.reduce((acc, p) => acc | p, 0n);
}

/**
 * Convert a permission bitfield to a string for serialization.
 */
export function permissionsToString(permissions: bigint): string {
  return permissions.toString();
}

/**
 * Parse a permission string back to a bigint.
 */
export function parsePermissions(permissions: string): bigint {
  return BigInt(permissions);
}
