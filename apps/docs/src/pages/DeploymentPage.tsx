export default function DeploymentPage() {
  return (
    <div>
      <h1>Deployment Guide</h1>
      <p>
        This guide covers deploying RelayForge to production. It assumes you have completed the
        Quick Start guide and are familiar with the service architecture. RelayForge supports Docker
        Compose for single-node deployments and Kubernetes (with a Helm chart) for multi-node,
        high-availability setups.
      </p>

      <h2>Docker Compose Production Deployment</h2>
      <p>
        The production Docker Compose file is located at{' '}
        <code>infra/docker/docker-compose.yml</code>. It is now the recommended single-host
        deployment path and includes PostgreSQL, Valkey, MinIO, and LiveKit so a direct user does
        not need to assemble extra infrastructure before bringing the stack up.
      </p>

      <h3>Step 1 &mdash; Prepare the Host</h3>
      <ul>
        <li>A Linux server with Docker 24+ and Docker Compose v2 installed.</li>
        <li>Minimum 2 vCPUs and 4 GB RAM for small deployments (up to ~100 concurrent users).</li>
        <li>
          Recommended 4 vCPUs and 8 GB RAM for medium deployments (up to ~1,000 concurrent users).
        </li>
        <li>
          SSD storage for the PostgreSQL data volume (minimum 20 GB, more for media-heavy usage).
        </li>
        <li>A domain name with DNS configured to point to the server's IP address.</li>
      </ul>

      <h3>Step 2 &mdash; Configure Environment Variables</h3>
      <pre>
        <code>{`# Clone the repository
git clone https://github.com/xiaotwu/relay-forge.git
cd relay-forge

# Create and edit the production environment file
cp .env.example .env.production`}</code>
      </pre>
      <p>Critical variables to change for production:</p>
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>RELAY_ENV</code>
            </td>
            <td>
              Set to <code>production</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>AUTH_JWT_SECRET</code>
            </td>
            <td>
              Generate a random 64-character string: <code>openssl rand -hex 32</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>DB_PASSWORD</code>
            </td>
            <td>Use a strong, randomly generated password</td>
          </tr>
          <tr>
            <td>
              <code>S3_ACCESS_KEY</code> / <code>S3_SECRET_KEY</code>
            </td>
            <td>Change from default MinIO credentials</td>
          </tr>
          <tr>
            <td>
              <code>LIVEKIT_API_KEY</code> / <code>LIVEKIT_API_SECRET</code>
            </td>
            <td>Generate unique credentials for LiveKit</td>
          </tr>
          <tr>
            <td>
              <code>API_BASE_URL</code>
            </td>
            <td>
              Set to your public URL, e.g. <code>https://api.example.com</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>API_CORS_ORIGINS</code>
            </td>
            <td>
              Set to your frontend domain, e.g. <code>https://chat.example.com</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>SMTP_*</code>
            </td>
            <td>Configure real SMTP credentials for email verification</td>
          </tr>
          <tr>
            <td>
              <code>EMAIL_VERIFICATION_ENABLED</code>
            </td>
            <td>
              Set to <code>true</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>AUTH_PASSWORD_MIN_LENGTH</code>
            </td>
            <td>Review your password policy before exposing the instance publicly</td>
          </tr>
        </tbody>
      </table>

      <h3>Step 3 &mdash; Start the Stack</h3>
      <pre>
        <code>{`make deploy-up ENV_FILE=.env.production`}</code>
      </pre>

      <h3>Step 4 &mdash; Run Migrations</h3>
      <pre>
        <code>{`make deploy-migrate ENV_FILE=.env.production`}</code>
      </pre>

      <h3>Step 5 &mdash; Verify</h3>
      <pre>
        <code>{`# Check all containers are healthy
docker compose -f infra/docker/docker-compose.yml --env-file .env.production ps

# Check API health
curl http://localhost:8080/healthz`}</code>
      </pre>

      <h2>SSL/TLS Setup</h2>
      <p>
        RelayForge services do not terminate TLS themselves. You must place a reverse proxy in front
        of them that handles TLS termination. This is the recommended approach because it
        centralises certificate management, enables HTTP/2, and simplifies the application layer.
      </p>

      <h2>Reverse Proxy Configuration</h2>

      <h3>Nginx</h3>
      <pre>
        <code>{`# /etc/nginx/sites-available/relayforge
upstream api {
    server 127.0.0.1:8080;
}

upstream realtime {
    server 127.0.0.1:8081;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    ssl_certificate /etc/letsencrypt/live/api.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.example.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;

    # API routes
    location / {
        proxy_pass http://api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 50M;
    }
}

server {
    listen 443 ssl http2;
    server_name ws.example.com;

    ssl_certificate /etc/letsencrypt/live/ws.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ws.example.com/privkey.pem;

    location / {
        proxy_pass http://realtime;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.example.com ws.example.com;
    return 301 https://$host$request_uri;
}`}</code>
      </pre>

      <h3>Caddy</h3>
      <p>Caddy automatically provisions and renews TLS certificates via Let's Encrypt:</p>
      <pre>
        <code>{`# Caddyfile
api.example.com {
    reverse_proxy localhost:8080
    header {
        Strict-Transport-Security "max-age=63072000; includeSubDomains"
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
    }
}

ws.example.com {
    reverse_proxy localhost:8081
}

chat.example.com {
    reverse_proxy localhost:3000
    encode gzip
}`}</code>
      </pre>

      <h3>Traefik</h3>
      <p>
        If you use Traefik as an ingress controller or edge router, add labels to the Docker Compose
        services:
      </p>
      <pre>
        <code>{`# In infra/docker/docker-compose.yml, add to the api service:
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.api.rule=Host(\`api.example.com\`)"
  - "traefik.http.routers.api.tls.certresolver=letsencrypt"
  - "traefik.http.services.api.loadbalancer.server.port=8080"

# For the realtime service (WebSocket):
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.realtime.rule=Host(\`ws.example.com\`)"
  - "traefik.http.routers.realtime.tls.certresolver=letsencrypt"
  - "traefik.http.services.realtime.loadbalancer.server.port=8081"`}</code>
      </pre>

      <h2>Kubernetes Deployment</h2>
      <p>
        For high-availability deployments, RelayForge provides a Helm chart at{' '}
        <code>infra/helm/relay-forge/</code>.
      </p>

      <h3>Prerequisites</h3>
      <ul>
        <li>
          A Kubernetes cluster (1.27+) with <code>kubectl</code> configured.
        </li>
        <li>Helm 3.12+ installed.</li>
        <li>A managed PostgreSQL instance (or an in-cluster operator like CloudNativePG).</li>
        <li>A managed Redis/Valkey instance (or an in-cluster deployment).</li>
        <li>An S3-compatible object storage endpoint.</li>
        <li>An Ingress controller (Nginx Ingress, Traefik, or cloud-specific).</li>
      </ul>

      <h3>Helm Chart Installation</h3>
      <pre>
        <code>{`# Add the Helm repository (if published)
# helm repo add relayforge https://charts.relayforge.dev
# helm repo update

# Or install from the local chart
helm install relayforge infra/helm/relay-forge/ \\
  --namespace relayforge \\
  --create-namespace \\
  --values infra/helm/values-production.yaml`}</code>
      </pre>

      <h3>Key Helm Values</h3>
      <pre>
        <code>{`# infra/helm/values-production.yaml
global:
  env: production
  domain: example.com

api:
  replicas: 3
  resources:
    requests:
      cpu: 250m
      memory: 256Mi
    limits:
      cpu: "1"
      memory: 512Mi

realtime:
  replicas: 2
  resources:
    requests:
      cpu: 250m
      memory: 256Mi

media:
  replicas: 2
  resources:
    requests:
      cpu: 500m
      memory: 512Mi

worker:
  replicas: 2

database:
  external: true
  host: relayforge-db.xxx.rds.amazonaws.com
  port: 5432
  name: relayforge
  existingSecret: relayforge-db-credentials

valkey:
  external: true
  host: relayforge-cache.xxx.cache.amazonaws.com
  port: 6379

s3:
  endpoint: https://s3.amazonaws.com
  region: us-east-1
  existingSecret: relayforge-s3-credentials

ingress:
  enabled: true
  className: nginx
  tls: true
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod`}</code>
      </pre>

      <h2>ARM64 Support</h2>
      <p>
        All RelayForge container images are published as multi-architecture manifests supporting
        both <code>linux/amd64</code> and <code>linux/arm64</code>. This means the same image tags
        work on:
      </p>
      <ul>
        <li>AWS Graviton instances (t4g, m7g, c7g families)</li>
        <li>Ampere Altra on Oracle Cloud and Google Cloud</li>
        <li>Apple Silicon Macs running Docker Desktop</li>
        <li>Raspberry Pi 4/5 (with 4 GB+ RAM)</li>
      </ul>
      <p>
        No configuration changes are needed &mdash; Docker and Kubernetes automatically pull the
        correct architecture variant.
      </p>

      <h2>Air-Gapped Deployment</h2>
      <p>
        For environments without internet access, you can deploy RelayForge using pre-downloaded
        images and assets:
      </p>

      <h3>Step 1 &mdash; Save Images on a Connected Machine</h3>
      <pre>
        <code>{`# Pull all required images
docker compose -f infra/docker/docker-compose.yml --env-file .env.production pull

# Save to a tarball
docker save -o relayforge-images.tar \\
  relayforge/api:latest \\
  relayforge/realtime:latest \\
  relayforge/media:latest \\
  relayforge/worker:latest \\
  relayforge/web:latest \\
  postgres:16-alpine \\
  valkey/valkey:8-alpine \\
  minio/minio:latest \\
  livekit/livekit-server:latest`}</code>
      </pre>

      <h3>Step 2 &mdash; Transfer and Load on the Air-Gapped Host</h3>
      <pre>
        <code>{`# Transfer relayforge-images.tar to the target host via USB, SCP over local network, etc.

# Load images into the local Docker daemon
docker load -i relayforge-images.tar`}</code>
      </pre>

      <h3>Step 3 &mdash; Deploy Normally</h3>
      <p>
        The Docker Compose file will find the images in the local daemon and skip any network pulls.
        Ensure your <code>.env.production</code> file does not reference external services you
        cannot reach.
      </p>

      <h2>Backup Strategy</h2>
      <p>At minimum, back up these two data stores regularly:</p>
      <ul>
        <li>
          <strong>PostgreSQL</strong> &mdash; Use <code>pg_dump</code> or continuous archiving
          (WAL-G, pgBackRest) for point-in-time recovery.
        </li>
        <li>
          <strong>S3 buckets</strong> &mdash; Enable versioning on your S3 buckets or use{' '}
          <code>mc mirror</code> to replicate MinIO data to a backup location.
        </li>
      </ul>
      <p>
        Valkey data is ephemeral (cache, presence, pub/sub) and does not require backup. LiveKit
        state is transient and reconstructed on restart.
      </p>

      <h2>Upgrading</h2>
      <pre>
        <code>{`# Pull new images
docker compose -f infra/docker/docker-compose.yml --env-file .env.production pull

# Apply any new migrations
docker compose -f infra/docker/docker-compose.yml \\
  --env-file .env.production \\
  exec api /app/migrate up

# Restart services with zero-downtime rolling restart
docker compose -f infra/docker/docker-compose.yml \\
  --env-file .env.production up -d`}</code>
      </pre>

      <h2>Next Steps</h2>
      <ul>
        <li>
          Set up <a href="/monitoring">Monitoring</a> with Prometheus and OpenTelemetry.
        </li>
        <li>
          Review the <a href="/multi-cloud">Multi-Cloud</a> guide for cloud-specific configurations.
        </li>
        <li>
          Read the <a href="/security">Security</a> page for hardening recommendations.
        </li>
      </ul>
    </div>
  );
}
