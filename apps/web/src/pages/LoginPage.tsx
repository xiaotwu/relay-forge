import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Button, Input } from '@relayforge/ui';
import { useAuthStore } from '@/stores/auth';
import { ServerConnectionModal } from '@/components/ServerConnectionModal';

const relayForgeIconSrc = '/branding/relay-forge-icon.png';

export function LoginPage() {
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [connectionsOpen, setConnectionsOpen] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password, twoFactorCode.trim() || undefined);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      if (message.toLowerCase().includes('two-factor')) {
        setShowTwoFactor(true);
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-soft-float absolute left-[12%] top-[16%] h-40 w-40 rounded-full bg-[rgba(var(--rf-accent),0.12)] blur-3xl" />
        <div className="animate-soft-float absolute bottom-[14%] right-[10%] h-52 w-52 rounded-full bg-[rgba(56,189,248,0.10)] blur-3xl [animation-delay:800ms]" />
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
              Welcome back
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

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
              autoComplete="current-password"
            />

            {showTwoFactor && (
              <Input
                label="Authenticator or backup code"
                name="twoFactorCode"
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                autoComplete="one-time-code"
                inputMode="numeric"
              />
            )}

            {!showTwoFactor && (
              <button
                type="button"
                onClick={() => setShowTwoFactor(true)}
                className="text-accent hover:text-accent-light text-sm font-medium transition-colors"
              >
                Sign in with an authenticator or backup code
              </button>
            )}

            <Button
              type="submit"
              fullWidth
              loading={loading}
              className="h-12 shadow-[0_18px_34px_rgba(var(--rf-accent),0.26)]"
              aria-label="Sign in"
            >
              <span role="img" aria-hidden="true">
                ➡️
              </span>
            </Button>
          </form>

          <p className="text-text-secondary mt-6 text-center text-sm">
            <Link
              to="/forgot-password"
              className="text-accent hover:text-accent-light font-medium transition-colors"
            >
              Forgot your password?
            </Link>
          </p>

          <p className="text-text-secondary mt-2 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-accent hover:text-accent-light font-medium transition-colors"
            >
              Create one
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
