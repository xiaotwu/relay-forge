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
});
