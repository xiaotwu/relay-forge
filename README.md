# RelayForge Clients

RelayForge is now organized as a client-focused repository. It contains the web app, admin console,
desktop app, shared frontend packages, and the GitHub Pages documentation site.

The backend has been extracted into [`new-project/`](./new-project), which is intended to become a
separate repository. Clients connect to that backend through configurable endpoint URLs, so moving
the server to a new host or cloud environment only requires updating configuration.

## What Lives Here

- `apps/web` — main web client
- `apps/admin` — admin console
- `apps/desktop` — Tauri desktop client and installer project
- `apps/docs` — GitHub Pages documentation site
- `packages/*` — shared UI, SDK, types, config, and crypto packages
- `new-project/` — extracted backend project staged for relocation

## Endpoint Configuration

RelayForge clients are intentionally decoupled from backend deployment details. Use these variables
to point the clients at the correct backend:

- `API_BASE_URL`
- `WS_URL`
- `LIVEKIT_URL`

Legacy `VITE_API_URL`, `VITE_WS_URL`, and `VITE_LIVEKIT_URL` aliases are still accepted for
compatibility, but the explicit contract above is the preferred interface going forward.

Copy [`.env.example`](./.env.example) to `.env` when you want a local client build with explicit
server endpoints.

## Tooling

Install dependencies in this order:

1. Homebrew first for core tools such as `node`, `go`, `rustup`, `tauri`, `golangci-lint`,
   `playwright`, `zip`, and supporting native libraries.
2. If Homebrew does not provide the version you need, use the tool's official install instructions.

Recommended local toolchain:

- Node.js 20+
- npm 10+
- Rust + Cargo
- Tauri prerequisites for your platform

## Client Development

```bash
npm install
npm run build:packages
npm run dev:web
```

Common commands:

```bash
npm run dev:web
npm run dev:admin
npm run dev:desktop
npm run dev:docs

npm test
npm run typecheck
npm run lint
```

## Direct Packaging

Static clients can be built and archived directly:

```bash
make package-web
make package-admin
make package-docs
```

Desktop installers are produced through Tauri:

```bash
make package-desktop
```

## Backend Project

The extracted backend is staged in [`new-project/`](./new-project). It contains:

- Go services
- backend deployment assets
- backend operations documentation
- backend CI workflow definitions

It is structured to be moved into its own repository without depending on files from this client
repo.

## Documentation

The GitHub Pages site is built from `apps/docs` and now focuses on:

- client setup and packaging
- endpoint configuration
- repo boundaries
- contribution workflow

Backend hosting and operations details belong in `new-project/`.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Security

See [SECURITY.md](./SECURITY.md).
