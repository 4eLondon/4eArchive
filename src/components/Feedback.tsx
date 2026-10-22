import { WarningCircle, Info } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useAnnouncement, useToasts } from '../lib/hooks';

/** Toast stack + the polite live region used for game announcements. */
export function Feedback() {
  const toasts = useToasts();
  const announcement = useAnnouncement();
  return (
    <>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
      <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex flex-col items-center gap-2 px-4" role="alert" aria-live="assertive">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className={`pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-2xl ring-1 ${
                t.tone === 'error' ? 'bg-[#2a0f22] text-[#ffd0e2] ring-pink/40' : 'bg-night-700 text-ink ring-white/10'
              }`}
            >
              {t.tone === 'error' ? (
                <WarningCircle size={20} weight="fill" className="mt-px shrink-0 text-pink" aria-hidden />
              ) : (
                <Info size={20} weight="fill" className="mt-px shrink-0 text-cyan" aria-hidden />
              )}
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
