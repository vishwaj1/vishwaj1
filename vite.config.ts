import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({

  base: process.env.NODE_ENV === "production" && !process.env.VERCEL ? '/vishwaj1/' : '/',
  plugins: [
    react(),
    {
      name: "github-pages-spa-fallback",
      closeBundle() {
        const outDir = path.resolve(import.meta.dirname, "dist");
        const index = path.join(outDir, "index.html");
        const fallback = path.join(outDir, "404.html");
        if (fs.existsSync(index)) {
          fs.copyFileSync(index, fallback);
        }
      },
    },
    {
      // /llms.txt: the home page's "agent" view, published for AI tools. One source: client/src/site/agent.md
      name: "llms-txt",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && req.url.split("?")[0].endsWith("/llms.txt")) {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.end(fs.readFileSync(path.resolve(import.meta.dirname, "client/src/site/agent.md"), "utf8"));
            return;
          }
          next();
        });
      },
      closeBundle() {
        const outDir = path.resolve(import.meta.dirname, "dist");
        if (fs.existsSync(outDir)) {
          fs.copyFileSync(path.resolve(import.meta.dirname, "client/src/site/agent.md"), path.join(outDir, "llms.txt"));
        }
      },
    },
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
      process.env.REPL_ID !== undefined
      ? [
        await import("@replit/vite-plugin-cartographer").then((m) =>
          m.cartographer(),
        ),
      ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(import.meta.dirname, "client", "index.html"),
      },
    },
    assetsDir: 'client/src/images',
    copyPublicDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },

});
