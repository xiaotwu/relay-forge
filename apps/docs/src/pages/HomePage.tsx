import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <h1>RelayForge Client Handbook</h1>
      <p>
        This site documents the client-side RelayForge repository: the web application, admin
        console, desktop app, shared frontend packages, and the documentation site itself.
      </p>
      <p>
        The backend has been extracted into <code>new-project/</code> so it can move into its own
        repository. Clients connect to that backend through configurable endpoints instead of local
        server code inside this repo.
      </p>

      <div className="callout">
        Use this repo when you are shipping client code, building installers, updating shared
        frontend packages, or maintaining GitHub Pages. Use <code>new-project/</code> for service
        runtime, migrations, and backend deployment.
      </div>

      <h2>What stays here</h2>
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
      </ul>
    </div>
  );
}
