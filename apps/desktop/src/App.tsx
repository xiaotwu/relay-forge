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
import { useDesktop } from '@/hooks/useDesktop';
import { useServerConnections } from '@/lib/serverConnections';

const relayForgeIconSrc = '/branding/relay-forge-icon.png';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="bg-base flex h-screen w-screen items-center justify-center px-4">
        <div className="bg-surface flex w-full max-w-sm flex-col items-center rounded-[28px] px-8 py-9 text-center shadow-xl">
          <img
            src={relayForgeIconSrc}
            alt="RelayForge"
            className="mb-5 h-20 w-20 rounded-[28px] border border-black/5 bg-white object-cover shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
          />
          <p className="text-text-secondary text-[11px] font-semibold uppercase tracking-[0.28em]">
            RelayForge Desktop
          </p>
          <div className="mt-4">
            <Spinner size="lg" />
          </div>
          <p className="text-text-primary mt-4 text-2xl font-semibold">
            Preparing your desktop app
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

function DesktopWrapper({ children }: { children: React.ReactNode }) {
  const { isReady } = useDesktop();

  if (!isReady) {
    return (
      <div className="bg-base flex h-screen w-screen items-center justify-center px-4">
        <div className="bg-surface flex w-full max-w-sm flex-col items-center rounded-[28px] px-8 py-9 text-center shadow-xl">
          <img
            src={relayForgeIconSrc}
            alt="RelayForge"
            className="mb-5 h-20 w-20 rounded-[28px] border border-black/5 bg-white object-cover shadow-[0_18px_40px_rgba(15,23,42,0.12)]"
          />
          <p className="text-text-secondary text-[11px] font-semibold uppercase tracking-[0.28em]">
            RelayForge Desktop
          </p>
          <div className="mt-4">
            <Spinner size="lg" />
          </div>
          <p className="text-text-primary mt-4 text-2xl font-semibold">Loading native services</p>
        </div>
      </div>
    );
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
      <DesktopWrapper>
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
      </DesktopWrapper>
    </ToastProvider>
  );
}
