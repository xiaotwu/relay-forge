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

interface ConversationSidebarProps {
  channels: DMChannel[];
  currentUser: PublicUser | null;
  selectedChannelId: string | null;
  search: string;
  searchInputRef?: React.Ref<HTMLInputElement>;
  onSearchChange: (value: string) => void;
  onSelectChannel: (channelId: string) => void;
  onCompose: () => void;
}

export function ConversationSidebar({
  channels,
  currentUser,
  selectedChannelId,
  search,
  searchInputRef,
  onSearchChange,
  onSelectChannel,
  onCompose,
}: ConversationSidebarProps) {
  const filteredChannels = React.useMemo(() => {
    const lower = search.trim().toLowerCase();
    return channels.filter((channel) => {
      const others = getConversationOthers(channel, currentUser?.id);

      const haystack =
        `${getConversationTitle(channel, currentUser?.id)} ${channel.lastMessage ?? ''} ${others
          .map((participant) => participant.displayName)
          .join(' ')}`.toLowerCase();
      return haystack.includes(lower);
    });
  }, [channels, currentUser?.id, search]);

  return (
    <aside className="rf-context-sidebar relative flex h-full w-[316px] shrink-0 flex-col">
      <div className="px-4 pb-3 pt-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="truncate text-base font-semibold tracking-[-0.02em] text-[rgb(var(--rf-text-primary))]">
            Messages
          </h2>
        </div>

        <div className="rf-search-shell flex items-center gap-2 rounded-[18px] px-3 py-3">
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
            placeholder="Search"
            className="min-w-0 flex-1 bg-transparent text-sm text-[rgb(var(--rf-text-primary))] outline-none [-webkit-text-fill-color:rgb(var(--rf-text-primary))] placeholder:text-[rgb(var(--rf-text-tertiary))] placeholder:opacity-100"
          />
        </div>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto px-2 pb-4">
        {filteredChannels.length === 0 ? (
          <div className="px-2 py-4">
            <div className="rf-empty-state rounded-[22px] px-4 py-5 text-center">
              <p className="text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                No conversations
              </p>
              <button
                type="button"
                onClick={onCompose}
                className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(var(--rf-accent),0.18)] text-[rgb(var(--rf-accent-light))] transition hover:bg-[rgba(var(--rf-accent),0.26)] hover:text-white"
                aria-label="Start a conversation"
                title="Start a conversation"
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
                  'rf-list-row mb-1.5 flex w-full items-center gap-3 rounded-[20px] px-3 py-3 text-left',
                  selectedChannelId === channel.id
                    ? 'bg-[rgb(var(--rf-accent))] text-white shadow-[0_14px_28px_rgba(var(--rf-accent),0.28)]'
                    : 'text-[rgb(var(--rf-text-secondary))] hover:bg-[rgba(var(--rf-elevated),0.58)] hover:text-[rgb(var(--rf-text-primary))]',
                ].join(' ')}
              >
                <Avatar src={avatarSrc} name={avatarName} size="md" />
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
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
