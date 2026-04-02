export default function ArchitecturePage() {
  return (
    <div>
      <h1>Architecture</h1>
      <p>
        RelayForge follows a service-oriented architecture with clear boundaries between the API
        layer, real-time delivery, media processing, and client applications. All services
        communicate over well-defined interfaces and can be scaled independently.
      </p>

      <h2>Service Boundaries</h2>
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Language</th>
            <th>Responsibility</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>api</code>
            </td>
            <td>Go</td>
            <td>
              REST API for all CRUD operations, authentication, authorisation, file uploads, and
              admin endpoints.
            </td>
          </tr>
          <tr>
            <td>
              <code>realtime</code>
            </td>
            <td>Go</td>
            <td>
              WebSocket gateway. Manages persistent connections, heartbeats, pub/sub event fan-out,
              typing indicators, and presence.
            </td>
          </tr>
          <tr>
            <td>
              <code>media</code>
            </td>
            <td>Go</td>
            <td>
              Image/video thumbnail generation, file metadata extraction, antivirus scanning
              delegation.
            </td>
          </tr>
          <tr>
            <td>
              <code>web</code>
            </td>
            <td>TypeScript / React</td>
            <td>
              Browser-based client SPA. Communicates with the API over REST and with the realtime
              service over WebSocket.
            </td>
          </tr>
          <tr>
            <td>
              <code>desktop</code>
            </td>
            <td>TypeScript / Electron</td>
            <td>
              Native desktop wrapper around the web client with system tray, notifications, and
              auto-update.
            </td>
          </tr>
          <tr>
            <td>
              <code>admin</code>
            </td>
            <td>TypeScript / React</td>
            <td>
              Platform administration dashboard for managing users, guilds, and system health.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Data Flow Diagram</h2>
      <pre>
        <code>{`
  Browser / Desktop / Mobile
       |              |
       | REST (HTTPS) | WebSocket (WSS)
       v              v
  +---------+   +------------+
  |   API   |   |  Realtime  |
  | Service |   |  Service   |
  +----+----+   +-----+------+
       |              |
       |  +-----------+
       |  |
       v  v
  +---------+     +--------+     +-----------+
  |  Postgres|<--->| Valkey |<--->|  LiveKit  |
  |  (data)  |    | (cache |     | (WebRTC   |
  |          |    |  pubsub)|    |  SFU)     |
  +----------+    +--------+     +-----------+
       |
       v
  +-----------+
  |  S3 / OSS |
  |  (files)  |
  +-----------+
`}</code>
      </pre>

      <h3>Request Lifecycle (REST)</h3>
      <ol>
        <li>The client sends an HTTP request to the API service.</li>
        <li>
          The Chi router matches the route and runs the middleware chain: request ID injection,
          structured logging, CORS, rate limiting, and JWT authentication.
        </li>
        <li>
          The handler validates the request body, calls the appropriate repository layer, and
          returns a JSON response.
        </li>
        <li>
          If the operation produces a side-effect visible to other users (e.g., new message), the
          API publishes an event to Valkey pub/sub.
        </li>
        <li>
          The Realtime service, subscribed to the relevant Valkey channels, receives the event and
          fans it out to all connected WebSocket clients in the target guild/channel.
        </li>
      </ol>

      <h3>WebSocket Lifecycle</h3>
      <ol>
        <li>
          The client opens a WebSocket connection to the Realtime service, passing the JWT access
          token as a query parameter or in the first message.
        </li>
        <li>
          The service validates the token and registers the connection in its in-memory connection
          registry, keyed by user ID and guild subscriptions.
        </li>
        <li>
          The client sends a heartbeat every 30 seconds. If two consecutive heartbeats are missed,
          the server closes the connection.
        </li>
        <li>
          Events from Valkey pub/sub are matched against the connection registry and dispatched to
          the appropriate WebSocket connections.
        </li>
        <li>
          Client-originated events (typing indicators, presence updates, read-state
          acknowledgements) are received, validated, and either broadcast or recorded.
        </li>
      </ol>

      <h2>Technology Choices and Rationale</h2>

      <h3>Go for Backend Services</h3>
      <p>
        Go was chosen for all backend services because of its excellent concurrency model
        (goroutines and channels), low memory footprint, fast compilation, and strong standard
        library for HTTP and networking. A single Go binary is easy to deploy in containers without
        runtime dependencies.
      </p>

      <h3>PostgreSQL</h3>
      <p>
        PostgreSQL provides ACID transactions, rich indexing (B-tree, GIN for full-text search, GiST
        for spatial), JSON support, and mature tooling. All relational data (users, guilds,
        channels, messages, roles, permissions) lives in PostgreSQL. Messages use cursor-based
        pagination with indexed <code>created_at</code> columns for efficient scrollback.
      </p>

      <h3>Valkey (Redis-Compatible)</h3>
      <p>
        Valkey is used for three purposes: caching frequently read data (user profiles, channel
        metadata), pub/sub for real-time event distribution between services, and rate-limiter
        state. It is API-compatible with Redis, so any Redis client library works out of the box.
      </p>

      <h3>LiveKit for Voice/Video</h3>
      <p>
        LiveKit is an open-source, scalable WebRTC SFU written in Go. It handles all the complexity
        of WebRTC (DTLS, ICE, SRTP, simulcast, bandwidth estimation) and exposes a simple API for
        room management and token generation. RelayForge maps each voice channel to a LiveKit room
        and issues scoped JWT tokens through the API service.
      </p>

      <h3>S3-Compatible Object Storage</h3>
      <p>
        By targeting the S3 API, RelayForge supports any S3-compatible provider: AWS S3, MinIO
        (self-hosted), Tencent Cloud COS, Alibaba OSS, and Huawei OBS. This gives operators freedom
        to choose infrastructure without code changes. The storage abstraction layer in the API
        service handles presigned URL generation, upload completion callbacks, and bucket routing.
      </p>

      <h3>React + Vite for Front-End</h3>
      <p>
        React 18 with Vite provides fast hot-module replacement during development and optimized
        production builds. Zustand manages client state with minimal boilerplate. Tailwind CSS
        enables rapid UI development with a consistent design system. The monorepo shares type
        definitions (<code>@relayforge/types</code>) between the API client SDK and all front-end
        applications.
      </p>

      <h2>Monorepo Structure</h2>
      <pre>
        <code>{`relay-forge/
  apps/
    web/          # React web client
    desktop/      # Electron desktop app
    admin/        # Admin console
    docs/         # Documentation site (this site)
  packages/
    types/        # Shared TypeScript type definitions
    sdk/          # API client SDK
    crypto/       # E2EE crypto primitives (X3DH, Double Ratchet)
    config/       # Shared configuration constants
    ui/           # Shared React component library
  services/
    api/          # Go REST API service
    realtime/     # Go WebSocket service
    media/        # Go media processing service
  deploy/
    docker/       # Dockerfiles and docker-compose
    k8s/          # Kubernetes manifests
    helm/         # Helm chart
`}</code>
      </pre>

      <h2>Security Architecture</h2>
      <p>
        Authentication uses Argon2id password hashing with OWASP-recommended parameters, JWT
        access/refresh token pairs with HMAC-SHA256 signing, and optional TOTP-based two-factor
        authentication. All inter-service communication stays within the internal network. External
        traffic is terminated at a reverse proxy (nginx / Caddy / cloud load balancer) which handles
        TLS.
      </p>
      <p>
        The permission model is a 32-bit bitfield system attached to roles. Each guild member can
        have multiple roles, and the effective permission set is the union of all role permissions,
        further modified by per-channel overrides. The
        <code>ADMIN</code> bit (bit 31) bypasses all permission checks.
      </p>
    </div>
  );
}
