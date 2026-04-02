import { Link } from 'react-router-dom';

export default function ServerHomePage() {
  return (
    <div>
      <h1>RelayForge Server</h1>
      <p>
        <code>relay-forge-server</code> is the standalone backend repository for RelayForge. It
        owns the API, realtime gateway, media service, worker processes, deployment assets, and
        backend runbooks.
      </p>

      <div className="callout">
        The client repo publishes this combined handbook, but the backend source code and release
        workflows live in <code>relay-forge-server</code>.
      </div>

      <h2>What lives in the repo</h2>
      <ul>
        <li>
          <code>services/api</code> for authentication, RBAC, guilds, channels, messages, admin,
          and database migrations
        </li>
        <li>
          <code>services/realtime</code> for WebSocket fan-out, presence, typing, and event
          delivery
        </li>
        <li>
          <code>services/media</code> for uploads, S3-compatible storage, and LiveKit integration
        </li>
        <li>
          <code>services/worker</code> for background jobs, maintenance, and delivery workflows
        </li>
        <li>
          <code>infra/</code> for Docker-based deployment, proxy, and observability assets
        </li>
      </ul>

      <h2>Quick start</h2>
      <pre>{`cp .env.example .env
make test
make build`}</pre>

      <h2>Server docs</h2>
      <ul>
        <li>
          <Link to="/server/architecture">Architecture</Link> for service boundaries and data flow
        </li>
        <li>
          <Link to="/server/operations">Operations</Link> for deployment, production readiness, and
          release guidance
        </li>
        <li>
          <Link to="/server/security">Security Model</Link> for the threat model and trust
          boundaries
        </li>
      </ul>
    </div>
  );
}
