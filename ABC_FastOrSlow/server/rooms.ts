// Room manager for the self-hosted realtime server. It owns every RoomState,
// runs the engine, schedules deadline timers and pushes per-player views.

import { randomBytes, randomInt, randomUUID, timingSafeEqual } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { ROOM_CODE_ALPHABET, ROOM_CODE_LENGTH } from '../shared/constants';
import { addPlayer, applyAction, createRoom, nextWakeAt, sanitizeName, setConnected, tick, viewFor } from '../shared/engine';
import type { ActionResult, ClientAction, RoomState, ServerMessage } from '../shared/types';

export interface Conn {
  send(msg: ServerMessage): void;
  close(code?: number, reason?: string): void;
}

interface Room {
  state: RoomState;
  secrets: Map<string, string>;
  conns: Map<string, Set<Conn>>;
  timer: NodeJS.Timeout | null;
}

const ROOM_TTL_MS = 6 * 60 * 60 * 1000; // empty rooms expire after 6h idle

export type JoinResult =
  | { ok: true; code: string; playerId: string; secret: string }
  | { ok: false; error: 'not_found' | 'room_full' | 'invalid' | 'resume_failed'; message: string };

export class RoomManager {
  private rooms = new Map<string, Room>();
  private saveTimer: NodeJS.Timeout | null = null;
  private sweepTimer: NodeJS.Timeout;

  constructor(
    private opts: { persistPath?: string; now?: () => number; rng?: () => number } = {},
  ) {
    this.load();
    this.sweepTimer = setInterval(() => this.sweep(), 60_000);
    this.sweepTimer.unref();
  }

  private now() {
    return this.opts.now?.() ?? Date.now();
  }
  private rng() {
    return this.opts.rng?.() ?? randomInt(0, 2 ** 31) / 2 ** 31;
  }

  // ── public API ──────────────────────────────────────────────────────────

  create(name: string, conn: Conn): JoinResult {
    if (!sanitizeName(name)) return { ok: false, error: 'invalid', message: 'Pick a display name first.' };
    const code = this.newCode();
    const playerId = randomUUID();
    const room: Room = {
      state: createRoom(code, { id: playerId, name }, this.now()),
      secrets: new Map(),
      conns: new Map(),
      timer: null,
    };
    this.rooms.set(code, room);
    return this.attach(room, playerId, conn, true);
  }

  join(codeRaw: string, name: string, conn: Conn): JoinResult {
    const room = this.rooms.get(normalizeCode(codeRaw));
    if (!room) return { ok: false, error: 'not_found', message: 'No room with that code. Check it and try again.' };
    const playerId = randomUUID();
    const res = addPlayer(room.state, { id: playerId, name }, this.now());
    if (!res.ok) return { ok: false, error: res.error === 'room_full' ? 'room_full' : 'invalid', message: res.message };
    room.state = res.state;
    return this.attach(room, playerId, conn, true);
  }

  resume(codeRaw: string, playerId: string, secret: string, conn: Conn, takeover: boolean): JoinResult {
    const room = this.rooms.get(normalizeCode(codeRaw));
    if (!room) return { ok: false, error: 'not_found', message: 'That room has closed.' };
    const expected = room.secrets.get(playerId);
    const player = room.state.players.find((p) => p.id === playerId && !p.left);
    if (!expected || !player || !safeEqual(expected, secret))
      return { ok: false, error: 'resume_failed', message: 'Could not restore your seat.' };
    const existing = room.conns.get(playerId);
    if (existing?.size && !takeover)
      return { ok: false, error: 'resume_failed', message: 'That player is already connected in another tab.' };
    // Take over: the newest connection wins, older ones are closed.
    for (const old of existing ?? []) old.close(4000, 'replaced');
    room.conns.set(playerId, new Set());
    return this.attach(room, playerId, conn, false, secret);
  }

  peek(codeRaw: string) {
    const room = this.rooms.get(normalizeCode(codeRaw));
    if (!room) return { exists: false };
    const players = room.state.players.filter((p) => !p.left).length;
    return { exists: true, phase: room.state.phase, players, full: players >= 12 };
  }

  action(code: string, playerId: string, action: ClientAction): ActionResult {
    const room = this.rooms.get(code);
    if (!room) return { ok: false, error: 'not_found', message: 'Room closed.' };
    const res = applyAction(room.state, playerId, action, { now: this.now(), rng: () => this.rng() });
    if (res.ok) {
      room.state = res.state;
      // Kicked / departed players lose their connection.
      for (const [pid, set] of room.conns) {
        const p = room.state.players.find((x) => x.id === pid);
        if (!p || p.left) {
          for (const c of set) c.close(4001, pid === playerId ? 'left' : 'removed');
          room.conns.delete(pid);
          room.secrets.delete(pid);
        }
      }
      this.changed(room);
    }
    return res;
  }

  disconnect(code: string, playerId: string, conn: Conn) {
    const room = this.rooms.get(code);
    if (!room) return;
    const set = room.conns.get(playerId);
    if (!set?.delete(conn)) return;
    if (set.size === 0) {
      room.state = setConnected(room.state, playerId, false, this.now());
      this.changed(room);
    }
  }

  /** Test/diagnostic access. */
  getState(code: string): RoomState | undefined {
    return this.rooms.get(code)?.state;
  }

  dispose() {
    clearInterval(this.sweepTimer);
    for (const r of this.rooms.values()) if (r.timer) clearTimeout(r.timer);
    this.flush();
  }

  // ── internals ───────────────────────────────────────────────────────────

  private attach(room: Room, playerId: string, conn: Conn, fresh: boolean, secret?: string): JoinResult {
    const s = secret ?? randomBytes(24).toString('base64url');
    if (fresh) room.secrets.set(playerId, s);
    if (!room.conns.has(playerId)) room.conns.set(playerId, new Set());
    room.conns.get(playerId)!.add(conn);
    room.state = setConnected(room.state, playerId, true, this.now());
    this.changed(room);
    return { ok: true, code: room.state.code, playerId, secret: s };
  }

  private changed(room: Room) {
    this.broadcast(room);
    this.schedule(room);
    this.persistSoon();
  }

  private broadcast(room: Room) {
    const now = this.now();
    for (const [pid, set] of room.conns) {
      if (!set.size) continue;
      const msg: ServerMessage = { t: 'state', view: viewFor(room.state, pid, now) };
      for (const c of set) c.send(msg);
    }
  }

  private schedule(room: Room) {
    if (room.timer) clearTimeout(room.timer);
    room.timer = null;
    const at = nextWakeAt(room.state);
    if (at === null) return;
    room.timer = setTimeout(() => {
      room.timer = null;
      const next = tick(room.state, { now: this.now(), rng: () => this.rng() });
      if (next) {
        room.state = next;
        this.changed(room);
      } else this.schedule(room);
    }, Math.max(0, at - this.now()) + 5);
  }

  private newCode(): string {
    for (let attempt = 0; attempt < 1000; attempt++) {
      const len = ROOM_CODE_LENGTH + (attempt > 500 ? 1 : 0);
      let code = '';
      for (let i = 0; i < len; i++) code += ROOM_CODE_ALPHABET[randomInt(ROOM_CODE_ALPHABET.length)];
      if (!this.rooms.has(code)) return code;
    }
    throw new Error('Could not allocate a room code');
  }

  private sweep() {
    const now = this.now();
    for (const [code, room] of this.rooms) {
      const anyone = [...room.conns.values()].some((s) => s.size > 0);
      if (!anyone && now - room.state.lastActivity > ROOM_TTL_MS) {
        if (room.timer) clearTimeout(room.timer);
        this.rooms.delete(code);
      }
    }
    this.persistSoon();
  }

  // Persistence: rooms survive a server restart (players simply reconnect).
  private persistSoon() {
    if (!this.opts.persistPath || this.saveTimer) return;
    this.saveTimer = setTimeout(() => {
      this.saveTimer = null;
      this.flush();
    }, 500);
    this.saveTimer.unref();
  }

  private flush() {
    const path = this.opts.persistPath;
    if (!path) return;
    const data = [...this.rooms.values()].map((r) => ({ state: r.state, secrets: [...r.secrets] }));
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(`${path}.tmp`, JSON.stringify(data));
    renameSync(`${path}.tmp`, path);
  }

  private load() {
    const path = this.opts.persistPath;
    if (!path || !existsSync(path)) return;
    try {
      const data = JSON.parse(readFileSync(path, 'utf8')) as { state: RoomState; secrets: [string, string][] }[];
      const now = this.now();
      for (const d of data) {
        // Everyone is offline after a restart until their client reconnects.
        let state = d.state;
        for (const p of state.players) if (p.connected) state = setConnected(state, p.id, false, now);
        const room: Room = { state, secrets: new Map(d.secrets), conns: new Map(), timer: null };
        this.rooms.set(state.code, room);
        this.schedule(room);
      }
    } catch (err) {
      console.error('Could not load persisted rooms:', err);
    }
  }
}

export function normalizeCode(code: string): string {
  return String(code ?? '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 6);
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(String(b ?? ''));
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}
