import { useSyncExternalStore } from 'react';

// Per-device conveniences: sound (muted by default) and an animation switch.
export interface Prefs {
  sound: boolean;
  motion: 'system' | 'off';
}

const KEY = 'abc:prefs';
let prefs: Prefs = { sound: false, motion: 'system' };
try {
  prefs = { ...prefs, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') };
} catch {
  /* private mode */
}
const subs = new Set<() => void>();

export function setPrefs(patch: Partial<Prefs>) {
  prefs = { ...prefs, ...patch };
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
  for (const s of subs) s();
}

export function getPrefs() {
  return prefs;
}

export function usePrefs(): Prefs {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => void subs.delete(cb);
    },
    () => prefs,
  );
}

const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

/** True when animations should be minimal: OS setting or the in-app switch. */
export function useReducedMotionPref(): boolean {
  const p = usePrefs();
  const system = useSyncExternalStore(
    (cb) => {
      mq?.addEventListener('change', cb);
      return () => mq?.removeEventListener('change', cb);
    },
    () => mq?.matches ?? false,
  );
  return system || p.motion === 'off';
}
