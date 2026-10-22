import type { Seat } from '../net/transport';

// Seat credentials (player id + secret) let a player reconnect to the same seat.
// sessionStorage = this tab (survives refresh); localStorage = fallback after the tab closed.
const key = (code: string) => `abc:seat:${code}`;

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export function saveSeat(seat: Seat) {
  const v = JSON.stringify(seat);
  safe(() => sessionStorage.setItem(key(seat.code), v), undefined);
  safe(() => localStorage.setItem(key(seat.code), v), undefined);
}

export function loadSeat(code: string): { seat: Seat; source: 'session' | 'local' } | null {
  const s = safe(() => sessionStorage.getItem(key(code)), null);
  if (s) return { seat: JSON.parse(s), source: 'session' };
  const l = safe(() => localStorage.getItem(key(code)), null);
  if (l) return { seat: JSON.parse(l), source: 'local' };
  return null;
}

export function forgetSeat(code: string) {
  safe(() => sessionStorage.removeItem(key(code)), undefined);
  safe(() => localStorage.removeItem(key(code)), undefined);
}

export const savedName = {
  get: () => safe(() => localStorage.getItem('abc:name') ?? '', ''),
  set: (n: string) => safe(() => localStorage.setItem('abc:name', n), undefined),
};
