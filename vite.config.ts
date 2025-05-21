
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { ConfigEnv } from 'vite';

// Only require lovable-tagger in development
let componentTagger = undefined;
if (process.env.NODE_ENV === 'development') {
  try {
    componentTagger = require('lovable-tagger/plugin');
  } catch (e) {
    console.warn('lovable-tagger not found, skipping.');
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => ({
  server: {
    host: true,
    port: 8080,
    open: true
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/],
    }
  }
}));
