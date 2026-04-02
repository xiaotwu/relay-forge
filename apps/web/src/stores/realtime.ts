import { create } from 'zustand';
import { RealtimeClient } from '@relayforge/sdk';
import { WS_URL } from '@relayforge/config';
import type {
  MessageCreateEvent,
  MessageUpdateEvent,
  MessageDeleteEvent,
  TypingStartEvent,
} from '@relayforge/types';
import { useAuthStore } from './auth';
import { useGuildStore } from './guild';
import { useMessagesStore } from './messages';

let realtimeClient: RealtimeClient | null = null;

function getRealtimeClient(): RealtimeClient {
  if (!realtimeClient) {
    realtimeClient = new RealtimeClient({ wsURL: WS_URL });
  }
  return realtimeClient;
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

    client.on('_stateChange', (state) => {
      set({ connected: state === 'connected' });
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

    client.on<TypingStartEvent>('TYPING_START', (event) => {
      const currentUser = useAuthStore.getState().user;
      if (event.userId === currentUser?.id) return;

      const expiresAt = Date.now() + 8000;
      set((state) => {
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

      // Auto-clear after timeout
      setTimeout(() => {
        set((state) => ({
          typingUsers: {
            ...state.typingUsers,
            [event.channelId]: (state.typingUsers[event.channelId] ?? []).filter(
              (t) => t.expiresAt > Date.now(),
            ),
          },
        }));
      }, 8000);
    });

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
    client.send({
      type: 'TYPING_START',
      data: { channelId, guildId },
    });
  },
}));
