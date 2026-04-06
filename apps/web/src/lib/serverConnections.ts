import React from 'react';
import {
  API_BASE_URL as DEFAULT_API_BASE_URL,
  LIVEKIT_URL as DEFAULT_LIVEKIT_URL,
  MEDIA_BASE_URL as DEFAULT_MEDIA_BASE_URL,
  WS_URL as DEFAULT_WS_URL,
} from '@relayforge/config';

export interface ServerConnection {
  id: string;
  name: string;
  apiBaseUrl: string;
  wsUrl: string;
  mediaBaseUrl: string;
  livekitUrl: string;
}

export type ServerConnectionField = 'apiBaseUrl' | 'wsUrl' | 'mediaBaseUrl' | 'livekitUrl';

export interface ServerConnectionIssue {
  field: ServerConnectionField;
  severity: 'error' | 'warning';
  message: string;
}

const CONNECTIONS_KEY = 'rf_server_connections';
const ACTIVE_CONNECTION_KEY = 'rf_active_server_connection';
const CHANGE_EVENT = 'rf-server-connections-change';

const defaultConnection: ServerConnection = {
  id: 'default-local',
  name: 'Local default',
  apiBaseUrl: DEFAULT_API_BASE_URL,
  wsUrl: DEFAULT_WS_URL,
  mediaBaseUrl: DEFAULT_MEDIA_BASE_URL,
  livekitUrl: DEFAULT_LIVEKIT_URL,
};

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);

function stripTrailingSlashes(value: string) {
  return value.replace(/\/+$/, '');
}

function isPrivateIPv4(hostname: string): boolean {
  const parts = hostname.split('.').map((part) => Number.parseInt(part, 10));
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }

  if (parts[0] === 10) return true;
  if (parts[0] === 127) return true;
  if (parts[0] === 192 && parts[1] === 168) return true;
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  return false;
}

function isLocalOrPrivateHostname(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  return (
    LOCAL_HOSTNAMES.has(normalized) || normalized.endsWith('.local') || isPrivateIPv4(normalized)
  );
}

function normalizeEndpointValue(value: string, defaultPath?: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  try {
    const parsed = new URL(trimmed);
    if (defaultPath && (!parsed.pathname || parsed.pathname === '/')) {
      parsed.pathname = defaultPath;
    }
    parsed.hash = '';
    return stripTrailingSlashes(parsed.toString());
  } catch {
    return trimmed;
  }
}

export function normalizeServerConnection(connection: ServerConnection): ServerConnection {
  return {
    ...connection,
    name: connection.name.trim(),
    apiBaseUrl: normalizeEndpointValue(connection.apiBaseUrl, '/api/v1'),
    wsUrl: normalizeEndpointValue(connection.wsUrl, '/ws'),
    mediaBaseUrl: normalizeEndpointValue(connection.mediaBaseUrl, '/api/v1'),
    livekitUrl: normalizeEndpointValue(connection.livekitUrl),
  };
}

export function validateServerConnection(connection: ServerConnection): ServerConnectionIssue[] {
  const normalized = normalizeServerConnection(connection);
  const issues: ServerConnectionIssue[] = [];
  const parsedHosts: Partial<Record<ServerConnectionField, URL>> = {};

  const endpoints: Array<{
    field: ServerConnectionField;
    label: string;
    value: string;
    protocols: string[];
    secureProtocol: string;
    defaultPath?: string;
  }> = [
    {
      field: 'apiBaseUrl',
      label: 'API base URL',
      value: normalized.apiBaseUrl,
      protocols: ['http:', 'https:'],
      secureProtocol: 'https:',
      defaultPath: '/api/v1',
    },
    {
      field: 'wsUrl',
      label: 'Realtime WebSocket URL',
      value: normalized.wsUrl,
      protocols: ['ws:', 'wss:'],
      secureProtocol: 'wss:',
      defaultPath: '/ws',
    },
    {
      field: 'mediaBaseUrl',
      label: 'Media service URL',
      value: normalized.mediaBaseUrl,
      protocols: ['http:', 'https:'],
      secureProtocol: 'https:',
      defaultPath: '/api/v1',
    },
    {
      field: 'livekitUrl',
      label: 'LiveKit URL',
      value: normalized.livekitUrl,
      protocols: ['ws:', 'wss:'],
      secureProtocol: 'wss:',
    },
  ];

  for (const endpoint of endpoints) {
    if (!endpoint.value) {
      issues.push({
        field: endpoint.field,
        severity: 'error',
        message: `${endpoint.label} is required.`,
      });
      continue;
    }

    let parsed: URL;
    try {
      parsed = new URL(endpoint.value);
    } catch {
      issues.push({
        field: endpoint.field,
        severity: 'error',
        message: `${endpoint.label} must be a valid URL.`,
      });
      continue;
    }

    parsedHosts[endpoint.field] = parsed;

    if (!endpoint.protocols.includes(parsed.protocol)) {
      issues.push({
        field: endpoint.field,
        severity: 'error',
        message: `${endpoint.label} must use ${endpoint.protocols.join(' or ')}.`,
      });
    }

    if (
      endpoint.defaultPath &&
      (!parsed.pathname ||
        parsed.pathname === '/' ||
        !parsed.pathname.startsWith(endpoint.defaultPath))
    ) {
      issues.push({
        field: endpoint.field,
        severity: 'warning',
        message: `${endpoint.label} usually starts with ${endpoint.defaultPath} for RelayForge deployments.`,
      });
    }

    if (!isLocalOrPrivateHostname(parsed.hostname) && parsed.protocol !== endpoint.secureProtocol) {
      issues.push({
        field: endpoint.field,
        severity: 'warning',
        message: `${endpoint.label} is using an insecure protocol for a non-local host.`,
      });
    }
  }

  const apiHost = parsedHosts.apiBaseUrl?.host;
  const mismatchedService = Object.entries(parsedHosts).find(
    ([field, parsed]) => field !== 'apiBaseUrl' && parsed && apiHost && parsed.host !== apiHost,
  );
  if (mismatchedService) {
    issues.push({
      field: mismatchedService[0] as ServerConnectionField,
      severity: 'warning',
      message:
        'This deployment uses multiple hosts. Make sure your API, media, realtime, and call services are all meant to be split.',
    });
  }

  return issues;
}

function inBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function emitChange() {
  if (!inBrowser()) return;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function parseStoredConnections(value: string | null): ServerConnection[] {
  if (!value) return [defaultConnection];
  try {
    const parsed = JSON.parse(value) as ServerConnection[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [defaultConnection];
    }
    return parsed
      .filter((item): item is ServerConnection =>
        Boolean(
          item &&
          item.id &&
          item.name &&
          item.apiBaseUrl &&
          item.wsUrl &&
          item.mediaBaseUrl &&
          item.livekitUrl,
        ),
      )
      .map((item) => ({
        ...normalizeServerConnection(item),
      }));
  } catch {
    return [defaultConnection];
  }
}

export function getServerConnections(): ServerConnection[] {
  if (!inBrowser()) return [defaultConnection];
  const parsed = parseStoredConnections(localStorage.getItem(CONNECTIONS_KEY));
  return parsed.length > 0 ? parsed : [defaultConnection];
}

export function getCurrentConnection(): ServerConnection {
  const connections = getServerConnections();
  if (!inBrowser()) return connections[0] ?? defaultConnection;

  const activeId = localStorage.getItem(ACTIVE_CONNECTION_KEY);
  return (
    connections.find((connection) => connection.id === activeId) ??
    connections[0] ??
    defaultConnection
  );
}

export function saveServerConnections(connections: ServerConnection[]) {
  if (!inBrowser()) return;
  const nextConnections = connections.length > 0 ? connections : [defaultConnection];
  localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(nextConnections));

  const activeId = localStorage.getItem(ACTIVE_CONNECTION_KEY);
  if (!activeId || !nextConnections.some((connection) => connection.id === activeId)) {
    localStorage.setItem(ACTIVE_CONNECTION_KEY, nextConnections[0].id);
  }
  emitChange();
}

export function setCurrentConnection(connectionId: string) {
  if (!inBrowser()) return;
  localStorage.setItem(ACTIVE_CONNECTION_KEY, connectionId);
  emitChange();
}

export function upsertServerConnection(connection: ServerConnection) {
  const connections = getServerConnections();
  const existingIndex = connections.findIndex((item) => item.id === connection.id);
  const nextConnections = [...connections];

  if (existingIndex >= 0) {
    nextConnections[existingIndex] = connection;
  } else {
    nextConnections.unshift(connection);
  }

  saveServerConnections(nextConnections);
  setCurrentConnection(connection.id);
}

export function deleteServerConnection(connectionId: string) {
  const nextConnections = getServerConnections().filter(
    (connection) => connection.id !== connectionId,
  );
  saveServerConnections(nextConnections);
}

function makeSnapshot() {
  return {
    connections: getServerConnections(),
    currentConnection: getCurrentConnection(),
  };
}

export function useServerConnections() {
  const [snapshot, setSnapshot] = React.useState(makeSnapshot);

  React.useEffect(() => {
    if (!inBrowser()) return;

    const sync = () => setSnapshot(makeSnapshot());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return snapshot;
}

export function createEmptyConnection(): ServerConnection {
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `connection-${Date.now()}`;

  return {
    id,
    name: 'New server',
    apiBaseUrl: defaultConnection.apiBaseUrl,
    wsUrl: defaultConnection.wsUrl,
    mediaBaseUrl: defaultConnection.mediaBaseUrl,
    livekitUrl: defaultConnection.livekitUrl,
  };
}
