import React, { useEffect, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMessagesStore } from '@/stores/messages';
import { useRealtimeStore } from '@/stores/realtime';
import { MessageItem } from './MessageItem';
import { Spinner } from '@relayforge/ui';

interface MessageTimelineProps {
  channelId: string;
}

export function MessageTimeline({ channelId }: MessageTimelineProps) {
  const { messagesByChannel, hasMore, fetchMessages } = useMessagesStore();
  const typingUsers = useRealtimeStore((s) => s.typingUsers[channelId] ?? []);
  const messages = messagesByChannel[channelId] ?? [];
  const parentRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const prevMessagesLengthRef = useRef(0);
  const isInitialLoadRef = useRef(true);

  // Initial fetch
  useEffect(() => {
    isInitialLoadRef.current = true;
    fetchMessages(channelId).then(() => {
      // Scroll to bottom on initial load
      requestAnimationFrame(() => {
        if (parentRef.current) {
          parentRef.current.scrollTop = parentRef.current.scrollHeight;
        }
      });
    });
  }, [channelId, fetchMessages]);

  // Scroll to bottom on new messages (only if already near bottom)
  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current && !isInitialLoadRef.current) {
      const el = parentRef.current;
      if (el) {
        const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
        if (isNearBottom) {
          requestAnimationFrame(() => {
            el.scrollTop = el.scrollHeight;
          });
        }
      }
    }
    prevMessagesLengthRef.current = messages.length;
    isInitialLoadRef.current = false;
  }, [messages.length]);

  // Build display items: date separators + messages
  const items: Array<{ type: 'separator'; date: string } | { type: 'message'; index: number }> = [];
  let lastDate = '';
  for (let i = 0; i < messages.length; i++) {
    const msgDate = new Date(messages[i].createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (msgDate !== lastDate) {
      items.push({ type: 'separator', date: msgDate });
      lastDate = msgDate;
    }
    items.push({ type: 'message', index: i });
  }

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const item = items[index];
      return item.type === 'separator' ? 40 : 52;
    },
    overscan: 10,
  });

  const handleScroll = useCallback(() => {
    const el = parentRef.current;
    if (!el || loadingRef.current) return;

    if (el.scrollTop < 200 && hasMore[channelId]) {
      loadingRef.current = true;
      const firstMsg = messages[0];
      if (firstMsg) {
        const prevScrollHeight = el.scrollHeight;
        fetchMessages(channelId, firstMsg.id).then(() => {
          // Maintain scroll position
          requestAnimationFrame(() => {
            if (el) {
              el.scrollTop = el.scrollHeight - prevScrollHeight;
            }
          });
          loadingRef.current = false;
        });
      } else {
        loadingRef.current = false;
      }
    }
  }, [channelId, messages, hasMore, fetchMessages]);

  // Check if a message should show the author header (first in a group)
  const isGroupStart = (msgIndex: number): boolean => {
    if (msgIndex === 0) return true;
    const prev = messages[msgIndex - 1];
    const curr = messages[msgIndex];
    if (prev.author.id !== curr.author.id) return true;
    // Group messages within 5 minutes
    const timeDiff = new Date(curr.createdAt).getTime() - new Date(prev.createdAt).getTime();
    return timeDiff > 5 * 60 * 1000;
  };

  const activeTypers = typingUsers.filter((t) => t.expiresAt > Date.now());

  return (
    <div ref={parentRef} onScroll={handleScroll} className="scrollbar-thin flex-1 overflow-y-auto">
      {hasMore[channelId] && (
        <div className="flex justify-center py-4">
          <Spinner size="sm" />
        </div>
      )}

      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = items[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
            >
              {item.type === 'separator' ? (
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="bg-border/30 h-px flex-1" />
                  <span className="text-text-secondary text-xs font-medium">{item.date}</span>
                  <div className="bg-border/30 h-px flex-1" />
                </div>
              ) : (
                <MessageItem message={messages[item.index]} showHeader={isGroupStart(item.index)} />
              )}
            </div>
          );
        })}
      </div>

      {/* Typing indicator */}
      {activeTypers.length > 0 && (
        <div className="text-text-secondary px-4 py-1 text-xs">
          <span className="inline-flex items-center gap-1">
            <span className="flex gap-0.5">
              <span
                className="bg-text-secondary h-1.5 w-1.5 animate-bounce rounded-full"
                style={{ animationDelay: '0ms' }}
              />
              <span
                className="bg-text-secondary h-1.5 w-1.5 animate-bounce rounded-full"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="bg-text-secondary h-1.5 w-1.5 animate-bounce rounded-full"
                style={{ animationDelay: '300ms' }}
              />
            </span>
            <span className="ml-1">
              {activeTypers.length === 1
                ? `${activeTypers[0].username} is typing`
                : `${activeTypers.map((t) => t.username).join(', ')} are typing`}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
