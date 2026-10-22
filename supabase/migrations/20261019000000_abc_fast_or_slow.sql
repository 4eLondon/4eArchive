-- ABC Fast or Slow: Supabase backend.
--
-- Security model
--   * Players authenticate with Supabase anonymous sign-in; auth.uid() is their identity.
--   * Clients have NO direct read/write access to game tables. Every state transition
--     goes through a SECURITY DEFINER function that checks phase + permissions, using
--     the database clock. Hosts, scores and deadlines are never taken from the client.
--   * The only table clients can SELECT is `rooms` (their own room only), which carries
--     a `version` counter. Realtime pushes version bumps; clients then call
--     get_snapshot(), which hides other players' answers until review.
--   * Every action row-locks the room (SELECT ... FOR UPDATE), so racing submissions,
--     timer expiry and double scoring are serialised. Scoring is idempotent.
--
-- Game timing columns are integer milliseconds since the epoch (same as the TS engine
-- in shared/engine.ts, which this file mirrors rule for rule).


-- ─── Tables ─────────────────────────────────────────────────────────────────

create table if not exists public.rooms (
  id            uuid primary key default gen_random_uuid(),
  code          text not null unique check (code ~ '^[A-Z]{4,6}$'),
  phase         text not null default 'LOBBY'
                check (phase in ('LOBBY','LETTER_SELECTION','ANSWERING','REVIEW','RESULTS','MATCH_OVER')),
  host_id       uuid,
  settings      jsonb not null,
  used_letters  text[] not null default '{}',
  version       bigint not null default 1,
  created_at    timestamptz not null default now(),
  last_activity timestamptz not null default now()
);

create table if not exists public.players (
  id            uuid primary key default gen_random_uuid(),
  room_id       uuid not null references public.rooms(id) on delete cascade,
  user_id       uuid not null,
  name          text not null check (char_length(name) between 1 and 20),
  hue           int  not null,
  joined_ms     bigint not null,
  last_seen_ms  bigint not null,
  ready         boolean not null default false,
  total_units   bigint not null default 0,
  left_game     boolean not null default false
);
create unique index if not exists players_one_seat_per_user on public.players(room_id, user_id) where not left_game;
create index if not exists players_room on public.players(room_id);

create table if not exists public.rounds (
  id            uuid primary key default gen_random_uuid(),
  room_id       uuid not null references public.rooms(id) on delete cascade,
  number        int  not null,
  chooser_id    uuid not null,
  selection     jsonb not null,             -- same shape as the TS Selection type
  letter        text check (letter ~ '^[A-Z]$'),
  speed         text check (speed in ('fast','slow')),
  categories    text[] not null,
  participants  uuid[] not null default '{}',
  started_ms    bigint,
  deadline_ms   bigint,
  stopped_ms    bigint,
  stopped_by    uuid,
  end_reason    text check (end_reason in ('first_finished','timer','host')),
  review_ms     bigint,
  scored        boolean not null default false,
  unique (room_id, number)
);

create table if not exists public.answers (
  round_id   uuid not null references public.rounds(id) on delete cascade,
  player_id  uuid not null references public.players(id) on delete cascade,
  category   text not null,
  value      text not null default '' check (char_length(value) <= 40),
  primary key (round_id, player_id, category)
);

create table if not exists public.submissions (
  round_id      uuid not null references public.rounds(id) on delete cascade,
  player_id     uuid not null references public.players(id) on delete cascade,
  submitted_ms  bigint not null,
  primary key (round_id, player_id)
);

create table if not exists public.votes (
  round_id    uuid not null references public.rounds(id) on delete cascade,
  answer_player uuid not null,
  category    text not null,
  voter_id    uuid not null references public.players(id) on delete cascade,
  vote        text not null check (vote in ('accept','reject')),
  primary key (round_id, answer_player, category, voter_id)
);

create table if not exists public.flags (
  round_id    uuid not null references public.rounds(id) on delete cascade,
  answer_player uuid not null,
  category    text not null,
  flagger_id  uuid not null references public.players(id) on delete cascade,
  primary key (round_id, answer_player, category, flagger_id)
);

-- One row per (round, participant, category), written exactly once by finalize.
create table if not exists public.round_scores (
  round_id    uuid not null references public.rounds(id) on delete cascade,
  player_id   uuid not null,
  category    text not null,
  status      text not null check (status in ('accepted','rejected','blank','wrong_letter')),
  units       int  not null,
  duplicates  int  not null,
  primary key (round_id, player_id, category)
);

-- ─── Row level security ─────────────────────────────────────────────────────

alter table public.rooms        enable row level security;
alter table public.players      enable row level security;
alter table public.rounds       enable row level security;
alter table public.answers      enable row level security;
alter table public.submissions  enable row level security;
alter table public.votes        enable row level security;
alter table public.flags        enable row level security;
alter table public.round_scores enable row level security;

-- Members may read their own room row (needed for Realtime change notifications).
-- No other table has a policy, so direct access is denied; use the functions below.
create or replace function public._is_member(p_room uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from players where room_id = p_room and user_id = auth.uid() and not left_game);
$$;

drop policy if exists rooms_member_read on public.rooms;
create policy rooms_member_read on public.rooms for select to authenticated using (public._is_member(id));

revoke all on all tables in schema public from anon, authenticated;
grant select on public.rooms to authenticated;

-- ─── Constants & helpers ────────────────────────────────────────────────────

create or replace function public._now_ms() returns bigint language sql volatile as $$
  select (extract(epoch from clock_timestamp()) * 1000)::bigint;
$$;

create or replace function public._fail(p_code text, p_msg text) returns void language plpgsql as $$
begin
  raise exception using errcode = 'P0001', message = 'ABC:' || p_code || ':' || p_msg;
end $$;

-- Mirrors shared/constants.ts
create or replace function public._c(p_key text) returns bigint language sql immutable as $$
  select case p_key
    when 'score_unit' then 27720
    when 'max_players' then 12
    when 'min_players' then 2
    when 'tick_fast' then 110
    when 'tick_slow' then 420
    when 'auto_stop' then 15000
    when 'latency_tol' then 450
    when 'wheel_spin' then 4600
    when 'reveal_ticker' then 2200
    when 'reveal_wheel' then 1600
    when 'late_draft' then 600
    when 'stop_to_review' then 1800
    when 'host_handoff' then 45000   -- longer than the WS server: presence is heartbeat-based here
    when 'online_window' then 25000
  end;
$$;

-- Mirrors shared/normalize.ts: trim, collapse whitespace, strip common accents, lowercase.
create or replace function public._clean(p text) returns text language sql immutable as $$
  select btrim(regexp_replace(coalesce(p, ''), '\s+', ' ', 'g'));
$$;

create or replace function public._norm(p text) returns text language sql immutable as $$
  select lower(translate(public._clean(p),
    'ÀÁÂÃÄÅàáâãäåĀāÈÉÊËèéêëĒēÌÍÎÏìíîïĪīÒÓÔÕÖØòóôõöøŌōÙÚÛÜùúûüŪūÑñÇçÝýÿ',
    'AAAAAAaaaaaaAaEEEEeeeeEeIIIIiiiiIiOOOOOOooooooOoUUUUuuuuUuNnCcYyy'));
$$;

create or replace function public._check(p_value text, p_letter text) returns text language sql immutable as $$
  select case
    when public._norm(p_value) = '' then 'blank'
    when substring(public._norm(p_value) from '[[:alpha:]]') is distinct from lower(p_letter) then 'wrong_letter'
    else 'ok' end;
$$;

create or replace function public._available(p_used text[]) returns text[] language sql immutable as $$
  select coalesce(array_agg(l order by l), '{}')
  from unnest(string_to_array('A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z', ',')) l
  where not (l = any(p_used));
$$;

create or replace function public._bump(p_room uuid) returns void language sql as $$
  update rooms set version = version + 1, last_activity = now() where id = p_room;
$$;

create or replace function public._online(p_last_seen bigint, p_now bigint) returns boolean language sql immutable as $$
  select p_last_seen > p_now - public._c('online_window');
$$;

create or replace function public._room_for_update(p_code text) returns rooms
language plpgsql as $$
declare r rooms;
begin
  select * into r from rooms where code = upper(p_code) for update;
  if not found then perform _fail('not_found', 'No room with that code. Check it and try again.'); end if;
  return r;
end $$;

create or replace function public._current_round(p_room uuid) returns rounds language sql stable as $$
  select * from rounds where room_id = p_room order by number desc limit 1;
$$;

-- ─── Round mechanics ────────────────────────────────────────────────────────

create or replace function public._start_round(p_room uuid, p_now bigint) returns void
language plpgsql as $$
declare
  r rooms;
  n int;
  pool uuid[];
  chooser uuid;
begin
  select * into r from rooms where id = p_room;
  select coalesce(max(number), 0) + 1 into n from rounds where room_id = p_room;
  select array_agg(id order by joined_ms) into pool from players
    where room_id = p_room and not left_game and _online(last_seen_ms, p_now);
  chooser := coalesce(pool[((n - 1) % array_length(pool, 1)) + 1], r.host_id);
  insert into rounds (room_id, number, chooser_id, selection, categories)
  values (p_room, n, chooser,
          case when cardinality(_available(r.used_letters)) > 0 then '{"status":"choosing"}'::jsonb else '{"status":"exhausted"}'::jsonb end,
          array(select jsonb_array_elements_text(r.settings->'categories')));
  update rooms set phase = 'LETTER_SELECTION' where id = p_room;
end $$;

create or replace function public._lock_letter(p_room uuid, p_round uuid, p_letter text, p_speed text, p_via text, p_now bigint, p_extra jsonb)
returns void language plpgsql as $$
declare reveal bigint;
begin
  if exists (select 1 from rooms where id = p_room and p_letter = any(used_letters)) then
    raise exception 'invariant: letter % already used', p_letter;
  end if;
  update rooms set used_letters = used_letters || p_letter where id = p_room;
  reveal := p_now + case when p_via = 'wheel' then _c('wheel_spin') + _c('reveal_wheel') else _c('reveal_ticker') end;
  update rounds set letter = p_letter, speed = p_speed,
    selection = jsonb_build_object('status','locked','speed',p_speed,'letter',p_letter,'via',p_via,
                                   'lockedAt',p_now,'revealUntil',reveal) || coalesce(p_extra, '{}'::jsonb)
  where id = p_round;
end $$;

create or replace function public._reset_match(p_room uuid) returns void language sql as $$
  delete from rounds where room_id = p_room;
  delete from players where room_id = p_room and left_game;
  update players set total_units = 0, ready = false where room_id = p_room;
$$;

-- Time-based transitions (mirrors engine.tick). Called at the start of every RPC.
create or replace function public._settle(p_room uuid, p_now bigint) returns void
language plpgsql as $$
declare
  r rooms;
  rd rounds;
  sel jsonb;
  seq text[];
  t int;
  secs int;
  host players;
  next_host uuid;
  changed boolean;
  guard int := 0;
begin
  loop
    guard := guard + 1;
    exit when guard > 6;
    changed := false;
    select * into r from rooms where id = p_room;
    rd := _current_round(p_room);
    sel := rd.selection;

    if r.phase = 'LETTER_SELECTION' and rd.id is not null then
      if sel->>'status' = 'ticking' and p_now >= (sel->>'startedAt')::bigint + _c('auto_stop') then
        seq := array(select jsonb_array_elements_text(sel->'sequence'));
        t := floor(random() * cardinality(seq))::int;
        perform _lock_letter(p_room, rd.id, seq[t + 1], sel->>'speed', 'ticker', p_now,
          jsonb_build_object('sequence', sel->'sequence', 'stopIndex', t, 'autoStopped', true));
        changed := true;
      elsif sel->>'status' = 'locked' and p_now >= (sel->>'revealUntil')::bigint then
        secs := case when sel->>'speed' = 'fast' then (r.settings->>'fastSeconds')::int else (r.settings->>'slowSeconds')::int end;
        update rounds set started_ms = (sel->>'revealUntil')::bigint,
          deadline_ms = (sel->>'revealUntil')::bigint + secs * 1000,
          participants = array(select id from players where room_id = p_room and not left_game order by joined_ms)
        where id = rd.id;
        update rooms set phase = 'ANSWERING' where id = p_room;
        changed := true;
      end if;
    elsif r.phase = 'ANSWERING' and rd.deadline_ms is not null then
      if rd.stopped_ms is null and p_now >= rd.deadline_ms then
        update rounds set stopped_ms = deadline_ms, end_reason = 'timer', review_ms = deadline_ms + _c('stop_to_review') where id = rd.id;
        changed := true;
      elsif rd.review_ms is not null and p_now >= rd.review_ms then
        update rooms set phase = 'REVIEW' where id = p_room;
        changed := true;
      end if;
    end if;

    select * into host from players where id = r.host_id;
    if host.id is null or host.left_game or host.last_seen_ms <= p_now - _c('host_handoff') then
      select id into next_host from players
        where room_id = p_room and not left_game and id <> coalesce(r.host_id, gen_random_uuid()) and _online(last_seen_ms, p_now)
        order by joined_ms limit 1;
      if next_host is not null then
        update rooms set host_id = next_host where id = p_room;
        changed := true;
      end if;
    end if;

    exit when not changed;
    perform _bump(p_room);
  end loop;
end $$;

-- Scoring (mirrors shared/scoring.ts). Writes round_scores and adds to totals.
create or replace function public._score_round(p_round uuid) returns void
language plpgsql as $$
declare rd rounds;
begin
  select * into rd from rounds where id = p_round;
  with sheet as (
    select pid, cat, coalesce(a.value, '') as value
    from unnest(rd.participants) pid
    cross join unnest(rd.categories) cat
    left join answers a on a.round_id = rd.id and a.player_id = pid and a.category = cat
  ), judged as (
    select s.pid, s.cat, s.value,
      case _check(s.value, rd.letter)
        when 'ok' then
          case when (select count(*) filter (where vote = 'reject') > count(*) filter (where vote = 'accept')
                     from votes v where v.round_id = rd.id and v.answer_player = s.pid and v.category = s.cat)
               then 'rejected' else 'accepted' end
        else _check(s.value, rd.letter) end as status
    from sheet s
  ), grouped as (
    select j.*, case when status = 'accepted'
                     then count(*) over (partition by cat, case when status = 'accepted' then _norm(value) end)
                     else 1 end as dupes
    from judged j
  )
  insert into round_scores (round_id, player_id, category, status, units, duplicates)
  select rd.id, pid, cat, status,
         case when status = 'accepted' then (_c('score_unit') / dupes)::int else 0 end,
         case when status = 'accepted' then dupes else 1 end
  from grouped;

  update players p set total_units = p.total_units + s.total
  from (select player_id, sum(units) as total from round_scores where round_id = rd.id group by player_id) s
  where p.id = s.player_id;
  update rounds set scored = true where id = rd.id;
end $$;

-- ─── Public RPCs ────────────────────────────────────────────────────────────

create or replace function public.create_room(p_name text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  v_code text;
  v_room uuid;
  v_player uuid;
  v_name text := left(_clean(p_name), 20);
  v_now bigint := _now_ms();
  i int;
begin
  if auth.uid() is null then perform _fail('not_allowed', 'Sign in first.'); end if;
  if v_name = '' then perform _fail('invalid', 'Pick a display name first.'); end if;
  for attempt in 1..50 loop
    v_code := '';
    for i in 1..(case when attempt > 40 then 5 else 4 end) loop
      v_code := v_code || substr('BCDFGHJKLMNPQRSTVWXZ', 1 + floor(random() * 20)::int, 1);
    end loop;
    exit when not exists (select 1 from rooms where code = v_code);
  end loop;
  insert into rooms (code, settings) values (v_code,
    jsonb_build_object('letterMode','ticker','fastSeconds',30,'slowSeconds',90,'rounds',5,
                       'categories', jsonb_build_array('boy','girl','animal','place','food')))
  returning id into v_room;
  insert into players (room_id, user_id, name, hue, joined_ms, last_seen_ms)
  values (v_room, auth.uid(), v_name, 0, v_now, v_now) returning id into v_player;
  update rooms set host_id = v_player where id = v_room;
  return jsonb_build_object('code', v_code, 'playerId', v_player);
end $$;

create or replace function public.join_room(p_code text, p_name text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  r rooms;
  v_player uuid;
  v_name text := left(_clean(p_name), 20);
  v_now bigint := _now_ms();
  v_hue int;
  base text;
  n int := 2;
begin
  if auth.uid() is null then perform _fail('not_allowed', 'Sign in first.'); end if;
  r := _room_for_update(p_code);
  -- Already seated (same browser): resume instead of creating a duplicate.
  select id into v_player from players where room_id = r.id and user_id = auth.uid() and not left_game;
  if v_player is not null then
    update players set last_seen_ms = v_now where id = v_player;
    perform _bump(r.id);
    return jsonb_build_object('code', r.code, 'playerId', v_player);
  end if;
  if v_name = '' then perform _fail('invalid', 'Pick a display name first.'); end if;
  if (select count(*) from players where room_id = r.id and not left_game) >= _c('max_players') then
    perform _fail('room_full', 'This room is full (12 players).');
  end if;
  base := v_name;
  while exists (select 1 from players where room_id = r.id and not left_game and lower(name) = lower(v_name)) loop
    v_name := left(base, 17) || ' ' || n;
    n := n + 1;
  end loop;
  select min(h) into v_hue from generate_series(0, 11) h
    where h not in (select hue from players where room_id = r.id and not left_game);
  insert into players (room_id, user_id, name, hue, joined_ms, last_seen_ms)
  values (r.id, auth.uid(), v_name, coalesce(v_hue, 0), v_now, v_now) returning id into v_player;
  perform _bump(r.id);
  return jsonb_build_object('code', r.code, 'playerId', v_player);
end $$;

create or replace function public.resume_room(p_code text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare r rooms; v_player uuid;
begin
  select * into r from rooms where code = upper(p_code);
  if not found then perform _fail('not_found', 'That room has closed.'); end if;
  select id into v_player from players where room_id = r.id and user_id = auth.uid() and not left_game;
  if v_player is null then perform _fail('resume_failed', 'Could not restore your seat.'); end if;
  update players set last_seen_ms = _now_ms() where id = v_player;
  perform _bump(r.id);
  return jsonb_build_object('code', r.code, 'playerId', v_player);
end $$;

create or replace function public.peek_room(p_code text) returns jsonb
language sql security definer set search_path = public stable as $$
  select coalesce(
    (select jsonb_build_object('exists', true, 'phase', r.phase,
            'players', (select count(*) from players where room_id = r.id and not left_game),
            'full', (select count(*) from players where room_id = r.id and not left_game) >= 12)
     from rooms r where r.code = upper(p_code)),
    '{"exists": false}'::jsonb);
$$;

/** Heartbeat: keeps presence fresh, settles timers, returns the server clock. */
create or replace function public.heartbeat(p_code text) returns bigint
language plpgsql security definer set search_path = public as $$
declare r rooms; v_now bigint := _now_ms(); was_online boolean;
begin
  r := _room_for_update(p_code);
  select _online(last_seen_ms, v_now) into was_online from players where room_id = r.id and user_id = auth.uid() and not left_game;
  if was_online is null then perform _fail('resume_failed', 'You are no longer in this room.'); end if;
  update players set last_seen_ms = v_now where room_id = r.id and user_id = auth.uid() and not left_game;
  if not was_online then perform _bump(r.id); end if;
  perform _settle(r.id, v_now);
  return v_now;
end $$;

create or replace function public.tick(p_code text) returns void
language plpgsql security definer set search_path = public as $$
declare r rooms;
begin
  r := _room_for_update(p_code);
  if not _is_member(r.id) then perform _fail('not_allowed', 'You are not in this room.'); end if;
  perform _settle(r.id, _now_ms());
end $$;

create or replace function public.room_action(p_code text, p_action jsonb) returns void
language plpgsql security definer set search_path = public as $$
declare
  r rooms;
  rd rounds;
  me players;
  v_now bigint := _now_ms();
  a text := p_action->>'type';
  is_host boolean;
  sel jsonb;
  seq text[];
  server_tick int;
  tol int;
  t int;
  pool text[];
  cat text;
  pid uuid;
  online_count int;
  patch jsonb;
  s jsonb;
  v int;
  target players;
  missing int;
  key_parts text[];
begin
  r := _room_for_update(p_code);
  perform _settle(r.id, v_now);
  select * into r from rooms where id = r.id;
  select * into me from players where room_id = r.id and user_id = auth.uid() and not left_game;
  if me.id is null then perform _fail('not_allowed', 'You are not in this room.'); end if;
  update players set last_seen_ms = v_now where id = me.id;
  is_host := r.host_id = me.id;
  rd := _current_round(r.id);
  sel := rd.selection;

  case a
  when 'set_ready' then
    if r.phase <> 'LOBBY' then perform _fail('wrong_phase', 'Ready-up happens in the lobby.'); end if;
    update players set ready = coalesce((p_action->>'ready')::boolean, false) where id = me.id;

  when 'update_settings' then
    if not is_host then perform _fail('not_host', 'Only the host can change settings.'); end if;
    if r.phase not in ('LOBBY','RESULTS') then perform _fail('wrong_phase', 'Settings can change in the lobby or between rounds.'); end if;
    patch := coalesce(p_action->'settings', '{}'::jsonb);
    s := r.settings;
    if patch ? 'letterMode' then
      if patch->>'letterMode' not in ('ticker','wheel') then perform _fail('invalid', 'Unknown letter mode.'); end if;
      s := s || jsonb_build_object('letterMode', patch->>'letterMode');
    end if;
    foreach cat in array array['fastSeconds','slowSeconds'] loop
      if patch ? cat then
        v := round((patch->>cat)::numeric);
        if v < 15 or v > 300 then perform _fail('invalid', 'Timers must be between 15 and 300 seconds.'); end if;
        s := s || jsonb_build_object(cat, v);
      end if;
    end loop;
    if patch ? 'rounds' then
      if jsonb_typeof(patch->'rounds') = 'null' then s := s || '{"rounds": null}'::jsonb;
      else
        v := round((patch->>'rounds')::numeric);
        if v < 1 or v > 26 then perform _fail('invalid', 'Rounds must be between 1 and 26.'); end if;
        if v < (select count(*) from rounds where room_id = r.id) then perform _fail('invalid', 'This match has already played more rounds than that.'); end if;
        s := s || jsonb_build_object('rounds', v);
      end if;
    end if;
    if patch ? 'categories' then
      if r.phase <> 'LOBBY' then perform _fail('invalid', 'Categories can only change in the lobby.'); end if;
      select coalesce(jsonb_agg(c order by array_position(array['boy','girl','animal','place','food','thing','brand','job','movie'], c)), '[]')
        into patch from (select distinct c from jsonb_array_elements_text(patch->'categories') c
                         where c in ('boy','girl','animal','place','food','thing','brand','job','movie')) x;
      if jsonb_array_length(patch) < 3 then perform _fail('invalid', 'Pick between 3 and 9 categories.'); end if;
      s := s || jsonb_build_object('categories', patch);
    end if;
    update rooms set settings = s where id = r.id;

  when 'start_match' then
    if not is_host then perform _fail('not_host', 'Only the host can start the match.'); end if;
    if r.phase <> 'LOBBY' then perform _fail('wrong_phase', 'The match has already started.'); end if;
    select count(*) into online_count from players where room_id = r.id and not left_game and _online(last_seen_ms, v_now);
    if online_count < _c('min_players') then perform _fail('too_few_players', 'You need at least 2 players online to start.'); end if;
    perform _reset_match(r.id);
    perform _start_round(r.id, v_now);

  when 'choose_speed' then
    if r.phase <> 'LETTER_SELECTION' then perform _fail('wrong_phase', 'Not choosing a letter right now.'); end if;
    if me.id <> rd.chooser_id and not is_host then perform _fail('not_allowed', 'It is not your turn to call it.'); end if;
    if p_action->>'speed' not in ('fast','slow') then perform _fail('invalid', 'Fast or slow?'); end if;
    if sel->>'status' not in ('choosing','ready') then perform _fail('wrong_phase', 'The speed is already locked in.'); end if;
    if r.settings->>'letterMode' = 'wheel' then
      update rounds set selection = jsonb_build_object('status','ready','speed',p_action->>'speed') where id = rd.id;
    else
      update rounds set selection = jsonb_build_object('status','ticking','speed',p_action->>'speed','startedAt',v_now,
        'intervalMs', case when p_action->>'speed' = 'fast' then _c('tick_fast') else _c('tick_slow') end,
        'sequence', to_jsonb(_available(r.used_letters)))
      where id = rd.id;
    end if;

  when 'stop_ticker' then
    if r.phase <> 'LETTER_SELECTION' or sel->>'status' <> 'ticking' then perform _fail('wrong_phase', 'The ticker is not running.'); end if;
    if me.id <> rd.chooser_id and not is_host then perform _fail('not_allowed', 'Only the caller can shout STOP.'); end if;
    seq := array(select jsonb_array_elements_text(sel->'sequence'));
    server_tick := greatest(0, floor((v_now - (sel->>'startedAt')::bigint)::numeric / (sel->>'intervalMs')::int)::int);
    tol := ceil(_c('latency_tol')::numeric / (sel->>'intervalMs')::int)::int;
    t := server_tick;
    if jsonb_typeof(p_action->'atTick') = 'number' then
      v := (p_action->>'atTick')::int;
      if v <= server_tick + 1 and v >= server_tick - tol then t := greatest(0, v); end if;
    end if;
    perform _lock_letter(r.id, rd.id, seq[(t % cardinality(seq)) + 1], sel->>'speed', 'ticker', v_now,
      jsonb_build_object('sequence', sel->'sequence', 'stopIndex', t % cardinality(seq)));

  when 'spin_wheel' then
    if r.phase <> 'LETTER_SELECTION' or sel->>'status' <> 'ready' then perform _fail('wrong_phase', 'Pick fast or slow before spinning.'); end if;
    if me.id <> rd.chooser_id and not is_host then perform _fail('not_allowed', 'It is not your turn to spin.'); end if;
    pool := _available(r.used_letters);
    perform _lock_letter(r.id, rd.id, pool[1 + floor(random() * cardinality(pool))::int], sel->>'speed', 'wheel', v_now, null);

  when 'save_draft', 'submit_answers' then
    if r.phase <> 'ANSWERING' or rd.letter is null then perform _fail('wrong_phase', 'No round is running.'); end if;
    if not (me.id = any(rd.participants)) then perform _fail('not_allowed', 'You will join from the next round.'); end if;
    if v_now < rd.started_ms or v_now > coalesce(rd.stopped_ms, rd.deadline_ms) + _c('late_draft') then
      perform _fail('round_over', 'Time is up. Answers are locked.');
    end if;
    foreach cat in array rd.categories loop
      if jsonb_typeof(p_action->'answers'->cat) = 'string' then
        insert into answers (round_id, player_id, category, value)
        values (rd.id, me.id, cat, left(_clean(p_action->'answers'->>cat), 40))
        on conflict (round_id, player_id, category) do update set value = excluded.value;
      end if;
    end loop;
    if a = 'submit_answers' and not exists (select 1 from submissions where round_id = rd.id and player_id = me.id) then
      select count(*) into missing from unnest(rd.categories) c
        left join answers x on x.round_id = rd.id and x.player_id = me.id and x.category = c
        where _check(x.value, rd.letter) <> 'ok';
      if missing > 0 then perform _fail('invalid', 'Every category needs an answer starting with ' || rd.letter || '.'); end if;
      insert into submissions (round_id, player_id, submitted_ms) values (rd.id, me.id, v_now);
      if rd.stopped_ms is null then
        update rounds set stopped_ms = v_now, stopped_by = me.id, end_reason = 'first_finished',
          review_ms = v_now + _c('stop_to_review') where id = rd.id;
      end if;
    end if;

  when 'host_end_round' then
    if not is_host then perform _fail('not_host', 'Only the host can end the round.'); end if;
    if r.phase <> 'ANSWERING' then perform _fail('wrong_phase', 'No round is running.'); end if;
    if rd.stopped_ms is not null then perform _fail('round_over', 'The round has already stopped.'); end if;
    update rounds set stopped_ms = v_now, stopped_by = me.id, end_reason = 'host', review_ms = v_now + _c('stop_to_review') where id = rd.id;

  when 'vote', 'flag' then
    if r.phase <> 'REVIEW' then perform _fail('wrong_phase', 'Review is closed.'); end if;
    key_parts := string_to_array(p_action->>'key', ':');
    begin
      pid := key_parts[1]::uuid;
    exception when others then
      perform _fail('invalid', 'Unknown answer.');
    end;
    cat := key_parts[2];
    if not (pid = any(rd.participants)) or not (cat = any(rd.categories)) then perform _fail('invalid', 'Unknown answer.'); end if;
    if a = 'flag' then
      if coalesce((p_action->>'flagged')::boolean, false) then
        insert into flags values (rd.id, pid, cat, me.id) on conflict do nothing;
      else
        delete from flags where round_id = rd.id and answer_player = pid and category = cat and flagger_id = me.id;
      end if;
    else
      if pid = me.id then perform _fail('not_allowed', 'You cannot vote on your own answer.'); end if;
      if _check((select value from answers where round_id = rd.id and player_id = pid and category = cat), rd.letter) <> 'ok' then
        perform _fail('invalid', 'Blank or wrong-letter answers score zero automatically.');
      end if;
      if jsonb_typeof(p_action->'vote') = 'null' or p_action->'vote' is null then
        delete from votes where round_id = rd.id and answer_player = pid and category = cat and voter_id = me.id;
      elsif p_action->>'vote' in ('accept','reject') then
        insert into votes values (rd.id, pid, cat, me.id, p_action->>'vote')
        on conflict (round_id, answer_player, category, voter_id) do update set vote = excluded.vote;
      else
        perform _fail('invalid', 'Unknown vote.');
      end if;
    end if;

  when 'finalize_review' then
    if not is_host then perform _fail('not_host', 'Only the host can lock in the scores.'); end if;
    if rd.scored then perform _fail('already_scored', 'This round has already been scored.'); end if;
    if r.phase <> 'REVIEW' then perform _fail('wrong_phase', 'Nothing to score yet.'); end if;
    perform _score_round(rd.id);
    update rooms set phase = 'RESULTS' where id = r.id;

  when 'next_round' then
    if not is_host then perform _fail('not_host', 'Only the host can start the next round.'); end if;
    if r.phase <> 'RESULTS' then perform _fail('wrong_phase', 'Finish this round first.'); end if;
    if jsonb_typeof(r.settings->'rounds') = 'number' and rd.number >= (r.settings->>'rounds')::int then
      update rooms set phase = 'MATCH_OVER' where id = r.id;
    else
      perform _start_round(r.id, v_now);
    end if;

  when 'end_match' then
    if not is_host then perform _fail('not_host', 'Only the host can end the match.'); end if;
    if r.phase = 'LETTER_SELECTION' and sel->>'status' <> 'locked' then
      delete from rounds where id = rd.id;
    elsif r.phase <> 'RESULTS' then
      perform _fail('wrong_phase', 'You can end the match between rounds.');
    end if;
    if exists (select 1 from rounds where room_id = r.id and scored) then
      update rooms set phase = 'MATCH_OVER' where id = r.id;
    else
      perform _reset_match(r.id);
      update rooms set phase = 'LOBBY' where id = r.id;
    end if;

  when 'rematch', 'back_to_lobby' then
    if not is_host then perform _fail('not_host', 'Only the host can do that.'); end if;
    if r.phase <> 'MATCH_OVER' then perform _fail('wrong_phase', 'The match is still going.'); end if;
    perform _reset_match(r.id);
    if a = 'rematch' then
      select count(*) into online_count from players where room_id = r.id and not left_game and _online(last_seen_ms, v_now);
      if online_count < _c('min_players') then perform _fail('too_few_players', 'You need at least 2 players online.'); end if;
      perform _start_round(r.id, v_now);
    else
      update rooms set phase = 'LOBBY' where id = r.id;
    end if;

  when 'reset_letters' then
    if not is_host then perform _fail('not_host', 'Only the host can reset the alphabet.'); end if;
    if r.phase = 'LETTER_SELECTION' and sel->>'status' = 'exhausted' then
      update rounds set selection = '{"status":"choosing"}' where id = rd.id;
    elsif r.phase not in ('LOBBY','RESULTS','MATCH_OVER') then
      perform _fail('wrong_phase', 'Reset the alphabet between rounds.');
    end if;
    update rooms set used_letters = '{}' where id = r.id;

  when 'kick', 'leave' then
    if a = 'kick' then
      if not is_host then perform _fail('not_host', 'Only the host can remove players.'); end if;
      select * into target from players where id = (p_action->>'playerId')::uuid and room_id = r.id and not left_game;
      if target.id = me.id then perform _fail('invalid', 'Use leave instead.'); end if;
    else
      target := me;
    end if;
    if target.id is null then perform _fail('not_found', 'Player not found.'); end if;
    if r.phase = 'LOBBY' then delete from players where id = target.id;
    else update players set left_game = true where id = target.id;
    end if;
    if r.host_id = target.id then
      update rooms set host_id = (select id from players where room_id = r.id and not left_game
                                  order by _online(last_seen_ms, v_now) desc, joined_ms limit 1)
      where id = r.id;
    end if;
    if r.phase = 'LETTER_SELECTION' and rd.chooser_id = target.id and sel->>'status' <> 'locked' then
      update rounds set chooser_id = (select host_id from rooms where id = r.id) where id = rd.id;
    end if;

  when 'transfer_host' then
    if not is_host then perform _fail('not_host', 'Only the host can hand over hosting.'); end if;
    select * into target from players where id = (p_action->>'playerId')::uuid and room_id = r.id and not left_game;
    if target.id is null or not _online(target.last_seen_ms, v_now) then perform _fail('not_found', 'That player is not online.'); end if;
    update rooms set host_id = target.id where id = r.id;

  else
    perform _fail('invalid', 'Unknown action.');
  end case;

  perform _bump(r.id);
end $$;

-- Per-viewer projection (mirrors engine.viewFor). Other players' answers stay hidden
-- until the review phase.
create or replace function public.get_snapshot(p_code text) returns jsonb
language plpgsql security definer set search_path = public stable as $$
declare
  r rooms;
  rd rounds;
  me uuid;
  v_now bigint := _now_ms();
  revealed boolean;
  round_json jsonb := null;
begin
  select * into r from rooms where code = upper(p_code);
  if not found then perform _fail('not_found', 'That room has closed.'); end if;
  select id into me from players where room_id = r.id and user_id = auth.uid() and not left_game;
  if me is null then perform _fail('resume_failed', 'You are not in this room.'); end if;
  rd := _current_round(r.id);
  revealed := r.phase in ('REVIEW','RESULTS','MATCH_OVER');

  if rd.id is not null then
    round_json := jsonb_build_object(
      'number', rd.number, 'chooserId', rd.chooser_id, 'selection', rd.selection,
      'letter', rd.letter, 'speed', rd.speed, 'categories', to_jsonb(rd.categories),
      'participants', to_jsonb(rd.participants),
      'startedAt', rd.started_ms, 'deadline', rd.deadline_ms, 'stoppedAt', rd.stopped_ms,
      'stoppedBy', rd.stopped_by, 'endReason', rd.end_reason, 'reviewAt', rd.review_ms,
      'scored', rd.scored, 'answersRevealed', revealed,
      'answers', coalesce((select jsonb_object_agg(pid, sheet) from (
          select a.player_id as pid, jsonb_object_agg(a.category, a.value) as sheet
          from answers a where a.round_id = rd.id and (revealed or a.player_id = me)
          group by a.player_id) x), '{}'::jsonb),
      'progress', coalesce((select jsonb_object_agg(p, (select count(*) from answers a
          where a.round_id = rd.id and a.player_id = p and _clean(a.value) <> '' and a.category = any(rd.categories)))
          from unnest(rd.participants) p), '{}'::jsonb),
      'submitted', coalesce((select jsonb_agg(player_id) from submissions where round_id = rd.id), '[]'::jsonb),
      'votes', coalesce((select jsonb_object_agg(k, vs) from (
          select answer_player || ':' || category as k, jsonb_object_agg(voter_id, vote) as vs
          from votes where round_id = rd.id group by answer_player, category) x), '{}'::jsonb),
      'flags', coalesce((select jsonb_object_agg(k, fs) from (
          select answer_player || ':' || category as k, jsonb_agg(flagger_id) as fs
          from flags where round_id = rd.id group by answer_player, category) x), '{}'::jsonb),
      'results', case when rd.scored then jsonb_build_object(
          'outcomes', (select jsonb_object_agg(player_id || ':' || category,
                         jsonb_build_object('status', status, 'units', units, 'duplicates', duplicates))
                       from round_scores where round_id = rd.id),
          'perPlayer', (select jsonb_object_agg(player_id, jsonb_build_object('total', total, 'byCategory', coalesce(bc, '{}'::jsonb))) from (
                         select player_id, sum(units) as total,
                                jsonb_object_agg(category, units) filter (where units > 0) as bc
                         from round_scores where round_id = rd.id group by player_id) x))
        else null end
    );
  end if;

  return jsonb_build_object(
    'code', r.code, 'version', r.version, 'phase', r.phase, 'hostId', r.host_id, 'you', me,
    'settings', r.settings, 'usedLetters', to_jsonb(r.used_letters), 'serverNow', v_now,
    'players', coalesce((select jsonb_agg(jsonb_build_object(
        'id', p.id, 'name', p.name, 'hue', p.hue, 'joinedAt', p.joined_ms,
        'connected', _online(p.last_seen_ms, v_now) and not p.left_game,
        'disconnectedAt', case when _online(p.last_seen_ms, v_now) then null else p.last_seen_ms end,
        'ready', p.ready, 'totalUnits', p.total_units, 'left', p.left_game) order by p.joined_ms)
      from players p where p.room_id = r.id), '[]'::jsonb),
    'round', round_json,
    'history', coalesce((select jsonb_agg(h order by (h->>'number')::int) from (
        select jsonb_build_object('number', x.number, 'letter', x.letter, 'perPlayer',
          (select jsonb_object_agg(player_id, jsonb_build_object('total', total, 'byCategory', coalesce(bc, '{}'::jsonb))) from (
             select player_id, sum(units) as total, jsonb_object_agg(category, units) filter (where units > 0) as bc
             from round_scores where round_id = x.id group by player_id) y)) as h
        from rounds x where x.room_id = r.id and x.scored) z), '[]'::jsonb)
  );
end $$;

-- Housekeeping: delete rooms idle for 6 hours. Schedule with pg_cron if available:
--   select cron.schedule('abc-cleanup', '*/30 * * * *', 'select public.cleanup_rooms()');
create or replace function public.cleanup_rooms() returns int
language sql security definer set search_path = public as $$
  with gone as (delete from rooms where last_activity < now() - interval '6 hours' returning 1)
  select count(*)::int from gone;
$$;

-- Lock down: internal helpers are not callable by clients; only the public RPCs are.
revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function public.create_room(text), public.join_room(text, text), public.resume_room(text),
  public.peek_room(text), public.heartbeat(text), public.tick(text), public.room_action(text, jsonb),
  public.get_snapshot(text) to authenticated;
grant execute on function public._is_member(uuid) to authenticated; -- used by the rooms RLS policy

-- Realtime: members receive UPDATEs on their room row (filtered by RLS).
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    begin
      alter publication supabase_realtime add table public.rooms;
    exception when duplicate_object then null;
    end;
  end if;
end $$;
