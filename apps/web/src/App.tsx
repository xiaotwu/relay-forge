import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider, useTheme } from '@relayforge/ui';
import { useAuthStore } from '@/stores/auth';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { MainPage } from '@/pages/MainPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AdminPage } from '@/pages/AdminPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/ResetPasswordPage';
import { Spinner } from '@relayforge/ui';
import { useServerConnections } from '@/lib/serverConnections';

const relayForgeIconSrc = '/branding/relay-forge-icon.png';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="auth-shell flex h-screen w-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-soft-float absolute left-[18%] top-[18%] h-44 w-44 rounded-full bg-[rgba(var(--rf-accent),0.10)] blur-3xl" />
          <div className="animate-soft-float absolute bottom-[14%] right-[12%] h-56 w-56 rounded-full bg-[rgba(56,189,248,0.08)] blur-3xl [animation-delay:1000ms]" />
        </div>
        <div className="apple-card relative z-10 flex flex-col items-center rounded-[32px] px-10 py-10 text-center">
          <img
            src={relayForgeIconSrc}
            alt="RelayForge"
            className="mb-5 h-20 w-20 rounded-[28px] border border-black/5 bg-white object-cover shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
          />
          <p className="text-text-secondary text-[11px] font-semibold uppercase tracking-[0.28em]">
            RelayForge
          </p>
          <div className="mt-4">
            <Spinner size="lg" />
          </div>
          <p className="text-text-primary text-[28px] font-semibold tracking-[-0.04em]">
            Preparing your workspace
          </p>
          <p className="text-text-secondary mt-2 max-w-sm text-sm leading-6">
            Loading your conversations, servers, and preferences.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export function App() {
  const initialize = useAuthStore((s) => s.initialize);
  const { currentConnection } = useServerConnections();
  useTheme();

  useEffect(() => {
    initialize();
  }, [currentConnection.id, initialize]);

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <MainPage />
              </AuthGuard>
            }
          />
          <Route
            path="/settings"
            element={
              <AuthGuard>
                <SettingsPage />
              </AuthGuard>
            }
          />
          <Route
            path="/admin"
            element={
              <AuthGuard>
                <AdminPage />
              </AuthGuard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
