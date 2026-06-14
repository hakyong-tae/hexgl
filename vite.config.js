import { defineConfig } from 'vite'

// HexGL is a static WebGL game. index.html (root) loads classic <script> tags
// and runtime XHR assets from publicDir at '/', so relative paths resolve as-is.
export default defineConfig({
  publicDir: 'public',
  server: {
    port: 3017,
  },
  preview: {
    port: 3017,
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 5000,
  },
})
