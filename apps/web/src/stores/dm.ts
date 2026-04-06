import { create } from 'zustand';
import type { CreateDMChannelRequest, DMChannel, DMMessage, PublicUser } from '@relayforge/types';
import { getApiClient } from './auth';
import { useAuthStore } from './auth';
import { useGuildStore } from './guild';

interface DMState {
  channels: DMChannel[];
  selectedChannelId: string | null;
  messagesByChannel: Record<string, DMMessage[]>;
  loading: boolean;
  sending: boolean;

  fetchChannels: () => Promise<void>;
  selectChannel: (channelId: string | null) => void;
  openConversation: (user: PublicUser) => Promise<void>;
  createConversation: (data: CreateDMChannelRequest) => Promise<DMChannel>;
  fetchMessages: (channelId: string) => Promise<void>;
  sendMessage: (channelId: string, content: string, replyToId?: string) => Promise<void>;
  deleteMessage: (channelId: string, messageId: string) => Promise<void>;
  updateChannel: (channelId: string, name: string) => Promise<DMChannel>;
  addIncomingMessage: (message: DMMessage) => void;
  updateIncomingMessage: (message: DMMessage) => void;
  removeIncomingMessage: (channelId: string, messageId: string) => void;
}

function dedupeChannels(channels: DMChannel[]): DMChannel[] {
  const seen = new Set<string>();
  return channels.filter((channel) => {
    if (seen.has(channel.id)) return false;
    seen.add(channel.id);
    return true;
  });
}

export const useDMStore = create<DMState>((set, get) => ({
  channels: [],
  selectedChannelId: null,
  messagesByChannel: {},
  loading: false,
  sending: false,

  fetchChannels: async () => {
    set({ loading: true });
    try {
      const res = await getApiClient().listDMChannels();
      const channels = Array.isArray(res.data) ? res.data : [];
      set((state) => ({
        channels: dedupeChannels(channels),
        selectedChannelId: state.selectedChannelId ?? channels[0]?.id ?? null,
      }));
    } finally {
      set({ loading: false });
    }
  },

  selectChannel: (channelId: string | null) => {
    set({ selectedChannelId: channelId });
  },

  openConversation: async (user: PublicUser) => {
    const currentUserId = useAuthStore.getState().user?.id;
    const existing = get().channels.find(
      (channel) =>
        channel.participants.some((participant) => participant.id === user.id) &&
        channel.participants.some((participant) => participant.id === currentUserId),
    );

    useGuildStore.getState().selectGuild(null);

    if (existing) {
      set({ selectedChannelId: existing.id });
      await get().fetchMessages(existing.id);
      return;
    }

    const res = await getApiClient().createDMChannel({ participantIds: [user.id] });
    const channel = res.data;
    set((state) => ({
      channels: dedupeChannels([channel, ...state.channels]),
      selectedChannelId: channel.id,
    }));
    await get().fetchMessages(channel.id);
  },

  createConversation: async (data: CreateDMChannelRequest) => {
    const res = await getApiClient().createDMChannel(data);
    const channel = res.data;
    useGuildStore.getState().selectGuild(null);
    set((state) => ({
      channels: dedupeChannels([channel, ...state.channels]),
      selectedChannelId: channel.id,
    }));
    await get().fetchMessages(channel.id);
    return channel;
  },

  fetchMessages: async (channelId: string) => {
    const res = await getApiClient().listDMMessages(channelId);
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: Array.isArray(res.data) ? res.data : [],
      },
    }));
  },

  sendMessage: async (channelId: string, content: string, replyToId?: string) => {
    set({ sending: true });
    try {
      const res = await getApiClient().sendDMMessage(channelId, { content, replyToId });
      set((state) => ({
        messagesByChannel: {
          ...state.messagesByChannel,
          [channelId]: [...(state.messagesByChannel[channelId] ?? []), res.data],
        },
        channels: state.channels.map((channel) =>
          channel.id === channelId
            ? {
                ...channel,
                lastMessage: res.data.content,
                lastMessageAt: res.data.createdAt,
              }
            : channel,
        ),
      }));
    } finally {
      set({ sending: false });
    }
  },

  deleteMessage: async (channelId: string, messageId: string) => {
    await getApiClient().deleteDMMessage(channelId, messageId);
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: (state.messagesByChannel[channelId] ?? []).filter(
          (message) => message.id !== messageId,
        ),
      },
    }));
  },

  updateChannel: async (channelId: string, name: string) => {
    const res = await getApiClient().updateDMChannel(channelId, { name });
    const channel = res.data;
    set((state) => ({
      channels: state.channels.map((item) => (item.id === channelId ? channel : item)),
    }));
    return channel;
  },

  addIncomingMessage: (message: DMMessage) => {
    set((state) => {
      const existingMessages = state.messagesByChannel[message.channelId] ?? [];
      if (existingMessages.some((item) => item.id === message.id)) {
        return state;
      }

      const updatedMessages = [...existingMessages, message].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      return {
        messagesByChannel: {
          ...state.messagesByChannel,
          [message.channelId]: updatedMessages,
        },
        channels: state.channels.map((channel) =>
          channel.id === message.channelId
            ? {
                ...channel,
                lastMessage: message.content,
                lastMessageAt: message.createdAt,
              }
            : channel,
        ),
      };
    });
  },

  updateIncomingMessage: (message: DMMessage) => {
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [message.channelId]: (state.messagesByChannel[message.channelId] ?? []).map((item) =>
          item.id === message.id ? message : item,
        ),
      },
    }));
  },

  removeIncomingMessage: (channelId: string, messageId: string) => {
    set((state) => ({
      messagesByChannel: {
        ...state.messagesByChannel,
        [channelId]: (state.messagesByChannel[channelId] ?? []).filter(
          (message) => message.id !== messageId,
        ),
      },
    }));
  },
}));
