import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Input, Modal, Spinner, useTheme, useToast } from '@relayforge/ui';
import { useAuthStore } from '@/stores/auth';
import { useApi } from '@/hooks/useApi';
import { getCurrentConnection } from '@/lib/serverConnections';
import { MAX_UPLOAD_SIZE } from '@relayforge/config';
import { accessTokenHasRole } from '@/lib/authToken';

interface SessionView {
  id: string;
  title: string;
  subtitle: string;
  lastActiveAt: string;
  isMostRecent: boolean;
}

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
  const details = [summarizeUserAgent(userAgent), ipAddress ?? 'Unknown IP'].filter(Boolean);
  return details.join(' · ');
}

export function SettingsPage() {
  const navigate = useNavigate();
  const api = useApi();
  const { addToast } = useToast();
  const { user, logout, setUser } = useAuthStore();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { theme, setTheme } = useTheme();
  const themeMode = theme as string;
  const avatarInputRef = React.useRef<HTMLInputElement | null>(null);

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? '');
  const [sessions, setSessions] = useState<SessionView[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    let cancelled = false;

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
          addToast('error', 'Could not load your active sessions.');
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
  }, [addToast, api]);

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
      addToast('success', 'Profile saved successfully.');
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

  const handleSubmit2FA = async () => {
    if (!twoFactorCode.trim()) {
      addToast('error', 'Enter the 6-digit code from your authenticator app.');
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

  const openDisable2FA = () => {
    setTwoFactorMode('disable');
    setTwoFactorSecret('');
    setTwoFactorUrl('');
    setTwoFactorCode('');
    setTwoFactorOpen(true);
  };

  const handlePickAvatar = () => {
    avatarInputRef.current?.click();
  };

  const uploadImageFile = async (file: File) => {
    const mediaBaseUrl = getCurrentConnection().mediaBaseUrl;
    const presignResponse = await fetch(`${mediaBaseUrl}/media/upload/presign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        file_name: file.name,
        content_type: file.type,
        file_size: file.size,
      }),
    });

    if (!presignResponse.ok) {
      throw new Error('Could not prepare this upload.');
    }

    const presign = (await presignResponse.json()) as {
      upload_url: string;
      file_id: string;
      key: string;
    };

    const uploadResponse = await fetch(presign.upload_url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error('Could not upload this image.');
    }

    const completeResponse = await fetch(`${mediaBaseUrl}/media/upload/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        file_id: presign.file_id,
        key: presign.key,
        file_name: file.name,
        content_type: file.type,
        file_size: file.size,
      }),
    });

    if (!completeResponse.ok) {
      throw new Error('Could not finalize this upload.');
    }

    const completed = (await completeResponse.json()) as {
      proxy_url?: string;
      url?: string;
    };

    return completed.proxy_url ?? completed.url ?? `${mediaBaseUrl}/media/files/${presign.file_id}`;
  };

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('error', 'Please choose an image file.');
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      addToast('error', 'Please choose an image smaller than 25 MB.');
      return;
    }

    try {
      const uploadedAvatarUrl = await uploadImageFile(file);
      setAvatarUrl(uploadedAvatarUrl);
      const res = await api.updateMe({
        displayName: displayName.trim() || undefined,
        bio: bio.trim() || undefined,
        avatarUrl: uploadedAvatarUrl,
      });
      setUser({
        ...res.data,
        twoFactorEnabled,
      });
      addToast('success', 'Avatar updated.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load this image.';
      addToast('error', message);
    } finally {
      event.target.value = '';
    }
  };

  const handleCopyBackupCodes = async () => {
    if (backupCodes.length === 0) return;
    try {
      await navigator.clipboard.writeText(backupCodes.join('\n'));
      addToast('success', 'Backup codes copied.');
    } catch {
      addToast('error', 'Could not copy the backup codes.');
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Clearing local auth state still protects the current client session.
    }
    logout();
    navigate('/login');
  };

  return (
    <div className="ambient-shell relative flex h-screen flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-soft-float absolute left-[8%] top-[12%] h-56 w-56 rounded-full bg-[rgba(var(--rf-accent),0.12)] blur-3xl" />
        <div className="animate-soft-float absolute bottom-[12%] right-[10%] h-64 w-64 rounded-full bg-[rgba(123,92,255,0.10)] blur-3xl [animation-delay:1200ms]" />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-4 py-5">
        <div className="rf-floating-shell flex h-full min-h-0 w-full max-w-6xl flex-col overflow-hidden rounded-[34px]">
          <div className="flex items-center justify-between border-b border-[rgba(var(--rf-border),0.14)] px-6 py-5 backdrop-blur-xl">
            <div>
              <p className="text-text-secondary text-xs uppercase tracking-[0.24em]">
                Account Center
              </p>
              <h1 className="text-text-primary mt-1 text-2xl font-semibold">Settings</h1>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              aria-label="Back"
              title="Back"
              className="!min-h-11 !w-11 !rounded-full !p-0"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M15 18l-6-6 6-6"
                />
              </svg>
            </Button>
          </div>

          <div className="relative min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-5 sm:px-6">
            <div className="mx-auto grid max-w-6xl gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
              <aside className="rf-settings-card animate-fade-up h-fit rounded-[30px] p-5">
                <div>
                  <p className="text-text-primary text-lg font-semibold">Account</p>
                </div>

                <div className="mt-5 rounded-[24px] border border-[rgba(var(--rf-border),0.16)] bg-[rgba(var(--rf-base),0.2)] p-4">
                  <div className="mb-4 flex items-center gap-4">
                    <Avatar
                      src={avatarUrl || user?.avatarUrl}
                      name={user?.displayName ?? user?.username ?? ''}
                      size="xl"
                    />
                    <div>
                      <button
                        onClick={handlePickAvatar}
                        className="rounded-[16px] border border-[rgba(var(--rf-border),0.18)] bg-[rgba(var(--rf-surface),0.76)] px-3 py-2 text-sm font-medium text-[rgb(var(--rf-text-primary))] transition hover:bg-[rgba(var(--rf-elevated),0.72)]"
                      >
                        Upload avatar
                      </button>
                      <p className="mt-2 text-xs text-[rgb(var(--rf-text-secondary))]">
                        PNG, JPG, GIF, WebP
                      </p>
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/gif,image/webp,image/avif"
                        className="hidden"
                        onChange={handleAvatarFileChange}
                      />
                    </div>
                  </div>
                  <p className="text-text-secondary text-xs uppercase tracking-[0.18em]">
                    Username
                  </p>
                  <p className="text-text-primary mt-2 text-base font-semibold">{user?.username}</p>
                  <p className="text-text-secondary mt-2 text-sm">{user?.email}</p>
                </div>
              </aside>

              <div className="space-y-5">
                <section className="rf-settings-card animate-fade-up rounded-[30px] p-6">
                  <div className="flex flex-col gap-6">
                    <div>
                      <p className="text-text-primary text-lg font-semibold">Profile</p>
                    </div>

                    <div className="grid flex-1 gap-5 md:grid-cols-2">
                      <Input
                        label="Display name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="How people should see you"
                      />

                      <div className="md:col-span-2">
                        <label className="text-text-secondary mb-2 block text-xs uppercase tracking-[0.18em]">
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
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[rgba(var(--rf-border),0.24)] pt-4">
                    <div />
                    <Button
                      onClick={handleSaveProfile}
                      loading={saving}
                      disabled={!profileChanged}
                      aria-label="Save changes"
                      title="Save changes"
                      className="!min-h-11 !w-11 !rounded-full !p-0 text-lg transition-transform hover:-translate-y-0.5"
                    >
                      <span role="img" aria-hidden="true">
                        👍
                      </span>
                    </Button>
                  </div>
                </section>

                <div className="space-y-5">
                  <section className="rf-settings-card animate-fade-up rounded-[28px] p-6 [animation-delay:120ms]">
                    <div className="mb-4">
                      <p className="text-text-primary text-lg font-semibold">Security</p>
                    </div>

                    <div className="rf-control rounded-[22px] p-4">
                      <p className="text-text-secondary text-xs uppercase tracking-[0.18em]">
                        Status
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            twoFactorEnabled
                              ? 'bg-emerald-500 shadow-[0_0_12px_rgba(34,197,94,0.5)]'
                              : 'bg-[rgb(var(--rf-text-tertiary))]'
                          }`}
                        />
                        <p className="text-text-primary text-sm font-semibold">
                          {twoFactorEnabled ? 'Activate' : 'Available'}
                        </p>
                      </div>
                    </div>

                    <div className="rf-control mt-4 rounded-[22px] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-text-primary text-sm font-medium">Authenticator app</p>
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
                  </section>

                  <section className="rf-settings-card animate-fade-up rounded-[28px] p-6 [animation-delay:180ms]">
                    <div className="mb-4">
                      <p className="text-text-primary text-lg font-semibold">Appearance</p>
                    </div>

                    <div className="rf-control rounded-[22px] p-4">
                      <p className="text-text-secondary text-xs uppercase tracking-[0.18em]">
                        Theme
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() => setTheme('system' as never)}
                          aria-label="Follow system theme"
                          className={[
                            'flex h-12 w-12 items-center justify-center rounded-2xl border transition',
                            themeMode === 'system'
                              ? 'border-[rgba(var(--rf-accent),0.48)] ring-2 ring-[rgba(var(--rf-accent),0.24)]'
                              : 'border-[rgba(var(--rf-border),0.18)]',
                          ].join(' ')}
                          style={{
                            background: 'linear-gradient(180deg, rgb(80 89 148), rgb(43 45 49))',
                          }}
                        >
                          <svg
                            className="h-4.5 w-4.5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="M4 7h11m0 0-3-3m3 3-3 3M20 17H9m0 0 3-3m-3 3 3 3"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => setTheme('dark')}
                          aria-label="Use dark theme"
                          className={[
                            'h-12 w-12 rounded-2xl border transition',
                            theme === 'dark'
                              ? 'border-[rgba(var(--rf-accent),0.48)] ring-2 ring-[rgba(var(--rf-accent),0.24)]'
                              : 'border-[rgba(var(--rf-border),0.18)]',
                          ].join(' ')}
                          style={{
                            background: 'linear-gradient(180deg, rgb(43 45 49), rgb(30 31 34))',
                          }}
                        />
                        <button
                          onClick={() => setTheme('light')}
                          aria-label="Use light theme"
                          className={[
                            'h-12 w-12 rounded-2xl border transition',
                            theme === 'light'
                              ? 'border-[rgba(var(--rf-accent),0.48)] ring-2 ring-[rgba(var(--rf-accent),0.24)]'
                              : 'border-[rgba(var(--rf-border),0.18)]',
                          ].join(' ')}
                          style={{
                            background:
                              'linear-gradient(180deg, rgb(255 255 255), rgb(235 237 240))',
                          }}
                        />
                      </div>
                    </div>
                  </section>
                </div>

                <section className="rf-settings-card animate-fade-up rounded-[28px] p-6 [animation-delay:240ms]">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-text-primary text-lg font-semibold">Sessions</p>
                      <p className="text-text-secondary mt-1 text-sm">
                        Monitor where your account is active and revoke stale sign-ins.
                      </p>
                    </div>
                  </div>

                  {sessionsLoading ? (
                    <div className="flex justify-center py-10">
                      <Spinner size="md" />
                    </div>
                  ) : sessions.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[rgba(var(--rf-border),0.28)] bg-[rgba(var(--rf-surface),0.58)] px-4 py-10 text-center">
                      <p className="text-text-primary text-sm font-medium">
                        No active sessions found
                      </p>
                      <p className="text-text-secondary mt-1 text-sm">
                        Once another device signs in, it will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sessions.map((session) => (
                        <div key={session.id} className="rf-control rounded-[22px] px-4 py-4">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-text-primary flex items-center gap-2 text-sm font-medium">
                                {session.title}
                                {session.isMostRecent && (
                                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-500">
                                    Most recent
                                  </span>
                                )}
                              </p>
                              <p className="text-text-secondary mt-1 text-sm">{session.subtitle}</p>
                              <p className="text-text-secondary mt-2 text-xs">
                                Last active {new Date(session.lastActiveAt).toLocaleString()}
                              </p>
                            </div>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleRevokeSession(session.id)}
                            >
                              Revoke
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <div className="flex justify-center pb-4">
                  <div className="flex flex-wrap justify-center gap-3">
                    {accessTokenHasRole(accessToken, 'admin') && (
                      <Button variant="secondary" onClick={() => navigate('/admin')}>
                        Open admin panel
                      </Button>
                    )}
                    <Button variant="danger" onClick={() => void handleLogout()}>
                      Log out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={twoFactorOpen}
        onClose={() => setTwoFactorOpen(false)}
        title={
          twoFactorMode === 'setup'
            ? 'Set up two-factor authentication'
            : 'Disable two-factor authentication'
        }
        size="md"
      >
        <div className="space-y-4">
          {twoFactorMode === 'setup' ? (
            <>
              <p className="text-text-secondary text-sm">
                Add the secret below to your authenticator app, then enter the 6-digit code to
                verify setup.
              </p>
              <div className="rounded-2xl border border-[rgba(var(--rf-border),0.28)] bg-[rgba(var(--rf-surface),0.68)] p-4">
                <p className="text-text-secondary text-xs uppercase tracking-[0.18em]">Secret</p>
                <p className="text-text-primary mt-2 break-all font-mono text-sm">
                  {twoFactorSecret}
                </p>
              </div>
              <div className="rounded-2xl border border-[rgba(var(--rf-border),0.28)] bg-[rgba(var(--rf-surface),0.68)] p-4">
                <p className="text-text-secondary text-xs uppercase tracking-[0.18em]">OTP URL</p>
                <p className="text-text-primary mt-2 break-all text-sm">{twoFactorUrl}</p>
              </div>
            </>
          ) : (
            <p className="text-text-secondary text-sm">
              Enter a fresh code from your authenticator app to confirm disabling 2FA. Backup codes
              work here too.
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
              onClick={handleSubmit2FA}
              loading={twoFactorSubmitting}
              className="!bg-accent hover:!bg-accent-hover"
            >
              {twoFactorMode === 'setup' ? 'Verify and enable' : 'Disable 2FA'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={backupCodesOpen}
        onClose={() => setBackupCodesOpen(false)}
        title="Save your backup codes"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            These one-time codes let you recover access if your authenticator app is unavailable.
            Store them somewhere safe before closing this dialog.
          </p>

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
              Copy codes
            </Button>
            <Button onClick={() => setBackupCodesOpen(false)}>Done</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
