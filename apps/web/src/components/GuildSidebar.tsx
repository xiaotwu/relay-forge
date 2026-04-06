import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Modal, Input, Button } from '@relayforge/ui';
import { ChannelType } from '@relayforge/types';
import { useGuildStore } from '@/stores/guild';
import { useAuthStore } from '@/stores/auth';

const relayForgeIconSrc = '/branding/relay-forge-icon.png';

export function GuildSidebar() {
  const { guilds, selectedGuildId, selectGuild, createGuild } = useGuildStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
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
      <div className="bg-base scrollbar-thin border-border/10 flex w-[72px] flex-col items-center gap-2 overflow-y-auto border-r py-3">
        {/* Home / DM button */}
        <button
          onClick={() => selectGuild(null)}
          className="group relative"
          title="Direct Messages"
        >
          <div
            className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-[18px] border border-white/60 bg-white shadow-sm transition-all duration-200 ${
              selectedGuildId === null
                ? 'rounded-xl shadow-[0_14px_28px_rgba(var(--rf-accent),0.28)] ring-2 ring-[rgba(var(--rf-accent),0.4)]'
                : 'hover:-translate-y-0.5 hover:rounded-xl hover:shadow-[0_16px_30px_rgba(15,23,42,0.16)]'
            }`}
          >
            <img src={relayForgeIconSrc} alt="" className="h-full w-full object-cover" />
          </div>
          {/* Selected indicator */}
          {selectedGuildId === null && (
            <div className="bg-text-primary absolute left-0 top-1/2 h-8 w-1 -translate-x-1 -translate-y-1/2 rounded-r-full" />
          )}
        </button>

        {/* Separator */}
        <div className="bg-border/40 my-1 h-px w-8" />

        {/* Guild list */}
        {guilds.map((guild) => {
          const isSelected = selectedGuildId === guild.id;
          return (
            <button
              key={guild.id}
              onClick={() => selectGuild(guild.id)}
              className="group relative"
              title={guild.name}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-accent rounded-xl'
                    : 'bg-elevated hover:bg-accent rounded-2xl hover:rounded-xl'
                }`}
              >
                {guild.iconUrl ? (
                  <img
                    src={guild.iconUrl}
                    alt={guild.name}
                    className="h-full w-full rounded-[inherit] object-cover"
                  />
                ) : (
                  <span className="text-text-primary text-sm font-semibold">
                    {guild.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {/* Selected indicator */}
              {isSelected && (
                <div className="bg-text-primary absolute left-0 top-1/2 h-8 w-1 -translate-x-1 -translate-y-1/2 rounded-r-full" />
              )}
              {/* Hover indicator */}
              {!isSelected && (
                <div className="bg-text-primary absolute left-0 top-1/2 h-0 w-1 -translate-x-1 -translate-y-1/2 rounded-r-full transition-all group-hover:h-5" />
              )}
              {/* Tooltip */}
              <div className="bg-elevated text-text-primary pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {guild.name}
              </div>
            </button>
          );
        })}

        {/* Create guild button */}
        <button
          onClick={() => setShowCreate(true)}
          className="group relative"
          title="Create a server"
        >
          <div className="bg-elevated hover:bg-accent flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 hover:rounded-xl">
            <svg
              className="text-accent h-6 w-6 transition-colors group-hover:text-white"
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

        {/* Settings gear at the bottom */}
        <div className="mt-auto pt-2">
          <button onClick={() => navigate('/settings')} className="group relative" title="Settings">
            <div className="hover:bg-elevated flex h-12 w-12 items-center justify-center rounded-2xl transition-all">
              <Avatar
                src={user?.avatarUrl}
                name={user?.displayName ?? user?.username ?? ''}
                size="sm"
                status={user?.status ?? 'online'}
              />
            </div>
          </button>
        </div>
      </div>

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
