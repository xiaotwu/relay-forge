# =============================================================================
# RelayForge - Self-Hosted Deployment Notes
# =============================================================================
#
# This file serves as a reference for self-hosted deployments where cloud
# provider Terraform modules are not applicable. Instead, use Docker Compose
# or Kubernetes manifests from the infra/ directory.
#
# =============================================================================
# Option 1: Docker Compose (Recommended for small deployments)
# =============================================================================
#
# Prerequisites:
#   - Docker Engine 24+ with Compose plugin
#   - At least 4 GB RAM, 2 CPU cores
#   - A domain name with DNS pointed to your server
#
# Steps:
#   1. Copy .env.example to .env and configure all values
#   2. Generate strong secrets:
#        openssl rand -base64 32  (for AUTH_JWT_SECRET, DB_PASSWORD, etc.)
#   3. Configure your reverse proxy (nginx.conf, Caddyfile, or traefik.yml)
#   4. Start services:
#        docker compose -f infra/docker/docker-compose.yml up -d
#   5. Run migrations:
#        docker compose exec api api migrate up
#
# Backups:
#   - Use scripts/backup.sh for automated PostgreSQL backups
#   - Schedule via cron: 0 2 * * * /path/to/scripts/backup.sh
#
# =============================================================================
# Option 2: Kubernetes (Recommended for larger deployments)
# =============================================================================
#
# Prerequisites:
#   - Kubernetes 1.28+
#   - kubectl configured
#   - An ingress controller (nginx-ingress recommended)
#   - cert-manager for TLS (optional but recommended)
#   - External PostgreSQL and Valkey/Redis instances
#
# Using Kustomize:
#   1. Review and edit infra/kubernetes/base/configmap.yaml
#   2. Generate and apply secrets:
#        kubectl create secret generic relayforge-secrets \
#          --namespace relayforge \
#          --from-literal=DB_PASSWORD=<password> \
#          --from-literal=AUTH_JWT_SECRET=<secret> \
#          --from-literal=S3_ACCESS_KEY=<key> \
#          --from-literal=S3_SECRET_KEY=<key> \
#          --from-literal=LIVEKIT_API_KEY=<key> \
#          --from-literal=LIVEKIT_API_SECRET=<secret>
#   3. Apply manifests:
#        kubectl apply -k infra/kubernetes/base/
#
# Using Helm:
#   1. Create a values-override.yaml with your settings
#   2. Install:
#        helm install relayforge infra/helm/relay-forge/ \
#          -f values-override.yaml \
#          --namespace relayforge --create-namespace
#
# =============================================================================
# Infrastructure Requirements
# =============================================================================
#
# PostgreSQL 16+:
#   - Minimum 2 GB RAM, 50 GB storage
#   - Enable pg_stat_statements extension
#   - Configure SSL for production
#   - Set up regular backups (pg_dump or WAL archiving)
#
# Valkey/Redis 7+:
#   - Minimum 1 GB RAM
#   - Enable persistence (RDB + AOF recommended)
#   - Configure maxmemory with allkeys-lru policy
#   - Enable AUTH for production
#
# S3-Compatible Object Storage:
#   - MinIO for self-hosted S3-compatible storage
#   - Create buckets: relay-uploads, relay-avatars, relay-emoji
#   - Configure CORS for avatar and emoji buckets
#
# LiveKit Server:
#   - Self-host LiveKit or use LiveKit Cloud
#   - Requires UDP port range for WebRTC (default 7882)
#   - See: https://docs.livekit.io/home/self-hosting/deployment
#
# =============================================================================

# This file intentionally contains no Terraform resources.
# It exists as a placeholder and documentation reference for
# self-hosted deployments that do not use cloud provider APIs.
