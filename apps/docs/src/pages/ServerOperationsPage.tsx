const readinessItems = [
  'Set production secrets for JWT, database, Valkey, storage, and LiveKit before exposing public traffic.',
  'Set explicit API, media, and realtime CORS/origin lists; production config rejects wildcard origins.',
  'Run PostgreSQL and Valkey with explicit limits, health checks, and backup schedules.',
  'Run migrations before starting workers so retention jobs see deleted_at, upload status, and media ACL columns.',
  'Publish metrics, health probes, and structured logs from every service before calling a deployment production-ready.',
  'Smoke-test registration, login, guild creation, messaging, uploads, and voice flows after every release.',
];

const scaleBands = [
  {
    label: 'Small',
    copy: 'Single node, low hundreds of users, one PostgreSQL instance, and modest Valkey memory.',
  },
  {
    label: 'Medium',
    copy: 'Scale API and realtime instances horizontally, raise database and Valkey resources, and introduce proper monitoring.',
  },
  {
    label: 'Large',
    copy: 'Use multiple service replicas, read replicas, a tuned LiveKit deployment, and stronger storage/CDN posture.',
  },
];

export default function ServerOperationsPage() {
  return (
    <>
      <section className="doc-section">
        <p className="doc-kicker">Operations and deployment</p>
        <h1 className="doc-title !mt-2 !text-4xl md:!text-5xl">
          Self-host first, automate the repeatable parts.
        </h1>
        <p className="doc-section-copy !mt-4">
          The server repository retains the actual deployment assets, but this handbook explains how
          the pieces fit together, how to bootstrap them, and what “ready for production” means in
          practice.
        </p>

        <div className="doc-code-block">
          <pre>{`cp .env.example .env
make deploy-up
make deploy-migrate

# optional local verification
make test
make build`}</pre>
        </div>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Production checklist highlights</h2>
        <ul className="doc-list">
          {readinessItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Scaling posture</h2>
        <div className="doc-card-grid">
          {scaleBands.map((band) => (
            <article key={band.label} className="doc-card">
              <h3 className="doc-card-title">{band.label}</h3>
              <p className="doc-card-copy">{band.copy}</p>
            </article>
          ))}
        </div>

        <div className="doc-callout">
          API and media services stay easiest to scale because they are mostly stateless. Realtime
          depends on Valkey Pub/Sub coordination, workers depend on the current migration set, and
          database scale remains the dominant constraint for most self-hosted deployments.
        </div>
      </section>
    </>
  );
}
