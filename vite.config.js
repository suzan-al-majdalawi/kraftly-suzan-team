import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [vue()],

    server: {
      proxy: {
        "/api": {
          target: env.API_URL,
          changeOrigin: true,
          headers: {
            "X-Api-Key": env.API_KEY,
          },
        },
      },
    },
  };
});
