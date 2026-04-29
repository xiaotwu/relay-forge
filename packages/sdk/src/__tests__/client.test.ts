import { describe, it, expect } from 'vitest';
import { ApiClient } from '../client';

describe('ApiClient', () => {
  describe('construction', () => {
    it('uses default baseURL when none provided', () => {
      const client = new ApiClient();
      // Access token should be null by default
      expect(client.getAccessToken()).toBeNull();
    });

    it('accepts a custom baseURL', () => {
      const client = new ApiClient({ baseURL: 'https://api.example.com/v1' });
      expect(client).toBeInstanceOf(ApiClient);
    });
  });

  describe('setTokens', () => {
    it('stores access token', () => {
      const client = new ApiClient();
      client.setTokens('access-123', 'refresh-456');
      expect(client.getAccessToken()).toBe('access-123');
    });

    it('clearTokens removes stored tokens', () => {
      const client = new ApiClient();
      client.setTokens('access-123', 'refresh-456');
      client.clearTokens();
      expect(client.getAccessToken()).toBeNull();
    });
  });

  describe('request methods exist', () => {
    const client = new ApiClient();

    it('has auth methods', () => {
      expect(typeof client.register).toBe('function');
      expect(typeof client.login).toBe('function');
      expect(typeof client.logout).toBe('function');
    });

    it('has guild methods', () => {
      expect(typeof client.createGuild).toBe('function');
      expect(typeof client.listGuilds).toBe('function');
      expect(typeof client.getGuild).toBe('function');
      expect(typeof client.updateGuild).toBe('function');
      expect(typeof client.deleteGuild).toBe('function');
    });

    it('has channel methods', () => {
      expect(typeof client.createChannel).toBe('function');
      expect(typeof client.listChannels).toBe('function');
      expect(typeof client.getChannel).toBe('function');
      expect(typeof client.updateChannel).toBe('function');
      expect(typeof client.deleteChannel).toBe('function');
    });

    it('has message methods', () => {
      expect(typeof client.sendMessage).toBe('function');
      expect(typeof client.listMessages).toBe('function');
      expect(typeof client.editMessage).toBe('function');
      expect(typeof client.deleteMessage).toBe('function');
    });
  });

  describe('response normalization', () => {
    it('normalizes snake_case auth fields to camelCase', async () => {
      const originalFetch = global.fetch;
      global.fetch = (async () =>
        new Response(
          JSON.stringify({
            data: {
              access_token: 'access-123',
              refresh_token: 'refresh-456',
              expires_in: 900,
            },
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          },
        )) as typeof fetch;

      try {
        const client = new ApiClient({ baseURL: 'http://localhost:8080/api/v1' });
        const res = await client.login({ email: 'user@example.com', password: 'Password123@' });
        expect(res.data.accessToken).toBe('access-123');
        expect(res.data.refreshToken).toBe('refresh-456');
        expect(res.data.expiresIn).toBe(900);
      } finally {
        global.fetch = originalFetch;
      }
    });
  });

  describe('contract paths', () => {
    async function captureRequest(run: (client: ApiClient) => Promise<unknown>) {
      const originalFetch = global.fetch;
      const calls: { method: string; url: string; body?: string }[] = [];
      global.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
        calls.push({
          method: init?.method ?? 'GET',
          url: String(input),
          body: typeof init?.body === 'string' ? init.body : undefined,
        });
        return new Response(JSON.stringify({ data: {} }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }) as typeof fetch;

      try {
        const client = new ApiClient({
          baseURL: 'http://api.test/api/v1',
          mediaBaseURL: 'http://media.test/api/v1',
        });
        await run(client);
        return calls[0];
      } finally {
        global.fetch = originalFetch;
      }
    }

    it('uses OpenAPI-backed auth routes', async () => {
      const call = await captureRequest((client) =>
        client.login({ email: 'user@example.com', password: 'Password123@' }),
      );
      expect(call.method).toBe('POST');
      expect(call.url).toBe('http://api.test/api/v1/auth/login');
    });

    it('uses OpenAPI-backed guild collection routes', async () => {
      const call = await captureRequest((client) => client.listGuilds());
      expect(call.method).toBe('GET');
      expect(call.url).toBe('http://api.test/api/v1/guilds');
    });

    it('uses nested guild channel routes', async () => {
      const call = await captureRequest((client) => client.getChannel('guild-1', 'channel-2'));
      expect(call.method).toBe('GET');
      expect(call.url).toBe('http://api.test/api/v1/guilds/guild-1/channels/channel-2');
    });

    it('uses backend role member routes', async () => {
      const call = await captureRequest((client) =>
        client.assignRole('guild-1', 'user-2', 'role-3'),
      );
      expect(call.method).toBe('POST');
      expect(call.url).toBe('http://api.test/api/v1/guilds/guild-1/roles/role-3/members/user-2');
    });

    it('posts reaction payloads to the backend reaction route', async () => {
      const call = await captureRequest((client) =>
        client.addReaction('channel-1', 'message-2', ':+1:'),
      );
      expect(call.method).toBe('POST');
      expect(call.url).toBe('http://api.test/api/v1/channels/channel-1/messages/message-2/reactions');
      expect(call.body).toBe(JSON.stringify({ emoji: ':+1:' }));
    });

    it('uses OpenAPI-backed message routes', async () => {
      const call = await captureRequest((client) =>
        client.sendMessage('channel-1', { content: 'hello' }),
      );
      expect(call.method).toBe('POST');
      expect(call.url).toBe('http://api.test/api/v1/channels/channel-1/messages');
    });

    it('uses OpenAPI-backed DM routes', async () => {
      const call = await captureRequest((client) => client.listDMMessages('dm-1'));
      expect(call.method).toBe('GET');
      expect(call.url).toBe('http://api.test/api/v1/dms/dm-1/messages');
    });

    it('uses OpenAPI-backed admin routes', async () => {
      const call = await captureRequest((client) => client.disableUser('user-1'));
      expect(call.method).toBe('POST');
      expect(call.url).toBe('http://api.test/api/v1/admin/users/user-1/disable');
    });

    it('uses media service upload routes', async () => {
      const call = await captureRequest((client) =>
        client.createPresignedUpload({
          filename: 'photo.png',
          contentType: 'image/png',
          size: 512,
        }),
      );
      expect(call.method).toBe('POST');
      expect(call.url).toBe('http://media.test/api/v1/media/upload/presign');
      expect(call.body).toBe(
        JSON.stringify({ file_name: 'photo.png', content_type: 'image/png', file_size: 512 }),
      );
    });

    it('uses media upload completion ACL ownership fields', async () => {
      const call = await captureRequest((client) =>
        client.completeUpload({
          fileId: 'file-1',
          key: 'uploads/file-1',
          filename: 'photo.png',
          contentType: 'image/png',
          size: 512,
          ownerType: 'dm_channel',
          ownerId: 'dm-1',
        }),
      );
      expect(call.method).toBe('POST');
      expect(call.url).toBe('http://media.test/api/v1/media/upload/complete');
      expect(call.body).toBe(
        JSON.stringify({
          file_id: 'file-1',
          key: 'uploads/file-1',
          file_name: 'photo.png',
          content_type: 'image/png',
          file_size: 512,
          owner_type: 'dm_channel',
          owner_id: 'dm-1',
        }),
      );
    });

    it('uses media service voice routes', async () => {
      const call = await captureRequest((client) =>
        client.getVoiceToken({ roomName: 'guild-channel', identity: 'user-1' }),
      );
      expect(call.method).toBe('POST');
      expect(call.url).toBe('http://media.test/api/v1/voice/token');
      expect(call.body).toBe(
        JSON.stringify({
          room_name: 'guild-channel',
          identity: 'user-1',
          can_publish: true,
          can_subscribe: true,
        }),
      );
    });
  });
});
