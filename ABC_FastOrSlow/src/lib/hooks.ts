import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { game } from '../state/game';
import { GameError } from '../net/transport';
import type { ClientAction } from '../../shared/types';

/** Server-synchronised clock that re-renders every `intervalMs` (or every frame when 0). */
export function useServerNow(intervalMs = 250, active = true): number {
  const [now, setNow] = useState(() => game.serverNow());
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let timer = 0;
    const loop = () => {
      setNow(game.serverNow());
      raf = requestAnimationFrame(loop);
    };
    if (intervalMs === 0) raf = requestAnimationFrame(loop);
    else timer = window.setInterval(() => setNow(game.serverNow()), intervalMs);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(timer);
    };
  }, [intervalMs, active]);
  return now;
}

// ─── Toasts + screen-reader announcements ─────────────────────────────────

export interface Toast {
  id: number;
  text: string;
  tone: 'error' | 'info';
}
let toasts: Toast[] = [];
let announcement = '';
let n = 0;
const subs = new Set<() => void>();
const notify = () => subs.forEach((s) => s());
const sub = (cb: () => void) => {
  subs.add(cb);
  return () => void subs.delete(cb);
};

export function toast(text: string, tone: Toast['tone'] = 'error') {
  const id = ++n;
  toasts = [...toasts.slice(-2), { id, text, tone }];
  notify();
  window.setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, 4200);
}

/** Polite live-region announcement for major game transitions. */
export function announce(text: string) {
  // Re-announce identical text by toggling a zero-width char.
  announcement = announcement === text ? `${text}​` : text;
  notify();
}

export function useToasts() {
  return useSyncExternalStore(sub, () => toasts);
}
export function useAnnouncement() {
  return useSyncExternalStore(sub, () => announcement);
}

/** Send an action; surface refusals as a toast. Returns true on success. */
export function useAct() {
  const [busy, setBusy] = useState<string | null>(null);
  const mounted = useRef(true);
  useEffect(() => () => void (mounted.current = false), []);
  async function act(action: ClientAction, opts: { quiet?: boolean } = {}): Promise<boolean> {
    setBusy(action.type);
    try {
      await game.act(action);
      return true;
    } catch (e) {
      if (!opts.quiet) toast(e instanceof GameError ? e.message : 'Something went wrong. Try again.');
      return false;
    } finally {
      if (mounted.current) setBusy(null);
    }
  }
  return { act, busy };
}

/** Run a callback once when `value` changes from its previous value (not on mount). */
export function useOnChange<T>(value: T, cb: (value: T, prev: T) => void) {
  const prev = useRef(value);
  useEffect(() => {
    if (prev.current !== value) {
      const p = prev.current;
      prev.current = value;
      cb(value, p);
    }
  });
}
