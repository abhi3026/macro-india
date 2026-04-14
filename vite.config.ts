
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { ConfigEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }: ConfigEnv) => {
  // Only load lovable-tagger in development
  let componentTagger: any = undefined;
  if (mode === 'development') {
    try {
      const tagger = await import('lovable-tagger/plugin');
      componentTagger = tagger.default || tagger;
    } catch (e) {
      console.warn('lovable-tagger not found, skipping.');
    }
  }

  return {
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
      sourcemap: true
    },
  };
});
