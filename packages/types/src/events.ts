import type { Message, ReadState } from './message.js';
import type { PublicUser, UserStatus } from './user.js';
import type { GuildMember } from './guild.js';
import type { Channel } from './channel.js';
import type { DMMessage } from './dm.js';

/**
 * All WebSocket event type identifiers.
 */
export type EventType =
  | 'READY'
  | 'MESSAGE_CREATE'
  | 'MESSAGE_UPDATE'
  | 'MESSAGE_DELETE'
  | 'MESSAGE_REACTION_ADD'
  | 'MESSAGE_REACTION_REMOVE'
  | 'TYPING_START'
  | 'PRESENCE_UPDATE'
  | 'READ_STATE_UPDATE'
  | 'CHANNEL_CREATE'
  | 'CHANNEL_UPDATE'
  | 'CHANNEL_DELETE'
  | 'GUILD_MEMBER_ADD'
  | 'GUILD_MEMBER_REMOVE'
  | 'GUILD_MEMBER_UPDATE'
  | 'GUILD_UPDATE'
  | 'GUILD_DELETE'
  | 'DM_MESSAGE_CREATE'
  | 'DM_MESSAGE_UPDATE'
  | 'DM_MESSAGE_DELETE'
  | 'VOICE_STATE_UPDATE'
  | 'HEARTBEAT'
  | 'HEARTBEAT_ACK';

/**
 * Base WebSocket event envelope.
 */
export interface WsEvent<T extends EventType = EventType, D = unknown> {
  type: T;
  data: D;
  seq: number;
  timestamp: string;
}

// --- Event payloads ---

export interface ReadyEvent {
  user: PublicUser;
  sessionId: string;
  guildIds: string[];
  heartbeatInterval: number;
}

export interface MessageCreateEvent {
  message: Message;
  guildId: string;
}

export interface MessageUpdateEvent {
  message: Message;
  guildId: string;
}

export interface MessageDeleteEvent {
  messageId: string;
  channelId: string;
  guildId: string;
}

export interface MessageReactionAddEvent {
  messageId: string;
  channelId: string;
  guildId: string;
  userId: string;
  emoji: string;
}

export interface MessageReactionRemoveEvent {
  messageId: string;
  channelId: string;
  guildId: string;
  userId: string;
  emoji: string;
}

export interface TypingStartEvent {
  channelId: string;
  guildId: string | null;
  userId: string;
  username: string;
  timestamp: string;
}

export interface PresenceUpdateEvent {
  userId: string;
  status: UserStatus;
  customStatus: string | null;
}

export interface ReadStateUpdateEvent {
  readState: ReadState;
}

export interface ChannelCreateEvent {
  channel: Channel;
  guildId: string;
}

export interface ChannelUpdateEvent {
  channel: Channel;
  guildId: string;
}

export interface ChannelDeleteEvent {
  channelId: string;
  guildId: string;
}

export interface GuildMemberAddEvent {
  member: GuildMember;
  guildId: string;
}

export interface GuildMemberRemoveEvent {
  userId: string;
  guildId: string;
}

export interface GuildMemberUpdateEvent {
  member: GuildMember;
  guildId: string;
}

export interface GuildUpdateEvent {
  guildId: string;
  name?: string;
  iconUrl?: string | null;
  description?: string | null;
}

export interface GuildDeleteEvent {
  guildId: string;
}

export interface DMMessageCreateEvent {
  message: DMMessage;
  channelId: string;
}

export interface DMMessageUpdateEvent {
  message: DMMessage;
  channelId: string;
}

export interface DMMessageDeleteEvent {
  messageId: string;
  channelId: string;
}

export interface VoiceStateUpdateEvent {
  userId: string;
  guildId: string;
  channelId: string | null;
  selfMute: boolean;
  selfDeaf: boolean;
  serverMute: boolean;
  serverDeaf: boolean;
}

export interface HeartbeatEvent {
  seq: number;
}

export interface HeartbeatAckEvent {
  seq: number;
}

/**
 * Discriminated union of all typed WebSocket events.
 */
export type ServerEvent =
  | WsEvent<'READY', ReadyEvent>
  | WsEvent<'MESSAGE_CREATE', MessageCreateEvent>
  | WsEvent<'MESSAGE_UPDATE', MessageUpdateEvent>
  | WsEvent<'MESSAGE_DELETE', MessageDeleteEvent>
  | WsEvent<'MESSAGE_REACTION_ADD', MessageReactionAddEvent>
  | WsEvent<'MESSAGE_REACTION_REMOVE', MessageReactionRemoveEvent>
  | WsEvent<'TYPING_START', TypingStartEvent>
  | WsEvent<'PRESENCE_UPDATE', PresenceUpdateEvent>
  | WsEvent<'READ_STATE_UPDATE', ReadStateUpdateEvent>
  | WsEvent<'CHANNEL_CREATE', ChannelCreateEvent>
  | WsEvent<'CHANNEL_UPDATE', ChannelUpdateEvent>
  | WsEvent<'CHANNEL_DELETE', ChannelDeleteEvent>
  | WsEvent<'GUILD_MEMBER_ADD', GuildMemberAddEvent>
  | WsEvent<'GUILD_MEMBER_REMOVE', GuildMemberRemoveEvent>
  | WsEvent<'GUILD_MEMBER_UPDATE', GuildMemberUpdateEvent>
  | WsEvent<'GUILD_UPDATE', GuildUpdateEvent>
  | WsEvent<'GUILD_DELETE', GuildDeleteEvent>
  | WsEvent<'DM_MESSAGE_CREATE', DMMessageCreateEvent>
  | WsEvent<'DM_MESSAGE_UPDATE', DMMessageUpdateEvent>
  | WsEvent<'DM_MESSAGE_DELETE', DMMessageDeleteEvent>
  | WsEvent<'VOICE_STATE_UPDATE', VoiceStateUpdateEvent>
  | WsEvent<'HEARTBEAT', HeartbeatEvent>
  | WsEvent<'HEARTBEAT_ACK', HeartbeatAckEvent>;

/**
 * Client-sent events.
 */
export type ClientEvent =
  | { type: 'IDENTIFY'; data: { token: string; guildIds: string[] } }
  | { type: 'HEARTBEAT'; data: { seq: number } }
  | { type: 'TYPING_START'; data: { channelId: string; guildId?: string } }
  | { type: 'PRESENCE_UPDATE'; data: { status: UserStatus; customStatus?: string | null } }
  | { type: 'READ_STATE_UPDATE'; data: { channelId: string; lastReadMessageId: string } }
  | {
      type: 'VOICE_STATE_UPDATE';
      data: { guildId: string; channelId: string | null; selfMute: boolean; selfDeaf: boolean };
    };
