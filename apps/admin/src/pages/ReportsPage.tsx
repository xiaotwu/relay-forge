import React, { useEffect, useState, useCallback } from 'react';
import { Button, Badge } from '@relayforge/ui';
import { DataTable, type Column } from '@/components/DataTable';
import { useAdminStore, type Report } from '@/stores/admin';

export function ReportsPage() {
  const { reports, reportsTotal, reportsPage, fetchReports, resolveReport, dismissReport } =
    useAdminStore();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadReports = useCallback(
    async (page = 1) => {
      setLoading(true);
      await fetchReports(page);
      setLoading(false);
    },
    [fetchReports],
  );

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleResolve = async (reportId: string) => {
    setActionLoading(reportId);
    try {
      await resolveReport(reportId);
    } catch {
      // Error handled in store
    } finally {
      setActionLoading(null);
    }
  };

  const handleDismiss = async (reportId: string) => {
    setActionLoading(reportId);
    try {
      await dismissReport(reportId);
    } catch {
      // Error handled in store
    } finally {
      setActionLoading(null);
    }
  };

  const columns: Column<Report>[] = [
    {
      key: 'reporter',
      header: 'Reporter',
      render: (row) => <span className="font-medium">{row.reporter}</span>,
    },
    {
      key: 'target',
      header: 'Target',
      render: (row) => <span className="font-medium">{row.target}</span>,
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (row) => <span className="max-w-xs truncate">{row.reason}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => {
        const variant =
          row.status === 'open' || row.status === 'investigating'
            ? 'warning'
            : row.status === 'resolved'
              ? 'success'
              : 'default';
        return <Badge variant={variant}>{row.status}</Badge>;
      },
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-44',
      render: (row) => {
        if (row.status !== 'open' && row.status !== 'investigating') {
          return <span className="text-text-secondary text-xs">--</span>;
        }
        const isLoading = actionLoading === row.id;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => handleResolve(row.id)}
              disabled={isLoading}
              className="text-accent hover:text-accent-light text-xs font-medium transition-colors disabled:opacity-50"
            >
              Resolve
            </button>
            <button
              onClick={() => handleDismiss(row.id)}
              disabled={isLoading}
              className="text-text-secondary hover:text-text-primary text-xs font-medium transition-colors disabled:opacity-50"
            >
              Dismiss
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text-primary text-2xl font-bold">Reports</h1>
          <p className="text-text-secondary mt-1 text-sm">Review and manage abuse reports</p>
        </div>
        <Button
          onClick={() => loadReports(1)}
          variant="ghost"
          className="text-text-secondary hover:text-text-primary"
        >
          Refresh
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={reports}
        total={reportsTotal}
        page={reportsPage}
        loading={loading}
        onPageChange={(p) => loadReports(p)}
        rowKey={(row) => row.id}
        emptyMessage="No reports found"
      />
    </div>
  );
}
