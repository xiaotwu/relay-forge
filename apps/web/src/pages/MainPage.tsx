import React, { useEffect } from 'react';
import { AppLayout } from '@relayforge/ui';
import { useGuildStore } from '@/stores/guild';
import { useRealtimeStore } from '@/stores/realtime';
import { GuildSidebar } from '@/components/GuildSidebar';
import { ChannelList } from '@/components/ChannelList';
import { MessageTimeline } from '@/components/MessageTimeline';
import { MessageComposer } from '@/components/MessageComposer';
import { MemberList } from '@/components/MemberList';
import { DMList } from '@/components/DMList';

export function MainPage() {
  const { fetchGuilds, selectedGuildId, selectedChannelId, channels } = useGuildStore();
  const { connect, disconnect } = useRealtimeStore();

  useEffect(() => {
    fetchGuilds().then(() => {
      connect();
    });
    return () => {
      disconnect();
    };
  }, [fetchGuilds, connect, disconnect]);

  const selectedChannel = channels.find((c) => c.id === selectedChannelId);

  const sidebar = (
    <div className="flex h-full">
      <GuildSidebar />
      <div className="bg-surface border-border/20 flex w-60 flex-col border-r">
        {selectedGuildId ? <ChannelList /> : <DMList />}
      </div>
    </div>
  );

  const header = selectedChannel ? (
    <div className="flex items-center gap-3">
      <span className="text-text-secondary font-medium">#</span>
      <h2 className="text-text-primary text-sm font-semibold">{selectedChannel.name}</h2>
      {selectedChannel.topic && (
        <>
          <div className="bg-border/40 h-5 w-px" />
          <p className="text-text-secondary truncate text-xs">{selectedChannel.topic}</p>
        </>
      )}
    </div>
  ) : null;

  return (
    <AppLayout
      sidebar={sidebar}
      header={header}
      rightPanel={selectedGuildId ? <MemberList /> : undefined}
      className="!bg-base"
    >
      {selectedChannelId ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1">
            <MessageTimeline channelId={selectedChannelId} />
          </div>
          <MessageComposer
            channelId={selectedChannelId}
            channelName={selectedChannel?.name ?? 'general'}
          />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-4xl opacity-20">
              <svg
                className="mx-auto h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-text-secondary text-sm">Select a channel to start chatting</p>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
