import { create } from 'zustand';
import { RealtimeClient } from '@relayforge/sdk';
import type {
  MessageCreateEvent,
  MessageUpdateEvent,
  MessageDeleteEvent,
  TypingStartEvent,
  DMMessageCreateEvent,
  DMMessageUpdateEvent,
  DMMessageDeleteEvent,
} from '@relayforge/types';
import { useAuthStore } from './auth';
import { useGuildStore } from './guild';
import { useDMStore } from './dm';
import { useMessagesStore } from './messages';
import { getCurrentConnection } from '@/lib/serverConnections';

let realtimeClient: RealtimeClient | null = null;
let realtimeClientWsURL: string | null = null;
let boundRealtimeClientWsURL: string | null = null;

function getRealtimeClient(): RealtimeClient {
  const wsURL = getCurrentConnection().wsUrl;
  if (!realtimeClient || realtimeClientWsURL !== wsURL) {
    realtimeClient = new RealtimeClient({ wsURL });
    realtimeClientWsURL = wsURL;
  }
  return realtimeClient;
}

function bindRealtimeListeners(client: RealtimeClient, wsURL: string) {
  if (boundRealtimeClientWsURL === wsURL) {
    return;
  }

  client.on('_stateChange', (state) => {
    useRealtimeStore.setState({ connected: state === 'connected' });
  });

  client.on<MessageCreateEvent>('MESSAGE_CREATE', (event) => {
    useMessagesStore.getState().addMessage(event.message);
  });

  client.on<MessageUpdateEvent>('MESSAGE_UPDATE', (event) => {
    useMessagesStore.getState().updateMessage(event.message);
  });

  client.on<MessageDeleteEvent>('MESSAGE_DELETE', (event) => {
    useMessagesStore.getState().removeMessage(event.channelId, event.messageId);
  });

  client.on<DMMessageCreateEvent>('DM_MESSAGE_CREATE', (event) => {
    useDMStore.getState().addIncomingMessage(event.message);
  });

  client.on<DMMessageUpdateEvent>('DM_MESSAGE_UPDATE', (event) => {
    useDMStore.getState().updateIncomingMessage(event.message);
  });

  client.on<DMMessageDeleteEvent>('DM_MESSAGE_DELETE', (event) => {
    useDMStore.getState().removeIncomingMessage(event.channelId, event.messageId);
  });

  client.on<TypingStartEvent>('TYPING_START', (event) => {
    const currentUser = useAuthStore.getState().user;
    if (event.userId === currentUser?.id) return;

    const expiresAt = Date.now() + 8000;
    useRealtimeStore.setState((state) => {
      const channelTypers = (state.typingUsers[event.channelId] ?? []).filter(
        (t) => t.userId !== event.userId && t.expiresAt > Date.now(),
      );
      channelTypers.push({
        userId: event.userId,
        username: event.username,
        expiresAt,
      });
      return {
        typingUsers: {
          ...state.typingUsers,
          [event.channelId]: channelTypers,
        },
      };
    });

    setTimeout(() => {
      useRealtimeStore.setState((state) => ({
        typingUsers: {
          ...state.typingUsers,
          [event.channelId]: (state.typingUsers[event.channelId] ?? []).filter(
            (t) => t.expiresAt > Date.now(),
          ),
        },
      }));
    }, 8000);
  });

  boundRealtimeClientWsURL = wsURL;
}

interface TypingUser {
  userId: string;
  username: string;
  expiresAt: number;
}

interface RealtimeState {
  connected: boolean;
  typingUsers: Record<string, TypingUser[]>; // channelId -> users

  connect: () => void;
  disconnect: () => void;
  sendTyping: (channelId: string, guildId?: string) => void;
}

export const useRealtimeStore = create<RealtimeState>((set, _get) => ({
  connected: false,
  typingUsers: {},

  connect: () => {
    const auth = useAuthStore.getState();
    const guilds = useGuildStore.getState().guilds;

    if (!auth.accessToken) return;

    const client = getRealtimeClient();
    bindRealtimeListeners(client, getCurrentConnection().wsUrl);

    client.connect(
      auth.accessToken,
      guilds.map((g) => g.id),
    );
  },

  disconnect: () => {
    const client = getRealtimeClient();
    client.disconnect();
    set({ connected: false, typingUsers: {} });
  },

  sendTyping: (channelId: string, guildId?: string) => {
    const client = getRealtimeClient();
    const currentUser = useAuthStore.getState().user;
    client.send({
      type: 'TYPING_START',
      data: {
        channelId,
        guildId,
        userId: currentUser?.id,
        username: currentUser?.displayName ?? currentUser?.username,
      },
    });
  },
}));
