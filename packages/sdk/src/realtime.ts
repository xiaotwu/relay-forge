import type { EventType, ServerEvent, ClientEvent } from '@relayforge/types';
import {
  WS_HEARTBEAT_INTERVAL,
  WS_RECONNECT_BASE_DELAY,
  WS_RECONNECT_MAX_DELAY,
} from '@relayforge/config';

export type EventHandler<T = unknown> = (data: T) => void;

export interface RealtimeClientOptions {
  wsURL?: string;
  heartbeatInterval?: number;
  reconnectBaseDelay?: number;
  reconnectMaxDelay?: number;
}

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

export class RealtimeClient {
  private wsURL: string;
  private ws: WebSocket | null = null;
  private token: string | null = null;
  private guildIDs: string[] = [];
  private listeners = new Map<string, Set<EventHandler<unknown>>>();
  private seq = 0;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private heartbeatInterval: number;
  private reconnectBaseDelay: number;
  private reconnectMaxDelay: number;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionalClose = false;
  private _state: ConnectionState = 'disconnected';

  constructor(options: RealtimeClientOptions = {}) {
    this.wsURL = options.wsURL ?? 'ws://localhost:8080/ws';
    this.heartbeatInterval = options.heartbeatInterval ?? WS_HEARTBEAT_INTERVAL;
    this.reconnectBaseDelay = options.reconnectBaseDelay ?? WS_RECONNECT_BASE_DELAY;
    this.reconnectMaxDelay = options.reconnectMaxDelay ?? WS_RECONNECT_MAX_DELAY;
  }

  get state(): ConnectionState {
    return this._state;
  }

  connect(token: string, guildIDs: string[]): void {
    this.token = token;
    this.guildIDs = guildIDs;
    this.intentionalClose = false;
    this.reconnectAttempts = 0;
    this.openConnection();
  }

  disconnect(): void {
    this.intentionalClose = true;
    this.cleanup();
    this._state = 'disconnected';
    this.emitInternal('_stateChange', this._state);
  }

  on<T = unknown>(eventType: EventType | string, handler: EventHandler<T>): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(handler as EventHandler<unknown>);
  }

  off<T = unknown>(eventType: EventType | string, handler: EventHandler<T>): void {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      handlers.delete(handler as EventHandler<unknown>);
      if (handlers.size === 0) {
        this.listeners.delete(eventType);
      }
    }
  }

  send(event: ClientEvent): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event));
    }
  }

  private openConnection(): void {
    this._state = this.reconnectAttempts > 0 ? 'reconnecting' : 'connecting';
    this.emitInternal('_stateChange', this._state);

    try {
      this.ws = new WebSocket(this.wsURL);
    } catch {
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      this._state = 'connected';
      this.reconnectAttempts = 0;
      this.emitInternal('_stateChange', this._state);

      // Send IDENTIFY
      this.send({
        type: 'IDENTIFY',
        data: {
          token: this.token!,
          guildIds: this.guildIDs,
        },
      });

      this.startHeartbeat();
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const parsed = JSON.parse(event.data as string) as ServerEvent;
        this.seq = parsed.seq;
        this.emitInternal(parsed.type, parsed.data);

        if (parsed.type === 'HEARTBEAT_ACK') {
          // Heartbeat acknowledged, connection is alive
        }
      } catch {
        // Ignore malformed messages
      }
    };

    this.ws.onclose = () => {
      this.stopHeartbeat();
      if (!this.intentionalClose) {
        this._state = 'reconnecting';
        this.emitInternal('_stateChange', this._state);
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = () => {
      // The onclose handler will fire after onerror, so reconnect logic is there
    };
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: 'HEARTBEAT', data: { seq: this.seq } });
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.intentionalClose) return;

    const delay = Math.min(
      this.reconnectBaseDelay * Math.pow(2, this.reconnectAttempts),
      this.reconnectMaxDelay,
    );

    // Add jitter: +/- 25%
    const jitter = delay * 0.25 * (Math.random() * 2 - 1);
    const finalDelay = Math.round(delay + jitter);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.openConnection();
    }, finalDelay);
  }

  private cleanup(): void {
    this.stopHeartbeat();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.onopen = null;
      this.ws.onmessage = null;
      this.ws.onclose = null;
      this.ws.onerror = null;
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close();
      }
      this.ws = null;
    }
  }

  private emitInternal(eventType: string, data: unknown): void {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(data);
        } catch {
          // Don't let listener errors break the client
        }
      }
    }

    // Also emit to wildcard listeners
    const wildcardHandlers = this.listeners.get('*');
    if (wildcardHandlers) {
      for (const handler of wildcardHandlers) {
        try {
          handler({ type: eventType, data });
        } catch {
          // Don't let listener errors break the client
        }
      }
    }
  }
}
