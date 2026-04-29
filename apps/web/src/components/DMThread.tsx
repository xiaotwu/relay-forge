import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { DMMessage } from '@relayforge/types';
import { Avatar } from '@relayforge/ui';
import { useAuthStore } from '@/stores/auth';
import { useDMStore } from '@/stores/dm';
import { parseMessageContent, resolveAttachmentUrl } from '@/lib/messageContent';
import { getCurrentConnection } from '@/lib/serverConnections';

interface DMThreadProps {
  channelId: string;
  onReply?: (message: DMMessage) => void;
}

const EMPTY_MESSAGES: ReturnType<typeof useDMStore.getState>['messagesByChannel'][string] = [];

export function DMThread({ channelId, onReply }: DMThreadProps) {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const accessToken = useAuthStore((state) => state.accessToken);
  const messages = useDMStore((state) => state.messagesByChannel[channelId] ?? EMPTY_MESSAGES);
  const fetchMessages = useDMStore((state) => state.fetchMessages);
  const deleteMessage = useDMStore((state) => state.deleteMessage);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [localReactions, setLocalReactions] = useState<
    Record<string, Array<{ emoji: string; count: number; me: boolean }>>
  >({});
  const [menu, setMenu] = useState<{
    x: number;
    y: number;
    message: DMMessage;
  } | null>(null);

  useEffect(() => {
    fetchMessages(channelId);
  }, [channelId, fetchMessages]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      void fetchMessages(channelId);
    }, 2500);

    return () => window.clearInterval(timer);
  }, [channelId, fetchMessages]);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    requestAnimationFrame(() => {
      element.scrollTop = element.scrollHeight;
    });
  }, [messages.length, channelId]);

  useEffect(() => {
    const handleClose = () => setMenu(null);
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenu(null);
      }
    };
    window.addEventListener('click', handleClose);
    window.addEventListener('contextmenu', handleClose);
    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('click', handleClose);
      window.removeEventListener('contextmenu', handleClose);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const items = useMemo(() => {
    const groups: Array<{ type: 'date'; value: string } | { type: 'message'; index: number }> = [];
    let lastDate = '';
    for (let index = 0; index < messages.length; index += 1) {
      const dateLabel = new Date(messages[index].createdAt).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      if (dateLabel !== lastDate) {
        groups.push({ type: 'date', value: dateLabel });
        lastDate = dateLabel;
      }
      groups.push({ type: 'message', index });
    }
    return groups;
  }, [messages]);

  const messageMap = useMemo(
    () => new Map(messages.map((message) => [message.id, message])),
    [messages],
  );

  const toggleReaction = (messageId: string, emoji: string) => {
    setLocalReactions((current) => {
      const existing = current[messageId] ?? [];
      const match = existing.find((reaction) => reaction.emoji === emoji);
      const next = match
        ? existing.filter((reaction) => reaction.emoji !== emoji)
        : [...existing, { emoji, count: 1, me: true }];

      return {
        ...current,
        [messageId]: next,
      };
    });
  };

  return (
    <div
      ref={scrollRef}
      className="chat-wallpaper scrollbar-thin relative flex-1 overflow-y-auto px-4 py-5 md:px-6"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4">
        {items.map((item, itemIndex) => {
          if (item.type === 'date') {
            return (
              <div key={`date-${item.value}-${itemIndex}`} className="flex justify-center py-2">
                <span className="rounded-full bg-[rgba(var(--rf-surface),0.7)] px-3 py-1 text-[11px] font-medium text-[rgb(var(--rf-text-secondary))] backdrop-blur">
                  {item.value}
                </span>
              </div>
            );
          }

          const message = messages[item.index];
          const isOwn = message.authorId === currentUserId;
          const repliedMessage = message.replyToId ? messageMap.get(message.replyToId) : null;
          const parsed = parseMessageContent(message.content);
          const mediaBaseUrl = getCurrentConnection().mediaBaseUrl;

          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              onContextMenu={(event) => {
                event.preventDefault();
                setMenu({
                  x: event.clientX,
                  y: event.clientY,
                  message,
                });
              }}
            >
              <div className={`flex max-w-[76%] flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                {!isOwn && (
                  <div className="mb-1 flex items-center gap-2 px-1">
                    <Avatar
                      src={message.author.avatarUrl}
                      name={message.author.displayName}
                      size="xs"
                    />
                    <span className="text-[11px] font-medium text-[rgb(var(--rf-text-secondary))]">
                      {message.author.displayName}
                    </span>
                  </div>
                )}
                <div
                  className={[
                    'rounded-[20px] px-4 py-3 shadow-[0_10px_30px_rgba(15,23,42,0.08)]',
                    isOwn
                      ? 'bg-[rgb(var(--rf-accent))] text-white'
                      : 'bg-[rgba(var(--rf-surface),0.88)] text-[rgb(var(--rf-text-primary))]',
                  ].join(' ')}
                >
                  {repliedMessage && (
                    <div
                      className={`mb-2 rounded-[14px] px-3 py-2 text-xs ${
                        isOwn
                          ? 'bg-white/12 text-white/80'
                          : 'bg-[rgba(var(--rf-base),0.36)] text-[rgb(var(--rf-text-secondary))]'
                      }`}
                    >
                      <p className="font-medium">{repliedMessage.author.displayName}</p>
                      <p className="truncate">{repliedMessage.content}</p>
                    </div>
                  )}
                  {parsed.text ? (
                    <p className="whitespace-pre-wrap text-sm leading-6">{parsed.text}</p>
                  ) : null}
                  {parsed.attachments.length > 0 && (
                    <div className={`mt-3 space-y-3 ${parsed.text ? '' : 'mt-0'}`}>
                      {parsed.attachments.map((attachment) => (
                        <div
                          key={`${message.id}-${attachment.url}`}
                          className={`overflow-hidden rounded-[16px] border ${
                            isOwn
                              ? 'border-white/14 bg-white/8'
                              : 'border-[rgba(var(--rf-border),0.18)] bg-[rgba(var(--rf-base),0.22)]'
                          }`}
                        >
                          {attachment.isImage && (
                            <a
                              href={resolveAttachmentUrl(attachment.url, mediaBaseUrl, accessToken)}
                              download={attachment.filename}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img
                                src={resolveAttachmentUrl(attachment.url, mediaBaseUrl, accessToken)}
                                alt={attachment.filename}
                                className="max-h-[320px] w-full object-cover"
                              />
                            </a>
                          )}
                          <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{attachment.filename}</p>
                              <p
                                className={`text-[11px] ${
                                  isOwn ? 'text-white/72' : 'text-[rgb(var(--rf-text-secondary))]'
                                }`}
                              >
                                {attachment.isImage ? 'Image attachment' : 'File attachment'}
                              </p>
                            </div>
                            <a
                              href={resolveAttachmentUrl(attachment.url, mediaBaseUrl, accessToken)}
                              download={attachment.filename}
                              target="_blank"
                              rel="noreferrer"
                              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                isOwn
                                  ? 'bg-white/14 text-white hover:bg-white/20'
                                  : 'bg-[rgba(var(--rf-surface),0.78)] text-[rgb(var(--rf-text-primary))] hover:bg-[rgba(var(--rf-surface),0.92)]'
                              }`}
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div
                    className={`mt-2 text-right text-[11px] ${
                      isOwn ? 'text-white/72' : 'text-[rgb(var(--rf-text-secondary))]'
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
                {(localReactions[message.id] ?? []).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 px-1">
                    {(localReactions[message.id] ?? []).map((reaction) => (
                      <button
                        key={reaction.emoji}
                        onClick={() => toggleReaction(message.id, reaction.emoji)}
                        className={[
                          'rounded-full border px-2.5 py-1 text-xs transition',
                          reaction.me
                            ? 'border-[rgba(var(--rf-accent),0.36)] bg-[rgba(var(--rf-accent),0.12)] text-[rgb(var(--rf-text-primary))]'
                            : 'border-[rgba(var(--rf-border),0.22)] bg-[rgba(var(--rf-surface),0.64)] text-[rgb(var(--rf-text-secondary))]',
                        ].join(' ')}
                      >
                        <span>{reaction.emoji}</span>
                        <span className="ml-1 font-medium">{reaction.count}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {messages.length === 0 && <div className="min-h-[280px]" />}
      </div>

      {menu && (
        <div
          className="fixed z-50 min-w-[190px] overflow-hidden rounded-[18px] border border-[rgba(var(--rf-border),0.22)] bg-[rgba(var(--rf-surface),0.96)] shadow-[0_24px_60px_rgba(15,23,42,0.2)] backdrop-blur-xl"
          style={{
            left: Math.min(menu.x, window.innerWidth - 220),
            top: Math.min(menu.y, window.innerHeight - 260),
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex gap-1 border-b border-[rgba(var(--rf-border),0.16)] px-3 py-2">
            {['👍', '❤️', '😂', '🎉'].map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  toggleReaction(menu.message.id, emoji);
                  setMenu(null);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-lg transition hover:bg-[rgba(var(--rf-base),0.34)]"
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              onReply?.(menu.message);
              setMenu(null);
            }}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-[rgb(var(--rf-text-primary))] transition hover:bg-[rgba(var(--rf-base),0.3)]"
          >
            <span>Reply</span>
          </button>
          <button
            onClick={() => {
              void navigator.clipboard.writeText(menu.message.content);
              setMenu(null);
            }}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-[rgb(var(--rf-text-primary))] transition hover:bg-[rgba(var(--rf-base),0.3)]"
          >
            <span>Forward</span>
          </button>
          <button
            onClick={() => {
              void navigator.clipboard.writeText(menu.message.content);
              setMenu(null);
            }}
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-[rgb(var(--rf-text-primary))] transition hover:bg-[rgba(var(--rf-base),0.3)]"
          >
            <span>Copy text</span>
          </button>
          {menu.message.authorId === currentUserId && (
            <button
              onClick={() => {
                void deleteMessage(menu.message.channelId, menu.message.id);
                setMenu(null);
              }}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-red-400 transition hover:bg-[rgba(var(--rf-base),0.3)]"
            >
              <span>Recall</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
