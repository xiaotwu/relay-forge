# RelayForge

RelayForge is the client-facing repository for the RelayForge platform. It contains the web app,
admin console, desktop app, shared frontend packages, and the GitHub Pages handbook.

If you are looking for the backend services and deployment assets, go to
[`relay-forge-server`](https://github.com/xiaotwu/relay-forge-server). If you want the full
platform handbook, go to
[`xiaotwu.github.io/relay-forge`](https://xiaotwu.github.io/relay-forge/).

## Quickstart

```bash
npm install
npm run build:packages
npm run dev:web
```

Copy [`.env.example`](./.env.example) to `.env` when you want the clients to target an explicit
backend. The runtime contract is:

- `API_BASE_URL`
- `WS_URL`
- `LIVEKIT_URL`
- `MEDIA_BASE_URL`

## Apps

- `apps/web` - main browser client
- `apps/admin` - operator and moderation console
- `apps/desktop` - Tauri desktop shell
- `apps/docs` - GitHub Pages handbook

## Packages

- `packages/config` - shared endpoint contract
- `packages/sdk` - REST and realtime client layer
- `packages/types` - shared API and event models
- `packages/crypto` - E2EE and device-key helpers
- `packages/ui` - shared design system primitives

## Docs

- [Handbook](https://xiaotwu.github.io/relay-forge/)
- [Contributing](./CONTRIBUTING.md)
- [Security](./SECURITY.md)

This repository is licensed under the [Apache-2.0 License](./LICENSE).
