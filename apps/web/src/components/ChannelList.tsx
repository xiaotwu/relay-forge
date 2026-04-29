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
        className={[
          'rf-list-row group flex w-full items-center gap-2 rounded-[16px] px-3 py-2.5 text-sm',
          isSelected
            ? 'bg-[rgba(var(--rf-accent),0.94)] text-white shadow-[0_12px_24px_rgba(var(--rf-accent),0.22)]'
            : 'text-text-secondary hover:text-text-primary hover:bg-[rgba(var(--rf-elevated),0.58)]',
        ].join(' ')}
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
        <div className="flex shrink-0 flex-col px-4 pb-3 pt-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="truncate text-base font-semibold tracking-[-0.02em] text-[rgb(var(--rf-text-primary))]">
              {guild.name}
            </h2>
            {canManageChannels && (
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="rf-control flex h-10 w-10 items-center justify-center rounded-[15px] text-[rgb(var(--rf-text-secondary))] hover:text-[rgb(var(--rf-text-primary))]"
                aria-label="New channel"
                title="New channel"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 5v14M5 12h14"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="rf-search-shell mt-3 flex items-center gap-2 rounded-[18px] px-3 py-3">
            <svg
              className="h-4 w-4 text-[rgb(var(--rf-text-tertiary))]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="min-w-0 flex-1 bg-transparent text-sm text-[rgb(var(--rf-text-primary))] outline-none [-webkit-text-fill-color:rgb(var(--rf-text-primary))] placeholder:text-[rgb(var(--rf-text-tertiary))] placeholder:opacity-100"
            />
          </div>
        </div>

        <div className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-2 py-3">
          {visibleChannels.length === 0 ? (
            <div className="px-2 py-4">
              <div className="rf-empty-state rounded-[22px] px-4 py-5 text-center">
                <p className="text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                  No channels
                </p>
                {canManageChannels && (
                  <button
                    type="button"
                    onClick={() => setShowCreate(true)}
                    className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(var(--rf-accent),0.18)] text-[rgb(var(--rf-accent-light))] transition hover:bg-[rgba(var(--rf-accent),0.26)] hover:text-white"
                    aria-label="Create channel"
                    title="Create channel"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M12 5v14M5 12h14"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {uncategorized.sort((a, b) => a.position - b.position).map(renderChannel)}

              {Array.from(categoryMap.entries()).map(([catId, catChannels]) => {
                const isCollapsed = collapsedCategories.has(catId);
                const catName = catId.replace(/-/g, ' ').toUpperCase();

                return (
                  <div key={catId} className="pt-3">
                    <button
                      onClick={() => toggleCategory(catId)}
                      className="text-text-secondary hover:text-text-primary mb-1 flex w-full items-center gap-1 px-2 text-xs font-semibold uppercase tracking-wider transition-colors"
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
            </>
          )}
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
