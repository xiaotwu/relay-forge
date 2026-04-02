export default function LocalDevPage() {
  return (
    <div>
      <h1>Local Development</h1>
      <p>
        Local development in this repo focuses on the clients and shared frontend packages. The
        backend is treated as an external system reachable through configured endpoints.
      </p>

      <h2>Install tools</h2>
      <ol>
        <li>Use Homebrew for Node.js, Rust, and platform dependencies.</li>
        <li>Use official installers only if Homebrew cannot provide the required version.</li>
      </ol>

      <h2>Recommended flow</h2>
      <pre>{`npm install
npm run build:packages
npm run dev:web`}</pre>

      <h2>Desktop work</h2>
      <p>
        The desktop client shares most of its frontend code with the web app. Build the frontend
        bundle during day-to-day work, then use Tauri packaging when you need installers.
      </p>

      <pre>{`npm run dev:desktop
npm -w apps/desktop run build
npm run package:desktop`}</pre>

      <div className="callout">
        If you need to change backend behavior, make that change in{' '}
        <code>relay-forge-server</code> and verify the client against the updated backend URL.
      </div>
    </div>
  );
}
