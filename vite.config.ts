import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: "https://13.200.85.27",
        changeOrigin: true,
        secure: false,
      },
    },
    // Handle CORS preflight locally so backend OPTIONS response doesn't block us
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.method === "OPTIONS" && req.url?.startsWith("/api")) {
          res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
          res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, Accept-Language, Origin, Referer");
          res.setHeader("Access-Control-Max-Age", "86400");
          res.statusCode = 204;
          res.end();
          return;
        }
        next();
      });
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
