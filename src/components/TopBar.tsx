import { DotsThreeVertical, Pause, Play, SignOut, SpeakerHigh, SpeakerSlash, WifiSlash } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { RoomView } from '../../shared/types';
import { navigate } from '../lib/router';
import { sfx } from '../lib/sound';
import { game, useGame } from '../state/game';
import { setPrefs, usePrefs } from '../state/prefs';
import { IconButton, Keycap, Watermark } from './ui';

const PHASE_SHORT: Record<RoomView['phase'], string> = {
  LOBBY: 'Lobby',
  LETTER_SELECTION: 'Calling',
  ANSWERING: 'Answering',
  REVIEW: 'Review',
  RESULTS: 'Results',
  MATCH_OVER: 'Final',
};

export function TopBar({ view }: { view: RoomView }) {
  const { status } = useGame();
  const prefs = usePrefs();
  const [menu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const roundNo = view.round?.number;
  const total = view.settings.rounds;

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [menu]);

  async function leave() {
    if (!confirm('Leave this room? Your seat and score will be given up.')) return;
    await game.leave();
    navigate('/');
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/6 bg-night-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-2 px-3 sm:px-4">
          <div className="flex shrink-0 items-center gap-2" aria-label={`Room code ${view.code}`}>
            <Keycap color="sun" size={34}>
              {view.code[0]}
            </Keycap>
            <div className="leading-tight">
              <div className="font-display text-lg font-extrabold tracking-[0.12em] sm:tracking-[0.18em]">{view.code}</div>
              <div className="whitespace-nowrap text-xs text-ink-mute">
                {PHASE_SHORT[view.phase]}
                {roundNo && view.phase !== 'LOBBY' ? ` · Round ${roundNo}${total ? `/${total}` : ''}` : ''}
              </div>
            </div>
          </div>

          <Watermark className="ml-auto hidden min-w-0 truncate min-[340px]:block" />
          <div className="ml-1 flex shrink-0 items-center max-[339px]:ml-auto sm:ml-2">
            <IconButton
              label={prefs.sound ? 'Mute sounds' : 'Turn sounds on'}
              aria-pressed={prefs.sound}
              onClick={() => {
                setPrefs({ sound: !prefs.sound });
                if (!prefs.sound) requestAnimationFrame(() => sfx.pop());
              }}
            >
              {prefs.sound ? <SpeakerHigh size={22} weight="bold" /> : <SpeakerSlash size={22} weight="bold" />}
            </IconButton>
            <div className="relative" ref={menuRef}>
              <IconButton label="Room menu" aria-expanded={menu} aria-haspopup="menu" onClick={() => setMenu((m) => !m)}>
                <DotsThreeVertical size={24} weight="bold" />
              </IconButton>
              <AnimatePresence>
                {menu && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-60 origin-top-right rounded-2xl bg-night-800 p-1.5 shadow-2xl ring-1 ring-white/10"
                  >
                    <button
                      role="menuitem"
                      onClick={() => setPrefs({ motion: prefs.motion === 'off' ? 'system' : 'off' })}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm hover:bg-white/6"
                    >
                      {prefs.motion === 'off' ? <Play size={18} aria-hidden /> : <Pause size={18} aria-hidden />}
                      {prefs.motion === 'off' ? 'Turn animations on' : 'Reduce animations'}
                    </button>
                    <button
                      role="menuitem"
                      onClick={leave}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-[#ffb3cf] hover:bg-pink/10"
                    >
                      <SignOut size={18} aria-hidden /> Leave room
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {status !== 'online' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-pink/15 text-[#ffd0e2]"
            role="status"
          >
            <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2 text-sm">
              <WifiSlash size={18} weight="bold" aria-hidden />
              Connection lost. Reconnecting, your seat is saved.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
