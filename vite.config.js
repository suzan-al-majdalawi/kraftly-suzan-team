import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const apiProxy = {
    target: env.API_URL || "https://kraftly-api.sprinto.cloud",
    changeOrigin: true,
    headers: {
      "X-Api-Key": env.API_KEY,
    },
  };

  return {
    plugins: [vue()],

    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./tests/setup.js"],
    },

    server: {
      proxy: {
        "/api": apiProxy,
      },
    },

    preview: {
      proxy: {
        "/api": apiProxy,
      },
    },
  };
});
