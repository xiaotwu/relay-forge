# Contributing to RelayForge

This is the main contribution guide for the RelayForge platform. Keep it here in
`relay-forge`; do not duplicate it in `relay-forge-server`.

## Scope

- Use `relay-forge` for the web app, admin console, desktop shell, shared frontend packages, and
  GitHub Pages handbook.
- Use `relay-forge-server` for Go runtime services, backend deployment assets, and server release
  automation.
- Publish long-form architecture and operations documentation from `apps/docs` in this repository.

## Local Setup

```bash
npm install
npm run build:packages
```

Copy [`.env.example`](./.env.example) to `.env` if you need explicit backend endpoints.

## Common Commands

```bash
npm run dev:web
npm run dev:admin
npm run dev:desktop
npm run dev:docs
```

Checks to run before opening a PR:

```bash
npm run lint
npm run typecheck
npm test
npm run check:api-contract
npm run build:docs
```

## Pull Requests

1. Keep changes focused on one repository boundary.
2. Update the handbook when public behavior, deployment flow, or project structure changes.
3. Include test or build notes in the PR description.
4. Call out any environment or backend assumptions explicitly.

## Security

Do not open public issues for vulnerabilities. Follow [SECURITY.md](./SECURITY.md) instead.
