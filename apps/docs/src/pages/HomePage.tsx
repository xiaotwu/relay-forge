import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <div className="mb-14 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(6,182,212,0.18),rgba(2,6,23,0.15)_40%,rgba(16,185,129,0.14))] p-8 md:p-10">
        <div className="mb-4 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
          Self-hosted collaboration stack
        </div>
        <h1 className="mb-5 max-w-3xl text-5xl font-extrabold tracking-tight text-white md:text-6xl">
          Relay<span className="text-brand-400">Forge</span>
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
          An open-source communication platform for teams that want Discord-style UX without giving
          away control of infrastructure, storage, or operational policy.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/quick-start"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Quick Start
          </Link>
          <Link
            to="/features"
            className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Explore Features
          </Link>
        </div>

        <div className="docs-hero-grid mt-10">
          {stats.map((stat) => (
            <div key={stat.label} className="docs-stat-card">
              <div className="mb-2 text-sm uppercase tracking-[0.16em] text-slate-400">
                {stat.label}
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="!mb-0 mt-2 text-sm text-slate-300">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <h2>Why RelayForge?</h2>
      <p>
        Existing hosted chat platforms require trusting a third party with all of your
        organisation's conversations, files, and metadata. RelayForge gives you feature parity with
        mainstream products while keeping data on infrastructure you own.
      </p>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_14px_40px_rgba(15,23,42,0.25)]"
          >
            <div className="mb-2 text-2xl">{f.icon}</div>
            <h3 className="!mt-0 mb-1 text-base font-semibold text-white">{f.title}</h3>
            <p className="!mb-0 text-sm text-slate-400">{f.desc}</p>
          </div>
        ))}
      </div>

      <hr />

      {/* Quick links */}
      <h2>Quick Links</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 no-underline transition hover:border-cyan-300/20 hover:bg-white/[0.06]"
          >
            <h4 className="!mt-0 mb-1 font-semibold text-cyan-300 group-hover:text-cyan-200">
              {l.title}
            </h4>
            <p className="!mb-0 text-sm text-slate-400">{l.desc}</p>
          </Link>
        ))}
      </div>

      <hr />

      {/* Tech stack summary */}
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
