export interface ParsedAttachment {
  filename: string;
  url: string;
  isImage: boolean;
}

export function isLikelyAttachmentUrl(value: string) {
  return /^(https?:\/\/|\/)\S+/i.test(value);
}

export function isImageFile(filename: string) {
  return /\.(png|jpe?g|gif|webp|avif|bmp|svg)$/i.test(filename);
}

export function parseMessageContent(content: string) {
  const lines = content.split('\n');
  const kept: string[] = [];
  const attachments: ParsedAttachment[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]?.trim() ?? '';
    const nextLine = lines[index + 1]?.trim() ?? '';
    if (line && nextLine && isLikelyAttachmentUrl(nextLine)) {
      attachments.push({
        filename: line,
        url: nextLine,
        isImage: isImageFile(line),
      });
      index += 1;
      continue;
    }
    kept.push(lines[index]);
  }

  return {
    text: kept.join('\n').trim(),
    attachments,
  };
}

export function buildMessageContent(
  text: string,
  attachments: Array<{ filename: string; url: string }>,
) {
  const parts: string[] = [];
  const trimmed = text.trim();
  if (trimmed) {
    parts.push(trimmed);
  }

  for (const attachment of attachments) {
    parts.push(`${attachment.filename}\n${attachment.url}`);
  }

  return parts.join('\n\n').trim();
}

export function resolveAttachmentUrl(
  url: string,
  mediaBaseUrl: string,
  accessToken?: string | null,
) {
  try {
    const resolved = new URL(url, mediaBaseUrl);
    if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') {
      return '#';
    }
    if (accessToken && resolved.pathname.startsWith('/api/v1/media/files/')) {
      resolved.searchParams.set('token', accessToken);
    }
    return resolved.toString();
  } catch {
    return url;
  }
}

export function summarizeMessageContent(content: string) {
  const parsed = parseMessageContent(content);
  if (parsed.text) {
    return parsed.text;
  }

  if (parsed.attachments.length === 1) {
    const [attachment] = parsed.attachments;
    return attachment.isImage ? `Image: ${attachment.filename}` : `File: ${attachment.filename}`;
  }

  if (parsed.attachments.length > 1) {
    return `${parsed.attachments.length} attachments`;
  }

  return '';
}
