export default function FAQPage() {
  return (
    <div>
      <h1>Frequently Asked Questions</h1>

      <h2>What is RelayForge?</h2>
      <p>
        RelayForge is a self-hostable, open-source team communication platform. It provides
        real-time text chat with channels and threads, voice and video calls powered by LiveKit,
        end-to-end encrypted direct messages, file sharing with antivirus scanning, and a
        comprehensive permissions system. Think of it as a self-hosted alternative to Discord,
        designed for teams and communities that want full control over their data and
        infrastructure.
      </p>

      <h2>How is RelayForge different from Discord, Rocket.Chat, and Matrix?</h2>
      <p>RelayForge occupies a specific niche in the communication platform landscape:</p>
      <ul>
        <li>
          <strong>vs. Discord:</strong> Discord is a proprietary, hosted service. You cannot
          self-host it or audit the code. RelayForge is fully open-source (AGPL-3.0) and
          self-hostable. RelayForge provides E2EE for DMs, which Discord does not. However, Discord
          has a massive ecosystem of bots and integrations that RelayForge does not yet match.
        </li>
        <li>
          <strong>vs. Rocket.Chat:</strong> Rocket.Chat is a mature, enterprise-focused platform
          written in Node.js/Meteor. RelayForge uses a Go backend for better performance and lower
          resource consumption. RelayForge's UI is more modern (React + Tailwind) and its
          voice/video uses LiveKit instead of Jitsi, providing better scalability for larger calls.
          Rocket.Chat has more integrations and a longer track record.
        </li>
        <li>
          <strong>vs. Matrix (Element):</strong> Matrix is a federated protocol, meaning multiple
          servers can communicate with each other. RelayForge is single-instance by design
          (federation is a long-term roadmap item). Matrix encrypts all messages by default, while
          RelayForge encrypts only DMs (by design, to enable search and moderation in guild
          channels). Matrix's UX can be complex; RelayForge aims for Discord-like simplicity.
        </li>
      </ul>

      <h2>What are the hardware requirements?</h2>
      <table>
        <thead>
          <tr>
            <th>Scale</th>
            <th>Users</th>
            <th>CPU</th>
            <th>RAM</th>
            <th>Storage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Small</td>
            <td>Up to 100</td>
            <td>2 vCPUs</td>
            <td>4 GB</td>
            <td>20 GB SSD</td>
          </tr>
          <tr>
            <td>Medium</td>
            <td>100 - 1,000</td>
            <td>4 vCPUs</td>
            <td>8 GB</td>
            <td>50 GB SSD</td>
          </tr>
          <tr>
            <td>Large</td>
            <td>1,000 - 10,000</td>
            <td>8+ vCPUs</td>
            <td>16+ GB</td>
            <td>100+ GB SSD</td>
          </tr>
        </tbody>
      </table>
      <p>
        Storage requirements depend heavily on file upload volume. The numbers above cover the
        database and application; add additional S3/MinIO storage based on expected media usage.
        Voice and video traffic is bandwidth-intensive but does not require significant disk space.
      </p>

      <h2>Can I run RelayForge on a Raspberry Pi?</h2>
      <p>
        Yes, with caveats. RelayForge publishes ARM64 container images that run on Raspberry Pi 4
        and 5 with 4 GB or more RAM. Performance expectations:
      </p>
      <ul>
        <li>A Raspberry Pi 4 (4 GB) can comfortably serve 10-20 concurrent users.</li>
        <li>A Raspberry Pi 5 (8 GB) can handle 50-100 concurrent users.</li>
        <li>
          Voice/video calls work but are limited to a few simultaneous participants due to CPU
          constraints on media encoding.
        </li>
        <li>
          Use an external SSD (USB 3.0) for the PostgreSQL data directory to avoid SD card I/O
          bottlenecks.
        </li>
        <li>Consider disabling ClamAV (it requires ~1 GB RAM) on low-memory devices.</li>
      </ul>

      <h2>Is RelayForge production-ready?</h2>
      <p>
        RelayForge is currently at version 0.1.0 and is in an early stage. It is functional and
        suitable for small teams and communities willing to accept some rough edges. For
        mission-critical production use, be aware of:
      </p>
      <ul>
        <li>The API surface may change between minor versions until 1.0.</li>
        <li>Migration paths between versions are provided but may require manual steps.</li>
        <li>
          Some features are still being refined (e.g., search performance, notification delivery).
        </li>
        <li>The project has not yet undergone a formal third-party security audit.</li>
      </ul>
      <p>
        We recommend starting with a small pilot deployment and scaling up as you gain confidence.
      </p>

      <h2>How does E2EE work for DMs?</h2>
      <p>
        Direct messages are encrypted using the X3DH key exchange protocol (for establishing a
        shared secret between two devices) and the Double Ratchet protocol (for ongoing message
        encryption with forward secrecy). Each device has its own identity key pair, and messages
        are encrypted per-device. The server never has access to plaintext DM content. For full
        details, see the <a href="/e2ee">End-to-End Encryption</a> page.
      </p>

      <h2>Why aren't guild messages end-to-end encrypted?</h2>
      <p>This is a deliberate design decision. Guild messages are not E2EE because:</p>
      <ol>
        <li>
          <strong>Search:</strong> Users expect full-text search across message history. E2EE makes
          server-side search impossible.
        </li>
        <li>
          <strong>Moderation:</strong> Guild owners and moderators need to review and act on
          reported content. E2EE would prevent this.
        </li>
        <li>
          <strong>Audit trails:</strong> Organizations need compliance logging of guild
          communications.
        </li>
        <li>
          <strong>Scalability:</strong> A guild with 1,000 members would require managing encryption
          keys for all members with proper rotation on every membership change, which is
          computationally expensive and fragile.
        </li>
      </ol>
      <p>
        Guild messages are still protected by transport-level encryption (TLS) in transit and
        standard database access controls at rest. Self-hosting means you control who has access to
        the server.
      </p>

      <h2>Can I use my own S3 provider?</h2>
      <p>
        Yes. RelayForge uses the standard S3 API and works with any S3-compatible storage provider.
        Tested providers include: MinIO, AWS S3, Tencent COS, Alibaba OSS, Huawei OBS, Cloudflare
        R2, Backblaze B2, and DigitalOcean Spaces. Set the <code>S3_ENDPOINT</code> environment
        variable to point to your provider. See the <a href="/storage">Object Storage</a> page for
        configuration details.
      </p>

      <h2>How do I add custom emoji?</h2>
      <p>
        Custom emoji are managed per guild by users with the <code>MANAGE_EMOJI</code> permission:
      </p>
      <ol>
        <li>Open guild settings and navigate to the "Emoji" section.</li>
        <li>Click "Upload Emoji" and select an image file.</li>
        <li>Supported formats: PNG, GIF (animated), APNG, and WebP.</li>
        <li>Maximum dimensions: 128x128 pixels. Maximum file size: 256 KB.</li>
        <li>
          Give the emoji a name (alphanumeric and underscores only, e.g., <code>party_parrot</code>
          ).
        </li>
        <li>
          The emoji is immediately available to all guild members as <code>:party_parrot:</code>.
        </li>
      </ol>
      <p>
        There is no global limit on custom emoji per guild, but keep in mind that each emoji is
        loaded by every client that views a message containing it.
      </p>

      <h2>How do I enable two-factor authentication (2FA)?</h2>
      <p>Users can enable TOTP-based 2FA from their account settings:</p>
      <ol>
        <li>Go to Settings &gt; Security &gt; Two-Factor Authentication.</li>
        <li>Click "Enable 2FA."</li>
        <li>
          Scan the QR code with an authenticator app (Google Authenticator, Authy, 1Password, etc.).
        </li>
        <li>Enter the 6-digit code from the authenticator app to confirm.</li>
        <li>
          Save the backup codes in a secure location. These one-time codes can be used if you lose
          access to your authenticator device.
        </li>
      </ol>
      <p>
        Once enabled, 2FA is required on every login. Platform admins can force-reset a user's 2FA
        from the admin console if they lose their device and backup codes.
      </p>

      <h2>Can I federate with other RelayForge instances?</h2>
      <p>
        Not yet. Federation (allowing users on different RelayForge instances to communicate with
        each other) is a long-term roadmap item. The current architecture is single-instance. If you
        need federation today, consider Matrix/Element, which is built around a federated protocol
        from the ground up.
      </p>

      <h2>What about mobile apps?</h2>
      <p>
        Native mobile apps are on the medium-term roadmap. The recommended approach is React Native,
        which would share significant code with the web client (validation schemas, API client,
        state management). In the meantime, the web client is responsive and works on mobile
        browsers, including Safari on iOS and Chrome on Android. The web client can also be
        installed as a PWA (Progressive Web App) for a more native-like experience.
      </p>

      <h2>How do I migrate from Discord/Slack?</h2>
      <p>There is no automated migration tool at this time. However, you can:</p>
      <ul>
        <li>
          Export your Discord server data using Discord's built-in export (Settings &gt; Privacy
          &gt; Request Data) or third-party tools.
        </li>
        <li>Manually recreate channels, roles, and permissions in RelayForge.</li>
        <li>Message history migration would require a custom script using the RelayForge API.</li>
        <li>An official migration tool is being considered for a future release.</li>
      </ul>

      <h2>Can I customize the appearance?</h2>
      <p>
        The web client uses Tailwind CSS with a customizable theme defined in{' '}
        <code>tailwind.config.js</code>. You can:
      </p>
      <ul>
        <li>
          Change the accent color (default: emerald) by updating the <code>brand</code> color
          palette.
        </li>
        <li>Modify the dark theme background colors.</li>
        <li>
          Add custom CSS in <code>src/styles/globals.css</code>.
        </li>
        <li>Replace the logo and branding via the admin console's custom branding settings.</li>
      </ul>
      <p>
        The platform name shown on the login page can be changed via the admin console without
        rebuilding the frontend.
      </p>

      <h2>How do I reset my password if I'm locked out?</h2>
      <p>
        If email verification is enabled and SMTP is configured, use the "Forgot Password" link on
        the login page. If email is not configured, a platform admin can force a password reset from
        the admin console. As a last resort, the CLI tool can reset passwords directly:
      </p>
      <pre>
        <code>{`docker compose exec api /app/cli user reset-password \\
  --username your_username --new-password your_new_password`}</code>
      </pre>
    </div>
  );
}
