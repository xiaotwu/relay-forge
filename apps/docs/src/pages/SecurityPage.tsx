const securityRules = [
  'Never hard-code backend endpoints or secrets into product surfaces; keep the contract explicit in environment configuration.',
  'Treat desktop packaging, tokens, and notification credentials as platform-specific secrets and scope them to the smallest practical surface.',
  'Do not publish backend-only operational secrets, infrastructure IPs, or credential values in docs, READMEs, or example configs.',
];

const licenseReasons = [
  'Apache-2.0 is materially easier for commercial adopters, integrators, and package consumers than AGPL-3.0.',
  'It includes an explicit patent grant, which is valuable for a multi-repo platform with shared SDK and cryptography code.',
  'The commit history is single-author today, so relicensing is operationally feasible without a contributor-consent campaign.',
];

export default function SecurityPage() {
  return (
    <>
      <section className="doc-section">
        <p className="doc-kicker">Security and license</p>
        <h1 className="doc-title !mt-2 !text-4xl md:!text-5xl">
          Security policy stays strict even though the license is now more permissive.
        </h1>
        <p className="doc-section-copy !mt-4">
          RelayForge now uses Apache-2.0 across both repositories. The goal is to reduce adoption
          friction while keeping strong expectations around secret handling, release hygiene, and
          security reporting.
        </p>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Security reporting</h2>
        <p className="doc-section-copy">
          Do not open public issues for vulnerabilities. Report privately with a clear description,
          affected repository, reproduction steps, and impact assessment.
        </p>

        <ul className="doc-list">
          {securityRules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Why Apache-2.0 fits better now</h2>
        <ul className="doc-list">
          {licenseReasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>

        <div className="doc-callout">
          This is a project-structure decision, not legal advice. If the contributor model changes
          materially later, revisit the license policy before accepting outside relicensing
          constraints.
        </div>
      </section>
    </>
  );
}
