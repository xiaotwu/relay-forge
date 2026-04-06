import React, { useMemo, useState } from 'react';
import { Avatar } from '@relayforge/ui';
import { useAuthStore } from '@/stores/auth';
import { useDMStore } from '@/stores/dm';

function formatConversationDate(value: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function DMList() {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const channels = useDMStore((state) => state.channels);
  const selectedChannelId = useDMStore((state) => state.selectedChannelId);
  const selectChannel = useDMStore((state) => state.selectChannel);
  const loading = useDMStore((state) => state.loading);
  const [search, setSearch] = useState('');

  const conversations = useMemo(() => {
    return channels
      .map((channel) => {
        const counterpart =
          channel.participants.find((participant) => participant.id !== currentUserId) ??
          channel.participants[0];

        return {
          id: channel.id,
          name: channel.name ?? counterpart?.displayName ?? 'Conversation',
          avatarUrl: channel.iconUrl ?? counterpart?.avatarUrl ?? null,
          status: counterpart?.status ?? 'offline',
          customStatus: counterpart?.customStatus ?? null,
          lastMessage: channel.lastMessage,
          lastMessageAt: channel.lastMessageAt,
        };
      })
      .filter((conversation) => {
        const haystack = [conversation.name, conversation.lastMessage, conversation.customStatus]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(search.toLowerCase());
      });
  }, [channels, currentUserId, search]);

  return (
    <div className="flex h-full flex-col border-r border-black/5 bg-[#f8faf9]">
      <div className="border-b border-black/5 px-5 pb-4 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Chats</h2>
            <p className="text-xs text-slate-500">Direct conversations and quick check-ins.</p>
          </div>
          <button className="rounded-full border border-black/5 bg-white p-2 text-slate-500 shadow-sm transition-colors hover:text-slate-700">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-black/5 bg-white px-3 py-2.5 shadow-sm">
          <svg
            className="h-4 w-4 shrink-0 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search"
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        {conversations.map((conversation) => {
          const isSelected = selectedChannelId === conversation.id;
          return (
            <button
              key={conversation.id}
              onClick={() => selectChannel(conversation.id)}
              className={[
                'mb-1 flex w-full items-center gap-3 rounded-[22px] px-3 py-3 text-left transition-all duration-200',
                isSelected
                  ? 'bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]'
                  : 'hover:bg-white/80 hover:shadow-[0_8px_24px_rgba(15,23,42,0.05)]',
              ].join(' ')}
            >
              <Avatar
                src={conversation.avatarUrl}
                name={conversation.name}
                size="md"
                status={conversation.status}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-semibold text-slate-800">
                    {conversation.name}
                  </span>
                  <span className="shrink-0 text-[11px] text-slate-400">
                    {formatConversationDate(conversation.lastMessageAt)}
                  </span>
                </div>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="truncate text-xs text-slate-500">
                    {conversation.lastMessage ?? conversation.customStatus ?? 'Start a new message'}
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        {!loading && conversations.length === 0 && (
          <div className="px-4 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
              <svg
                className="h-6 w-6 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-700">No conversations yet</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Open a member profile in a server and tap Message to start a direct chat.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
