const threatRows = [
  {
    vector: 'Brute-force and token theft',
    mitigation:
      'Short-lived access tokens, rotation flows, rate limits, and server-side session revocation.',
  },
  {
    vector: 'Upload abuse and malware',
    mitigation:
      'MIME allowlists, size limits, direct storage coordination, and optional antivirus scanning.',
  },
  {
    vector: 'Privilege escalation',
    mitigation: 'Server-side RBAC and channel-level override evaluation on every operation.',
  },
  {
    vector: 'DM content disclosure',
    mitigation:
      'DM payloads are encrypted end to end; the server stores ciphertext and key bundles, not plaintext.',
  },
];

const tradeoffs = [
  {
    title: 'Only DMs are E2EE',
    copy: 'Guild content remains server-readable so search, moderation, and audit workflows remain viable.',
  },
  {
    title: 'Modular monolith, not many microservices',
    copy: 'The main complexity is runtime shape, not organizational purity, so the split follows connection behavior.',
  },
  {
    title: 'Shared PostgreSQL',
    copy: 'A single transactional database keeps the deployment story practical for the target scale.',
  },
];

export default function ServerSecurityPage() {
  return (
    <>
      <section className="doc-section">
        <p className="doc-kicker">Security model</p>
        <h1 className="doc-title !mt-2 !text-4xl md:!text-5xl">
          The backend trusts the server, except where the product explicitly should not.
        </h1>
        <p className="doc-section-copy !mt-4">
          RelayForge uses a server-authoritative model for permissions, moderation, and most message
          state. Direct messages are the notable exception and use end-to-end encryption boundaries.
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
