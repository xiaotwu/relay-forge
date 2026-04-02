export default function ServerSecurityPage() {
  return (
    <div>
      <h1>Server Security Model</h1>
      <p>
        RelayForge treats the server as the authority for authentication, authorization, and audit.
        Client applications render state, but they do not make access-control decisions.
      </p>

      <h2>Primary mitigations</h2>
      <table>
        <thead>
          <tr>
            <th>Risk</th>
            <th>Mitigation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Brute-force login</td>
            <td>Rate limiting, Argon2id password hashing, and account lockout controls.</td>
          </tr>
          <tr>
            <td>JWT theft</td>
            <td>Short-lived access tokens, refresh rotation, and session revocation.</td>
          </tr>
          <tr>
            <td>Upload abuse</td>
            <td>MIME allowlists, file-size limits, and optional ClamAV scanning.</td>
          </tr>
          <tr>
            <td>Privilege escalation</td>
            <td>Server-side RBAC checks on every operation.</td>
          </tr>
          <tr>
            <td>DM eavesdropping</td>
            <td>Double Ratchet E2EE for direct messages.</td>
          </tr>
        </tbody>
      </table>

      <h2>Trust boundaries</h2>
      <ul>
        <li>Client to API requests are authenticated and authorized on the server.</li>
        <li>API to database access is controlled through application logic and managed secrets.</li>
        <li>API to Valkey is used for ephemeral state, not long-term sensitive storage.</li>
        <li>Media to object storage uses presigned URLs with server-side validation.</li>
        <li>LiveKit tokens are issued with room-specific grants from the media service.</li>
      </ul>

      <h2>Known tradeoffs</h2>
      <ul>
        <li>Guild and channel messages are not E2EE because moderation and search require server access.</li>
        <li>TOTP secrets are encrypted at rest but still server-managed.</li>
        <li>Per-IP rate limiting may need proxy-aware configuration in shared-network deployments.</li>
      </ul>
    </div>
  );
}
