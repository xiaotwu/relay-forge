export default function ConfigReferencePage() {
  return (
    <div>
      <h1>Configuration Reference</h1>
      <p>
        RelayForge is configured entirely through environment variables. In development, these are
        loaded from a <code>.env</code> file in the repository root. In production, set them through
        your deployment platform's secrets management (Docker secrets, Kubernetes Secrets, cloud
        parameter stores, etc.).
      </p>
      <p>
        All variables listed below correspond to the entries in <code>.env.example</code>. Required
        variables are marked and must be set for the application to start.
      </p>

      <h2>General</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Description</th>
            <th>Default</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>RELAY_ENV</code>
            </td>
            <td>
              Application environment. Controls log verbosity, debug endpoints, and error detail.
              Values: <code>development</code>, <code>staging</code>, <code>production</code>.
            </td>
            <td>
              <code>development</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>RELAY_LOG_LEVEL</code>
            </td>
            <td>
              Minimum log level. Values: <code>trace</code>, <code>debug</code>, <code>info</code>,{' '}
              <code>warn</code>, <code>error</code>, <code>fatal</code>.
            </td>
            <td>
              <code>debug</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>RELAY_LOG_FORMAT</code>
            </td>
            <td>
              Log output format. <code>json</code> for structured logging (recommended for
              production), <code>console</code> for human-readable output.
            </td>
            <td>
              <code>json</code>
            </td>
            <td>No</td>
          </tr>
        </tbody>
      </table>

      <h2>API Service</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Description</th>
            <th>Default</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>API_HOST</code>
            </td>
            <td>
              Network interface to bind the API server to. Use <code>0.0.0.0</code> for all
              interfaces.
            </td>
            <td>
              <code>0.0.0.0</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>API_PORT</code>
            </td>
            <td>TCP port for the REST API server.</td>
            <td>
              <code>8080</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>API_BASE_URL</code>
            </td>
            <td>
              The public-facing base URL of the API. Used for generating links in emails and invite
              URLs.
            </td>
            <td>
              <code>http://localhost:8080</code>
            </td>
            <td>Yes (prod)</td>
          </tr>
          <tr>
            <td>
              <code>API_CORS_ORIGINS</code>
            </td>
            <td>
              Comma-separated list of allowed CORS origins. Must include the web client's URL.
            </td>
            <td>
              <code>http://localhost:3000,http://localhost:5173,http://localhost:5174</code>
            </td>
            <td>Yes (prod)</td>
          </tr>
        </tbody>
      </table>

      <h2>Realtime Service</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Description</th>
            <th>Default</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>REALTIME_HOST</code>
            </td>
            <td>Network interface for the WebSocket server.</td>
            <td>
              <code>0.0.0.0</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>REALTIME_PORT</code>
            </td>
            <td>TCP port for WebSocket connections.</td>
            <td>
              <code>8081</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>REALTIME_MAX_CONNECTIONS</code>
            </td>
            <td>
              Maximum concurrent WebSocket connections. Set based on available memory (~50 KB per
              connection).
            </td>
            <td>
              <code>10000</code>
            </td>
            <td>No</td>
          </tr>
        </tbody>
      </table>

      <h2>Media Service</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Description</th>
            <th>Default</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>MEDIA_HOST</code>
            </td>
            <td>Network interface for the media service.</td>
            <td>
              <code>0.0.0.0</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>MEDIA_PORT</code>
            </td>
            <td>TCP port for the media service.</td>
            <td>
              <code>8082</code>
            </td>
            <td>No</td>
          </tr>
        </tbody>
      </table>

      <h2>Database (PostgreSQL)</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Description</th>
            <th>Default</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>DB_HOST</code>
            </td>
            <td>PostgreSQL server hostname or IP address.</td>
            <td>
              <code>localhost</code>
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>DB_PORT</code>
            </td>
            <td>PostgreSQL server port.</td>
            <td>
              <code>5432</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>DB_USER</code>
            </td>
            <td>Database username.</td>
            <td>
              <code>relayforge</code>
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>DB_PASSWORD</code>
            </td>
            <td>Database password. Use a strong, randomly generated value in production.</td>
            <td>
              <code>relayforge_dev</code>
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>DB_NAME</code>
            </td>
            <td>Database name.</td>
            <td>
              <code>relayforge</code>
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>DB_SSL_MODE</code>
            </td>
            <td>
              PostgreSQL SSL mode. Values: <code>disable</code>, <code>require</code>,{' '}
              <code>verify-ca</code>, <code>verify-full</code>. Use <code>require</code> or stricter
              in production.
            </td>
            <td>
              <code>disable</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>DB_MAX_OPEN_CONNS</code>
            </td>
            <td>Maximum number of open database connections in the pool.</td>
            <td>
              <code>25</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>DB_MAX_IDLE_CONNS</code>
            </td>
            <td>Maximum number of idle connections retained in the pool.</td>
            <td>
              <code>5</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>DB_CONN_MAX_LIFETIME</code>
            </td>
            <td>
              Maximum lifetime of a database connection in seconds. Prevents stale connections
              behind load balancers.
            </td>
            <td>
              <code>300</code>
            </td>
            <td>No</td>
          </tr>
        </tbody>
      </table>

      <h2>Valkey / Redis</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Description</th>
            <th>Default</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>VALKEY_HOST</code>
            </td>
            <td>Valkey (or Redis) server hostname.</td>
            <td>
              <code>localhost</code>
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>VALKEY_PORT</code>
            </td>
            <td>Valkey server port.</td>
            <td>
              <code>6379</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>VALKEY_PASSWORD</code>
            </td>
            <td>Valkey authentication password. Leave empty if authentication is not enabled.</td>
            <td>
              <em>empty</em>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>VALKEY_DB</code>
            </td>
            <td>
              Valkey database index (0-15). Use different indexes to isolate test vs development
              data.
            </td>
            <td>
              <code>0</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>VALKEY_POOL_SIZE</code>
            </td>
            <td>Connection pool size for Valkey. Each service creates its own pool.</td>
            <td>
              <code>10</code>
            </td>
            <td>No</td>
          </tr>
        </tbody>
      </table>

      <h2>Authentication</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Description</th>
            <th>Default</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>AUTH_JWT_SECRET</code>
            </td>
            <td>
              HMAC-SHA256 signing key for JWTs. Must be at least 32 characters. Generate with{' '}
              <code>openssl rand -hex 32</code>.
            </td>
            <td>
              <code>change-me-...</code>
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>AUTH_JWT_ACCESS_TTL</code>
            </td>
            <td>
              Access token lifetime. Format: Go duration string (e.g., <code>15m</code>,{' '}
              <code>1h</code>).
            </td>
            <td>
              <code>15m</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>AUTH_JWT_REFRESH_TTL</code>
            </td>
            <td>
              Refresh token lifetime. Longer durations reduce login frequency but increase risk if
              tokens are stolen.
            </td>
            <td>
              <code>7d</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>AUTH_BCRYPT_COST</code>
            </td>
            <td>
              Legacy configuration field retained for backward compatibility. The current password
              hashing implementation uses Argon2id, so this value is presently ignored.
            </td>
            <td>
              <code>12</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>AUTH_PASSWORD_MIN_LENGTH</code>
            </td>
            <td>Minimum password length enforced during registration and password changes.</td>
            <td>
              <code>8</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>AUTH_MAX_DEVICES_PER_USER</code>
            </td>
            <td>
              Maximum number of concurrent sessions (devices) per user. Oldest sessions are revoked
              when the limit is exceeded.
            </td>
            <td>
              <code>10</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>AUTH_TOTP_ISSUER</code>
            </td>
            <td>The issuer name displayed in authenticator apps when setting up TOTP 2FA.</td>
            <td>
              <code>RelayForge</code>
            </td>
            <td>No</td>
          </tr>
        </tbody>
      </table>

      <h2>Email (SMTP)</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Description</th>
            <th>Default</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>SMTP_HOST</code>
            </td>
            <td>SMTP server hostname. For development, use MailHog or Mailpit on localhost.</td>
            <td>
              <code>localhost</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>SMTP_PORT</code>
            </td>
            <td>SMTP server port. Common values: 25, 465 (SSL), 587 (STARTTLS), 1025 (MailHog).</td>
            <td>
              <code>1025</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>SMTP_USER</code>
            </td>
            <td>SMTP authentication username.</td>
            <td>
              <em>empty</em>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>SMTP_PASSWORD</code>
            </td>
            <td>SMTP authentication password.</td>
            <td>
              <em>empty</em>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>SMTP_FROM</code>
            </td>
            <td>The "From" address for outgoing emails.</td>
            <td>
              <code>noreply@relayforge.local</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>SMTP_TLS</code>
            </td>
            <td>
              Enable TLS for the SMTP connection. Set to <code>true</code> for production SMTP
              servers.
            </td>
            <td>
              <code>false</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>EMAIL_VERIFICATION_ENABLED</code>
            </td>
            <td>
              Require email verification on registration. Enable in production to prevent spam
              accounts.
            </td>
            <td>
              <code>false</code>
            </td>
            <td>No</td>
          </tr>
        </tbody>
      </table>

      <h2>Object Storage (S3-Compatible)</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Description</th>
            <th>Default</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>S3_ENDPOINT</code>
            </td>
            <td>
              S3-compatible endpoint URL. For AWS S3 use the regional endpoint. For MinIO, point to
              the MinIO server.
            </td>
            <td>
              <code>http://localhost:9000</code>
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>S3_REGION</code>
            </td>
            <td>S3 region. Required by the AWS SDK even for non-AWS providers.</td>
            <td>
              <code>us-east-1</code>
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>S3_ACCESS_KEY</code>
            </td>
            <td>S3 access key ID.</td>
            <td>
              <code>minioadmin</code>
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>S3_SECRET_KEY</code>
            </td>
            <td>S3 secret access key.</td>
            <td>
              <code>minioadmin</code>
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>S3_BUCKET_UPLOADS</code>
            </td>
            <td>Bucket name for user-uploaded files (attachments, documents).</td>
            <td>
              <code>relay-uploads</code>
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>S3_BUCKET_AVATARS</code>
            </td>
            <td>Bucket name for user and guild avatar images.</td>
            <td>
              <code>relay-avatars</code>
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>S3_BUCKET_EMOJI</code>
            </td>
            <td>Bucket name for custom guild emoji.</td>
            <td>
              <code>relay-emoji</code>
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>S3_USE_PATH_STYLE</code>
            </td>
            <td>
              Use path-style addressing (<code>endpoint/bucket/key</code>) instead of virtual-hosted
              style. Required for MinIO; set to <code>false</code> for AWS S3.
            </td>
            <td>
              <code>true</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>S3_PRESIGN_EXPIRY</code>
            </td>
            <td>
              Presigned URL expiry time in seconds. Controls how long download/upload URLs remain
              valid.
            </td>
            <td>
              <code>3600</code>
            </td>
            <td>No</td>
          </tr>
        </tbody>
      </table>

      <h2>LiveKit</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Description</th>
            <th>Default</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>LIVEKIT_HOST</code>
            </td>
            <td>LiveKit server hostname (used for server-side API calls).</td>
            <td>
              <code>localhost</code>
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>LIVEKIT_PORT</code>
            </td>
            <td>LiveKit server port.</td>
            <td>
              <code>7880</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>LIVEKIT_API_KEY</code>
            </td>
            <td>LiveKit API key for generating room tokens.</td>
            <td>
              <code>devkey</code>
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>LIVEKIT_API_SECRET</code>
            </td>
            <td>LiveKit API secret for signing room tokens.</td>
            <td>
              <code>devsecret</code>
            </td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>
              <code>LIVEKIT_URL</code>
            </td>
            <td>
              LiveKit WebSocket URL that clients connect to. Must be reachable from the browser. Use{' '}
              <code>wss://</code> in production.
            </td>
            <td>
              <code>ws://localhost:7880</code>
            </td>
            <td>Yes</td>
          </tr>
        </tbody>
      </table>

      <h2>Antivirus (ClamAV)</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Description</th>
            <th>Default</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>ANTIVIRUS_ENABLED</code>
            </td>
            <td>Enable antivirus scanning of uploaded files. Requires a running ClamAV daemon.</td>
            <td>
              <code>false</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>ANTIVIRUS_HOST</code>
            </td>
            <td>ClamAV daemon hostname.</td>
            <td>
              <code>localhost</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>ANTIVIRUS_PORT</code>
            </td>
            <td>ClamAV daemon port (clamd TCP socket).</td>
            <td>
              <code>3310</code>
            </td>
            <td>No</td>
          </tr>
        </tbody>
      </table>

      <h2>Rate Limiting</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Description</th>
            <th>Default</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>RATE_LIMIT_ENABLED</code>
            </td>
            <td>Enable per-IP rate limiting on the API. Strongly recommended for production.</td>
            <td>
              <code>true</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>RATE_LIMIT_REQUESTS_PER_SECOND</code>
            </td>
            <td>Sustained request rate per IP address per second.</td>
            <td>
              <code>10</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>RATE_LIMIT_BURST</code>
            </td>
            <td>Maximum burst size above the sustained rate. Allows short bursts of activity.</td>
            <td>
              <code>20</code>
            </td>
            <td>No</td>
          </tr>
        </tbody>
      </table>

      <h2>Upload Limits</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Description</th>
            <th>Default</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>UPLOAD_MAX_FILE_SIZE</code>
            </td>
            <td>Maximum file size in bytes. Default is 50 MB (52,428,800 bytes).</td>
            <td>
              <code>52428800</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>UPLOAD_ALLOWED_MIME_TYPES</code>
            </td>
            <td>
              Comma-separated list of allowed MIME types. Files with unlisted types are rejected.
            </td>
            <td>
              <em>See .env.example</em>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>UPLOAD_CHUNK_SIZE</code>
            </td>
            <td>Chunk size in bytes for multipart uploads. Default is 5 MB.</td>
            <td>
              <code>5242880</code>
            </td>
            <td>No</td>
          </tr>
        </tbody>
      </table>

      <h2>OpenTelemetry</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Description</th>
            <th>Default</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>OTEL_ENABLED</code>
            </td>
            <td>
              Enable OpenTelemetry tracing. When enabled, services export traces via OTLP/gRPC.
            </td>
            <td>
              <code>false</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>OTEL_EXPORTER_OTLP_ENDPOINT</code>
            </td>
            <td>OTLP collector endpoint. Common targets: Jaeger, Tempo, Honeycomb, Datadog.</td>
            <td>
              <code>http://localhost:4317</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>OTEL_SERVICE_NAME</code>
            </td>
            <td>
              Base service name for traces. Each service appends its type (e.g.,{' '}
              <code>relayforge-api</code>).
            </td>
            <td>
              <code>relayforge</code>
            </td>
            <td>No</td>
          </tr>
        </tbody>
      </table>

      <h2>Prometheus Metrics</h2>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Description</th>
            <th>Default</th>
            <th>Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>METRICS_ENABLED</code>
            </td>
            <td>Enable Prometheus metrics endpoint on each service.</td>
            <td>
              <code>true</code>
            </td>
            <td>No</td>
          </tr>
          <tr>
            <td>
              <code>METRICS_PORT</code>
            </td>
            <td>
              TCP port for the <code>/metrics</code> endpoint. Each service uses a different port to
              avoid conflicts when running on the same host.
            </td>
            <td>
              <code>9090</code>
            </td>
            <td>No</td>
          </tr>
        </tbody>
      </table>

      <h2>Tips</h2>
      <ul>
        <li>
          Variables marked "Required" must be set for the application to function correctly. Others
          have sensible defaults.
        </li>
        <li>
          Variables marked "Yes (prod)" are only strictly required in production; the development
          defaults work for local use.
        </li>
        <li>
          Never commit secrets (<code>AUTH_JWT_SECRET</code>, <code>DB_PASSWORD</code>,{' '}
          <code>S3_SECRET_KEY</code>, etc.) to version control. Use environment-specific secret
          management.
        </li>
        <li>
          Duration strings follow Go's <code>time.ParseDuration</code> format: <code>15m</code>,{' '}
          <code>1h</code>, <code>7d</code> (days are a custom extension).
        </li>
        <li>
          Boolean values accept <code>true</code>/<code>false</code>, <code>1</code>/<code>0</code>,
          or <code>yes</code>/<code>no</code>.
        </li>
      </ul>
    </div>
  );
}
