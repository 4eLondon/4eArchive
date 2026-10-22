import { MotionConfig } from 'motion/react';
import { lazy, Suspense, useEffect } from 'react';
import { Feedback } from './components/Feedback';
import { usePath } from './lib/router';
import { useReducedMotionPref } from './state/prefs';
import { Landing } from './screens/Landing';
import { normalizeCode } from './lib/code';

// The in-room game is split out so the landing page loads fast on phones.
const RoomScreen = lazy(() => import('./screens/RoomScreen').then((m) => ({ default: m.RoomScreen })));

export function App() {
  const path = usePath();
  const reduced = useReducedMotionPref();

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'off' : 'on';
  }, [reduced]);

  const roomMatch = path.match(/^\/room\/([A-Za-z]{3,6})\/?$/);

  return (
    <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
      <div className="app-backdrop" aria-hidden />
      <Suspense fallback={<div className="min-h-[100dvh]" aria-busy="true" />}>
        {roomMatch ? <RoomScreen key={roomMatch[1].toUpperCase()} code={normalizeCode(roomMatch[1])} /> : <Landing />}
      </Suspense>
      <Feedback />
    </MotionConfig>
  );
}
