/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const SERVER_PORT = Number(process.env.GAME_SERVER_PORT ?? 8787);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/ws': { target: `ws://localhost:${SERVER_PORT}`, ws: true },
      '/healthz': `http://localhost:${SERVER_PORT}`,
    },
  },
  test: {
    include: ['shared/**/*.test.ts', 'server/**/*.test.ts', 'supabase/**/*.test.ts'],
    testTimeout: 30000,
  },
});
