-- Scoring, Golden Goal, winners, table order and access rules, checked against the README rules.
-- Any failed check stops the run with the message.
\set ON_ERROR_STOP 1
create function pg_temp.ok(c boolean, msg text) returns void language plpgsql as
  $$ begin if c is not true then raise exception 'FAIL: %', msg; end if; end $$;

-- ---------------------------------------------------------------- pts: exact 5, right result 2
select pg_temp.ok(public.pts('[2,1]', '[2,1]') = 5, 'exact score is 5');
select pg_temp.ok(public.pts('[3,0]', '[2,1]') = 2, 'right home win is 2');
select pg_temp.ok(public.pts('[1,1]', '[0,0]') = 2, 'any draw on a draw is 2');
select pg_temp.ok(public.pts('[0,0]', '[0,0]') = 5, '0-0 on 0-0 is exact');
select pg_temp.ok(public.pts('[0,1]', '[2,1]') = 0, 'wrong result is 0');
select pg_temp.ok(public.pts(null, '[0,0]') = 0, 'no pick is not 0-0: scores 0');
select pg_temp.ok(public.pts('[1,0]', null) = 0, 'no result (void) scores 0');

-- ---------------------------------------------------------------- Golden Goal minute from API events
select pg_temp.ok(public.first_goal_min('[{"type":"Goal","detail":"Normal Goal","time":{"elapsed":45,"extra":2}}]') = 45, '45+2 counts as 45');
select pg_temp.ok(public.first_goal_min('[{"type":"Goal","detail":"Normal Goal","time":{"elapsed":90,"extra":3}}]') = 90, '90+3 counts as 90');
select pg_temp.ok(public.first_goal_min('[{"type":"Goal","detail":"Missed Penalty","time":{"elapsed":5}},{"type":"Goal","detail":"Own Goal","time":{"elapsed":30}},{"type":"Card","time":{"elapsed":2}}]') = 30,
  'own goals count, missed penalties and cards do not');
select pg_temp.ok(public.first_goal_min('[]') is null, 'no goals gives null (the round then counts as 90)');

-- ---------------------------------------------------------------- picks validation
select pg_temp.ok(public.valid_s('{"f1":[0,0]}'), '0-0 is a valid pick');
select pg_temp.ok(not public.valid_s('{"f1":[null,1]}'), 'half-entered pick is rejected');
select pg_temp.ok(not public.valid_s('{"f1":[21,0]}'), 'more than 20 goals is rejected');
select pg_temp.ok(not public.valid_s('{"f7":[1,0]}'), 'unknown fixture id is rejected');

-- ---------------------------------------------------------------- a small league
insert into auth.users values ('00000000-0000-0000-0000-00000000000a'), ('00000000-0000-0000-0000-00000000000b'),
  ('00000000-0000-0000-0000-00000000000c'), ('00000000-0000-0000-0000-00000000000d'), ('00000000-0000-0000-0000-00000000000e');
insert into public.players (id, nick, joined_at) values
  ('00000000-0000-0000-0000-00000000000a', 'Alpha', '2026-08-01'), ('00000000-0000-0000-0000-00000000000b', 'Bravo', '2026-08-02'),
  ('00000000-0000-0000-0000-00000000000c', 'Charlie', '2026-08-03'), ('00000000-0000-0000-0000-00000000000d', 'Delta', '2026-08-04');
-- (e has an account but never joined)
insert into public.rounds (id, n, deadline, first_goal, fixtures) values
  ('r1', 1, now() - interval '7 days', 12, '[{"id":"f1","h":"ARS","a":"CFC","res":[2,1]},{"id":"f2","h":"LFC","a":"MCI","res":[0,0]},
     {"id":"f3","h":"TOT","a":"NEW","res":[1,3]},{"id":"f4","h":"AVL","a":"EVE","res":[1,1]},{"id":"f5","h":"BRI","a":"FUL","res":[3,0]},
     {"id":"f6","h":"WHU","a":"WOL","res":null,"void":true}]'),
  -- every result in, but the round has not locked yet: must not count
  ('r2', 2, now() + interval '7 days', 40, '[{"id":"f1","h":"ARS","a":"CFC","res":[1,0]},{"id":"f2","h":"LFC","a":"MCI","res":[1,0]},
     {"id":"f3","h":"TOT","a":"NEW","res":[1,0]},{"id":"f4","h":"AVL","a":"EVE","res":[1,0]},{"id":"f5","h":"BRI","a":"FUL","res":[1,0]},
     {"id":"f6","h":"WHU","a":"WOL","res":[1,0]}]');
-- r1, first goal minute 12. A and C: 7 points, Golden Goal 2 away. B: 7 points, 5 away. D: no picks.
insert into public.picks (user_id, round_id, s, gg) values
  ('00000000-0000-0000-0000-00000000000a', 'r1', '{"f1":[2,1],"f2":[1,1],"f3":[0,0],"f5":[0,1],"f6":[1,0]}', 10),
  ('00000000-0000-0000-0000-00000000000b', 'r1', '{"f1":[1,0],"f2":[0,0],"f3":[2,0]}', 17),
  ('00000000-0000-0000-0000-00000000000c', 'r1', '{"f3":[1,3],"f4":[0,0]}', 14),
  ('00000000-0000-0000-0000-00000000000a', 'r2', '{"f1":[1,0],"f2":[1,0]}', 40),
  ('00000000-0000-0000-0000-00000000000b', 'r2', '{"f1":[1,0]}', 40);

create temp table sr as select * from public.scored_rounds();
select pg_temp.ok(not exists (select 1 from sr where round_id = 'r2'), 'a round that has not locked never counts, even with every result in');
select pg_temp.ok((select pts from sr where user_id::text like '%a') = 7, 'A scores 7 (void fixture scores nothing)');
select pg_temp.ok((select pts from sr where user_id::text like '%b') = 7, 'B scores 7');
select pg_temp.ok((select pts from sr where user_id::text like '%c') = 7, 'C scores 7');
select pg_temp.ok((select won from sr where user_id::text like '%a'), 'A wins: tied on points, closest Golden Goal');
select pg_temp.ok((select won from sr where user_id::text like '%c'), 'C also wins: same points, same Golden Goal distance (co-winners)');
select pg_temp.ok(not (select won from sr where user_id::text like '%b'), 'B loses the Golden Goal tie-break');
select pg_temp.ok((select not played and pts = 0 and not won from sr where user_id::text like '%d'), 'D has no picks: 0, not played');

-- ---------------------------------------------------------------- the table, as a member sees it
set test.uid = '00000000-0000-0000-0000-00000000000d';
create temp table lb as select * from public.leaderboard(100);
select pg_temp.ok((select string_agg(nick, ',' order by rank) from lb) = 'Alpha,Charlie,Bravo,Delta',
  'table order: points, exact scores, rounds won, then join date');
select pg_temp.ok((select won from lb where nick = 'Bravo') = 0 and (select won from lb where nick = 'Alpha') = 1, 'rounds won counted');
select pg_temp.ok((select move from lb limit 1) is null, 'no movement arrow after only one counted round');
set test.uid = '00000000-0000-0000-0000-00000000000e';
select pg_temp.ok(not exists (select 1 from public.leaderboard(100)), 'signed in but not joined: the table is empty');

-- ---------------------------------------------------------------- access rules, as the app's role
set role authenticated;
set test.uid = '00000000-0000-0000-0000-00000000000b';
select pg_temp.ok((select count(*) from public.picks where round_id = 'r2') = 1, 'before the lock you only see your own picks');
select pg_temp.ok((select count(*) from public.picks where round_id = 'r1') = 3, 'after the lock everyone''s picks are visible');
select pg_temp.ok((select count(*) from public.round_board('r2')) = 1, 'round_board before the lock returns only your row');
update public.picks set s = '{"f1":[2,0]}' where round_id = 'r2';
select pg_temp.ok((select s->'f1' from public.picks where round_id = 'r2' and user_id = auth.uid()) = '[2,0]', 'editing an open round works');
do $$ begin
  update public.picks set s = '{"f1":[2,1]}' where round_id = 'r1' and user_id = auth.uid();
  raise exception 'FAIL: edited a pick after the deadline';
exception when insufficient_privilege then null; end $$;
do $$ begin
  insert into public.picks (user_id, round_id, s) values ('00000000-0000-0000-0000-00000000000d', 'r2', '{}');
  raise exception 'FAIL: saved a pick for another player';
exception when insufficient_privilege then null; end $$;
do $$ begin
  update public.players set is_admin = true where id = auth.uid();
  raise exception 'FAIL: a player made themselves admin';
exception when insufficient_privilege then null; end $$;
reset role;
