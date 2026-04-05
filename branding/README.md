## RelayForge Branding

This directory stores the canonical RelayForge branding assets used across the client repo.

- `relay-forge-icon.png` is the square app mark for favicons, manifests, desktop packaging, and compact in-app logo contexts.
- `relay-forge-wordmark.png` is the horizontal lockup for README banners, docs headers, and other wide brand placements.

When these source files change, run:

```bash
./scripts/generate-brand-assets.sh
```

That script refreshes the app-facing derivatives in each Vite app and regenerates the Tauri icon bundle from the square source mark.
