export enum ChannelType {
  TEXT = 'text',
  VOICE = 'voice',
  ANNOUNCEMENT = 'announcement',
  FORUM = 'forum',
  STAGE = 'stage',
}

export interface Channel {
  id: string;
  guildId: string;
  name: string;
  topic: string | null;
  type: ChannelType;
  categoryId: string | null;
  position: number;
  slowMode: number;
  nsfw: boolean;
  permissionOverrides: PermissionOverride[];
  lastMessageId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  guildId: string;
  name: string;
  position: number;
  permissionOverrides: PermissionOverride[];
  collapsed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionOverride {
  id: string;
  targetType: PermissionOverrideType;
  targetId: string;
  allow: bigint | string;
  deny: bigint | string;
}

export type PermissionOverrideType = 'role' | 'member';

export interface CreateChannelRequest {
  name: string;
  type: ChannelType;
  categoryId?: string;
  topic?: string;
  slowMode?: number;
  nsfw?: boolean;
  position?: number;
}

export interface UpdateChannelRequest {
  name?: string;
  topic?: string;
  categoryId?: string | null;
  position?: number;
  slowMode?: number;
  nsfw?: boolean;
  permissionOverrides?: PermissionOverride[];
}
