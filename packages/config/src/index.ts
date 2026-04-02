/**
 * Safely read environment variables in browser (Vite) and Node contexts.
 * Keys are checked in order so explicit contract names can take priority.
 */
function getEnv(...keys: string[]): string | undefined {
  // Vite injects prefixed env vars at build time via import.meta.env
  try {
    const meta = (import.meta as unknown as Record<string, Record<string, string>>).env;
    if (meta) {
      for (const key of keys) {
        if (meta[key]) {
          return meta[key];
        }
      }
    }
  } catch {
    // import.meta.env may not exist in Node
  }

  // Fallback to process.env for SSR / Node / test environments
  if (typeof process !== 'undefined' && process.env) {
    for (const key of keys) {
      if (process.env[key]) {
        return process.env[key];
      }
    }
  }

  return undefined;
}

/**
 * Base URL for the REST API.
 * Set via API_BASE_URL or the legacy VITE_API_URL / API_URL aliases.
 * @default "http://localhost:8080/api/v1"
 */
export const API_BASE_URL: string =
  getEnv('API_BASE_URL', 'VITE_API_URL', 'API_URL') ?? 'http://localhost:8080/api/v1';

/**
 * WebSocket URL for real-time events.
 * Set via WS_URL or the legacy VITE_WS_URL alias.
 * @default "ws://localhost:8081/ws"
 */
export const WS_URL: string = getEnv('WS_URL', 'VITE_WS_URL') ?? 'ws://localhost:8081/ws';

/**
 * LiveKit server URL for voice/video.
 * Set via LIVEKIT_URL or the legacy VITE_LIVEKIT_URL alias.
 * @default "ws://localhost:7880"
 */
export const LIVEKIT_URL: string =
  getEnv('LIVEKIT_URL', 'VITE_LIVEKIT_URL') ?? 'ws://localhost:7880';

/**
 * Maximum file upload size in bytes (25 MB).
 */
export const MAX_UPLOAD_SIZE = 25 * 1024 * 1024;

/**
 * Maximum message content length.
 */
export const MAX_MESSAGE_LENGTH = 4000;

/**
 * WebSocket heartbeat interval in milliseconds.
 */
export const WS_HEARTBEAT_INTERVAL = 30_000;

/**
 * WebSocket reconnect base delay in milliseconds.
 */
export const WS_RECONNECT_BASE_DELAY = 1_000;

/**
 * WebSocket reconnect maximum delay in milliseconds.
 */
export const WS_RECONNECT_MAX_DELAY = 30_000;
