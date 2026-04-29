import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { DMMessage } from '@relayforge/types';
import { useDMStore } from '@/stores/dm';
import { useToast } from '@relayforge/ui';
import { getCurrentConnection } from '@/lib/serverConnections';
import { MAX_UPLOAD_SIZE } from '@relayforge/config';
import { getApiClient } from '@/stores/auth';
import { buildMessageContent } from '@/lib/messageContent';

interface DMComposerProps {
  channelId: string;
  placeholder: string;
  replyTo?: DMMessage | null;
  onClearReply?: () => void;
}

export function DMComposer({ channelId, placeholder, replyTo, onClearReply }: DMComposerProps) {
  const [content, setContent] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<
    Array<{ filename: string; url: string }>
  >([]);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sendMessage = useDMStore((state) => state.sendMessage);
  const sending = useDMStore((state) => state.sending);
  const { addToast } = useToast();

  useEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 180)}px`;
  }, [content]);

  const handleSend = useCallback(async () => {
    const payload = buildMessageContent(content, pendingAttachments);
    if (!payload || sending || uploading) return;

    const previousContent = content;
    const previousAttachments = pendingAttachments;
    setContent('');
    setPendingAttachments([]);
    try {
      await sendMessage(channelId, payload, replyTo?.id);
      onClearReply?.();
    } catch {
      setContent(previousContent);
      setPendingAttachments(previousAttachments);
    }
  }, [
    channelId,
    content,
    onClearReply,
    pendingAttachments,
    replyTo?.id,
    sendMessage,
    sending,
    uploading,
  ]);

  const uploadAttachment = useCallback(
    async (file: File) => {
      const mediaBaseUrl = getCurrentConnection().mediaBaseUrl;
      const client = getApiClient();
      const presign = await client.createPresignedUpload({
        filename: file.name,
        contentType: file.type,
        size: file.size,
      });

      const uploadResponse = await fetch(presign.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Could not upload this file.');
      }

      const completed = await client.completeUpload({
        fileId: presign.fileId,
        key: presign.key,
        filename: file.name,
        contentType: file.type,
        size: file.size,
        ownerType: 'dm_channel',
        ownerId: channelId,
      });

      return completed.proxyUrl ?? completed.url ?? `${mediaBaseUrl}/media/files/${presign.fileId}`;
    },
    [channelId],
  );

  const handleAttachmentChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > MAX_UPLOAD_SIZE) {
        addToast('error', 'Please choose a file smaller than 25 MB.');
        event.target.value = '';
        return;
      }

      setUploading(true);
      try {
        const attachmentUrl = await uploadAttachment(file);
        setPendingAttachments((current) => [
          ...current,
          { filename: file.name, url: attachmentUrl },
        ]);
        addToast('success', 'Attachment uploaded.');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Could not upload this file.';
        addToast('error', message);
      } finally {
        setUploading(false);
        event.target.value = '';
      }
    },
    [addToast, uploadAttachment],
  );

  return (
    <div className="shrink-0 bg-[rgba(var(--rf-surface),0.32)] px-4 py-4 backdrop-blur md:px-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-2 rounded-[28px] border border-[rgba(var(--rf-border),0.16)] bg-[rgba(var(--rf-surface),0.78)] px-4 py-3 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
        {pendingAttachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1 pb-1">
            {pendingAttachments.map((attachment) => (
              <div
                key={`${attachment.filename}-${attachment.url}`}
                className="flex max-w-full items-center gap-2 rounded-full bg-[rgba(var(--rf-base),0.34)] px-3 py-2 text-sm text-[rgb(var(--rf-text-primary))]"
              >
                <span className="truncate">{attachment.filename}</span>
                <button
                  type="button"
                  onClick={() =>
                    setPendingAttachments((current) =>
                      current.filter((item) => item.url !== attachment.url),
                    )
                  }
                  className="rounded-full p-1 text-[rgb(var(--rf-text-secondary))] transition hover:bg-[rgba(var(--rf-base),0.42)] hover:text-[rgb(var(--rf-text-primary))]"
                  title={`Remove ${attachment.filename}`}
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {replyTo && (
          <div className="flex items-start justify-between rounded-[18px] bg-[rgba(var(--rf-base),0.34)] px-3 py-2">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgb(var(--rf-accent-light))]">
                Replying to {replyTo.author.displayName}
              </p>
              <p className="mt-1 truncate text-sm text-[rgb(var(--rf-text-secondary))]">
                {replyTo.content}
              </p>
            </div>
            <button
              onClick={onClearReply}
              className="ml-3 shrink-0 rounded-full p-1.5 text-[rgb(var(--rf-text-secondary))] transition hover:bg-[rgba(var(--rf-base),0.36)] hover:text-[rgb(var(--rf-text-primary))]"
              title="Clear reply"
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

        <div className="flex items-end gap-3">
          <button
            className="rounded-full p-2 text-[rgb(var(--rf-text-secondary))] transition-colors hover:bg-[rgba(var(--rf-base),0.42)] hover:text-[rgb(var(--rf-text-primary))]"
            title="Attach"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleAttachmentChange}
          />

          <div className="min-w-0 flex-1 rounded-[22px] bg-[rgba(var(--rf-base),0.28)] px-3 py-2">
            <textarea
              ref={textareaRef}
              rows={1}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void handleSend();
                }
              }}
              placeholder={placeholder}
              className="max-h-[180px] flex-1 resize-none bg-transparent py-1 text-sm leading-6 text-[rgb(var(--rf-text-primary))] outline-none [-webkit-text-fill-color:rgb(var(--rf-text-primary))] placeholder:text-[rgba(var(--rf-text-secondary),0.75)] placeholder:opacity-100"
            />
          </div>

          <button
            onClick={() => void handleSend()}
            disabled={(!content.trim() && pendingAttachments.length === 0) || sending || uploading}
            className="rounded-full bg-[rgb(var(--rf-accent))] p-3 text-white shadow-[0_12px_24px_rgba(16,185,129,0.28)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgb(var(--rf-accent-hover))] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40"
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
    </div>
  );
}
