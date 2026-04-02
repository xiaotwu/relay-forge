export default function RoadmapPage() {
  return (
    <div>
      <h1>Roadmap</h1>
      <p>
        This page outlines the development direction for RelayForge. The roadmap is organized into
        time horizons. Priorities may shift based on community feedback and contributor interest.
      </p>

      <h2>Current Status: v0.1.0</h2>
      <p>The initial release includes the core feature set:</p>
      <ul>
        <li>Guild and channel management (text, voice, announcement, forum)</li>
        <li>Real-time messaging with Markdown, reactions, threads, and file attachments</li>
        <li>Voice and video calls via LiveKit (guild channels, DMs, group DMs)</li>
        <li>End-to-end encrypted direct messages (X3DH + Double Ratchet)</li>
        <li>RBAC permission system with channel-level overrides</li>
        <li>S3-compatible object storage with presigned URLs</li>
        <li>Admin console for platform management</li>
        <li>Desktop app via Tauri 2</li>
        <li>Docker Compose and Helm chart deployment</li>
        <li>Multi-cloud support (AWS, Tencent Cloud, Alibaba Cloud, Huawei Cloud)</li>
        <li>Prometheus metrics and OpenTelemetry tracing</li>
      </ul>

      <h2>Short-Term (v0.2.0 - v0.3.0)</h2>
      <p>Focus: stability, performance, and polish of existing features.</p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Performance optimization</td>
            <td>
              Optimize hot paths: message creation, WebSocket fan-out, permission checks. Target
              &lt;50ms P99 for message send.
            </td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>Database query optimization</td>
            <td>
              Add missing indexes, optimize N+1 queries, implement query result caching for
              permission data.
            </td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>Message delivery reliability</td>
            <td>
              Implement at-least-once delivery guarantees for WebSocket events with client-side
              deduplication.
            </td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>Notification improvements</td>
            <td>
              Per-channel notification settings (all, mentions, none). Notification sound
              customization.
            </td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>Search improvements</td>
            <td>
              Improve PostgreSQL full-text search with better ranking, highlighting, and filters.
            </td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>Thread improvements</td>
            <td>
              Thread member list, thread notification settings, thread auto-archive after
              inactivity.
            </td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>Emoji picker redesign</td>
            <td>Categorized emoji picker with search, recent emoji, and skin tone selection.</td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>Accessibility audit</td>
            <td>
              WCAG 2.1 AA compliance. Screen reader support, keyboard navigation, focus management.
            </td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>E2EE key backup</td>
            <td>Optional encrypted key backup to allow restoring DM history on new devices.</td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>Rate limiting refinement</td>
            <td>
              Per-endpoint rate limits (stricter for auth, looser for reads). Graduated response
              (warn then block).
            </td>
            <td>Planned</td>
          </tr>
        </tbody>
      </table>

      <h2>Medium-Term (v0.4.0 - v0.6.0)</h2>
      <p>Focus: expanding the platform to new surfaces and adding frequently requested features.</p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mobile apps</td>
            <td>
              React Native apps for iOS and Android. Share validation schemas, API client, and state
              management with the web client. Target feature parity for messaging and calls.
            </td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>Push notifications</td>
            <td>
              FCM (Android) and APNs (iOS) push notifications. Web Push for the browser. Required
              for mobile apps to be useful.
            </td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>Voice messages</td>
            <td>
              Record and send short audio messages in text channels and DMs. Opus encoding, waveform
              visualization.
            </td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>Message scheduling</td>
            <td>
              Schedule messages to be sent at a future time. Useful for announcements across time
              zones.
            </td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>Webhooks</td>
            <td>
              Inbound webhooks for integrating external services (CI/CD, monitoring alerts, RSS
              feeds) into channels.
            </td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>Bot framework</td>
            <td>
              Simple bot API with slash commands, message handlers, and scheduled tasks.
              Language-agnostic via HTTP webhook callbacks.
            </td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>User status and custom status</td>
            <td>
              Set a custom text status with optional emoji and expiry. Visible in member lists and
              DM headers.
            </td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>Image and link previews</td>
            <td>
              Enhanced link previews with Open Graph and oEmbed. Image proxy for privacy (prevent IP
              leaking via external images).
            </td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>Channel slow mode</td>
            <td>
              Configurable per-user message rate limit per channel (e.g., one message every 30
              seconds).
            </td>
            <td>Planned</td>
          </tr>
          <tr>
            <td>LiveKit E2EE for voice</td>
            <td>
              Enable LiveKit's Insertable Streams E2EE for voice channels, providing true E2EE for
              audio/video in DM calls.
            </td>
            <td>Planned</td>
          </tr>
        </tbody>
      </table>

      <h2>Long-Term (v1.0.0+)</h2>
      <p>Focus: advanced features, scalability, and ecosystem growth.</p>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Federation / bridging</td>
            <td>
              Allow RelayForge instances to communicate with each other and/or bridge to Matrix,
              IRC, and XMPP. This is a large architectural change and will be carefully designed.
            </td>
            <td>Research</td>
          </tr>
          <tr>
            <td>Advanced search (Meilisearch)</td>
            <td>
              Optional Meilisearch integration for fast, typo-tolerant search with filters and
              facets. PostgreSQL FTS remains the default for simplicity.
            </td>
            <td>Research</td>
          </tr>
          <tr>
            <td>Internationalization (i18n)</td>
            <td>
              Community-contributed translations for the web and mobile clients. Translation
              management workflow with Crowdin or Weblate.
            </td>
            <td>Research</td>
          </tr>
          <tr>
            <td>Plugin / extension system</td>
            <td>
              Allow third-party plugins to extend RelayForge with custom features (themes,
              integrations, commands) without forking the core codebase. Sandboxed execution
              environment.
            </td>
            <td>Research</td>
          </tr>
          <tr>
            <td>Horizontal scaling</td>
            <td>
              Stateless API and media services already scale horizontally. The realtime service
              needs consistent hashing for WebSocket session affinity. Design for 100K+ concurrent
              users.
            </td>
            <td>Research</td>
          </tr>
          <tr>
            <td>Compliance features</td>
            <td>
              Data retention policies (auto-delete messages after N days), GDPR data export, legal
              hold, eDiscovery support for enterprise compliance requirements.
            </td>
            <td>Research</td>
          </tr>
          <tr>
            <td>SSO integration</td>
            <td>
              SAML 2.0 and OpenID Connect (OIDC) support for enterprise single sign-on. Map external
              groups to RelayForge roles.
            </td>
            <td>Research</td>
          </tr>
          <tr>
            <td>Spaces / communities</td>
            <td>
              Organize multiple related guilds under a "space" with shared membership and
              cross-guild discovery.
            </td>
            <td>Research</td>
          </tr>
        </tbody>
      </table>

      <h2>Non-Goals</h2>
      <p>These items are explicitly out of scope and are not planned:</p>
      <ul>
        <li>
          <strong>Monetization features:</strong> No premium tiers, paywalled features, or built-in
          payment processing. RelayForge is a tool, not a platform business. Organizations can
          implement their own access controls if needed.
        </li>
        <li>
          <strong>Gaming integrations:</strong> No game status detection, rich presence from games,
          or game store integration. RelayForge focuses on communication, not entertainment.
        </li>
        <li>
          <strong>AI chatbots / LLM integration:</strong> No built-in AI features. Users can build
          bots using the planned bot framework that integrate with any AI service externally.
        </li>
        <li>
          <strong>Desktop runtime:</strong> The desktop app uses Tauri 2 for smaller binary size and
          lower resource consumption. An Electron-based client is not planned.
        </li>
        <li>
          <strong>Proprietary cloud offering:</strong> RelayForge will not offer a hosted SaaS
          version. The focus is on self-hosting. Third parties are welcome to offer hosting under
          the AGPL-3.0 license terms.
        </li>
      </ul>

      <h2>How to Influence the Roadmap</h2>
      <ul>
        <li>Open a GitHub Discussion to propose a feature or provide feedback on planned items.</li>
        <li>Vote on existing feature proposals using GitHub reactions (thumbs up).</li>
        <li>
          Contribute code &mdash; see the <a href="/contributing">Contributing Guide</a>.
        </li>
        <li>
          Features with active community interest and/or contributed implementations are
          prioritized.
        </li>
      </ul>
    </div>
  );
}
