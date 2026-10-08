-- ============================================================================
-- SUBAR SITTA · update 01 · "Who's in" (who has saved, how many, and when)
-- Paste into Supabase → SQL Editor → New query, then Run. Safe to run once.
-- Scores stay private until the lock; this only shares who/how many/when.
-- ============================================================================

create table public.pick_status (
  user_id  uuid not null references public.players on delete cascade,
  round_id text not null references public.rounds on delete cascade,
  filled   int  not null,                       -- fixtures with both scores entered
  has_gg   boolean not null,                    -- Golden Goal minute set
  first_at timestamptz not null default now(),  -- first save
  last_at  timestamptz not null default now(),  -- latest save
  saves    int  not null default 1,
  primary key (user_id, round_id)
);
alter table public.pick_status enable row level security;
create policy pick_status_read on public.pick_status for select using (public.is_member());
revoke insert, update, delete on public.pick_status from anon, authenticated;   -- only the trigger writes

create function public.pick_status_sync() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into pick_status (user_id, round_id, filled, has_gg)
  values (new.user_id, new.round_id, (select count(*) from jsonb_object_keys(new.s)), new.gg is not null)
  on conflict (user_id, round_id) do update
    set filled = excluded.filled, has_gg = excluded.has_gg, last_at = now(), saves = pick_status.saves + 1;
  return new;
end $$;
create trigger pick_status_sync after insert or update on public.picks
  for each row execute function public.pick_status_sync();

-- picks saved before this update
insert into public.pick_status (user_id, round_id, filled, has_gg, first_at, last_at)
select user_id, round_id, (select count(*) from jsonb_object_keys(s)), gg is not null, at, at from public.picks
on conflict do nothing;

alter publication supabase_realtime add table public.pick_status;
