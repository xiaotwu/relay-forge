import React, { useMemo, useState } from 'react';
import { Avatar } from '@relayforge/ui';
import type { DMChannel, Guild, PublicUser } from '@relayforge/types';

type InboxFilter = 'all' | 'dms' | 'servers';

interface UnifiedInboxProps {
  guilds: Guild[];
  dmChannels: DMChannel[];
  currentUser: PublicUser | null;
  selectedGuildId: string | null;
  selectedDMChannelId: string | null;
  searchInputRef?: React.Ref<HTMLInputElement>;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelectGuild: (guildId: string | null) => void;
  onSelectDM: (channelId: string) => void;
  onOpenCreateServer: () => void;
  onOpenSettings: () => void;
}

interface InboxItem {
  id: string;
  type: 'dm' | 'server';
  title: string;
  subtitle: string;
  meta: string;
  avatarUrl: string | null;
  status: PublicUser['status'] | null;
  selected: boolean;
}

function formatMetaDate(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
}

export function UnifiedInbox({
  guilds,
  dmChannels,
  currentUser,
  selectedGuildId,
  selectedDMChannelId,
  searchInputRef,
  collapsed,
  onToggleCollapse,
  onSelectGuild,
  onSelectDM,
  onOpenCreateServer,
  onOpenSettings,
}: UnifiedInboxProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<InboxFilter>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const assignSearchInputRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      if (!searchInputRef) return;
      if (typeof searchInputRef === 'function') {
        searchInputRef(node);
        return;
      }
      (searchInputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
    },
    [searchInputRef],
  );

  const items = useMemo(() => {
    const dmItems: InboxItem[] = dmChannels.map((channel) => {
      const counterpart =
        channel.participants.find((participant) => participant.id !== currentUser?.id) ??
        channel.participants[0];

      return {
        id: channel.id,
        type: 'dm',
        title: channel.name ?? counterpart?.displayName ?? 'Conversation',
        subtitle: channel.lastMessage ?? counterpart?.customStatus ?? 'Start a conversation',
        meta: formatMetaDate(channel.lastMessageAt),
        avatarUrl: channel.iconUrl ?? counterpart?.avatarUrl ?? null,
        status: counterpart?.status ?? null,
        selected: selectedDMChannelId === channel.id && selectedGuildId === null,
      };
    });

    const serverItems: InboxItem[] = guilds.map((guild) => ({
      id: guild.id,
      type: 'server',
      title: guild.name,
      subtitle:
        guild.description ?? `${guild.memberCount} member${guild.memberCount === 1 ? '' : 's'}`,
      meta: 'Server',
      avatarUrl: guild.iconUrl,
      status: null,
      selected: selectedGuildId === guild.id,
    }));

    const combined =
      filter === 'dms'
        ? dmItems
        : filter === 'servers'
          ? serverItems
          : [...dmItems, ...serverItems];

    return combined.filter((item) => {
      const haystack = `${item.title} ${item.subtitle} ${item.meta}`.toLowerCase();
      return haystack.includes(search.toLowerCase());
    });
  }, [currentUser?.id, dmChannels, filter, guilds, search, selectedDMChannelId, selectedGuildId]);

  return (
    <aside
      className={[
        'rf-sidebar-surface relative flex h-full shrink-0 flex-col border-r border-[rgba(var(--rf-border),0.14)] transition-all duration-300',
        collapsed ? 'w-[92px]' : 'w-[340px]',
      ].join(' ')}
    >
      <button
        onClick={onToggleCollapse}
        className="rf-edge-toggle absolute right-0 top-1/2 z-20 flex h-14 w-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full text-[rgb(var(--rf-text-secondary))] transition hover:text-[rgb(var(--rf-text-primary))]"
        title={collapsed ? 'Show left sidebar' : 'Hide left sidebar'}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
          />
        </svg>
      </button>

      <div className={collapsed ? 'px-3 pb-4 pt-5' : 'px-5 pb-4 pt-5'}>
        <div
          className={`mb-4 flex items-center ${collapsed ? 'flex-col gap-2' : 'justify-between'}`}
        >
          <div className={`flex ${collapsed ? 'flex-col gap-2' : 'items-center gap-2'}`}>
            <button
              onClick={() => setFilterOpen((value) => !value)}
              className="rf-control rounded-2xl px-3 py-2 text-[rgb(var(--rf-text-secondary))] hover:text-[rgb(var(--rf-text-primary))]"
              title="Filter list"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M4 7h16M7 12h10M10 17h4"
                />
              </svg>
            </button>
            <button
              onClick={onOpenCreateServer}
              className="rf-control rounded-2xl px-3 py-2 text-[rgb(var(--rf-text-secondary))] hover:text-[rgb(var(--rf-text-primary))]"
              title="Create a server"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 5v14M5 12h14"
                />
              </svg>
            </button>
          </div>
          <button
            onClick={onOpenSettings}
            className="rf-control rounded-full p-1.5"
            title="Open settings"
          >
            <Avatar
              src={currentUser?.avatarUrl}
              name={currentUser?.displayName ?? currentUser?.username ?? 'You'}
              size="sm"
              status={currentUser?.status ?? 'online'}
            />
          </button>
        </div>

        {!collapsed && (
          <div className="relative">
            <div className="flex items-center gap-2 rounded-2xl border border-[rgba(var(--rf-border),0.22)] bg-[rgba(var(--rf-surface),0.9)] px-3 py-3 shadow-[0_14px_34px_rgba(15,23,42,0.05)]">
              <svg
                className="h-4 w-4 shrink-0 text-[rgb(var(--rf-text-secondary))]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={assignSearchInputRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search messages, people, and servers"
                className="flex-1 bg-transparent text-sm text-[rgb(var(--rf-text-primary))] outline-none placeholder:text-[rgba(var(--rf-text-secondary),0.75)]"
              />
              <span className="apple-pill rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[rgb(var(--rf-text-tertiary))]">
                {navigator.platform.toLowerCase().includes('mac') ? 'Cmd K' : 'Ctrl K'}
              </span>
            </div>

            {filterOpen && (
              <div className="rf-window absolute left-0 top-[calc(100%+12px)] z-30 w-56 rounded-3xl p-2">
                {(
                  [
                    ['all', 'All'],
                    ['dms', 'Users’ DMs'],
                    ['servers', 'Servers'],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => {
                      setFilter(value);
                      setFilterOpen(false);
                    }}
                    className={[
                      'flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition',
                      filter === value
                        ? 'bg-[rgba(var(--rf-accent),0.12)] text-[rgb(var(--rf-text-primary))]'
                        : 'text-[rgb(var(--rf-text-secondary))] hover:bg-[rgba(var(--rf-surface),0.82)] hover:text-[rgb(var(--rf-text-primary))]',
                    ].join(' ')}
                  >
                    <span>{label}</span>
                    {filter === value && (
                      <svg
                        className="h-4 w-4 text-sky-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {collapsed && filterOpen && (
          <div className="rf-window absolute left-[88px] top-5 z-30 w-56 rounded-3xl p-2">
            {(
              [
                ['all', 'All'],
                ['dms', 'Users’ DMs'],
                ['servers', 'Servers'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => {
                  setFilter(value);
                  setFilterOpen(false);
                }}
                className={[
                  'flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition',
                  filter === value
                    ? 'bg-[rgba(var(--rf-accent),0.12)] text-[rgb(var(--rf-text-primary))]'
                    : 'text-[rgb(var(--rf-text-secondary))] hover:bg-[rgba(var(--rf-surface),0.82)] hover:text-[rgb(var(--rf-text-primary))]',
                ].join(' ')}
              >
                <span>{label}</span>
                {filter === value && (
                  <svg
                    className="h-4 w-4 text-sky-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        className={`scrollbar-thin flex-1 overflow-y-auto ${collapsed ? 'px-2 pb-4' : 'px-3 pb-4'}`}
      >
        {!collapsed && filter === 'all' && (
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgb(var(--rf-text-secondary))]">
            Messages and servers
          </p>
        )}

        <div className={collapsed ? 'space-y-2' : 'space-y-1.5'}>
          {items.map((item) => (
            <button
              key={`${item.type}-${item.id}`}
              onClick={() => {
                if (item.type === 'server') {
                  onSelectGuild(item.id);
                } else {
                  onSelectGuild(null);
                  onSelectDM(item.id);
                }
              }}
              className={[
                'flex w-full items-center rounded-[24px] text-left transition-all duration-200',
                item.selected
                  ? 'bg-[rgb(var(--rf-accent))] text-white shadow-[0_18px_40px_rgba(16,185,129,0.22)]'
                  : 'bg-[rgba(var(--rf-surface),0.72)] text-[rgb(var(--rf-text-primary))] shadow-[0_10px_24px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:bg-[rgba(var(--rf-surface),0.92)]',
                collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-3',
              ].join(' ')}
              title={collapsed ? item.title : undefined}
            >
              <Avatar
                src={item.avatarUrl}
                name={item.title}
                size="md"
                status={item.status}
                className="shrink-0"
              />
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-semibold">{item.title}</span>
                    <span
                      className={`shrink-0 text-[11px] ${
                        item.selected
                          ? 'text-emerald-50/90'
                          : 'text-[rgb(var(--rf-text-secondary))]'
                      }`}
                    >
                      {item.meta}
                    </span>
                  </div>
                  <p
                    className={`mt-1 truncate text-xs ${
                      item.selected ? 'text-emerald-50/85' : 'text-[rgb(var(--rf-text-secondary))]'
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>

        {items.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-[rgb(var(--rf-text-secondary))]">
            Nothing matches this filter yet.
          </div>
        )}
      </div>
    </aside>
  );
}
