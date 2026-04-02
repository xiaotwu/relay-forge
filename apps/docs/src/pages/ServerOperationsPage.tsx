export default function ServerOperationsPage() {
  return (
    <div>
      <h1>Server Operations</h1>
      <p>
        The default self-hosted path starts in <code>infra/docker</code>. Binary packaging is the
        primary release target, but the repo also ships a Docker-oriented stack for local and
        production-style deployment.
      </p>

      <h2>Bring up the default stack</h2>
      <pre>{`cp .env.example .env
make deploy-up
make deploy-migrate`}</pre>

      <h2>Production readiness</h2>
      <ul>
        <li>Use strong secrets for JWT, database, Valkey, storage, and LiveKit credentials.</li>
        <li>Run behind TLS with restricted public ports and reviewed CORS settings.</li>
        <li>Set container or pod resource limits, restart policies, and health checks.</li>
        <li>Enable structured logs, metrics scraping, and alerting for critical failures.</li>
        <li>Test backups, restoration, and end-to-end smoke flows before release.</li>
      </ul>

      <h2>Release checklist</h2>
      <ul>
        <li>Run <code>make test</code> and verify migration compatibility.</li>
        <li>Build amd64 and arm64 Docker images successfully.</li>
        <li>Update release metadata, notes, and migration guidance.</li>
        <li>Tag the release with <code>vX.Y.Z</code> and push the tag.</li>
        <li>Verify published artifacts, docs updates, and early post-release monitoring.</li>
      </ul>

      <h2>Included assets</h2>
      <ul>
        <li>
          <code>infra/docker</code> contains Dockerfiles and compose stacks.
        </li>
        <li>Reverse-proxy and observability helper configs ship alongside the Docker setup.</li>
        <li>
          <code>scripts/backup.sh</code> and <code>scripts/restore.sh</code> support operational
          workflows.
        </li>
      </ul>
    </div>
  );
}
