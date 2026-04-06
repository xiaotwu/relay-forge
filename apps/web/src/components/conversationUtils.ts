import type { DMChannel, PublicUser } from '@relayforge/types';

export function getConversationOthers(
  channel: DMChannel,
  currentUserId: string | null | undefined,
): PublicUser[] {
  return channel.participants.filter((participant) => participant.id !== currentUserId);
}

export function getConversationTitle(
  channel: DMChannel,
  currentUserId: string | null | undefined,
): string {
  if (channel.name?.trim()) {
    return channel.name;
  }

  const others = getConversationOthers(channel, currentUserId);
  if (others.length === 0) {
    return 'Just you';
  }
  if (others.length === 1) {
    return others[0].displayName;
  }
  return others.map((participant) => participant.displayName.split(' ')[0]).join(' and ');
}

export function getConversationMeta(
  channel: DMChannel,
  currentUserId: string | null | undefined,
): string {
  const others = getConversationOthers(channel, currentUserId);
  if (channel.type === 'group_dm' || others.length > 1) {
    return `${others.length} ${others.length === 1 ? 'Person' : 'People'}`;
  }
  return others[0]?.customStatus ?? 'Direct message';
}

export function getConversationParticipantCount(
  channel: DMChannel,
  currentUserId: string | null | undefined,
): number {
  const others = getConversationOthers(channel, currentUserId);
  return Math.max(others.length, 1);
}

export function formatConversationTime(value: string | null): string {
  if (!value) return '';

  const date = new Date(value);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
}
