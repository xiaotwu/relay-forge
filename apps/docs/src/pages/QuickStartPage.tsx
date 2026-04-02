export default function QuickStartPage() {
  return (
    <div>
      <h1>Quick Start</h1>
      <p>
        This repository no longer boots the full stack locally. It builds client applications that
        connect to an existing RelayForge backend.
      </p>

      <h2>Prerequisites</h2>
      <ul>
        <li>Install Node.js 20+ and npm 10+ with Homebrew when possible.</li>
        <li>Install Rust and Tauri prerequisites if you need desktop builds.</li>
        <li>Use the official installer only when Homebrew is missing or outdated.</li>
      </ul>

      <h2>Client setup</h2>
      <pre>{`cp .env.example .env
npm install
npm run build:packages
npm run dev:web`}</pre>

      <p>
        Update <code>.env</code> so the client points at the backend you want to use before you
        sign in.
      </p>

      <h2>Common commands</h2>
      <pre>{`npm run dev:web
npm run dev:admin
npm run dev:desktop
npm run dev:docs

npm run lint
npm run typecheck
npm test`}</pre>
    </div>
  );
}
