import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from '@relayforge/ui';
import { useAuthStore } from '@/stores/auth';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { MainPage } from '@/pages/MainPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { Spinner } from '@relayforge/ui';

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
            RelayForge
          </p>
          <div className="mt-4">
            <Spinner size="lg" />
          </div>
          <p className="text-text-primary mt-4 text-2xl font-semibold">Preparing your workspace</p>
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

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
