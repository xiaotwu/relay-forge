const referenceGroups = [
  {
    title: 'Client stack',
    links: [
      ['React', 'https://react.dev/'],
      ['Vite', 'https://vite.dev/'],
      ['Tauri', 'https://tauri.app/'],
      ['Tailwind CSS', 'https://tailwindcss.com/'],
      ['LiveKit', 'https://livekit.io/'],
    ],
  },
  {
    title: 'Backend stack',
    links: [
      ['Go', 'https://go.dev/'],
      ['PostgreSQL', 'https://www.postgresql.org/'],
      ['Valkey', 'https://valkey.io/'],
      ['OpenTelemetry', 'https://opentelemetry.io/'],
      ['ClamAV', 'https://www.clamav.net/'],
    ],
  },
  {
    title: 'Delivery stack',
    links: [
      ['GitHub Actions', 'https://docs.github.com/actions'],
      ['GitHub Pages', 'https://docs.github.com/pages'],
      [
        'GitHub Container Registry',
        'https://docs.github.com/packages/working-with-a-github-packages-registry/working-with-the-container-registry',
      ],
      ['Apache License 2.0', 'https://www.apache.org/licenses/LICENSE-2.0'],
      ['GNU AGPL 3.0', 'https://www.gnu.org/licenses/agpl-3.0.en.html'],
    ],
  },
];

export default function ReferencesPage() {
  return (
    <section className="doc-section">
      <p className="doc-kicker">References</p>
      <h1 className="doc-title !mt-2 !text-4xl md:!text-5xl">
        Primary technologies and source material.
      </h1>
      <p className="doc-section-copy !mt-4">
        These are the primary upstream references behind the architecture, delivery, and licensing
        choices documented across the handbook.
      </p>

      <div className="doc-card-grid">
        {referenceGroups.map((group) => (
          <article key={group.title} className="doc-card">
            <h2 className="doc-card-title">{group.title}</h2>
            <ul className="doc-list">
              {group.links.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-stone-300 underline-offset-4"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
