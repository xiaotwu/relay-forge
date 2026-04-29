import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, Button, Input, Modal } from '@relayforge/ui';
import type { DMMessage, PublicUser } from '@relayforge/types';
import { getApiClient } from '@/stores/auth';
import { useAuthStore } from '@/stores/auth';
import { useDMStore } from '@/stores/dm';
import { useGuildStore } from '@/stores/guild';
import { useRealtimeStore } from '@/stores/realtime';
import { ChannelList } from '@/components/ChannelList';
import { ConversationSidebar } from '@/components/ConversationSidebar';
import { ConversationDetailsPanel } from '@/components/ConversationDetailsPanel';
import { DMComposer } from '@/components/DMComposer';
import { DMThread } from '@/components/DMThread';
import { GuildSidebar } from '@/components/GuildSidebar';
import { MemberList } from '@/components/MemberList';
import { MessageComposer } from '@/components/MessageComposer';
import { MessageTimeline } from '@/components/MessageTimeline';
import { SettingsModal } from '@/components/SettingsModal';
import { VoiceChannel } from '@/components/VoiceChannel';
import {
  getConversationParticipantCount,
  getConversationOthers,
  getConversationTitle,
} from '@/components/conversationUtils';

function useViewportWidth() {
  const [width, setWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}

export function MainPage() {
  const viewportWidth = useViewportWidth();
  const isCompact = viewportWidth < 1180;
  const { user } = useAuthStore();
  const accessToken = useAuthStore((state) => state.accessToken);
  const {
    channels,
    selectedChannelId,
    fetchChannels,
    selectChannel,
    openConversation,
    fetchMessages,
    createConversation,
    updateChannel,
  } = useDMStore();
  const {
    guilds,
    selectedGuildId,
    channels: guildChannels,
    members: guildMembers,
    selectedChannelId: selectedGuildChannelId,
    fetchGuilds,
  } = useGuildStore();
  const { connect, disconnect } = useRealtimeStore();

  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCallMode, setActiveCallMode] = useState<'call' | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [composeQuery, setComposeQuery] = useState('');
  const [composeResults, setComposeResults] = useState<PublicUser[]>([]);
  const [composeSelection, setComposeSelection] = useState<PublicUser[]>([]);
  const [conversationName, setConversationName] = useState('');
  const [submittingCompose, setSubmittingCompose] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [replyTarget, setReplyTarget] = useState<DMMessage | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    void Promise.all([fetchChannels(), fetchGuilds()]).finally(() => {
      if (!cancelled) connect();
    });
    return () => {
      cancelled = true;
      disconnect();
    };
  }, [fetchChannels, fetchGuilds, connect, disconnect]);

  useEffect(() => {
    const refreshChannels = () => {
      if (!accessToken) return;
      void fetchChannels();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshChannels();
      }
    };

    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshChannels();
      }
    }, 5000);

    window.addEventListener('focus', refreshChannels);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refreshChannels);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [accessToken, fetchChannels]);

  const selectedChannel = channels.find((channel) => channel.id === selectedChannelId) ?? null;
  const selectedGuild = guilds.find((guild) => guild.id === selectedGuildId) ?? null;
  const selectedGuildChannel =
    guildChannels.find((channel) => channel.id === selectedGuildChannelId) ?? null;
  const conversationOthers = useMemo(
    () => (selectedChannel ? getConversationOthers(selectedChannel, user?.id) : []),
    [selectedChannel, user?.id],
  );

  const conversationVoiceUsers = useMemo(() => {
    if (!selectedChannel) return [];
    return selectedChannel.participants.map((participant) => ({
      user: participant,
      speaking: false,
      muted: false,
      deafened: false,
    }));
  }, [selectedChannel]);

  const guildVoiceUsers = useMemo(
    () =>
      guildMembers.map((member) => {
        const raw = member as typeof member & {
          user?: PublicUser;
          userId?: string;
          isMuted?: boolean;
          isDeafened?: boolean;
        };
        const fallbackName =
          member.nickname ?? raw.user?.displayName ?? raw.user?.username ?? 'Member';
        return {
          user:
            raw.user ??
            ({
              id: raw.userId ?? member.guildId,
              username: fallbackName,
              displayName: fallbackName,
              avatarUrl: null,
              bannerUrl: null,
              bio: null,
              status: 'offline',
              customStatus: null,
            } satisfies PublicUser),
          speaking: false,
          muted: raw.isMuted ?? member.mute ?? false,
          deafened: raw.isDeafened ?? member.deaf ?? false,
        };
      }),
    [guildMembers],
  );

  useEffect(() => {
    if (!composeOpen) return;

    let cancelled = false;
    const loadUsers = async () => {
      try {
        const res = await getApiClient().searchUsers(composeQuery.trim());
        if (!cancelled) {
          setComposeResults(Array.isArray(res.data) ? (res.data as PublicUser[]) : []);
        }
      } catch {
        if (!cancelled) {
          setComposeResults([]);
        }
      }
    };

    void loadUsers();
    return () => {
      cancelled = true;
    };
  }, [composeOpen, composeQuery]);

  useEffect(() => {
    if (!editOpen) {
      setEditingName(selectedChannel?.name ?? '');
    }
  }, [editOpen, selectedChannel?.name]);

  const openDetailsPanel = () => {
    setRightCollapsed(false);
  };

  const closeDetailsPanel = () => {
    setRightCollapsed(true);
  };

  const handleSelectConversation = (channelId: string) => {
    selectChannel(channelId);
    void fetchMessages(channelId);
    setActiveCallMode(null);
    setReplyTarget(null);
  };

  const handleStartCall = async (targetUser?: PublicUser) => {
    if (targetUser) {
      await openConversation(targetUser);
      setRightCollapsed(true);
      setReplyTarget(null);
    }
    if (!useDMStore.getState().selectedChannelId) return;
    setActiveCallMode('call');
  };

  const handleOpenConversation = async (targetUser: PublicUser) => {
    await openConversation(targetUser);
    setRightCollapsed(true);
    setActiveCallMode(null);
    setReplyTarget(null);
  };

  const toggleComposeSelection = (person: PublicUser) => {
    setComposeSelection((current) =>
      current.some((item) => item.id === person.id)
        ? current.filter((item) => item.id !== person.id)
        : [...current, person],
    );
  };

  const resetCompose = () => {
    setComposeOpen(false);
    setComposeQuery('');
    setComposeResults([]);
    setComposeSelection([]);
    setConversationName('');
  };

  const handleCreateConversation = async () => {
    if (composeSelection.length === 0) return;
    setSubmittingCompose(true);
    try {
      const channel = await createConversation({
        participantIds: composeSelection.map((person) => person.id),
        name: composeSelection.length > 1 ? conversationName.trim() || undefined : undefined,
      });
      resetCompose();
      selectChannel(channel.id);
    } finally {
      setSubmittingCompose(false);
    }
  };

  const handleSaveConversation = async () => {
    if (!selectedChannel) return;
    setSavingEdit(true);
    try {
      const channel = await updateChannel(selectedChannel.id, editingName.trim());
      setEditOpen(false);
      setEditingName(channel.name ?? '');
    } finally {
      setSavingEdit(false);
    }
  };

  const conversationTitle = selectedChannel ? getConversationTitle(selectedChannel, user?.id) : '';
  const participantCount = selectedChannel
    ? getConversationParticipantCount(selectedChannel, user?.id)
    : 0;
  const isGroupConversation = selectedChannel
    ? selectedChannel.type === 'group_dm' || conversationOthers.length > 1
    : false;

  return (
    <>
      <div className="ambient-shell flex h-screen w-screen overflow-hidden text-[rgb(var(--rf-text-primary))]">
        <GuildSidebar onOpenSettings={() => setSettingsOpen(true)} />

        {selectedGuildId ? (
          <aside className="rf-context-sidebar relative flex h-full w-[316px] shrink-0 flex-col">
            <ChannelList />
          </aside>
        ) : (
          <ConversationSidebar
            channels={channels}
            currentUser={user ?? null}
            selectedChannelId={selectedChannelId}
            search={search}
            searchInputRef={searchInputRef}
            onSearchChange={setSearch}
            onSelectChannel={handleSelectConversation}
            onCompose={() => setComposeOpen(true)}
          />
        )}

        <main className="rf-shell-main m-2 ml-0 flex min-w-0 flex-1 overflow-hidden rounded-[28px]">
          {selectedGuildId ? (
            selectedGuild && selectedGuildChannel ? (
              <div className="flex min-w-0 flex-1">
                <section className="flex min-w-0 flex-1 flex-col">
                  <header className="border-b border-[rgba(var(--rf-border),0.18)] px-5 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                          {selectedGuildChannel.type === 'voice' ? '◖' : '#'}{' '}
                          {selectedGuildChannel.name}
                        </p>
                        {selectedGuildChannel.topic && (
                          <p className="mt-1 truncate text-xs text-[rgb(var(--rf-text-tertiary))]">
                            {selectedGuildChannel.topic}
                          </p>
                        )}
                      </div>
                      <span className="apple-pill hidden rounded-full px-3 py-1 text-xs text-[rgb(var(--rf-text-secondary))] sm:inline-flex">
                        {selectedGuild.name}
                      </span>
                    </div>
                  </header>

                  {selectedGuildChannel.type === 'voice' ? (
                    <VoiceChannel
                      roomKey={`guild-${selectedGuildId}-${selectedGuildChannel.id}`}
                      roomLabel={selectedGuildChannel.name}
                      users={guildVoiceUsers}
                      onDisconnect={() => {}}
                    />
                  ) : (
                    <div className="flex min-h-0 flex-1 flex-col bg-[rgb(var(--rf-base-alt))]">
                      <MessageTimeline channelId={selectedGuildChannel.id} />
                      <MessageComposer
                        channelId={selectedGuildChannel.id}
                        channelName={selectedGuildChannel.name}
                      />
                    </div>
                  )}
                </section>
                {!isCompact && <MemberList />}
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center px-6">
                <div className="rf-empty-state animate-fade-scale w-full max-w-sm rounded-[28px] px-7 py-7 text-center">
                  <p className="text-xl font-semibold tracking-[-0.03em] text-[rgb(var(--rf-text-primary))]">
                    Pick a channel
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[rgb(var(--rf-text-secondary))]">
                    Choose a space from {selectedGuild?.name ?? 'this server'}.
                  </p>
                </div>
              </div>
            )
          ) : selectedChannel && activeCallMode ? (
            <div className="flex min-w-0 flex-1 flex-col">
              <VoiceChannel
                roomKey={`dm-${selectedChannel.id}`}
                roomLabel={isGroupConversation ? `${participantCount} People` : conversationTitle}
                users={conversationVoiceUsers}
                onDisconnect={() => setActiveCallMode(null)}
              />
            </div>
          ) : selectedChannel ? (
            <div className="flex min-w-0 flex-1">
              <section className="flex min-w-0 flex-1 flex-col">
                <header className="px-5 pb-3 pt-4">
                  <div className="grid grid-cols-[40px_1fr_40px] items-center">
                    <div />
                    <button
                      onClick={openDetailsPanel}
                      className="mx-auto flex flex-col items-center text-center transition hover:opacity-85"
                    >
                      {isGroupConversation ? (
                        <>
                          <div className="mb-1 flex -space-x-2">
                            {conversationOthers.slice(0, 3).map((participant) => (
                              <Avatar
                                key={participant.id}
                                src={participant.avatarUrl}
                                name={participant.displayName}
                                size="sm"
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                            {participantCount} {participantCount === 1 ? 'Person' : 'People'}
                          </span>
                        </>
                      ) : (
                        <>
                          {conversationOthers[0] && (
                            <div className="mb-1">
                              <Avatar
                                src={conversationOthers[0].avatarUrl}
                                name={conversationOthers[0].displayName}
                                size="sm"
                              />
                            </div>
                          )}
                          <span className="text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                            {conversationTitle}
                          </span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => void handleStartCall()}
                      className="rf-control flex h-11 w-11 items-center justify-center rounded-full text-[rgb(var(--rf-text-primary))]"
                      title="Start call"
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
                          d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515l.57 2.279a2 2 0 01-.502 1.913l-1.19 1.19a16.042 16.042 0 006.207 6.207l1.19-1.19a2 2 0 011.913-.502l2.279.57A2 2 0 0121 16.72V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z"
                        />
                      </svg>
                    </button>
                  </div>
                </header>

                <div className="flex min-h-0 flex-1 flex-col bg-[rgb(var(--rf-base-alt))]">
                  <DMThread channelId={selectedChannel.id} onReply={setReplyTarget} />
                  <DMComposer
                    channelId={selectedChannel.id}
                    placeholder=""
                    replyTo={replyTarget}
                    onClearReply={() => setReplyTarget(null)}
                  />
                </div>
              </section>

              <ConversationDetailsPanel
                channel={selectedChannel}
                currentUserId={user?.id ?? null}
                collapsed={rightCollapsed}
                onClose={closeDetailsPanel}
                onOpenConversation={handleOpenConversation}
                onStartCall={handleStartCall}
                onEditConversation={() => {
                  setEditingName(selectedChannel.name ?? '');
                  setEditOpen(true);
                }}
              />
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center px-6">
              <div className="rf-empty-state animate-fade-scale w-full max-w-sm rounded-[28px] px-7 py-7 text-center">
                <p className="text-xl font-semibold tracking-[-0.03em] text-[rgb(var(--rf-text-primary))]">
                  Pick a conversation
                </p>
                <p className="mt-2 text-sm leading-6 text-[rgb(var(--rf-text-secondary))]">
                  Open a chat or start something new.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <Modal open={composeOpen} onClose={resetCompose} title="New conversation" size="md">
        <div className="space-y-4">
          <Input
            value={composeQuery}
            onChange={(event) => setComposeQuery(event.target.value)}
            placeholder="Search by name, username, or email"
            autoFocus
          />

          {composeSelection.length > 1 && (
            <Input
              label="Group name"
              value={conversationName}
              onChange={(event) => setConversationName(event.target.value)}
              placeholder="Optional group title"
            />
          )}

          {composeSelection.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {composeSelection.map((person) => (
                <button
                  key={person.id}
                  onClick={() => toggleComposeSelection(person)}
                  className="apple-pill flex items-center gap-2 rounded-full px-3 py-1.5 text-sm text-[rgb(var(--rf-text-primary))]"
                >
                  <Avatar src={person.avatarUrl} name={person.displayName} size="xs" />
                  <span>{person.displayName}</span>
                </button>
              ))}
            </div>
          )}

          <div className="max-h-[280px] space-y-2 overflow-y-auto">
            {composeResults.map((person) => {
              const selected = composeSelection.some((item) => item.id === person.id);
              return (
                <button
                  key={person.id}
                  onClick={() => toggleComposeSelection(person)}
                  className={[
                    'flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left transition',
                    selected
                      ? 'bg-[rgba(var(--rf-accent),0.16)] text-[rgb(var(--rf-text-primary))]'
                      : 'hover:bg-[rgba(var(--rf-elevated),0.72)]',
                  ].join(' ')}
                >
                  <Avatar
                    src={person.avatarUrl}
                    name={person.displayName}
                    size="md"
                    status={person.status}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{person.displayName}</p>
                    <p className="truncate text-xs text-[rgb(var(--rf-text-secondary))]">
                      @{person.username}
                    </p>
                  </div>
                  {selected && <span className="text-sm font-semibold">✓</span>}
                </button>
              );
            })}

            {composeResults.length === 0 && (
              <div className="rounded-[20px] border border-[rgba(var(--rf-border),0.6)] bg-[rgba(var(--rf-elevated),0.4)] px-4 py-5 text-center">
                <p className="text-sm font-medium text-[rgb(var(--rf-text-primary))]">
                  No people found
                </p>
                <p className="mt-1 text-xs leading-5 text-[rgb(var(--rf-text-secondary))]">
                  Try a username, display name, or email address.
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={resetCompose}>
              Cancel
            </Button>
            <Button
              onClick={() => void handleCreateConversation()}
              disabled={composeSelection.length === 0}
              loading={submittingCompose}
              aria-label="Create direct message"
              title="Create direct message"
              className="!min-h-11 !w-11 !rounded-full !p-0"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M5 12h14M13 6l6 6-6 6"
                />
              </svg>
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit conversation" size="sm">
        <div className="space-y-4">
          <Input
            label="Conversation name"
            value={editingName}
            onChange={(event) => setEditingName(event.target.value)}
            placeholder="Give this group a name"
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void handleSaveConversation()} loading={savingEdit}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
