import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner, useToast } from '@relayforge/ui';
import { ApiError } from '@relayforge/sdk';
import { useApi } from '@/hooks/useApi';
import { useAuthStore } from '@/stores/auth';
import { accessTokenHasRole } from '@/lib/authToken';

export function AdminPage() {
  const api = useApi();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [loading, setLoading] = React.useState(true);
  const [accessDenied, setAccessDenied] = React.useState(false);
  const [users, setUsers] = React.useState<Array<{ id: string; username: string; email: string }>>(
    [],
  );
  const [guilds, setGuilds] = React.useState<
    Array<{ id: string; name: string; memberCount: number }>
  >([]);

  const canAttemptAdminLoad = accessTokenHasRole(accessToken, 'admin');

  React.useEffect(() => {
    if (!canAttemptAdminLoad) {
      setAccessDenied(true);
      setLoading(false);
      return;
    }

    Promise.all([api.listAllUsers(), api.listAllGuilds()])
      .then(([usersRes, guildsRes]) => {
        setAccessDenied(false);
        setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
        setGuilds(Array.isArray(guildsRes.data) ? guildsRes.data : []);
      })
      .catch((error) => {
        if (error instanceof ApiError && error.status === 403) {
          setAccessDenied(true);
          return;
        }
        addToast('error', error instanceof Error ? error.message : 'Could not load admin data.');
      })
      .finally(() => setLoading(false));
  }, [addToast, api, canAttemptAdminLoad]);

  if (accessDenied) {
    return (
      <div className="bg-base flex min-h-screen items-center justify-center px-6">
        <div className="glass-panel w-full max-w-xl rounded-[28px] border border-[rgba(var(--rf-border),0.24)] p-8 text-center">
          <p className="text-text-primary text-2xl font-semibold">Admin access required</p>
          <p className="text-text-secondary mt-3 text-sm">
            This server has not granted your account the admin role needed to manage users and
            servers.
          </p>
          <div className="mt-6">
            <Button onClick={() => navigate('/')}>Back to app</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ambient-shell min-h-screen px-6 py-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="glass-panel flex items-center justify-between rounded-[28px] border border-[rgba(var(--rf-border),0.24)] px-6 py-5">
          <div>
            <p className="text-text-secondary text-xs uppercase tracking-[0.24em]">Control Room</p>
            <h1 className="text-text-primary mt-1 text-2xl font-semibold">Admin panel</h1>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            Back to app
          </Button>
        </div>

        {loading ? (
          <div className="apple-card flex flex-col items-center justify-center rounded-[28px] px-8 py-16 text-center">
            <Spinner size="lg" />
            <p className="text-text-primary mt-5 text-lg font-semibold tracking-[-0.02em]">
              Loading admin data
            </p>
            <p className="text-text-secondary mt-2 text-sm">
              Pulling the latest users and servers for review.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="glass-panel rounded-[28px] border border-[rgba(var(--rf-border),0.24)] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-text-primary text-lg font-semibold">Users</h2>
                <span className="text-text-secondary text-sm">{users.length} total</span>
              </div>
              {users.length === 0 ? (
                <div className="apple-card rounded-[24px] px-5 py-8 text-center">
                  <p className="text-text-primary text-base font-semibold tracking-[-0.02em]">
                    No users available
                  </p>
                  <p className="text-text-secondary mt-2 text-sm">
                    User records will appear here as accounts are created.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((account) => (
                    <div
                      key={account.id}
                      className="rounded-2xl border border-[rgba(var(--rf-border),0.24)] bg-[rgba(var(--rf-surface),0.62)] px-4 py-3 transition hover:-translate-y-0.5 hover:bg-[rgba(var(--rf-surface),0.78)]"
                    >
                      <p className="text-text-primary text-sm font-medium">{account.username}</p>
                      <p className="text-text-secondary mt-1 text-sm">{account.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="glass-panel rounded-[28px] border border-[rgba(var(--rf-border),0.24)] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-text-primary text-lg font-semibold">Servers</h2>
                <span className="text-text-secondary text-sm">{guilds.length} total</span>
              </div>
              {guilds.length === 0 ? (
                <div className="apple-card rounded-[24px] px-5 py-8 text-center">
                  <p className="text-text-primary text-base font-semibold tracking-[-0.02em]">
                    No servers available
                  </p>
                  <p className="text-text-secondary mt-2 text-sm">
                    Server records will appear here as communities are created.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {guilds.map((guild) => (
                    <div
                      key={guild.id}
                      className="rounded-2xl border border-[rgba(var(--rf-border),0.24)] bg-[rgba(var(--rf-surface),0.62)] px-4 py-3 transition hover:-translate-y-0.5 hover:bg-[rgba(var(--rf-surface),0.78)]"
                    >
                      <p className="text-text-primary text-sm font-medium">{guild.name}</p>
                      <p className="text-text-secondary mt-1 text-sm">
                        {guild.memberCount} members
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
