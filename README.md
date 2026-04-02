# RelayForge

A self-hostable, open-source multi-user chat platform with guilds, channels, direct messages with end-to-end encryption, voice/video via LiveKit, and a desktop app built with Tauri 2.

## Features

- **Guilds and channels** -- text, voice, forum/thread channels with categories and permission overrides
- **Direct messages** -- end-to-end encrypted using the Double Ratchet protocol
- **Voice and video** -- powered by LiveKit (self-hosted SFU) with screen sharing, push-to-talk, and recording
- **Rich messaging** -- Markdown, reactions, polls, threads, pins, search, link previews, file uploads
- **Moderation** -- RBAC, audit logs, mute/kick/ban, word filters, abuse reports, batch actions
- **Desktop app** -- Tauri 2 with tray, notifications, offline drafts, auto-update
- **Admin console** -- user/guild management, audit logs, system settings, content review
- **Self-hostable** -- one-command Docker deployment for direct use, plus Kubernetes/Helm/Terraform for advanced setups
- **Observable** -- OpenTelemetry, Prometheus, structured logging, health checks

## Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Backend        | Go (modular monolith)               |
| Database       | PostgreSQL 16                       |
| Cache/PubSub   | Valkey (Redis-compatible)           |
| Object Storage | S3-compatible (MinIO, AWS S3, etc.) |
| Voice/Video    | LiveKit (self-hosted)               |
| Frontend       | React, TypeScript, Tailwind CSS     |
| Desktop        | Tauri 2                             |
| Deployment     | Docker Compose, Kubernetes, Helm, Terraform |

## Quick Start

### Prerequisites

- Go 1.23+
- Node.js 20+
- Docker and Docker Compose

### Development

```bash
# Start infrastructure services
make dev-services

# Run database migrations
make migrate

# Seed development data
make seed

# Start backend services (in separate terminals)
make dev-api
make dev-realtime
make dev-media
make dev-worker

# Install frontend dependencies and start web app
npm install
npm run build:packages
make dev-web
```

### Self-Hosted Deployment

```bash
make deploy-init
# Edit .env if you want to change domains, secrets, or ports

make deploy-up
make deploy-migrate
```

The default deployment stack is now self-contained for single-host usage: it brings up PostgreSQL,
Valkey, MinIO, LiveKit, the API, realtime, media, worker, and web services together from
`infra/docker/docker-compose.yml`.

## Project Structure

```
relay-forge/
  apps/
    web/          -- Main web application (React + Vite)
    desktop/      -- Desktop app (Tauri 2 + React)
    admin/        -- System admin console (React + Vite)
    docs/         -- Documentation site (GitHub Pages)
  services/
    api/          -- HTTP API service (Go)
    realtime/     -- WebSocket realtime service (Go)
    media/        -- Media processing and LiveKit integration (Go)
    worker/       -- Background job processor (Go)
  packages/
    ui/           -- Shared UI components
    types/        -- Shared TypeScript types
    sdk/          -- Typed API/realtime client SDK
    config/       -- Shared configuration utilities
    crypto/       -- E2EE DM crypto helpers
  infra/
    docker/       -- Docker Compose files and container images
    kubernetes/   -- Kubernetes manifests
    helm/         -- Helm chart
    terraform/    -- Terraform modules
  docs/           -- Architecture and operations documentation
```

## Architecture

RelayForge uses a **modular monolith** architecture for the API service, with separate services for realtime (WebSocket), media (LiveKit/storage), and background workers. Services communicate via Valkey pub/sub for realtime events and share a PostgreSQL database.

- **API Service** -- REST API for all CRUD, auth, permissions, admin operations
- **Realtime Service** -- WebSocket gateway for live message delivery, presence, typing
- **Media Service** -- File uploads, LiveKit room management, media processing
- **Worker Service** -- Background jobs (email, cleanup, audit archival, virus scanning)

### E2EE Boundary

- Direct messages use end-to-end encryption (Double Ratchet with X3DH key agreement)
- Guild/channel messages are NOT E2EE -- they use TLS in transit and server-side access control
- This is intentional: guild messages need server-side search, moderation, and audit

### Multi-Cloud Portability

- S3-compatible storage (works with MinIO, AWS S3, Tencent COS, Alibaba OSS, Huawei OBS)
- PostgreSQL (any managed or self-hosted instance)
- Valkey/Redis (any compatible service)
- Terraform modules with provider-specific variables
- No hard dependency on any cloud vendor's proprietary services

## Documentation

See the [docs site](https://relay-forge.github.io/relay-forge/) or browse the `docs/` directory.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md).

## License

AGPL-3.0-or-later. See [LICENSE](LICENSE).
