#!/usr/bin/env bash
# Loads the real migrations into a throwaway database and runs the scoring + access-rule tests.
# Usage: tests/sql/run.sh   (needs psql; PG* env vars pick the server, default local socket)
set -euo pipefail
cd "$(dirname "$0")/../.."
DB=subar_test_$$
createdb "$DB"
trap 'dropdb --if-exists "$DB"' EXIT
P=(psql -X -q -v ON_ERROR_STOP=1 -d "$DB")
"${P[@]}" -f tests/sql/stubs.sql
# the two `create extension` lines need Supabase's http and pg_cron; the stubs stand in for them
grep -v '^create extension' supabase/setup.sql | "${P[@]}"
"${P[@]}" -f supabase/update-02-public.sql
"${P[@]}" -f supabase/update-03-live.sql
# grants Supabase gives every table by default
"${P[@]}" -c "grant select, insert, update, delete on all tables in schema public to authenticated; grant select on all tables in schema public to anon;
  revoke insert, update, delete on public.pick_status from authenticated; revoke update on public.players from authenticated; grant update (nick) on public.players to authenticated;"
# update-04 runs after the default grants, so its own revokes are what the tests see
"${P[@]}" -f supabase/update-04-notifications.sql
"${P[@]}" -o /dev/null -f tests/sql/scoring.sql
echo "SQL tests passed"
