import { create } from 'zustand';
import type { Message, PublicUser } from '@relayforge/types';
import { getApiClient } from './auth';
import { useAuthStore } from './auth';

const UNKNOWN_AUTHOR: PublicUser = {
  id: 'unknown',
  username: 'unknown',
  displayName: 'Unknown user',
  avatarUrl: null,
  bannerUrl: null,
  bio: null,
  status: 'offline',
  customStatus: null,
};

function normalizeMessage(message: Message): Message {
  const currentUser = useAuthStore.getState().user;
  const raw = message as Message & {
    authorId?: string;
    channelId?: string;
    content?: string | null;
    type?: string;
    isEdited?: boolean;
    editedAt?: string | null;
    createdAt?: string;
    attachments?: Message['attachments'] | null;
    embeds?: Message['embeds'] | null;
    reactions?: Message['reactions'] | null;
    replyTo?: Message | null;
    replyToId?: string | null;
    pinned?: boolean;
    isPinned?: boolean;
    poll?: Message['poll'] | null;
    author?: Partial<PublicUser>;
  };

  const isCurrentUser = currentUser && raw.authorId === currentUser.id;
  const author: PublicUser = raw.author?.id
    ? {
        id: raw.author.id,
        username: raw.author.username ?? raw.author.displayName ?? 'user',
        displayName: raw.author.displayName ?? raw.author.username ?? 'User',
        avatarUrl: raw.author.avatarUrl ?? null,
        bannerUrl: raw.author.bannerUrl ?? null,
        bio: raw.author.bio ?? null,
        status: raw.author.status ?? 'offline',
        customStatus: raw.author.customStatus ?? null,
      }
    : isCurrentUser
      ? {
          id: currentUser.id,
          username: currentUser.username,
          displayName: currentUser.displayName ?? currentUser.username,
          avatarUrl: currentUser.avatarUrl ?? null,
          bannerUrl: currentUser.bannerUrl ?? null,
          bio: currentUser.bio ?? null,
          status: currentUser.status,
          customStatus: currentUser.customStatus ?? null,
        }
      : {
          ...UNKNOWN_AUTHOR,
          id: raw.authorId ?? UNKNOWN_AUTHOR.id,
        };

  return {
    id: raw.id,
    channelId: raw.channelId,
    author,
    content: raw.content ?? '',
    type: (raw.type as Message['type']) ?? 'default',
    attachments: Array.isArray(raw.attachments) ? raw.attachments : [],
    embeds: Array.isArray(raw.embeds) ? raw.embeds : [],
    reactions: Array.isArray(raw.reactions) ? raw.reactions : [],
    replyToId: raw.replyToId ?? null,
    replyTo: raw.replyTo ? normalizeMessage(raw.replyTo) : null,
    poll: raw.poll ?? null,
    pinned: raw.pinned ?? raw.isPinned ?? false,
    edited: raw.edited ?? raw.isEdited ?? false,
    editedAt: raw.editedAt ?? null,
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

interface MessagesState {
  messagesByChannel: Record<string, Message[]>;
  sending: boolean;
  hasMore: Record<string, boolean>;

  fetchMessages: (channelId: string, before?: string) => Promise<void>;
  sendMessage: (channelId: string, content: string, replyToId?: string) => Promise<void>;
  editMessage: (channelId: string, messageId: string, content: string) => Promise<void>;
  deleteMessage: (channelId: string, messageId: string) => Promise<void>;
  addReaction: (channelId: string, messageId: string, emoji: string) => Promise<void>;
  removeReaction: (channelId: string, messageId: string, emoji: string) => Promise<void>;
  addMessage: (msg: Message) => void;
  updateMessage: (msg: Message) => void;
  removeMessage: (channelId: string, messageId: string) => void;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  messagesByChannel: {},
  sending: false,
  hasMore: {},

  fetchMessages: async (channelId: string, before?: string) => {
    const client = getApiClient();
    const res = await client.listMessages(channelId, { before, limit: 50 });
    const incoming = (Array.isArray(res.data) ? res.data : []).map(normalizeMessage);
    const existing = before ? (get().messagesByChannel[channelId] ?? []) : [];
    const merged = before ? [...incoming, ...existing] : incoming;

    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: merged,
      },
      hasMore: {
        ...state.hasMore,
        [channelId]: res.cursor?.hasMore ?? false,
      },
    }));
  },

  sendMessage: async (channelId: string, content: string, replyToId?: string) => {
    set({ sending: true });
    try {
      const client = getApiClient();
      const res = await client.sendMessage(channelId, { content, replyToId });
      const normalized = normalizeMessage(res.data);
      set((state) => {
        const existing = state.messagesByChannel[channelId] ?? [];
        if (existing.some((message) => message.id === normalized.id)) {
          return { messagesByChannel: state.messagesByChannel };
        }

        return {
          messagesByChannel: {
            ...state.messagesByChannel,
            [channelId]: [...existing, normalized],
          },
        };
      });
    } finally {
      set({ sending: false });
    }
  },

  editMessage: async (channelId: string, messageId: string, content: string) => {
    const client = getApiClient();
    const res = await client.editMessage(channelId, messageId, { content });
    const normalized = normalizeMessage(res.data);
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: (state.messagesByChannel[channelId] ?? []).map((m) =>
          m.id === messageId ? normalized : m,
        ),
      },
    }));
  },

  deleteMessage: async (channelId: string, messageId: string) => {
    const client = getApiClient();
    await client.deleteMessage(channelId, messageId);
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: (state.messagesByChannel[channelId] ?? []).filter((m) => m.id !== messageId),
      },
    }));
  },

  addReaction: async (channelId: string, messageId: string, emoji: string) => {
    const client = getApiClient();
    const previousMessages = get().messagesByChannel[channelId] ?? [];

    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: (state.messagesByChannel[channelId] ?? []).map((message) => {
          if (message.id !== messageId) return message;

          const existingReaction = message.reactions.find((reaction) => reaction.emoji === emoji);
          if (existingReaction?.me) return message;

          return {
            ...message,
            reactions: existingReaction
              ? message.reactions.map((reaction) =>
                  reaction.emoji === emoji
                    ? { ...reaction, count: reaction.count + 1, me: true }
                    : reaction,
                )
              : [...message.reactions, { emoji, count: 1, me: true }],
          };
        }),
      },
    }));

    try {
      await client.addReaction(channelId, messageId, emoji);
    } catch (error) {
      set((state) => ({
        messagesByChannel: {
          ...state.messagesByChannel,
          [channelId]: previousMessages,
        },
      }));
      throw error;
    }
  },

  removeReaction: async (channelId: string, messageId: string, emoji: string) => {
    const client = getApiClient();
    const previousMessages = get().messagesByChannel[channelId] ?? [];

    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: (state.messagesByChannel[channelId] ?? []).map((message) => {
          if (message.id !== messageId) return message;

          const existingReaction = message.reactions.find((reaction) => reaction.emoji === emoji);
          if (!existingReaction?.me) return message;

          return {
            ...message,
            reactions: message.reactions
              .map((reaction) =>
                reaction.emoji === emoji
                  ? { ...reaction, count: Math.max(0, reaction.count - 1), me: false }
                  : reaction,
              )
              .filter((reaction) => reaction.count > 0),
          };
        }),
      },
    }));

    try {
      await client.removeReaction(channelId, messageId, emoji);
    } catch (error) {
      set((state) => ({
        messagesByChannel: {
          ...state.messagesByChannel,
          [channelId]: previousMessages,
        },
      }));
      throw error;
    }
  },

  addMessage: (msg: Message) => {
    const normalized = normalizeMessage(msg);
    set((state) => {
      const existing = state.messagesByChannel[normalized.channelId] ?? [];
      // Avoid duplicates
      if (existing.some((m) => m.id === normalized.id)) return state;
      return {
        messagesByChannel: {
          ...state.messagesByChannel,
          [normalized.channelId]: [...existing, normalized],
        },
      };
    });
  },

  updateMessage: (msg: Message) => {
    const normalized = normalizeMessage(msg);
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [normalized.channelId]: (state.messagesByChannel[normalized.channelId] ?? []).map((m) =>
          m.id === normalized.id ? normalized : m,
        ),
      },
    }));
  },

  removeMessage: (channelId: string, messageId: string) => {
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: (state.messagesByChannel[channelId] ?? []).filter((m) => m.id !== messageId),
      },
    }));
  },
}));
