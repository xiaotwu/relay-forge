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

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAdminStore();

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
