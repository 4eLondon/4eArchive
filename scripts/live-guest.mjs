// Live smoke test: joins a room on the deployed Supabase backend as an independent guest.
// Usage: node scripts/live-guest.mjs ROOMCODE
import { createClient } from '@supabase/supabase-js';
const sb = createClient('https://zeddrixxaujetrlavqvy.supabase.co', 'sb_publishable_TfAqckWR7bc8k--CJI2pNg_D3h7vgP7', { auth: { persistSession: false } });
const code = process.argv[2];
const { error: authErr } = await sb.auth.signInAnonymously();
if (authErr) throw authErr;
const call = async (fn, args) => { const { data, error } = await sb.rpc(fn, args); if (error) throw new Error(fn + ': ' + error.message); return data; };
let changes = 0;
const ch = sb.channel('room:' + code).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `code=eq.${code}` }, () => changes++).subscribe();
const seat = await call('join_room', { p_code: code, p_name: 'Kemar' });
console.log('joined', JSON.stringify(seat));
await call('room_action', { p_code: code, p_action: { type: 'set_ready', ready: true } });
// stay online (heartbeat) and report what we see, for up to 120s
const t0 = Date.now(); let last = '';
while (Date.now() - t0 < 120000) {
  await call('heartbeat', { p_code: code });
  const v = await call('get_snapshot', { p_code: code });
  const r = v.round;
  const line = `${v.phase} letter=${r?.letter ?? '-'} players=${v.players.length} realtimeEvents=${changes}`;
  if (line !== last) { console.log(Math.round((Date.now() - t0) / 1000) + 's', line); last = line; }
  if (v.phase === 'ANSWERING' && r?.letter && !r.answersRevealed && !r.submitted.includes(v.you)) {
    const L = r.letter;
    const hidden = Object.keys(r.answers).filter((k) => k !== v.you).length;
    console.log('other players answers visible to me while answering:', hidden);
    await call('room_action', { p_code: code, p_action: { type: 'submit_answers', answers: { boy: L + 'ob', girl: L + 'ella', animal: L + 'at', place: L + 'ern', food: L + 'un' } } });
    console.log('submitted full sheet -> STOP');
  }
  if (v.phase === 'RESULTS') { console.log('totals', JSON.stringify(v.players.map((p) => [p.name, p.totalUnits / 277.2]))); break; }
  await new Promise((res) => setTimeout(res, 1500));
}
await sb.removeChannel(ch);
process.exit(0);
