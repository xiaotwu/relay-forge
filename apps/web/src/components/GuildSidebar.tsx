import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Modal, Input, Button } from '@relayforge/ui';
import { useGuildStore } from '@/stores/guild';
import { useAuthStore } from '@/stores/auth';

export function GuildSidebar() {
  const { guilds, selectedGuildId, selectGuild, createGuild } = useGuildStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [newGuildName, setNewGuildName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateGuild = async () => {
    if (!newGuildName.trim()) return;
    setCreating(true);
    try {
      await createGuild(newGuildName.trim());
      setShowCreate(false);
      setNewGuildName('');
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
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 ${
              selectedGuildId === null
                ? 'bg-accent rounded-xl'
                : 'bg-elevated hover:bg-accent hover:rounded-xl'
            }`}
          >
            <svg
              className="text-text-primary h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
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
            Give your new server a name. You can always change it later.
          </p>
          <Input
            label="Server name"
            value={newGuildName}
            onChange={(e) => setNewGuildName(e.target.value)}
            placeholder="My awesome server"
            autoFocus
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateGuild}
              loading={creating}
              disabled={!newGuildName.trim()}
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
