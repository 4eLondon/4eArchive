// Tiny synthesized sound kit (no audio files to download). Silent unless the
// player turns sound on. Every sound has a visual equivalent in the UI.
import { getPrefs } from '../state/prefs';

let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (!getPrefs().sound) return null;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq: number, dur: number, opts: { type?: OscillatorType; gain?: number; at?: number; slideTo?: number } = {}) {
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime + (opts.at ?? 0);
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = opts.type ?? 'triangle';
  osc.frequency.setValueAtTime(freq, t0);
  if (opts.slideTo) osc.frequency.exponentialRampToValueAtTime(opts.slideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(opts.gain ?? 0.15, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export const sfx = {
  /** Unlocks audio on iOS; call from a user gesture. */
  unlock() {
    ac();
  },
  tick: () => tone(1400, 0.035, { type: 'square', gain: 0.04 }),
  stop: () => {
    tone(520, 0.22, { type: 'sawtooth', gain: 0.12, slideTo: 140 });
    tone(260, 0.3, { type: 'square', gain: 0.06, at: 0.02, slideTo: 90 });
  },
  reveal: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, { at: i * 0.07, gain: 0.12 })),
  countdown: (urgent = false) => tone(urgent ? 990 : 740, 0.09, { type: 'square', gain: urgent ? 0.09 : 0.05 }),
  pop: () => tone(880, 0.07, { type: 'sine', gain: 0.08, slideTo: 1320 }),
  results: () => [392, 523, 659, 784, 1046].forEach((f, i) => tone(f, 0.35, { at: i * 0.09, gain: 0.1 })),
};
