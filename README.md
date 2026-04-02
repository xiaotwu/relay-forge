# RelayForge Clients

RelayForge is now organized as a client-focused repository. It contains the web app, admin console,
desktop app, shared frontend packages, and the GitHub Pages documentation site.

The backend now lives in
[`relay-forge-server`](https://github.com/xiaotwu/relay-forge-server). Clients connect to that
backend through configurable endpoint URLs, so moving the server to a new host or cloud
environment only requires updating configuration.


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

The backend repository is
[`relay-forge-server`](https://github.com/xiaotwu/relay-forge-server). It contains:

- Go services
- backend deployment assets
- backend operations documentation
- backend CI workflow definitions

It is maintained independently from this client repo.

## Documentation

The GitHub Pages site is built from `apps/docs` and now covers:

- client setup and packaging
- endpoint configuration
- repo boundaries
- contribution workflow
- backend architecture, operations, and security references

Backend hosting and operations details belong in `relay-forge-server`.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Security

See [SECURITY.md](./SECURITY.md).
