interface AccessTokenPayload {
  roles?: string[];
}

function decodeBase64Url(value: string): string | null {
  try {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    return atob(padded);
  } catch {
    return null;
  }
}

export function parseAccessTokenPayload(
  accessToken: string | null | undefined,
): AccessTokenPayload | null {
  if (!accessToken) return null;

  const segments = accessToken.split('.');
  if (segments.length < 2) return null;

  const decoded = decodeBase64Url(segments[1]);
  if (!decoded) return null;

  try {
    return JSON.parse(decoded) as AccessTokenPayload;
  } catch {
    return null;
  }
}

export function accessTokenHasRole(accessToken: string | null | undefined, role: string): boolean {
  const payload = parseAccessTokenPayload(accessToken);
  return Array.isArray(payload?.roles) && payload.roles.includes(role);
}
