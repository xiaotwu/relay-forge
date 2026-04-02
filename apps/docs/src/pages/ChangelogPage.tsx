export default function ChangelogPage() {
  return (
    <div className="space-y-10">
      <div>
        <span className="section-chip">Release notes</span>
        <h1>Changelog</h1>
        <p>
          All notable changes to RelayForge are tracked here. The project follows{' '}
          <a href="https://semver.org" target="_blank" rel="noreferrer">
            Semantic Versioning
          </a>{' '}
          and the{' '}
          <a href="https://keepachangelog.com" target="_blank" rel="noreferrer">
            Keep a Changelog
          </a>{' '}
          structure.
        </p>
      </div>

      <section>
        <h2>Format</h2>
        <p>Each release entry uses the same categories so operators can scan impact quickly.</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <div key={category.title} className="docs-stat-card">
              <p className="text-ink-900 mb-2 font-serif text-2xl">{category.title}</p>
              <p className="text-ink-600 mb-0 text-sm leading-7">{category.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Current release track</h2>
        <div className="rounded-[1.75rem] border border-[#dccfb9] bg-white p-6 shadow-[0_18px_40px_rgba(30,61,89,0.06)]">
          <p className="section-chip mb-3">Unreleased</p>
          <h3 className="!mt-0">v0.1.0 - Initial release</h3>
          <p>
            The initial release establishes the full self-hosted collaboration stack and the docs
            site that explains how to run it.
          </p>
          <h4>Added</h4>
          <ul>
            <li>User registration and authentication with JWT and two-factor support.</li>
            <li>Guilds, channels, roles, moderation tools, and audit logs.</li>
            <li>Rich messaging, reactions, file uploads, replies, and threads.</li>
            <li>End-to-end encrypted direct messages.</li>
            <li>Voice, video, and LiveKit-backed real-time communication.</li>
            <li>React web app and Tauri desktop app.</li>
            <li>Docker, Helm, Terraform, and reverse-proxy deployment paths.</li>
            <li>Observability, CI/CD, backup, restore, and operator documentation.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

const categories = [
  { title: 'Added', desc: 'New capabilities, surfaces, or workflows entering the product.' },
  { title: 'Changed', desc: 'Behavior shifts, reorganized flows, or updates to existing systems.' },
  { title: 'Deprecated', desc: 'Features that still work now but are scheduled for removal.' },
  { title: 'Removed', desc: 'Capabilities or interfaces that are no longer supported.' },
  { title: 'Fixed', desc: 'Bug fixes, regressions, and correctness improvements.' },
  {
    title: 'Security',
    desc: 'Vulnerability fixes, hardening work, and disclosure-related updates.',
  },
];
