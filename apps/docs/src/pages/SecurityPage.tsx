const securityRules = [
  'Keep runtime endpoints explicit through API_BASE_URL, WS_URL, LIVEKIT_URL, and MEDIA_BASE_URL.',
  'Render message text through React text nodes and keep markdown links limited to safe URL schemes.',
  'Route browser media reads through the media proxy so backend recipient-level ACLs remain authoritative.',
  'Keep Tauri CSP enabled and treat desktop signing, notification, and release credentials as deployment secrets.',
  'Use OpenAPI-backed SDK path builders for public SDK methods instead of scattering raw route strings.',
];

const knownLimits = [
  'The SDK request layer is handwritten, but paths are checked through generated OpenAPI path types and request tests.',
  'Browser image and media tags currently use an access token in the token query parameter; short-lived scoped media read tokens are the preferred future hardening.',
  'npm audit currently reports two moderate docs-app findings in Mermaid and transitive uuid; npm proposes a breaking Mermaid downgrade, so the advisory remains tracked.',
];

export default function SecurityPage() {
  return (
    <>
      <section className="doc-section">
        <p className="doc-kicker">Client security</p>
        <h1 className="doc-title !mt-2 !text-4xl md:!text-5xl">
          The UI stays thin where security belongs on the server.
        </h1>
        <p className="doc-section-copy !mt-4">
          RelayForge clients keep secrets out of source, avoid unsafe rendering, and consume typed
          contracts. Authorization, disabled-user enforcement, realtime subscription validation,
          media ACLs, and admin permissions remain server-owned.
        </p>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Client controls</h2>
        <p className="doc-section-copy">
          Do not open public issues for vulnerabilities. Report privately with affected repository,
          reproduction steps, impact, and any useful traces or screenshots.
        </p>

        <ul className="doc-list">
          {securityRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Known limitations</h2>
        <ul className="doc-list">
          {knownLimits.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>

        <div className="doc-callout">
          RelayForge uses Apache-2.0 across both repositories. License notes live in the root
          repository files; security notes should stay focused on runtime behavior and operational
          risk.
        </div>
      </section>
    </>
  );
}
