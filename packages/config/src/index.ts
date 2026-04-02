/**
 * Safely read a Vite environment variable.
 * Works in both browser (import.meta.env) and Node (process.env) contexts.
 */
function getEnv(viteKey: string, nodeKey: string): string | undefined {
  // Vite injects env vars at build time via import.meta.env
  try {
    const meta = (import.meta as unknown as Record<string, Record<string, string>>).env;
    if (meta && meta[viteKey]) {
      return meta[viteKey];
    }
  } catch {
    // import.meta.env may not exist in Node
  }

  // Fallback to process.env for SSR / Node / test environments
  if (typeof process !== 'undefined' && process.env) {
    return process.env[nodeKey] ?? process.env[viteKey];
  }

  return undefined;
}

/**
 * Base URL for the REST API.
 * Set via VITE_API_URL (browser) or API_URL (Node).
 * @default "http://localhost:8080/api/v1"
 */
export const API_BASE_URL: string =
  getEnv('VITE_API_URL', 'API_URL') ?? 'http://localhost:8080/api/v1';

/**
 * WebSocket URL for real-time events.
 * Set via VITE_WS_URL (browser) or WS_URL (Node).
 * @default "ws://localhost:8080/ws"
 */
export const WS_URL: string = getEnv('VITE_WS_URL', 'WS_URL') ?? 'ws://localhost:8080/ws';

/**
 * LiveKit server URL for voice/video.
 * Set via VITE_LIVEKIT_URL (browser) or LIVEKIT_URL (Node).
 * @default "ws://localhost:7880"
 */
export const LIVEKIT_URL: string =
  getEnv('VITE_LIVEKIT_URL', 'LIVEKIT_URL') ?? 'ws://localhost:7880';

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
