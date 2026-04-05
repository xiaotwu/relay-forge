import ReleaseFlowDiagram from '../components/ReleaseFlowDiagram';

const clientAutomation = [
  'Client CI installs dependencies, runs lint and type checks, executes tests, and builds the docs surface.',
  'GitHub Pages publishes from apps/docs on pushes to main so the handbook stays versioned with the product repo.',
  'Tagged releases create downloadable web, admin, and docs bundles as GitHub Release assets.',
  'The release workflow also validates the desktop frontend bundle, while signed native installer publishing can be layered on once platform signing credentials are available.',
];

const serverAutomation = [
  'Backend CI runs lint, tests, and Go builds with PostgreSQL and Valkey service containers.',
  'Tagged server releases package backend binaries and publish them to GitHub Releases.',
  'Container builds publish versioned backend images to GitHub Container Registry for API, realtime, media, and worker services.',
];

export default function DeploymentPage() {
  return (
    <>
      <section className="doc-section">
        <p className="doc-kicker">Build and release</p>
        <h1 className="doc-title !mt-2 !text-4xl md:!text-5xl">
          Documentation, product builds, and server releases now describe the same flow.
        </h1>
        <p className="doc-section-copy !mt-4">
          The release story should be obvious from the repository structure: client artifacts and
          GitHub Pages from <code>relay-forge</code>, backend binaries and containers from{' '}
          <code>relay-forge-server</code>.
        </p>

        <ReleaseFlowDiagram />
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Client automation</h2>
        <ul className="doc-list">
          {clientAutomation.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="doc-code-block">
          <pre>{`npm ci
npm run lint
npm run typecheck
npm test
npm run build:docs`}</pre>
        </div>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Server automation</h2>
        <ul className="doc-list">
          {serverAutomation.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className="doc-code-block">
          <pre>{`make test
make package-binaries

# tag-based release automation
git tag v0.1.0
git push origin v0.1.0`}</pre>
        </div>
      </section>
    </>
  );
}
