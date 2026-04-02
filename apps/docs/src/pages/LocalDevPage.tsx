export default function LocalDevPage() {
  return (
    <div>
      <h1>Local Development</h1>
      <p>
        This guide walks you through running RelayForge services directly on your host machine for
        faster iteration during development. Unlike the Quick Start guide that uses Docker for
        everything, this approach runs Go services and the frontend natively while keeping
        infrastructure (PostgreSQL, Valkey, MinIO, LiveKit) in Docker.
      </p>

      <h2>Prerequisites</h2>
      <table>
        <thead>
          <tr>
            <th>Tool</th>
            <th>Version</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>Go</strong>
            </td>
            <td>1.23+</td>
            <td>
              Required for all backend services. Install from <code>go.dev</code>.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Node.js</strong>
            </td>
            <td>20+</td>
            <td>Required for the web client and shared TypeScript packages.</td>
          </tr>
          <tr>
            <td>
              <strong>npm</strong>
            </td>
            <td>10+</td>
            <td>Ships with Node.js 20. Used for frontend dependency management.</td>
          </tr>
          <tr>
            <td>
              <strong>Docker</strong>
            </td>
            <td>24+</td>
            <td>Required for infrastructure containers (Postgres, Valkey, MinIO, LiveKit).</td>
          </tr>
          <tr>
            <td>
              <strong>Docker Compose</strong>
            </td>
            <td>v2</td>
            <td>
              Ships with Docker Desktop. The <code>docker compose</code> (v2) command syntax is
              required.
            </td>
          </tr>
          <tr>
            <td>
              <strong>Make</strong>
            </td>
            <td>Any</td>
            <td>The Makefile orchestrates common development tasks.</td>
          </tr>
          <tr>
            <td>
              <strong>Air</strong> (optional)
            </td>
            <td>Latest</td>
            <td>
              Go live-reload tool. Install with{' '}
              <code>go install github.com/air-verse/air@latest</code>.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Step 1 &mdash; Clone and Configure</h2>
      <pre>
        <code>{`git clone https://github.com/your-org/relay-forge.git
cd relay-forge
cp .env.example .env`}</code>
      </pre>
      <p>
        The default <code>.env</code> values are pre-configured for local development. No changes
        are required unless you have port conflicts.
      </p>

      <h2>Step 2 &mdash; Start Infrastructure Services</h2>
      <p>This starts PostgreSQL, Valkey, MinIO, and LiveKit in Docker containers:</p>
      <pre>
        <code>{`make dev-services`}</code>
      </pre>
      <p>
        Under the hood this runs{' '}
        <code>docker compose -f deploy/docker/docker-compose.dev.yml up -d</code>. The containers
        expose their default ports to <code>localhost</code>:
      </p>
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Port</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>PostgreSQL</td>
            <td>5432</td>
          </tr>
          <tr>
            <td>Valkey</td>
            <td>6379</td>
          </tr>
          <tr>
            <td>MinIO (S3 API)</td>
            <td>9000</td>
          </tr>
          <tr>
            <td>MinIO Console</td>
            <td>9001</td>
          </tr>
          <tr>
            <td>LiveKit</td>
            <td>7880</td>
          </tr>
        </tbody>
      </table>

      <h2>Step 3 &mdash; Run Migrations and Seed Data</h2>
      <pre>
        <code>{`# Apply all database migrations
make migrate

# Seed the database with development data
make seed`}</code>
      </pre>
      <p>
        The <code>migrate</code> target runs the Go migration tool that applies SQL files from
        <code>services/api/migrations/</code> in order. The <code>seed</code> target inserts test
        users, a sample guild, and default channels.
      </p>

      <h3>Default Development Credentials</h3>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>admin</code>
            </td>
            <td>admin@relayforge.local</td>
            <td>
              <code>admin123</code>
            </td>
            <td>Platform admin</td>
          </tr>
          <tr>
            <td>
              <code>user1</code>
            </td>
            <td>user1@relayforge.local</td>
            <td>
              <code>user123</code>
            </td>
            <td>Regular user</td>
          </tr>
          <tr>
            <td>
              <code>user2</code>
            </td>
            <td>user2@relayforge.local</td>
            <td>
              <code>user123</code>
            </td>
            <td>Regular user</td>
          </tr>
        </tbody>
      </table>
      <div className="warning-box">
        <strong>Warning:</strong> These credentials are for local development only. Never use them
        in production.
      </div>

      <h2>Step 4 &mdash; Start Backend Services</h2>
      <p>
        Open four separate terminals (or use a terminal multiplexer like tmux) and start each
        service:
      </p>
      <pre>
        <code>{`# Terminal 1 — API service (REST endpoints, auth, CRUD)
make dev-api

# Terminal 2 — Realtime service (WebSocket gateway, presence, events)
make dev-realtime

# Terminal 3 — Media service (file uploads, image processing, presigned URLs)
make dev-media

# Terminal 4 — Worker service (background jobs, email sending, cleanup tasks)
make dev-worker`}</code>
      </pre>
      <p>
        Each <code>make dev-*</code> target uses <strong>Air</strong> for live reloading. When you
        save a <code>.go</code> file, Air rebuilds and restarts the service automatically. If Air is
        not installed, the targets fall back to a plain <code>go run</code>.
      </p>
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Port</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>API</td>
            <td>8080</td>
            <td>REST API handling authentication, guilds, channels, messages, users</td>
          </tr>
          <tr>
            <td>Realtime</td>
            <td>8081</td>
            <td>WebSocket gateway for real-time events, typing indicators, presence</td>
          </tr>
          <tr>
            <td>Media</td>
            <td>8082</td>
            <td>File upload processing, thumbnail generation, antivirus scanning</td>
          </tr>
          <tr>
            <td>Worker</td>
            <td>N/A</td>
            <td>Background job processor consuming from Valkey queues</td>
          </tr>
        </tbody>
      </table>

      <h2>Step 5 &mdash; Start the Frontend</h2>
      <pre>
        <code>{`# Install dependencies (from the repository root)
npm install

# Build shared TypeScript packages (types, utils, validators)
npm run build:packages

# Start the web client dev server with hot module replacement
make dev-web`}</code>
      </pre>
      <p>
        The web client starts on <code>http://localhost:5173</code> with Vite's HMR. Changes to
        React components are reflected instantly without a full page reload.
      </p>

      <h2>Project Structure</h2>
      <pre>
        <code>{`relay-forge/
├── services/
│   ├── api/          # Go — REST API service
│   ├── realtime/     # Go — WebSocket gateway
│   ├── media/        # Go — Media processing
│   └── worker/       # Go — Background jobs
├── apps/
│   ├── web/          # React/TypeScript — Main web client
│   ├── desktop/      # Tauri 2 — Desktop wrapper
│   ├── admin/        # React — Admin console
│   └── docs/         # React — Documentation site (this site)
├── packages/
│   ├── types/        # Shared TypeScript type definitions
│   ├── utils/        # Shared utility functions
│   └── validators/   # Shared validation schemas (Zod)
├── deploy/           # Docker Compose files, Helm charts, Terraform
├── scripts/          # Development and CI scripts
└── go.work           # Go workspace configuration`}</code>
      </pre>

      <h2>Go Workspace</h2>
      <p>
        The repository uses a Go workspace (<code>go.work</code>) to manage multiple Go modules
        under <code>services/</code>. This means you can run <code>go build</code> or
        <code>go test</code> from any service directory without replace directives. The workspace
        file references all four service modules.
      </p>

      <h2>Running Tests</h2>
      <pre>
        <code>{`# Run all Go tests across all services
make test-go

# Run tests for a specific service
cd services/api && go test ./...

# Run frontend tests
make test-web

# Run all tests (Go + frontend)
make test`}</code>
      </pre>

      <h2>Code Quality</h2>
      <pre>
        <code>{`# Go linting (requires golangci-lint)
make lint-go

# Frontend linting and type checking
make lint-web

# Format all code
make fmt`}</code>
      </pre>

      <h2>Common Issues and Troubleshooting</h2>

      <h3>Port already in use</h3>
      <p>
        If a port is occupied, either stop the conflicting process or change the port in your{' '}
        <code>.env</code> file. Common conflicts include PostgreSQL on 5432 (if you have a
        system-level Postgres installation) and port 8080 (common for other web services).
      </p>
      <pre>
        <code>{`# Find what's using a port
lsof -i :8080
# or on Linux
ss -tlnp | grep 8080`}</code>
      </pre>

      <h3>Database connection refused</h3>
      <p>
        Ensure the infrastructure containers are running with{' '}
        <code>docker compose -f deploy/docker/docker-compose.dev.yml ps</code>. If PostgreSQL is not
        ready yet, wait a few seconds and retry. The API service has a built-in retry loop on
        startup.
      </p>

      <h3>Migration errors</h3>
      <p>If migrations fail due to a dirty state, you can reset the database:</p>
      <pre>
        <code>{`# WARNING: This destroys all data
make db-reset

# Then re-run migrations and seed
make migrate && make seed`}</code>
      </pre>

      <h3>MinIO buckets not created</h3>
      <p>
        The <code>make dev-services</code> target includes an init container that creates the
        required S3 buckets. If buckets are missing, you can recreate them manually via the MinIO
        Console at <code>http://localhost:9001</code> (login: <code>minioadmin</code> /
        <code>minioadmin</code>) or with the MinIO client:
      </p>
      <pre>
        <code>{`mc alias set local http://localhost:9000 minioadmin minioadmin
mc mb local/relay-uploads
mc mb local/relay-avatars
mc mb local/relay-emoji`}</code>
      </pre>

      <h3>Air not found</h3>
      <p>If you see "air: command not found", install it with:</p>
      <pre>
        <code>{`go install github.com/air-verse/air@latest`}</code>
      </pre>
      <p>
        Make sure <code>$GOPATH/bin</code> (usually <code>~/go/bin</code>) is in your
        <code>PATH</code>. If you prefer not to install Air, the Makefile targets fall back to
        <code>go run</code> automatically, but you will lose live reloading.
      </p>

      <h3>npm install fails with peer dependency errors</h3>
      <p>
        Ensure you are using Node.js 20+. The project does not support Node 18 or earlier. Check
        your version with <code>node --version</code>. If you use nvm, run
        <code>nvm use 20</code>.
      </p>

      <h2>Next Steps</h2>
      <ul>
        <li>
          Review the <a href="/config">Configuration Reference</a> for all available environment
          variables.
        </li>
        <li>
          Read the <a href="/architecture">Architecture</a> page to understand how services
          communicate.
        </li>
        <li>
          Check the <a href="/contributing">Contributing Guide</a> before opening a pull request.
        </li>
      </ul>
    </div>
  );
}
