import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar } from '@relayforge/ui';
import type { PublicUser } from '@relayforge/types';
import {
  Room,
  RoomEvent,
  Track,
  type LocalVideoTrack,
  type RemoteVideoTrack,
} from 'livekit-client';
import { useAuthStore } from '@/stores/auth';
import { getCurrentConnection } from '@/lib/serverConnections';

interface VoiceUser {
  user: PublicUser;
  speaking: boolean;
  muted: boolean;
  deafened: boolean;
}

interface VoiceChannelProps {
  roomKey: string;
  roomLabel: string;
  users: VoiceUser[];
  onDisconnect: () => void;
}

interface ConnectedVoiceUser extends VoiceUser {
  isLocal: boolean;
}

interface VideoTile {
  participantId: string;
  displayName: string;
  avatarUrl: string | null;
  track: LocalVideoTrack | RemoteVideoTrack;
  isLocal: boolean;
  kind: 'camera' | 'screen';
}

interface VoiceTokenResponse {
  token: string;
  url?: string;
  expires_at?: number;
}

function getActiveVideoTrack(
  publication:
    | {
        track?: {
          mediaStreamTrack?: MediaStreamTrack | null;
        } | null;
        isMuted?: boolean;
      }
    | null
    | undefined,
) {
  if (!publication?.track || publication.isMuted) {
    return null;
  }

  return publication.track.mediaStreamTrack?.readyState === 'live' ? publication.track : null;
}

function VideoSurface({ tile, muted }: { tile: VideoTile; muted: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;

    tile.track.attach(element);
    return () => {
      tile.track.detach(element);
    };
  }, [tile.track]);

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] border border-[rgba(var(--rf-border),0.24)] bg-[rgba(var(--rf-base),0.22)] shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className={`h-full w-full ${tile.kind === 'screen' ? 'bg-[#0f172a] object-contain' : 'object-cover'}`}
      />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/45 to-transparent px-4 py-3 text-white">
        <div>
          <p className="text-sm font-semibold">{tile.displayName}</p>
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/70">
            {tile.kind === 'screen'
              ? 'Screen sharing'
              : tile.isLocal
                ? 'Your camera'
                : 'Live video'}
          </p>
        </div>
        {tile.isLocal && (
          <span className="rounded-full border border-white/20 bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-md">
            You
          </span>
        )}
      </div>
    </div>
  );
}

function ControlButton({
  title,
  state,
  onClick,
  disabled,
  children,
}: {
  title: string;
  state: 'default' | 'enabled' | 'disabled' | 'danger';
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const palette =
    state === 'enabled'
      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
      : state === 'disabled'
        ? 'bg-red-50 text-red-500 border-red-200'
        : state === 'danger'
          ? 'bg-[rgba(239,68,68,0.12)] text-red-400 border-[rgba(239,68,68,0.24)]'
          : 'bg-[rgba(var(--rf-surface),0.84)] text-[rgb(var(--rf-text-secondary))] border-[rgba(var(--rf-border),0.22)]';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={[
        'relative flex h-14 w-14 items-center justify-center rounded-full border shadow-[0_12px_34px_rgba(15,23,42,0.08)] backdrop-blur-xl transition',
        disabled ? 'cursor-not-allowed opacity-55' : 'hover:-translate-y-0.5',
        palette,
      ].join(' ')}
    >
      {children}
      {state === 'disabled' && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="h-0.5 w-8 rotate-[-38deg] rounded-full bg-red-500" />
        </span>
      )}
    </button>
  );
}

export function VoiceChannel({ roomKey, roomLabel, users, onDisconnect }: VoiceChannelProps) {
  const authUser = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [selfMuted, setSelfMuted] = useState(true);
  const [selfDeafened, setSelfDeafened] = useState(false);
  const [selfCameraEnabled, setSelfCameraEnabled] = useState(false);
  const [roomState, setRoomState] = useState<'connecting' | 'connected' | 'disconnected'>(
    'connecting',
  );
  const [connectedUsers, setConnectedUsers] = useState<ConnectedVoiceUser[]>([]);
  const [videoTiles, setVideoTiles] = useState<VideoTile[]>([]);
  const [shareError, setShareError] = useState<string | null>(null);
  const [roomError, setRoomError] = useState<string | null>(null);
  const [activeSpeakerIds, setActiveSpeakerIds] = useState<string[]>([]);
  const roomRef = useRef<Room | null>(null);
  const authUserRef = useRef(authUser);
  const participantDirectoryRef = useRef(new Map<string, PublicUser>());
  const selfMutedRef = useRef(selfMuted);
  const selfDeafenedRef = useRef(selfDeafened);
  const selfCameraEnabledRef = useRef(selfCameraEnabled);
  const activeSpeakerIdsRef = useRef(activeSpeakerIds);

  useEffect(() => {
    authUserRef.current = authUser;
    const directory = new Map<string, PublicUser>();
    for (const entry of users) {
      directory.set(entry.user.id, entry.user);
    }
    if (authUser) {
      directory.set(authUser.id, authUser);
    }
    participantDirectoryRef.current = directory;
  }, [authUser, users]);

  useEffect(() => {
    selfMutedRef.current = selfMuted;
  }, [selfMuted]);

  useEffect(() => {
    selfDeafenedRef.current = selfDeafened;
  }, [selfDeafened]);

  useEffect(() => {
    selfCameraEnabledRef.current = selfCameraEnabled;
  }, [selfCameraEnabled]);

  useEffect(() => {
    activeSpeakerIdsRef.current = activeSpeakerIds;
  }, [activeSpeakerIds]);

  const getDirectoryUser = useCallback((participantId: string, fallbackName: string) => {
    return (
      participantDirectoryRef.current.get(participantId) ?? {
        id: participantId,
        username: fallbackName,
        displayName: fallbackName,
        avatarUrl: null,
        bannerUrl: null,
        bio: null,
        status: 'online',
        customStatus: null,
      }
    );
  }, []);

  const updateConnectedUsers = useCallback(
    (room: Room) => {
      const nextUsers: ConnectedVoiceUser[] = [];
      const currentUser = authUserRef.current;

      if (currentUser) {
        nextUsers.push({
          user: getDirectoryUser(currentUser.id, currentUser.displayName ?? currentUser.username),
          speaking: activeSpeakerIdsRef.current.includes(currentUser.id),
          muted: selfMutedRef.current,
          deafened: selfDeafenedRef.current,
          isLocal: true,
        });
      }

      for (const participant of room.remoteParticipants.values()) {
        const user = getDirectoryUser(
          participant.identity,
          participant.name || participant.identity,
        );
        const microphonePublication = participant.getTrackPublication(Track.Source.Microphone);
        nextUsers.push({
          user,
          speaking: activeSpeakerIdsRef.current.includes(participant.identity),
          muted: microphonePublication?.isMuted ?? false,
          deafened: false,
          isLocal: false,
        });
      }

      setConnectedUsers(nextUsers);
    },
    [getDirectoryUser],
  );

  const updateVideoTiles = useCallback(
    (room: Room) => {
      const nextTiles: VideoTile[] = [];
      const currentUser = authUserRef.current;

      const localCameraPublication = room.localParticipant.getTrackPublication(Track.Source.Camera);
      const localCameraTrack = getActiveVideoTrack(localCameraPublication);
      if (localCameraTrack) {
        nextTiles.push({
          participantId: currentUser?.id ?? room.localParticipant.identity,
          displayName: currentUser?.displayName ?? currentUser?.username ?? 'You',
          avatarUrl: currentUser?.avatarUrl ?? null,
          track: localCameraTrack as LocalVideoTrack,
          isLocal: true,
          kind: 'camera',
        });
      }

      const localScreenPublication = room.localParticipant.getTrackPublication(
        Track.Source.ScreenShare,
      );
      const localScreenTrack = getActiveVideoTrack(localScreenPublication);
      if (localScreenTrack) {
        nextTiles.push({
          participantId: `${currentUser?.id ?? room.localParticipant.identity}-screen`,
          displayName: currentUser?.displayName ?? currentUser?.username ?? 'You',
          avatarUrl: currentUser?.avatarUrl ?? null,
          track: localScreenTrack as LocalVideoTrack,
          isLocal: true,
          kind: 'screen',
        });
      }

      for (const participant of room.remoteParticipants.values()) {
        const user = getDirectoryUser(
          participant.identity,
          participant.name || participant.identity,
        );
        const cameraPublication = participant.getTrackPublication(Track.Source.Camera);
        const remoteCameraTrack = getActiveVideoTrack(cameraPublication);
        if (remoteCameraTrack) {
          nextTiles.push({
            participantId: participant.identity,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            track: remoteCameraTrack as RemoteVideoTrack,
            isLocal: false,
            kind: 'camera',
          });
        }

        const screenPublication = participant.getTrackPublication(Track.Source.ScreenShare);
        const remoteScreenTrack = getActiveVideoTrack(screenPublication);
        if (remoteScreenTrack) {
          nextTiles.push({
            participantId: `${participant.identity}-screen`,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            track: remoteScreenTrack as RemoteVideoTrack,
            isLocal: false,
            kind: 'screen',
          });
        }
      }

      setVideoTiles(nextTiles);
    },
    [getDirectoryUser],
  );

  useEffect(() => {
    if (!authUser) {
      setRoomError('Sign in to join this call.');
      return;
    }

    let cancelled = false;
    const room = new Room();
    roomRef.current = room;

    const sync = () => {
      if (cancelled) return;
      updateConnectedUsers(room);
      updateVideoTiles(room);
    };

    room
      .on(RoomEvent.Connected, async () => {
        setRoomState('connected');
        setRoomError(null);
        sync();
      })
      .on(RoomEvent.Disconnected, () => {
        setRoomState('disconnected');
        if (!cancelled) {
          setVideoTiles([]);
          setConnectedUsers([]);
        }
      })
      .on(RoomEvent.ParticipantConnected, sync)
      .on(RoomEvent.ParticipantDisconnected, sync)
      .on(RoomEvent.TrackSubscribed, sync)
      .on(RoomEvent.TrackUnsubscribed, sync)
      .on(RoomEvent.LocalTrackPublished, sync)
      .on(RoomEvent.LocalTrackUnpublished, sync)
      .on(RoomEvent.TrackMuted, sync)
      .on(RoomEvent.TrackUnmuted, sync)
      .on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
        const nextIds = speakers.map((speaker) => speaker.identity);
        activeSpeakerIdsRef.current = nextIds;
        setActiveSpeakerIds(nextIds);
        sync();
      });

    const connectToRoom = async () => {
      setRoomState('connecting');
      setRoomError(null);
      try {
        const { mediaBaseUrl, livekitUrl } = getCurrentConnection();
        const response = await fetch(`${mediaBaseUrl}/voice/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({
            room_name: roomKey,
            identity: authUser.id,
            display_name: authUser.displayName ?? authUser.username,
            can_publish: true,
            can_subscribe: true,
          }),
        });

        if (!response.ok) {
          throw new Error(`Voice token request failed (${response.status})`);
        }

        const data = (await response.json()) as VoiceTokenResponse;
        await room.connect(data.url || livekitUrl, data.token);
      } catch (error) {
        if (cancelled) return;
        setRoomState('disconnected');
        setRoomError(error instanceof Error ? error.message : 'Could not join the call.');
      }
    };

    void connectToRoom();

    return () => {
      cancelled = true;
      setActiveSpeakerIds([]);
      setVideoTiles([]);
      setConnectedUsers([]);
      room.removeAllListeners();
      room.disconnect();
      if (roomRef.current === room) {
        roomRef.current = null;
      }
    };
  }, [accessToken, authUser, roomKey, updateConnectedUsers, updateVideoTiles]);

  const toggleMute = useCallback(async () => {
    const room = roomRef.current;
    const nextMuted = !selfMuted;
    setSelfMuted(nextMuted);
    selfMutedRef.current = nextMuted;
    if (!room) return;
    try {
      await room.localParticipant.setMicrophoneEnabled(!nextMuted);
      updateConnectedUsers(room);
    } catch (error) {
      setShareError(error instanceof Error ? error.message : 'Microphone access was blocked.');
      setSelfMuted(!nextMuted);
      selfMutedRef.current = !nextMuted;
    }
  }, [selfMuted, updateConnectedUsers]);

  const toggleDeafened = useCallback(() => {
    const room = roomRef.current;
    setSelfDeafened((value) => {
      const next = !value;
      selfDeafenedRef.current = next;
      if (room) {
        updateConnectedUsers(room);
      }
      return next;
    });
  }, [updateConnectedUsers]);

  const toggleCamera = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    const nextEnabled = !selfCameraEnabled;
    try {
      setShareError(null);
      await room.localParticipant.setCameraEnabled(nextEnabled);
      setSelfCameraEnabled(nextEnabled);
      updateVideoTiles(room);
    } catch (error) {
      setShareError(error instanceof Error ? error.message : 'Camera access was blocked.');
      setSelfCameraEnabled((value) => value);
    }
  }, [selfCameraEnabled, updateVideoTiles]);

  const handleScreenShare = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;
    try {
      setShareError(null);
      const localShare = room.localParticipant.getTrackPublication(Track.Source.ScreenShare);
      if (localShare?.track) {
        await room.localParticipant.setScreenShareEnabled(false);
      } else {
        await room.localParticipant.setScreenShareEnabled(true, { audio: true });
      }
      updateVideoTiles(room);
    } catch (error) {
      setShareError(
        error instanceof Error ? error.message : 'Screen sharing was blocked or unavailable.',
      );
    }
  }, [updateVideoTiles]);

  const screenTile = videoTiles.find((tile) => tile.kind === 'screen') ?? null;
  const presenterCameraTile = screenTile
    ? (videoTiles.find(
        (tile) =>
          tile.kind === 'camera' &&
          tile.participantId === screenTile.participantId.replace(/-screen$/, ''),
      ) ?? null)
    : null;
  const cameraTiles = videoTiles.filter(
    (tile) =>
      tile.kind === 'camera' &&
      (!presenterCameraTile || tile.participantId !== presenterCameraTile.participantId),
  );
  const nonCameraUsers = (
    connectedUsers.length > 0
      ? connectedUsers
      : users.map((entry) => ({ ...entry, isLocal: entry.user.id === authUser?.id }))
  ).filter(
    (entry) =>
      !videoTiles.some((tile) => tile.kind === 'camera' && tile.participantId === entry.user.id),
  );
  const isSharingScreen = videoTiles.some((tile) => tile.kind === 'screen' && tile.isLocal);

  return (
    <div className="flex h-full flex-col bg-[radial-gradient(circle_at_top,_rgba(var(--rf-surface),0.95),_rgba(var(--rf-base),0.88)_44%,_rgba(var(--rf-base),0.96)_100%)]">
      <div className="flex items-center justify-between px-6 pb-2 pt-5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
            {roomLabel}
          </p>
        </div>
        <div
          className={[
            'rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em]',
            roomState === 'connected'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : roomState === 'connecting'
                ? 'border-amber-200 bg-amber-50 text-amber-700'
                : 'border-[rgba(var(--rf-border),0.22)] bg-[rgba(var(--rf-base),0.44)] text-[rgb(var(--rf-text-secondary))]',
          ].join(' ')}
        >
          {roomState === 'connected'
            ? 'Connected'
            : roomState === 'connecting'
              ? 'Joining'
              : 'Offline'}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 pt-2">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col gap-4">
            {screenTile ? (
              <div className="mx-auto w-full max-w-6xl">
                <VideoSurface tile={screenTile} muted={screenTile.isLocal || selfDeafened} />
              </div>
            ) : null}

            {presenterCameraTile ? (
              <div className="mx-auto w-full max-w-sm">
                <VideoSurface
                  tile={presenterCameraTile}
                  muted={presenterCameraTile.isLocal || selfDeafened}
                />
              </div>
            ) : null}

            {cameraTiles.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {cameraTiles.map((tile) => (
                  <div key={tile.participantId} className="w-[320px] shrink-0">
                    <VideoSurface tile={tile} muted={tile.isLocal || selfDeafened} />
                  </div>
                ))}
              </div>
            ) : null}

            <div className="flex gap-3 overflow-x-auto pb-1">
              {nonCameraUsers.map((vu) => (
                <div
                  key={vu.user.id}
                  className="flex min-w-[176px] shrink-0 items-center gap-3 rounded-[22px] border border-[rgba(var(--rf-border),0.16)] bg-[rgba(var(--rf-surface),0.56)] px-3 py-3"
                >
                  <Avatar
                    src={vu.user.avatarUrl}
                    name={vu.user.displayName}
                    size="lg"
                    status={vu.user.status}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[rgb(var(--rf-text-primary))]">
                      {vu.user.displayName}
                      {vu.isLocal ? ' (you)' : ''}
                    </p>
                    <p className="truncate text-xs text-[rgb(var(--rf-text-secondary))]">
                      {vu.speaking ? 'Speaking' : vu.muted ? 'Muted' : 'Listening'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {shareError && <p className="mt-3 text-sm text-red-500">{shareError}</p>}
        {roomError && <p className="mt-2 text-sm text-amber-600">{roomError}</p>}
      </div>

      <div className="px-5 py-4 backdrop-blur-2xl">
        <div className="flex items-center justify-center gap-3">
          <ControlButton
            title={selfMuted ? 'Unmute microphone' : 'Mute microphone'}
            state={selfMuted ? 'disabled' : 'enabled'}
            onClick={() => void toggleMute()}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M12 3a3 3 0 013 3v6a3 3 0 11-6 0V6a3 3 0 013-3zm6 9a6 6 0 11-12 0m6 6v3m-4 0h8"
              />
            </svg>
          </ControlButton>

          <ControlButton
            title={selfDeafened ? 'Re-enable audio output' : 'Disable audio output'}
            state={selfDeafened ? 'disabled' : 'default'}
            onClick={toggleDeafened}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M14 8.5a4.5 4.5 0 010 7m2.5-9.5a8 8 0 010 12m-11.5-9 4-3v12l-4-3H3.5a1 1 0 01-1-1v-4a1 1 0 011-1H5z"
              />
            </svg>
          </ControlButton>

          <ControlButton
            title={selfCameraEnabled ? 'Turn camera off' : 'Turn camera on'}
            state={selfCameraEnabled ? 'enabled' : 'default'}
            onClick={() => void toggleCamera()}
            disabled={roomState !== 'connected'}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </ControlButton>

          <ControlButton
            title={isSharingScreen ? 'Stop sharing your screen' : 'Share your screen'}
            state={isSharingScreen ? 'enabled' : 'default'}
            onClick={() => void handleScreenShare()}
            disabled={roomState !== 'connected'}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M4 5h16a1 1 0 011 1v10a1 1 0 01-1 1h-6l2 3H8l2-3H4a1 1 0 01-1-1V6a1 1 0 011-1zm4 9h8"
              />
            </svg>
          </ControlButton>

          <ControlButton title="Leave call" state="danger" onClick={onDisconnect}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M15 5l5 5-5 5M20 10H9m7 8H6a2 2 0 01-2-2V8a2 2 0 012-2h10"
              />
            </svg>
          </ControlButton>
        </div>
        <div className="mt-3 flex items-center justify-center gap-5 text-[11px] font-medium uppercase tracking-[0.18em] text-[rgb(var(--rf-text-tertiary))]">
          <span>{selfMuted ? 'Mic off' : 'Mic on'}</span>
          <span>{selfCameraEnabled ? 'Camera on' : 'Camera off'}</span>
          <span>{isSharingScreen ? 'Sharing screen' : 'Not sharing'}</span>
        </div>
      </div>
    </div>
  );
}
