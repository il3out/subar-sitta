// Live health check: read-only, signed-out, public data only. Never writes anything.
// Exits 1 on a hard failure (site or database down), prints warnings for autopilot trouble.
// Usage: node tests/monitor.js   (env SITE, SUPABASE_URL, SUPABASE_KEY override the defaults)
const SITE = process.env.SITE || "https://subarsitta.com";
const cfg = { url: process.env.SUPABASE_URL || "https://jjavqcpxyljxprefbtta.supabase.co", key: process.env.SUPABASE_KEY || "sb_publishable_eLToY8z-tABlqmtjpyIhFw_j38puBvn" };
const H = 36e5, now = Date.now();
const out = { at: new Date().toISOString(), fail: [], warn: [], ms: {} };

async function get(name, url, init) {
  const t = Date.now();
  try {
    const r = await fetch(url, { ...init, signal: AbortSignal.timeout(15000) });
    out.ms[name] = Date.now() - t;
    if (!r.ok) { out.fail.push(`${name}: HTTP ${r.status}`); return null; }
    return r;
  } catch (e) { out.ms[name] = Date.now() - t; out.fail.push(`${name}: ${e.cause?.code || e.message}`); return null; }
}

(async () => {
  const home = await get("site", SITE + "/");
  if (home && !(await home.text()).includes('src="app.js"')) out.fail.push("site: page served but app.js is not referenced");
  for (const f of ["app.js", "styles.css", "config.js", "vendor/supabase.js"]) await get(f, `${SITE}/${f}`);
  // rounds are public (update-02): the latest few tell us whether the autopilot is keeping up
  const r = await get("database", `${cfg.url}/rest/v1/rounds?select=n,deadline,locked,settled_at,fixtures&order=n.desc&limit=3`, { headers: { apikey: cfg.key } });
  if (r) {
    const rounds = await r.json();
    if (!rounds.length) out.warn.push("no rounds in the database yet");
    const open = rounds.find((x) => !x.locked && Date.parse(x.deadline) > now);
    const last = rounds[0];
    if (last) out.latest = { n: last.n, deadline: last.deadline, open: !!open, settled: !!last.settled_at };
    // a round that should have finished long ago but is still unsettled
    for (const x of rounds) {
      const lastKo = Math.max(...(x.fixtures || []).map((f) => Date.parse(f.ko) || 0));
      if (!x.settled_at && lastKo && now > lastKo + 8 * H) out.warn.push(`round ${x.n}: last kick-off ${Math.round((now - lastKo) / H)}h ago and still not settled (autopilot or API-Football?)`);
      for (const f of x.fixtures || []) if (Array.isArray(f.res) && f.res.some((g) => !Number.isInteger(g) || g < 0)) out.fail.push(`round ${x.n} ${f.id}: impossible result ${JSON.stringify(f.res)}`);
      if (x.settled_at && (x.fixtures || []).length !== 6) out.fail.push(`round ${x.n}: settled with ${x.fixtures.length} fixtures`);
    }
    // nothing open and nothing new for a week during the season
    if (!open && last && now > Date.parse(last.deadline) + 7 * 24 * H) out.warn.push(`no open round and the latest (round ${last.n}) locked over a week ago`);
  }
  console.log(JSON.stringify(out, null, 1));
  process.exit(out.fail.length ? 1 : 0);
})();
