-- Just enough of Supabase for setup.sql and update-02-public.sql to load into a plain Postgres.
-- auth.uid() reads a session setting, so tests can act as any player.
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as
  $$ select nullif(current_setting('test.uid', true), '')::uuid $$;
create schema extensions;
create schema vault;
create view vault.decrypted_secrets as select ''::text name, ''::text decrypted_secret where false;
create schema cron;
create function cron.schedule(text, text, text) returns bigint language sql as $$ select 1::bigint $$;
create table cron.job (jobid bigint, jobname text);
create function cron.alter_job(job_id bigint, schedule text) returns void language sql as $$ select $$;
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated; end if;
end $$;
grant usage on schema public, auth to anon, authenticated;
grant select on auth.users to authenticated;
create publication supabase_realtime;
