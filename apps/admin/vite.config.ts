import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@relayforge/types': path.resolve(__dirname, '../../packages/types/src'),
      '@relayforge/sdk': path.resolve(__dirname, '../../packages/sdk/src'),
      '@relayforge/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@relayforge/config': path.resolve(__dirname, '../../packages/config/src'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5174,
  },
});
