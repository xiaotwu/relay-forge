import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button, Input } from '@relayforge/ui';
import { useAdminStore } from '@/stores/admin';

const relayForgeIconSrc = '/branding/relay-forge-icon.png';

export function AdminLoginPage() {
  const { loginAdmin, isAuthenticated, initialize } = useAdminStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginAdmin(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-base flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-2xl p-8 shadow-xl">
          <div className="mb-8 text-center">
            <img
              src={relayForgeIconSrc}
              alt="RelayForge"
              className="mx-auto mb-4 h-20 w-20 rounded-[28px] border border-black/5 bg-white object-cover shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
            />
            <h1 className="text-text-primary text-2xl font-bold">Admin Console</h1>
            <p className="text-text-secondary mt-2">Sign in to RelayForge Admin</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="admin@relayforge.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              loading={loading}
              className="!bg-accent hover:!bg-accent-hover"
            >
              Sign in
            </Button>
          </form>

          <p className="text-text-secondary mt-6 text-center text-xs">
            Access restricted to authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  );
}
