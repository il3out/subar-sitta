# Subar Sitta

The private game. Six Premier League fixtures a round, one inner circle.

A static web app (no build step) on Vercel, with Supabase for sign-in, data and the autopilot.

## How it runs itself

Every 10 minutes the database runs `public.autopilot()`. It:

1. **Opens the next round** when none is open. It picks the six fixtures in the next gameweek whose two clubs have the best combined league position, and sets the deadline to the first kick-off.
2. **Locks it**: the database refuses any pick saved after the deadline.
3. **Settles results**: about two hours after each kick-off it fetches final scores and goal events from API-Football. When all six matches are in, it records the Golden Goal, using these rules:
   - The Golden Goal is the earliest goal across the six matches.
   - Own goals count.
   - Missed penalties don't count.
   - A stoppage-time goal counts as its base minute: 45+2′ counts as 45, 90+3′ as 90.
   - A round with no goals at all counts as 90.
4. **Handles postponed or abandoned matches**: they are voided, so they score for nobody.

It makes a handful of API requests a day and stops itself at 80, under the free plan's 100. The admin page shows the last action, the requests used today, an on/off switch and a *Run now* button.

## One-time setup

### 1. Supabase
1. **Authentication → Sign In / Providers → Email**: turn **off** "Confirm email". Friends join with an invite code, so email confirmation isn't needed, and the free email service only sends a few emails an hour.
2. **Authentication → URL Configuration**: set **Site URL** to `https://subarsitta.com`. Password-reset links use it.
3. **SQL Editor → New query**: paste all of `supabase/setup.sql` and click **Run**.
4. **SQL Editor → New query**: run this with your API-Football key. The key goes into Supabase's encrypted Vault and is never in the code:
   ```sql
   select vault.create_secret('YOUR_API_FOOTBALL_KEY', 'api_football_key');
   ```
5. Still in the SQL Editor, run the autopilot once by hand and read your invite code:
   ```sql
   select public.autopilot();
   select invite_code from public.league_secret;
   ```

### 2. Vercel
1. **Add New → Project**, then import this repository.
2. Set Framework Preset to **Other**. Leave the build command empty and keep the output directory as the root. Click **Deploy**.
3. **Settings → Domains**: add `subarsitta.com`, then copy the DNS records Vercel shows into your domain registrar.

### 3. Join first
Open the site, choose **Join**, and use the invite code. **The first person to join becomes the admin**, so join before you share the code.

## Files
- `index.html`: the whole app (design, logic, copy)
- `config.js`: the Supabase project URL and publishable key. Both are public by design; the database rules protect the data.
- `supabase/setup.sql`: tables, access rules, invite join, autopilot and schedule
- `crests/`, `six.webp`, `six-mark.webp`, icons: brand and club artwork
- `Basic-Regular.ttf` and `Basic-OFL.txt`: the Basic typeface (Sorkin Type, SIL Open Font License 1.1)
- `vendor/supabase.js`: the Supabase browser library (MIT)

## Changing things later
- **Season rollover:** set the new season in the database:
  ```sql
  update public.league set season = '2027/28', api_season = 2027;
  ```
- **Pause automation:** use the Admin → Autopilot switch. You can still enter results and open rounds by hand on the same page.
- **New invite code:** Admin → Invite code → New code. The old code stops working.
