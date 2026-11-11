-- update-04: work within API-Football's free plan (since 8 Nov 2026 it refuses `fixtures?ids=`,
-- this season's league/date queries and standings). Scores now come from requests the free plan allows:
--   * fixtures?live=all  — one request per check covers every match in play
--   * fixtures?id=N      — one match: final score + goal events, a moved kick-off, a postponement
-- Also: failed requests now count towards the day's budget (they used to be rolled back, so the
-- autopilot retried every 5 minutes for days), and the open round's kick-off check runs once a day.
-- Run once in the Supabase SQL editor. Safe to re-run.

create or replace function public.refresh_round(rid text) returns void
language plpgsql security definer set search_path = public as $$
declare r rounds; live jsonb; fx jsonb := '[]'; f jsonb; a jsonb; st text; done boolean; fg int; open_round boolean;
begin
  select * into r from rounds where id = rid;
  open_round := now() < r.deadline;                 -- before the lock we only check kick-off times
  if not open_round and exists (select 1 from jsonb_array_elements(r.fixtures) x
       where x->>'api' is not null and x->>'res' is null and not coalesce((x->>'void')::boolean, false)
         and (x->>'ko')::timestamptz between now() - interval '3 hours' and now()) then
    live := af_get('fixtures?live=all')->'response';
  end if;
  for f in select * from jsonb_array_elements(r.fixtures) loop
    a := null;
    if f->>'api' is not null and f->>'res' is null and not coalesce((f->>'void')::boolean, false) then
      if live is not null then
        select x into a from jsonb_array_elements(live) x where x->'fixture'->>'id' = f->>'api';
      end if;
      -- not in play: look it up on its own when it was in play, should be over, or (open round) to check the kick-off
      if a is null and (open_round or f ? 'live' or (f->>'ko')::timestamptz < now() - interval '115 minutes') then
        a := af_get('fixtures?id=' || (f->>'api'))->'response'->0;
      end if;
    end if;
    if a is not null then
      st := a->'fixture'->'status'->>'short';
      if st in ('FT', 'AET', 'PEN') then
        if a->'events' is null then a := af_get('fixtures?id=' || (f->>'api'))->'response'->0; end if;
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

-- a failed request is rolled back with the work around it, so count it here (on today's tally)
create or replace function public.count_failed_call() returns void
language sql security definer set search_path = public as $$
  update league set calls_today = case when calls_day = current_date then calls_today else 0 end + 1,
                    calls_day = current_date where id = 1;
$$;

create or replace function public.autopilot() returns text
language plpgsql security definer set search_path = public as $$
declare L league; r rounds; msg text := ''; used int; roomy boolean;
begin
  select * into L from league where id = 1 for update;              -- one run at a time
  if not L.auto then return 'Autopilot is off'; end if;
  used := case when L.calls_day = current_date then L.calls_today else 0 end;
  -- ponytail: live checks every ~5 min while the day's budget allows; past 60 requests it falls back to
  -- one check ~2 h after kick-off (final scores only).
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

revoke execute on function public.refresh_round(text), public.autopilot(), public.count_failed_call() from public, anon, authenticated;
