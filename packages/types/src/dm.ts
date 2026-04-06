import type { PublicUser } from './user.js';

export interface DMChannel {
  id: string;
  type: 'dm' | 'group_dm';
  participants: PublicUser[];
  name: string | null;
  iconUrl: string | null;
  ownerId: string | null;
  lastMessage: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DMMessage {
  id: string;
  channelId: string;
  authorId: string;
  author: PublicUser;
  content: string;
  attachments: DMAttachment[];
  replyToId: string | null;
  edited: boolean;
  editedAt: string | null;
  createdAt: string;
}

export interface DMAttachment {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  encryptedUrl: string;
  encryptionKey: string;
  nonce: string;
}

export interface E2EEKeyBundle {
  identityKey: string;
  signedPreKey: SignedPreKey;
  oneTimePreKeys: OneTimePreKey[];
}

export interface SignedPreKey {
  keyId: string;
  publicKey: string;
  signature: string;
  createdAt: string;
}

export interface OneTimePreKey {
  keyId: string;
  publicKey: string;
}

export interface KeyBundleUploadRequest {
  identityKey: string;
  signedPreKey: {
    publicKey: string;
    signature: string;
  };
  oneTimePreKeys: string[];
}

export interface SendDMRequest {
  content: string;
  replyToId?: string;
}

export interface CreateDMChannelRequest {
  participantIds: string[];
  name?: string;
}

export interface UpdateDMChannelRequest {
  name?: string;
}
