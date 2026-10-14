# Subar Sitta operations

How the product is watched, tested and improved automatically, and the rules the automation follows.
Nothing here deploys. `main` deploys to subarsitta.com through Vercel, and only the owner merges to `main`.

## What runs, and where

| Cadence | What | Runs on | Output |
|---|---|---|---|
| Every push / PR | `CI`: SQL scoring + access-rule tests on the real migrations; 20 journey tests and 28 visual-baseline screens (desktop 1440 + iPhone 13, light + dark), Supabase mocked | GitHub Actions | PR check |
| Every 15 min | `Monitor`: site, assets, database and autopilot health (read-only, signed out) | GitHub Actions | Opens one `outage` issue on failure, closes it on recovery |
| Nightly 03:17 Kuwait | `Nightly`: full regression, live smoke on subarsitta.com, phone performance, Lighthouse mobile ×3 on the live landing page | GitHub Actions | `METRICS {…}` lines in the job logs, artifacts for 30 days |
| Every 6 h | Claude routine **triage**: reads Monitor/Nightly/CI results and open issues, root-causes failures, prepares fixes on a branch + draft PR | Claude cloud | Draft PRs; phone notification for anything critical |
| Daily 07:46 Kuwait | Claude routine **daily report**: runs the suites, compares metrics with history, audits screens, writes the report | Claude cloud | Private report page + a `daily-report` issue holding its metrics and link |
| Weekly, Sunday 09:33 Kuwait | Claude routine **innovation**: one high-value feature or experience proposal with a working prototype and screenshots | Claude cloud | `proposal` issue + private preview page |

**Routine status (14 Oct 2026): the three Claude routines exist but are paused.** A verification run showed that routine sessions start without GitHub access (no repository attached, no GitHub tools), so they cannot read Actions results, open issues or push branches. To turn them on: claude.ai → Code → Routines → open each "Subar Sitta · …" routine → add the `il3out/subar-sitta` repository (and the GitHub connector if offered) → enable. The GitHub Actions monitoring above does not depend on them and runs as soon as this PR is merged.

Hourly "inspect failures" is covered by the Monitor itself: it escalates within 15 minutes by opening an issue (GitHub emails the owner), and the 6-hourly triage picks it up. An hourly Claude session would add cost without catching anything sooner.

## Memory: where history lives

- **Reports**: one `daily-report` issue per day (metrics JSON + link to the report page). Closed when the next one is posted.
- **Proposals and decisions**: one `proposal` issue per idea.
  - open = proposed, waiting for the owner
  - closed as completed = accepted (implemented or scheduled)
  - closed as not planned = **rejected: never propose it again** (variants of it included, unless the owner reopens it)
- **Baselines**: `tests/baseline/*.png` (visual), the `METRICS` lines in Nightly logs (performance, Lighthouse, uptime).
- **Prototypes**: `ops/proposals/` (CSS/JS that is not live; applied only in screenshots).

Routines read all of this before proposing anything.

## Rules for the automation

1. Never deploy, merge to `main`, or push to `main`. Work on `claude/*` branches; open draft PRs.
2. Never sign in to, write to, or change the production Supabase project, and never create accounts on the live site. Logged-in testing uses the mocked backend (`tests/mock.js`) until a staging project exists.
3. Never change scoring rules, the autopilot, or the database schema on your own. Database changes are proposals with a reversible migration, and only the owner runs them.
4. Never put secrets, player emails or private player data in issues, PRs, logs or reports. The repository is public.
5. Security findings go to the owner privately (phone notification + private report page), never in a public issue.
6. Escalate at once (phone notification): site down for 2+ checks, saves failing, a wrong leaderboard or round winner, a security problem.
7. Measured findings and design hypotheses are labelled as such. No performance claim without a before/after measurement on the same profile.
8. Keep it recognisably Subar Sitta: `DESIGN.md` is the approved system. No new colours, fonts or motifs without approval.

## Reports

- 14 Oct 2026 (baseline): https://claude.ai/artifact/KsBKM9zjvgfaMF7QjzY31m (private to the owner), evidence in `ops/reports/2026-10-14/`

## Running things yourself

```
npm ci
npm test                 # journeys + visual, mocked (starts its own server)
npm run test:sql         # needs a local Postgres you can createdb on
node tests/serve.js &    # then:
npm run perf             # phone performance baseline
node tests/monitor.js    # live health (needs internet)
```
Visual baselines are made in GitHub's Playwright container, so local screenshot comparisons can differ by a few pixels (system emoji); trust CI. After an approved visual change: `npx playwright test tests/visual.spec.js --update-snapshots`, or push a commit whose message contains `[update-baselines]` and CI regenerates them in its container.

## Access the system still needs (owner action)

| Need | Why | How |
|---|---|---|
| Attach `il3out/subar-sitta` to the three paused routines and enable them | Routine sessions currently start with no GitHub access | claude.ai → Code → Routines |
| Merge the infrastructure PR | Scheduled GitHub workflows only run from `main` | Review and merge |
| Allow `subarsitta.com` and `jjavqcpxyljxprefbtta.supabase.co` in the Claude cloud environment's network settings | Routines can then check the live site directly instead of only through GitHub Actions | Environment settings → Network access → Allowed domains |
| A staging Supabase project (free tier) + one test account | Logged-in journeys (sign-up, save, edit) against real Postgres rules without touching players' data | Create the project, run the two SQL files, share the URL and publishable key |
| Vercel preview deployments for PRs | Each PR gets a link to try before merging | Usually on by default: check Vercel → Project → Git |
| Analytics (optional) | Completion, retention and save-failure rates need real usage data; none is collected today | Decide whether you want privacy-friendly analytics (Vercel Web Analytics, or counts from the database) |
