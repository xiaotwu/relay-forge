import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'API_', 'WS_', 'LIVEKIT_'],
  resolve: {
    alias: {
      '@relayforge/types': path.resolve(__dirname, '../../packages/types/src'),
      '@relayforge/sdk': path.resolve(__dirname, '../../packages/sdk/src'),
      '@relayforge/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@relayforge/config': path.resolve(__dirname, '../../packages/config/src'),
      '@relayforge/crypto': path.resolve(__dirname, '../../packages/crypto/src'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
});
