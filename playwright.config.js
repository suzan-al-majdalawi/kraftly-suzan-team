import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",

  reporter: [["html", { outputFolder: "playwright-report" }]],

  use: {
    baseURL: "http://127.0.0.1:8080",
  },

  ...(process.env.CI
    ? {}
    : {
        webServer: [
          {
            command: "npm run api",
            url: "http://127.0.0.1:4000/healthz",
            reuseExistingServer: true,
            timeout: 60_000,
          },
          {
            command: "npm run dev -- --host 127.0.0.1 --port 8080 --strictPort",
            url: "http://127.0.0.1:8080",
            reuseExistingServer: true,
            timeout: 60_000,
          },
        ],
      }),
});
