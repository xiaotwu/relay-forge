import React from 'react';
import { Avatar } from '@relayforge/ui';
import type { DMChannel, PublicUser } from '@relayforge/types';
import {
  getConversationMeta,
  getConversationOthers,
  getConversationTitle,
} from './conversationUtils';

interface ConversationDetailsPanelProps {
  channel: DMChannel | null;
  currentUserId: string | null;
  collapsed: boolean;
  onClose: () => void;
  onOpenConversation: (user: PublicUser) => void;
  onStartCall: (user?: PublicUser) => void;
  onEditConversation: () => void;
}

export function ConversationDetailsPanel({
  channel,
  currentUserId,
  collapsed,
  onClose,
  onOpenConversation,
  onStartCall,
  onEditConversation,
}: ConversationDetailsPanelProps) {
  const [selectedProfile, setSelectedProfile] = React.useState<PublicUser | null>(null);

  if (!channel) return null;

  const others = getConversationOthers(channel, currentUserId);
  const title = getConversationTitle(channel, currentUserId);
  const meta = getConversationMeta(channel, currentUserId);
  const canEdit = channel.type === 'group_dm' && channel.ownerId === currentUserId;
  const primaryPerson = others[0] ?? null;
  const isDirectConversation = channel.type === 'dm' || others.length <= 1;

  React.useEffect(() => {
    setSelectedProfile(null);
  }, [channel.id, collapsed]);

  return (
    <aside
      className={[
        'rf-sidebar-surface relative h-full shrink-0 transition-all duration-300',
        collapsed ? 'w-0 overflow-hidden opacity-0' : 'w-[320px] opacity-100',
      ].join(' ')}
    >
      {!collapsed && (
        <div className="flex h-full flex-col bg-[rgba(var(--rf-surface),0.82)] px-5 py-5 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="rf-control flex h-11 w-11 items-center justify-center rounded-full text-[rgb(var(--rf-text-secondary))] hover:text-[rgb(var(--rf-text-primary))]"
              title="Close details"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {canEdit && (
              <button
                onClick={onEditConversation}
                className="rf-control rounded-full px-4 py-2 text-sm font-medium text-[rgb(var(--rf-text-primary))]"
              >
                Edit
              </button>
            )}
          </div>

          <div className="text-center">
            <div className="mx-auto flex justify-center gap-[-12px]">
              {others.slice(0, 2).map((participant, index) => (
                <div key={participant.id} className={index > 0 ? '-ml-3' : ''}>
                  <Avatar src={participant.avatarUrl} name={participant.displayName} size="xl" />
                </div>
              ))}
            </div>
            <h2 className="mt-4 text-[32px] font-semibold tracking-[-0.04em] text-[rgb(var(--rf-text-primary))]">
              {title}
            </h2>
            <p className="mt-1 text-sm text-[rgb(var(--rf-text-secondary))]">{meta}</p>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={() => void onStartCall()}
              className="rf-control flex h-12 w-12 items-center justify-center rounded-[18px] text-[rgb(var(--rf-text-primary))]"
              title="Start call"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.57 2.279a2 2 0 01-.502 1.913l-1.19 1.19a16.042 16.042 0 006.207 6.207l1.19-1.19a2 2 0 011.913-.502l2.279.57A2 2 0 0121 16.72V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                if (primaryPerson) {
                  void onOpenConversation(primaryPerson);
                }
              }}
              className="rf-control flex h-12 w-12 items-center justify-center rounded-[18px] text-[rgb(var(--rf-text-primary))]"
              title={isDirectConversation ? 'Direct message already open' : 'Open direct message'}
              disabled={!primaryPerson || isDirectConversation}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M4 6.75A2.75 2.75 0 016.75 4h10.5A2.75 2.75 0 0120 6.75v7.5A2.75 2.75 0 0117.25 17H9l-5 3v-3.5A2.75 2.75 0 014 14.25v-7.5z"
                />
              </svg>
            </button>
          </div>

          <div className="mt-6 flex-1 overflow-y-auto">
            <div className="mb-4 flex items-center gap-3">
              <button className="rounded-full bg-[rgb(var(--rf-text-primary))] px-3 py-1.5 text-sm font-medium text-[rgb(var(--rf-base))]">
                Info
              </button>
            </div>

            <div className="rounded-[24px] border border-[rgba(var(--rf-border),0.16)] bg-[rgba(var(--rf-base),0.22)] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--rf-text-tertiary))]">
                People
              </p>
              <div className="mt-4 space-y-3">
                {others.map((participant) => (
                  <button
                    key={participant.id}
                    onClick={() => setSelectedProfile(participant)}
                    className="flex w-full items-center gap-3 rounded-[18px] px-2 py-2 text-left transition hover:bg-[rgba(var(--rf-elevated),0.72)]"
                  >
                    <Avatar
                      src={participant.avatarUrl}
                      name={participant.displayName}
                      size="md"
                      status={participant.status}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                        {participant.displayName}
                      </p>
                      <p className="truncate text-xs text-[rgb(var(--rf-text-secondary))]">
                        {participant.customStatus ?? `@${participant.username}`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedProfile && (
            <div className="absolute inset-x-5 bottom-5 rounded-[24px] border border-[rgba(var(--rf-border),0.16)] bg-[rgba(var(--rf-surface),0.98)] p-4 shadow-[0_22px_48px_rgba(15,23,42,0.2)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={selectedProfile.avatarUrl}
                    name={selectedProfile.displayName}
                    size="lg"
                    status={selectedProfile.status}
                  />
                  <div>
                    <p className="text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                      {selectedProfile.displayName}
                    </p>
                    <p className="text-xs text-[rgb(var(--rf-text-secondary))]">
                      @{selectedProfile.username}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="rounded-full p-1.5 text-[rgb(var(--rf-text-secondary))] transition hover:bg-[rgba(var(--rf-base),0.3)] hover:text-[rgb(var(--rf-text-primary))]"
                  title="Close profile"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    void onOpenConversation(selectedProfile);
                    setSelectedProfile(null);
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-[rgba(var(--rf-border),0.18)] bg-[rgba(var(--rf-base),0.26)] text-[rgb(var(--rf-text-primary))] transition hover:bg-[rgba(var(--rf-elevated),0.72)]"
                  title="Open direct message"
                >
                  <svg
                    className="h-4.5 w-4.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M4 6.75A2.75 2.75 0 016.75 4h10.5A2.75 2.75 0 0120 6.75v7.5A2.75 2.75 0 0117.25 17H9l-5 3v-3.5A2.75 2.75 0 014 14.25v-7.5z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    void onStartCall(selectedProfile);
                    setSelectedProfile(null);
                  }}
                  className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-[rgba(var(--rf-border),0.18)] bg-[rgba(var(--rf-base),0.26)] text-[rgb(var(--rf-text-primary))] transition hover:bg-[rgba(var(--rf-elevated),0.72)]"
                  title="Start private call"
                >
                  <svg
                    className="h-4.5 w-4.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.57 2.279a2 2 0 01-.502 1.913l-1.19 1.19a16.042 16.042 0 006.207 6.207l1.19-1.19a2 2 0 011.913-.502l2.279.57A2 2 0 0121 16.72V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
