-- ============================================================================
-- SUBAR SITTA · database setup
-- Paste this whole file into Supabase → SQL Editor → New query, then Run.
-- Run it once on an empty project. It creates the tables, access rules, the
-- invite-code join, and the autopilot that opens rounds and settles results.
-- ============================================================================

create extension if not exists http with schema extensions;
create extension if not exists pg_cron;

-- ---------------------------------------------------------------- tables
create table public.league (
  id             int primary key default 1 check (id = 1),
  season         text not null default '2026/27',
  api_season     int  not null default 2026,        -- API-Football season year
  current_round  text,
  auto           boolean not null default true,     -- autopilot on/off
  calls_day      date,
  calls_today    int not null default 0,
  last_scan      timestamptz,                        -- last look for the next gameweek
  status         text,                               -- last autopilot message
  status_at      timestamptz
);
insert into public.league default values;

-- the invite code lives in its own table with no read access from the app
create table public.league_secret (
  id          int primary key default 1 check (id = 1),
  invite_code text not null
);
insert into public.league_secret values (1, upper(substr(md5(random()::text), 1, 6)));

create function public.valid_s(s jsonb) returns boolean
language sql immutable as $$
  select jsonb_typeof(s) = 'object' and not exists (
    select 1 from jsonb_each(s) e
    where e.key !~ '^f[1-6]$'
       or jsonb_typeof(e.value) <> 'array' or jsonb_array_length(e.value) <> 2
       or (e.value->>0) !~ '^(1?[0-9]|20)$' or (e.value->>1) !~ '^(1?[0-9]|20)$'
       or jsonb_typeof(e.value->0) <> 'number' or jsonb_typeof(e.value->1) <> 'number')
$$;

create table public.rounds (
  id          text primary key,                      -- r1, r2, …
  n           int  not null unique,
  deadline    timestamptz not null,                  -- picks lock here (first kick-off)
  locked      boolean not null default false,        -- manual early lock
  first_goal  int check (first_goal between 1 and 90),
  fixtures    jsonb not null,                        -- [{id:f1,h,a,hn,an,ko,res,api,fg,void}]
  settled_at  timestamptz,
  refreshed_at timestamptz,
  created_at  timestamptz not null default now()
);

create table public.players (
  id        uuid primary key references auth.users on delete cascade,
  nick      text not null check (char_length(btrim(nick)) between 2 and 24),
  is_admin  boolean not null default false,
  joined_at timestamptz not null default now()
);

create table public.picks (
  user_id  uuid not null references public.players on delete cascade,
  round_id text not null references public.rounds on delete cascade,
  s        jsonb not null default '{}' check (public.valid_s(s)),   -- {f1:[2,1], …}
  gg       int check (gg between 1 and 90),                         -- Golden Goal minute
  at       timestamptz not null default now(),
  primary key (user_id, round_id)
);

-- server clock stamps every save
create function public.picks_stamp() returns trigger language plpgsql as $$
begin new.at := now(); return new; end $$;
create trigger picks_stamp before insert or update on public.picks
  for each row execute function public.picks_stamp();

-- ---------------------------------------------------------------- helpers
create function public.is_member() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from players where id = auth.uid()) $$;

create function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from players where id = auth.uid() and is_admin) $$;

-- open = before the deadline and not locked early. The database, not the app, decides.
create function public.round_open(r text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from rounds where id = r and not locked and now() < deadline) $$;

-- ---------------------------------------------------------------- access rules
alter table public.league        enable row level security;
alter table public.league_secret enable row level security;   -- no policies: unreadable
alter table public.rounds        enable row level security;
alter table public.players       enable row level security;
alter table public.picks         enable row level security;

create policy league_read   on public.league  for select using (public.is_member());
create policy league_admin  on public.league  for update using (public.is_admin()) with check (public.is_admin());

create policy rounds_read   on public.rounds  for select using (public.is_member());
create policy rounds_insert on public.rounds  for insert with check (public.is_admin());
create policy rounds_update on public.rounds  for update using (public.is_admin()) with check (public.is_admin());
create policy rounds_delete on public.rounds  for delete using (public.is_admin());

create policy players_read  on public.players for select using (public.is_member());
create policy players_nick  on public.players for update using (id = auth.uid()) with check (id = auth.uid());
revoke update on public.players from anon, authenticated;
grant  update (nick) on public.players to authenticated;       -- nobody can make themselves admin

-- your own picks always; everyone else's only once that round has locked
create policy picks_read    on public.picks for select
  using (user_id = auth.uid() or (public.is_member() and not public.round_open(round_id)));
create policy picks_insert  on public.picks for insert
  with check (user_id = auth.uid() and public.is_member() and public.round_open(round_id));
create policy picks_update  on public.picks for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and public.round_open(round_id));

revoke all on public.league_secret from anon, authenticated;

-- ---------------------------------------------------------------- app functions
-- join with the invite code; the very first member becomes the admin
create function public.join_league(code text, nick text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Sign in first'; end if;
  if not exists (select 1 from league_secret where upper(invite_code) = upper(btrim(code))) then
    raise exception 'That invite code is not right';
  end if;
  insert into players (id, nick, is_admin)
  values (auth.uid(), btrim(nick), not exists (select 1 from players))
  on conflict (id) do update set nick = excluded.nick;
end $$;

-- how many members have saved picks (shown before the lock, without revealing them)
create function public.pick_count(r text) returns int
language sql stable security definer set search_path = public as $$
  select case when public.is_member() then (select count(*)::int from picks where round_id = r) end $$;

create function public.invite_code() returns text
language sql stable security definer set search_path = public as $$
  select case when public.is_admin() then (select invite_code from league_secret) end $$;

create function public.new_invite_code() returns text
language plpgsql security definer set search_path = public as $$
declare c text := upper(substr(md5(random()::text), 1, 6));
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  update league_secret set invite_code = c where id = 1;
  return c;
end $$;

-- ---------------------------------------------------------------- autopilot
-- API-Football names → the app's club codes
create function public.club_code(nm text) returns text
language sql immutable as $$
  select coalesce((select code from (values
    ('arsenal','ARS'),('aston villa','AVL'),('bournemouth','BOU'),('brentford','BRE'),('brighton','BRI'),
    ('chelsea','CFC'),('coventry','COV'),('crystal palace','CRY'),('everton','EVE'),('fulham','FUL'),
    ('hull','HUL'),('ipswich','IPS'),('leeds','LEE'),('leicester','LEI'),('liverpool','LFC'),
    ('manchester city','MCI'),('manchester united','MUN'),('newcastle','NEW'),('nottingham','NFO'),
    ('southampton','SOU'),('sunderland','SUN'),('tottenham','TOT'),('west ham','WHU'),('wolves','WOL'),
    ('wolverhampton','WOL'),('burnley','BUR'),('sheffield','SHU'),('luton','LUT'),('norwich','NOR'),
    ('watford','WAT'),('middlesbrough','MID'),('west brom','WBA'),('stoke','STK'),('swansea','SWA'),
    ('cardiff','CAR'),('millwall','MIL'),('derby','DER'),('portsmouth','POR'),('wrexham','WRE')
  ) m(prefix, code) where lower(nm) like prefix || '%' order by length(prefix) desc limit 1),
  upper(left(regexp_replace(nm, '[^A-Za-z]', '', 'g'), 3)))
$$;

-- one API-Football request. Keeps a daily budget well under the free 100/day.
create function public.af_get(path text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare k text; st int; body text; j jsonb;
begin
  update league set calls_today = case when calls_day = current_date then calls_today else 0 end,
                    calls_day = current_date where id = 1;
  if (select calls_today from league where id = 1) >= 80 then
    raise exception 'Daily API budget used (80 requests); waiting for tomorrow';
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

-- first goal of one match from its events: own goals count, missed penalties don't,
-- stoppage time counts as the base minute (45+2 → 45, 90+3 → 90)
create function public.first_goal_min(events jsonb) returns int
language sql immutable as $$
  select min(least(90, greatest(1, (e->'time'->>'elapsed')::int)))
  from jsonb_array_elements(coalesce(events, '[]'::jsonb)) e
  where e->>'type' = 'Goal' and coalesce(e->>'detail', '') <> 'Missed Penalty'
$$;

-- refresh one round's fixtures from the API (one request for all six, events included)
create function public.refresh_round(rid text) returns void
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
        f := f || jsonb_build_object('res', jsonb_build_array((a->'goals'->>'home')::int, (a->'goals'->>'away')::int),
                                     'fg', public.first_goal_min(a->'events'));
      elsif st in ('PST', 'CANC', 'ABD', 'AWD', 'WO')
            or (f->>'ko')::timestamptz < now() - interval '3 days' then
        f := f || '{"void":true}';                                  -- postponed / abandoned: counts for nobody
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

-- open the next round: the six matches between the highest-placed teams in the next gameweek
create function public.open_next_round() returns text
language plpgsql security definer set search_path = public as $$
declare L league; up jsonb; tbl jsonb; label text; pick jsonb; n int; rid text; dl timestamptz;
begin
  select * into L from league where id = 1;
  up := af_get(format('fixtures?league=39&season=%s&next=40', L.api_season));
  -- unused, not-yet-started fixtures at least an hour away
  with c as (
    select x, x->'league'->>'round' as lbl, (x->'fixture'->>'date')::timestamptz as ko
    from jsonb_array_elements(up->'response') x
    where x->'fixture'->'status'->>'short' = 'NS'
      and (x->'fixture'->>'date')::timestamptz > now() + interval '1 hour'
      and not exists (select 1 from rounds r, jsonb_array_elements(r.fixtures) y where y->>'api' = x->'fixture'->>'id'))
  select lbl into label from c group by lbl having count(*) >= 6 order by min(ko) limit 1;
  if label is null then
    update league set last_scan = now() where id = 1;
    return 'No upcoming gameweek with six open fixtures yet';
  end if;
  tbl := af_get(format('standings?league=39&season=%s', L.api_season));
  with rk as (
    select (t->'team'->>'id') as tid, (t->>'rank')::int as rank
    from jsonb_array_elements(coalesce(tbl->'response'->0->'league'->'standings'->0, '[]'::jsonb)) t),
  c as (
    select x, (x->'fixture'->>'date')::timestamptz as ko,
           coalesce((select rank from rk where tid = x->'teams'->'home'->>'id'), 10)
         + coalesce((select rank from rk where tid = x->'teams'->'away'->>'id'), 10) as score
    from jsonb_array_elements(up->'response') x
    where x->'league'->>'round' = label and x->'fixture'->'status'->>'short' = 'NS'
      and (x->'fixture'->>'date')::timestamptz > now() + interval '1 hour'
      and not exists (select 1 from rounds r, jsonb_array_elements(r.fixtures) y where y->>'api' = x->'fixture'->>'id')),
  top as (select * from c order by score, ko limit 6)
  select jsonb_agg(jsonb_build_object(
           'id', 'f' || rn, 'api', (x->'fixture'->>'id')::bigint,
           'h', club_code(x->'teams'->'home'->>'name'), 'a', club_code(x->'teams'->'away'->>'name'),
           'hn', x->'teams'->'home'->>'name', 'an', x->'teams'->'away'->>'name',
           'ko', x->'fixture'->>'date', 'res', null) order by rn), min(ko)
    into pick, dl
  from (select *, row_number() over (order by ko, score) rn from top) t;
  select coalesce(max(rounds.n), 0) + 1 into n from rounds;
  rid := 'r' || n;
  insert into rounds (id, n, deadline, fixtures, refreshed_at) values (rid, n, dl, pick, now());
  update league set current_round = rid, last_scan = now() where id = 1;
  return format('Opened round %s (%s)', n, label);
end $$;

-- the scheduled job: settle what has finished, keep kick-off times fresh, open the next round.
-- Each step is fenced on its own, so one failed request never undoes another step's work.
create function public.autopilot() returns text
language plpgsql security definer set search_path = public as $$
declare L league; r rounds; msg text := '';
begin
  select * into L from league where id = 1 for update;              -- one run at a time
  if not L.auto then return 'Autopilot is off'; end if;
  -- 1. rounds past their lock with a match that should be over (about 2 hours after kick-off)
  for r in select * from rounds where settled_at is null and (locked or deadline <= now()) order by n loop
    continue when not exists (select 1 from jsonb_array_elements(r.fixtures) x
               where x->>'api' is not null and x->>'res' is null and not coalesce((x->>'void')::boolean, false)
                 and (x->>'ko')::timestamptz + interval '115 minutes' < now());
    continue when r.refreshed_at > now() - interval '9 minutes';
    begin
      perform refresh_round(r.id);
      msg := msg || format('Checked results for round %s. ', r.n);
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

-- admin button "Run autopilot now"
create function public.run_autopilot() returns text
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  return public.autopilot();
end $$;

-- only the scheduler and admins can run the autopilot or spend API requests
revoke execute on function public.af_get(text), public.refresh_round(text), public.open_next_round(),
  public.autopilot() from public, anon, authenticated;

-- ---------------------------------------------------------------- live updates
alter publication supabase_realtime add table public.league, public.rounds, public.players, public.picks;

-- ---------------------------------------------------------------- schedule: every 10 minutes
select cron.schedule('subar-sitta-autopilot', '*/10 * * * *', $$select public.autopilot()$$);
