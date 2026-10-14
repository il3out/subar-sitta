// Visual baseline: every main screen, desktop + mobile, light + dark, compared against tests/baseline/.
// Update after an approved design change with: npx playwright test tests/visual.spec.js --update-snapshots
const { test, expect } = require("@playwright/test");
const { mock } = require("./mock");

const settle = async (page) => {
  await page.evaluate(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = "eager"));
    await Promise.all([...document.images].map((i) => i.complete || new Promise((r) => (i.onload = i.onerror = r))));
    await document.fonts.ready;
  });
};
const nav = (page, p) => page.locator(`[data-go="${p}"]:visible`).first().click();

const SCREENS = [
  ["landing", { signedIn: false }, async () => {}],
  ["join", { signedIn: false }, async (page) => page.locator(".land-go").first().click()],
  ["matchday", { picks: { f1: [2, 1], f2: [0, 0], f3: [1, 1] }, gg: 34 }, async () => {}],
  ["matchday-locked", { open: false, picks: { f1: [2, 1], f2: [0, 0] } }, async () => {}],
  ["results", {}, async (page) => { await nav(page, "round"); await page.locator(".tabs button", { hasText: "Round 3" }).click(); await page.locator("table.picks").waitFor(); }],
  ["table", {}, async (page) => nav(page, "table")],
  ["player", {}, async (page) => nav(page, "player")],
];

for (const scheme of ["light", "dark"]) {
  test.describe(scheme, () => {
    test.use({ colorScheme: scheme });
    for (const [name, opt, open] of SCREENS) {
      test(name, async ({ page }) => {
        await mock(page, opt);
        await page.goto("/");
        await page.locator(opt.signedIn === false ? ".land-h" : ".hello").waitFor();
        await open(page);
        await settle(page);
        await expect(page).toHaveScreenshot(`${name}-${scheme}.png`, { fullPage: true });
      });
    }
  });
}
