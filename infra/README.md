# Infrastructure Layout

`infra/` contains every deployment-oriented asset in one place.

## Recommended Path

For most self-hosted users, start with `infra/docker/`.

```bash
make deploy-init
make deploy-up
make deploy-migrate
```

This path is intended to work on a single host without requiring you to provision external
PostgreSQL, S3-compatible storage, or LiveKit first.

## Subdirectories

- `infra/docker/` — the simplest self-hosted deployment path and local infra stack
- `infra/kubernetes/` — raw Kubernetes manifests
- `infra/helm/` — Helm chart for cluster deployments
- `infra/terraform/` — infrastructure modules and example environments
