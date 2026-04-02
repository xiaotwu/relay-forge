export default function FeaturesPage() {
  return (
    <div className="space-y-10">
      <div>
        <span className="section-chip">Product surface</span>
        <h1>Features</h1>
        <p>
          RelayForge combines the familiar shape of a modern community platform with self-hosted
          deployment, open infrastructure choices, and stronger control over data ownership.
        </p>
      </div>

      <section>
        <h2>Feature pillars</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featurePillars.map((pillar) => (
            <div key={pillar.title} className="docs-stat-card">
              <p className="section-chip mb-3">{pillar.kicker}</p>
              <p className="text-ink-900 mb-2 font-serif text-2xl">{pillar.title}</p>
              <p className="text-ink-600 mb-0 text-sm leading-7">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Guilds and channels</h2>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h3>Guilds</h3>
            <ul>
              <li>Create unlimited guilds with their own identity, invites, and member rosters.</li>
              <li>Owners can transfer ownership or remove the guild entirely.</li>
              <li>Presence, nicknames, and private invite-only access keep communities scoped.</li>
            </ul>
          </div>
          <div>
            <h3>Channel types</h3>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                {channelTypes.map((row) => (
                  <tr key={row.type}>
                    <td>
                      <code>{row.type}</code>
                    </td>
                    <td>{row.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <ul>
          <li>Channels can be grouped into categories for clearer navigation.</li>
          <li>Per-channel overrides extend role defaults with more precise access rules.</li>
          <li>
            Topics and slow mode settings are configurable where moderation policies need them.
          </li>
        </ul>
      </section>

      <section>
        <h2>Messaging and collaboration</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {messagingGroups.map((group) => (
            <div
              key={group.title}
              className="rounded-[1.5rem] border border-[#dccfb9] bg-white p-5"
            >
              <h3 className="!mt-0">{group.title}</h3>
              <ul className="!mb-0">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Voice, video, and encryption</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="docs-stat-card">
            <p className="section-chip mb-3">Live communication</p>
            <p className="text-ink-900 mb-2 font-serif text-2xl">Voice and video</p>
            <ul className="!mb-0">
              <li>LiveKit-powered voice channels with video and screen sharing.</li>
              <li>Room lifecycle controlled by the API service with scoped join tokens.</li>
              <li>Realtime participant state, mute, and deafen updates.</li>
            </ul>
          </div>
          <div className="docs-stat-card">
            <p className="section-chip mb-3">Private communication</p>
            <p className="text-ink-900 mb-2 font-serif text-2xl">End-to-end encryption</p>
            <ul className="!mb-0">
              <li>X3DH key agreement plus the Double Ratchet protocol for direct messages.</li>
              <li>Encrypted ciphertext stored on the server without plaintext visibility.</li>
              <li>Device-level keys, pre-key bundles, and revocable sessions.</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Operations and moderation</h2>
        <ul>
          <li>Kick, ban, timed ban, and lockdown workflows for fast incident response.</li>
          <li>Keyword filters, spam controls, mention limits, and bulk purge tooling.</li>
          <li>Comprehensive audit logging for moderation and administrative actions.</li>
          <li>Dedicated admin console for users, guilds, and platform health.</li>
          <li>Desktop app support through Tauri 2 with native notifications and tray behavior.</li>
        </ul>
      </section>

      <section>
        <h2>Internationalization</h2>
        <p>
          The web and desktop clients use <code>react-i18next</code> with JSON translation bundles.
          English is the default locale, but the translation layer is already structured for
          additional community-contributed languages.
        </p>
      </section>
    </div>
  );
}

const featurePillars = [
  {
    kicker: 'Communities',
    title: 'Guild-based structure',
    desc: 'Organize teams and communities with roles, channels, categories, and invite-only membership.',
  },
  {
    kicker: 'Conversation',
    title: 'Modern messaging',
    desc: 'Markdown, attachments, reactions, threads, mentions, search, and read-state tracking are built in.',
  },
  {
    kicker: 'Realtime',
    title: 'Voice and presence',
    desc: 'Persistent websocket delivery plus LiveKit-backed voice and video channels keep communication fast and synchronized.',
  },
  {
    kicker: 'Control',
    title: 'Self-hosted operations',
    desc: 'Administrative tooling, moderation, encryption, and deployable infrastructure stay under your control.',
  },
];

const channelTypes = [
  { type: 'text', purpose: 'Standard realtime chat with history, reactions, and threads.' },
  { type: 'voice', purpose: 'Persistent voice room with video and screen sharing.' },
  { type: 'announcement', purpose: 'Broadcast-only channel for read-mostly communications.' },
  { type: 'forum', purpose: 'Thread-first space for structured topic discussions.' },
];

const messagingGroups = [
  {
    title: 'Message composition',
    items: [
      'Markdown formatting with code blocks, quotes, and rich text basics.',
      'Attachments for images, video, audio, and documents.',
      'Auto-generated link previews and embeds.',
      'Emoji reactions with Unicode and custom guild assets.',
    ],
  },
  {
    title: 'Conversation mechanics',
    items: [
      'Replies and thread-based sub-conversations.',
      'Pinned messages and edit or delete workflows.',
      'Typing indicators over websocket.',
      'Mentions for users, roles, @everyone, and @here.',
    ],
  },
  {
    title: 'Discovery and retention',
    items: [
      'Unread tracking with per-channel read-state cursors.',
      'PostgreSQL-backed message search across author, channel, and keyword.',
      'Inline polls with live vote updates and optional expiry.',
    ],
  },
  {
    title: 'Administrative surfaces',
    items: [
      'Admin dashboards for users, guilds, and service health.',
      'Feature flags and global settings management.',
      'Cross-platform desktop packaging through Tauri 2.',
    ],
  },
];
