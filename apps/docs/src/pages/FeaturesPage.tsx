export default function FeaturesPage() {
  return (
    <div>
      <h1>Features</h1>
      <p>
        RelayForge delivers a comprehensive feature set for team communication. Below is a detailed
        breakdown of every major capability, organised by domain.
      </p>

      <h2>Guilds (Servers)</h2>
      <ul>
        <li>Create unlimited guilds, each with its own name, icon, banner, and description.</li>
        <li>Guild owners can transfer ownership or delete the guild entirely.</li>
        <li>
          Invite system with short-lived, single-use, or permanent invite codes and configurable
          max-uses.
        </li>
        <li>
          Guild discovery is scoped to invite links only &mdash; no public directory by default,
          keeping communities private.
        </li>
        <li>Member list with online/idle/DND/offline presence indicators.</li>
        <li>Member nicknames per guild, independent of the global display name.</li>
      </ul>

      <h2>Channels</h2>
      <p>Channels live inside guilds and come in several types:</p>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>text</code>
            </td>
            <td>Standard real-time chat with message history, reactions, and threads.</td>
          </tr>
          <tr>
            <td>
              <code>voice</code>
            </td>
            <td>Persistent voice room powered by LiveKit. Supports video and screen sharing.</td>
          </tr>
          <tr>
            <td>
              <code>announcement</code>
            </td>
            <td>
              Publish-only channel. Only users with <code>SEND_MESSAGES</code> permission can post;
              everyone else reads.
            </td>
          </tr>
          <tr>
            <td>
              <code>forum</code>
            </td>
            <td>
              Thread-first channel. Every new post creates its own thread for focused discussion.
            </td>
          </tr>
        </tbody>
      </table>
      <ul>
        <li>Channels are grouped into categories for sidebar organisation.</li>
        <li>
          Per-channel permission overrides allow fine-grained access control beyond the role
          defaults.
        </li>
        <li>Slow mode (rate-limit per user) can be set per channel.</li>
        <li>
          Channel topics are displayed in the header and can be updated by users with{' '}
          <code>MANAGE_CHANNELS</code>.
        </li>
      </ul>

      <h2>Messaging</h2>
      <ul>
        <li>
          Messages support Markdown formatting (bold, italic, strikethrough, code blocks, block
          quotes, headers).
        </li>
        <li>
          File attachments (images, videos, audio, documents) with server-side antivirus scanning
          via ClamAV.
        </li>
        <li>Rich embeds auto-generated for links (Open Graph / oEmbed metadata).</li>
        <li>Emoji reactions with both built-in Unicode emoji and custom guild emojis.</li>
        <li>Threaded replies &mdash; reply to any message to start a sub-conversation.</li>
        <li>Pinned messages per channel (up to 50).</li>
        <li>Message editing and deletion with edit history tracking.</li>
        <li>Typing indicators broadcast over WebSocket.</li>
        <li>Unread tracking with per-channel read-state cursors.</li>
        <li>
          <code>@everyone</code>, <code>@here</code>, role mentions, and user mentions with
          notification targeting.
        </li>
        <li>
          Message search by keyword, author, date range, and channel (backed by PostgreSQL full-text
          search).
        </li>
      </ul>

      <h2>Polls</h2>
      <ul>
        <li>Create inline polls inside any text channel.</li>
        <li>Single-choice or multiple-choice voting.</li>
        <li>Optional expiration time after which the poll auto-closes.</li>
        <li>Real-time vote count updates over WebSocket.</li>
      </ul>

      <h2>Voice &amp; Video</h2>
      <ul>
        <li>
          Powered by <strong>LiveKit</strong>, an open-source WebRTC SFU.
        </li>
        <li>
          Join a voice channel to start audio &mdash; toggle video and screen share at any time.
        </li>
        <li>
          Room lifecycle managed by the API: rooms are created on first join and cleaned up when
          empty.
        </li>
        <li>JWT-based room tokens issued per user, per channel, with configurable TTL.</li>
        <li>
          Server-side mute and deafen controlled by users with the <code>MUTE_MEMBERS</code> /{' '}
          <code>DEAFEN_MEMBERS</code> permission.
        </li>
        <li>Participant list and voice state changes broadcast in real time.</li>
      </ul>

      <h2>Direct Messages with End-to-End Encryption</h2>
      <ul>
        <li>
          1-on-1 DM channels with full E2EE using <strong>X3DH key agreement</strong> and the{' '}
          <strong>Double Ratchet</strong> protocol.
        </li>
        <li>
          The server never has access to plaintext DM content &mdash; it stores only encrypted
          ciphertext.
        </li>
        <li>
          Each device generates its own identity key pair, signed pre-key, and a batch of one-time
          pre-keys.
        </li>
        <li>
          Key bundles are uploaded to the server so initiating parties can perform the handshake
          asynchronously.
        </li>
        <li>Group DM channels (up to 10 participants) with pairwise E2EE sessions.</li>
        <li>
          Device management: users can view and revoke devices, which invalidates associated
          sessions.
        </li>
      </ul>

      <h2>Moderation</h2>
      <ul>
        <li>Kick and ban members with optional reason and audit log entry.</li>
        <li>Timed bans with automatic expiry.</li>
        <li>
          Auto-moderation rules: keyword filters, spam detection, link blocking, mention limits.
        </li>
        <li>
          Message purge &mdash; bulk delete up to 100 messages from a channel or by a specific user.
        </li>
        <li>
          Channel lockdown: temporarily revoke <code>SEND_MESSAGES</code> for @everyone.
        </li>
        <li>
          Comprehensive audit log recording who did what and when, filterable by action type and
          actor.
        </li>
      </ul>

      <h2>Admin Console</h2>
      <ul>
        <li>Dedicated web application for platform administrators.</li>
        <li>Dashboard with system metrics: total users, guilds, messages, active connections.</li>
        <li>
          User management: search, view profile, disable/enable accounts, force password reset.
        </li>
        <li>
          Guild management: list all guilds, view member counts, force-delete guilds violating
          terms.
        </li>
        <li>
          System health overview: API, realtime, media service status, database connections, cache
          hit rates.
        </li>
        <li>Feature flags and global settings management.</li>
      </ul>

      <h2>Desktop Application</h2>
      <ul>
        <li>
          Built with <strong>Electron</strong>, wrapping the web client for native OS integration.
        </li>
        <li>System tray icon with unread badge count.</li>
        <li>Native desktop notifications with click-to-focus.</li>
        <li>Auto-update via Electron's built-in update mechanism.</li>
        <li>Supports macOS, Windows, and Linux (AppImage / deb / rpm).</li>
      </ul>

      <h2>Internationalisation</h2>
      <p>
        The web and desktop clients use <code>react-i18next</code> with JSON translation bundles.
        English is the default language, with the translation framework ready for
        community-contributed locales. All user-facing strings are extracted into namespace-based
        translation files under <code>src/i18n/locales/</code>.
      </p>
    </div>
  );
}
