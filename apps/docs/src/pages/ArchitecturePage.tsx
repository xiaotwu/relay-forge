const clientDirectories = [
  {
    path: 'apps/web',
    copy: 'Primary browser client for guilds, direct messages, realtime messaging, and voice entry points.',
  },
  {
    path: 'apps/admin',
    copy: 'Moderation and platform operations console for reports, audit views, system settings, and user management.',
  },
  {
    path: 'apps/desktop',
    copy: 'Tauri wrapper that packages the RelayForge experience into native desktop installers.',
  },
  {
    path: 'apps/docs',
    copy: 'The GitHub Pages site and public handbook for both repositories.',
  },
  {
    path: 'packages/*',
    copy: 'Shared TypeScript packages that keep clients aligned on config, UI, SDK behavior, types, and cryptography.',
  },
];

const serverDirectories = [
  {
    path: 'services/api',
    copy: 'Authoritative REST API, authentication, authorization, guild data, message persistence, and migrations.',
  },
  {
    path: 'services/realtime',
    copy: 'WebSocket fan-out, presence, typing signals, and cross-instance coordination through Valkey.',
  },
  {
    path: 'services/media',
    copy: 'Upload orchestration, storage integration, and LiveKit token and room coordination.',
  },
  {
    path: 'services/worker',
    copy: 'Background jobs for retention, cleanup, notifications, and asynchronous maintenance tasks.',
  },
  {
    path: 'infra/docker',
    copy: 'Compose stacks, reverse-proxy samples, and observability configs for self-hosted deployments.',
  },
];

export default function ArchitecturePage() {
  return (
    <>
      <section className="doc-section">
        <p className="doc-kicker">Repository topology</p>
        <h1 className="doc-title !mt-2 !text-4xl md:!text-5xl">
          Two repos, one published handbook.
        </h1>
        <p className="doc-section-copy !mt-4">
          RelayForge intentionally splits the platform into a client repository and a backend
          repository. The repos do not share a build graph or filesystem dependency; they meet only
          through runtime endpoints and documented contracts.
        </p>

        <div className="doc-card-grid">
          <article className="doc-card">
            <h2 className="doc-card-title">relay-forge</h2>
            <p className="doc-card-copy">
              Houses the web app, admin console, desktop shell, shared frontend packages, and the
              GitHub Pages site.
            </p>
          </article>
          <article className="doc-card">
            <h2 className="doc-card-title">relay-forge-server</h2>
            <p className="doc-card-copy">
              Houses Go runtime services, deployment manifests, release pipelines for server
              artifacts, and the infrastructure code needed to self-host the backend.
            </p>
          </article>
        </div>

        <div className="doc-callout">
          Local directory names may still read as <code>relay-forge-client</code> and{' '}
          <code>relay-forge-server</code>, but the GitHub repositories are published as{' '}
          <code>relay-forge</code> and <code>relay-forge-server</code>.
        </div>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Client repository map</h2>
        <p className="doc-section-copy">
          Everything a contributor needs to build, document, or release the user-facing product now
          lives in the main repository.
        </p>

        <div className="doc-card-grid">
          {clientDirectories.map((item) => (
            <article key={item.path} className="doc-card">
              <h3 className="doc-card-title">
                <code>{item.path}</code>
              </h3>
              <p className="doc-card-copy">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Server repository map</h2>
        <p className="doc-section-copy">
          The backend repo should read like a runtime repository: code, deployment assets, and
          release automation. Architecture explanations are published from the client repo to avoid
          duplicated narrative.
        </p>

        <div className="doc-card-grid">
          {serverDirectories.map((item) => (
            <article key={item.path} className="doc-card">
              <h3 className="doc-card-title">
                <code>{item.path}</code>
              </h3>
              <p className="doc-card-copy">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
