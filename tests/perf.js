// Front-end performance baseline on a throttled phone profile (4x CPU, ~Fast 3G), Supabase mocked.
// Usage: node tests/perf.js [out.json]   (run `node tests/serve.js` first)
// Measures the site's own cost: bytes, requests, first paint, first meaningful paint, and when the first score drum is usable.
const { chromium, devices } = require("@playwright/test");
const { mock } = require("./mock");
const fs = require("fs");
const RUNS = 3, BASE = process.env.BASE || "http://localhost:4173";
const median = (a) => a.slice().sort((x, y) => x - y)[a.length >> 1];

async function once(b, signedIn) {
  const c = await b.newContext({ ...devices["iPhone 13"], timezoneId: "Asia/Kuwait" });
  const p = await c.newPage();
  await mock(p, signedIn ? {} : { signedIn: false });
  const cdp = await c.newCDPSession(p);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const bytes = {}; let reqs = 0;
  cdp.on("Network.loadingFinished", (e) => { reqs++; bytes._t = (bytes._t || 0) + e.encodedDataLength; });
  cdp.on("Network.responseReceived", (e) => { const u = new URL(e.response.url); if (u.hostname === "localhost") { const k = u.pathname.split(".").pop(); bytes[k] = (bytes[k] || 0) + (Number(e.response.headers["Content-Length"] || e.response.headers["content-length"]) || 0); } });
  // timings come from Chrome's lifecycle events: the page's own clock is faked by mock() for stable data
  const life = {}; await cdp.send("Page.enable"); await cdp.send("Page.setLifecycleEventsEnabled", { enabled: true });
  cdp.on("Page.lifecycleEvent", (e) => { if (!(e.name in life)) life[e.name] = e.timestamp * 1000; });
  const t0 = Date.now();
  await p.goto(BASE + "/", { waitUntil: "load" });
  await p.locator(signedIn ? ".drum" : ".lt-row").first().waitFor();
  const ready = Date.now() - t0;
  await p.waitForTimeout(1500);
  const s0 = life.init, d = (k) => Math.round(life[k] - s0);
  const m = { fcp: d("firstContentfulPaint"), fmp: d("firstMeaningfulPaint"), dcl: d("DOMContentLoaded"), load: d("load") };
  await c.close();
  return { ...m, ready, kb: Math.round((bytes._t || 0) / 1024), reqs, byType: Object.fromEntries(Object.entries(bytes).filter(([k]) => k !== "_t").map(([k, v]) => [k, Math.round(v / 1024)])) };
}

(async () => {
  const b = await chromium.launch(); const out = {};
  for (const [name, signedIn] of [["landing", false], ["matchday", true]]) {
    const runs = []; for (let i = 0; i < RUNS; i++) runs.push(await once(b, signedIn));
    out[name] = { fcp_ms: median(runs.map((r) => r.fcp)), fmp_ms: median(runs.map((r) => r.fmp)), dcl_ms: median(runs.map((r) => r.dcl)), load_ms: median(runs.map((r) => r.load)),
      usable_ms: median(runs.map((r) => r.ready)), transfer_kb: median(runs.map((r) => r.kb)), requests: median(runs.map((r) => r.reqs)), kb_by_type: runs[0].byType, runs: RUNS };
  }
  await b.close();
  out.profile = "iPhone 13 viewport, 4x CPU slowdown, 150ms RTT, 1.6 Mbps down, cache off, uncompressed local server, Supabase mocked";
  console.log(JSON.stringify(out, null, 1));
  if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
})();
