import { create } from 'zustand';
import type { Message } from '@relayforge/types';
import { getApiClient } from './auth';

interface MessagesState {
  messagesByChannel: Record<string, Message[]>;
  sending: boolean;
  hasMore: Record<string, boolean>;

  fetchMessages: (channelId: string, before?: string) => Promise<void>;
  sendMessage: (channelId: string, content: string, replyToId?: string) => Promise<void>;
  editMessage: (channelId: string, messageId: string, content: string) => Promise<void>;
  deleteMessage: (channelId: string, messageId: string) => Promise<void>;
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
    const existing = before ? (get().messagesByChannel[channelId] ?? []) : [];
    const merged = before ? [...res.data, ...existing] : res.data;

    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: merged,
      },
      hasMore: {
        ...state.hasMore,
        [channelId]: res.cursor.hasMore,
      },
    }));
  },

  sendMessage: async (channelId: string, content: string, replyToId?: string) => {
    set({ sending: true });
    try {
      const client = getApiClient();
      await client.sendMessage(channelId, { content, replyToId });
    } finally {
      set({ sending: false });
    }
  },

  editMessage: async (channelId: string, messageId: string, content: string) => {
    const client = getApiClient();
    const res = await client.editMessage(channelId, messageId, { content });
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: (state.messagesByChannel[channelId] ?? []).map((m) =>
          m.id === messageId ? res.data : m,
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

  addMessage: (msg: Message) => {
    set((state) => {
      const existing = state.messagesByChannel[msg.channelId] ?? [];
      // Avoid duplicates
      if (existing.some((m) => m.id === msg.id)) return state;
      return {
        messagesByChannel: {
          ...state.messagesByChannel,
          [msg.channelId]: [...existing, msg],
        },
      };
    });
  },

  updateMessage: (msg: Message) => {
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [msg.channelId]: (state.messagesByChannel[msg.channelId] ?? []).map((m) =>
          m.id === msg.id ? msg : m,
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
