export default function ArchitecturePage() {
  return (
    <div>
      <h1>Repository Boundaries</h1>
      <p>
        RelayForge is now split into two concerns: this repository holds the clients and docs,
        while <code>relay-forge-server</code> holds the backend services and their deployment
        assets.
      </p>

      <h2>Main repo</h2>
      <ul>
        <li>Builds browser clients, desktop installers, and documentation.</li>
        <li>Owns shared frontend packages and endpoint configuration.</li>
        <li>Does not depend on local Go services or Docker-based deployment.</li>
      </ul>

      <h2>Backend repo staging area</h2>
      <ul>
        <li>
          <code>relay-forge-server/services</code> contains the Go services.
        </li>
        <li>
          <code>relay-forge-server/infra</code> contains backend deployment assets.
        </li>
        <li>
          <code>relay-forge-server/docs</code> contains backend operations documentation.
        </li>
        <li>
          <code>relay-forge-server/.github/workflows</code> contains backend CI and release
          workflows.
        </li>
      </ul>

      <div className="callout">
        The split is designed so the backend can move to another directory or repository without
        breaking the client repo. The only contract between them is the set of endpoint URLs the
        clients use at runtime.
      </div>
    </div>
  );
}
