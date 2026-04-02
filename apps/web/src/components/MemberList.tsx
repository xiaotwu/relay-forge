import React from 'react';
import { Avatar } from '@relayforge/ui';
import { useGuildStore } from '@/stores/guild';

export function MemberList() {
  const members = useGuildStore((s) => s.members);

  // Group members by status (online first, then offline)
  const onlineMembers = members.filter((m) => m.user.status !== 'offline');
  const offlineMembers = members.filter((m) => m.user.status === 'offline');

  const renderMember = (member: (typeof members)[0]) => (
    <button
      key={member.user.id}
      className="hover:bg-elevated/50 flex w-full items-center gap-3 rounded-lg px-3 py-1.5 transition-colors"
    >
      <Avatar
        src={member.user.avatarUrl}
        name={member.user.displayName}
        size="sm"
        status={member.user.status}
      />
      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-sm ${
            member.user.status === 'offline' ? 'text-text-secondary' : 'text-text-primary'
          }`}
        >
          {member.nickname ?? member.user.displayName}
        </p>
        {member.user.customStatus && (
          <p className="text-text-secondary truncate text-xs">{member.user.customStatus}</p>
        )}
      </div>
    </button>
  );

  return (
    <div className="bg-surface border-border/20 scrollbar-thin w-60 overflow-y-auto border-l px-2 py-4">
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

      {members.length === 0 && (
        <p className="text-text-secondary py-8 text-center text-sm">No members</p>
      )}
    </div>
  );
}
