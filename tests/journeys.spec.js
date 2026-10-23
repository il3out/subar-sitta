// Critical journeys against the mocked backend. Nothing here reaches production.
const { test, expect } = require("@playwright/test");
const { mock } = require("./mock");

const errors = (page) => { const e = []; page.on("pageerror", (x) => e.push(String(x))); return e; };
const drum = (page, f, i) => page.locator(`.drum[data-drum="${f}"][data-i="${i}"]`);
// keyboard is the reliable way to drive the drums in every viewport (digits jump straight to a value)
const pick = async (page, f, h, a) => { await drum(page, f, 0).press(String(h)); await drum(page, f, 1).press(String(a)); };

test("landing: signed-out visitor sees the open round and can reach sign-up", async ({ page }) => {
  const e = errors(page);
  await mock(page, { signedIn: false });
  await page.goto("/");
  await expect(page.locator(".land-h")).toContainText("Six matches.");
  await expect(page.locator(".lt-row")).toHaveCount(6);
  await expect(page.locator(".lt .clock [data-dur]")).toHaveText(/\d/);
  await page.locator(".land-go").first().click();
  await expect(page.locator("#nick")).toBeFocused();
  await expect(page.locator("#em")).toBeVisible();
  expect(e).toEqual([]);
});

test("sign-up form validates locally before calling the server", async ({ page }) => {
  await mock(page, { signedIn: false });
  await page.goto("/#join");
  await page.locator("#nick").fill("ab");
  await page.locator("form#authform button[type=submit]").click();
  await expect(page.locator("#autherr")).toHaveText("Usernames are 3 to 20 characters.");
  await page.locator("#nick").fill("Tester");
  await page.locator("#em").fill("not-an-email");
  await page.locator("form#authform button[type=submit]").click();
  await expect(page.locator("#autherr")).toHaveText("Enter a valid email.");
});

test("matchday: six fixtures, saved picks restored, countdown shown", async ({ page }) => {
  const e = errors(page);
  await mock(page, { picks: { f1: [2, 1], f2: [0, 0] }, gg: 30 });
  await page.goto("/");
  await expect(page.locator(".fx")).toHaveCount(6);
  await expect(page.locator('[data-card="f1"]')).toHaveAttribute("data-state", "saved");
  await expect(page.locator('[data-card="f2"]')).toHaveAttribute("data-state", "saved");   // 0–0 is a real pick
  await expect(page.locator('[data-card="f3"]')).toHaveAttribute("data-state", "todo");    // unpicked is not 0–0
  await expect(drum(page, "f2", 0)).toHaveAttribute("aria-valuenow", "0");
  await expect(drum(page, "f3", 0)).not.toHaveAttribute("aria-valuenow", /.*/);
  await expect(page.locator("#heroN")).toHaveText("2");
  await expect(page.locator(".hero-card .clock [data-dur]")).toHaveText(/1d.*04h.*30m/);
  expect(e).toEqual([]);
});

test("autosave sends 0–0 as a pick and leaves unpicked fixtures out", async ({ page }) => {
  const st = await mock(page);
  await page.goto("/");
  await pick(page, "f1", 0, 0);
  await expect(page.locator('[data-card="f1"]')).toHaveAttribute("data-state", "saved");
  const last = st.saves.at(-1);
  expect(last.round_id).toBe("r4");
  expect(last.s).toEqual({ f1: [0, 0] });
  await expect(page.locator("#savebar")).toContainText("Saved");
});

test("half-entered score is never sent and the player is told", async ({ page }) => {
  const st = await mock(page);
  await page.goto("/");
  await drum(page, "f1", 0).press("2");
  await expect(page.locator('[data-card="f1"]')).toHaveAttribute("data-state", "half");
  await expect(page.locator("#savebar")).toContainText("Add the other score");
  await page.waitForTimeout(1500);   // longer than the autosave delay
  expect(st.saves.every((b) => !("f1" in b.s))).toBe(true);
  await drum(page, "f1", 1).press("1");
  await expect(page.locator('[data-card="f1"]')).toHaveAttribute("data-state", "saved");
  expect(st.saves.at(-1).s).toEqual({ f1: [2, 1] });
});

test("all six plus Golden Goal: complete state", async ({ page }) => {
  const st = await mock(page);
  await page.goto("/");
  for (const f of ["f1", "f2", "f3", "f4", "f5", "f6"]) await pick(page, f, 1, 0);
  await page.locator("#mrail").focus();
  await page.keyboard.press("End");
  await expect(page.locator("#savebar")).toHaveAttribute("data-s", "all");
  await expect(page.locator("#savebar")).toContainText("All six saved");
  expect(st.saves.at(-1)).toMatchObject({ gg: 90 });
  expect(Object.keys(st.saves.at(-1).s)).toHaveLength(6);
});

test("failed save shows Not saved and Try again recovers", async ({ page }) => {
  const st = await mock(page, { failSaves: true });
  await page.goto("/");
  await pick(page, "f1", 3, 1);
  await expect(page.locator("#savebar")).toHaveAttribute("data-s", "failed");
  await expect(page.locator('[data-act="retrysave"]')).toBeVisible();
  st.failSaves = false;
  await page.locator('[data-act="retrysave"]').click();
  await expect(page.locator("#savebar")).toContainText("Saved");
  expect(st.saves.at(-1).s).toEqual({ f1: [3, 1] });
});

test("after the deadline picks are read-only and nothing is sent", async ({ page }) => {
  const st = await mock(page, { open: false, picks: { f1: [1, 1] } });
  await page.goto("/");
  await expect(page.locator(".drum")).toHaveCount(0);
  await expect(page.locator('[data-card="f1"] .fx-state')).toContainText("Locked in");
  await expect(page.locator('[data-card="f2"] .fx-state')).toContainText("No prediction");
  await expect(page.locator("#savebar")).toHaveCount(0);
  expect(st.saves).toEqual([]);
});

test("results, table and player pages render from the league data", async ({ page }) => {
  const e = errors(page);
  await mock(page);
  await page.goto("/#round");
  await page.locator(".tabs button", { hasText: "Round 3" }).click();
  await expect(page.locator("table.picks tbody tr")).toHaveCount(6);
  await page.locator('[data-go="table"]:visible').first().click();
  await expect(page.locator("#standings > li")).toHaveCount(6);
  await expect(page.locator("#standings .st").first()).toContainText("Abdal");
  await page.locator('[data-go="player"]:visible').first().click();
  await expect(page.locator(".pass-name")).toContainText("Abdal");
  expect(e).toEqual([]);
});

test("scoring in the app matches the rules (exact 5, result 2, no pick 0)", async ({ page }) => {
  await mock(page);
  await page.goto("/");
  const r = await page.evaluate(() => [ptsFor([2, 1], [2, 1]), ptsFor([3, 0], [2, 1]), ptsFor([1, 1], [0, 0]), ptsFor([0, 1], [2, 1]), ptsFor(undefined, [0, 0]), ptsFor([0, 0], [0, 0])]);
  expect(r).toEqual([5, 2, 2, 0, 0, 5]);
});

test("during matches Matchday shows live scores and your running total", async ({ page }) => {
  await mock(page, { live: true, picks: { f1: [2, 1], f2: [0, 0] } });
  await page.goto("/");
  await expect(page.locator(".hero-card .notch")).toContainText("Live");
  await expect(page.locator(".hero-card .hc-sub")).toHaveText(/7 points so far/);   // 2 (right result) + 5 (0–0 at half time)
  await expect(page.locator('[data-card="f1"] .pill.live')).toContainText("1–0");
  await expect(page.locator('[data-card="f1"] .fx-when')).toHaveText("Your pick");
  await expect(page.locator('[data-card="f2"] .pill.live')).toContainText("Half time");
  await expect(page.locator('[data-card="f3"] .fx-foot')).toContainText("Awaiting result");
});

test("the back button returns to the previous section", async ({ page }) => {
  await mock(page);
  await page.goto("/");
  await page.locator('[data-go="table"]:visible').first().click();
  await expect(page.locator("#standings")).toBeVisible();
  await page.goBack();
  await expect(page.locator(".hero-card")).toBeVisible();
  await expect(page).toHaveURL(/localhost:4173\/$/);   // still inside Subar Sitta
});

test("joint round winners are both shown", async ({ page }) => {
  await mock(page, { coWin: true });
  await page.goto("/");
  await expect(page.locator(".win-card .win-name")).toContainText("Abdal & Noura");
  await expect(page.locator(".win-card .win-sub")).toContainText("Joint round winners");
});
