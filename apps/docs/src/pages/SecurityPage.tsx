export default function SecurityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-rf-primary text-3xl font-bold">Security Policy</h1>
        <p className="text-rf-secondary mt-2">
          RelayForge takes security seriously. This page describes our security design, responsible
          disclosure process, and the measures we take to protect user data.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Reporting Vulnerabilities</h2>
        <div className="rounded-lg border border-yellow-600/30 bg-yellow-900/10 p-4">
          <p className="font-semibold text-yellow-400">
            Do not open a public GitHub issue for security vulnerabilities.
          </p>
          <p className="text-rf-secondary mt-2">
            Email{' '}
            <code className="bg-rf-elevated rounded px-2 py-0.5 text-sm text-emerald-400">
              security@relayforge.example.com
            </code>{' '}
            with a description, reproduction steps, potential impact, and suggested fix if
            available. We will acknowledge within 48 hours.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Authentication Security</h2>
        <ul className="text-rf-secondary list-inside list-disc space-y-2">
          <li>
            <span className="text-rf-primary font-medium">Password hashing:</span> Argon2id with
            OWASP-recommended parameters (64 MB memory, 1 iteration, 4 threads, 32-byte key)
          </li>
          <li>
            <span className="text-rf-primary font-medium">JWT tokens:</span> Short-lived access
            tokens (15 min default) with HMAC-SHA256 signing
          </li>
          <li>
            <span className="text-rf-primary font-medium">Refresh token rotation:</span> Each
            refresh generates a new token; reuse of an old token revokes the entire family
          </li>
          <li>
            <span className="text-rf-primary font-medium">2FA:</span> TOTP-based two-factor
            authentication with standard 6-digit codes
          </li>
          <li>
            <span className="text-rf-primary font-medium">Session management:</span> Users can view
            active sessions and force-logout any device
          </li>
          <li>
            <span className="text-rf-primary font-medium">Password strength:</span> Minimum 8
            characters, requires uppercase, lowercase, digit, and special character
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Authorization</h2>
        <ul className="text-rf-secondary list-inside list-disc space-y-2">
          <li>
            All permission checks are enforced server-side — the client never determines access
          </li>
          <li>RBAC with guild-level roles and channel-level permission overrides</li>
          <li>Owner protection: guild owners cannot be removed or demoted</li>
          <li>Admin boundary: admins cannot escalate privileges beyond the owner's authority</li>
          <li>Rate limiting on all API endpoints (configurable per-second and burst limits)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Encryption</h2>
        <div className="overflow-x-auto">
          <table className="text-rf-secondary w-full text-left text-sm">
            <thead className="border-rf-elevated text-rf-primary border-b">
              <tr>
                <th className="pb-3 pr-6 font-semibold">Context</th>
                <th className="pb-3 pr-6 font-semibold">In Transit</th>
                <th className="pb-3 font-semibold">At Rest</th>
              </tr>
            </thead>
            <tbody className="divide-rf-elevated divide-y">
              <tr>
                <td className="py-2 pr-6">Direct messages</td>
                <td className="py-2 pr-6">TLS + E2EE (Double Ratchet)</td>
                <td className="py-2">Encrypted (only sender/recipient can read)</td>
              </tr>
              <tr>
                <td className="py-2 pr-6">Guild messages</td>
                <td className="py-2 pr-6">TLS</td>
                <td className="py-2">Server-side storage with access control</td>
              </tr>
              <tr>
                <td className="py-2 pr-6">File uploads</td>
                <td className="py-2 pr-6">TLS + presigned URLs</td>
                <td className="py-2">S3 server-side encryption (configurable)</td>
              </tr>
              <tr>
                <td className="py-2 pr-6">Voice/video</td>
                <td className="py-2 pr-6">DTLS-SRTP (via LiveKit)</td>
                <td className="py-2">Not stored (unless recording enabled)</td>
              </tr>
              <tr>
                <td className="py-2 pr-6">Passwords</td>
                <td className="py-2 pr-6">TLS</td>
                <td className="py-2">Argon2id hashed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Input Validation</h2>
        <ul className="text-rf-secondary list-inside list-disc space-y-2">
          <li>All API inputs are validated at the handler level before processing</li>
          <li>SQL injection prevention through parameterized queries (pgx)</li>
          <li>File upload MIME type validation against an allowlist</li>
          <li>Optional antivirus scanning via ClamAV for uploaded files</li>
          <li>Request body size limits enforced at the HTTP server level</li>
          <li>Sensitive word filtering for chat content</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Web Security Headers</h2>
        <p className="text-rf-secondary">
          The recommended reverse proxy configurations include security headers:
        </p>
        <pre className="bg-rf-elevated text-rf-primary overflow-x-auto rounded-lg p-4 text-sm">
          {`X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains`}
        </pre>
      </section>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Audit Trail</h2>
        <p className="text-rf-secondary">
          All administrative and moderation actions are recorded in the audit log with the actor,
          action type, target, and timestamp. Audit logs support configurable retention windows and
          can be exported for compliance review.
        </p>
      </section>
    </div>
  );
}
