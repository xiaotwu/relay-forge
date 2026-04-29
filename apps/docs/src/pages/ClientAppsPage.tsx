const surfaces = [
  {
    title: 'apps/web',
    copy: 'The main end-user browser surface. It owns the compact navigation rail, contextual sidebar, conversation panes, floating settings modal, guild navigation, DMs, media, and voice entry points.',
  },
  {
    title: 'apps/admin',
    copy: 'The operator surface. It focuses on backed dashboard data, users, guilds, reports, audit logs, and system settings rather than member chat workflows.',
  },
  {
    title: 'apps/desktop',
    copy: 'A Tauri-based native wrapper that reuses shared client packages with desktop packaging and an explicit CSP.',
  },
  {
    title: 'apps/docs',
    copy: 'The GitHub Pages site that now serves as the canonical public handbook for the whole platform.',
  },
];

export default function ClientAppsPage() {
  return (
    <>
      <section className="doc-section">
        <p className="doc-kicker">Client surfaces</p>
        <h1 className="doc-title !mt-2 !text-4xl md:!text-5xl">
          Four apps, one shared product language.
        </h1>
        <p className="doc-section-copy !mt-4">
          RelayForge keeps each surface lean by pushing common contracts and primitives into shared
          packages. The apps differ mostly in audience, packaging, and entry workflow.
        </p>

        <div className="doc-card-grid">
          {surfaces.map((surface) => (
            <article key={surface.title} className="doc-card">
              <h2 className="doc-card-title">
                <code>{surface.title}</code>
              </h2>
              <p className="doc-card-copy">{surface.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Why the split works</h2>
        <ol className="doc-list">
          <li>
            New product flows land once in shared contracts, then surface consistently across web
            and desktop.
          </li>
          <li>
            The admin console can move faster because it does not carry the end-user interaction
            model.
          </li>
          <li>
            The docs site publishes from the same repo that ships the client artifacts, so public
            documentation stays close to the UI work.
          </li>
        </ol>
      </section>
    </>
  );
}
