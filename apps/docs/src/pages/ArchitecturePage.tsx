export default function ArchitecturePage() {
  return (
    <div className="space-y-10">
      <div>
        <span className="section-chip">System design</span>
        <h1>Architecture</h1>
        <p>
          RelayForge is split into focused services so chat delivery, media workflows, auth, and
          operator tooling can evolve independently. The result is a self-hosted stack that stays
          modular without becoming difficult to deploy on a single machine.
        </p>
      </div>

      <section>
        <h2>At a glance</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {architectureHighlights.map((item) => (
            <div key={item.title} className="docs-stat-card">
              <p className="section-chip mb-3">{item.kicker}</p>
              <p className="text-ink-900 mb-2 font-serif text-2xl">{item.title}</p>
              <p className="text-ink-600 mb-0 text-sm leading-7">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Service boundaries</h2>
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Language</th>
              <th>Responsibility</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.name}>
                <td>
                  <code>{service.name}</code>
                </td>
                <td>{service.language}</td>
                <td>{service.responsibility}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Request and event flow</h2>
        <pre>{`Browser / Desktop
      |                     WebRTC
      | HTTPS / WSS            |
      v                        v
+------------+          +-----------+
| API        |          | LiveKit   |
| auth, CRUD |          | voice/video|
+-----+------+          +-----+-----+
      |                       ^
      | publishes events      |
      v                       |
+------------+ <---------- +--+--------+
| Valkey     |             | Realtime  |
| cache/pubsub|            | websocket |
+-----+------+             +-----------+
      |
      v
+-------------+      +----------------+
| PostgreSQL  |      | S3 / MinIO     |
| core data   |      | files + media  |
+-------------+      +----------------+`}</pre>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3>REST lifecycle</h3>
            <ol>
              <li>The client sends an HTTPS request to the API service.</li>
              <li>Middleware handles request IDs, logging, CORS, rate limits, and auth.</li>
              <li>Handlers validate input, call repositories, and return JSON responses.</li>
              <li>Changes that affect other users publish events through Valkey.</li>
              <li>The realtime service fans those events out to subscribed websocket clients.</li>
            </ol>
          </div>
          <div>
            <h3>WebSocket lifecycle</h3>
            <ol>
              <li>Clients connect to the realtime service with a validated access token.</li>
              <li>Connections are registered against users, guilds, and channel subscriptions.</li>
              <li>Heartbeats keep sessions alive and stale sockets are closed automatically.</li>
              <li>Valkey events are matched to connected clients and dispatched in memory.</li>
              <li>Presence, typing, and read-state events flow back through the same gateway.</li>
            </ol>
          </div>
        </div>
      </section>

      <section>
        <h2>Technology choices</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {technologyChoices.map((item) => (
            <div key={item.title} className="rounded-[1.5rem] border border-[#dccfb9] bg-white p-5">
              <h3 className="!mt-0">{item.title}</h3>
              <p className="!mb-0">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Monorepo structure</h2>
        <pre>{`relay-forge/
  apps/
    web/          # React web client
    desktop/      # Tauri desktop app
    admin/        # Admin console
    docs/         # Documentation site
  packages/
    types/        # Shared TypeScript types
    sdk/          # API client SDK
    crypto/       # E2EE primitives
    config/       # Shared configuration constants
    ui/           # Shared UI building blocks
  services/
    api/          # Go REST API
    realtime/     # Go websocket service
    media/        # Go media processing
    worker/       # Background jobs
  infra/
    docker/       # Dockerfiles and compose
    helm/         # Helm chart
    terraform/    # Cloud infrastructure
    kubernetes/   # Raw manifests`}</pre>
      </section>

      <section>
        <h2>Security architecture</h2>
        <p>
          Authentication is built around Argon2id password hashing, JWT access and refresh tokens,
          and optional TOTP-based second factor support. TLS is terminated at the edge proxy, while
          internal services stay on the private network.
        </p>
        <p>
          Authorization uses a role-based bitfield model with per-channel overrides, letting
          RelayForge express Discord-style permission inheritance without pushing business logic
          into the client.
        </p>
      </section>
    </div>
  );
}

const architectureHighlights = [
  {
    kicker: 'Shape',
    title: 'Service-oriented',
    desc: 'API, realtime, media, and worker paths can be operated together on one host or scaled separately later.',
  },
  {
    kicker: 'Transport',
    title: 'REST plus realtime',
    desc: 'CRUD flows over HTTPS while presence, events, and typing indicators move over persistent websocket connections.',
  },
  {
    kicker: 'Operator goal',
    title: 'Single-host first',
    desc: 'The architecture stays production-minded without forcing users into a multi-node deployment on day one.',
  },
];

const services = [
  {
    name: 'api',
    language: 'Go',
    responsibility:
      'REST API for authentication, CRUD operations, uploads, moderation, and administrative endpoints.',
  },
  {
    name: 'realtime',
    language: 'Go',
    responsibility:
      'WebSocket gateway for persistent connections, heartbeats, presence, fan-out, and typing indicators.',
  },
  {
    name: 'media',
    language: 'Go',
    responsibility:
      'Media processing, thumbnail generation, metadata extraction, and file-scanning workflows.',
  },
  {
    name: 'worker',
    language: 'Go',
    responsibility:
      'Background jobs and asynchronous processing that should not block request paths.',
  },
  {
    name: 'web',
    language: 'TypeScript / React',
    responsibility:
      'Browser client consuming the API over REST and realtime events over WebSocket.',
  },
  {
    name: 'desktop',
    language: 'TypeScript / Tauri 2',
    responsibility: 'Native wrapper around the shared web client with system-level integrations.',
  },
  {
    name: 'admin',
    language: 'TypeScript / React',
    responsibility: 'Platform administration console for users, guilds, and system health.',
  },
];

const technologyChoices = [
  {
    title: 'Go for backend services',
    desc: 'Go keeps deployment simple with single binaries, strong networking primitives, and efficient concurrency for API and realtime workloads.',
  },
  {
    title: 'PostgreSQL for core data',
    desc: 'Relational consistency, indexing, full-text search, and mature tooling make PostgreSQL a strong base for guilds, roles, channels, and messages.',
  },
  {
    title: 'Valkey for cache and pub/sub',
    desc: 'Valkey stores fast-changing state, rate-limiter buckets, and cross-service event fan-out for the websocket layer.',
  },
  {
    title: 'LiveKit for voice and video',
    desc: 'LiveKit handles WebRTC complexity while RelayForge keeps room and permission logic in the application layer.',
  },
  {
    title: 'S3-compatible object storage',
    desc: 'Targeting the S3 API lets operators choose MinIO, AWS S3, COS, OSS, OBS, and similar providers without code changes.',
  },
  {
    title: 'React and Vite on the frontend',
    desc: 'The web, admin, and docs surfaces share a modern TypeScript toolchain with fast iteration and reusable packages across the monorepo.',
  },
];
