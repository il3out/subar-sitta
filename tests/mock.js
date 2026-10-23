// A fake Supabase for the browser tests. Every request to the real project is intercepted, so tests
// never read or write production data. The clock is fixed so countdowns and screenshots are stable.
const HOST = "https://jjavqcpxyljxprefbtta.supabase.co";
const NOW = new Date("2026-10-17T09:00:00Z");   // a Saturday morning, Kuwait time 12:00
const iso = (h) => new Date(NOW.getTime() + h * 36e5).toISOString();
const ME = "11111111-1111-4111-8111-111111111111";
const P = { // the league
  [ME]: "Abdal", "22222222-2222-4222-8222-222222222222": "Noura", "33333333-3333-4333-8333-333333333333": "Faisal_K",
  "44444444-4444-4444-8444-444444444444": "Yousef", "55555555-5555-4555-8555-555555555555": "Hessa.B", "66666666-6666-4666-8666-666666666666": "Mishari",
};
const ids = Object.keys(P);
const fx = (pairs, ko, res) => pairs.map(([h, a], i) => ({ id: "f" + (i + 1), h, a, ko: iso(ko + (i >> 1) * 2.5), res: res ? res[i] : null }));

function league({ open = true, deadlineH = 28.5, live = false, coWin = false } = {}) {
  if (live) { open = false; deadlineH = -50 / 60; }
  const rounds = [
    { id: "r1", n: 1, deadline: iso(-21 * 24), locked: false, first_goal: 7, settled_at: iso(-20 * 24),
      fixtures: fx([["ARS", "CFC"], ["LFC", "MCI"], ["TOT", "NEW"], ["AVL", "EVE"], ["BRI", "FUL"], ["WHU", "WOL"]], -21 * 24, [[2, 1], [1, 1], [0, 2], [3, 0], [1, 0], [2, 2]]) },
    { id: "r2", n: 2, deadline: iso(-14 * 24), locked: false, first_goal: 23, settled_at: iso(-13 * 24),
      fixtures: fx([["MUN", "ARS"], ["CFC", "LFC"], ["NEW", "AVL"], ["MCI", "BRE"], ["CRY", "SUN"], ["LEE", "BOU"]], -14 * 24, [[1, 2], [0, 0], [2, 1], [4, 1], [1, 1], [0, 1]]) },
    { id: "r3", n: 3, deadline: iso(-7 * 24), locked: false, first_goal: 4, settled_at: iso(-6 * 24),
      fixtures: fx([["LFC", "ARS"], ["MCI", "CFC"], ["AVL", "TOT"], ["EVE", "NFO"], ["FUL", "WHU"], ["BOU", "BRI"]], -7 * 24, [[2, 2], [3, 1], [1, 0], [0, 0], [2, 3], [1, 1]]) },
    { id: "r4", n: 4, deadline: iso(open ? deadlineH : -1), locked: false, first_goal: null, settled_at: null,
      fixtures: fx([["ARS", "MCI"], ["CFC", "TOT"], ["LFC", "NEW"], ["AVL", "MUN"], ["BRI", "CRY"], ["NFO", "SUN"]], open || live ? deadlineH : -1, null)
        .map((f, i) => live && i === 0 ? { ...f, live: [1, 0], min: 50, st: "2H" } : live && i === 1 ? { ...f, live: [0, 0], min: 45, st: "HT" } : f) },
  ];
  const pts = [[31, 3, 8, 1], [29, 3, 7, 1], [26, 2, 8, 1], [22, 2, 6, 0], [17, 1, 6, 0], [12, 0, 6, 0]];
  const lb = ids.map((id, i) => ({ rank: i + 1, user_id: id, nick: P[id], member_no: i + 1, joined_at: iso(-30 * 24 + i), is_admin: false,
    pts: pts[i][0], ex: pts[i][1], rs: pts[i][2], won: pts[i][3], played: 3, last_pts: [9, 12, 7, 4, 5, 2][i], move: [1, -1, 0, 2, -1, -1][i],
    hist: [1, 2, 3].map((n) => ({ n, pts: Math.round(pts[i][0] / 3) + (n === 3 ? pts[i][0] % 3 : 0) })) }));
  // the round_board for the last settled round
  const board = ids.map((id, i) => ({ user_id: id, nick: P[id], gg: 5 + i * 3, ggd: 1 + i * 3, at: iso(-7 * 24 - 5 - i), pts: [12, 9, 7, 7, 4, 2][i], ex: [2, 1, 1, 1, 0, 0][i], rs: 1,
    s: { f1: [2, 2], f2: [i % 3, 1], f3: [1, 0], f4: [i, 0], f5: [1, 2], f6: [1, 1] } }));
  if (coWin) Object.assign(board[1], { pts: board[0].pts, ggd: board[0].ggd });   // two players share the round
  const picks = { r1: { f1: [2, 1], f2: [1, 0] }, r2: { f1: [1, 2] }, r3: { f1: [2, 2], f2: [2, 1], f3: [1, 0], f4: [0, 0], f5: [1, 2], f6: [1, 1] } };
  return { rounds, lb, board, picks, who: ids.slice(1, 5).map((id, i) => ({ user_id: id, filled: [6, 6, 4, 2][i], has_gg: i < 2, last_at: iso(-1 - i * 3), players: { nick: P[id] } })) };
}

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const jwt = () => `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: ME, role: "authenticated", exp: 4102444800, aud: "authenticated" })}.sig`;
const user = { id: ME, aud: "authenticated", role: "authenticated", email: "test@example.com", app_metadata: {}, user_metadata: {}, created_at: iso(-30 * 24) };

/**
 * mock(page, { signedIn, open, deadlineH, live, coWin, picks, failSaves })
 * Returns the state; state.saves collects every pick save the app sends.
 */
async function mock(page, opt = {}) {
  const L = league(opt);
  const st = { saves: [], failSaves: !!opt.failSaves, mine: { ...L.picks, ...(opt.picks ? { r4: opt.picks } : {}) } };
  await page.clock.setFixedTime(NOW);
  if (opt.signedIn !== false) {
    await page.addInitScript(([k, v]) => localStorage.setItem(k, v), ["sb-jjavqcpxyljxprefbtta-auth-token",
      JSON.stringify({ access_token: jwt(), token_type: "bearer", expires_in: 3600 * 24 * 365, expires_at: 4102444800, refresh_token: "r", user })]);
  }
  await page.routeWebSocket(/supabase\.co/, () => {});   // realtime: accept and stay quiet
  await page.route(/^https?:\/\/(?!localhost|127\.0\.0\.1)/, (r) => r.request().url().startsWith(HOST) ? handle(r) : r.abort());

  const json = (r, body, status = 200, headers = {}) => r.fulfill({ status, contentType: "application/json", headers: { "access-control-allow-origin": "*", "access-control-expose-headers": "content-range", ...headers }, body: JSON.stringify(body) });
  const signedIn = opt.signedIn !== false;
  const isOpen = (rid) => { const r = L.rounds.find((x) => x.id === rid); return r && !r.locked && new Date(r.deadline) > NOW; };

  async function handle(r) {
    const req = r.request(), u = new URL(req.url()), m = req.method(), path = u.pathname;
    if (m === "OPTIONS") return r.fulfill({ status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*" } });
    if (path.startsWith("/auth/v1/user")) return signedIn ? json(r, user) : json(r, { message: "no session" }, 401);
    if (path.startsWith("/auth/v1/logout")) return r.fulfill({ status: 204 });
    if (path.startsWith("/auth/v1/")) return json(r, { message: "not in the mock" }, 400);
    const tbl = path.replace("/rest/v1/", "");
    const count = (n) => ({ "content-range": `0-${Math.max(n - 1, 0)}/${n}` });
    if (tbl === "league") return json(r, signedIn ? [{ id: 1, season: "2026/27", current_round: "r4", auto: true, status: "Nothing to do", status_at: iso(-0.2), calls_day: null, calls_today: 0 }] : []);
    if (tbl === "rounds") return json(r, L.rounds);
    if (tbl === "players") return m === "HEAD" ? json(r, null, 200, count(ids.length)) : json(r, signedIn ? [{ id: ME, nick: P[ME], is_admin: false, joined_at: iso(-30 * 24) }] : []);
    if (tbl === "rpc/leaderboard") return json(r, L.lb);
    if (tbl === "rpc/round_board") { const { rid } = req.postDataJSON(); return json(r, rid === "r4" ? [] : L.board); }
    if (tbl === "pick_status") return m === "HEAD" ? json(r, null, 200, count(L.who.length)) : json(r, L.who);
    if (tbl === "picks" && m === "GET") return json(r, Object.entries(st.mine).map(([round_id, s]) => ({ user_id: ME, round_id, s, gg: round_id === "r4" ? opt.gg ?? null : 20, at: iso(-30) })));
    if (tbl === "picks" && m === "POST") {
      const body = req.postDataJSON(); st.saves.push(body);
      if (st.failSaves) return json(r, { message: "Failed to fetch" }, 503);
      if (!isOpen(body.round_id)) return json(r, { code: "42501", message: 'new row violates row-level security policy for table "picks"' }, 403);
      st.mine[body.round_id] = body.s; return json(r, [], 201);
    }
    return json(r, { message: `mock has no ${m} ${tbl}` }, 404);
  }
  return st;
}

module.exports = { mock, NOW, ME };
