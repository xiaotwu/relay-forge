export default function ChangelogPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-rf-primary text-3xl font-bold">Changelog</h1>
        <p className="text-rf-secondary mt-2">
          All notable changes to RelayForge will be documented here. This project follows{' '}
          <a
            href="https://semver.org"
            className="text-emerald-400 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Semantic Versioning
          </a>{' '}
          and the{' '}
          <a
            href="https://keepachangelog.com"
            className="text-emerald-400 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Keep a Changelog
          </a>{' '}
          format.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-rf-primary text-2xl font-semibold">Format</h2>
        <p className="text-rf-secondary">Each release entry includes:</p>
        <ul className="text-rf-secondary list-inside list-disc space-y-1 pl-4">
          <li>
            <span className="text-rf-primary font-medium">Added</span> — new features
          </li>
          <li>
            <span className="text-rf-primary font-medium">Changed</span> — changes to existing
            functionality
          </li>
          <li>
            <span className="text-rf-primary font-medium">Deprecated</span> — features that will be
            removed
          </li>
          <li>
            <span className="text-rf-primary font-medium">Removed</span> — removed features
          </li>
          <li>
            <span className="text-rf-primary font-medium">Fixed</span> — bug fixes
          </li>
          <li>
            <span className="text-rf-primary font-medium">Security</span> — vulnerability fixes
          </li>
        </ul>
      </section>

      <section className="space-y-6">
        <div className="border-l-2 border-emerald-500 pl-6">
          <h3 className="text-rf-primary text-xl font-semibold">v0.1.0 — Initial Release</h3>
          <p className="text-rf-secondary mt-1 text-sm">Unreleased</p>

          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-semibold text-emerald-400">Added</h4>
              <ul className="text-rf-secondary mt-1 list-inside list-disc space-y-1 pl-2">
                <li>User registration and authentication with JWT</li>
                <li>Two-factor authentication (TOTP)</li>
                <li>Device and session management</li>
                <li>Guild creation, editing, and membership</li>
                <li>Text, voice, forum, and announcement channels</li>
                <li>Categories for channel organization</li>
                <li>Full RBAC with guild roles and channel permission overrides</li>
                <li>Rich text messaging with Markdown support</li>
                <li>Message replies, threads, and pinning</li>
                <li>Emoji reactions and custom emoji/stickers</li>
                <li>File uploads with presigned URLs and MIME validation</li>
                <li>Direct messages with end-to-end encryption (X3DH + Double Ratchet)</li>
                <li>Voice channels via LiveKit integration</li>
                <li>P2P calls, group calls, and video meetings</li>
                <li>Screen sharing and recording support</li>
                <li>Moderation tools: mute, kick, ban, word filters, audit logs</li>
                <li>Abuse reporting system</li>
                <li>System admin console</li>
                <li>Web application (React + Vite)</li>
                <li>Desktop application (Tauri 2)</li>
                <li>Docker Compose deployment (dev and production)</li>
                <li>Kubernetes manifests and Helm chart</li>
                <li>Terraform modules for multi-cloud deployment</li>
                <li>Reverse proxy examples (Nginx, Caddy, Traefik)</li>
                <li>OpenTelemetry and Prometheus observability</li>
                <li>Structured logging with zerolog</li>
                <li>GitHub Pages documentation site</li>
                <li>CI/CD pipelines with GitHub Actions</li>
                <li>Backup and restore scripts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
