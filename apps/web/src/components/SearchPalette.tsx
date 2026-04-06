import React from 'react';
import { Button, Input, Modal } from '@relayforge/ui';
import { useGuildStore } from '@/stores/guild';
import { useUIStore } from '@/stores/ui';

interface SearchPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function SearchPalette({ open, onClose }: SearchPaletteProps) {
  const [query, setQuery] = React.useState('');
  const { guilds, channels, members, selectGuild, selectChannel } = useGuildStore();
  const { setRightSidebarCollapsed } = useUIStore();

  const normalizedMembers = members.map((member) => ({
    id: (member as { user?: { id?: string }; userId?: string }).user?.id ?? member.guildId,
    label:
      member.nickname ??
      (member as { user?: { displayName?: string; username?: string } }).user?.displayName ??
      (member as { user?: { username?: string } }).user?.username ??
      'Member',
  }));

  const q = query.trim().toLowerCase();
  const guildResults = guilds.filter((guild) => guild.name.toLowerCase().includes(q || ''));
  const channelResults = channels.filter((channel) => channel.name.toLowerCase().includes(q || ''));
  const userResults = normalizedMembers.filter((member) =>
    member.label.toLowerCase().includes(q || ''),
  );

  const closeAndReset = () => {
    setQuery('');
    onClose();
  };

  const shortcutLabel =
    typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac')
      ? 'Cmd K'
      : 'Ctrl K';

  return (
    <Modal open={open} onClose={closeAndReset} title="Search everywhere">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-text-secondary text-sm">
            Jump between servers, channels, and people without leaving your flow.
          </p>
          <div className="flex items-center gap-2">
            <span className="apple-pill text-text-secondary rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]">
              {shortcutLabel}
            </span>
            <span className="apple-pill text-text-secondary rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]">
              /
            </span>
          </div>
        </div>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search servers, channels, and people"
          autoFocus
        />

        <div className="grid gap-4 md:grid-cols-3">
          <section className="rounded-[24px] border border-[rgba(var(--rf-border),0.24)] bg-[rgba(var(--rf-surface),0.72)] p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5">
            <p className="text-text-secondary text-xs uppercase tracking-[0.18em]">Servers</p>
            <div className="mt-3 space-y-2">
              {guildResults.slice(0, 6).map((guild) => (
                <Button
                  key={guild.id}
                  variant="ghost"
                  className="!justify-start"
                  onClick={() => {
                    void selectGuild(guild.id);
                    closeAndReset();
                  }}
                >
                  {guild.name}
                </Button>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[rgba(var(--rf-border),0.24)] bg-[rgba(var(--rf-surface),0.72)] p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5">
            <p className="text-text-secondary text-xs uppercase tracking-[0.18em]">Channels</p>
            <div className="mt-3 space-y-2">
              {channelResults.slice(0, 6).map((channel) => (
                <Button
                  key={channel.id}
                  variant="ghost"
                  className="!justify-start"
                  onClick={() => {
                    selectChannel(channel.id);
                    closeAndReset();
                  }}
                >
                  #{channel.name}
                </Button>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[rgba(var(--rf-border),0.24)] bg-[rgba(var(--rf-surface),0.72)] p-4 shadow-[0_12px_34px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5">
            <p className="text-text-secondary text-xs uppercase tracking-[0.18em]">People</p>
            <div className="mt-3 space-y-2">
              {userResults.slice(0, 6).map((member) => (
                <Button
                  key={member.id}
                  variant="ghost"
                  className="!justify-start"
                  onClick={() => {
                    setRightSidebarCollapsed(false);
                    closeAndReset();
                  }}
                >
                  {member.label}
                </Button>
              ))}
            </div>
          </section>
        </div>

        {q &&
          guildResults.length === 0 &&
          channelResults.length === 0 &&
          userResults.length === 0 && (
            <div className="apple-card rounded-[24px] px-5 py-6 text-center">
              <p className="text-text-primary text-base font-semibold tracking-[-0.02em]">
                No matches yet
              </p>
              <p className="text-text-secondary mt-2 text-sm leading-6">
                Try a different name, server, or channel keyword.
              </p>
            </div>
          )}

        {!q && (
          <p className="text-text-secondary text-center text-sm">
            Search is available from the left sidebar anywhere in the app.
          </p>
        )}
      </div>
    </Modal>
  );
}
