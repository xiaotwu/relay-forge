import type { PublicUser } from './user.js';
import type { ChannelType } from './channel.js';

export interface Guild {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  bannerUrl: string | null;
  ownerId: string;
  memberCount: number;
  features: GuildFeature[];
  defaultChannelId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type GuildFeature = 'VANITY_URL' | 'ANIMATED_ICON' | 'BANNER' | 'COMMUNITY' | 'VERIFIED';

export interface GuildMember {
  user: PublicUser;
  guildId: string;
  nickname: string | null;
  roleIds: string[];
  joinedAt: string;
  deaf: boolean;
  mute: boolean;
}

export interface Invite {
  code: string;
  guildId: string;
  channelId: string | null;
  inviterId: string;
  inviter: PublicUser;
  maxUses: number | null;
  uses: number;
  maxAge: number | null;
  temporary: boolean;
  createdAt: string;
  expiresAt: string | null;
}

export interface CreateGuildRequest {
  name: string;
  description?: string;
  iconUrl?: string;
  initialChannels?: Array<{
    name: string;
    type: ChannelType;
    topic?: string;
  }>;
}

export interface UpdateGuildRequest {
  name?: string;
  description?: string;
  iconUrl?: string;
  bannerUrl?: string;
  defaultChannelId?: string;
}

export interface CreateInviteRequest {
  channelId?: string;
  maxUses?: number;
  maxAge?: number;
  temporary?: boolean;
}
