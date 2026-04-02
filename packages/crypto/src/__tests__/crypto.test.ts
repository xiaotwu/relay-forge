import { describe, it, expect } from 'vitest';
import {
  generateIdentityKeyPair,
  generateSignedPreKey,
  generateOneTimePreKeys,
  exportKeyBundle,
} from '../index';

describe('generateIdentityKeyPair', () => {
  it('returns public and private keys', async () => {
    const keyPair = await generateIdentityKeyPair();
    expect(keyPair.publicKey).toBeDefined();
    expect(keyPair.privateKey).toBeDefined();
    expect(keyPair.publicKeyRaw).toBeDefined();
    expect(keyPair.publicKeyRaw.byteLength).toBeGreaterThan(0);
  });
});

describe('generateSignedPreKey', () => {
  it('returns key and signature', async () => {
    const identity = await generateIdentityKeyPair();
    const signedPreKey = await generateSignedPreKey(identity);
    expect(signedPreKey.keyId).toBeDefined();
    expect(signedPreKey.keyId.length).toBeGreaterThan(0);
    expect(signedPreKey.publicKey).toBeDefined();
    expect(signedPreKey.privateKey).toBeDefined();
    expect(signedPreKey.publicKeyRaw).toBeDefined();
    expect(signedPreKey.publicKeyRaw.byteLength).toBeGreaterThan(0);
    expect(signedPreKey.signature).toBeDefined();
    expect(signedPreKey.signature.byteLength).toBeGreaterThan(0);
  });
});

describe('generateOneTimePreKeys', () => {
  it('returns the requested count of keys', async () => {
    const count = 5;
    const keys = await generateOneTimePreKeys(count);
    expect(keys).toHaveLength(count);
    for (const key of keys) {
      expect(key.keyId).toBeDefined();
      expect(key.keyId.length).toBeGreaterThan(0);
      expect(key.publicKey).toBeDefined();
      expect(key.privateKey).toBeDefined();
      expect(key.publicKeyRaw).toBeDefined();
      expect(key.publicKeyRaw.byteLength).toBeGreaterThan(0);
    }
  });

  it('returns empty array for count of 0', async () => {
    const keys = await generateOneTimePreKeys(0);
    expect(keys).toHaveLength(0);
  });
});

describe('exportKeyBundle', () => {
  it('has correct structure', async () => {
    const identity = await generateIdentityKeyPair();
    const signedPreKey = await generateSignedPreKey(identity);
    const oneTimePreKeys = await generateOneTimePreKeys(3);

    const bundle = exportKeyBundle(identity, signedPreKey, oneTimePreKeys);

    expect(bundle.identityKey).toBeDefined();
    expect(typeof bundle.identityKey).toBe('string');
    expect(bundle.identityKey.length).toBeGreaterThan(0);

    expect(bundle.signedPreKey).toBeDefined();
    expect(bundle.signedPreKey.keyId).toBe(signedPreKey.keyId);
    expect(typeof bundle.signedPreKey.publicKey).toBe('string');
    expect(typeof bundle.signedPreKey.signature).toBe('string');
    expect(bundle.signedPreKey.createdAt).toBeDefined();

    expect(bundle.oneTimePreKeys).toHaveLength(3);
    for (const otpk of bundle.oneTimePreKeys) {
      expect(otpk.keyId).toBeDefined();
      expect(typeof otpk.publicKey).toBe('string');
    }
  });
});
