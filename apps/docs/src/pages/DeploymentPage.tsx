export default function DeploymentPage() {
  return (
    <div className="space-y-10">
      <div>
        <span className="section-chip">Self-hosting</span>
        <h1>Deployment guide</h1>
        <p>
          RelayForge now treats <code>infra/docker/docker-compose.yml</code> as the primary
          single-host deployment path. The stack bundles PostgreSQL, Valkey, MinIO, and LiveKit so
          operators can launch a real environment without stitching together extra services first.
        </p>
      </div>

      <section>
        <h2>Recommended paths</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="docs-stat-card">
            <p className="section-chip mb-3">Default</p>
            <p className="text-ink-900 mb-2 font-serif text-2xl">Docker Compose</p>
            <p className="text-ink-600 mb-0 text-sm leading-7">
              Best for a single VM, home lab, or internal deployment where simple operations matter
              more than multi-node scheduling.
            </p>
          </div>
          <div className="docs-stat-card">
            <p className="section-chip mb-3">Scale-out</p>
            <p className="text-ink-900 mb-2 font-serif text-2xl">Kubernetes and Helm</p>
            <p className="text-ink-600 mb-0 text-sm leading-7">
              Best when you already operate a cluster and want managed databases, rolling updates,
              and independent replica counts per service.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2>Single-host production flow</h2>
        <ol>
          <li>Provision a Linux host with Docker 24+ and Docker Compose v2.</li>
          <li>
            Clone the repository and copy <code>.env.example</code> to <code>.env.production</code>.
          </li>
          <li>Replace all insecure defaults, especially secrets, storage credentials, and SMTP.</li>
          <li>
            Start the stack with <code>make deploy-up ENV_FILE=.env.production</code>.
          </li>
          <li>
            Run database migrations with <code>make deploy-migrate ENV_FILE=.env.production</code>.
          </li>
          <li>Place a reverse proxy in front for TLS and public routing.</li>
        </ol>
      </section>

      <section>
        <h2>Host checklist</h2>
        <ul>
          <li>A Linux server with at least 2 vCPUs and 4 GB RAM for small internal deployments.</li>
          <li>4 vCPUs and 8 GB RAM is a more comfortable baseline for moderate team usage.</li>
          <li>SSD-backed storage for PostgreSQL and object data.</li>
          <li>A domain name and DNS records for your public endpoints.</li>
          <li>Open ports for your edge proxy and the media paths you intend to expose.</li>
        </ul>
      </section>

      <section>
        <h2>Critical production variables</h2>
        <table>
          <thead>
            <tr>
              <th>Variable</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {envActions.map((row) => (
              <tr key={row.variable}>
                <td>
                  <code>{row.variable}</code>
                </td>
                <td>{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Core commands</h2>
        <pre>{`# Clone the repo
git clone https://github.com/xiaotwu/relay-forge.git
cd relay-forge

# Prepare your environment
cp .env.example .env.production

# Start the stack
make deploy-up ENV_FILE=.env.production

# Run migrations
make deploy-migrate ENV_FILE=.env.production

# Verify container health
docker compose --env-file .env.production -f infra/docker/docker-compose.yml ps
curl http://localhost:8080/healthz`}</pre>
      </section>

      <section>
        <h2>Reverse proxy and TLS</h2>
        <p>
          RelayForge services do not terminate TLS themselves. Put Nginx, Caddy, Traefik, or a cloud
          load balancer in front so certificates, headers, and public routing stay centralized.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {proxyNotes.map((note) => (
            <div key={note.title} className="rounded-[1.5rem] border border-[#dccfb9] bg-white p-5">
              <h3 className="!mt-0">{note.title}</h3>
              <p className="!mb-0">{note.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Kubernetes deployment</h2>
        <p>
          When you need a clustered deployment, use the Helm chart in
          <code>infra/helm/relay-forge/</code>. In that mode you should plan around managed or
          separately operated PostgreSQL, Valkey, object storage, and ingress.
        </p>
        <pre>{`helm install relayforge infra/helm/relay-forge/ \\
  --namespace relayforge \\
  --create-namespace \\
  --values infra/helm/values-production.yaml`}</pre>
      </section>
    </div>
  );
}

const envActions = [
  { variable: 'RELAY_ENV', action: 'Set this to production.' },
  {
    variable: 'AUTH_JWT_SECRET',
    action: 'Generate a long random secret, for example with `openssl rand -hex 32`.',
  },
  { variable: 'DB_PASSWORD', action: 'Replace the default with a strong unique password.' },
  {
    variable: 'S3_ACCESS_KEY / S3_SECRET_KEY',
    action: 'Change the bundled MinIO defaults before exposing the instance publicly.',
  },
  {
    variable: 'LIVEKIT_API_KEY / LIVEKIT_API_SECRET',
    action: 'Generate unique credentials for your LiveKit deployment.',
  },
  {
    variable: 'API_BASE_URL',
    action: 'Point this to the public API URL you want clients to use.',
  },
  {
    variable: 'API_CORS_ORIGINS',
    action: 'Restrict this to your frontend domains instead of leaving it broad.',
  },
  {
    variable: 'SMTP_*',
    action: 'Use real SMTP credentials if you want mail delivery and verification flows.',
  },
  {
    variable: 'EMAIL_VERIFICATION_ENABLED',
    action: 'Enable this when your SMTP configuration is complete.',
  },
];

const proxyNotes = [
  {
    title: 'Nginx',
    desc: 'Good when you want explicit upstreams, header control, and a familiar production baseline.',
  },
  {
    title: 'Caddy',
    desc: 'Good when you want automatic certificate provisioning with minimal configuration.',
  },
  {
    title: 'Traefik',
    desc: 'Good when you already use label-driven routing or want a single ingress story across Docker and Kubernetes.',
  },
];
