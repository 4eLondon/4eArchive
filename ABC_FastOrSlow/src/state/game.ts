// Client-side game store: one transport, the current seat, and the latest
// server view. Components read it with useGame(); they never mutate game
// state locally, they call act() and wait for the server's next view.

import { useSyncExternalStore } from 'react';
import type { ClientAction, RoomView } from '../../shared/types';
import { createTransport } from '../net';
import { GameError, type ConnStatus, type Seat, type Transport } from '../net/transport';
import { forgetSeat, loadSeat, saveSeat } from './identity';

export interface GameSnapshot {
  seat: Seat | null;
  view: RoomView | null;
  status: ConnStatus;
  seatLost: string | null;
}

let transport: Transport | null = null;
/** The newest view seen, even if it arrived just before the seat was confirmed. */
let latestView: RoomView | null = null;
let snap: GameSnapshot = { seat: null, view: null, status: 'connecting', seatLost: null };
const subs = new Set<() => void>();

const viewFor = (seat: Seat) => (latestView?.code === seat.code && latestView.you === seat.playerId ? latestView : null);

function set(patch: Partial<GameSnapshot>) {
  snap = { ...snap, ...patch };
  for (const s of subs) s();
}

function t(): Transport {
  if (!transport) {
    transport = createTransport();
    transport.onView((view) => {
      latestView = view;
      if (snap.seat && view.code === snap.seat.code && view.you === snap.seat.playerId) set({ view });
    });
    transport.onStatus((status) => set({ status }));
    transport.onSeatLost((reason) => {
      if (snap.seat) forgetSeat(snap.seat.code);
      set({ seat: null, view: null, seatLost: reason });
    });
  }
  return transport;
}

export const game = {
  get snapshot() {
    return snap;
  },
  backend: () => t().kind,
  serverNow: () => t().serverNow(),

  async create(name: string) {
    const seat = await t().create(name);
    saveSeat(seat);
    set({ seat, view: viewFor(seat), seatLost: null });
    return seat;
  },

  async join(code: string, name: string) {
    const seat = await t().join(code, name);
    saveSeat(seat);
    set({ seat, view: viewFor(seat), seatLost: null });
    return seat;
  },

  /**
   * Try to restore a seat for this room. Seats in this tab's sessionStorage take over
   * unconditionally (it is a refresh/reconnect); seats only found in localStorage are
   * resumed only if nobody else is using them (avoids two tabs sharing one player).
   */
  async resumeRoom(code: string): Promise<'resumed' | 'no-seat'> {
    if (snap.seat?.code === code) return 'resumed';
    const found = loadSeat(code);
    if (!found) return 'no-seat';
    try {
      const seat = await t().resume(found.seat, found.source === 'session');
      saveSeat(seat);
      set({ seat, view: viewFor(seat), seatLost: null });
      return 'resumed';
    } catch (e) {
      if (e instanceof GameError && (e.code === 'resume_failed' || e.code === 'not_found')) {
        if (found.source === 'session' || e.code === 'not_found') forgetSeat(code);
        return 'no-seat';
      }
      throw e;
    }
  },

  peek: (code: string) => t().peek(code),

  act(action: ClientAction) {
    return t().act(action);
  },

  async leave() {
    const seat = snap.seat;
    if (seat) {
      try {
        await t().act({ type: 'leave' });
      } catch {
        /* leaving anyway */
      }
      forgetSeat(seat.code);
    }
    t().leave();
    set({ seat: null, view: null });
  },

  clearSeatLost() {
    set({ seatLost: null });
  },

  /** Warm up the connection early (landing page) so creating a room is instant. */
  warm() {
    t();
  },
};

export function useGame(): GameSnapshot {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => void subs.delete(cb);
    },
    () => snap,
  );
}
