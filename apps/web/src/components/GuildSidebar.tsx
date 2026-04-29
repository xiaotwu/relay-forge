import React, { useState } from 'react';
import { Avatar, Modal, Input, Button } from '@relayforge/ui';
import { ChannelType } from '@relayforge/types';
import { useGuildStore } from '@/stores/guild';
import { useAuthStore } from '@/stores/auth';

const relayForgeIconSrc = '/branding/relay-forge-icon.png';

interface GuildSidebarProps {
  onOpenSettings: () => void;
}

export function GuildSidebar({ onOpenSettings }: GuildSidebarProps) {
  const { guilds, selectedGuildId, selectGuild, createGuild } = useGuildStore();
  const { user } = useAuthStore();
  const [showCreate, setShowCreate] = useState(false);
  const [newGuildName, setNewGuildName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [createGeneral, setCreateGeneral] = useState(true);
  const [createVoice, setCreateVoice] = useState(true);
  const [creating, setCreating] = useState(false);

  const handleCreateGuild = async () => {
    if (!newGuildName.trim()) return;
    setCreating(true);
    try {
      const initialChannels = [];
      if (createGeneral) {
        initialChannels.push({
          name: 'general',
          type: ChannelType.TEXT,
          topic: 'Start the conversation here.',
        });
      }
      if (createVoice) {
        initialChannels.push({
          name: 'lounge',
          type: ChannelType.VOICE,
          topic: 'Voice, screen sharing, and streaming hangout.',
        });
      }

      await createGuild({
        name: newGuildName.trim(),
        iconUrl: iconUrl.trim() || undefined,
        initialChannels,
      });
      setShowCreate(false);
      setNewGuildName('');
      setIconUrl('');
      setCreateGeneral(true);
      setCreateVoice(true);
    } catch {
      // handle error
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <nav
        className="rf-primary-rail scrollbar-thin flex w-[76px] shrink-0 flex-col items-center gap-2 overflow-y-auto px-3 py-4"
        aria-label="Primary navigation"
      >
        <button
          onClick={() => selectGuild(null)}
          className="group relative"
          title="Direct Messages"
        >
          <div
            className={[
              'rf-rail-button overflow-hidden !border-white/60 !bg-white !p-0',
              selectedGuildId === null ? 'is-active !bg-white' : '',
            ].join(' ')}
          >
            <img src={relayForgeIconSrc} alt="" className="h-full w-full object-cover" />
          </div>
          {selectedGuildId === null && <div className="rf-rail-indicator" />}
        </button>

        <div className="my-2 h-px w-9 bg-[rgba(var(--rf-border),0.36)]" />

        {guilds.map((guild) => {
          const isSelected = selectedGuildId === guild.id;
          return (
            <button
              key={guild.id}
              onClick={() => selectGuild(guild.id)}
              className="group relative"
              title={guild.name}
            >
              <div className={['rf-rail-button', isSelected ? 'is-active' : ''].join(' ')}>
                {guild.iconUrl ? (
                  <img
                    src={guild.iconUrl}
                    alt={guild.name}
                    className="h-full w-full rounded-[inherit] object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-current">
                    {guild.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {isSelected && <div className="rf-rail-indicator" />}
              <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-[14px] border border-[rgba(var(--rf-border),0.2)] bg-[rgba(var(--rf-elevated),0.96)] px-3 py-1.5 text-sm font-medium text-[rgb(var(--rf-text-primary))] opacity-0 shadow-lg backdrop-blur-xl transition-opacity group-hover:opacity-100">
                {guild.name}
              </div>
            </button>
          );
        })}

        <button
          onClick={() => setShowCreate(true)}
          className="group relative"
          title="Create a server"
        >
          <div className="rf-rail-button">
            <svg
              className="h-5 w-5 text-[rgb(var(--rf-accent-light))] transition-colors group-hover:text-[rgb(var(--rf-text-primary))]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </button>

        <div className="mt-auto pt-2">
          <button onClick={onOpenSettings} className="group relative" title="Settings">
            <div className="rf-rail-button !rounded-full !p-0">
              <Avatar
                src={user?.avatarUrl}
                name={user?.displayName ?? user?.username ?? ''}
                size="sm"
                status={user?.status ?? 'online'}
              />
            </div>
            <div className="pointer-events-none absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border border-[rgba(var(--rf-base),0.9)] bg-[rgb(var(--rf-elevated))] text-[rgb(var(--rf-text-secondary))]">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15.5A3.5 3.5 0 1012 8a3.5 3.5 0 000 7.5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19.4 15a1.7 1.7 0 00.34 1.87l.05.05a2 2 0 01-2.83 2.83l-.05-.05a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1.04 1.56V21a2 2 0 01-4 0v-.08a1.7 1.7 0 00-1.04-1.56 1.7 1.7 0 00-1.87.34l-.05.05a2 2 0 01-2.83-2.83l.05-.05A1.7 1.7 0 004.6 15a1.7 1.7 0 00-1.56-1.04H3a2 2 0 010-4h.08A1.7 1.7 0 004.6 8a1.7 1.7 0 00-.34-1.87l-.05-.05a2 2 0 012.83-2.83l.05.05A1.7 1.7 0 008.96 3.6 1.7 1.7 0 0010 2.04V2a2 2 0 014 0v.08a1.7 1.7 0 001.04 1.56 1.7 1.7 0 001.87-.34l.05-.05a2 2 0 012.83 2.83l-.05.05A1.7 1.7 0 0019.4 8c.23.6.8.98 1.56 1H21a2 2 0 010 4h-.08A1.7 1.7 0 0019.4 15z"
                />
              </svg>
            </div>
          </button>
        </div>
      </nav>

      {/* Create Guild Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create a server">
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            Start with a polished server setup instead of a blank shell.
          </p>
          <Input
            label="Server name"
            value={newGuildName}
            onChange={(e) => setNewGuildName(e.target.value)}
            placeholder="My awesome server"
            autoFocus
          />
          <Input
            label="Server icon URL"
            value={iconUrl}
            onChange={(e) => setIconUrl(e.target.value)}
            placeholder="https://images.example.com/icon.png"
          />
          <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
            <p className="text-text-primary text-sm font-medium">Starter channels</p>
            <div className="mt-3 space-y-3">
              <label className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-text-primary text-sm">Text channel</p>
                  <p className="text-text-secondary text-xs">
                    Create `#general` for chat and updates.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={createGeneral}
                  onChange={(e) => setCreateGeneral(e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-text-primary text-sm">Voice channel</p>
                  <p className="text-text-secondary text-xs">
                    Create `lounge` for voice, streaming, and screen sharing flows.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={createVoice}
                  onChange={(e) => setCreateVoice(e.target.checked)}
                />
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateGuild}
              loading={creating}
              disabled={!newGuildName.trim() || (!createGeneral && !createVoice)}
              className="!bg-accent hover:!bg-accent-hover"
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
