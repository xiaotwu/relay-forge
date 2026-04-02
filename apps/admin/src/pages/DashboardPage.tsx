import React, { useEffect, useState } from 'react';
import { Spinner } from '@relayforge/ui';
import { ApiClient } from '@relayforge/sdk';
import { API_BASE_URL } from '@relayforge/config';

interface DashboardStats {
  totalUsers: number;
  totalGuilds: number;
  activeSessions: number;
  storageUsageMB: number;
}

interface RecentActivity {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
}

const statCards = [
  {
    key: 'totalUsers' as const,
    label: 'Total Users',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
  },
  {
    key: 'totalGuilds' as const,
    label: 'Total Guilds',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    color: 'text-accent-light',
    bgColor: 'bg-accent/10',
  },
  {
    key: 'activeSessions' as const,
    label: 'Active Sessions',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
  },
  {
    key: 'storageUsageMB' as const,
    label: 'Storage Usage',
    icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
  },
];

function formatStatValue(key: string, value: number): string {
  if (key === 'storageUsageMB') {
    if (value >= 1024) return `${(value / 1024).toFixed(1)} GB`;
    return `${value} MB`;
  }
  return value.toLocaleString();
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const client = new ApiClient({
          baseURL: API_BASE_URL,
          onTokenRefresh: () => {},
          onAuthError: () => {},
        });
        const token = localStorage.getItem('rf_admin_token');
        if (token) client.setTokens(token, '');

        const [statsRes, activityRes] = await Promise.allSettled([
          client.get<DashboardStats>('/admin/dashboard/stats'),
          client.get<{ activities: RecentActivity[] }>('/admin/dashboard/activity'),
        ]);

        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value.data);
        } else {
          // Fallback placeholder stats
          setStats({ totalUsers: 0, totalGuilds: 0, activeSessions: 0, storageUsageMB: 0 });
        }

        if (activityRes.status === 'fulfilled') {
          setActivity(activityRes.value.data.activities ?? []);
        }
      } catch {
        setStats({ totalUsers: 0, totalGuilds: 0, activeSessions: 0, storageUsageMB: 0 });
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-text-primary text-2xl font-bold">Dashboard</h1>
        <p className="text-text-secondary mt-1 text-sm">System overview and recent activity</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.key} className="bg-surface border-border rounded-xl border p-5">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2.5 ${card.bgColor}`}>
                <svg
                  className={`h-5 w-5 ${card.color}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                </svg>
              </div>
              <div>
                <p className="text-text-secondary text-xs font-medium">{card.label}</p>
                <p className="text-text-primary text-xl font-bold">
                  {stats ? formatStatValue(card.key, stats[card.key]) : '--'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent activity */}
        <div className="bg-surface border-border rounded-xl border p-5">
          <h2 className="text-text-primary mb-4 text-lg font-semibold">Recent Activity</h2>
          {activity.length === 0 ? (
            <p className="text-text-secondary text-sm">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {activity.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  className="hover:bg-elevated/30 flex items-start gap-3 rounded-lg p-2 transition-colors"
                >
                  <div className="bg-accent mt-0.5 h-2 w-2 flex-shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1">
                    <p className="text-text-primary text-sm">
                      <span className="font-medium">{item.actor}</span> {item.action}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System status */}
        <div className="bg-surface border-border rounded-xl border p-5">
          <h2 className="text-text-primary mb-4 text-lg font-semibold">System Status</h2>
          <div className="space-y-3">
            {[
              { label: 'API Gateway', status: 'operational' },
              { label: 'WebSocket Server', status: 'operational' },
              { label: 'Database', status: 'operational' },
              { label: 'File Storage', status: 'operational' },
              { label: 'Email Service', status: 'operational' },
            ].map((service) => (
              <div
                key={service.label}
                className="flex items-center justify-between rounded-lg px-3 py-2"
              >
                <span className="text-text-primary text-sm">{service.label}</span>
                <span className="flex items-center gap-2 text-xs font-medium">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      service.status === 'operational'
                        ? 'bg-accent'
                        : service.status === 'degraded'
                          ? 'bg-yellow-400'
                          : 'bg-red-400'
                    }`}
                  />
                  <span
                    className={
                      service.status === 'operational'
                        ? 'text-accent-light'
                        : service.status === 'degraded'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                    }
                  >
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
