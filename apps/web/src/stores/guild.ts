import { create } from 'zustand';
import type {
  Guild,
  GuildMember,
  Channel,
  CreateGuildRequest,
  CreateChannelRequest,
  PublicUser,
} from '@relayforge/types';
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
  createGuild: (data: CreateGuildRequest) => Promise<Guild>;
  createChannel: (guildId: string, data: CreateChannelRequest) => Promise<Channel>;
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
    set({ guilds: Array.isArray(res.data) ? res.data : [] });
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
    set({ channels: Array.isArray(res.data) ? res.data : [] });
  },

  fetchMembers: async (guildId: string) => {
    const client = getApiClient();
    const res = await client.listMembers(guildId);
    const members = await Promise.all(
      (Array.isArray(res.data) ? res.data : []).map(async (member) => {
        const raw = member as typeof member & {
          user?: unknown;
          userId?: string;
          roleIds?: string[];
          mute?: boolean;
          deaf?: boolean;
          isMuted?: boolean;
          isDeafened?: boolean;
        };

        if (raw.user) {
          return {
            ...member,
            roleIds: Array.isArray(raw.roleIds) ? raw.roleIds : [],
            mute: raw.mute ?? raw.isMuted ?? false,
            deaf: raw.deaf ?? raw.isDeafened ?? false,
          };
        }

        const userId = raw.userId;
        const fetchedUser = userId ? (await client.getUser(userId)).data : null;
        const user: PublicUser =
          fetchedUser != null
            ? {
                id: fetchedUser.id,
                username: fetchedUser.username,
                displayName: fetchedUser.displayName ?? fetchedUser.username,
                avatarUrl: fetchedUser.avatarUrl ?? null,
                bannerUrl: fetchedUser.bannerUrl ?? null,
                bio: fetchedUser.bio ?? null,
                status: fetchedUser.status,
                customStatus: fetchedUser.customStatus ?? null,
              }
            : {
                id: userId ?? 'unknown',
                username: 'unknown',
                displayName: 'Unknown user',
                avatarUrl: null,
                bannerUrl: null,
                bio: null,
                status: 'offline',
                customStatus: null,
              };

        return {
          ...member,
          user,
          roleIds: Array.isArray(raw.roleIds) ? raw.roleIds : [],
          mute: raw.mute ?? raw.isMuted ?? false,
          deaf: raw.deaf ?? raw.isDeafened ?? false,
        };
      }),
    );

    set({ members });
  },

  selectChannel: (id: string | null) => {
    set({ selectedChannelId: id });
  },

  createGuild: async (data: CreateGuildRequest) => {
    const client = getApiClient();
    const res = await client.createGuild(data);
    set((state) => ({
      guilds: [...(Array.isArray(state.guilds) ? state.guilds : []), res.data],
      selectedGuildId: res.data.id,
    }));
    await Promise.all([get().fetchChannels(res.data.id), get().fetchMembers(res.data.id)]);
    const channels = get().channels.filter((channel) => channel.type === 'text');
    set({ selectedChannelId: channels[0]?.id ?? null });
    return res.data;
  },

  createChannel: async (guildId: string, data: CreateChannelRequest) => {
    const client = getApiClient();
    const res = await client.createChannel(guildId, data);
    await get().fetchChannels(guildId);
    if (res.data.type === 'text') {
      set({ selectedChannelId: res.data.id });
    }
    return res.data;
  },
}));
