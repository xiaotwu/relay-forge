import React, { useState } from 'react';
import { Avatar } from '@relayforge/ui';
import type { PublicUser } from '@relayforge/types';

interface VoiceUser {
  user: PublicUser;
  speaking: boolean;
  muted: boolean;
  deafened: boolean;
}

interface VoiceChannelProps {
  channelName: string;
  users: VoiceUser[];
  onDisconnect: () => void;
}

export function VoiceChannel({ channelName, users, onDisconnect }: VoiceChannelProps) {
  const [selfMuted, setSelfMuted] = useState(false);
  const [selfDeafened, setSelfDeafened] = useState(false);

  return (
    <div className="bg-surface flex h-full flex-col">
      {/* Header */}
      <div className="border-border/20 flex h-12 shrink-0 items-center border-b px-4">
        <svg
          className="text-accent mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6 12h.01M9.5 8.5l-3 3.5 3 3.5"
          />
        </svg>
        <h2 className="text-text-primary text-sm font-semibold">{channelName}</h2>
      </div>

      {/* Users list */}
      <div className="scrollbar-thin flex-1 space-y-2 overflow-y-auto p-4">
        {users.map((vu) => (
          <div key={vu.user.id} className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="relative">
              <Avatar src={vu.user.avatarUrl} name={vu.user.displayName} size="sm" />
              {vu.speaking && (
                <div className="ring-accent absolute inset-0 animate-pulse rounded-full ring-2" />
              )}
            </div>
            <span
              className={`flex-1 truncate text-sm ${
                vu.speaking ? 'text-accent font-medium' : 'text-text-primary'
              }`}
            >
              {vu.user.displayName}
            </span>
            {vu.muted && (
              <svg
                className="h-4 w-4 shrink-0 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            )}
            {vu.deafened && (
              <svg
                className="h-4 w-4 shrink-0 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            )}
          </div>
        ))}

        {users.length === 0 && (
          <p className="text-text-secondary py-8 text-center text-sm">No one is in this channel</p>
        )}
      </div>

      {/* Control bar */}
      <div className="bg-elevated border-border/20 flex items-center justify-center gap-3 border-t px-4 py-3">
        <button
          onClick={() => setSelfMuted(!selfMuted)}
          className={`rounded-full p-2.5 transition-colors ${
            selfMuted
              ? 'bg-red-500/20 text-red-400'
              : 'bg-surface text-text-secondary hover:text-text-primary'
          }`}
          title={selfMuted ? 'Unmute' : 'Mute'}
        >
          {selfMuted ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          )}
        </button>

        <button
          onClick={() => setSelfDeafened(!selfDeafened)}
          className={`rounded-full p-2.5 transition-colors ${
            selfDeafened
              ? 'bg-red-500/20 text-red-400'
              : 'bg-surface text-text-secondary hover:text-text-primary'
          }`}
          title={selfDeafened ? 'Undeafen' : 'Deafen'}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
            />
          </svg>
        </button>

        <button
          onClick={onDisconnect}
          className="rounded-full bg-red-500/20 p-2.5 text-red-400 transition-colors hover:bg-red-500/30"
          title="Disconnect"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
