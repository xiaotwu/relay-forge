import { create } from 'zustand';
import type { Guild, GuildMember, Channel } from '@relayforge/types';
import { getApiClient } from './auth';

interface GuildState {
  guilds: Guild[];
  selectedGuildId: string | null;
  channels: Channel[];
  members: GuildMember[];
  selectedChannelId: string | null;

  fetchGuilds: () => Promise<void>;
  selectGuild: (id: string | null) => Promise<void>;
  fetchChannels: (guildId: string) => Promise<void>;
  fetchMembers: (guildId: string) => Promise<void>;
  selectChannel: (id: string | null) => void;
  createGuild: (name: string) => Promise<void>;
}

export const useGuildStore = create<GuildState>((set, get) => ({
  guilds: [],
  selectedGuildId: null,
  channels: [],
  members: [],
  selectedChannelId: null,

  fetchGuilds: async () => {
    const client = getApiClient();
    const res = await client.listGuilds();
    set({ guilds: res.data });
  },

  selectGuild: async (id: string | null) => {
    set({ selectedGuildId: id, selectedChannelId: null, channels: [], members: [] });
    if (id) {
      await Promise.all([get().fetchChannels(id), get().fetchMembers(id)]);
      // Auto-select default channel
      const { channels } = get();
      const textChannels = channels.filter((c) => c.type === 'text');
      if (textChannels.length > 0) {
        set({ selectedChannelId: textChannels[0].id });
      }
    }
  },

  fetchChannels: async (guildId: string) => {
    const client = getApiClient();
    const res = await client.listChannels(guildId);
    set({ channels: res.data });
  },

  fetchMembers: async (guildId: string) => {
    const client = getApiClient();
    const res = await client.listMembers(guildId);
    set({ members: res.data });
  },

  selectChannel: (id: string | null) => {
    set({ selectedChannelId: id });
  },

  createGuild: async (name: string) => {
    const client = getApiClient();
    const res = await client.createGuild({ name });
    set((state) => ({ guilds: [...state.guilds, res.data] }));
  },
}));
