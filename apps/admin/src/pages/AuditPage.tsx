import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@relayforge/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { useAdminStore, type AuditEntry } from '@/stores/admin';

const ACTION_TYPES = [
  'All',
  'user.login',
  'user.register',
  'user.disable',
  'user.enable',
  'guild.create',
  'guild.delete',
  'channel.create',
  'channel.delete',
  'message.delete',
  'report.resolve',
  'report.dismiss',
  'settings.update',
];

export function AuditPage() {
  const { auditLogs, auditTotal, auditPage, fetchAuditLogs } = useAdminStore();
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('All');

  const loadAudit = useCallback(
    async (page = 1) => {
      setLoading(true);
      const filter = actionFilter === 'All' ? undefined : actionFilter;
      await fetchAuditLogs(page, filter);
      setLoading(false);
    },
    [fetchAuditLogs, actionFilter],
  );

  useEffect(() => {
    loadAudit();
  }, [loadAudit]);

  const columns: Column<AuditEntry>[] = [
    {
      key: 'actor',
      header: 'Actor',
      render: (row) => <span className="font-medium">{row.actor}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      render: (row) => (
        <span className="bg-elevated inline-flex rounded-md px-2 py-0.5 font-mono text-xs">
          {row.action}
        </span>
      ),
    },
    { key: 'target', header: 'Target' },
    {
      key: 'details',
      header: 'Details',
      render: (row) => (
        <span className="text-text-secondary max-w-xs truncate">{row.details || '--'}</span>
      ),
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      render: (row) => new Date(row.timestamp).toLocaleString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-text-primary text-2xl font-bold">Audit Logs</h1>
        <p className="text-text-secondary mt-1 text-sm">Track all administrative actions</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <label className="text-text-secondary text-sm">Filter by action:</label>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="border-border bg-surface text-text-primary focus:border-accent rounded-lg border px-3 py-2 text-sm focus:outline-none"
        >
          {ACTION_TYPES.map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
        <Button onClick={() => loadAudit(1)} className="!bg-accent hover:!bg-accent-hover">
          Apply
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={auditLogs}
        total={auditTotal}
        page={auditPage}
        pageSize={25}
        loading={loading}
        onPageChange={(p) => loadAudit(p)}
        rowKey={(row) => row.id}
        emptyMessage="No audit logs found"
      />
    </div>
  );
}
