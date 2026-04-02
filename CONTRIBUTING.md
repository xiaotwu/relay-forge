# Contributing to RelayForge Clients

This repository now contains the RelayForge client applications and documentation site. Backend
service work lives in `relay-forge-server`.

## Local Setup

1. Install prerequisites with Homebrew when possible:
   - `node`
   - `rustup`
   - Tauri system dependencies for your platform
2. If Homebrew is behind or unavailable for a required tool, use the official installer.
3. Install dependencies:

```bash
npm install
npm run build:packages
```

4. Point the clients at the backend you want to use by copying `.env.example` to `.env`.

## Development Commands

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
npm run build:docs
```

## Pull Requests

1. Create a branch from `main`.
2. Keep frontend/docs changes in this repo and backend changes inside `relay-forge-server`.
3. Document any endpoint contract changes that affect client configuration.
4. Include test/build notes in the PR description.

## Reporting Issues

Open GitHub issues with:

- reproduction steps
- expected vs actual behavior
- environment details
- whether the problem is in the client repo or the extracted backend project
