export default function E2EEPage() {
  return (
    <div>
      <h1>End-to-End Encryption</h1>
      <p>
        RelayForge implements end-to-end encryption (E2EE) for direct messages using
        well-established cryptographic protocols. This page explains what is encrypted, what is not,
        how the cryptographic protocols work, and the design tradeoffs involved.
      </p>

      <h2>Encryption Boundaries</h2>

      <h3>What IS Encrypted</h3>
      <ul>
        <li>
          <strong>1-on-1 direct messages:</strong> All message content, attachments metadata, and
          reactions in DM channels are encrypted end-to-end.
        </li>
        <li>
          <strong>Group DMs:</strong> Messages in group DM channels (up to 10 participants) are
          encrypted with pairwise E2EE sessions between each pair of participants.
        </li>
      </ul>
      <p>
        The server stores only encrypted ciphertext for DM messages. It cannot decrypt message
        content, even with full database access. Message metadata (sender ID, timestamp, channel ID)
        is not encrypted because the server needs it for routing and ordering.
      </p>

      <h3>What is NOT Encrypted</h3>
      <ul>
        <li>
          <strong>Guild (server) channel messages</strong> are not end-to-end encrypted.
        </li>
        <li>
          <strong>Voice and video streams</strong> use LiveKit's transport encryption (DTLS-SRTP)
          but are not E2EE.
        </li>
        <li>
          <strong>File contents</strong> in guild channels are stored in plaintext on the object
          storage backend.
        </li>
        <li>
          <strong>User profiles, guild metadata, and presence information</strong> are not
          encrypted.
        </li>
      </ul>

      <h3>Why Guild Messages Are Not E2EE</h3>
      <p>
        This is a deliberate design decision, not a limitation. Guild messages are not E2EE for the
        following reasons:
      </p>
      <ol>
        <li>
          <strong>Full-text search:</strong> Users expect to search message history. E2EE makes
          server-side search impossible, and client-side search of large histories is impractical.
        </li>
        <li>
          <strong>Moderation:</strong> Guild owners and moderators need to review reported messages,
          enforce rules, and remove harmful content. E2EE would prevent this entirely.
        </li>
        <li>
          <strong>Audit logging:</strong> Organizations deploying RelayForge for compliance purposes
          need audit trails of guild communications.
        </li>
        <li>
          <strong>Key management complexity:</strong> Guilds can have thousands of members with
          frequent joins and leaves. Managing encryption keys across all members and maintaining
          forward secrecy would be extremely complex and fragile.
        </li>
        <li>
          <strong>Performance:</strong> Encrypting and decrypting every message for every member in
          a large channel would impose significant client-side CPU and bandwidth overhead (each
          message would need a separate encrypted copy per member, or a group key that must be
          rotated on every membership change).
        </li>
      </ol>

      <h2>X3DH Key Exchange</h2>
      <p>
        RelayForge uses the <strong>Extended Triple Diffie-Hellman (X3DH)</strong> protocol for
        establishing shared secrets between two parties. X3DH enables asynchronous key exchange
        &mdash; Alice can initiate an encrypted session with Bob even when Bob is offline.
      </p>

      <h3>Key Types</h3>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Lifetime</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Identity Key (IK)</strong>
            </td>
            <td>Permanent (per device)</td>
            <td>
              Long-term identity. Used to authenticate the device owner. Generated once when the
              device is registered.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Signed Pre-Key (SPK)</strong>
            </td>
            <td>Rotated periodically (e.g., weekly)</td>
            <td>
              Medium-term key signed by the identity key. Provides authentication of the key bundle.
            </td>
          </tr>
          <tr>
            <td>
              <strong>One-Time Pre-Keys (OPK)</strong>
            </td>
            <td>Single use</td>
            <td>
              Batch of ephemeral keys uploaded to the server. Each is consumed by one incoming
              session. Provides forward secrecy for the initial message.
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Key Exchange Flow</h3>
      <ol>
        <li>
          <strong>Bob registers his device</strong> and uploads a key bundle to the server: his
          identity key, a signed pre-key (with signature), and a batch of 100 one-time pre-keys.
        </li>
        <li>
          <strong>Alice wants to message Bob.</strong> She fetches Bob's key bundle from the server
          (IK, SPK, and one OPK).
        </li>
        <li>
          <strong>Alice generates an ephemeral key pair</strong> (EK) and performs four
          Diffie-Hellman computations:
          <ul>
            <li>
              <code>DH1 = DH(Alice_IK, Bob_SPK)</code> &mdash; Mutual authentication
            </li>
            <li>
              <code>DH2 = DH(Alice_EK, Bob_IK)</code> &mdash; Authentication of Alice's ephemeral
              key
            </li>
            <li>
              <code>DH3 = DH(Alice_EK, Bob_SPK)</code> &mdash; Forward secrecy
            </li>
            <li>
              <code>DH4 = DH(Alice_EK, Bob_OPK)</code> &mdash; Additional forward secrecy (if OPK
              available)
            </li>
          </ul>
        </li>
        <li>
          <strong>Alice derives a shared secret</strong> using HKDF over the concatenation of DH1
          through DH4.
        </li>
        <li>
          <strong>Alice sends her initial message</strong> along with her identity key, ephemeral
          public key, and the ID of Bob's OPK she used.
        </li>
        <li>
          <strong>Bob receives the message</strong> and performs the same DH computations using his
          private keys to derive the same shared secret.
        </li>
      </ol>

      <h2>Double Ratchet Protocol</h2>
      <p>
        After the X3DH handshake establishes a shared secret, the <strong>Double Ratchet</strong>{' '}
        protocol is used for all subsequent messages. The Double Ratchet provides:
      </p>
      <ul>
        <li>
          <strong>Forward secrecy:</strong> Compromising a message key does not reveal past
          messages.
        </li>
        <li>
          <strong>Break-in recovery:</strong> Even if an attacker compromises current session state,
          future messages become secure again after a DH ratchet step.
        </li>
        <li>
          <strong>Out-of-order delivery:</strong> Messages can arrive out of order and still be
          decrypted correctly.
        </li>
      </ul>

      <h3>How It Works</h3>
      <p>The protocol maintains two ratchet mechanisms:</p>
      <ol>
        <li>
          <strong>Diffie-Hellman ratchet:</strong> Each time the sender changes (Alice sends, then
          Bob replies), a new DH key pair is generated and a new shared secret is derived. This is
          the "asymmetric" ratchet that provides break-in recovery.
        </li>
        <li>
          <strong>Symmetric-key ratchet:</strong> For consecutive messages from the same sender, a
          KDF chain derives new message keys from the previous chain key. Each message gets a unique
          key, and old chain keys are deleted.
        </li>
      </ol>
      <p>
        Messages are encrypted with AES-256-GCM using the derived message key. The associated data
        (AD) includes both parties' identity keys to prevent key substitution attacks.
      </p>

      <h2>Device Management</h2>
      <p>
        E2EE in RelayForge is device-centric, not account-centric. Each device has its own identity
        key pair and maintains separate sessions with every other device it communicates with.
      </p>

      <h3>Key Bundles</h3>
      <p>
        When a user registers a new device (logs in from a new browser, desktop app, or future
        mobile app), the device:
      </p>
      <ol>
        <li>Generates an X25519 identity key pair.</li>
        <li>Generates a signed pre-key and signs it with the identity key.</li>
        <li>Generates a batch of 100 one-time pre-keys.</li>
        <li>
          Uploads the public parts to the server via the <code>PUT /api/e2ee/keys</code> endpoint.
        </li>
      </ol>
      <p>
        The server stores key bundles but never sees private keys. When one-time pre-keys run low
        (below 20), the client automatically generates and uploads a new batch.
      </p>

      <h3>Multi-Device Behavior</h3>
      <p>
        When Alice sends a DM to Bob, the client encrypts the message separately for each of Bob's
        devices, creating one ciphertext per device. Similarly, Alice's own other devices receive an
        encrypted copy so the conversation is synchronized.
      </p>
      <p>This means a message to a user with 3 devices results in:</p>
      <ul>
        <li>1 ciphertext for each of the recipient's 3 devices = 3 ciphertexts</li>
        <li>
          1 ciphertext for each of the sender's other devices (e.g., 1 other device) = 1 ciphertext
        </li>
        <li>Total: 4 ciphertexts stored on the server for one logical message</li>
      </ul>

      <h3>Device Revocation</h3>
      <p>
        Users can revoke a device from the Settings &gt; Devices page. When a device is revoked:
      </p>
      <ol>
        <li>The device's key bundle is deleted from the server.</li>
        <li>All active sessions to/from that device are marked as stale.</li>
        <li>
          Other devices are notified via a WebSocket event to stop encrypting messages for the
          revoked device.
        </li>
        <li>The revoked device can no longer decrypt new messages (it has no valid session).</li>
        <li>
          Messages already decrypted on the revoked device remain accessible locally until the user
          clears data.
        </li>
      </ol>

      <h2>Trust Model and Verification</h2>
      <p>
        RelayForge uses a <strong>Trust On First Use (TOFU)</strong> model by default:
      </p>
      <ul>
        <li>
          The first time Alice communicates with Bob's device, she accepts the device's identity key
          automatically.
        </li>
        <li>
          If Bob's identity key changes (e.g., re-registration), Alice is warned with a prominent
          banner in the DM conversation.
        </li>
        <li>
          Users can verify each other's identity keys by comparing fingerprints (a hash of the
          identity key displayed as emoji or hex) through an out-of-band channel.
        </li>
        <li>Verified devices are marked with a green shield icon in the conversation.</li>
      </ul>

      <h3>Fingerprint Comparison</h3>
      <p>
        Each device's fingerprint is a truncated SHA-256 hash of the identity public key, displayed
        as 8 groups of 5 digits:
      </p>
      <pre>
        <code>{`37291 49302 58210 67392
48201 59312 60482 71203`}</code>
      </pre>
      <p>
        Users can compare these numbers in person or via a trusted secondary channel (phone call,
        video chat) to verify they are communicating with the intended party.
      </p>

      <h2>Known Tradeoffs and Limitations</h2>
      <ul>
        <li>
          <strong>No server-side search for DMs:</strong> Since the server cannot read DM content,
          search is performed client-side over locally cached messages. This may be slow for very
          long conversation histories.
        </li>
        <li>
          <strong>Storage overhead:</strong> Each message is stored once per recipient device. Users
          with many devices increase storage requirements.
        </li>
        <li>
          <strong>No message recall guarantee:</strong> If a user loses all their devices without
          backup, past DM messages cannot be recovered. There is no server-side fallback.
        </li>
        <li>
          <strong>Key management UX:</strong> Users must understand that E2EE is device-based.
          Logging in on a new device does not automatically give access to past DM history.
        </li>
        <li>
          <strong>Group DM scaling:</strong> Group DMs are limited to 10 participants because each
          pair of participants requires a separate session. The number of sessions grows
          quadratically.
        </li>
        <li>
          <strong>No E2EE for voice/video:</strong> LiveKit uses DTLS-SRTP for transport encryption,
          which protects against network eavesdropping but not against a compromised LiveKit server.
          True E2EE for media requires{' '}
          <a href="https://docs.livekit.io/guides/e2ee/" target="_blank" rel="noopener noreferrer">
            LiveKit's E2EE extension
          </a>
          , which is on the roadmap.
        </li>
      </ul>

      <h2>Cryptographic Primitives</h2>
      <table>
        <thead>
          <tr>
            <th>Function</th>
            <th>Algorithm</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Key agreement</td>
            <td>X25519 (Curve25519 Diffie-Hellman)</td>
          </tr>
          <tr>
            <td>Signatures</td>
            <td>Ed25519 (for signing pre-keys)</td>
          </tr>
          <tr>
            <td>Key derivation</td>
            <td>HKDF-SHA-256</td>
          </tr>
          <tr>
            <td>Message encryption</td>
            <td>AES-256-GCM</td>
          </tr>
          <tr>
            <td>Fingerprints</td>
            <td>SHA-256 (truncated)</td>
          </tr>
        </tbody>
      </table>
      <p>
        All cryptographic operations are performed using the{' '}
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto"
          target="_blank"
          rel="noopener noreferrer"
        >
          Web Crypto API
        </a>{' '}
        in browsers and the <code>@noble/curves</code> library for X25519 and Ed25519 operations
        that are not natively supported by Web Crypto.
      </p>
    </div>
  );
}
