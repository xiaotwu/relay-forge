import RuntimeFlowDiagram from '../components/RuntimeFlowDiagram';

const services = [
  {
    title: 'API',
    copy: 'Owns REST endpoints, auth, RBAC, guilds, channels, messages, device state, migrations, and audit-facing persistence.',
  },
  {
    title: 'Realtime',
    copy: 'Maintains websocket sessions, presence, typing, and cross-node fan-out behavior using Valkey.',
  },
  {
    title: 'Media',
    copy: 'Coordinates uploads, object storage, and LiveKit room or token issuance for voice and video.',
  },
  {
    title: 'Worker',
    copy: 'Processes background jobs such as cleanup, retention, notification, and asynchronous maintenance tasks.',
  },
];

export default function ServerHomePage() {
  return (
    <>
      <section className="doc-section">
        <p className="doc-kicker">Server overview</p>
        <h1 className="doc-title !mt-2 !text-4xl md:!text-5xl">
          A modular backend that is still easy to self-host.
        </h1>
        <p className="doc-section-copy !mt-4">
          RelayForge keeps the backend small enough for self-hosters to reason about, but separates
          runtime concerns where they diverge sharply: request/response APIs, long-lived realtime
          connections, media workflows, and background jobs.
        </p>

        <RuntimeFlowDiagram />
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Primary runtime components</h2>
        <div className="doc-card-grid">
          {services.map((service) => (
            <article key={service.title} className="doc-card">
              <h3 className="doc-card-title">{service.title}</h3>
              <p className="doc-card-copy">{service.copy}</p>
            </article>
          ))}
        </div>

        <div className="doc-callout">
          The runtime code remains in <code>relay-forge-server</code>; the long-form explanation now
          lives here so the public docs have one stable home.
        </div>
      </section>
    </>
  );
}
