export default function ServerArchitecturePage() {
  return (
    <div>
      <h1>Server Architecture</h1>
      <p>
        RelayForge is designed as a modular monolith with separate realtime and media services. The
        goal is to keep small-team deployment simple while preserving clear boundaries for scaling.
      </p>

      <h2>Core services</h2>
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Responsibility</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>api</code>
            </td>
            <td>REST API, auth, RBAC, guilds, channels, messages, admin, migrations.</td>
          </tr>
          <tr>
            <td>
              <code>realtime</code>
            </td>
            <td>WebSocket delivery, presence, typing indicators, and fan-out.</td>
          </tr>
          <tr>
            <td>
              <code>media</code>
            </td>
            <td>Uploads, S3-compatible storage, MIME validation, and LiveKit room handling.</td>
          </tr>
          <tr>
            <td>
              <code>worker</code>
            </td>
            <td>Background jobs, cleanups, archival, and scheduled maintenance work.</td>
          </tr>
        </tbody>
      </table>

      <h2>Supporting infrastructure</h2>
      <ul>
        <li>
          <code>PostgreSQL</code> stores users, sessions, guilds, channels, messages, roles, and
          audit data.
        </li>
        <li>
          <code>Valkey</code> handles ephemeral presence state, pub/sub, and queues.
        </li>
        <li>
          <code>S3-compatible storage</code> stores uploaded media assets and blobs.
        </li>
        <li>
          <code>LiveKit</code> powers voice and video room transport.
        </li>
      </ul>

      <h2>Architectural principles</h2>
      <ul>
        <li>Server-side authority for permissions and access control.</li>
        <li>Cloud-portable primitives instead of vendor-specific backend services.</li>
        <li>Observability by default through logs, traces, metrics, and health endpoints.</li>
        <li>E2EE only for DMs, while guild content remains searchable and moderatable.</li>
      </ul>

      <div className="callout">
        The client and server repos are intentionally decoupled. Their shared contract is endpoint
        configuration, not a shared filesystem or build graph.
      </div>
    </div>
  );
}
