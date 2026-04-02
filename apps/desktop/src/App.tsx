import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from '@relayforge/ui';
import { useAuthStore } from '@/stores/auth';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { MainPage } from '@/pages/MainPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { Spinner } from '@relayforge/ui';
import { useDesktop } from '@/hooks/useDesktop';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="bg-base flex h-screen w-screen items-center justify-center">
        <Spinner size="xl" />
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
      <div className="bg-base flex h-screen w-screen items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
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
      <DesktopWrapper>
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
      </DesktopWrapper>
    </ToastProvider>
  );
}
