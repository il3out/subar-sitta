-- ============================================================================
-- SUBAR SITTA · update 02 · open to everyone
-- Paste into Supabase → SQL Editor → New query, then Run. Safe on the live project:
-- it runs as one transaction, changes no existing rows, and stops with a clear
-- message (changing nothing) if two members already share a name.
--
-- What it does
--   1. Anyone signed in can join with a unique username. No invite code, and
--      nobody becomes an admin this way.
--   2. Usernames are unique (ignoring case and outer spaces).
--   3. The table and round scores are computed here, in the database, with the
--      same rules as the app (exact 5, right result 2, Golden Goal settles ties),
--      so phones no longer download every pick.
--   4. Fixtures and results are readable without signing in (for the landing page).
--   5. Live updates no longer broadcast every saved pick to every phone.
-- ============================================================================
begin;

-- ---------------------------------------------------------------- 1. unique usernames
do $$
declare d text;
begin
  select string_agg(k, ', ') into d
  from (select lower(btrim(nick)) k from public.players group by 1 having count(*) > 1) x;
  if d is not null then
    raise exception 'Two members share the name %. Rename one (Table Editor → players → nick), then run this again.', d;
  end if;
end $$;
create unique index players_nick_unique on public.players (lower(btrim(nick)));
-- new and renamed names only (existing rows are not re-checked): no outer or double spaces, no @ < > or control characters
alter table public.players add constraint players_nick_clean
  check (nick = btrim(nick) and nick !~ '\s\s' and nick !~ '[[:cntrl:]<>@]') not valid;

-- ---------------------------------------------------------------- 2. open join
create function public.join_game(username text) returns void
language plpgsql security definer set search_path = public as $$
declare n text := btrim(regexp_replace(coalesce(username, ''), '\s+', ' ', 'g'));
begin
  if auth.uid() is null then raise exception 'Sign in first'; end if;
  if exists (select 1 from players where id = auth.uid()) then return; end if;     -- already playing
  if char_length(n) not between 3 and 20 then raise exception 'Usernames are 3 to 20 characters'; end if;
  if n !~ '^[[:alnum:]][[:alnum:] ._-]*$' then
    raise exception 'Usernames use letters, numbers, spaces, dots, dashes and underscores';
  end if;
  insert into players (id, nick, is_admin) values (auth.uid(), n, false);
exception when unique_violation then
  raise exception 'That username is taken';
end $$;
revoke execute on function public.join_game(text) from public, anon;
grant execute on function public.join_game(text) to authenticated;

-- for the sign-up form: is this username free? (usernames are public on the table anyway)
create function public.username_free(username text) returns boolean
language sql stable security definer set search_path = public as $$
  select not exists (select 1 from players where lower(btrim(nick)) = lower(btrim(username))) $$;

-- ---------------------------------------------------------------- 3. scoring in the database
-- one pick against one result: exact score 5, right result 2, otherwise 0 (as ptsFor in app.js)
create function public.pts(p jsonb, r jsonb) returns int
language sql immutable as $$
  select case
    when jsonb_typeof(p) is distinct from 'array' or jsonb_typeof(r) is distinct from 'array' then 0
    when (p->>0)::int = (r->>0)::int and (p->>1)::int = (r->>1)::int then 5
    when sign((p->>0)::int - (p->>1)::int) = sign((r->>0)::int - (r->>1)::int) then 2
    else 0 end $$;

-- a round counts once all six fixtures have a result or are void, and only after its lock
create function public.round_settled(fx jsonb) returns boolean
language sql immutable as $$
  select jsonb_array_length(fx) = 6 and not exists (
    select 1 from jsonb_array_elements(fx) f
    where jsonb_typeof(f->'res') is distinct from 'array' and not coalesce((f->>'void')::boolean, false)) $$;

-- every member × every counted round. ggd 1000 stands for "no distance" (no pick or no Golden Goal).
create function public.scored_rounds() returns table (
  round_id text, n int, user_id uuid, pts int, ex int, rs int, gg int, ggd int, played boolean, won boolean)
language sql stable security definer set search_path = public as $$
  with r as (
    select id, rounds.n, fixtures, first_goal from rounds
    where public.round_settled(fixtures) and (locked or now() >= deadline)),
  s as (
    select r.id round_id, r.n, p.id user_id, k.s, k.gg, r.first_goal, k.user_id is not null played,
           coalesce((select sum(public.pts(k.s->(f->>'id'), f->'res')) from jsonb_array_elements(r.fixtures) f), 0)::int pts,
           coalesce((select count(*) from jsonb_array_elements(r.fixtures) f where public.pts(k.s->(f->>'id'), f->'res') = 5), 0)::int ex,
           coalesce((select count(*) from jsonb_array_elements(r.fixtures) f where public.pts(k.s->(f->>'id'), f->'res') = 2), 0)::int rs
    from r cross join players p
    left join picks k on k.round_id = r.id and k.user_id = p.id),
  d as (
    select *, case when played and gg is not null and first_goal is not null then abs(gg - first_goal) else 1000 end ggd from s),
  top as (
    select distinct on (round_id) round_id, pts tp, ggd tg from d order by round_id, pts desc, ggd)
  select d.round_id, d.n, d.user_id, d.pts, d.ex, d.rs, d.gg, d.ggd, d.played,
         d.played and top.tp > 0 and d.pts = top.tp and d.ggd = top.tg
  from d join top using (round_id) $$;
revoke execute on function public.scored_rounds() from public, anon, authenticated;

-- the table: top `lim` rows plus your own row. Same order as the app: points, exact scores, rounds won.
-- move = places gained since the previous counted round (null after the first).
create function public.leaderboard(lim int default 100) returns table (
  rank int, user_id uuid, nick text, member_no int, joined_at timestamptz, is_admin boolean,
  pts int, ex int, rs int, won int, played int, last_pts int, move int, hist jsonb)
language sql stable security definer set search_path = public as $$
  -- ponytail: recomputes from picks on every call; materialise per round if players reach the tens of thousands
  with sr as materialized (select * from scored_rounds() where public.is_member()),
  lastn as (select max(n) n, count(distinct n) c from sr),
  agg as (
    select p.id, p.nick, p.joined_at, p.is_admin,
           row_number() over (order by p.joined_at, p.id)::int member_no,
           coalesce(sum(x.pts), 0)::int pts, coalesce(sum(x.ex), 0)::int ex, coalesce(sum(x.rs), 0)::int rs,
           (count(*) filter (where x.won))::int won, (count(*) filter (where x.played))::int played,
           (max(x.pts) filter (where x.n = l.n))::int last_pts,
           coalesce(sum(x.pts) filter (where x.n < l.n), 0)::int ppts,
           coalesce(sum(x.ex) filter (where x.n < l.n), 0)::int pex,
           (count(*) filter (where x.won and x.n < l.n))::int pwon,
           coalesce(jsonb_agg(jsonb_build_object('n', x.n, 'pts', x.pts) order by x.n) filter (where x.n is not null), '[]') hist
    from players p cross join lastn l left join sr x on x.user_id = p.id
    where public.is_member()
    group by p.id),
  ranked as (
    select a.*, row_number() over (order by a.pts desc, a.ex desc, a.won desc, a.joined_at, a.id)::int rk,
                row_number() over (order by a.ppts desc, a.pex desc, a.pwon desc, a.joined_at, a.id)::int prk
    from agg a)
  select r.rk, r.id, r.nick, r.member_no, r.joined_at, r.is_admin, r.pts, r.ex, r.rs, r.won, r.played, r.last_pts,
         case when (select c from lastn) > 1 then r.prk - r.rk end, r.hist
  from ranked r where r.rk <= lim or r.id = auth.uid()
  order by r.rk $$;
revoke execute on function public.leaderboard(int) from public, anon;
grant execute on function public.leaderboard(int) to authenticated;

-- one round, everyone who played it, best first. Runs with the caller's rights, so the
-- usual rule applies: before the lock you only ever get your own row back.
create function public.round_board(rid text) returns table (
  user_id uuid, nick text, s jsonb, gg int, at timestamptz, pts int, ex int, rs int, ggd int)
language sql stable set search_path = public as $$
  select k.user_id, p.nick, k.s, k.gg, coalesce(ps.last_at, k.at),
         x.pts::int, x.ex::int, x.rs::int,
         case when k.gg is not null and r.first_goal is not null then abs(k.gg - r.first_goal) else 1000 end
  from picks k
  join rounds r on r.id = k.round_id
  join players p on p.id = k.user_id
  left join pick_status ps on ps.user_id = k.user_id and ps.round_id = k.round_id
  cross join lateral (
    select coalesce(sum(public.pts(k.s->(f->>'id'), f->'res')), 0) pts,
           count(*) filter (where public.pts(k.s->(f->>'id'), f->'res') = 5) ex,
           count(*) filter (where public.pts(k.s->(f->>'id'), f->'res') = 2) rs
    from jsonb_array_elements(r.fixtures) f) x
  where k.round_id = rid
  order by x.pts desc, 9, p.nick $$;
revoke execute on function public.round_board(text) from public, anon;
grant execute on function public.round_board(text) to authenticated;

-- ---------------------------------------------------------------- 4. fixtures are public
drop policy rounds_read on public.rounds;
create policy rounds_read on public.rounds for select using (true);

-- ---------------------------------------------------------------- 5. lighter live updates
-- rounds, league and "Who's in" stay live; individual picks and the member list no longer fan out to every phone
alter publication supabase_realtime drop table public.picks, public.players;

commit;
