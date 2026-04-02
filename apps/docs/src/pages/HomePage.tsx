import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <div className="mb-14 overflow-hidden rounded-[2rem] border border-[#d8ccb8] bg-[linear-gradient(135deg,rgba(250,152,25,0.16),rgba(255,255,255,0.8)_35%,rgba(182,201,207,0.34))] p-8 md:p-10">
        <div className="section-chip mb-4">RelayForge handbook</div>
        <h1 className="text-ink-900 mb-5 max-w-3xl font-serif text-5xl tracking-tight md:text-6xl">
          Brand-grade docs for a self-hosted collaboration platform.
        </h1>
        <p className="text-ink-700 max-w-3xl text-lg leading-8 md:text-xl">
          This GitHub Pages site now borrows the visual rhythm of your published Figma template:
          editorial spacing, serif-forward headings, numbered sections, and a warmer documentation
          tone for the RelayForge platform.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/quick-start"
            className="bg-brand-500 hover:bg-brand-600 rounded-xl px-6 py-3 font-semibold text-white transition"
          >
            Launch the stack
          </Link>
          <Link
            to="/architecture"
            className="text-ink-900 rounded-xl border border-[#d8ccb8] bg-white px-6 py-3 font-semibold transition hover:bg-[#f7f2ea]"
          >
            Read the architecture
          </Link>
        </div>

        <div className="docs-hero-grid mt-10">
          {stats.map((stat) => (
            <div key={stat.label} className="docs-stat-card">
              <div className="text-ink-500 mb-2 text-sm uppercase tracking-[0.16em]">
                {stat.label}
              </div>
              <div className="text-ink-900 font-serif text-2xl">{stat.value}</div>
              <p className="text-ink-600 !mb-0 mt-2 text-sm">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-[2rem] border border-[#dccfb9] bg-white p-8 shadow-[0_18px_40px_rgba(30,61,89,0.06)]">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-brand-600 font-serif text-3xl">01</span>
            <div>
              <p className="text-ink-500 mb-0 text-xs font-semibold uppercase tracking-[0.18em]">
                Platform story
              </p>
              <h2 className="!mb-0 !mt-0 border-none pb-0">Why RelayForge?</h2>
            </div>
          </div>
          <p>
            RelayForge exists for teams that want modern chat, voice, admin tooling, and encrypted
            direct messages without handing core operations to a hosted third party. The system is
            structured to be practical for single-host deployments while still offering a path to
            Kubernetes, Helm, and multi-cloud storage backends.
          </p>
          <p>
            The docs are organized to help two audiences at once: operators who want to stand up the
            stack quickly, and contributors who want to understand the service boundaries under
            <code>apps/</code>, <code>services/</code>, <code>packages/</code>, and
            <code>infra/</code>.
          </p>
        </section>

        <aside className="rounded-[2rem] border border-[#dccfb9] bg-[#f8f2e7] p-8 shadow-[0_18px_40px_rgba(30,61,89,0.05)]">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-brand-600 font-serif text-3xl">02</span>
            <div>
              <p className="text-ink-500 mb-0 text-xs font-semibold uppercase tracking-[0.18em]">
                Contents
              </p>
              <h2 className="!mb-0 !mt-0 border-none pb-0">Start here</h2>
            </div>
          </div>
          <div className="space-y-3">
            {contents.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="hover:border-brand-300 hover:bg-brand-50 block rounded-[1.25rem] border border-[#dfd3c0] bg-white px-4 py-3 no-underline transition"
              >
                <div className="text-ink-500 text-xs font-semibold uppercase tracking-[0.18em]">
                  {item.index}
                </div>
                <div className="text-ink-900 mt-1 font-serif text-xl">{item.title}</div>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      <div className="mb-12 rounded-[2rem] border border-[#dccfb9] bg-white p-8 shadow-[0_18px_40px_rgba(30,61,89,0.06)]">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-brand-600 font-serif text-3xl">03</span>
          <div>
            <p className="text-ink-500 mb-0 text-xs font-semibold uppercase tracking-[0.18em]">
              Core capabilities
            </p>
            <h2 className="!mb-0 !mt-0 border-none pb-0">What ships today</h2>
          </div>
        </div>

        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-[1.5rem] border border-[#ece2d1] bg-[#fcfaf6] p-5"
            >
              <div className="mb-2 text-2xl">{f.icon}</div>
              <h3 className="text-ink-900 !mt-0 mb-1 text-base font-semibold">{f.title}</h3>
              <p className="text-ink-600 !mb-0 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <h2>Reference paths</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="hover:border-brand-300 hover:bg-brand-50 group rounded-[1.5rem] border border-[#dccfb9] bg-white p-5 no-underline transition"
          >
            <h4 className="text-brand-700 group-hover:text-brand-800 !mt-0 mb-1 font-semibold">
              {l.title}
            </h4>
            <p className="text-ink-600 !mb-0 text-sm">{l.desc}</p>
          </Link>
        ))}
      </div>

      <hr />

      <h2>Technology Stack</h2>
      <table>
        <thead>
          <tr>
            <th>Layer</th>
            <th>Technology</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>API &amp; real-time services</td>
            <td>Go 1.23, Chi router, gorilla/websocket</td>
          </tr>
          <tr>
            <td>Database</td>
            <td>PostgreSQL 16</td>
          </tr>
          <tr>
            <td>Cache / pub-sub</td>
            <td>Valkey (Redis-compatible)</td>
          </tr>
          <tr>
            <td>Object storage</td>
            <td>S3-compatible (MinIO, AWS, Tencent COS, Alibaba OSS, Huawei OBS)</td>
          </tr>
          <tr>
            <td>Voice &amp; video</td>
            <td>LiveKit (WebRTC SFU)</td>
          </tr>
          <tr>
            <td>Web client</td>
            <td>React 18, Vite, Zustand, Tailwind CSS</td>
          </tr>
          <tr>
            <td>Desktop client</td>
            <td>Tauri 2 (native shell around the shared web client)</td>
          </tr>
          <tr>
            <td>Admin console</td>
            <td>React 18 SPA</td>
          </tr>
          <tr>
            <td>Observability</td>
            <td>OpenTelemetry, Prometheus, structured JSON logging</td>
          </tr>
          <tr>
            <td>Deployment</td>
            <td>Docker Compose, Kubernetes / Helm</td>
          </tr>
        </tbody>
      </table>

      <hr />

      <h2>Project Status</h2>
      <p>
        RelayForge is under active development. The core messaging loop, voice/video integration,
        E2EE direct messages, RBAC, and the admin console are implemented. See the{' '}
        <Link to="/roadmap">Roadmap</Link> for upcoming milestones such as mobile clients,
        federation, and full-text search with Elasticsearch.
      </p>
    </div>
  );
}

const stats = [
  {
    label: 'Deploy shape',
    value: 'Single host first',
    desc: 'The default self-hosted path brings up the full stack from infra/docker with one Compose entrypoint.',
  },
  {
    label: 'Runtime split',
    value: 'Apps + Services',
    desc: 'Frontend apps, Go services, shared packages, and infrastructure all live in clearly separated monorepo roots.',
  },
  {
    label: 'Realtime stack',
    value: 'WebSocket + LiveKit',
    desc: 'Text delivery, presence, voice, and video are designed to scale independently while sharing a common deployment model.',
  },
];

const contents = [
  { index: '01', title: 'Quick Start', to: '/quick-start' },
  { index: '02', title: 'Architecture', to: '/architecture' },
  { index: '03', title: 'Deployment', to: '/deployment' },
  { index: '04', title: 'Configuration', to: '/config' },
];

const features = [
  {
    icon: '\u{1F3E0}',
    title: 'Guilds & Channels',
    desc: 'Organise conversations into guilds with text, voice, forum, and announcement channels grouped by categories.',
  },
  {
    icon: '\u{1F4AC}',
    title: 'Real-Time Messaging',
    desc: 'WebSocket-powered delivery with typing indicators, reactions, threaded replies, pins, polls, and rich embeds.',
  },
  {
    icon: '\u{1F3A4}',
    title: 'Voice & Video',
    desc: 'LiveKit-based WebRTC for low-latency voice and video with screen sharing inside any voice channel.',
  },
  {
    icon: '\u{1F512}',
    title: 'E2EE Direct Messages',
    desc: 'X3DH key agreement and Double Ratchet for forward-secret, end-to-end encrypted 1-on-1 and group DMs.',
  },
  {
    icon: '\u{1F6E1}\uFE0F',
    title: 'Moderation & RBAC',
    desc: 'Granular permission bitfields, role hierarchies, channel overrides, auto-mod rules, audit logging.',
  },
  {
    icon: '\u{2601}\uFE0F',
    title: 'Multi-Cloud Ready',
    desc: 'Run on AWS, Tencent Cloud, Alibaba Cloud, Huawei Cloud, or bare-metal with a unified storage abstraction.',
  },
];

const quickLinks = [
  {
    to: '/quick-start',
    title: 'Quick Start',
    desc: 'Get RelayForge running locally in under five minutes with Docker Compose.',
  },
  {
    to: '/architecture',
    title: 'Architecture',
    desc: 'Understand service boundaries, data flow, and technology choices.',
  },
  {
    to: '/deployment',
    title: 'Deployment',
    desc: 'Production deployment with Docker Compose, Kubernetes, and Helm.',
  },
  {
    to: '/config',
    title: 'Configuration Reference',
    desc: 'Every environment variable documented with types, defaults, and descriptions.',
  },
  {
    to: '/permissions',
    title: 'Permissions & RBAC',
    desc: 'Learn how the bitfield permission model and role hierarchy work.',
  },
  {
    to: '/e2ee',
    title: 'End-to-End Encryption',
    desc: 'How DMs are protected with X3DH and the Double Ratchet protocol.',
  },
];
