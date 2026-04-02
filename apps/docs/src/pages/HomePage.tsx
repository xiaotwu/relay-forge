import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <section className="mb-12">
        <div className="text-ink-500 mb-10 flex flex-col gap-4 border-b border-[#d8ccb8] pb-6 text-[11px] font-semibold uppercase tracking-[0.18em] md:flex-row md:items-center">
          <div className="flex-1">WE ARE RELAYFORGE</div>
          <div className="flex flex-wrap gap-5">
            <Link to="/quick-start" className="hover:text-brand-700">
              Launch the stack
            </Link>
            <Link to="/deployment" className="hover:text-brand-700">
              Deployment
            </Link>
            <a
              href="https://github.com/xiaotwu/relay-forge"
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-700"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mb-8">
          <div className="docs-outline-title leading-none">RELAY</div>
          <div className="docs-outline-title -mt-4 leading-none md:-mt-6">FORGE</div>
        </div>

        <div className="mb-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="text-ink-500 mb-2 text-xs font-semibold uppercase tracking-[0.18em]">
              Info
            </p>
            <p className="text-ink-700 max-w-2xl text-base leading-8 md:text-lg">
              RelayForge is a self-hosted communication platform for teams that want modern chat,
              voice, video, admin tooling, and end-to-end encrypted direct messages without giving
              up control over infrastructure. This GitHub Pages site now follows the actual Figma
              design’s editorial structure while preserving the repository’s operator and
              contributor guidance.
            </p>
          </div>
          <div>
            <p className="text-ink-500 mb-2 text-xs font-semibold uppercase tracking-[0.18em]">
              Explore
            </p>
            <p className="text-ink-700 text-base leading-8 md:text-lg">
              Quick Start, Architecture, Deployment, Configuration, Security, and contributor
              workflow are organized here as a long-form product handbook, published from
              <code>apps/docs</code>.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16 grid gap-10 lg:grid-cols-[0.46fr_0.54fr]">
        <div className="rounded-[2rem] border border-[#d8ccb8] bg-[radial-gradient(circle_at_center,rgba(250,152,25,0.22),rgba(255,255,255,0)_55%),linear-gradient(180deg,#ffffff,#f5eee3)] p-8 shadow-[0_18px_40px_rgba(30,61,89,0.06)]">
          <div className="mx-auto flex aspect-square max-w-[28rem] items-center justify-center rounded-full border border-[#dccfb9] bg-[radial-gradient(circle_at_center,#ffffff_0%,#f3ead9_48%,#c9d7c7_82%,#8da171_100%)] shadow-[inset_0_0_0_14px_rgba(255,255,255,0.55),0_20px_40px_rgba(30,61,89,0.10)]">
            <div className="rounded-full border border-white/60 bg-white/60 px-8 py-10 text-center shadow-[0_10px_30px_rgba(30,61,89,0.08)]">
              <div className="text-ink-900 font-serif text-3xl md:text-4xl">RF</div>
              <div className="text-ink-500 mt-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
                GitHub Pages
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div>
            <p className="text-ink-500 mb-3 text-xs font-semibold uppercase tracking-[0.18em]">
              2025 operator docs
            </p>
            <div className="space-y-0 border-y border-[#dccfb9]">
              {primaryDocs.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className="text-ink-700 hover:text-brand-700 grid grid-cols-[1fr_auto] items-center border-b border-[#ece3d4] py-3 text-sm no-underline last:border-b-0"
                >
                  <span>{item.title}</span>
                  <span className="text-ink-500">{item.detail}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-ink-500 mb-3 text-xs font-semibold uppercase tracking-[0.18em]">
              2026 build roadmap
            </p>
            <div className="space-y-0 border-y border-[#dccfb9]">
              {futureDocs.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className="text-ink-700 hover:text-brand-700 grid grid-cols-[1fr_auto] items-center border-b border-[#ece3d4] py-3 text-sm no-underline last:border-b-0"
                >
                  <span>{item.title}</span>
                  <span className="text-ink-500">{item.detail}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[#dccfb9] bg-white p-6 shadow-[0_12px_24px_rgba(30,61,89,0.05)]">
            <p className="text-ink-500 mb-2 text-xs font-semibold uppercase tracking-[0.18em]">
              Contact
            </p>
            <p className="text-ink-700 mb-0 text-sm leading-7">
              Use these pages to launch the stack, understand the service split, review security
              boundaries, and contribute changes without guessing where configuration or
              infrastructure now lives.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <p className="text-ink-500 mb-4 text-xs font-semibold uppercase tracking-[0.18em]">Bios</p>
        <div className="grid gap-4">
          {bios.map((bio, index) => (
            <div key={bio.title} className="border-b border-[#dccfb9] pb-5 last:border-b-0">
              <p className="text-ink-900 mb-2 font-serif text-2xl">
                {String(index + 1).padStart(2, '0')} {bio.title}
              </p>
              <p className="text-ink-700 mb-0 max-w-4xl">{bio.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <p className="text-ink-500 mb-4 text-xs font-semibold uppercase tracking-[0.18em]">
          Media blocks
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.slice(0, 4).map((feature, index) => (
            <article
              key={feature.title}
              className="rounded-[1.5rem] border border-[#dccfb9] bg-white p-4"
            >
              <div className="mb-4 aspect-square rounded-[1.25rem] bg-[linear-gradient(180deg,#cfe0e8,#f5eee3)]" />
              <p className="text-ink-900 mb-2 font-serif text-lg">{galleryTitles[index]}</p>
              <p className="text-ink-600 mb-0 text-sm">{feature.desc}</p>
            </article>
          ))}
        </div>
        <div className="mt-6 grid place-items-center">
          <article className="w-full max-w-[18rem] rounded-[1.5rem] border border-[#dccfb9] bg-white p-4">
            <div className="mb-4 aspect-square rounded-[1.25rem] bg-[linear-gradient(180deg,#d9c7aa,#f7f3eb)]" />
            <p className="text-ink-900 mb-2 font-serif text-lg">{galleryTitles[4]}</p>
            <p className="text-ink-600 mb-0 text-sm">
              A focused view of quieter operator workflows: migrations, configuration, deployment
              validation, and environment hygiene.
            </p>
          </article>
        </div>
      </section>

      <section className="mb-16">
        <p className="text-ink-500 mb-4 text-xs font-semibold uppercase tracking-[0.18em]">
          Discover the stack
        </p>
        <div className="rounded-[2rem] border border-[#dccfb9] bg-white p-6 shadow-[0_18px_40px_rgba(30,61,89,0.06)] md:p-8">
          <div className="mb-6">
            <p className="text-ink-900 mb-0 font-serif text-2xl md:text-3xl">
              The RelayForge platform, presented as a clear operational journey.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-[#d8ccb8] bg-[linear-gradient(180deg,#fbfaf6,#efe7d8)] p-8">
            <div className="mx-auto grid max-w-[42rem] gap-6">
              <div className="rounded-[1.25rem] border border-[#d3c4ab] bg-[#f5eee3] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
                <div className="mb-3 flex items-center justify-between">
                  <span className="h-2.5 w-10 rounded-full bg-[#d6cab6]" />
                  <span className="h-2.5 w-10 rounded-full bg-[#d6cab6]" />
                </div>
                <div className="grid grid-cols-[1fr_2fr_1fr] gap-3">
                  <div className="text-ink-500 rounded-xl bg-white/70 p-3 text-center text-xs uppercase tracking-[0.16em]">
                    API
                  </div>
                  <div className="text-ink-900 rounded-xl bg-white/80 p-3 text-center font-serif text-lg">
                    RelayForge
                  </div>
                  <div className="text-ink-500 rounded-xl bg-white/70 p-3 text-center text-xs uppercase tracking-[0.16em]">
                    Web
                  </div>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="text-ink-700 rounded-[1.15rem] border border-[#d3c4ab] bg-white p-4 text-center text-sm">
                  PostgreSQL
                </div>
                <div className="text-ink-700 rounded-[1.15rem] border border-[#d3c4ab] bg-white p-4 text-center text-sm">
                  Valkey
                </div>
                <div className="text-ink-700 rounded-[1.15rem] border border-[#d3c4ab] bg-white p-4 text-center text-sm">
                  LiveKit
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <p className="text-ink-500 mb-4 text-xs font-semibold uppercase tracking-[0.18em]">
          Listen on
        </p>
        <div className="grid gap-5 md:grid-cols-[0.42fr_0.58fr]">
          <div className="space-y-3">
            {compactLinks.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="text-ink-800 hover:border-brand-300 hover:text-brand-700 block rounded-[1rem] border border-[#dccfb9] bg-white px-5 py-4 text-sm font-medium no-underline transition"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="hover:border-brand-300 hover:bg-brand-50 group rounded-[1.5rem] border border-[#dccfb9] bg-white p-6 no-underline transition"
              >
                <h4 className="text-ink-900 group-hover:text-brand-800 !mt-0 mb-2 font-serif text-2xl font-normal">
                  {l.title}
                </h4>
                <p className="text-ink-600 !mb-0 text-sm">{l.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d8ccb8] pt-8">
        <div className="text-ink-600 grid gap-5 text-sm md:grid-cols-4">
          <div>
            <div className="text-ink-500 mb-2 text-xs font-semibold uppercase tracking-[0.18em]">
              Repository
            </div>
            <a href="https://github.com/xiaotwu/relay-forge" target="_blank" rel="noreferrer">
              github.com/xiaotwu/relay-forge
            </a>
          </div>
          <div>
            <div className="text-ink-500 mb-2 text-xs font-semibold uppercase tracking-[0.18em]">
              Operators
            </div>
            <Link to="/deployment">Deployment and hosting</Link>
          </div>
          <div>
            <div className="text-ink-500 mb-2 text-xs font-semibold uppercase tracking-[0.18em]">
              Contributors
            </div>
            <Link to="/contributing">Contributing guide</Link>
          </div>
          <div>
            <div className="text-ink-500 mb-2 text-xs font-semibold uppercase tracking-[0.18em]">
              Security
            </div>
            <Link to="/security">Security model</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const primaryDocs = [
  { title: 'Quick Start', to: '/quick-start', detail: '5 min' },
  { title: 'Architecture', to: '/architecture', detail: 'overview' },
  { title: 'Deployment', to: '/deployment', detail: 'compose / helm' },
  { title: 'Configuration', to: '/config', detail: 'env vars' },
  { title: 'Security', to: '/security', detail: 'model' },
  { title: 'Monitoring', to: '/monitoring', detail: 'ops' },
];

const futureDocs = [
  { title: 'Roadmap', to: '/roadmap', detail: 'planned' },
  { title: 'Contributing', to: '/contributing', detail: 'workflow' },
  { title: 'Permissions', to: '/permissions', detail: 'rbac' },
  { title: 'E2EE', to: '/e2ee', detail: 'protocols' },
  { title: 'LiveKit', to: '/livekit', detail: 'voice/video' },
  { title: 'Storage', to: '/storage', detail: 's3-compatible' },
];

const features = [
  {
    title: 'Guilds & Channels',
    desc: 'Organise conversations into guilds with text, voice, forum, and announcement channels grouped by categories.',
  },
  {
    title: 'Real-Time Messaging',
    desc: 'WebSocket-powered delivery with typing indicators, reactions, threaded replies, pins, polls, and rich embeds.',
  },
  {
    title: 'Voice & Video',
    desc: 'LiveKit-based WebRTC for low-latency voice and video with screen sharing inside any voice channel.',
  },
  {
    title: 'E2EE Direct Messages',
    desc: 'X3DH key agreement and Double Ratchet for forward-secret, end-to-end encrypted 1-on-1 and group DMs.',
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
    title: 'Configuration',
    desc: 'Every environment variable documented with types, defaults, and descriptions.',
  },
  {
    to: '/permissions',
    title: 'Permissions',
    desc: 'Learn how the bitfield permission model and role hierarchy work.',
  },
  {
    to: '/e2ee',
    title: 'Encryption',
    desc: 'How DMs are protected with X3DH and the Double Ratchet protocol.',
  },
];

const compactLinks = [
  { title: 'Quick Start', to: '/quick-start' },
  { title: 'Architecture', to: '/architecture' },
  { title: 'Deployment', to: '/deployment' },
];

const bios = [
  {
    title: 'Operators',
    desc: 'Single-host deployment, environment bootstrapping, Docker Compose orchestration, reverse proxy targets, and health-check flows for practical day-one hosting.',
  },
  {
    title: 'Contributors',
    desc: 'Shared monorepo structure across apps, services, packages, and infra so implementation details stay understandable as the platform expands.',
  },
  {
    title: 'Security',
    desc: 'Argon2id password hashing, JWT session model, rate limiting, and end-to-end encrypted direct messages keep the trust boundary explicit.',
  },
  {
    title: 'Realtime',
    desc: 'WebSocket fan-out, presence, media pipelines, and LiveKit integration create the product surface users actually feel every day.',
  },
];

const galleryTitles = [
  'Launch stack',
  'Observe traffic',
  'Secure direct messages',
  'Scale media paths',
  'Refine operations',
];
