import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white">
          Relay<span className="text-brand-400">Forge</span>
        </h1>
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-gray-400">
          An open-source, self-hosted team communication platform inspired by Discord. Guilds,
          channels, real-time messaging, voice and video, end-to-end encrypted DMs, and a full admin
          console &mdash; all under your control.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/quick-start"
            className="bg-brand-600 hover:bg-brand-500 rounded-lg px-6 py-2.5 font-medium text-white transition"
          >
            Quick Start
          </Link>
          <Link
            to="/features"
            className="rounded-lg border border-gray-700 px-6 py-2.5 font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
          >
            Explore Features
          </Link>
        </div>
      </div>

      <hr />

      {/* Feature highlights */}
      <h2>Why RelayForge?</h2>
      <p>
        Existing hosted chat platforms require trusting a third party with all of your
        organisation's conversations, files, and metadata. RelayForge gives you feature parity with
        mainstream products while keeping data on infrastructure you own.
      </p>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="rounded-lg border border-gray-800 bg-gray-900/50 p-5">
            <div className="mb-2 text-2xl">{f.icon}</div>
            <h3 className="!mt-0 mb-1 text-base font-semibold text-white">{f.title}</h3>
            <p className="!mb-0 text-sm text-gray-400">{f.desc}</p>
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
            className="hover:border-brand-600/40 group rounded-lg border border-gray-800 bg-gray-900/30 p-4 no-underline transition hover:bg-gray-900/60"
          >
            <h4 className="text-brand-400 group-hover:text-brand-300 !mt-0 mb-1 font-semibold">
              {l.title}
            </h4>
            <p className="!mb-0 text-sm text-gray-500">{l.desc}</p>
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
