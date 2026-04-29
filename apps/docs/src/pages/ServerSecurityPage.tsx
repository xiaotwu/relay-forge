const threatRows = [
  {
    vector: 'Disabled users with existing access tokens',
    mitigation:
      'Authenticated API middleware and realtime connection checks re-read user status from PostgreSQL and reject disabled or missing users.',
  },
  {
    vector: 'Unauthorized media reads',
    mitigation:
      'Media proxy reads enforce owner_type and owner_id ACLs for DM, channel, guild, pending upload, and profile contexts before redirecting to storage.',
  },
  {
    vector: 'Realtime event disclosure',
    mitigation:
      'WebSocket connections require JWTs, guild subscriptions are validated against membership, and Valkey fan-out routes events to guild or user recipients.',
  },
  {
    vector: 'Upload completion spoofing',
    mitigation:
      'Only the uploader can complete a pending upload, the object key must match the file id, and size/content type are checked against storage metadata.',
  },
  {
    vector: 'Production origin mistakes',
    mitigation:
      'API, media, and realtime config reject wildcard CORS/origin settings in production and require explicit origins.',
  },
];

const tradeoffs = [
  {
    title: 'Media read tokens',
    copy: 'Browser media elements currently use token query auth. Short-lived scoped media read tokens remain the recommended next hardening step.',
  },
  {
    title: 'Server-side checks',
    copy: 'The API performs a user-status database check on authenticated requests. This prioritizes disable correctness over avoiding every DB read.',
  },
  {
    title: 'Moderation visibility',
    copy: 'Guild content remains server-authoritative so search, moderation, audit, and admin workflows can operate predictably.',
  },
];

export default function ServerSecurityPage() {
  return (
    <>
      <section className="doc-section">
        <p className="doc-kicker">Security model</p>
        <h1 className="doc-title !mt-2 !text-4xl md:!text-5xl">
          The backend is authoritative for access, delivery, and media ownership.
        </h1>
        <p className="doc-section-copy !mt-4">
          RelayForge protects API routes with JWT middleware, checks disabled users before access
          token TTL expires, validates realtime subscriptions, and enforces recipient-level media
          ACLs before storage redirects.
        </p>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Threat model summary</h2>
        <div className="doc-table">
          <table>
            <thead>
              <tr>
                <th>Threat vector</th>
                <th>Mitigation</th>
              </tr>
            </thead>
            <tbody>
              {threatRows.map((row) => (
                <tr key={row.vector}>
                  <td>{row.vector}</td>
                  <td>{row.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Intentional tradeoffs</h2>
        <div className="doc-card-grid">
          {tradeoffs.map((tradeoff) => (
            <article key={tradeoff.title} className="doc-card">
              <h3 className="doc-card-title">{tradeoff.title}</h3>
              <p className="doc-card-copy">{tradeoff.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
