#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ICON_SOURCE="$ROOT_DIR/branding/relay-forge-icon.png"
WORDMARK_SOURCE="$ROOT_DIR/branding/relay-forge-wordmark.png"

if [[ ! -f "$ICON_SOURCE" ]]; then
  echo "Missing icon source: $ICON_SOURCE" >&2
  exit 1
fi

if [[ ! -f "$WORDMARK_SOURCE" ]]; then
  echo "Missing wordmark source: $WORDMARK_SOURCE" >&2
  exit 1
fi

generate_web_assets() {
  local app_name="$1"
  local title="$2"
  local description="$3"
  local public_dir="$ROOT_DIR/apps/$app_name/public"

  mkdir -p "$public_dir/branding"

  cp "$ICON_SOURCE" "$public_dir/branding/relay-forge-icon.png"
  cp "$WORDMARK_SOURCE" "$public_dir/branding/relay-forge-wordmark.png"
  rm -f "$public_dir/favicon.svg"

  sips -s format png -z 16 16 "$ICON_SOURCE" --out "$public_dir/favicon-16x16.png" >/dev/null
  sips -s format png -z 32 32 "$ICON_SOURCE" --out "$public_dir/favicon-32x32.png" >/dev/null
  sips -s format png -z 180 180 "$ICON_SOURCE" --out "$public_dir/apple-touch-icon.png" >/dev/null
  sips -s format png -z 192 192 "$ICON_SOURCE" --out "$public_dir/icon-192.png" >/dev/null
  sips -s format png -z 512 512 "$ICON_SOURCE" --out "$public_dir/icon-512.png" >/dev/null

  cat >"$public_dir/site.webmanifest" <<EOF
{
  "name": "$title",
  "short_name": "$title",
  "description": "$description",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0f1419",
  "icons": [
    {
      "src": "./icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "./icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF
}

generate_web_assets "web" "RelayForge" "RelayForge chat, calling, and server collaboration client."
generate_web_assets "admin" "RelayForge Admin" "RelayForge moderation, audit, and operator console."
generate_web_assets "desktop" "RelayForge Desktop" "RelayForge desktop client packaged with native shell integrations."
generate_web_assets "docs" "RelayForge Handbook" "RelayForge architecture, operations, deployment, and release handbook."

(
  cd "$ROOT_DIR/apps/desktop"
  npx tauri icon "$ICON_SOURCE" --output "$ROOT_DIR/apps/desktop/src-tauri/icons" >/dev/null
)

rm -rf \
  "$ROOT_DIR/apps/desktop/src-tauri/icons/android" \
  "$ROOT_DIR/apps/desktop/src-tauri/icons/ios"
