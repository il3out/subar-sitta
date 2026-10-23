-- update-03: live scores during matches.
-- While a match is in play the fixture carries live:[h,a], min (minute) and st (API status);
-- these are display only. Points still come from res, which is written at full time.
-- The autopilot now checks every 5 minutes from kick-off (was: once, about 2 hours after kick-off).
-- Run once in the Supabase SQL editor. Safe to re-run.

create or replace function public.refresh_round(rid text) returns void
language plpgsql security definer set search_path = public as $$
declare r rounds; j jsonb; fx jsonb := '[]'; f jsonb; a jsonb; st text; done boolean; fg int;
begin
  select * into r from rounds where id = rid;
  j := af_get('fixtures?ids=' || (select string_agg(x->>'api', '-') from jsonb_array_elements(r.fixtures) x));
  for f in select * from jsonb_array_elements(r.fixtures) loop
    select x into a from jsonb_array_elements(j->'response') x where (x->'fixture'->>'id') = f->>'api';
    if a is not null and f->>'res' is null and not coalesce((f->>'void')::boolean, false) then
      st := a->'fixture'->'status'->>'short';
      if st in ('FT', 'AET', 'PEN') then
        f := (f - 'live' - 'min' - 'st') || jsonb_build_object('res', jsonb_build_array((a->'goals'->>'home')::int, (a->'goals'->>'away')::int),
                                     'fg', public.first_goal_min(a->'events'));
      elsif st in ('1H', 'HT', '2H', 'ET', 'BT', 'P', 'LIVE', 'INT', 'SUSP') then
        f := f || jsonb_build_object('live', jsonb_build_array(coalesce((a->'goals'->>'home')::int, 0), coalesce((a->'goals'->>'away')::int, 0)),
                                     'min', (a->'fixture'->'status'->>'elapsed')::int, 'st', st);
      elsif st in ('PST', 'CANC', 'ABD', 'AWD', 'WO')
            or (f->>'ko')::timestamptz < now() - interval '3 days' then
        f := (f - 'live' - 'min' - 'st') || '{"void":true}';        -- postponed / abandoned: counts for nobody
      elsif st in ('NS', 'TBD') then
        f := f || jsonb_build_object('ko', a->'fixture'->>'date');   -- kick-off moved
      end if;
    end if;
    fx := fx || jsonb_build_array(f);
  end loop;
  done := not exists (select 1 from jsonb_array_elements(fx) x
                      where x->>'res' is null and not coalesce((x->>'void')::boolean, false));
  select min((x->>'fg')::int) into fg from jsonb_array_elements(fx) x where not coalesce((x->>'void')::boolean, false);
  update rounds set fixtures = fx, refreshed_at = now(),
    deadline = case when now() < deadline then coalesce((select min((x->>'ko')::timestamptz) from jsonb_array_elements(fx) x
                                                         where not coalesce((x->>'void')::boolean, false)), deadline)
                    else deadline end,
    first_goal = case when done then coalesce(fg, 90) else first_goal end,     -- goalless round → 90
    settled_at = case when done then now() else null end
  where id = rid;
end $$;

create or replace function public.autopilot() returns text
language plpgsql security definer set search_path = public as $$
declare L league; r rounds; msg text := ''; used int; roomy boolean;
begin
  select * into L from league where id = 1 for update;              -- one run at a time
  if not L.auto then return 'Autopilot is off'; end if;
  used := case when L.calls_day = current_date then L.calls_today else 0 end;
  -- ponytail: live checks every ~5 min while the day's budget allows; past 60 requests it falls back to
  -- one check ~2 h after kick-off (final scores only). A paid API plan + a 1-minute cron makes it minute-by-minute.
  roomy := used < 60;
  -- 1. rounds past their lock with a match under way (live) or that should be over (budget tight)
  for r in select * from rounds where settled_at is null and (locked or deadline <= now()) order by n loop
    continue when not exists (select 1 from jsonb_array_elements(r.fixtures) x
               where x->>'api' is not null and x->>'res' is null and not coalesce((x->>'void')::boolean, false)
                 and (x->>'ko')::timestamptz + case when roomy then interval '0' else interval '115 minutes' end < now());
    continue when r.refreshed_at > now() - case when roomy then interval '4 minutes' else interval '9 minutes' end;
    begin
      perform refresh_round(r.id);
      msg := msg || format('Checked scores for round %s. ', r.n);
    exception when others then
      msg := msg || format('Round %s: %s. ', r.n, sqlerrm);
      update rounds set refreshed_at = now() where id = r.id;            -- wait before retrying
      update league set calls_today = calls_today + 1 where id = 1;      -- a failed request still counts
    end;
  end loop;
  -- 2. the open round: re-check kick-off times twice a day
  for r in select * from rounds where now() < deadline and not locked
             and coalesce(refreshed_at, '-infinity') < now() - interval '12 hours'
             and exists (select 1 from jsonb_array_elements(fixtures) x where x->>'api' is not null) loop
    begin
      perform refresh_round(r.id);
      msg := msg || format('Refreshed kick-off times for round %s. ', r.n);
    exception when others then msg := msg || format('Round %s: %s. ', r.n, sqlerrm);
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
      update league set last_scan = now() - interval '5 hours', calls_today = calls_today + 1 where id = 1;  -- retry in an hour
    end;
  end if;
  if msg <> '' then update league set status = btrim(msg), status_at = now() where id = 1; end if;
  return coalesce(nullif(btrim(msg), ''), 'Nothing to do');
end $$;

revoke execute on function public.refresh_round(text), public.autopilot() from public, anon, authenticated;

-- every 5 minutes (was 10)
select cron.alter_job(jobid, schedule := '*/5 * * * *') from cron.job where jobname = 'subar-sitta-autopilot';
