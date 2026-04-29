const packages = [
  {
    title: '@relayforge/config',
    copy: 'Defines the explicit endpoint contract and runtime constants consumed by every client surface.',
  },
  {
    title: '@relayforge/sdk',
    copy: 'Wraps REST and realtime communication. Public request helpers are handwritten but route through OpenAPI-backed typed path builders.',
  },
  {
    title: '@relayforge/types',
    copy: 'Provides strongly typed models for API payloads, guild state, realtime events, messages, and E2EE bundles.',
  },
  {
    title: '@relayforge/crypto',
    copy: 'Implements browser-compatible cryptographic primitives for device identity, signed prekeys, and encrypted DM flows.',
  },
  {
    title: '@relayforge/ui',
    copy: 'Exports the shared design system primitives and tokens used across product-facing React surfaces.',
  },
];

export default function SharedPackagesPage() {
  return (
    <>
      <section className="doc-section">
        <p className="doc-kicker">Shared packages</p>
        <h1 className="doc-title !mt-2 !text-4xl md:!text-5xl">
          The repo stays cohesive because the contracts live below the apps.
        </h1>
        <p className="doc-section-copy !mt-4">
          RelayForge treats the package layer as the stability boundary for product work. Most
          feature additions should update a package first, then flow upward into the app surfaces.
        </p>

        <div className="doc-card-grid">
          {packages.map((pkg) => (
            <article key={pkg.title} className="doc-card">
              <h2 className="doc-card-title">{pkg.title}</h2>
              <p className="doc-card-copy">{pkg.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Why package-first work matters</h2>
        <ol className="doc-list">
          <li>
            It keeps endpoint contracts explicit through generated OpenAPI path types and shared
            path builders instead of app-local route strings.
          </li>
          <li>It reduces drift between the web client, admin console, and desktop shell.</li>
          <li>
            It makes the docs site more trustworthy because the narrative can point to shared
            primitives instead of app-specific copies.
          </li>
        </ol>
      </section>
    </>
  );
}
