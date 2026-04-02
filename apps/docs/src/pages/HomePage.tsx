import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <h1>RelayForge Handbook</h1>
      <p>
        This site documents both RelayForge repositories: the client applications in{' '}
        <code>relay-forge</code> and the backend services in <code>relay-forge-server</code>.
      </p>
      <p>
        The backend now lives in <code>relay-forge-server</code>. Clients connect to that backend
        through configurable endpoints instead of local server code inside this repo.
      </p>

      <div className="callout">
        Use the client section when you are shipping UI code, building installers, updating shared
        frontend packages, or maintaining GitHub Pages. Use the server section for runtime,
        deployment, operations, and security guidance.
      </div>

      <h2>Client repo</h2>
      <ul>
        <li>
          <code>apps/web</code> for the main browser client
        </li>
        <li>
          <code>apps/admin</code> for moderation and platform administration
        </li>
        <li>
          <code>apps/desktop</code> for Tauri-based desktop releases
        </li>
        <li>
          <code>apps/docs</code> for GitHub Pages
        </li>
        <li>
          <code>packages/*</code> for UI, config, SDK, types, and crypto helpers
        </li>
      </ul>

      <h2>Server repo</h2>
      <ul>
        <li>
          <code>services/*</code> for the API, realtime, media, and worker services
        </li>
        <li>
          <code>infra/</code> for Docker, proxy, and observability assets
        </li>
        <li>
          <code>docs/</code> for architecture, operations, and security guidance
        </li>
      </ul>

      <h2>Start here</h2>
      <ul>
        <li>
          <Link to="/quick-start">Quick Start</Link> for a fast client-only setup
        </li>
        <li>
          <Link to="/config">Endpoint Config</Link> to point clients at the correct backend
        </li>
        <li>
          <Link to="/deployment">Packaging</Link> to create zip archives and desktop installers
        </li>
        <li>
          <Link to="/architecture">Repo Boundaries</Link> to see how the split works
        </li>
        <li>
          <Link to="/server">Backend Overview</Link> for the server stack and deployment model
        </li>
        <li>
          <Link to="/server/operations">Backend Operations</Link> for production and release notes
        </li>
      </ul>
    </div>
  );
}
