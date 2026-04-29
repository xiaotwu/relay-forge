# Security Policy

## Reporting Vulnerabilities

If you discover a RelayForge security issue, do not open a public issue. Report it privately with:

- the affected repository or component
- reproduction steps
- impact assessment
- any relevant logs, traces, or screenshots

## Repository Scope

This repository covers:

- the web client
- the admin console
- the desktop shell
- the shared frontend packages
- the public documentation site

Backend runtime security controls and operational hardening are implemented in
`relay-forge-server` and documented in the GitHub Pages handbook published from this repository.

## Current Client Controls

- Runtime endpoints are explicit through `API_BASE_URL`, `WS_URL`, `LIVEKIT_URL`, and
  `MEDIA_BASE_URL`.
- Public SDK methods use OpenAPI-backed typed path builders from `packages/sdk/src/paths.ts`.
- Message text is rendered through React text nodes, and markdown links are allow-listed to safe
  URL schemes.
- Browser media reads go through the media proxy so the server can enforce recipient-level ACLs.
- The desktop shell keeps a Tauri CSP instead of disabling CSP.
- Admin UI actions only target backed API routes; unsupported controls should stay hidden or
  disabled until server support exists.

## Server-Enforced Controls

The server remains authoritative for auth, RBAC, guild/channel membership, disabled-user checks,
realtime subscriptions, media ACLs, upload completion ownership, and admin route protection.
Client code should never rely on UUID secrecy or UI hiding as the only authorization boundary.

## npm Audit Notes

Latest local `npm audit --json` result:

- Fixed the high-severity Vite dev-server finding by moving app workspaces to `vite@6.4.2`
  and refreshing the root Vitest/Vite toolchain.
- Fixed moderate PostCSS and DOMPurify findings with non-forced dependency updates.
- Remaining audit findings are two moderate docs-app findings: direct `mermaid` and transitive
  `uuid`.
- npm currently proposes a breaking Mermaid downgrade (`9.1.7`) as the available fix. The docs app
  renders static in-repo diagrams and does not pass attacker-controlled buffers into uuid, so this
  is tracked as non-blocking until Mermaid ships a non-breaking uuid fix or the docs renderer is
  replaced.

## Known Limitations

- The SDK request layer is still handwritten, but public methods are path-safe through
  OpenAPI-backed typed builders and contract tests.
- Browser media rendering currently uses the access token as a `token` query parameter for image
  and media tags. Future hardening should replace this with short-lived scoped media read tokens.
