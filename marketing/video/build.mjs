// Builds the ABC Fast or Slow video ad:
//   1. synthesizes the soundtrack (beat + sound effects synced to the visuals)
//   2. drives headless Edge through ad-video.html frame by frame
//   3. encodes H.264/AAC MP4 with ffmpeg
// Usage: node marketing/video/build.mjs        (writes marketing/abc-fast-or-slow-video.mp4)
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ffmpeg from 'ffmpeg-static';
import puppeteer from 'puppeteer-core';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..', 'abc-fast-or-slow-video.mp4');
const FPS = 30;
const DURATION = 16.5;
const SR = 44100;

// ─── soundtrack ─────────────────────────────────────────────────────────────
const N = Math.ceil(DURATION * SR);
const mix = new Float32Array(N);
let seed = 7;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32) * 2 - 1;

function voice(t0, dur, gain, sample) {
  const s0 = Math.floor(t0 * SR), n = Math.floor(dur * SR);
  for (let i = 0; i < n && s0 + i < N; i++) if (s0 + i >= 0) mix[s0 + i] += gain * sample(i / SR, i / n);
}
const tone = (t0, f, dur, gain, { to = f, shape = 'sine', attack = 0.004 } = {}) => {
  let ph = 0;
  voice(t0, dur, gain, (t, p) => {
    const freq = f * Math.pow(to / f, p);
    ph += (2 * Math.PI * freq) / SR;
    const osc = shape === 'square' ? Math.sign(Math.sin(ph)) * 0.6 : shape === 'saw' ? ((ph / Math.PI) % 2) - 1 : shape === 'tri' ? (2 / Math.PI) * Math.asin(Math.sin(ph)) : Math.sin(ph);
    const env = Math.min(1, t / attack) * Math.pow(1 - p, 2);
    return osc * env;
  });
};
const noise = (t0, dur, gain, hp = true) => { let prev = 0; voice(t0, dur, gain, (t, p) => { const x = rnd(); const y = hp ? x - prev : x; prev = x; return y * Math.pow(1 - p, 3); }); };
const kick = (t0, g = 0.7) => tone(t0, 150, 0.22, g, { to: 42 });
const hat = (t0) => noise(t0, 0.04, 0.09);
const clap = (t0) => { noise(t0, 0.14, 0.22, false); tone(t0, 220, 0.08, 0.08, { to: 180 }); };
const pop = (t0, g = 0.22) => tone(t0, 700, 0.09, g, { to: 1100 });
const thump = (t0) => { tone(t0, 95, 0.32, 0.75, { to: 38 }); noise(t0, 0.09, 0.25, false); };
const click = (t0, g = 0.07) => noise(t0, 0.012, g);
const buzz = (t0, g = 0.3) => { tone(t0, 520, 0.34, g, { to: 140, shape: 'saw' }); tone(t0 + 0.01, 260, 0.4, g * 0.5, { to: 80, shape: 'square' }); };
const arp = (t0, notes, gap = 0.07, g = 0.16) => notes.forEach((f, i) => tone(t0 + i * gap, f, 0.5, g, { shape: 'tri' }));

// Music bed: 120 BPM, C - Am - F - G, drums drop out on the two STOP hits.
const BEAT = 0.5;
const roots = [65.41, 55.0, 43.65, 49.0];
const quiet = (t) => (t > 6.3 && t < 6.85) || (t > 10.55 && t < 11.15);
for (let b = 0; b * BEAT < 14.1; b++) {
  const t = b * BEAT;
  if (quiet(t)) continue;
  kick(t, 0.5);
  if (b % 2 === 1) clap(t);
  hat(t + BEAT / 2);
  const root = roots[Math.floor(b / 4) % 4];
  tone(t, root, 0.42, 0.26, { shape: 'tri', attack: 0.01 });
  tone(t + BEAT / 2, root * 2, 0.2, 0.08, { shape: 'tri' });
}
// End card: big landing + major chord swell
thump(14.4);
arp(14.2, [261.63, 329.63, 392.0, 523.25, 659.25], 0.08, 0.15);
[130.81, 196.0, 261.63, 329.63].forEach((f) => tone(14.45, f, 2.0, 0.07, { shape: 'tri', attack: 0.3 }));
for (let b = 0; b < 4; b++) { kick(14.4 + b * BEAT, 0.35); hat(14.4 + b * BEAT + BEAT / 2); }

// Sound effects synced to ad-video.html
[0, 1, 2].forEach((i) => pop(0.15 + i * 0.14 + 0.42, 0.26));        // keycaps land
[2.55, 2.8, 3.02].forEach((t) => thump(t + 0.12));                  // headline slams
pop(3.4); pop(3.52);                                                 // FAST / SLOW pills
click(3.9, 0.2); tone(3.9, 1200, 0.05, 0.08);                        // FAST pressed
// ticker ticks: same easing as the visuals (TICK_TOTAL ticks, ease-out cubic)
{
  const TS = 4.55, TE = 6.35, TOTAL = 80; let last = -1, lastT = 0;
  for (let t = TS; t <= TE; t += 1 / SR * 50) {
    const p = Math.min(1, (t - TS) / (TE - TS)), k = Math.floor(TOTAL * (1 - Math.pow(1 - p, 3)));
    if (k !== last && t - lastT > 0.028) { tone(t, 1500, 0.014, 0.07, { shape: 'square' }); last = k; lastT = t; }
  }
}
buzz(6.35); kick(6.35, 0.8);                                         // STOP!
arp(6.55, [523.25, 659.25, 783.99, 1046.5]);                         // letter reveal
['Chris', 'Chloe', 'Cheetah', 'Cuba', 'Curry goat'].forEach((ans, i) => {
  const t0 = 8.15 + i * 0.44;
  for (let k = 0; k < ans.length; k++) click(t0 + (k / ans.length) * 0.32, 0.09);
  tone(t0 + 0.36, 880, 0.09, 0.16, { to: 1320 });                    // check pop
});
buzz(10.6, 0.42); kick(10.6, 1); noise(10.6, 0.25, 0.25, false);    // big STOP
pop(12.78); pop(12.93);                                              // score rules
for (let t = 13.05; t < 13.75; t += 0.05) tone(t, 1250, 0.02, 0.05, { shape: 'square' }); // count-up
arp(13.75, [783.99, 1046.5], 0.06, 0.12);

// master: gentle saturation + normalize + short fade out
let peak = 0;
for (let i = 0; i < N; i++) { mix[i] = Math.tanh(mix[i] * 1.1); peak = Math.max(peak, Math.abs(mix[i])); }
const fadeFrom = (DURATION - 0.6) * SR;
const pcm = Buffer.alloc(44 + N * 2);
for (let i = 0; i < N; i++) {
  const fade = i > fadeFrom ? 1 - (i - fadeFrom) / (N - fadeFrom) : 1;
  pcm.writeInt16LE(Math.round((mix[i] / peak) * 0.89 * fade * 32767), 44 + i * 2);
}
pcm.write('RIFF', 0); pcm.writeUInt32LE(36 + N * 2, 4); pcm.write('WAVE', 8); pcm.write('fmt ', 12);
pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(1, 22); pcm.writeUInt32LE(SR, 24);
pcm.writeUInt32LE(SR * 2, 28); pcm.writeUInt16LE(2, 32); pcm.writeUInt16LE(16, 34); pcm.write('data', 36); pcm.writeUInt32LE(N * 2, 40);
const work = join(here, 'build');
mkdirSync(work, { recursive: true });
const wav = join(work, 'soundtrack.wav');
writeFileSync(wav, pcm);
console.log('soundtrack ready');

// ─── frames ─────────────────────────────────────────────────────────────────
// Prefer Edge's versioned binary: the top-level msedge.exe is a launcher that can hand off
// to another process (for example while an update is pending) and exit immediately.
const edgeDir = 'C:/Program Files (x86)/Microsoft/Edge/Application';
const versioned = existsSync(edgeDir)
  ? readdirSync(edgeDir)
      .filter((d) => /^\d+\./.test(d))
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
      .map((d) => `${edgeDir}/${d}/msedge.exe`)
  : [];
const browserPath = [
  ...versioned,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].find(existsSync);
// Edge's launcher exits right away while the real headless browser keeps running,
// so start it ourselves with a debugging port and connect instead of puppeteer.launch().
const PORT = 9300 + Math.floor(Math.random() * 500);
const profile = mkdtempSync(join(tmpdir(), 'abc-video-'));
spawn(browserPath, [
  '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--no-first-run',
  '--allow-file-access-from-files', '--hide-scrollbars', '--disable-gpu-vsync', 'about:blank',
], { detached: true, stdio: 'ignore' }).unref();
let browser;
for (let i = 0; i < 60 && !browser; i++) {
  try {
    browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${PORT}`, defaultViewport: { width: 1080, height: 1920, deviceScaleFactor: 1 } });
  } catch {
    await new Promise((r) => setTimeout(r, 250));
  }
}
if (!browser) throw new Error('Could not start headless Edge');
const page = await browser.newPage();
await page.goto(pathToFileURL(join(here, 'ad-video.html')).href);
await page.waitForFunction('window.READY === true', { timeout: 20000 });

const enc = spawn(ffmpeg, [
  '-y', '-loglevel', 'error',
  '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-i', wav,
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', '-profile:v', 'high',
  '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', OUT,
], { stdio: ['pipe', 'inherit', 'inherit'] });

const frames = Math.round(DURATION * FPS);
const stills = new Set([1.2, 3.4, 5.4, 6.8, 9.9, 11.4, 13.6, 16.2].map((s) => Math.round(s * FPS)));
for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.render(t), i / FPS);
  const jpg = await page.screenshot({ type: 'jpeg', quality: 92 });
  if (!enc.stdin.write(jpg)) await new Promise((r) => enc.stdin.once('drain', r));
  if (stills.has(i)) writeFileSync(join(work, `still-${String(i).padStart(3, '0')}.jpg`), jpg);
  if (i % 60 === 0) console.log(`frame ${i}/${frames}`);
}
enc.stdin.end();
await new Promise((res, rej) => enc.on('close', (c) => (c === 0 ? res() : rej(new Error('ffmpeg exited ' + c)))));
await browser.close();
console.log('wrote', OUT);
