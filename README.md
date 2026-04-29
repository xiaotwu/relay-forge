<p align="center">
  <img src="./branding/relay-forge-wordmark.png" alt="RelayForge" width="460" />
</p>

RelayForge is the client-facing repository for the RelayForge platform. It contains the web app,
admin console, desktop app, shared frontend packages, and the GitHub Pages handbook.

If you are looking for the backend services and deployment assets, go to
[`relay-forge-server`](https://github.com/xiaotwu/relay-forge-server). If you want the full
platform handbook, go to
[`xiaotwu.github.io/relay-forge`](https://xiaotwu.github.io/relay-forge/).

## Product

RelayForge is a split client/server communications platform. The client experience aims for an
iMessage-inspired shell: polished, calm, rounded, minimal, and conversation-first. The information
architecture carries Discord-like capability: guilds, channels, roles, DMs and group DMs, media
attachments, realtime presence, LiveKit voice/video entry points, and an operator-focused admin
console.

## Repository Map

- `apps/web` - main browser client with the compact navigation rail, contextual sidebar,
  conversation center pane, optional details panel, and floating settings modal.
- `apps/admin` - operator and moderation console for dashboard data, users, guilds, reports,
  audit logs, and admin settings.
- `apps/desktop` - Tauri desktop shell that reuses the web app packages with native packaging and
  a locked-down CSP.
- `apps/docs` - GitHub Pages handbook for both repositories.
- `packages/config` - shared endpoint contract and runtime constants.
- `packages/sdk` - handwritten REST/realtime request layer using OpenAPI-backed typed path
  builders.
- `packages/types` - shared API, domain, and realtime event models.
- `packages/crypto` - browser-compatible E2EE and device-key helpers.
- `packages/ui` - shared React design-system primitives and tokens.

## Quickstart

```bash
npm install
cp .env.example .env
npm run build:packages
npm run dev:web
```

Common development commands:

```bash
npm run dev:web
npm run dev:admin
npm run dev:desktop
npm run dev:docs
```

Use the sibling server repository for a local backend:

```bash
cd ../relay-forge-server
cp .env.example .env
make deploy-up
make deploy-migrate
```

## Runtime Contract

Copy [`.env.example`](./.env.example) to `.env` when you want clients to target explicit backend
endpoints. The shared runtime contract is:

| Variable | Default | Used by |
| --- | --- | --- |
| `API_BASE_URL` | `http://localhost:8080/api/v1` | web, admin, desktop, SDK REST calls |
| `WS_URL` | `ws://localhost:8081/ws` | web, desktop, realtime SDK |
| `LIVEKIT_URL` | `ws://localhost:7880` | web and desktop voice/video UI |
| `MEDIA_BASE_URL` | `http://localhost:8082/api/v1` | upload, media proxy, and voice helper calls |

Legacy Vite aliases remain supported for compatibility: `VITE_API_URL`, `VITE_WS_URL`,
`VITE_LIVEKIT_URL`, and `VITE_MEDIA_URL`.

## API Contract And SDK

The backend OpenAPI document is the source of truth:
`../relay-forge-server/openapi/relayforge.yaml`.

```bash
npm run generate:api
npm run check:api-contract
```

`packages/sdk/src/generated/relayforge.ts` contains generated path types. The public SDK request
layer remains handwritten for stability, but route strings must go through
`packages/sdk/src/paths.ts` so missing or renamed OpenAPI paths fail at typecheck time. See
[packages/sdk/SDK_CONTRACT.md](./packages/sdk/SDK_CONTRACT.md) before adding SDK methods.

## Media And Realtime

Media uploads are created through the media service:

1. `createPresignedUpload` records a pending upload owned by the uploader.
2. The browser uploads bytes directly to the returned storage URL.
3. `completeUpload` attaches the media to an owner context such as `dm_channel`, `channel`,
   `guild`, or `user_profile`.
4. Browser reads use the media proxy at `/api/v1/media/files/{fileID}`, where the server rechecks
   recipient-level ACLs before redirecting to storage.

For browser-rendered media elements, the client currently appends the access token as the `token`
query parameter because image/video tags cannot send authorization headers. Future hardening should
replace that with short-lived scoped media read tokens.

Realtime events are externalized as uppercase envelopes such as `MESSAGE_CREATE`,
`DM_MESSAGE_CREATE`, `MESSAGE_UPDATE`, and `MESSAGE_DELETE`. The client connects to `WS_URL` with a
JWT token and subscribes to guilds through validated query parameters.

## Verification

The currently expected checks are:

```bash
npm test
npm run typecheck
npm run check:api-contract
```

Additional useful checks when touching affected areas:

```bash
npm run lint
npm run build
npm run build:docs
```

## Security

Client-side security depends on the server remaining authoritative for authentication,
authorization, realtime subscriptions, media ACLs, and admin permissions. The frontend avoids
rendering message HTML, validates markdown links against safe schemes, uses explicit endpoint
configuration, and keeps Tauri CSP enabled.

Current npm audit status is documented in [SECURITY.md](./SECURITY.md). The remaining known npm
audit advisory is a moderate docs-only Mermaid/transitive `uuid` finding with a breaking downgrade
as npm's suggested fix.

## Documentation

- [Handbook](https://xiaotwu.github.io/relay-forge/)
- [Contributing](./CONTRIBUTING.md)
- [Security](./SECURITY.md)

This repository is licensed under the [Apache-2.0 License](./LICENSE).
