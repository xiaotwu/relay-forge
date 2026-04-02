import { describe, it, expect } from 'vitest';
import { Permission, hasPermission, combinePermissions } from '../role';

describe('Permission constants', () => {
  it('each permission is a power of 2', () => {
    const values = Object.values(Permission);
    for (const val of values) {
      // A power of 2 in bigint has exactly one bit set: val & (val - 1n) === 0n
      expect(val > 0n).toBe(true);
      expect(val & (val - 1n)).toBe(0n);
    }
  });

  it('all permissions are unique', () => {
    const values = Object.values(Permission);
    const unique = new Set(values.map((v) => v.toString()));
    expect(unique.size).toBe(values.length);
  });
});

describe('hasPermission', () => {
  it('returns true when permission is present', () => {
    const perms = Permission.VIEW_CHANNEL | Permission.SEND_MESSAGES;
    expect(hasPermission(perms, Permission.VIEW_CHANNEL)).toBe(true);
    expect(hasPermission(perms, Permission.SEND_MESSAGES)).toBe(true);
  });

  it('returns false when permission is absent', () => {
    const perms = Permission.VIEW_CHANNEL;
    expect(hasPermission(perms, Permission.SEND_MESSAGES)).toBe(false);
  });

  it('ADMIN permission grants all permissions', () => {
    const perms = Permission.ADMIN;
    expect(hasPermission(perms, Permission.MANAGE_GUILD)).toBe(true);
    expect(hasPermission(perms, Permission.BAN_MEMBERS)).toBe(true);
  });

  it('works with string input', () => {
    const perms = (Permission.VIEW_CHANNEL | Permission.SEND_MESSAGES).toString();
    expect(hasPermission(perms, Permission.VIEW_CHANNEL)).toBe(true);
    expect(hasPermission(perms, Permission.MANAGE_GUILD)).toBe(false);
  });
});

describe('combinePermissions', () => {
  it('combines multiple permissions into a single bitfield', () => {
    const combined = combinePermissions(
      Permission.VIEW_CHANNEL,
      Permission.SEND_MESSAGES,
      Permission.EMBED_LINKS,
    );
    expect(hasPermission(combined, Permission.VIEW_CHANNEL)).toBe(true);
    expect(hasPermission(combined, Permission.SEND_MESSAGES)).toBe(true);
    expect(hasPermission(combined, Permission.EMBED_LINKS)).toBe(true);
    expect(hasPermission(combined, Permission.MANAGE_GUILD)).toBe(false);
  });

  it('returns 0n for no arguments', () => {
    expect(combinePermissions()).toBe(0n);
  });

  it('combines without duplicating bits', () => {
    const a = combinePermissions(Permission.VIEW_CHANNEL, Permission.VIEW_CHANNEL);
    expect(a).toBe(Permission.VIEW_CHANNEL);
  });
});
