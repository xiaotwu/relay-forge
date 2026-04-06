import React, { useState } from 'react';
import type { Message } from '@relayforge/types';
import { Avatar } from '@relayforge/ui';
import { useAuthStore } from '@/stores/auth';
import { useMessagesStore } from '@/stores/messages';
import { renderMarkdown } from '@/utils/markdown';

interface MessageItemProps {
  message: Message;
  showHeader: boolean;
  onReply?: (message: Message) => void;
}

export function MessageItem({ message, showHeader, onReply }: MessageItemProps) {
  const currentUser = useAuthStore((s) => s.user);
  const { deleteMessage, editMessage, addReaction, removeReaction } = useMessagesStore();
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const isOwn = currentUser?.id === message.author.id;
  const timestamp = new Date(message.createdAt);
  const timeStr = timestamp.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const handleEdit = async () => {
    if (editContent.trim() && editContent !== message.content) {
      await editMessage(message.channelId, message.id, editContent.trim());
    }
    setEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    }
    if (e.key === 'Escape') {
      setEditing(false);
      setEditContent(message.content);
    }
  };

  const handleReactionToggle = async (emoji: string) => {
    const existingReaction = message.reactions.find((reaction) => reaction.emoji === emoji);
    if (existingReaction?.me) {
      await removeReaction(message.channelId, message.id, emoji);
      return;
    }

    await addReaction(message.channelId, message.id, emoji);
  };

  return (
    <div
      className={`group relative mx-2 rounded-[24px] px-4 transition-colors ${
        hovered
          ? 'bg-[rgba(var(--rf-surface),0.46)] backdrop-blur-sm'
          : 'hover:bg-[rgba(var(--rf-surface),0.32)]'
      } ${showHeader ? 'pt-2' : 'pt-0.5'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Reply reference */}
      {message.replyTo && (
        <div className="text-text-secondary mb-1 ml-12 flex items-center gap-2 text-xs">
          <div className="border-border/40 h-3 w-5 rounded-tl-md border-l-2 border-t-2" />
          <Avatar
            src={message.replyTo.author.avatarUrl}
            name={message.replyTo.author.displayName}
            size="xs"
          />
          <span className="text-text-primary/70 font-medium tracking-[-0.01em]">
            {message.replyTo.author.displayName}
          </span>
          <span className="truncate opacity-70">{message.replyTo.content}</span>
        </div>
      )}

      <div className="flex gap-3">
        {/* Avatar or timestamp gutter */}
        <div className="flex w-10 shrink-0 justify-center">
          {showHeader ? (
            <Avatar src={message.author.avatarUrl} name={message.author.displayName} size="sm" />
          ) : (
            <span className="text-text-secondary mt-0.5 text-[10px] opacity-0 transition-opacity group-hover:opacity-100">
              {timeStr}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {showHeader && (
            <div className="mb-0.5 flex items-baseline gap-2">
              <span className="text-text-primary cursor-pointer text-sm font-semibold tracking-[-0.02em] hover:underline">
                {message.author.displayName}
              </span>
              <span className="text-text-secondary text-[11px]">{timeStr}</span>
              {message.edited && (
                <span className="text-text-secondary/60 text-[10px]">(edited)</span>
              )}
            </div>
          )}

          {editing ? (
            <div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleEditKeyDown}
                className="bg-elevated text-text-primary focus:ring-accent/50 w-full resize-none rounded-2xl border border-[rgba(var(--rf-border),0.22)] px-3 py-2 text-sm outline-none focus:ring-1"
                rows={2}
                autoFocus
              />
              <p className="text-text-secondary mt-1 text-[11px]">
                Enter to save, Escape to cancel
              </p>
            </div>
          ) : (
            <div className="text-text-primary/90 break-words text-[14px] leading-7">
              {renderMarkdown(message.content)}
            </div>
          )}

          {/* Attachments */}
          {message.attachments.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {message.attachments.map((att) => {
                const isImage = att.contentType.startsWith('image/');
                return isImage ? (
                  <a
                    key={att.id}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block max-w-sm"
                  >
                    <img
                      src={att.proxyUrl || att.url}
                      alt={att.filename}
                      className="max-h-80 rounded-2xl border border-[rgba(var(--rf-border),0.18)] object-contain shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                      loading="lazy"
                    />
                  </a>
                ) : (
                  <a
                    key={att.id}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-elevated text-accent flex items-center gap-2 rounded-2xl border border-[rgba(var(--rf-border),0.18)] px-3 py-2 text-sm hover:underline"
                  >
                    <svg
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="truncate">{att.filename}</span>
                    <span className="text-text-secondary shrink-0 text-xs">
                      {(att.size / 1024).toFixed(0)} KB
                    </span>
                  </a>
                );
              })}
            </div>
          )}

          {/* Reactions */}
          {message.reactions.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {message.reactions.map((r) => (
                <button
                  key={r.emoji}
                  onClick={() => void handleReactionToggle(r.emoji)}
                  className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors ${
                    r.me
                      ? 'bg-accent/20 border-accent/40 text-accent'
                      : 'bg-elevated border-border/30 text-text-secondary hover:border-border/50'
                  }`}
                >
                  <span>{r.emoji}</span>
                  <span>{r.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hover actions */}
      {hovered && !editing && (
        <div className="animate-fade-scale absolute -top-3 right-4 flex items-center overflow-hidden rounded-2xl border border-[rgba(var(--rf-border),0.24)] bg-[rgba(var(--rf-surface),0.94)] shadow-[0_18px_40px_rgba(15,23,42,0.14)] backdrop-blur-xl">
          <button
            onClick={() => onReply?.(message)}
            className="text-text-secondary hover:text-text-primary px-2.5 py-2 transition-colors hover:bg-[rgba(var(--rf-base),0.4)]"
            title="Reply"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
          </button>
          <div className="relative">
            <button
              onClick={() => setShowReactionPicker((value) => !value)}
              className="text-text-secondary hover:text-text-primary px-2.5 py-2 transition-colors hover:bg-[rgba(var(--rf-base),0.4)]"
              title="Add reaction"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
            {showReactionPicker && (
              <div className="absolute right-0 top-12 z-20">
                <div className="grid grid-cols-4 gap-1 rounded-2xl border border-[rgba(var(--rf-border),0.24)] bg-[rgba(var(--rf-surface),0.98)] p-2 shadow-[0_18px_40px_rgba(15,23,42,0.14)] backdrop-blur-xl">
                  {['👍', '❤️', '😂', '🎉', '🔥', '✅', '👀', '👏'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        void handleReactionToggle(emoji);
                        setShowReactionPicker(false);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-lg transition-colors hover:bg-[rgba(var(--rf-base),0.42)]"
                      title={`React with ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {isOwn && (
            <>
              <button
                onClick={() => {
                  setEditing(true);
                  setEditContent(message.content);
                }}
                className="text-text-secondary hover:text-text-primary px-2.5 py-2 transition-colors hover:bg-[rgba(var(--rf-base),0.4)]"
                title="Edit"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={() => deleteMessage(message.channelId, message.id)}
                className="text-text-secondary px-2.5 py-2 transition-colors hover:bg-[rgba(var(--rf-base),0.4)] hover:text-red-500"
                title="Delete"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
