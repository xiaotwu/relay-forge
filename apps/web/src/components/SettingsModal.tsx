import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Input, Modal, Spinner, useTheme, useToast } from '@relayforge/ui';
import { useApi } from '@/hooks/useApi';
import { accessTokenHasRole } from '@/lib/authToken';
import { useAuthStore } from '@/stores/auth';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

interface SessionView {
  id: string;
  title: string;
  subtitle: string;
  lastActiveAt: string;
  isMostRecent: boolean;
}

type SettingsTab = 'account' | 'profile' | 'appearance' | 'security' | 'devices' | 'advanced';

const settingsTabs: Array<{ id: SettingsTab; label: string }> = [
  { id: 'account', label: 'Account' },
  { id: 'profile', label: 'Profile' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'security', label: 'Security' },
  { id: 'devices', label: 'Devices' },
  { id: 'advanced', label: 'Advanced' },
];

function summarizeUserAgent(userAgent?: string | null): string {
  if (!userAgent) return 'Unknown device';
  const value = userAgent.toLowerCase();

  const browser = value.includes('firefox')
    ? 'Firefox'
    : value.includes('edg')
      ? 'Edge'
      : value.includes('chrome')
        ? 'Chrome'
        : value.includes('safari')
          ? 'Safari'
          : 'Browser';

  const os = value.includes('mac os')
    ? 'macOS'
    : value.includes('windows')
      ? 'Windows'
      : value.includes('iphone') || value.includes('ios')
        ? 'iOS'
        : value.includes('android')
          ? 'Android'
          : value.includes('linux')
            ? 'Linux'
            : 'Unknown OS';

  return `${browser} on ${os}`;
}

function formatSessionSubtitle(userAgent?: string | null, ipAddress?: string | null): string {
  return [summarizeUserAgent(userAgent), ipAddress ?? 'Unknown IP'].filter(Boolean).join(' - ');
}

function ThemeSwatch({
  active,
  label,
  onClick,
  style,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  style: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={[
        'h-12 w-12 rounded-[18px] border transition hover:-translate-y-0.5',
        active
          ? 'border-[rgba(var(--rf-accent),0.56)] ring-2 ring-[rgba(var(--rf-accent),0.24)]'
          : 'border-[rgba(var(--rf-border),0.22)]',
      ].join(' ')}
      style={style}
    />
  );
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const navigate = useNavigate();
  const api = useApi();
  const { addToast } = useToast();
  const { user, logout, setUser } = useAuthStore();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { theme, setTheme } = useTheme();
  const themeMode = theme as string;

  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');
  const [saving, setSaving] = useState(false);
  const [sessions, setSessions] = useState<SessionView[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(Boolean(user?.twoFactorEnabled));
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);
  const [twoFactorMode, setTwoFactorMode] = useState<'setup' | 'disable'>('setup');
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [twoFactorUrl, setTwoFactorUrl] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorSubmitting, setTwoFactorSubmitting] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [backupCodesOpen, setBackupCodesOpen] = useState(false);

  useEffect(() => {
    setDisplayName(user?.displayName ?? '');
    setBio(user?.bio ?? '');
    setAvatarUrl(user?.avatarUrl ?? '');
    setTwoFactorEnabled(Boolean(user?.twoFactorEnabled));
  }, [user]);

  useEffect(() => {
    if (!open) {
      setTwoFactorOpen(false);
      setBackupCodesOpen(false);
      return;
    }

    let cancelled = false;
    setSessionsLoading(true);

    api
      .listSessions()
      .then((res) => {
        if (cancelled) return;
        const raw = Array.isArray(res.data) ? res.data : [];
        setSessions(
          raw.map((session, index) => ({
            id: session.id,
            title: summarizeUserAgent(session.userAgent),
            subtitle: formatSessionSubtitle(session.userAgent, session.ipAddress),
            lastActiveAt: session.lastActiveAt,
            isMostRecent: index === 0,
          })),
        );
      })
      .catch(() => {
        if (!cancelled) {
          setSessions([]);
          addToast('error', 'Could not load active sessions.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setSessionsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [addToast, api, open]);

  const profileChanged = useMemo(
    () =>
      displayName !== (user?.displayName ?? '') ||
      bio !== (user?.bio ?? '') ||
      avatarUrl !== (user?.avatarUrl ?? ''),
    [avatarUrl, bio, displayName, user?.avatarUrl, user?.bio, user?.displayName],
  );

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.updateMe({
        displayName: displayName.trim() || undefined,
        bio: bio.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
      });
      setUser({
        ...res.data,
        twoFactorEnabled,
      });
      addToast('success', 'Profile saved.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not save your profile.';
      addToast('error', message);
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await api.revokeSession(sessionId);
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));
      addToast('success', 'Session revoked.');
    } catch {
      addToast('error', 'Could not revoke that session.');
    }
  };

  const handleStart2FA = async () => {
    try {
      const res = await api.enable2FA();
      setTwoFactorMode('setup');
      setTwoFactorSecret(res.data.secret);
      setTwoFactorUrl((res.data as { url?: string }).url ?? '');
      setTwoFactorCode('');
      setTwoFactorOpen(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not start 2FA setup.';
      addToast('error', message);
    }
  };

  const openDisable2FA = () => {
    setTwoFactorMode('disable');
    setTwoFactorSecret('');
    setTwoFactorUrl('');
    setTwoFactorCode('');
    setTwoFactorOpen(true);
  };

  const handleSubmit2FA = async () => {
    if (!twoFactorCode.trim()) {
      addToast('error', 'Enter the verification code.');
      return;
    }

    setTwoFactorSubmitting(true);
    try {
      if (twoFactorMode === 'setup') {
        const response = await api.verify2FA(twoFactorCode.trim());
        setTwoFactorEnabled(true);
        setUser(user ? { ...user, twoFactorEnabled: true } : user);
        const nextBackupCodes = Array.isArray(response.data.backupCodes)
          ? response.data.backupCodes
          : [];
        setBackupCodes(nextBackupCodes);
        setBackupCodesOpen(nextBackupCodes.length > 0);
        addToast('success', 'Two-factor authentication enabled.');
      } else {
        await api.disable2FA(twoFactorCode.trim());
        setTwoFactorEnabled(false);
        setUser(user ? { ...user, twoFactorEnabled: false } : user);
        addToast('success', 'Two-factor authentication disabled.');
      }
      setTwoFactorOpen(false);
      setTwoFactorCode('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not update 2FA.';
      addToast('error', message);
    } finally {
      setTwoFactorSubmitting(false);
    }
  };

  const handleCopyBackupCodes = async () => {
    if (backupCodes.length === 0) return;
    try {
      await navigator.clipboard.writeText(backupCodes.join('\n'));
      addToast('success', 'Backup codes copied.');
    } catch {
      addToast('error', 'Could not copy backup codes.');
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Local logout still clears this client if the network request fails.
    }
    logout();
    onClose();
    navigate('/login');
  };

  const openAdmin = () => {
    onClose();
    navigate('/admin');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-4">
            <div className="rf-settings-card rounded-[26px] p-5">
              <div className="flex items-center gap-4">
                <Avatar
                  src={avatarUrl || user?.avatarUrl}
                  name={user?.displayName ?? user?.username ?? ''}
                  size="xl"
                  status={user?.status ?? 'online'}
                />
                <div className="min-w-0">
                  <p className="truncate text-lg font-semibold text-[rgb(var(--rf-text-primary))]">
                    {user?.displayName || user?.username || 'You'}
                  </p>
                  <p className="truncate text-sm text-[rgb(var(--rf-text-secondary))]">
                    @{user?.username}
                  </p>
                  <p className="truncate text-sm text-[rgb(var(--rf-text-tertiary))]">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="rf-settings-card rounded-[26px] p-5">
              <p className="text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                Account state
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm text-[rgb(var(--rf-text-secondary))]">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(34,197,94,0.45)]" />
                Signed in and synced
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="rf-settings-card rounded-[26px] p-5">
            <div className="grid gap-4">
              <Input
                label="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How people should see you"
              />
              <Input
                label="Avatar URL"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-[rgb(var(--rf-text-secondary))]">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="..."
                  rows={4}
                  className="rf-textarea"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  loading={saving}
                  disabled={!profileChanged}
                  aria-label="Save profile"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="rf-settings-card rounded-[26px] p-5">
            <p className="text-sm font-semibold text-[rgb(var(--rf-text-primary))]">Theme</p>
            <p className="mt-1 text-sm text-[rgb(var(--rf-text-secondary))]">
              Choose the surface tone for RelayForge.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <ThemeSwatch
                active={themeMode === 'system'}
                label="Follow system theme"
                onClick={() => setTheme('system' as never)}
                style={{ background: 'linear-gradient(180deg, rgb(80 89 148), rgb(43 45 49))' }}
              />
              <ThemeSwatch
                active={theme === 'dark'}
                label="Use dark theme"
                onClick={() => setTheme('dark')}
                style={{ background: 'linear-gradient(180deg, rgb(43 45 49), rgb(30 31 34))' }}
              />
              <ThemeSwatch
                active={theme === 'light'}
                label="Use light theme"
                onClick={() => setTheme('light')}
                style={{
                  background: 'linear-gradient(180deg, rgb(255 255 255), rgb(235 237 240))',
                }}
              />
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-4">
            <div className="rf-settings-card rounded-[26px] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                    Two-factor authentication
                  </p>
                  <p className="mt-1 text-sm text-[rgb(var(--rf-text-secondary))]">
                    {twoFactorEnabled ? 'Enabled' : 'Available'}
                  </p>
                </div>
                <Button
                  variant={twoFactorEnabled ? 'danger' : 'secondary'}
                  size="sm"
                  onClick={twoFactorEnabled ? openDisable2FA : handleStart2FA}
                >
                  {twoFactorEnabled ? 'Disable' : 'Set up'}
                </Button>
              </div>
            </div>
          </div>
        );

      case 'devices':
        return (
          <div className="rf-settings-card rounded-[26px] p-5">
            {sessionsLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="md" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="rf-empty-state rounded-[22px] px-4 py-5 text-center">
                <p className="text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                  No sessions
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-[22px] border border-[rgba(var(--rf-border),0.18)] bg-[rgba(var(--rf-surface),0.58)] px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                          {session.title}
                        </p>
                        <p className="mt-1 truncate text-sm text-[rgb(var(--rf-text-secondary))]">
                          {session.subtitle}
                        </p>
                        <p className="mt-1 text-xs text-[rgb(var(--rf-text-tertiary))]">
                          {session.isMostRecent ? 'Most recent - ' : ''}
                          {new Date(session.lastActiveAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => void handleRevokeSession(session.id)}
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-4">
            {accessTokenHasRole(accessToken, 'admin') && (
              <div className="rf-settings-card rounded-[26px] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                      Admin console
                    </p>
                    <p className="mt-1 text-sm text-[rgb(var(--rf-text-secondary))]">
                      Operational controls and moderation.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={openAdmin}>
                    Open
                  </Button>
                </div>
              </div>
            )}
            <div className="rf-settings-card rounded-[26px] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                    Sign out
                  </p>
                  <p className="mt-1 text-sm text-[rgb(var(--rf-text-secondary))]">
                    End this device session.
                  </p>
                </div>
                <Button variant="danger" size="sm" onClick={() => void handleLogout()}>
                  Log out
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose} title="Settings" size="lg">
        <div className="-mx-6 -my-5 flex max-h-[76vh] min-h-[520px] flex-col overflow-hidden">
          <div className="border-b border-[rgba(var(--rf-border),0.14)] px-4 py-3">
            <div className="scrollbar-thin flex gap-1 overflow-x-auto rounded-[20px] bg-[rgba(var(--rf-base),0.28)] p-1">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={[
                    'rf-settings-tab relative shrink-0 rounded-[16px] px-3 py-2 text-sm font-semibold',
                    activeTab === tab.id
                      ? 'is-active bg-[rgba(var(--rf-accent),0.34)] text-white shadow-[0_8px_18px_rgba(var(--rf-accent),0.14)]'
                      : '',
                  ].join(' ')}
                >
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <span className="absolute inset-x-3 bottom-1 h-0.5 rounded-full bg-[rgb(var(--rf-accent-light))]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <div className="animate-fade-scale">{renderContent()}</div>
          </div>
        </div>
      </Modal>

      <Modal
        open={open && twoFactorOpen}
        onClose={() => setTwoFactorOpen(false)}
        title={twoFactorMode === 'setup' ? 'Set up 2FA' : 'Disable 2FA'}
        size="md"
      >
        <div className="space-y-4">
          {twoFactorMode === 'setup' ? (
            <>
              <p className="text-text-secondary text-sm">
                Add this secret to your authenticator, then enter the code.
              </p>
              <div className="rounded-2xl border border-[rgba(var(--rf-border),0.28)] bg-[rgba(var(--rf-surface),0.68)] p-4">
                <p className="text-text-secondary text-xs uppercase tracking-[0.18em]">Secret</p>
                <p className="text-text-primary mt-2 break-all font-mono text-sm">
                  {twoFactorSecret}
                </p>
              </div>
              {twoFactorUrl && (
                <div className="rounded-2xl border border-[rgba(var(--rf-border),0.28)] bg-[rgba(var(--rf-surface),0.68)] p-4">
                  <p className="text-text-secondary text-xs uppercase tracking-[0.18em]">OTP URL</p>
                  <p className="text-text-primary mt-2 break-all text-sm">{twoFactorUrl}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-text-secondary text-sm">
              Enter a fresh authenticator or backup code to confirm.
            </p>
          )}

          <Input
            label="Verification code"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
            placeholder="123456"
          />

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setTwoFactorOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => void handleSubmit2FA()}
              loading={twoFactorSubmitting}
              variant={twoFactorMode === 'setup' ? 'primary' : 'danger'}
            >
              {twoFactorMode === 'setup' ? 'Verify' : 'Disable'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={open && backupCodesOpen}
        onClose={() => setBackupCodesOpen(false)}
        title="Backup codes"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">Save these one-time recovery codes.</p>
          <div className="grid gap-2 rounded-2xl border border-[rgba(var(--rf-border),0.28)] bg-[rgba(var(--rf-surface),0.68)] p-4 sm:grid-cols-2">
            {backupCodes.map((code) => (
              <div
                key={code}
                className="text-text-primary rounded-xl bg-[rgba(var(--rf-base),0.36)] px-3 py-2 font-mono text-sm"
              >
                {code}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => void handleCopyBackupCodes()}>
              Copy
            </Button>
            <Button onClick={() => setBackupCodesOpen(false)}>Done</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
