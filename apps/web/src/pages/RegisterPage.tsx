import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Button, Input } from '@relayforge/ui';
import { useAuthStore } from '@/stores/auth';
import { ServerConnectionModal } from '@/components/ServerConnectionModal';

const relayForgeIconSrc = '/branding/relay-forge-icon.png';

export function RegisterPage() {
  const { register, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [connectionsOpen, setConnectionsOpen] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-soft-float absolute left-[10%] top-[14%] h-44 w-44 rounded-full bg-[rgba(var(--rf-accent),0.10)] blur-3xl" />
        <div className="animate-soft-float absolute bottom-[16%] right-[12%] h-56 w-56 rounded-full bg-[rgba(56,189,248,0.09)] blur-3xl [animation-delay:900ms]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rf-floating-shell animate-fade-scale rounded-[36px] p-8">
          <div className="mb-8 text-center">
            <img
              src={relayForgeIconSrc}
              alt="RelayForge"
              className="mx-auto mb-5 h-20 w-20 rounded-[28px] border border-black/5 bg-white object-cover shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
            />
            <p className="text-text-secondary text-[11px] font-semibold uppercase tracking-[0.28em]">
              RelayForge
            </p>
            <h1 className="text-text-primary mt-3 text-[34px] font-semibold tracking-[-0.05em]">
              Create account
            </h1>
            <p className="text-text-secondary mt-2 text-sm leading-6">
              Set up your identity once, then move between servers, DMs, and calls seamlessly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <Input
              label="Username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <Input
              label="Confirm password"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              className="h-12 shadow-[0_18px_34px_rgba(var(--rf-accent),0.26)]"
            >
              Create account
            </Button>
          </form>

          <p className="text-text-secondary mt-6 text-center text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-accent hover:text-accent-light font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setConnectionsOpen(true)}
        className="rf-control fixed bottom-5 right-5 z-20 flex h-12 w-12 items-center justify-center rounded-full text-[rgb(var(--rf-text-primary))] shadow-[0_18px_42px_rgba(var(--rf-shadow-color),0.18)]"
        title="Server settings"
        aria-label="Server settings"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M10.325 4.317a1.724 1.724 0 013.35 0 1.724 1.724 0 002.573 1.066 1.724 1.724 0 012.898 1.675 1.724 1.724 0 001.066 2.573 1.724 1.724 0 010 3.35 1.724 1.724 0 00-1.066 2.573 1.724 1.724 0 01-2.898 1.675 1.724 1.724 0 00-2.573 1.066 1.724 1.724 0 01-3.35 0 1.724 1.724 0 00-2.573-1.066 1.724 1.724 0 01-2.898-1.675 1.724 1.724 0 00-1.066-2.573 1.724 1.724 0 010-3.35 1.724 1.724 0 001.066-2.573 1.724 1.724 0 012.898-1.675 1.724 1.724 0 002.573-1.066z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>

      <ServerConnectionModal open={connectionsOpen} onClose={() => setConnectionsOpen(false)} />
    </div>
  );
}
