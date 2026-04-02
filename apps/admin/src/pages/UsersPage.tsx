import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Button, Input } from '@relayforge/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { useAdminStore, type AdminUser } from '@/stores/admin';
import { Badge } from '@relayforge/ui';

export function UsersPage() {
  const { users, usersTotal, usersPage, fetchUsers, disableUser, enableUser } = useAdminStore();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmUser, setConfirmUser] = useState<AdminUser | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadUsers = useCallback(
    async (page = 1) => {
      setLoading(true);
      await fetchUsers(page, search || undefined);
      setLoading(false);
    },
    [fetchUsers, search],
  );

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers(1);
  };

  const handleToggleUser = async () => {
    if (!confirmUser) return;
    setActionLoading(true);
    try {
      if (confirmUser.status === 'active') {
        await disableUser(confirmUser.id);
      } else {
        await enableUser(confirmUser.id);
      }
    } catch {
      // Error handled in store
    } finally {
      setActionLoading(false);
      setConfirmUser(null);
    }
  };

  const columns: Column<AdminUser>[] = [
    { key: 'username', header: 'Username' },
    { key: 'email', header: 'Email' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const variant =
          row.status === 'active' ? 'success' : row.status === 'disabled' ? 'warning' : 'danger';
        return <Badge variant={variant}>{row.status}</Badge>;
      },
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-32',
      render: (row) => (
        <button
          onClick={() => setConfirmUser(row)}
          className={`text-xs font-medium transition-colors ${
            row.status === 'active'
              ? 'text-red-400 hover:text-red-300'
              : 'text-accent hover:text-accent-light'
          }`}
        >
          {row.status === 'active' ? 'Disable' : 'Enable'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text-primary text-2xl font-bold">Users</h1>
          <p className="text-text-secondary mt-1 text-sm">Manage user accounts</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="w-80">
          <Input
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button type="submit" className="!bg-accent hover:!bg-accent-hover">
          Search
        </Button>
      </form>

      <DataTable
        columns={columns}
        data={users}
        total={usersTotal}
        page={usersPage}
        loading={loading}
        onPageChange={(p) => loadUsers(p)}
        rowKey={(row) => row.id}
        emptyMessage="No users found"
      />

      {/* Confirmation modal */}
      <Modal
        open={!!confirmUser}
        onClose={() => setConfirmUser(null)}
        title={confirmUser?.status === 'active' ? 'Disable User' : 'Enable User'}
      >
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            Are you sure you want to {confirmUser?.status === 'active' ? 'disable' : 'enable'} user{' '}
            <span className="text-text-primary font-medium">{confirmUser?.username}</span>?
          </p>
          {confirmUser?.status === 'active' && (
            <p className="text-text-secondary text-xs">
              This will prevent the user from logging in and using the platform.
            </p>
          )}
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setConfirmUser(null)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleToggleUser}
              loading={actionLoading}
              className={
                confirmUser?.status === 'active'
                  ? '!bg-red-500 hover:!bg-red-600'
                  : '!bg-accent hover:!bg-accent-hover'
              }
            >
              {confirmUser?.status === 'active' ? 'Disable' : 'Enable'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
