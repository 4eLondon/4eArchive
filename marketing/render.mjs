// Renders marketing/ad.html to PNGs with headless Microsoft Edge (preinstalled on Windows).
// Usage: node marketing/render.mjs
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const browser = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
].find(existsSync);
if (!browser) throw new Error('Edge or Chrome not found');

const formats = { story: [1080, 1920], square: [1080, 1080], wide: [1200, 630] };
for (const [f, [w, h]] of Object.entries(formats)) {
  // A fresh throwaway profile per render keeps headless Edge separate from any open Edge window.
  const profile = mkdtempSync(join(tmpdir(), 'abc-ad-'));
  const out = resolve(here, `abc-fast-or-slow-${f}.png`);
  const url = `${pathToFileURL(join(here, 'ad.html')).href}?f=${f}`;
  if (existsSync(out)) rmSync(out);
  execFileSync(browser, [
    '--headless=new', `--user-data-dir=${profile}`, '--no-first-run', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    '--force-device-scale-factor=1', `--window-size=${w},${h}`, '--virtual-time-budget=4000',
    `--screenshot=${out}`, url,
  ], { stdio: 'inherit', timeout: 60000 });
  // msedge.exe can hand off to a child process and return early: wait for the file.
  const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
  for (let i = 0; i < 60 && !(existsSync(out) && statSync(out).size > 0); i++) sleep(500);
  sleep(500);
  if (!existsSync(out)) throw new Error('Edge did not write ' + out);
  console.log('rendered', out, statSync(out).size, 'bytes');
}
