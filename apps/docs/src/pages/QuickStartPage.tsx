export default function QuickStartPage() {
  return (
    <>
      <section className="doc-section">
        <p className="doc-kicker">Quick start</p>
        <h1 className="doc-title !mt-2 !text-4xl md:!text-5xl">
          Start the clients first, then point them at the backend you want.
        </h1>
        <p className="doc-section-copy !mt-4">
          RelayForge is easiest to understand as a client-first project. The clients can target a
          local backend, a hosted backend, or a backend running from the sibling server repository.
        </p>

        <div className="doc-card-grid">
          <article className="doc-card">
            <h2 className="doc-card-title">Option A: use an existing backend</h2>
            <p className="doc-card-copy">
              Best for product work, docs work, and UI iteration when the server is already hosted.
            </p>
            <div className="doc-code-block">
              <pre>{`cp .env.example .env
npm install
npm run build:packages
npm run dev:web`}</pre>
            </div>
          </article>

          <article className="doc-card">
            <h2 className="doc-card-title">Option B: boot the local backend</h2>
            <p className="doc-card-copy">
              Best when you need to exercise runtime services or verify the full stack end to end.
            </p>
            <div className="doc-code-block">
              <pre>{`cd ../relay-forge-server
cp .env.example .env
make deploy-up
make deploy-migrate`}</pre>
            </div>
          </article>
        </div>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Recommended local flow</h2>
        <ol className="doc-list">
          <li>Install Node.js 20+ and npm 10+ for the client workspace.</li>
          <li>
            Copy the client <code>.env.example</code> and set the endpoint URLs you want.
          </li>
          <li>
            Run <code>npm run build:packages</code> before launching any app workspace.
          </li>
          <li>
            Use <code>npm run dev:web</code> or <code>npm run dev:admin</code> for most frontend
            work.
          </li>
          <li>
            Use <code>npm run dev:docs</code> when editing the handbook or GitHub Pages site.
          </li>
        </ol>

        <div className="doc-callout">
          The docs site is part of the product now. Treat docs changes like product changes: build
          them locally, review them visually, and keep the README files aligned with the OpenAPI
          contract.
        </div>
      </section>
    </>
  );
}
