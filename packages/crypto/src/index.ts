import type { E2EEKeyBundle, SignedPreKey, OneTimePreKey } from '@relayforge/types';

// --- Utility helpers ---

const subtle = globalThis.crypto.subtle;

function toBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function generateId(): string {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function concat(...buffers: ArrayBuffer[]): ArrayBuffer {
  const totalLength = buffers.reduce((sum, b) => sum + b.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const buf of buffers) {
    result.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  }
  return result.buffer;
}

// --- Key types ---

export interface IdentityKeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
  publicKeyRaw: ArrayBuffer;
}

export interface SignedPreKeyPair {
  keyId: string;
  publicKey: CryptoKey;
  privateKey: CryptoKey;
  publicKeyRaw: ArrayBuffer;
  signature: ArrayBuffer;
}

export interface OneTimePreKeyPair {
  keyId: string;
  publicKey: CryptoKey;
  privateKey: CryptoKey;
  publicKeyRaw: ArrayBuffer;
}

export interface Session {
  rootKey: ArrayBuffer;
  sendChainKey: ArrayBuffer;
  recvChainKey: ArrayBuffer;
  sendRatchetKey: CryptoKeyPair;
  recvRatchetPublicKey: CryptoKey | null;
  sendMessageIndex: number;
  recvMessageIndex: number;
  sendChainIndex: number;
  recvChainIndex: number;
}

export interface EncryptedMessage {
  ciphertext: string;
  nonce: string;
  senderKeyId: string;
  messageIndex: number;
  chainIndex: number;
  senderRatchetKey: string;
}

// --- ECDH key generation using P-256 (Web Crypto compatible) ---
// Note: Web Crypto does not natively support X25519 in all browsers,
// so we use ECDH with P-256 which provides comparable security.
// For X25519 support, a polyfill or native implementation would be needed.

const ECDH_PARAMS: EcKeyGenParams = { name: 'ECDH', namedCurve: 'P-256' };
const ECDSA_PARAMS: EcKeyGenParams = { name: 'ECDSA', namedCurve: 'P-256' };
const AES_KEY_LENGTH = 256;
const HKDF_HASH = 'SHA-256';

/**
 * Generate an identity key pair for long-term identity.
 * Uses ECDSA P-256 for signing capability.
 */
export async function generateIdentityKeyPair(): Promise<IdentityKeyPair> {
  const keyPair = await subtle.generateKey(ECDSA_PARAMS, true, ['sign', 'verify']);
  const publicKeyRaw = await subtle.exportKey('raw', keyPair.publicKey);
  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
    publicKeyRaw,
  };
}

/**
 * Generate a signed prekey, signed by the identity key.
 */
export async function generateSignedPreKey(
  identityKey: IdentityKeyPair,
): Promise<SignedPreKeyPair> {
  const keyPair = await subtle.generateKey(ECDH_PARAMS, true, ['deriveBits']);
  const publicKeyRaw = await subtle.exportKey('raw', keyPair.publicKey);

  const signature = await subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    identityKey.privateKey,
    publicKeyRaw,
  );

  return {
    keyId: generateId(),
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
    publicKeyRaw,
    signature,
  };
}

/**
 * Generate a batch of one-time prekeys.
 */
export async function generateOneTimePreKeys(count: number): Promise<OneTimePreKeyPair[]> {
  const keys: OneTimePreKeyPair[] = [];
  for (let i = 0; i < count; i++) {
    const keyPair = await subtle.generateKey(ECDH_PARAMS, true, ['deriveBits']);
    const publicKeyRaw = await subtle.exportKey('raw', keyPair.publicKey);
    keys.push({
      keyId: generateId(),
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey,
      publicKeyRaw,
    });
  }
  return keys;
}

/**
 * Export public keys as a key bundle for uploading to the server.
 */
export function exportKeyBundle(
  identity: IdentityKeyPair,
  signedPreKey: SignedPreKeyPair,
  oneTimePreKeys: OneTimePreKeyPair[],
): E2EEKeyBundle {
  return {
    identityKey: toBase64(identity.publicKeyRaw),
    signedPreKey: {
      keyId: signedPreKey.keyId,
      publicKey: toBase64(signedPreKey.publicKeyRaw),
      signature: toBase64(signedPreKey.signature),
      createdAt: new Date().toISOString(),
    } satisfies SignedPreKey,
    oneTimePreKeys: oneTimePreKeys.map(
      (k): OneTimePreKey => ({
        keyId: k.keyId,
        publicKey: toBase64(k.publicKeyRaw),
      }),
    ),
  };
}

// --- X3DH-like key agreement ---

/**
 * Derive a shared secret using ECDH and HKDF.
 */
async function deriveSharedSecret(
  privateKey: CryptoKey,
  publicKey: CryptoKey,
): Promise<ArrayBuffer> {
  return subtle.deriveBits({ name: 'ECDH', public: publicKey }, privateKey, 256);
}

async function hkdfExpand(
  inputKeyMaterial: ArrayBuffer,
  info: string,
  length: number = 32,
): Promise<ArrayBuffer> {
  const ikm = await subtle.importKey('raw', inputKeyMaterial, 'HKDF', false, ['deriveBits']);
  return subtle.deriveBits(
    {
      name: 'HKDF',
      hash: HKDF_HASH,
      salt: new Uint8Array(32),
      info: new TextEncoder().encode(info),
    },
    ikm,
    length * 8,
  );
}

async function importECDHPublicKey(raw: ArrayBuffer): Promise<CryptoKey> {
  return subtle.importKey('raw', raw, ECDH_PARAMS, true, []);
}

/**
 * Perform X3DH-like key agreement to create a session with a remote party.
 * Uses their published key bundle.
 *
 * The protocol computes:
 *   DH1 = ECDH(ourIdentityKey, theirSignedPreKey)
 *   DH2 = ECDH(ourEphemeralKey, theirIdentityKey)
 *   DH3 = ECDH(ourEphemeralKey, theirSignedPreKey)
 *   DH4 = ECDH(ourEphemeralKey, theirOneTimePreKey) [if available]
 *   SK  = HKDF(DH1 || DH2 || DH3 || DH4)
 */
export async function createSession(
  ourIdentity: IdentityKeyPair,
  theirBundle: E2EEKeyBundle,
): Promise<{ session: Session; ephemeralPublicKey: string }> {
  // Import their public keys
  const theirIdentityKey = await importECDHPublicKey(fromBase64(theirBundle.identityKey));
  const theirSignedPreKey = await importECDHPublicKey(
    fromBase64(theirBundle.signedPreKey.publicKey),
  );

  // Generate our ephemeral key
  const ephemeralKeyPair = await subtle.generateKey(ECDH_PARAMS, true, ['deriveBits']);
  const ephemeralPublicRaw = await subtle.exportKey('raw', ephemeralKeyPair.publicKey);

  // We need an ECDH-capable version of our identity key for DH1
  // Since identity key is ECDSA, we export and re-import as ECDH
  const _identityKeyRaw = await subtle.exportKey('raw', ourIdentity.publicKey);
  const identityPrivateJwk = await subtle.exportKey('jwk', ourIdentity.privateKey);
  // Change the key_ops and algorithm for ECDH usage
  const identityECDHPrivate = await subtle.importKey(
    'jwk',
    { ...identityPrivateJwk, key_ops: ['deriveBits'] },
    ECDH_PARAMS,
    false,
    ['deriveBits'],
  );

  // DH1: our identity x their signed prekey
  const dh1 = await deriveSharedSecret(identityECDHPrivate, theirSignedPreKey);

  // DH2: our ephemeral x their identity
  const dh2 = await deriveSharedSecret(ephemeralKeyPair.privateKey, theirIdentityKey);

  // DH3: our ephemeral x their signed prekey
  const dh3 = await deriveSharedSecret(ephemeralKeyPair.privateKey, theirSignedPreKey);

  let sharedSecretInput = concat(dh1, dh2, dh3);

  // DH4: our ephemeral x their one-time prekey (if available)
  if (theirBundle.oneTimePreKeys.length > 0) {
    const theirOTPK = await importECDHPublicKey(
      fromBase64(theirBundle.oneTimePreKeys[0].publicKey),
    );
    const dh4 = await deriveSharedSecret(ephemeralKeyPair.privateKey, theirOTPK);
    sharedSecretInput = concat(sharedSecretInput, dh4);
  }

  // Derive root key and chain keys using HKDF
  const rootKey = await hkdfExpand(sharedSecretInput, 'RelayForge-RootKey');
  const sendChainKey = await hkdfExpand(sharedSecretInput, 'RelayForge-SendChain');
  const recvChainKey = await hkdfExpand(sharedSecretInput, 'RelayForge-RecvChain');

  // Generate initial ratchet key pair
  const sendRatchetKey = await subtle.generateKey(ECDH_PARAMS, true, ['deriveBits']);

  const session: Session = {
    rootKey,
    sendChainKey,
    recvChainKey,
    sendRatchetKey,
    recvRatchetPublicKey: null,
    sendMessageIndex: 0,
    recvMessageIndex: 0,
    sendChainIndex: 0,
    recvChainIndex: 0,
  };

  return {
    session,
    ephemeralPublicKey: toBase64(ephemeralPublicRaw),
  };
}

// --- Double Ratchet encrypt/decrypt ---

/**
 * Derive a message key from a chain key using HKDF, then advance the chain.
 */
async function deriveMessageKey(
  chainKey: ArrayBuffer,
): Promise<{ messageKey: ArrayBuffer; nextChainKey: ArrayBuffer }> {
  const messageKey = await hkdfExpand(chainKey, 'RelayForge-MessageKey');
  const nextChainKey = await hkdfExpand(chainKey, 'RelayForge-ChainStep');
  return { messageKey, nextChainKey };
}

/**
 * Encrypt a plaintext message using the Double Ratchet session.
 * Returns the encrypted message and mutates the session state.
 */
export async function encrypt(session: Session, plaintext: string): Promise<EncryptedMessage> {
  const { messageKey, nextChainKey } = await deriveMessageKey(session.sendChainKey);
  session.sendChainKey = nextChainKey;

  // Import message key for AES-GCM
  const aesKey = await subtle.importKey(
    'raw',
    messageKey,
    { name: 'AES-GCM', length: AES_KEY_LENGTH },
    false,
    ['encrypt'],
  );

  // Generate nonce
  const nonce = globalThis.crypto.getRandomValues(new Uint8Array(12));

  // Encode plaintext
  const encoded = new TextEncoder().encode(plaintext);

  // Encrypt
  const ciphertext = await subtle.encrypt(
    { name: 'AES-GCM', iv: nonce, tagLength: 128 },
    aesKey,
    encoded,
  );

  // Export current ratchet public key
  const ratchetPublicRaw = await subtle.exportKey('raw', session.sendRatchetKey.publicKey);

  const messageIndex = session.sendMessageIndex;
  const chainIndex = session.sendChainIndex;
  session.sendMessageIndex++;

  return {
    ciphertext: toBase64(ciphertext),
    nonce: toBase64(nonce.buffer),
    senderKeyId: generateId(),
    messageIndex,
    chainIndex,
    senderRatchetKey: toBase64(ratchetPublicRaw),
  };
}

/**
 * Decrypt a ciphertext message using the Double Ratchet session.
 * Performs a DH ratchet step if the sender's ratchet key has changed.
 */
export async function decrypt(session: Session, message: EncryptedMessage): Promise<string> {
  // Check if we need to perform a DH ratchet step
  const senderRatchetKeyRaw = fromBase64(message.senderRatchetKey);
  const senderRatchetKey = await importECDHPublicKey(senderRatchetKeyRaw);

  if (session.recvRatchetPublicKey) {
    const existingRaw = await subtle.exportKey('raw', session.recvRatchetPublicKey);
    const existingB64 = toBase64(existingRaw);
    const newB64 = message.senderRatchetKey;

    if (existingB64 !== newB64) {
      // DH ratchet step: derive new recv chain key
      const dhResult = await deriveSharedSecret(
        session.sendRatchetKey.privateKey,
        senderRatchetKey,
      );
      session.recvChainKey = await hkdfExpand(
        concat(session.rootKey, dhResult),
        'RelayForge-RecvChain',
      );
      session.rootKey = await hkdfExpand(concat(session.rootKey, dhResult), 'RelayForge-RootKey');
      session.recvRatchetPublicKey = senderRatchetKey;
      session.recvMessageIndex = 0;
      session.recvChainIndex++;

      // Also generate new send ratchet key
      session.sendRatchetKey = await subtle.generateKey(ECDH_PARAMS, true, ['deriveBits']);
      const dhResult2 = await deriveSharedSecret(
        session.sendRatchetKey.privateKey,
        senderRatchetKey,
      );
      session.sendChainKey = await hkdfExpand(
        concat(session.rootKey, dhResult2),
        'RelayForge-SendChain',
      );
      session.sendChainIndex++;
      session.sendMessageIndex = 0;
    }
  } else {
    session.recvRatchetPublicKey = senderRatchetKey;
  }

  // Advance the receive chain to the correct message index
  let currentChainKey = session.recvChainKey;
  for (let i = session.recvMessageIndex; i < message.messageIndex; i++) {
    const { nextChainKey } = await deriveMessageKey(currentChainKey);
    currentChainKey = nextChainKey;
  }

  // Derive the message key for this specific message
  const { messageKey, nextChainKey } = await deriveMessageKey(currentChainKey);
  session.recvChainKey = nextChainKey;
  session.recvMessageIndex = message.messageIndex + 1;

  // Import message key for AES-GCM
  const aesKey = await subtle.importKey(
    'raw',
    messageKey,
    { name: 'AES-GCM', length: AES_KEY_LENGTH },
    false,
    ['decrypt'],
  );

  const nonce = fromBase64(message.nonce);
  const ciphertext = fromBase64(message.ciphertext);

  const decrypted = await subtle.decrypt(
    { name: 'AES-GCM', iv: nonce, tagLength: 128 },
    aesKey,
    ciphertext,
  );

  return new TextDecoder().decode(decrypted);
}
