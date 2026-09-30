import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

const outDir = path.resolve(import.meta.dirname, "dist/public");

// GitHub project Pages is served from /<repo>/. Local, live, Cloudflare, and
// Vercel stay at /. The Pages workflow sets GITHUB_PAGES_BASE.
function githubPagesBase(): string {
  const raw = process.env.GITHUB_PAGES_BASE?.trim();
  if (!raw || raw === "/") return "/";
  const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
}

// GitHub Pages has no rewrite rules. 404.html is the SPA fallback, and
// tracker/index.html makes /tracker itself return the app.
function spaFallbackPlugin(): Plugin {
  return {
    name: "spa-fallback",
    apply: "build",
    closeBundle() {
      const indexPath = path.join(outDir, "index.html");
      if (!fs.existsSync(indexPath)) return;
      fs.copyFileSync(indexPath, path.join(outDir, "404.html"));
      const trackerDir = path.join(outDir, "tracker");
      fs.mkdirSync(trackerDir, { recursive: true });
      fs.copyFileSync(indexPath, path.join(trackerDir, "index.html"));
    },
  };
}

const plugins = [react(), tailwindcss(), jsxLocPlugin(), spaFallbackPlugin()];

export default defineConfig({
  base: githubPagesBase(),
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false, // Will find next available port if 3000 is busy
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
