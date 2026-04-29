export default function ContributingPage() {
  return (
    <>
      <section className="doc-section">
        <p className="doc-kicker">Contributing</p>
        <h1 className="doc-title !mt-2 !text-4xl md:!text-5xl">
          One contribution guide, published from the main repository.
        </h1>
        <p className="doc-section-copy !mt-4">
          Keep contribution policy centralized in <code>relay-forge</code>. That keeps docs, release
          expectations, and repository boundaries consistent for the entire platform.
        </p>

        <ol className="doc-list">
          <li>
            Put client, docs, and shared package changes in <code>relay-forge</code>.
          </li>
          <li>
            Put runtime service and deployment changes in <code>relay-forge-server</code>.
          </li>
          <li>
            Update the handbook whenever public behavior, deployment flow, or repo boundaries
            change.
          </li>
          <li>Open focused PRs and include the checks you ran plus any environment assumptions.</li>
        </ol>
      </section>

      <section className="doc-section">
        <h2 className="doc-section-title">Minimum review checklist</h2>
        <div className="doc-code-block">
          <pre>{`npm run lint
npm run typecheck
npm test
npm run check:api-contract
npm run build:docs`}</pre>
        </div>

        <p className="doc-section-copy">
          For backend work, use the server repository checks instead. The goal is to keep product
          work, backend work, and public documentation aligned without mixing unrelated codepaths in
          the same PR.
        </p>
      </section>
    </>
  );
}
