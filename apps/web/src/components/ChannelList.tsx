import React, { useState } from 'react';
import { ChannelType } from '@relayforge/types';
import { useGuildStore } from '@/stores/guild';

export function ChannelList() {
  const { guilds, selectedGuildId, channels, selectedChannelId, selectChannel } = useGuildStore();
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const guild = guilds.find((g) => g.id === selectedGuildId);
  if (!guild) return null;

  // Group channels by category
  const uncategorized = channels.filter((c) => !c.categoryId);
  const categoryMap = new Map<string, typeof channels>();
  for (const ch of channels) {
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

  return (
    <div className="flex h-full flex-col">
      {/* Guild header */}
      <div className="border-border/20 flex h-12 shrink-0 items-center border-b px-4">
        <h2 className="text-text-primary truncate text-base font-semibold">{guild.name}</h2>
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
  );
}
