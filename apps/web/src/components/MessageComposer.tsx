import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useMessagesStore } from '@/stores/messages';
import { useRealtimeStore } from '@/stores/realtime';
import { useGuildStore } from '@/stores/guild';
import { EmojiPicker } from './EmojiPicker';

interface MessageComposerProps {
  channelId: string;
  channelName: string;
  replyToId?: string;
  replyAuthor?: string;
  onCancelReply?: () => void;
}

export function MessageComposer({
  channelId,
  channelName,
  replyToId,
  replyAuthor,
  onCancelReply,
}: MessageComposerProps) {
  const { sendMessage, sending } = useMessagesStore();
  const sendTyping = useRealtimeStore((s) => s.sendTyping);
  const selectedGuildId = useGuildStore((s) => s.selectedGuildId);
  const [content, setContent] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastTypingRef = useRef(0);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }
  }, [content]);

  const handleSend = useCallback(async () => {
    const trimmed = content.trim();
    if (!trimmed || sending) return;
    setContent('');
    try {
      await sendMessage(channelId, trimmed, replyToId);
      onCancelReply?.();
    } catch {
      setContent(trimmed);
    }
    textareaRef.current?.focus();
  }, [content, sending, channelId, replyToId, sendMessage, onCancelReply]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    // Throttle typing indicator
    const now = Date.now();
    if (now - lastTypingRef.current > 3000) {
      lastTypingRef.current = now;
      sendTyping(channelId, selectedGuildId ?? undefined);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setContent((prev) => prev + emoji);
    setShowEmoji(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="shrink-0 px-4 pb-4">
      {/* Reply indicator */}
      {replyToId && replyAuthor && (
        <div className="bg-elevated/50 text-text-secondary mb-1 flex items-center gap-2 rounded-t-lg px-3 py-1.5 text-xs">
          <span>Replying to</span>
          <span className="text-accent font-medium">{replyAuthor}</span>
          <button
            onClick={onCancelReply}
            className="hover:text-text-primary ml-auto transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="relative flex items-end gap-2 rounded-[24px] border border-[rgba(var(--rf-border),0.22)] bg-[rgba(var(--rf-surface),0.84)] px-4 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
        {/* File upload button */}
        <button className="text-text-secondary hover:text-text-primary mb-0.5 shrink-0 rounded-full p-1 transition-colors hover:bg-[rgba(var(--rf-base),0.42)]">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${channelName}`}
          rows={1}
          className="text-text-primary placeholder:text-text-secondary/50 max-h-[200px] flex-1 resize-none bg-transparent py-1 text-sm outline-none"
        />

        {/* Emoji picker button */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="text-text-secondary hover:text-text-primary mb-0.5 rounded-full p-1 transition-colors hover:bg-[rgba(var(--rf-base),0.42)]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          {showEmoji && (
            <div className="absolute bottom-10 right-0 z-50">
              <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmoji(false)} />
            </div>
          )}
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!content.trim() || sending}
          className="bg-accent hover:bg-accent-hover mb-0.5 shrink-0 rounded-full p-2 text-white transition-colors disabled:opacity-30"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
