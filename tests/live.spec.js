// Read-only checks against the real site, signed out. Never signs in, never saves.
const { test, expect } = require("@playwright/test");

test("live landing renders the round and has no script errors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("/");
  await expect(page.locator(".land-h")).toBeVisible({ timeout: 20000 });
  await expect(page.locator(".lt-row")).toHaveCount(6, { timeout: 20000 });
  await page.screenshot({ path: `test-results/live-landing-${test.info().project.name}.png`, fullPage: true });
  expect(errors).toEqual([]);
});
