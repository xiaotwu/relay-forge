import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from '@relayforge/ui';
import { useAdminStore } from '@/stores/admin';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { UsersPage } from '@/pages/UsersPage';
import { GuildsPage } from '@/pages/GuildsPage';
import { AuditPage } from '@/pages/AuditPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SystemSettingsPage } from '@/pages/SystemSettingsPage';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Spinner } from '@relayforge/ui';

const relayForgeIconSrc = '/branding/relay-forge-icon.png';

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminStore();

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
            RelayForge Admin
          </p>
          <div className="mt-4">
            <Spinner size="lg" />
          </div>
          <p className="text-text-primary mt-4 text-2xl font-semibold">Preparing the console</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-base flex h-screen w-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AdminLoginPage />} />
          <Route
            path="/"
            element={
              <AdminGuard>
                <DashboardPage />
              </AdminGuard>
            }
          />
          <Route
            path="/users"
            element={
              <AdminGuard>
                <UsersPage />
              </AdminGuard>
            }
          />
          <Route
            path="/guilds"
            element={
              <AdminGuard>
                <GuildsPage />
              </AdminGuard>
            }
          />
          <Route
            path="/audit"
            element={
              <AdminGuard>
                <AuditPage />
              </AdminGuard>
            }
          />
          <Route
            path="/reports"
            element={
              <AdminGuard>
                <ReportsPage />
              </AdminGuard>
            }
          />
          <Route
            path="/settings"
            element={
              <AdminGuard>
                <SystemSettingsPage />
              </AdminGuard>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
