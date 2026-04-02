export default function SecurityPage() {
  return (
    <div className="space-y-10">
      <div>
        <span className="section-chip">Operations</span>
        <h1>Security policy</h1>
        <p>
          RelayForge is designed for teams that want control over infrastructure without dropping
          the security baseline. This page outlines the disclosure process and the major security
          boundaries in the current stack.
        </p>
      </div>

      <section>
        <h2>Reporting vulnerabilities</h2>
        <div className="warning-box">
          <p className="mb-2 font-semibold">
            Do not open a public GitHub issue for vulnerabilities.
          </p>
          <p className="mb-0">
            Email <code>security@relayforge.example.com</code> with a description, reproduction
            steps, impact, and any suggested remediation. The team target is to acknowledge reports
            within 48 hours.
          </p>
        </div>
      </section>

      <section>
        <h2>Authentication security</h2>
        <ul>
          <li>
            <strong>Password hashing:</strong> Argon2id using OWASP-aligned parameters.
          </li>
          <li>
            <strong>JWT access tokens:</strong> short-lived by default, with HMAC-SHA256 signing.
          </li>
          <li>
            <strong>Refresh token rotation:</strong> each refresh produces a new token and reuse
            invalidates the family.
          </li>
          <li>
            <strong>2FA:</strong> TOTP-based second factor support.
          </li>
          <li>
            <strong>Session management:</strong> users can inspect and revoke active sessions.
          </li>
          <li>
            <strong>Password policy:</strong> minimum length and mixed-character requirements.
          </li>
        </ul>
      </section>

      <section>
        <h2>Authorization</h2>
        <ul>
          <li>Permission checks are enforced server-side.</li>
          <li>RBAC combines guild-level roles and channel-level overrides.</li>
          <li>Guild owner protections prevent accidental privilege loss.</li>
          <li>Administrative actions stay bounded by the owner’s authority.</li>
          <li>API endpoints support configurable rate limiting and burst controls.</li>
        </ul>
      </section>

      <section>
        <h2>Encryption</h2>
        <table>
          <thead>
            <tr>
              <th>Context</th>
              <th>In transit</th>
              <th>At rest</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Direct messages</td>
              <td>TLS plus end-to-end encryption</td>
              <td>Encrypted for participants only</td>
            </tr>
            <tr>
              <td>Guild messages</td>
              <td>TLS</td>
              <td>Server-side storage with access control</td>
            </tr>
            <tr>
              <td>File uploads</td>
              <td>TLS with presigned URLs</td>
              <td>S3-compatible server-side encryption</td>
            </tr>
            <tr>
              <td>Voice and video</td>
              <td>DTLS-SRTP via LiveKit</td>
              <td>Not stored unless recording is enabled</td>
            </tr>
            <tr>
              <td>Passwords</td>
              <td>TLS</td>
              <td>Argon2id hashes only</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Input validation</h2>
        <ul>
          <li>Handlers validate request payloads before business logic executes.</li>
          <li>Database access uses parameterized queries through pgx.</li>
          <li>Uploads are checked against file size and MIME allowlists.</li>
          <li>Optional ClamAV scanning is available for uploaded files.</li>
          <li>Request body limits are enforced at the HTTP layer.</li>
          <li>Chat moderation features can filter blocked or sensitive terms.</li>
        </ul>
      </section>

      <section>
        <h2>Web security headers</h2>
        <p>The recommended reverse-proxy setups ship with a strict baseline header policy.</p>
        <pre>{`X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains`}</pre>
      </section>

      <section>
        <h2>Audit trail</h2>
        <p>
          Administrative and moderation actions are written to the audit log with actor, action,
          target, and timestamp metadata. Logs can be retained and exported for internal review or
          compliance workflows.
        </p>
      </section>
    </div>
  );
}
