
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 8080,
    open: true
  },
  plugins: [
    react(),
    componentTagger(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['@jridgewell/sourcemap-codec']
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: []
    }
  }
});
