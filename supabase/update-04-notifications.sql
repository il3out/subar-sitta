-- update-04: email notifications for players who switch them on.
-- Three emails, each at most once per player per round:
--   open    a new round is open (only rounds opened in the last 2 days)
--   remind  3 hours before the lock, only if the player has not filled all six
--   result  the round is settled: your points and the winner
-- Emails go through Resend (resend.com). Before running this file:
--   1. verify subarsitta.com in Resend and create an API key
--   2. select vault.create_secret('YOUR_RESEND_KEY', 'resend_api_key');
-- Run once in the Supabase SQL editor. Off for everyone until each player switches it on.

-- who wants email. Separate from players so the unsubscribe token is never visible to other players.
create table public.player_notify (
  user_id  uuid primary key references public.players on delete cascade,
  email_on boolean not null default false,
  token    uuid not null default gen_random_uuid()   -- for the one-tap unsubscribe link
);
alter table public.player_notify enable row level security;
create policy notify_own_read   on public.player_notify for select using (user_id = auth.uid());
create policy notify_own_insert on public.player_notify for insert with check (user_id = auth.uid());
create policy notify_own_update on public.player_notify for update using (user_id = auth.uid()) with check (user_id = auth.uid());
revoke all on public.player_notify from anon, authenticated;   -- Supabase grants everything by default; keep only what the app needs
grant select, insert (user_id, email_on), update (email_on) on public.player_notify to authenticated;

-- what was sent, so nobody gets the same email twice. No policies: only the functions below touch it.
create table public.notify_log (
  user_id  uuid not null references public.players on delete cascade,
  round_id text not null references public.rounds on delete cascade,
  kind     text not null check (kind in ('open', 'remind', 'result')),
  sent_at  timestamptz not null default now(),
  primary key (user_id, round_id, kind)
);
alter table public.notify_log enable row level security;
revoke all on public.notify_log from anon, authenticated;

-- the unsubscribe link works without signing in
create function public.unsubscribe(t uuid) returns boolean
language sql security definer set search_path = public as $$
  with u as (update player_notify set email_on = false where token = t returning 1) select exists (select 1 from u) $$;
grant execute on function public.unsubscribe(uuid) to anon, authenticated;

-- one Resend batch call (up to 100 emails). Raises on any error so nothing is logged and the next run retries.
create function public.send_emails(batch jsonb) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare k text; st int; body text;
begin
  if jsonb_array_length(batch) = 0 then return; end if;
  select decrypted_secret into k from vault.decrypted_secrets where name = 'resend_api_key' limit 1;
  if k is null then raise exception 'Resend key missing: add it with vault.create_secret (see update-04)'; end if;
  perform extensions.http_set_curlopt('CURLOPT_TIMEOUT', '25');
  select status, content into st, body
    from extensions.http(('POST', 'https://api.resend.com/emails/batch',
          array[extensions.http_header('Authorization', 'Bearer ' || k)], 'application/json', batch::text)::extensions.http_request);
  if st not between 200 and 299 then raise exception 'Resend answered HTTP %: %', st, left(body, 200); end if;
end $$;

-- the email around each message: royal header, one button, unsubscribe footer
create function public.email_html(title text, lines text, button text, token uuid) returns text
language sql immutable as $$
  select '<div style="background:#EEF5FB;padding:24px 12px;font-family:Arial,Helvetica,sans-serif">'
    || '<div style="max-width:480px;margin:0 auto;background:#fff;border-radius:18px;overflow:hidden">'
    || '<div style="background:#0B3D91;color:#FBF6EE;padding:22px 24px;font:bold 13px Arial;letter-spacing:2px">SUBAR 6</div>'
    || '<div style="padding:24px"><h1 style="margin:0 0 12px;font:bold 24px Arial;color:#061A40">' || title || '</h1>'
    || '<div style="font-size:15px;line-height:1.5;color:#2D4167">' || lines || '</div>'
    || '<a href="https://subarsitta.com/" style="display:inline-block;margin-top:20px;background:#0B3D91;color:#fff;text-decoration:none;font-weight:bold;padding:13px 22px;border-radius:999px">' || button || '</a></div>'
    || '<div style="padding:16px 24px;border-top:1px solid #D3E2F1;font-size:12px;color:#536583">You get this because you switched on emails in Subar Sitta. '
    || '<a href="https://subarsitta.com/?unsubscribe=' || token || '" style="color:#536583">Stop these emails</a></div></div></div>' $$;

-- one email object for the Resend batch
create function public.email_msg(addr text, subject text, html text, token uuid) returns jsonb
language sql immutable as $$
  select jsonb_build_object('from', 'Subar Sitta <play@subarsitta.com>', 'to', jsonb_build_array(addr), 'subject', subject, 'html', html,
    'headers', jsonb_build_object('List-Unsubscribe', '<https://subarsitta.com/?unsubscribe=' || token || '>')) $$;

-- the scheduled job: find who is due each kind of email, send in batches of 100, log what went out
create function public.notify_run() returns text
language plpgsql security definer set search_path = public as $$
declare msg text := ''; knd text; due record; batch jsonb; keys jsonb; n int;
begin
  -- ponytail: scored_rounds() runs per recipient for results; fine for a few hundred players, precompute per round if it grows
  foreach knd in array array['open', 'remind', 'result'] loop
    begin
      batch := '[]'; keys := '[]'; n := 0;
      for due in
        select pn.user_id, pn.token, u.email, r.id rid, r.n rn, r.deadline,
               (select count(*) from jsonb_object_keys(coalesce(k.s, '{}'))) filled,
               sr.pts, (select string_agg(p2.nick, ' & ') from scored_rounds() w join players p2 on p2.id = w.user_id where w.round_id = r.id and w.won) winners
        from player_notify pn
        join auth.users u on u.id = pn.user_id
        join rounds r on case knd
             when 'open'   then now() < r.deadline and not r.locked and r.created_at > now() - interval '2 days'
             when 'remind' then not r.locked and r.deadline > now() and r.deadline <= now() + interval '3 hours'
             else r.settled_at > now() - interval '1 day' end
        left join picks k on k.user_id = pn.user_id and k.round_id = r.id
        left join lateral (select s.pts from scored_rounds() s where knd = 'result' and s.round_id = r.id and s.user_id = pn.user_id) sr on true
        where pn.email_on and u.email is not null
          and not exists (select 1 from notify_log l where l.user_id = pn.user_id and l.round_id = r.id and l.kind = knd)
          and (knd <> 'remind' or (select count(*) from jsonb_object_keys(coalesce(k.s, '{}'))) < 6)
          and (knd <> 'result' or k.user_id is not null)
        order by r.n, pn.user_id
        limit 100   -- one Resend batch per kind per run; the rest go on the next run
      loop
        batch := batch || jsonb_build_array(email_msg(due.email,
          case knd when 'open' then format('Round %s is open: make your six', due.rn)
                    when 'remind' then format('3 hours left: %s of 6 picked for round %s', due.filled, due.rn)
                    else format('Round %s: you scored %s', due.rn, due.pts) end,
          email_html(
            case knd when 'open' then format('Round %s is open', due.rn) when 'remind' then 'Picks lock in 3 hours' else format('You scored %s', due.pts) end,
            case knd when 'open' then format('Six matches are waiting. Picks lock %s Kuwait time.', to_char(due.deadline at time zone 'Asia/Kuwait', 'Dy DD Mon, HH24:MI'))
                      when 'remind' then format('You have picked %s of 6 for round %s. Picks lock %s Kuwait time.', due.filled, due.rn, to_char(due.deadline at time zone 'Asia/Kuwait', 'HH24:MI'))
                      else format('Round %s is settled. %s', due.rn, coalesce('Round winner: ' || due.winners || '.', 'No winner this round.')) end,
            case knd when 'open' then 'Make my six' when 'remind' then 'Finish my picks' else 'See the table' end,
            due.token),
          due.token));
        keys := keys || jsonb_build_array(jsonb_build_object('u', due.user_id, 'r', due.rid));
        n := n + 1;
      end loop;
      if n > 0 then
        perform send_emails(batch);
        insert into notify_log (user_id, round_id, kind)
          select (x->>'u')::uuid, x->>'r', knd from jsonb_array_elements(keys) x on conflict do nothing;
        msg := msg || format('%s %s email%s. ', n, knd, case when n = 1 then '' else 's' end);
      end if;
    exception when others then
      msg := msg || format('%s emails failed: %s. ', knd, sqlerrm);   -- nothing logged, so the next run retries
    end;
  end loop;
  return coalesce(nullif(btrim(msg), ''), 'No emails due');
end $$;
revoke execute on function public.notify_run(), public.send_emails(jsonb) from public, anon, authenticated;

-- every 10 minutes, separate from the autopilot
select cron.schedule('subar-sitta-notify', '*/10 * * * *', $$select public.notify_run()$$);
