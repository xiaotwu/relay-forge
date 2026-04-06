import React from 'react';
import { Button, Input, Modal } from '@relayforge/ui';
import {
  createEmptyConnection,
  deleteServerConnection,
  getCurrentConnection,
  normalizeServerConnection,
  type ServerConnection,
  validateServerConnection,
  upsertServerConnection,
  useServerConnections,
} from '@/lib/serverConnections';

interface ServerConnectionModalProps {
  open: boolean;
  onClose: () => void;
}

function cloneConnection(connection: ServerConnection): ServerConnection {
  return { ...connection };
}

export function ServerConnectionModal({ open, onClose }: ServerConnectionModalProps) {
  const { connections, currentConnection } = useServerConnections();
  const [selectedId, setSelectedId] = React.useState(currentConnection.id);
  const [draft, setDraft] = React.useState<ServerConnection>(cloneConnection(currentConnection));
  const [checking, setChecking] = React.useState(false);
  const [checkStatus, setCheckStatus] = React.useState<string | null>(null);
  const normalizedDraft = React.useMemo(() => normalizeServerConnection(draft), [draft]);
  const validationIssues = React.useMemo(() => validateServerConnection(draft), [draft]);
  const validationErrors = validationIssues.filter((issue) => issue.severity === 'error');
  const validationWarnings = validationIssues.filter((issue) => issue.severity === 'warning');

  React.useEffect(() => {
    if (!open) return;
    setSelectedId(currentConnection.id);
    setDraft(cloneConnection(currentConnection));
    setCheckStatus(null);
  }, [currentConnection, open]);

  const handleSelect = (connection: ServerConnection) => {
    setSelectedId(connection.id);
    setDraft(cloneConnection(connection));
  };

  const handleNew = () => {
    const next = createEmptyConnection();
    setSelectedId(next.id);
    setDraft(next);
  };

  const handleSave = () => {
    if (validationErrors.length > 0) {
      setCheckStatus(validationErrors[0].message);
      return;
    }

    upsertServerConnection({
      ...normalizedDraft,
      name: normalizedDraft.name || 'Unnamed server',
    });
    onClose();
  };

  const handleCheck = async () => {
    if (validationErrors.length > 0) {
      setCheckStatus(validationErrors[0].message);
      return;
    }

    setChecking(true);
    setCheckStatus(null);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 6000);

    try {
      const url = new URL(normalizedDraft.apiBaseUrl);
      url.pathname = '/healthz';
      url.search = '';
      const response = await fetch(url.toString(), { method: 'GET', signal: controller.signal });
      setCheckStatus(
        response.ok ? 'Connection looks healthy.' : `Connection failed (${response.status}).`,
      );
    } catch (error) {
      setCheckStatus(
        error instanceof DOMException && error.name === 'AbortError'
          ? 'Connection check timed out.'
          : 'Connection failed.',
      );
    } finally {
      window.clearTimeout(timeout);
      setChecking(false);
    }
  };

  const handleDelete = () => {
    if (connections.length <= 1 || !connections.some((connection) => connection.id === selectedId))
      return;
    deleteServerConnection(selectedId);
    const fallback = getCurrentConnection();
    setSelectedId(fallback.id);
    setDraft(cloneConnection(fallback));
  };

  const selectedSavedConnection =
    connections.find((connection) => connection.id === selectedId) ?? null;
  const isExisting = selectedSavedConnection !== null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Server connections"
      size="lg"
      actions={
        <>
          {isExisting && connections.length > 1 && (
            <Button variant="ghost" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={() => void handleCheck()} loading={checking}>
            Check
          </Button>
          <Button onClick={handleSave} aria-label="Save connection">
            <span role="img" aria-hidden="true">
              👍
            </span>
          </Button>
        </>
      }
    >
      <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
        <div className="space-y-3">
          <button
            onClick={handleNew}
            className="rf-control flex w-full items-center justify-between rounded-[20px] px-4 py-3 text-left text-sm font-medium text-[rgb(var(--rf-text-primary))]"
          >
            <span>Add server</span>
            <span className="text-lg leading-none">+</span>
          </button>

          <div className="space-y-2">
            {connections.map((connection) => {
              const selected = connection.id === selectedId;
              const active = connection.id === currentConnection.id;
              return (
                <button
                  key={connection.id}
                  onClick={() => handleSelect(connection)}
                  className={[
                    'w-full rounded-[22px] border px-4 py-3 text-left transition',
                    selected
                      ? 'border-[rgba(var(--rf-accent),0.42)] bg-[rgba(var(--rf-accent),0.14)]'
                      : 'border-[rgba(var(--rf-border),0.14)] bg-[rgba(var(--rf-base),0.24)] hover:bg-[rgba(var(--rf-base),0.32)]',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                      {connection.name}
                    </p>
                    {active && (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-500">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-xs text-[rgb(var(--rf-text-secondary))]">
                    {connection.apiBaseUrl}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[18px] border border-[rgba(var(--rf-border),0.16)] bg-[rgba(var(--rf-base),0.2)] px-4 py-3 text-sm text-[rgb(var(--rf-text-secondary))]">
            Use full service URLs for this deployment. RelayForge usually expects an API base URL
            that ends with <code>/api/v1</code> and a websocket endpoint that ends with{' '}
            <code>/ws</code>.
          </div>

          {checkStatus && (
            <div className="rounded-[18px] border border-[rgba(var(--rf-border),0.16)] bg-[rgba(var(--rf-base),0.24)] px-4 py-3 text-sm text-[rgb(var(--rf-text-secondary))]">
              {checkStatus}
            </div>
          )}

          {validationErrors.length > 0 && (
            <div className="rounded-[18px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {validationErrors.map((issue) => (
                <p key={`${issue.field}-${issue.message}`}>{issue.message}</p>
              ))}
            </div>
          )}

          {validationWarnings.length > 0 && (
            <div className="rounded-[18px] border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-600">
              {validationWarnings.map((issue) => (
                <p key={`${issue.field}-${issue.message}`}>{issue.message}</p>
              ))}
            </div>
          )}

          <Input
            label="Connection name"
            value={draft.name}
            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
          />

          <Input
            label="API base URL"
            value={draft.apiBaseUrl}
            onChange={(event) =>
              setDraft((current) => ({ ...current, apiBaseUrl: event.target.value }))
            }
          />

          <Input
            label="Realtime WebSocket URL"
            value={draft.wsUrl}
            onChange={(event) => setDraft((current) => ({ ...current, wsUrl: event.target.value }))}
          />

          <Input
            label="Media service URL"
            value={draft.mediaBaseUrl}
            onChange={(event) =>
              setDraft((current) => ({ ...current, mediaBaseUrl: event.target.value }))
            }
          />

          <Input
            label="LiveKit URL"
            value={draft.livekitUrl}
            onChange={(event) =>
              setDraft((current) => ({ ...current, livekitUrl: event.target.value }))
            }
          />
        </div>
      </div>
    </Modal>
  );
}
