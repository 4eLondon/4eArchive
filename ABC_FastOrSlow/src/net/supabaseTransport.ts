// Supabase backend: anonymous auth + Postgres RPCs (server-authoritative) +
// Realtime change notifications on the room row. supabase-js is loaded lazily
// so the default WebSocket build does not ship it.
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import type { ClientAction, RoomView } from '../../shared/types';
import { ClockSync, Emitter, GameError, type ConnStatus, type PeekResult, type Seat, type Transport } from './transport';

const HEARTBEAT_MS = 5000;

export function createSupabaseTransport(url: string, anonKey: string): Transport {
  const clock = new ClockSync();
  const views = new Emitter<RoomView>();
  const statuses = new Emitter<ConnStatus>();
  const seatLost = new Emitter<string>();
  let status: ConnStatus = 'connecting';
  let seat: Seat | null = null;
  let channel: RealtimeChannel | null = null;
  let heartbeat: number | undefined;
  let wake: number | undefined;
  let lastVersion = 0;
  let refreshing: Promise<void> | null = null;
  let refreshAgain = false;

  const setStatus = (s: ConnStatus) => {
    if (s !== status) {
      status = s;
      statuses.emit(s);
    }
  };

  let clientPromise: Promise<SupabaseClient> | null = null;
  function client(): Promise<SupabaseClient> {
    clientPromise ??= (async () => {
      const { createClient } = await import('@supabase/supabase-js');
      const sb = createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true } });
      const { data } = await sb.auth.getSession();
      if (!data.session) {
        const { error } = await sb.auth.signInAnonymously();
        if (error) throw new GameError('auth', `Could not start a guest session: ${error.message}. Is anonymous sign-in enabled?`);
      }
      setStatus('online');
      return sb;
    })();
    return clientPromise;
  }

  async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
    const sb = await client();
    const sent = Date.now();
    const { data, error } = await sb.rpc(fn, args);
    if (error) {
      const m = /ABC:([a-z_]+):(.*)/s.exec(error.message);
      if (m) throw new GameError(m[1], m[2]);
      setStatus(navigator.onLine ? 'online' : 'offline');
      throw new GameError('offline', 'Could not reach the game server. Retrying...');
    }
    if (fn === 'heartbeat' && typeof data === 'number') clock.sample(sent, data, Date.now());
    setStatus('online');
    return data as T;
  }

  async function refresh(): Promise<void> {
    if (!seat) return;
    if (refreshing) {
      refreshAgain = true;
      return refreshing;
    }
    refreshing = (async () => {
      try {
        const view = await rpc<RoomView>('get_snapshot', { p_code: seat!.code });
        clock.hint(view.serverNow);
        if (view.version >= lastVersion) {
          lastVersion = view.version;
          views.emit(view);
          scheduleWake(view);
        }
      } catch (e) {
        if (e instanceof GameError && (e.code === 'resume_failed' || e.code === 'not_found')) lose(e.message);
      } finally {
        refreshing = null;
        if (refreshAgain) {
          refreshAgain = false;
          void refresh();
        }
      }
    })();
    return refreshing;
  }

  /** Ask the database to settle time-based transitions exactly when they are due. */
  function scheduleWake(v: RoomView) {
    window.clearTimeout(wake);
    const r = v.round;
    const times: number[] = [];
    if (v.phase === 'LETTER_SELECTION' && r) {
      if (r.selection.status === 'ticking') times.push(r.selection.startedAt + 15000);
      if (r.selection.status === 'locked') times.push(r.selection.revealUntil);
    }
    if (v.phase === 'ANSWERING' && r) {
      if (r.stoppedAt === null && r.deadline) times.push(r.deadline);
      if (r.reviewAt) times.push(r.reviewAt);
    }
    if (!times.length) return;
    const delay = Math.max(0, Math.min(...times) - clock.now()) + 60;
    wake = window.setTimeout(async () => {
      if (!seat) return;
      try {
        await rpc('tick', { p_code: seat.code });
      } catch {
        /* next heartbeat retries */
      }
      void refresh();
    }, delay);
  }

  async function follow(s: Seat) {
    unfollow();
    seat = s;
    lastVersion = 0;
    const sb = await client();
    channel = sb
      .channel(`room:${s.code}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `code=eq.${s.code}` }, () => void refresh())
      .subscribe((st) => {
        if (st === 'SUBSCRIBED') {
          setStatus('online');
          void refresh();
        } else if (st === 'CHANNEL_ERROR' || st === 'TIMED_OUT') setStatus('offline');
      });
    const beat = async () => {
      if (!seat) return;
      try {
        await rpc('heartbeat', { p_code: seat.code });
        void refresh(); // safety net if a realtime message was missed
      } catch (e) {
        if (e instanceof GameError && e.code === 'resume_failed') lose(e.message);
      }
    };
    heartbeat = window.setInterval(beat, HEARTBEAT_MS);
    await beat();
  }

  function unfollow() {
    window.clearInterval(heartbeat);
    window.clearTimeout(wake);
    if (channel) void client().then((sb) => sb.removeChannel(channel!));
    channel = null;
    seat = null;
  }

  function lose(reason: string) {
    unfollow();
    seatLost.emit(reason);
  }

  async function enter(fn: string, args: Record<string, unknown>): Promise<Seat> {
    const r = await rpc<{ code: string; playerId: string }>(fn, args);
    const s = { code: r.code, playerId: r.playerId, secret: '' };
    await follow(s);
    return s;
  }

  void client().catch((e) => {
    setStatus('offline');
    console.error(e);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void refresh();
  });

  return {
    kind: 'supabase',
    create: (name) => enter('create_room', { p_name: name }),
    join: (code, name) => enter('join_room', { p_code: code, p_name: name }),
    // Identity is the Supabase session, so "takeover" is implicit: same browser, same seat.
    resume: (s) => enter('resume_room', { p_code: s.code }),
    peek: (code) => rpc<PeekResult>('peek_room', { p_code: code }),
    async act(action: ClientAction) {
      if (!seat) throw new GameError('not_allowed', 'Join a room first.');
      await rpc('room_action', { p_code: seat.code, p_action: action });
      void refresh();
    },
    leave: unfollow,
    serverNow: () => clock.now(),
    onView: (cb) => views.on(cb),
    onStatus: (cb) => {
      cb(status);
      return statuses.on(cb);
    },
    onSeatLost: (cb) => seatLost.on(cb),
  };
}
