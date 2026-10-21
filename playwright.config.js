import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",

  reporter: [["html", { outputFolder: "playwright-report" }]],

  use: {
    baseURL: "http://localhost:8080",
  },

  webServer: [
    ...(!process.env.CI
      ? [
          {
            command: "npm run api",
            url: "http://localhost:4000/healthz",
            reuseExistingServer: true,
          },
        ]
      : []),
    {
      command: "npm run dev",
      url: "http://localhost:8080",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
