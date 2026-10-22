import type { ClientAction, Phase, RoomView } from '../../shared/types';

export interface Seat {
  code: string;
  playerId: string;
  secret: string;
}

export interface PeekResult {
  exists: boolean;
  phase?: Phase;
  players?: number;
  full?: boolean;
}

export type ConnStatus = 'connecting' | 'online' | 'offline';

export class GameError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

/**
 * A backend the client can play through. Two implementations:
 *  - wsTransport: the bundled Node realtime server (default, works offline on a LAN)
 *  - supabaseTransport: Supabase Postgres RPCs + Realtime
 * Both are server-authoritative; the client only sends intentions.
 */
export interface Transport {
  readonly kind: 'ws' | 'supabase';
  create(name: string): Promise<Seat>;
  join(code: string, name: string): Promise<Seat>;
  resume(seat: Seat, takeover: boolean): Promise<Seat>;
  peek(code: string): Promise<PeekResult>;
  act(action: ClientAction): Promise<void>;
  /** Stop following the current room. */
  leave(): void;
  /** Best estimate of the server clock, in ms since epoch. */
  serverNow(): number;
  onView(cb: (view: RoomView) => void): () => void;
  onStatus(cb: (status: ConnStatus) => void): () => void;
  /** Fired when the server refuses to restore our seat (kicked, room gone, duplicate tab). */
  onSeatLost(cb: (reason: string) => void): () => void;
}

/** Tiny typed event emitter shared by transports. */
export class Emitter<T> {
  private subs = new Set<(v: T) => void>();
  on(cb: (v: T) => void) {
    this.subs.add(cb);
    return () => void this.subs.delete(cb);
  }
  emit(v: T) {
    for (const s of this.subs) s(v);
  }
}

/** Keeps a running estimate of server time from round-trip samples (lowest RTT wins). */
export class ClockSync {
  private offset = 0;
  private bestRtt = Infinity;
  private samples = 0;
  sample(clientSent: number, serverTime: number, clientReceived: number) {
    const rtt = clientReceived - clientSent;
    this.samples++;
    // Prefer low-latency samples, but let the estimate drift if the network changes.
    if (rtt <= this.bestRtt * 1.2 || this.samples % 10 === 0) {
      this.bestRtt = Math.min(this.bestRtt, rtt);
      this.offset = serverTime - (clientSent + rtt / 2);
    }
  }
  /** Coarse fallback when we only have a server timestamp. */
  hint(serverTime: number) {
    if (this.samples === 0) this.offset = serverTime - Date.now();
  }
  now() {
    return Date.now() + this.offset;
  }
}
