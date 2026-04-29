const configRows = [
  {
    key: 'API_BASE_URL',
    usedBy: 'web, admin, desktop, sdk',
    defaultValue: 'http://localhost:8080/api/v1',
    note: 'Points product surfaces at the API service for REST and auth flows.',
  },
  {
    key: 'WS_URL',
    usedBy: 'web, desktop, sdk',
    defaultValue: 'ws://localhost:8081/ws',
    note: 'Connects clients to the realtime WebSocket gateway for fan-out and presence.',
  },
  {
    key: 'LIVEKIT_URL',
    usedBy: 'web, desktop',
    defaultValue: 'ws://localhost:7880',
    note: 'Targets the LiveKit deployment used for voice and video transport.',
  },
  {
    key: 'MEDIA_BASE_URL',
    usedBy: 'sdk and upload flows',
    defaultValue: 'http://localhost:8082/api/v1',
    note: 'Targets the media service API root for uploads, media proxy reads, and voice helper routes.',
  },
];

const serviceMappings = [
  {
    label: 'API_BASE_URL',
    target: 'relay-forge-server/services/api',
  },
  {
    label: 'WS_URL',
    target: 'relay-forge-server/services/realtime',
  },
  {
    label: 'MEDIA_BASE_URL',
    target: 'relay-forge-server/services/media',
  },
  {
    label: 'LIVEKIT_URL',
    target: 'LiveKit plus the media service token issuer',
  },
];

export default function ConfigReferencePage() {
  return (
    <>
      <section className="doc-section">
        <p className="doc-kicker">Endpoint contract</p>
        <h1 className="doc-title !mt-2 !text-4xl md:!text-5xl">
          Runtime URLs are the contract between the repos.
        </h1>
        <p className="doc-section-copy !mt-4">
          The client repo should never assume a co-located Go service. Every surface reads explicit
          endpoint variables and can target any compatible RelayForge backend deployment.
        </p>

        <div className="doc-table">
          <table>
            <thead>
              <tr>
                <th>Variable</th>
                <th>Used by</th>
                <th>Default</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {configRows.map((row) => (
                <tr key={row.key}>
                  <td>
                    <code>{row.key}</code>
                  </td>
                  <td>{row.usedBy}</td>
                  <td>
                    <code>{row.defaultValue}</code>
                  </td>
                  <td>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Mapping to backend components</h2>
        <p className="doc-section-copy">
          These values are intentionally named after product contracts rather than Vite internals,
          so web, desktop, docs examples, and future mobile clients can all read the same shape.
        </p>

        <div className="doc-card-grid">
          {serviceMappings.map((mapping) => (
            <article key={mapping.label} className="doc-card">
              <h3 className="doc-card-title">{mapping.label}</h3>
              <p className="doc-card-copy">{mapping.target}</p>
            </article>
          ))}
        </div>

        <div className="doc-code-block">
          <pre>{`API_BASE_URL=https://relayforge.example.com/api/v1
WS_URL=wss://relayforge.example.com/ws
LIVEKIT_URL=wss://livekit.example.com
MEDIA_BASE_URL=https://media.relayforge.example.com/api/v1`}</pre>
        </div>

        <div className="doc-callout">
          If API and media are served behind one reverse proxy, <code>MEDIA_BASE_URL</code> should
          still point at the API root that contains <code>/media</code>, for example{' '}
          <code>https://relayforge.example.com/api/v1</code>, not a duplicated{' '}
          <code>/api/v1/media</code> path.
        </div>
      </section>
    </>
  );
}
