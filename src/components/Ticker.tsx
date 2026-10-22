import { AnimatePresence, motion } from 'motion/react';
import { Keycap } from './ui';

/**
 * The alphabet ticker: a big keycap showing the current letter and a strip of
 * the letters around it. Pure display: the parent decides the tick index from
 * the shared server clock, so every device shows the same letter.
 */
export function TickerDisplay({
  sequence,
  tick,
  frozen = false,
  size = 180,
  fast = false,
}: {
  sequence: string[];
  tick: number;
  frozen?: boolean;
  size?: number;
  fast?: boolean;
}) {
  const len = sequence.length;
  const at = (i: number) => sequence[(((tick + i) % len) + len) % len];
  const letter = at(0);
  const strip = [-3, -2, -1, 0, 1, 2, 3];

  return (
    <div className="flex flex-col items-center gap-7">
      <div className="relative" style={{ width: size, height: size + size / 11 }}>
        {frozen && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-[28%]"
            initial={{ scale: 0.9, opacity: 0.9 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            style={{ boxShadow: '0 0 0 6px var(--color-sun)' }}
          />
        )}
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={`${tick}-${letter}`}
            initial={{ y: fast ? -size * 0.12 : -size * 0.25, opacity: 0, rotateX: 50 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: fast ? size * 0.12 : size * 0.25, opacity: 0, rotateX: -50, transition: { duration: fast ? 0.05 : 0.1 } }}
            transition={{ duration: fast ? 0.07 : 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
            style={{ transformPerspective: 600 }}
          >
            <Keycap size={size} color={frozen ? 'sun' : 'night'}>
              {letter}
            </Keycap>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2" aria-hidden>
        {strip.map((i) => (
          <span
            key={i}
            className={`grid place-items-center rounded-xl font-display font-bold transition-all duration-100 ${
              i === 0
                ? frozen
                  ? 'size-11 bg-sun text-night-950 text-xl'
                  : 'size-11 bg-white/12 text-ink text-xl'
                : 'size-8 text-ink-mute text-sm'
            }`}
            style={{ opacity: i === 0 ? 1 : 1 - Math.abs(i) * 0.22 }}
          >
            {at(i)}
          </span>
        ))}
      </div>
    </div>
  );
}
