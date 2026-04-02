import type { PublicUser } from './user.js';

export interface Message {
  id: string;
  channelId: string;
  author: PublicUser;
  content: string;
  type: MessageType;
  attachments: MessageAttachment[];
  embeds: MessageEmbed[];
  reactions: Reaction[];
  replyToId: string | null;
  replyTo: Message | null;
  poll: Poll | null;
  pinned: boolean;
  edited: boolean;
  editedAt: string | null;
  createdAt: string;
}

export type MessageType = 'default' | 'reply' | 'system' | 'member_join' | 'member_leave' | 'pin';

export interface MessageAttachment {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  url: string;
  proxyUrl: string;
  width: number | null;
  height: number | null;
  spoiler: boolean;
}

export interface MessageEmbed {
  type: 'link' | 'image' | 'video' | 'rich';
  title: string | null;
  description: string | null;
  url: string | null;
  color: number | null;
  thumbnailUrl: string | null;
  imageUrl: string | null;
  footer: string | null;
}

export interface Reaction {
  emoji: string;
  count: number;
  me: boolean;
}

export interface ReadState {
  channelId: string;
  lastReadMessageId: string;
  mentionCount: number;
  updatedAt: string;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  allowMultipleAnswers: boolean;
  expiresAt: string | null;
  finalized: boolean;
  totalVoters: number;
}

export interface PollOption {
  id: string;
  text: string;
  emoji: string | null;
  voteCount: number;
  voted: boolean;
}

export interface PollVote {
  pollId: string;
  optionId: string;
  userId: string;
  votedAt: string;
}

export interface SendMessageRequest {
  content: string;
  replyToId?: string;
  attachmentIds?: string[];
  poll?: CreatePollRequest;
}

export interface EditMessageRequest {
  content: string;
}

export interface SearchMessagesRequest {
  query: string;
  authorId?: string;
  before?: string;
  after?: string;
  limit?: number;
}

export interface CreatePollRequest {
  question: string;
  options: { text: string; emoji?: string }[];
  allowMultipleAnswers?: boolean;
  expiresAt?: string;
}
