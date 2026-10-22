import { useSyncExternalStore } from 'react';

// Two routes ("/" and "/room/CODE") do not justify a router dependency.
const subs = new Set<() => void>();
window.addEventListener('popstate', () => subs.forEach((s) => s()));

export function navigate(to: string, replace = false) {
  if (to === location.pathname) return;
  history[replace ? 'replaceState' : 'pushState'](null, '', to);
  subs.forEach((s) => s());
  window.scrollTo(0, 0);
}

export function usePath() {
  return useSyncExternalStore(
    (cb) => {
      subs.add(cb);
      return () => void subs.delete(cb);
    },
    () => location.pathname,
  );
}

export const roomUrl = (code: string) => `${location.origin}/room/${code}`;
