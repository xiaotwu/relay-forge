import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Button, Input } from '@relayforge/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { useAdminStore, type AdminGuild } from '@/stores/admin';

export function GuildsPage() {
  const { guilds, guildsTotal, guildsPage, fetchGuilds, deleteGuild } = useAdminStore();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmGuild, setConfirmGuild] = useState<AdminGuild | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadGuilds = useCallback(
    async (page = 1) => {
      setLoading(true);
      await fetchGuilds(page, search || undefined);
      setLoading(false);
    },
    [fetchGuilds, search],
  );

  useEffect(() => {
    loadGuilds();
  }, [loadGuilds]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadGuilds(1);
  };

  const handleDelete = async () => {
    if (!confirmGuild) return;
    setActionLoading(true);
    try {
      await deleteGuild(confirmGuild.id);
    } catch {
      // Error handled in store
    } finally {
      setActionLoading(false);
      setConfirmGuild(null);
    }
  };

  const columns: Column<AdminGuild>[] = [
    { key: 'name', header: 'Name' },
    { key: 'ownerUsername', header: 'Owner' },
    {
      key: 'memberCount',
      header: 'Members',
      render: (row) => row.memberCount.toLocaleString(),
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
          onClick={() => setConfirmGuild(row)}
          className="text-xs font-medium text-red-400 transition-colors hover:text-red-300"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text-primary text-2xl font-bold">Guilds</h1>
          <p className="text-text-secondary mt-1 text-sm">Manage guild servers</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="w-80">
          <Input
            placeholder="Search guilds by name..."
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
        data={guilds}
        total={guildsTotal}
        page={guildsPage}
        loading={loading}
        onPageChange={(p) => loadGuilds(p)}
        rowKey={(row) => row.id}
        emptyMessage="No guilds found"
      />

      {/* Delete confirmation modal */}
      <Modal open={!!confirmGuild} onClose={() => setConfirmGuild(null)} title="Delete Guild">
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            Are you sure you want to permanently delete the guild{' '}
            <span className="text-text-primary font-medium">{confirmGuild?.name}</span>?
          </p>
          <p className="text-xs text-red-400">
            This action cannot be undone. All channels, messages, and data within this guild will be
            permanently removed.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setConfirmGuild(null)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              loading={actionLoading}
              className="!bg-red-500 hover:!bg-red-600"
            >
              Delete Guild
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
