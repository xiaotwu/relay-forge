import React from 'react';
import { Avatar, Button, Input, Modal, useToast } from '@relayforge/ui';
import { useGuildStore } from '@/stores/guild';
import { useDMStore } from '@/stores/dm';

export function MemberList() {
  const { addToast } = useToast();
  const members = useGuildStore((s) => s.members);
  const openConversation = useDMStore((s) => s.openConversation);
  const [search, setSearch] = React.useState('');
  const [selectedMember, setSelectedMember] = React.useState<null | {
    id: string;
    name: string;
    status: 'online' | 'idle' | 'dnd' | 'offline';
    avatarUrl: string | null;
    customStatus: string | null;
    nickname: string | null;
    bio?: string | null;
    username?: string | null;
  }>(null);
  const normalizedMembers = members.map((member) => {
    const fallbackId =
      (member as { user?: { id?: string }; userId?: string }).user?.id ??
      (member as { userId?: string }).userId ??
      member.guildId;
    const fallbackName =
      member.nickname ??
      (member as { user?: { displayName?: string; username?: string } }).user?.displayName ??
      (member as { user?: { username?: string } }).user?.username ??
      'Member';
    const fallbackStatus =
      (member as { user?: { status?: 'online' | 'idle' | 'dnd' | 'offline' } }).user?.status ??
      'offline';

    return {
      id: fallbackId,
      name: fallbackName,
      status: fallbackStatus,
      avatarUrl: (member as { user?: { avatarUrl?: string | null } }).user?.avatarUrl ?? null,
      customStatus:
        (member as { user?: { customStatus?: string | null } }).user?.customStatus ?? null,
      nickname: member.nickname,
      bio: (member as { user?: { bio?: string | null } }).user?.bio ?? null,
      username: (member as { user?: { username?: string | null } }).user?.username ?? null,
    };
  });
  const filteredMembers = normalizedMembers.filter((member) => {
    const haystack = [member.nickname, member.name, member.username].filter(Boolean).join(' ');
    return haystack.toLowerCase().includes(search.toLowerCase());
  });

  // Group members by status (online first, then offline)
  const onlineMembers = filteredMembers.filter((member) => member.status !== 'offline');
  const offlineMembers = filteredMembers.filter((member) => member.status === 'offline');

  const renderMember = (member: (typeof normalizedMembers)[0]) => (
    <button
      key={member.id}
      onClick={() => setSelectedMember(member)}
      className="hover:bg-elevated/50 flex w-full items-center gap-3 rounded-lg px-3 py-1.5 transition-colors"
    >
      <Avatar src={member.avatarUrl} name={member.name} size="sm" status={member.status} />
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm ${member.status === 'offline' ? 'text-text-secondary' : 'text-text-primary'}`}
        >
          {member.nickname ?? member.name}
        </p>
        {member.customStatus && (
          <p className="text-text-secondary truncate text-xs">{member.customStatus}</p>
        )}
      </div>
    </button>
  );

  return (
    <>
      <div className="bg-surface border-border/20 scrollbar-thin w-60 overflow-y-auto border-l px-2 py-4">
        <div className="px-2 pb-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people"
          />
        </div>
        {/* Online */}
        {onlineMembers.length > 0 && (
          <div className="mb-4">
            <h3 className="text-text-secondary mb-2 px-3 text-xs font-semibold uppercase tracking-wider">
              Online &mdash; {onlineMembers.length}
            </h3>
            <div className="space-y-0.5">{onlineMembers.map(renderMember)}</div>
          </div>
        )}

        {/* Offline */}
        {offlineMembers.length > 0 && (
          <div>
            <h3 className="text-text-secondary mb-2 px-3 text-xs font-semibold uppercase tracking-wider">
              Offline &mdash; {offlineMembers.length}
            </h3>
            <div className="space-y-0.5">{offlineMembers.map(renderMember)}</div>
          </div>
        )}

        {filteredMembers.length === 0 && (
          <p className="text-text-secondary py-8 text-center text-sm">No members</p>
        )}
      </div>

      <Modal open={Boolean(selectedMember)} onClose={() => setSelectedMember(null)} title="Profile">
        {selectedMember && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar
                src={selectedMember.avatarUrl}
                name={selectedMember.name}
                size="xl"
                status={selectedMember.status}
              />
              <div>
                <p className="text-text-primary text-lg font-semibold">{selectedMember.name}</p>
                {selectedMember.username && (
                  <p className="text-text-secondary text-sm">@{selectedMember.username}</p>
                )}
                {selectedMember.customStatus && (
                  <p className="text-text-secondary mt-2 text-sm">{selectedMember.customStatus}</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-text-secondary text-xs uppercase tracking-[0.18em]">About</p>
              <p className="text-text-primary mt-2 text-sm">
                {selectedMember.bio || 'No public bio yet.'}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                onClick={async () => {
                  await openConversation({
                    id: selectedMember.id,
                    username: selectedMember.username ?? selectedMember.name,
                    displayName: selectedMember.name,
                    avatarUrl: selectedMember.avatarUrl,
                    bannerUrl: null,
                    bio: selectedMember.bio ?? null,
                    status: selectedMember.status,
                    customStatus: selectedMember.customStatus,
                  });
                  setSelectedMember(null);
                  addToast('success', 'Direct message ready.');
                }}
              >
                Message
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  navigator.clipboard
                    .writeText(selectedMember.username || selectedMember.name)
                    .then(() => addToast('success', 'Handle copied.'))
                    .catch(() => addToast('error', 'Could not copy handle.'));
                }}
              >
                Copy handle
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
