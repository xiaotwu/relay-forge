export default function QuickStartPage() {
  return (
    <div>
      <h1>Quick Start</h1>
      <p>
        Get RelayForge running locally in under five minutes using Docker Compose. This guide starts
        all backend services, the database, cache, object storage, and the web client.
      </p>

      <h2>Prerequisites</h2>
      <ul>
        <li>
          <strong>Docker</strong> 24+ and <strong>Docker Compose</strong> v2 (ships with Docker
          Desktop).
        </li>
        <li>
          <strong>Git</strong> for cloning the repository.
        </li>
        <li>
          At least <strong>4 GB of free RAM</strong> for all containers.
        </li>
        <li>
          Ports <code>5173</code> (web), <code>8080</code> (API), <code>8081</code> (WebSocket), and{' '}
          <code>5432</code> (Postgres) should be available.
        </li>
      </ul>

      <h2>Step 1 &mdash; Clone the Repository</h2>
      <pre>
        <code>{`git clone https://github.com/your-org/relay-forge.git
cd relay-forge`}</code>
      </pre>

      <h2>Step 2 &mdash; Create the Environment File</h2>
      <p>
        Copy the example environment file and review the defaults. For local development, the
        defaults work out of the box.
      </p>
      <pre>
        <code>{`cp .env.example .env`}</code>
      </pre>
      <div className="warning-box">
        <strong>Important:</strong> Change <code>AUTH_JWT_SECRET</code> to a random string of at
        least 32 characters before exposing the instance to any network. The default value is
        intentionally insecure for local development.
      </div>

      <h2>Step 3 &mdash; Start All Services</h2>
      <pre>
        <code>{`# From the repository root
docker compose -f deploy/docker/docker-compose.yml up -d`}</code>
      </pre>
      <p>This starts the following containers:</p>
      <table>
        <thead>
          <tr>
            <th>Container</th>
            <th>Port</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>relayforge-postgres</code>
            </td>
            <td>5432</td>
            <td>PostgreSQL 16 database</td>
          </tr>
          <tr>
            <td>
              <code>relayforge-valkey</code>
            </td>
            <td>6379</td>
            <td>Valkey cache and pub/sub</td>
          </tr>
          <tr>
            <td>
              <code>relayforge-minio</code>
            </td>
            <td>9000 / 9001</td>
            <td>MinIO object storage (S3-compatible)</td>
          </tr>
          <tr>
            <td>
              <code>relayforge-livekit</code>
            </td>
            <td>7880</td>
            <td>LiveKit WebRTC SFU</td>
          </tr>
          <tr>
            <td>
              <code>relayforge-api</code>
            </td>
            <td>8080</td>
            <td>REST API service</td>
          </tr>
          <tr>
            <td>
              <code>relayforge-realtime</code>
            </td>
            <td>8081</td>
            <td>WebSocket gateway</td>
          </tr>
          <tr>
            <td>
              <code>relayforge-media</code>
            </td>
            <td>8082</td>
            <td>Media processing service</td>
          </tr>
          <tr>
            <td>
              <code>relayforge-web</code>
            </td>
            <td>5173</td>
            <td>Web client (Vite dev server)</td>
          </tr>
        </tbody>
      </table>

      <h2>Step 4 &mdash; Verify Everything Is Running</h2>
      <pre>
        <code>{`# Check container status
docker compose -f deploy/docker/docker-compose.yml ps

# Check API health
curl http://localhost:8080/health`}</code>
      </pre>
      <p>
        The health endpoint returns <code>{`{"status":"ok"}`}</code> when the API service has
        successfully connected to PostgreSQL and Valkey.
      </p>

      <h2>Step 5 &mdash; Open the Web Client</h2>
      <p>
        Navigate to <code>http://localhost:5173</code> in your browser. You will see the login page.
        Click <strong>Register</strong> to create your first account.
      </p>

      <h2>Step 6 &mdash; Create Your First Guild</h2>
      <ol>
        <li>
          After registering and logging in, click the <strong>+</strong> button in the guild
          sidebar.
        </li>
        <li>Enter a guild name (e.g., "My Team") and optionally upload an icon.</li>
        <li>
          The guild is created with a default <code>#general</code> text channel and an{' '}
          <code>@everyone</code> role.
        </li>
        <li>Share the invite link with teammates to have them join.</li>
      </ol>

      <h2>Stopping the Stack</h2>
      <pre>
        <code>{`docker compose -f deploy/docker/docker-compose.yml down

# To also remove volumes (database data, uploaded files):
docker compose -f deploy/docker/docker-compose.yml down -v`}</code>
      </pre>

      <h2>Next Steps</h2>
      <ul>
        <li>
          Read the <a href="#/local-dev">Local Development</a> guide to run services outside of
          Docker for faster iteration.
        </li>
        <li>
          Review the <a href="#/config">Configuration Reference</a> for all environment variables.
        </li>
        <li>
          Set up <a href="#/deployment">production deployment</a> with TLS and a reverse proxy.
        </li>
      </ul>
    </div>
  );
}
