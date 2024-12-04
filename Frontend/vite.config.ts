import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer', 'crypto', 'stream', 'util']
    })
  ],
  build: {
    target: 'esnext'
  },
  server: {
    port: 5173,
    host: true,
    cors: true
  },
  publicDir: 'public'
});