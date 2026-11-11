-- update-05: API-Football Pro (7,500 requests a day, from 11 Nov 2026 for 3 months).
-- Live scores every minute instead of every 5; the site's own daily cap goes from 80 to 7,000.
-- Run once in the Supabase SQL editor. Safe to re-run. To go back to the free plan, re-run update-04.

create or replace function public.af_get(path text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare k text; st int; body text; j jsonb;
begin
  update league set calls_today = case when calls_day = current_date then calls_today else 0 end,
                    calls_day = current_date where id = 1;
  if (select calls_today from league where id = 1) >= 7000 then
    raise exception 'Daily API budget used (7,000 requests); waiting for tomorrow';
  end if;
  select decrypted_secret into k from vault.decrypted_secrets where name = 'api_football_key' limit 1;
  if k is null then raise exception 'API-Football key missing: add it with vault.create_secret (see setup steps)'; end if;
  update league set calls_today = calls_today + 1 where id = 1;
  perform extensions.http_set_curlopt('CURLOPT_TIMEOUT', '25');
  select status, content into st, body
    from extensions.http(('GET', 'https://v3.football.api-sports.io/' || path,
          array[extensions.http_header('x-apisports-key', k)], null, null)::extensions.http_request);
  if st <> 200 then raise exception 'API-Football answered HTTP %', st; end if;
  j := body::jsonb;
  if jsonb_typeof(j->'errors') = 'object' and j->'errors' <> '{}'::jsonb
     or jsonb_typeof(j->'errors') = 'array' and jsonb_array_length(j->'errors') > 0 then
    raise exception 'API-Football error: %', j->'errors';
  end if;
  return j;
end $$;

create or replace function public.autopilot() returns text
language plpgsql security definer set search_path = public as $$
declare L league; r rounds; msg text := ''; used int; roomy boolean;
begin
  select * into L from league where id = 1 for update;              -- one run at a time
  if not L.auto then return 'Autopilot is off'; end if;
  used := case when L.calls_day = current_date then L.calls_today else 0 end;
  -- ponytail: live checks every minute while the day's budget allows; past 6,000 requests it falls back to
  -- one check ~2 h after kick-off (final scores only).
  roomy := used < 6000;
  -- 1. rounds past their lock with a match under way (live) or that should be over (budget tight)
  for r in select * from rounds where settled_at is null and (locked or deadline <= now()) order by n loop
    continue when not exists (select 1 from jsonb_array_elements(r.fixtures) x
               where x->>'api' is not null and x->>'res' is null and not coalesce((x->>'void')::boolean, false)
                 and (x->>'ko')::timestamptz + case when roomy then interval '0' else interval '115 minutes' end < now());
    continue when r.refreshed_at > now() - case when roomy then interval '50 seconds' else interval '9 minutes' end;
    begin
      perform refresh_round(r.id);
      msg := msg || format('Checked scores for round %s. ', r.n);
    exception when others then
      msg := msg || format('Round %s: %s. ', r.n, sqlerrm);
      update rounds set refreshed_at = now() where id = r.id;            -- wait before retrying
      perform count_failed_call();
    end;
  end loop;
  -- 2. the open round: re-check kick-off times once a day (one request per match)
  for r in select * from rounds where now() < deadline and not locked
             and coalesce(refreshed_at, '-infinity') < now() - interval '24 hours'
             and exists (select 1 from jsonb_array_elements(fixtures) x where x->>'api' is not null) loop
    begin
      perform refresh_round(r.id);
      msg := msg || format('Refreshed kick-off times for round %s. ', r.n);
    exception when others then
      msg := msg || format('Round %s: %s. ', r.n, sqlerrm);
      update rounds set refreshed_at = now() where id = r.id;
      perform count_failed_call();
    end;
  end loop;
  -- 3. no open round → open the next one (look at most every 6 hours unless a round just settled)
  if not exists (select 1 from rounds where now() < deadline and not locked)
     and (L.last_scan is null or L.last_scan < now() - interval '6 hours'
          or exists (select 1 from rounds where settled_at > coalesce(L.last_scan, '-infinity'))) then
    begin
      msg := msg || open_next_round();
    exception when others then
      msg := msg || 'Next round: ' || sqlerrm;
      update league set last_scan = now() - interval '5 hours' where id = 1;  -- retry in an hour
      perform count_failed_call();
    end;
  end if;
  if msg <> '' then update league set status = btrim(msg), status_at = now() where id = 1; end if;
  return coalesce(nullif(btrim(msg), ''), 'Nothing to do');
end $$;

revoke execute on function public.af_get(text), public.autopilot() from public, anon, authenticated;

-- every minute (was 5)
select cron.alter_job(jobid, schedule := '* * * * *') from cron.job where jobname = 'subar-sitta-autopilot';
