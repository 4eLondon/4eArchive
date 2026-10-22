import type { ClientAction, ClientMessage, RoomView, ServerMessage } from '../../shared/types';
import { ClockSync, Emitter, GameError, type ConnStatus, type PeekResult, type Seat, type Transport } from './transport';

type Pending = { resolve: (m: ServerMessage) => void; reject: (e: Error) => void; timer: number };

/** Transport for the bundled Node realtime server, with auto-reconnect and seat resume. */
export function createWsTransport(url = defaultUrl()): Transport {
  const clock = new ClockSync();
  const views = new Emitter<RoomView>();
  const statuses = new Emitter<ConnStatus>();
  const seatLost = new Emitter<string>();
  const pending = new Map<string, Pending>();
  let ws: WebSocket | null = null;
  let status: ConnStatus = 'connecting';
  let seat: Seat | null = null;
  let reqN = 0;
  let retry = 0;
  let pingTimer: number | undefined;
  let lastVersion = 0;
  let wantOpen = true;

  const setStatus = (s: ConnStatus) => {
    if (s !== status) {
      status = s;
      statuses.emit(s);
    }
  };

  function connect() {
    if (!wantOpen) return;
    setStatus('connecting');
    const sock = new WebSocket(url);
    ws = sock;
    sock.onopen = async () => {
      retry = 0;
      ping();
      window.clearInterval(pingTimer);
      pingTimer = window.setInterval(ping, 5000);
      // Burst a few pings to get a good clock estimate quickly.
      setTimeout(ping, 150);
      setTimeout(ping, 400);
      if (seat) {
        try {
          await send({ t: 'resume', code: seat.code, playerId: seat.playerId, secret: seat.secret, takeover: true });
        } catch (e) {
          const err = e as GameError;
          if (err.code === 'resume_failed' || err.code === 'not_found') {
            seat = null;
            seatLost.emit(err.message);
          }
        }
      }
      setStatus('online');
    };
    sock.onmessage = (ev) => {
      const msg = JSON.parse(ev.data) as ServerMessage;
      if (msg.t === 'pong') return clock.sample(msg.clientTime, msg.serverTime, Date.now());
      if (msg.t === 'state') {
        clock.hint(msg.view.serverNow);
        if (msg.view.version < lastVersion && msg.view.code === seat?.code) return; // stale
        lastVersion = msg.view.version;
        return views.emit(msg.view);
      }
      if ('reqId' in msg && msg.reqId && pending.has(msg.reqId)) {
        const p = pending.get(msg.reqId)!;
        pending.delete(msg.reqId);
        window.clearTimeout(p.timer);
        if (msg.t === 'error') p.reject(new GameError(msg.error, msg.message));
        else p.resolve(msg);
      }
    };
    sock.onclose = (ev) => {
      window.clearInterval(pingTimer);
      for (const p of pending.values()) {
        window.clearTimeout(p.timer);
        p.reject(new GameError('offline', 'Connection lost. Reconnecting...'));
      }
      pending.clear();
      if (ev.code === 4000) {
        // Another tab took over this seat.
        seat = null;
        seatLost.emit('You opened this game in another tab.');
      } else if (ev.code === 4001) {
        seat = null;
        seatLost.emit(ev.reason === 'removed' ? 'The host removed you from the room.' : 'You left the room.');
      }
      if (ws !== sock) return;
      setStatus('offline');
      const delay = Math.min(8000, 400 * 2 ** retry++) * (0.75 + Math.random() * 0.5);
      window.setTimeout(connect, delay);
    };
  }

  function ping() {
    if (ws?.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ t: 'ping', clientTime: Date.now() } satisfies ClientMessage));
  }

  async function ready() {
    if (ws?.readyState === WebSocket.OPEN) return;
    await new Promise<void>((resolve, reject) => {
      const t = window.setTimeout(() => reject(new GameError('offline', 'Cannot reach the game server.')), 10000);
      const off = statuses.on(() => {
        if (ws?.readyState === WebSocket.OPEN) {
          window.clearTimeout(t);
          off();
          resolve();
        }
      });
      if (ws?.readyState === WebSocket.OPEN) {
        window.clearTimeout(t);
        off();
        resolve();
      }
    });
  }

  function send(msg: Record<string, unknown> & { t: string }): Promise<ServerMessage> {
    const reqId = String(++reqN);
    return new Promise((resolve, reject) => {
      if (ws?.readyState !== WebSocket.OPEN) return reject(new GameError('offline', 'Not connected.'));
      const timer = window.setTimeout(() => {
        pending.delete(reqId);
        reject(new GameError('timeout', 'The server did not answer. Try again.'));
      }, 10000);
      pending.set(reqId, { resolve, reject, timer });
      ws.send(JSON.stringify({ ...msg, reqId }));
    });
  }

  async function enter(msg: Record<string, unknown> & { t: string }): Promise<Seat> {
    await ready();
    lastVersion = 0;
    const r = await send(msg);
    if (r.t !== 'joined') throw new GameError('bad_request', 'Unexpected reply.');
    seat = { code: r.code, playerId: r.playerId, secret: r.secret };
    return seat;
  }

  connect();
  // Reconnect quickly when a phone comes back from the background.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && ws && ws.readyState > WebSocket.OPEN) connect();
  });

  return {
    kind: 'ws',
    create: (name) => enter({ t: 'create', name }),
    join: (code, name) => enter({ t: 'join', code, name }),
    resume: (s, takeover) => enter({ t: 'resume', code: s.code, playerId: s.playerId, secret: s.secret, takeover }),
    async peek(code): Promise<PeekResult> {
      await ready();
      const r = await send({ t: 'peek', code });
      return r.t === 'peeked' ? { exists: r.exists, phase: r.phase, players: r.players, full: r.full } : { exists: false };
    },
    async act(action: ClientAction) {
      await ready();
      await send({ t: 'action', action });
    },
    leave() {
      seat = null;
      lastVersion = 0;
      // Reconnect with a clean socket so the server releases our presence.
      wantOpen = true;
      ws?.close();
    },
    serverNow: () => clock.now(),
    onView: (cb) => views.on(cb),
    onStatus: (cb) => {
      cb(status);
      return statuses.on(cb);
    },
    onSeatLost: (cb) => seatLost.on(cb),
  };
}

function defaultUrl() {
  const fromEnv = import.meta.env.VITE_WS_URL as string | undefined;
  if (fromEnv) return fromEnv;
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  return `${proto}://${location.host}/ws`;
}
