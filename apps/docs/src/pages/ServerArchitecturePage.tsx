import RuntimeFlowDiagram from '../components/RuntimeFlowDiagram';

const serviceRows = [
  {
    service: 'api',
    responsibility:
      'Authoritative REST API, auth, admin endpoints, guild state, message persistence, OpenAPI contract, realtime publishing, and migrations.',
  },
  {
    service: 'realtime',
    responsibility:
      'JWT-protected WebSocket gateway with uppercase event envelopes, validated guild subscriptions, Valkey Pub/Sub fan-out, and disabled-user rechecks.',
  },
  {
    service: 'media',
    responsibility:
      'Upload orchestration, media ACL enforcement, MIME/size validation, S3-compatible storage coordination, and LiveKit token/room integration.',
  },
  {
    service: 'worker',
    responsibility:
      'Schema-aligned cleanup and retention jobs for sessions, invites, password resets, uploads, audit logs, messages, and disabled users.',
  },
];

const dataRows = [
  {
    domain: 'Users, guilds, channels, roles, messages, DMs, reports, settings, audit',
    owner: 'PostgreSQL via API service',
  },
  {
    domain: 'Realtime mutation fan-out',
    owner: 'API publishes to Valkey; realtime subscribes and delivers to validated recipients',
  },
  {
    domain: 'Upload metadata and media ACLs',
    owner: 'PostgreSQL file_uploads plus S3-compatible object storage via media service',
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
