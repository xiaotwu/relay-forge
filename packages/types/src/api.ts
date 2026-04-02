/**
 * Standard API response wrapper.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * Paginated API response.
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Cursor-based paginated response for message-like resources.
 */
export interface CursorPaginatedResponse<T> {
  data: T[];
  cursor: CursorMeta;
}

export interface CursorMeta {
  before: string | null;
  after: string | null;
  limit: number;
  hasMore: boolean;
}

/**
 * Standard error response from the API.
 */
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
    requestId?: string;
  };
}

/**
 * Presigned upload response.
 */
export interface PresignedUploadResponse {
  uploadId: string;
  uploadUrl: string;
  fields: Record<string, string>;
  expiresAt: string;
}

/**
 * Upload completion response.
 */
export interface UploadCompleteResponse {
  id: string;
  url: string;
  proxyUrl: string;
  filename: string;
  contentType: string;
  size: number;
}

/**
 * Voice token response.
 */
export interface VoiceTokenResponse {
  token: string;
  url: string;
  roomName: string;
}

/**
 * Voice room info.
 */
export interface VoiceRoom {
  name: string;
  guildId: string;
  channelId: string;
  participantCount: number;
  createdAt: string;
}
