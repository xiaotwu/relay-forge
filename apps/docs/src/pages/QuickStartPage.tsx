import { Link } from 'react-router-dom';

export default function QuickStartPage() {
  return (
    <div className="space-y-10">
      <div>
        <span className="section-chip">Fast start</span>
        <h1>Quick start</h1>
        <p>
          Use the bundled Docker deployment to get RelayForge running locally in a few minutes. The
          stack includes the application services plus PostgreSQL, Valkey, MinIO, and LiveKit.
        </p>
      </div>

      <section>
        <h2>Before you start</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="docs-stat-card">
            <p className="section-chip mb-3">Tooling</p>
            <p className="text-ink-600 mb-0 text-sm leading-7">
              Docker 24+, Docker Compose v2, and Git.
            </p>
          </div>
          <div className="docs-stat-card">
            <p className="section-chip mb-3">Resources</p>
            <p className="text-ink-600 mb-0 text-sm leading-7">
              At least 4 GB of free RAM for the full container stack.
            </p>
          </div>
          <div className="docs-stat-card">
            <p className="section-chip mb-3">Ports</p>
            <p className="text-ink-600 mb-0 text-sm leading-7">
              Make sure ports 3000, 8080, 8081, 5432, 9000, and 7880 are available.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Launch flow</h2>
        <ol>
          <li>Clone the repository.</li>
          <li>Copy the example environment file.</li>
          <li>Start the bundled stack.</li>
          <li>Verify the API health endpoint and open the web client.</li>
          <li>Create your first account and guild.</li>
        </ol>
        <pre>{`git clone https://github.com/xiaotwu/relay-forge.git
cd relay-forge
cp .env.example .env
make deploy-up`}</pre>
      </section>

      <section>
        <h2>Environment note</h2>
        <div className="warning-box">
          <p className="mb-2 font-semibold">The example secret is only for local trials.</p>
          <p className="mb-0">
            Replace <code>AUTH_JWT_SECRET</code> with a random secret before exposing the instance
            outside your machine or network.
          </p>
        </div>
      </section>

      <section>
        <h2>Published services</h2>
        <table>
          <thead>
            <tr>
              <th>Container</th>
              <th>Port</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.name}>
                <td>
                  <code>{service.name}</code>
                </td>
                <td>{service.port}</td>
                <td>{service.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Verification</h2>
        <pre>{`docker compose --env-file .env -f infra/docker/docker-compose.yml ps
curl http://localhost:8080/healthz`}</pre>
        <p>
          When the API returns <code>{`{"status":"ok"}`}</code>, open{' '}
          <code>http://localhost:3000</code> and register your first account.
        </p>
      </section>

      <section>
        <h2>Create your first guild</h2>
        <ol>
          <li>Sign in and click the plus button in the guild rail.</li>
          <li>Name the guild and upload an icon if you want one.</li>
          <li>
            The default <code>#general</code> channel and <code>@everyone</code> role are created
            automatically.
          </li>
          <li>Share an invite with teammates when you are ready.</li>
        </ol>
      </section>

      <section>
        <h2>Stop the stack</h2>
        <pre>{`docker compose --env-file .env -f infra/docker/docker-compose.yml down

# remove volumes too
docker compose --env-file .env -f infra/docker/docker-compose.yml down -v`}</pre>
      </section>

      <section>
        <h2>Next steps</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <Link
            to="/local-dev"
            className="hover:text-brand-700 rounded-[1.25rem] border border-[#dccfb9] bg-white p-5 no-underline transition hover:border-[#c9ab81]"
          >
            <h3 className="!mt-0">Local development</h3>
            <p className="!mb-0">Run services outside Docker for faster day-to-day iteration.</p>
          </Link>
          <Link
            to="/config"
            className="hover:text-brand-700 rounded-[1.25rem] border border-[#dccfb9] bg-white p-5 no-underline transition hover:border-[#c9ab81]"
          >
            <h3 className="!mt-0">Configuration</h3>
            <p className="!mb-0">Review all environment variables and platform defaults.</p>
          </Link>
          <Link
            to="/deployment"
            className="hover:text-brand-700 rounded-[1.25rem] border border-[#dccfb9] bg-white p-5 no-underline transition hover:border-[#c9ab81]"
          >
            <h3 className="!mt-0">Production deployment</h3>
            <p className="!mb-0">
              Add TLS, public routing, and operator-ready production settings.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}

const services = [
  { name: 'relayforge-postgres', port: '5432', desc: 'PostgreSQL 16 database' },
  { name: 'relayforge-valkey', port: '6379', desc: 'Valkey cache and pub/sub' },
  { name: 'relayforge-api', port: '8080', desc: 'REST API service' },
  { name: 'relayforge-realtime', port: '8081', desc: 'WebSocket gateway' },
  { name: 'relayforge-media', port: '8082', desc: 'Media processing service' },
  { name: 'relayforge-web', port: '3000', desc: 'Web client' },
  { name: 'relayforge-worker', port: '-', desc: 'Background job processor' },
  { name: 'relayforge-minio', port: '9000 / 9001', desc: 'Object storage plus admin console' },
  {
    name: 'relayforge-livekit',
    port: '7880 / 7881 / 7882',
    desc: 'Voice and video signaling plus media transport',
  },
];
