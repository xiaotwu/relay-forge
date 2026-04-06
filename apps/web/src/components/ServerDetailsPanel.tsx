import React from 'react';
import { Avatar } from '@relayforge/ui';
import {
  ChannelType,
  type Channel,
  type Guild,
  type GuildMember,
  type PublicUser,
} from '@relayforge/types';

interface ServerDetailsPanelProps {
  guild: Guild;
  channels: Channel[];
  members: GuildMember[];
  currentUserId: string | null;
  selectedChannelId: string | null;
  collapsed: boolean;
  onToggle: () => void;
  onSelectChannel: (channelId: string) => void;
  onOpenConversation: (user: PublicUser) => void;
  onStartCall: (user: PublicUser, mode: 'voice' | 'video') => void;
}

type ServerPanelTab = 'info' | 'channels';

function getChannelDisplayName(channel: Channel): string {
  if (channel.type === ChannelType.VOICE && channel.name.toLowerCase() === 'lounge') {
    return 'Live room';
  }
  return channel.name;
}

export function ServerDetailsPanel({
  guild,
  channels,
  members,
  currentUserId,
  selectedChannelId,
  collapsed,
  onToggle,
  onSelectChannel,
  onOpenConversation,
  onStartCall,
}: ServerDetailsPanelProps) {
  const [tab, setTab] = React.useState<ServerPanelTab>('info');
  const [hoveredMemberId, setHoveredMemberId] = React.useState<string | null>(null);

  const sortedMembers = [...members].sort((left, right) => {
    if (left.user.status === right.user.status) {
      return left.user.displayName.localeCompare(right.user.displayName);
    }
    if (left.user.status === 'online') return -1;
    if (right.user.status === 'online') return 1;
    if (left.user.status === 'offline') return 1;
    if (right.user.status === 'offline') return -1;
    return left.user.displayName.localeCompare(right.user.displayName);
  });

  React.useEffect(() => {
    if (collapsed) {
      setHoveredMemberId(null);
    }
  }, [collapsed]);

  return (
    <aside
      className={[
        'rf-sidebar-surface relative h-full shrink-0 border-l border-[rgba(var(--rf-border),0.14)] transition-all duration-300',
        collapsed ? 'w-5' : 'w-[360px]',
      ].join(' ')}
    >
      <button
        onClick={onToggle}
        className="rf-edge-toggle absolute left-0 top-1/2 z-20 flex h-14 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[rgb(var(--rf-text-secondary))] transition hover:text-[rgb(var(--rf-text-primary))]"
        title={collapsed ? 'Show details panel' : 'Hide details panel'}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d={collapsed ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
          />
        </svg>
      </button>

      {!collapsed && (
        <div className="flex h-full flex-col px-5 py-5">
          <div className="flex items-start gap-4">
            <Avatar src={guild.iconUrl} name={guild.name} size="xl" className="shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[rgb(var(--rf-text-secondary))]">
                Server details
              </p>
              <h3 className="mt-2 truncate text-[28px] font-semibold tracking-[-0.03em] text-[rgb(var(--rf-text-primary))]">
                {guild.name}
              </h3>
              <p className="mt-1 text-sm leading-6 text-[rgb(var(--rf-text-secondary))]">
                {guild.description ??
                  'Browse members, jump into channels, and keep the room feeling calm and immediate.'}
              </p>
            </div>
          </div>

          <div className="apple-pill mt-5 flex rounded-full p-1">
            {(
              [
                ['info', 'Info'],
                ['channels', 'Channels'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                className={[
                  'flex-1 rounded-full px-4 py-2 text-sm font-medium transition',
                  tab === value
                    ? 'bg-[rgb(var(--rf-text-primary))] text-[rgb(var(--rf-surface))] shadow-sm'
                    : 'text-[rgb(var(--rf-text-secondary))] hover:text-[rgb(var(--rf-text-primary))]',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="scrollbar-thin mt-5 flex-1 overflow-y-auto">
            {tab === 'info' ? (
              <div className="space-y-3">
                <div className="rf-window rounded-[30px] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                        Members
                      </p>
                      <p className="text-xs text-[rgb(var(--rf-text-secondary))]">
                        Tap a person to view their card, message them, or start a call.
                      </p>
                    </div>
                    <span className="rounded-full bg-[rgba(var(--rf-base),0.42)] px-2.5 py-1 text-[11px] font-medium text-[rgb(var(--rf-text-secondary))]">
                      {sortedMembers.length}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {sortedMembers.map((member) => {
                      const displayName = member.nickname ?? member.user.displayName;
                      const isHovered = hoveredMemberId === member.user.id;
                      const isOnline = member.user.status === 'online';
                      const isSelf = member.user.id === currentUserId;

                      return (
                        <div
                          key={member.user.id}
                          className="relative"
                          onMouseLeave={() =>
                            setHoveredMemberId((value) => (value === member.user.id ? null : value))
                          }
                        >
                          <button
                            onClick={() => setHoveredMemberId(member.user.id)}
                            className="flex w-full items-center gap-3 rounded-[24px] border border-[rgba(var(--rf-border),0.14)] bg-[rgba(var(--rf-surface),0.58)] px-3 py-3 text-left transition hover:bg-[rgba(var(--rf-surface),0.82)]"
                          >
                            <div className="relative">
                              <Avatar src={member.user.avatarUrl} name={displayName} size="md" />
                              <span
                                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[rgba(var(--rf-surface),1)] ${
                                  isOnline
                                    ? 'bg-[rgb(var(--rf-success))]'
                                    : 'bg-[rgb(var(--rf-text-tertiary))]'
                                }`}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                                {displayName}
                              </p>
                              <p className="truncate text-xs text-[rgb(var(--rf-text-secondary))]">
                                {member.user.customStatus ?? `@${member.user.username}`}
                              </p>
                            </div>
                            <span
                              className={[
                                'rounded-full px-2 py-1 text-[11px] font-medium',
                                isOnline
                                  ? 'bg-[rgba(var(--rf-success),0.14)] text-[rgb(var(--rf-success))]'
                                  : 'bg-[rgba(var(--rf-base-alt),0.56)] text-[rgb(var(--rf-text-secondary))]',
                              ].join(' ')}
                            >
                              {isOnline ? 'Online' : 'Offline'}
                            </span>
                          </button>

                          {isHovered && (
                            <div className="rf-window animate-fade-scale absolute inset-x-2 top-[calc(100%+8px)] z-20 rounded-[26px] p-4">
                              <div className="flex items-start gap-3">
                                <div className="relative">
                                  <Avatar
                                    src={member.user.avatarUrl}
                                    name={displayName}
                                    size="lg"
                                  />
                                  <span
                                    className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-[rgba(var(--rf-surface),1)] ${
                                      isOnline
                                        ? 'bg-[rgb(var(--rf-success))]'
                                        : 'bg-[rgb(var(--rf-text-tertiary))]'
                                    }`}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-base font-semibold tracking-[-0.02em] text-[rgb(var(--rf-text-primary))]">
                                    {displayName}
                                  </p>
                                  <p className="mt-1 text-sm text-[rgb(var(--rf-text-secondary))]">
                                    @{member.user.username}
                                  </p>
                                  <p className="mt-2 text-sm leading-6 text-[rgb(var(--rf-text-secondary))]">
                                    {member.user.bio ??
                                      member.user.customStatus ??
                                      'No profile note yet.'}
                                  </p>
                                </div>
                              </div>

                              {!isSelf && (
                                <div className="mt-4 flex gap-2">
                                  <button
                                    onClick={() => onOpenConversation(member.user)}
                                    className="rf-control flex h-11 w-11 items-center justify-center rounded-[18px] text-[rgb(var(--rf-text-primary))]"
                                    title="Send a direct message"
                                  >
                                    <svg
                                      className="h-5 w-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.8}
                                        d="M7 8h10M7 12h6m-8 8 3.6-3H19a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => onStartCall(member.user, 'video')}
                                    className="rf-control flex h-11 w-11 items-center justify-center rounded-[18px] text-[rgb(var(--rf-text-primary))]"
                                    title="Start a call"
                                  >
                                    <svg
                                      className="h-5 w-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.8}
                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => onSelectChannel(channel.id)}
                    className={[
                      'w-full rounded-[26px] border px-4 py-4 text-left transition-all duration-200',
                      selectedChannelId === channel.id
                        ? 'border-[rgba(var(--rf-accent),0.18)] bg-[rgba(var(--rf-accent),0.08)] shadow-[0_16px_34px_rgba(var(--rf-accent),0.12)]'
                        : 'border-[rgba(var(--rf-border),0.16)] bg-[rgba(var(--rf-surface),0.72)] shadow-[0_14px_40px_rgba(var(--rf-shadow-color),0.06)] hover:-translate-y-0.5',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[rgba(var(--rf-base),0.42)] text-[rgb(var(--rf-text-secondary))]">
                        {channel.type === ChannelType.VOICE ? (
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        ) : (
                          <span className="text-lg font-semibold">#</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                          {getChannelDisplayName(channel)}
                        </p>
                        <p className="truncate text-xs text-[rgb(var(--rf-text-secondary))]">
                          {channel.topic ??
                            (channel.type === ChannelType.VOICE
                              ? 'Join a live call, switch between voice and video, or share your screen.'
                              : 'A text conversation space for the server.')}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
