-- Pin search_path on internal helpers (Supabase advisor 0011_function_search_path_mutable).
alter function public._now_ms() set search_path = public, pg_temp;
alter function public._fail(text, text) set search_path = public, pg_temp;
alter function public._c(text) set search_path = public, pg_temp;
alter function public._clean(text) set search_path = public, pg_temp;
alter function public._norm(text) set search_path = public, pg_temp;
alter function public._check(text, text) set search_path = public, pg_temp;
alter function public._available(text[]) set search_path = public, pg_temp;
alter function public._bump(uuid) set search_path = public, pg_temp;
alter function public._online(bigint, bigint) set search_path = public, pg_temp;
alter function public._room_for_update(text) set search_path = public, pg_temp;
alter function public._current_round(uuid) set search_path = public, pg_temp;
alter function public._start_round(uuid, bigint) set search_path = public, pg_temp;
alter function public._lock_letter(uuid, uuid, text, text, text, bigint, jsonb) set search_path = public, pg_temp;
alter function public._reset_match(uuid) set search_path = public, pg_temp;
alter function public._settle(uuid, bigint) set search_path = public, pg_temp;
alter function public._score_round(uuid) set search_path = public, pg_temp;
