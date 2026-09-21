import path from "path";
import { defineConfig, loadEnv } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const envDefine: Record<string, string> = {};

  for (const [key, value] of Object.entries(env)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  const mockApiPort = process.env.MOCK_API_PORT?.trim() || "3001";

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/api": {
          target: `http://127.0.0.1:${mockApiPort}`,
          changeOrigin: true,
        },
      },
    },

    define: envDefine,

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },

    plugins: [
      tailwindcss(),
      tsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tanstackStart({
        pages: [{ path: "/" }],
        prerender: {
          enabled: true,
          crawlLinks: false,
          failOnError: false,
          autoStaticPathsDiscovery: false,
        },
      }),
      viteReact(),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
  };
});
