export default function ContributingPage() {
  return (
    <div>
      <h1>Contributing</h1>
      <p>
        Use this repo for client UI, shared frontend packages, desktop packaging, and
        documentation. Use <code>new-project/</code> for backend logic and service runtime changes.
      </p>

      <h2>Before opening a PR</h2>
      <pre>{`npm run lint
npm run typecheck
npm test
npm run build:docs`}</pre>

      <h2>Good PR habits</h2>
      <ul>
        <li>Keep repo boundary changes explicit.</li>
        <li>Document any endpoint contract change that clients depend on.</li>
        <li>Remove stale docs when you simplify a flow.</li>
        <li>Prefer smaller, readable updates over broad cosmetic churn.</li>
      </ul>
    </div>
  );
}
