// Browser tests. desktop + mobile run against a local copy of the site with Supabase mocked (tests/mock.js).
// live runs read-only, signed-out checks against the real site (monitoring only).
const { defineConfig, devices } = require("@playwright/test");
const iphone = { ...devices["iPhone 13"], defaultBrowserType: "chromium" };
module.exports = defineConfig({
  testDir: "tests",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" } },
  snapshotPathTemplate: "tests/baseline/{arg}-{projectName}.png",
  use: { baseURL: "http://localhost:4173", reducedMotion: "reduce", timezoneId: "Asia/Kuwait", locale: "en-GB" },
  webServer: process.env.LIVE ? undefined : { command: "node tests/serve.js 4173", port: 4173, reuseExistingServer: true },
  projects: [
    { name: "desktop", testIgnore: /live/, use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", testIgnore: /live/, use: iphone },
    { name: "live", testMatch: /live\.spec/, retries: 2, use: { baseURL: process.env.LIVE_URL || "https://subarsitta.com", reducedMotion: "no-preference" } },
  ],
});
