# Subar Sitta

Six Premier League fixtures a round. One table. Open to everyone at subarsitta.com.

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
1. **Authentication → Sign In / Providers → Email**: "Confirm email" stays **off** unless a custom email sender (SMTP) is set up; the built-in sender only manages a couple of emails an hour.
2. **Authentication → URL Configuration**: set **Site URL** to `https://subarsitta.com`. Password-reset links use it.
3. **SQL Editor → New query**: paste all of `supabase/setup.sql` and click **Run**, then do the same with `supabase/update-02-public.sql`.
4. **SQL Editor → New query**: run this with your API-Football key. The key goes into Supabase's encrypted Vault and is never in the code:
   ```sql
   select vault.create_secret('YOUR_API_FOOTBALL_KEY', 'api_football_key');
   ```
5. Still in the SQL Editor, run the autopilot once by hand:
   ```sql
   select public.autopilot();
   ```

### 2. Vercel
1. **Add New → Project**, then import this repository.
2. Set Framework Preset to **Other**. Leave the build command empty and keep the output directory as the root. Click **Deploy**.
3. **Settings → Domains**: add `subarsitta.com`, then copy the DNS records Vercel shows into your domain registrar.

### Email notifications (optional)
Players can switch on emails (off by default): a new round is open, a reminder 3 hours before the lock if they haven't picked all six, and their result. Every email has a one-tap unsubscribe link. Emails go through [Resend](https://resend.com) (free up to 100 a day, 3,000 a month).
1. Resend → **Domains** → add `subarsitta.com` and copy the DNS records it shows into your domain registrar. Wait until Resend says *Verified*.
2. Resend → **API Keys** → create a key with *Sending access*.
3. Supabase → **SQL Editor**: `select vault.create_secret('YOUR_RESEND_KEY', 'resend_api_key');`
4. Supabase → **SQL Editor**: paste all of `supabase/update-04-notifications.sql` and click **Run**.
Until step 4 is done the website hides the email switch, so the site can go live before emails are set up.

### 3. Make yourself admin
Sign up on the site, then in the SQL Editor:
```sql
update public.players set is_admin = true where nick = 'YOUR USERNAME';
```

### 4. Bot protection (recommended once public)
1. Cloudflare → Turnstile → add the site `subarsitta.com`; copy the site key and secret key.
2. Put the site key in `config.js` as `turnstile: "…"` and deploy.
3. Supabase → Authentication → Attack Protection → enable CAPTCHA, provider Turnstile, paste the secret key.
Do 2 before 3, or sign-ins fail until the new `config.js` is live.

## Files
- `index.html`: the whole app (design, logic, copy)
- `config.js`: the Supabase project URL, publishable key and (optional) Turnstile site key. All public by design; the database rules protect the data.
- `supabase/setup.sql`: tables, access rules, autopilot and schedule
- `supabase/update-02-public.sql`: open sign-up with unique usernames, the table and round scores computed in the database, public fixtures
- `crests/`, `mark.svg`, icons: brand and club artwork
- `fonts/`: Anton, Barlow and Barlow Condensed, SIL Open Font License 1.1 (licences alongside)
- `brand/`: SUBAR 6 logo SVGs (hero, badge, wordmark, monogram, app icon)
- `vendor/supabase.js`: the Supabase browser library (MIT)

## Changing things later
- **Season rollover:** set the new season in the database:
  ```sql
  update public.league set season = '2027/28', api_season = 2027;
  ```
- **Pause automation:** use the Admin → Autopilot switch. You can still enter results and open rounds by hand on the same page.

## Tests and monitoring
`ops/README.md` describes the automated checks (CI, 15-minute live monitor, nightly regression), the scheduled Claude routines and their rules. Tooling lives in `tests/`, `.github/` and `ops/` and is never deployed (see `.vercelignore`).
