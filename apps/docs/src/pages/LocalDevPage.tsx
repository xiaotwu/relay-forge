const clientApps = [
  {
    name: 'Web client',
    command: 'npm run dev:web',
    audience: 'End users',
    copy: 'The primary browser experience for guilds, DMs, messaging, search, voice entry points, and account settings.',
  },
  {
    name: 'Admin console',
    command: 'npm run dev:admin',
    audience: 'Moderators and operators',
    copy: 'Focused workspace for dashboards, reports, audits, system settings, and platform-level controls.',
  },
  {
    name: 'Desktop shell',
    command: 'npm run dev:desktop',
    audience: 'Power users',
    copy: 'A Tauri-wrapped desktop surface that reuses the shared frontend packages while adding native packaging and tray integration.',
  },
  {
    name: 'Docs site',
    command: 'npm run dev:docs',
    audience: 'Contributors and operators',
    copy: 'The published GitHub Pages handbook for product, backend, release, and governance documentation.',
  },
];

export default function LocalDevPage() {
  return (
    <>
      <section className="doc-section">
        <p className="doc-kicker">Client applications</p>
        <h1 className="doc-title !mt-2 !text-4xl md:!text-5xl">
          Each surface has a distinct job, but they all share the same contracts.
        </h1>
        <p className="doc-section-copy !mt-4">
          RelayForge keeps product surfaces close together so feature work, release work, and docs
          work stay synchronized. The apps differ by audience and packaging, not by core platform
          contracts.
        </p>

        <div className="doc-card-grid">
          {clientApps.map((app) => (
            <article key={app.name} className="doc-card">
              <h2 className="doc-card-title">{app.name}</h2>
              <p className="doc-card-copy">{app.copy}</p>
              <ul className="doc-list">
                <li>
                  Primary audience: <strong>{app.audience}</strong>
                </li>
                <li>
                  Local command: <code>{app.command}</code>
                </li>
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Daily contributor loop</h2>
        <div className="doc-code-block">
          <pre>{`npm install
npm run build:packages
npm run dev:web

# in another terminal when editing docs
npm run dev:docs`}</pre>
        </div>

        <ol className="doc-list">
          <li>Build shared packages first so every app consumes fresh types and SDK changes.</li>
          <li>
            Run the product surface you are editing plus the docs site if you change public-facing
            documentation.
          </li>
          <li>
            Keep endpoint configuration explicit in <code>.env</code> rather than hard-coding server
            assumptions.
          </li>
          <li>
            Before opening a PR, make sure the docs and the runtime behavior tell the same story.
          </li>
        </ol>
      </section>
    </>
  );
}
