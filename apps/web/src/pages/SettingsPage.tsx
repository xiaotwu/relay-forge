import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Avatar, Spinner } from '@relayforge/ui';
import { useAuthStore } from '@/stores/auth';
import { useApi } from '@/hooks/useApi';
import type { Session } from '@relayforge/types';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const api = useApi();

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    api
      .listSessions()
      .then((res) => setSessions(res.data))
      .catch(() => {})
      .finally(() => setSessionsLoading(false));
  }, [api]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.updateMe({ displayName, bio: bio || undefined });
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await api.revokeSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch {
      // handle error
    }
  };

  const handleEnable2FA = async () => {
    try {
      const res = await api.enable2FA();
      alert(
        `2FA Setup - Scan QR code: ${res.data.qrCodeUrl}\nBackup codes: ${res.data.backupCodes.join(', ')}`,
      );
    } catch {
      // handle error
    }
  };

  return (
    <div className="bg-base min-h-screen">
      {/* Top bar */}
      <div className="bg-surface border-border/20 flex items-center justify-between border-b px-6 py-4">
        <h1 className="text-text-primary text-lg font-semibold">Settings</h1>
        <Button variant="ghost" onClick={() => navigate('/')}>
          Back to chat
        </Button>
      </div>

      <div className="mx-auto max-w-2xl space-y-8 px-4 py-8">
        {/* Profile section */}
        <section className="bg-surface rounded-xl p-6">
          <h2 className="text-text-primary mb-6 text-base font-semibold">Profile</h2>
          <div className="mb-6 flex items-start gap-6">
            <Avatar
              src={user?.avatarUrl}
              name={user?.displayName ?? user?.username ?? ''}
              size="xl"
            />
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-text-secondary mb-1 text-xs">Username</p>
                <p className="text-text-primary text-sm font-medium">{user?.username}</p>
              </div>
              <Input
                label="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display name"
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-300">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell people about yourself"
                  rows={3}
                  className="bg-elevated border-border/30 text-text-primary placeholder:text-text-secondary/50 focus:ring-accent/50 w-full resize-none rounded-lg border px-3.5 py-2 text-sm focus:outline-none focus:ring-2"
                />
              </div>
              <Button
                onClick={handleSaveProfile}
                loading={saving}
                className="!bg-accent hover:!bg-accent-hover"
              >
                Save changes
              </Button>
            </div>
          </div>
        </section>

        {/* Security section */}
        <section className="bg-surface rounded-xl p-6">
          <h2 className="text-text-primary mb-4 text-base font-semibold">Security</h2>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-text-primary text-sm font-medium">Two-factor authentication</p>
              <p className="text-text-secondary mt-0.5 text-xs">
                {user?.twoFactorEnabled ? 'Enabled' : 'Add an extra layer of security'}
              </p>
            </div>
            <Button
              variant={user?.twoFactorEnabled ? 'danger' : 'secondary'}
              size="sm"
              onClick={handleEnable2FA}
            >
              {user?.twoFactorEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </section>

        {/* Sessions section */}
        <section className="bg-surface rounded-xl p-6">
          <h2 className="text-text-primary mb-4 text-base font-semibold">Sessions</h2>
          {sessionsLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="md" />
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-elevated flex items-center justify-between rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="text-text-primary flex items-center gap-2 text-sm font-medium">
                      {session.device.browser ?? session.device.os}
                      {session.current && (
                        <span className="bg-accent/20 text-accent rounded-full px-2 py-0.5 text-xs">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="text-text-secondary mt-0.5 text-xs">
                      {session.device.os} &middot; {session.ipAddress} &middot; Last active{' '}
                      {new Date(session.lastActiveAt).toLocaleDateString()}
                    </p>
                  </div>
                  {!session.current && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRevokeSession(session.id)}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
              {sessions.length === 0 && (
                <p className="text-text-secondary py-4 text-center text-sm">No active sessions</p>
              )}
            </div>
          )}
        </section>

        {/* Appearance section */}
        <section className="bg-surface rounded-xl p-6">
          <h2 className="text-text-primary mb-4 text-base font-semibold">Appearance</h2>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-text-primary text-sm font-medium">Theme</p>
              <p className="text-text-secondary mt-0.5 text-xs">Choose your preferred theme</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative h-6 w-12 rounded-full transition-colors ${
                darkMode ? 'bg-accent' : 'bg-elevated'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Logout */}
        <div className="flex justify-center pb-8">
          <Button
            variant="danger"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}
