import RuntimeFlowDiagram from '../components/RuntimeFlowDiagram';

const serviceRows = [
  {
    service: 'api',
    responsibility:
      'Authoritative REST API, auth, guild state, message persistence, DM key bundle coordination, and migrations.',
  },
  {
    service: 'realtime',
    responsibility:
      'WebSocket gateway for message fan-out, presence, typing indicators, read-state broadcasts, and reconnect behavior.',
  },
  {
    service: 'media',
    responsibility:
      'Upload orchestration, MIME validation, S3-compatible storage coordination, and LiveKit integration.',
  },
  {
    service: 'worker',
    responsibility:
      'Scheduled or queued jobs including cleanup, retention, and asynchronous side effects.',
  },
];

const dataRows = [
  {
    domain: 'Users, guilds, channels, messages, audit',
    owner: 'PostgreSQL via API service',
  },
  {
    domain: 'Presence, typing, fan-out coordination',
    owner: 'Valkey via realtime service',
  },
  {
    domain: 'Uploads and media blobs',
    owner: 'S3-compatible storage via media service',
  },
  {
    domain: 'Voice and video transport',
    owner: 'LiveKit, coordinated by the media service',
  },
];

export default function ServerArchitecturePage() {
  return (
    <>
      <section className="doc-section">
        <p className="doc-kicker">Services and data flow</p>
        <h1 className="doc-title !mt-2 !text-4xl md:!text-5xl">
          Runtime separation follows connection shape, not organizational fashion.
        </h1>
        <p className="doc-section-copy !mt-4">
          The server repository is deliberately not a microservice maze. It is a practical split:
          synchronous HTTP state, long-lived realtime connections, media workflows, and queued work.
        </p>

        <RuntimeFlowDiagram />
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Service contract matrix</h2>
        <div className="doc-table">
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Responsibility</th>
              </tr>
            </thead>
            <tbody>
              {serviceRows.map((row) => (
                <tr key={row.service}>
                  <td>
                    <code>{row.service}</code>
                  </td>
                  <td>{row.responsibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Data ownership</h2>
        <div className="doc-table">
          <table>
            <thead>
              <tr>
                <th>Domain</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row) => (
                <tr key={row.domain}>
                  <td>{row.domain}</td>
                  <td>{row.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
