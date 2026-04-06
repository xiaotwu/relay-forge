import React from 'react';
import { Avatar } from '@relayforge/ui';
import type { DMChannel, PublicUser } from '@relayforge/types';
import {
  formatConversationTime,
  getConversationMeta,
  getConversationOthers,
  getConversationTitle,
} from './conversationUtils';
import { summarizeMessageContent } from '@/lib/messageContent';

const relayForgeIconSrc = '/branding/relay-forge-icon.png';
const relayForgeWordmarkSrc = '/branding/relay-forge-wordmark.png';

type ConversationFilter = 'all' | 'direct' | 'group';

interface ConversationSidebarProps {
  channels: DMChannel[];
  currentUser: PublicUser | null;
  selectedChannelId: string | null;
  collapsed: boolean;
  search: string;
  filter: ConversationFilter;
  searchInputRef?: React.Ref<HTMLInputElement>;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: ConversationFilter) => void;
  onToggleCollapse: () => void;
  onSelectChannel: (channelId: string) => void;
  onCompose: () => void;
  onOpenSettings: () => void;
}

export function ConversationSidebar({
  channels,
  currentUser,
  selectedChannelId,
  collapsed,
  search,
  filter,
  searchInputRef,
  onSearchChange,
  onFilterChange,
  onToggleCollapse,
  onSelectChannel,
  onCompose,
  onOpenSettings,
}: ConversationSidebarProps) {
  const [filterOpen, setFilterOpen] = React.useState(false);

  const filteredChannels = React.useMemo(() => {
    const lower = search.trim().toLowerCase();
    return channels.filter((channel) => {
      const others = getConversationOthers(channel, currentUser?.id);
      const isGroup = channel.type === 'group_dm' || others.length > 1;
      if (filter === 'direct' && isGroup) return false;
      if (filter === 'group' && !isGroup) return false;

      const haystack =
        `${getConversationTitle(channel, currentUser?.id)} ${channel.lastMessage ?? ''} ${others
          .map((participant) => participant.displayName)
          .join(' ')}`.toLowerCase();
      return haystack.includes(lower);
    });
  }, [channels, currentUser?.id, filter, search]);

  return (
    <aside
      className={[
        'rf-sidebar-surface relative flex h-full shrink-0 flex-col transition-all duration-300',
        collapsed ? 'w-[84px]' : 'w-[328px]',
      ].join(' ')}
    >
      <button
        onClick={onToggleCollapse}
        className="rf-edge-toggle absolute right-0 top-1/2 z-20 flex h-14 w-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full text-[rgb(var(--rf-text-secondary))] transition hover:text-[rgb(var(--rf-text-primary))]"
        title={collapsed ? 'Show conversation list' : 'Hide conversation list'}
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

      <div className={collapsed ? 'px-3 py-4' : 'px-4 py-4'}>
        <div
          className={`mb-4 flex items-center ${collapsed ? 'flex-col gap-3' : 'justify-between gap-3'}`}
        >
          <div className={collapsed ? '' : 'min-w-0'}>
            {collapsed ? (
              <img
                src={relayForgeIconSrc}
                alt="RelayForge"
                className="h-11 w-11 rounded-[16px] border border-white/60 bg-white object-cover shadow-sm"
              />
            ) : (
              <div className="inline-flex rounded-[22px] border border-[rgba(var(--rf-border),0.18)] bg-white/90 px-3 py-2 shadow-sm">
                <img
                  src={relayForgeWordmarkSrc}
                  alt="RelayForge"
                  className="h-8 w-auto max-w-[190px] object-contain"
                />
              </div>
            )}
          </div>
          <div className={`flex ${collapsed ? 'flex-col gap-2' : 'items-center gap-2'}`}>
            <button
              onClick={() => setFilterOpen((value) => !value)}
              className="rf-control rounded-2xl p-3 text-[rgb(var(--rf-text-secondary))] hover:text-[rgb(var(--rf-text-primary))]"
              title="Filter conversations"
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
              onClick={onCompose}
              className="rf-control rounded-2xl p-3 text-[rgb(var(--rf-text-secondary))] hover:text-[rgb(var(--rf-text-primary))]"
              title="Write a new conversation"
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
            className="rounded-full transition hover:scale-[1.02]"
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
          <div className="mb-4">
            <div className="rf-control flex items-center gap-2 rounded-[18px] px-3 py-3">
              <svg
                className="h-4 w-4 text-[rgb(var(--rf-text-tertiary))]"
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
                ref={searchInputRef as React.RefObject<HTMLInputElement>}
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="search"
                className="flex-1 bg-transparent text-sm text-[rgb(var(--rf-text-primary))] outline-none [-webkit-text-fill-color:rgb(var(--rf-text-primary))] placeholder:text-[rgb(var(--rf-text-tertiary))] placeholder:opacity-100"
              />
            </div>
          </div>
        )}

        {filterOpen && (
          <div
            className={[
              'absolute z-30 rounded-[22px] border border-[rgba(var(--rf-border),0.16)] bg-[rgba(var(--rf-surface),0.98)] p-2 shadow-[0_18px_40px_rgba(15,23,42,0.22)] backdrop-blur-xl',
              collapsed ? 'left-[80px] top-4 w-48' : 'left-4 top-[114px] w-48',
            ].join(' ')}
          >
            {(
              [
                ['all', 'All chats'],
                ['direct', 'Direct'],
                ['group', 'Groups'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => {
                  onFilterChange(value);
                  setFilterOpen(false);
                }}
                className={[
                  'flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition',
                  filter === value
                    ? 'bg-[rgba(var(--rf-accent),0.16)] text-white'
                    : 'text-[rgb(var(--rf-text-secondary))] hover:bg-[rgba(var(--rf-elevated),0.72)] hover:text-[rgb(var(--rf-text-primary))]',
                ].join(' ')}
              >
                <span>{label}</span>
                {filter === value && <span className="text-xs font-semibold">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-2 pb-3">
        {filteredChannels.length === 0 ? (
          <div className={`px-3 ${collapsed ? 'py-3' : 'py-8 text-center'}`}>
            {!collapsed && (
              <>
                <p className="text-sm font-medium text-[rgb(var(--rf-text-primary))]">
                  No conversations yet
                </p>
              </>
            )}
          </div>
        ) : (
          filteredChannels.map((channel) => {
            const title = getConversationTitle(channel, currentUser?.id);
            const lastMessagePreview = channel.lastMessage
              ? summarizeMessageContent(channel.lastMessage)
              : '';
            const subtitle = lastMessagePreview || getConversationMeta(channel, currentUser?.id);
            const others = getConversationOthers(channel, currentUser?.id);
            const avatarName = others[0]?.displayName ?? title;
            const avatarSrc = channel.iconUrl ?? others[0]?.avatarUrl ?? null;

            return (
              <button
                key={channel.id}
                onClick={() => onSelectChannel(channel.id)}
                className={[
                  'mb-1.5 flex w-full items-center gap-3 rounded-[20px] px-3 py-3 text-left transition',
                  selectedChannelId === channel.id
                    ? 'bg-[rgb(var(--rf-accent))] text-white shadow-[0_14px_28px_rgba(var(--rf-accent),0.28)]'
                    : 'hover:bg-[rgba(var(--rf-elevated),0.68)]',
                  collapsed ? 'justify-center px-2' : '',
                ].join(' ')}
              >
                <Avatar src={avatarSrc} name={avatarName} size="md" />
                {!collapsed && (
                  <>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="truncate text-sm font-semibold">{title}</p>
                        <span
                          className={`shrink-0 text-[11px] ${
                            selectedChannelId === channel.id
                              ? 'text-white/85'
                              : 'text-[rgb(var(--rf-text-tertiary))]'
                          }`}
                        >
                          {formatConversationTime(channel.lastMessageAt)}
                        </span>
                      </div>
                      <p
                        className={`truncate text-sm ${
                          selectedChannelId === channel.id
                            ? 'text-white/78'
                            : 'text-[rgb(var(--rf-text-tertiary))]'
                        }`}
                      >
                        {subtitle}
                      </p>
                    </div>
                  </>
                )}
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
