import React, { useState } from 'react';
import { Button, Input, Modal, useToast } from '@relayforge/ui';
import { ChannelType } from '@relayforge/types';
import { useGuildStore } from '@/stores/guild';
import { useAuthStore } from '@/stores/auth';

export function ChannelList() {
  const { guilds, selectedGuildId, channels, selectedChannelId, selectChannel, createChannel } =
    useGuildStore();
  const { user } = useAuthStore();
  const { addToast } = useToast();
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState<ChannelType>(ChannelType.TEXT);
  const [channelTopic, setChannelTopic] = useState('');
  const [creating, setCreating] = useState(false);

  const guild = guilds.find((g) => g.id === selectedGuildId);
  if (!guild) return null;
  const canManageChannels = Boolean(selectedGuildId) && Boolean(user);

  // Group channels by category
  const visibleChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(search.toLowerCase()),
  );
  const uncategorized = visibleChannels.filter((c) => !c.categoryId);
  const categoryMap = new Map<string, typeof channels>();
  for (const ch of visibleChannels) {
    if (ch.categoryId) {
      const list = categoryMap.get(ch.categoryId) ?? [];
      list.push(ch);
      categoryMap.set(ch.categoryId, list);
    }
  }

  const toggleCategory = (catId: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const channelIcon = (type: ChannelType) => {
    if (type === ChannelType.VOICE) {
      return (
        <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6 12h.01M9.5 8.5l-3 3.5 3 3.5"
          />
        </svg>
      );
    }
    return <span className="shrink-0 text-lg font-medium leading-none opacity-60">#</span>;
  };

  const renderChannel = (ch: (typeof channels)[0]) => {
    const isSelected = selectedChannelId === ch.id;
    return (
      <button
        key={ch.id}
        onClick={() => selectChannel(ch.id)}
        className={`group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
          isSelected
            ? 'bg-elevated text-text-primary'
            : 'text-text-secondary hover:text-text-primary hover:bg-elevated/50'
        }`}
      >
        {channelIcon(ch.type)}
        <span className="truncate">{ch.name}</span>
      </button>
    );
  };

  const handleCreateChannel = async () => {
    if (!selectedGuildId || !channelName.trim()) return;
    setCreating(true);
    try {
      await createChannel(selectedGuildId, {
        name: channelName.trim(),
        type: channelType,
        topic: channelTopic.trim() || undefined,
      });
      addToast('success', `${channelName.trim()} is ready.`);
      setShowCreate(false);
      setChannelName('');
      setChannelTopic('');
      setChannelType(ChannelType.TEXT);
    } catch (error) {
      addToast('error', error instanceof Error ? error.message : 'Could not create channel.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Guild header */}
        <div className="border-border/20 flex shrink-0 flex-col border-b px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-text-primary truncate text-base font-semibold">{guild.name}</h2>
            {canManageChannels && (
              <Button size="sm" variant="secondary" onClick={() => setShowCreate(true)}>
                New channel
              </Button>
            )}
          </div>
          <div className="mt-3">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search channels"
            />
          </div>
        </div>

        {/* Channel list */}
        <div className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-2 py-3">
          {/* Uncategorized channels */}
          {uncategorized.sort((a, b) => a.position - b.position).map(renderChannel)}

          {/* Categorized channels */}
          {Array.from(categoryMap.entries()).map(([catId, catChannels]) => {
            const isCollapsed = collapsedCategories.has(catId);
            // Use the first channel's categoryId to create a display name
            const catName = catId.replace(/-/g, ' ').toUpperCase();
            return (
              <div key={catId} className="pt-3">
                <button
                  onClick={() => toggleCategory(catId)}
                  className="text-text-secondary hover:text-text-primary mb-1 flex w-full items-center gap-1 px-1 text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  <svg
                    className={`h-3 w-3 transition-transform ${isCollapsed ? '-rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <span className="truncate">{catName}</span>
                </button>
                {!isCollapsed &&
                  catChannels.sort((a, b) => a.position - b.position).map(renderChannel)}
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create channel">
        <div className="space-y-4">
          <Input
            label="Channel name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="design-reviews"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
              <span className="text-text-secondary mb-2 block text-xs uppercase tracking-[0.18em]">
                Type
              </span>
              <select
                value={channelType}
                onChange={(e) => setChannelType(e.target.value as ChannelType)}
                className="w-full bg-transparent text-sm text-current outline-none"
              >
                <option value={ChannelType.TEXT}>Text</option>
                <option value={ChannelType.VOICE}>Voice</option>
              </select>
            </label>
            <Input
              label="Topic"
              value={channelTopic}
              onChange={(e) => setChannelTopic(e.target.value)}
              placeholder="What happens here?"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateChannel}
              loading={creating}
              disabled={!channelName.trim()}
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
