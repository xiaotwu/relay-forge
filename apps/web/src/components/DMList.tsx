import React from 'react';
import { Avatar, Badge } from '@relayforge/ui';

interface DMConversation {
  id: string;
  name: string;
  avatarUrl: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  e2ee: boolean;
  status: 'online' | 'idle' | 'dnd' | 'offline';
}

// This component renders the DM list in the sidebar when no guild is selected.
// It uses placeholder data structure; actual DM data would come from a dedicated store.
export function DMList() {
  // Placeholder - in production this would come from a DM store
  const conversations: DMConversation[] = [];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-border/20 flex h-12 shrink-0 items-center border-b px-4">
        <h2 className="text-text-primary text-base font-semibold">Messages</h2>
      </div>

      {/* Search */}
      <div className="px-3 py-3">
        <div className="bg-elevated flex items-center gap-2 rounded-lg px-3 py-2">
          <svg
            className="text-text-secondary h-4 w-4 shrink-0"
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
            type="text"
            placeholder="Search conversations"
            className="text-text-primary placeholder:text-text-secondary/50 flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="scrollbar-thin flex-1 space-y-0.5 overflow-y-auto px-2">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            className="hover:bg-elevated/50 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
          >
            <Avatar src={conv.avatarUrl} name={conv.name} size="md" status={conv.status} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-text-primary truncate text-sm font-medium">{conv.name}</span>
                {conv.e2ee && (
                  <svg
                    className="text-accent h-3.5 w-3.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                )}
              </div>
              {conv.lastMessage && (
                <p className="text-text-secondary mt-0.5 truncate text-xs">{conv.lastMessage}</p>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              {conv.lastMessageAt && (
                <span className="text-text-secondary text-[10px]">
                  {new Date(conv.lastMessageAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
              {conv.unreadCount > 0 && <Badge variant="success" count={conv.unreadCount} />}
            </div>
          </button>
        ))}

        {conversations.length === 0 && (
          <div className="py-12 text-center">
            <svg
              className="text-text-secondary/30 mx-auto mb-3 h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-text-secondary text-sm">No conversations yet</p>
            <p className="text-text-secondary/60 mt-1 text-xs">Start a new message</p>
          </div>
        )}
      </div>
    </div>
  );
}
