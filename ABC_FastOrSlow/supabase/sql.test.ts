// Runs the real Supabase migration inside PGlite (Postgres compiled to WASM) and
// plays rounds through the RPCs as different users. auth.uid() and the clock are
// stubbed; everything else is the production SQL.
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { scoreRound } from '../shared/scoring';
import type { CategoryId } from '../shared/constants';
import type { RoomView } from '../shared/types';

const dir = join(import.meta.dirname, 'migrations');
const migration = readdirSync(dir)
  .filter((f) => f.endsWith('.sql'))
  .sort()
  .map((f) => readFileSync(join(dir, f), 'utf8'))
  .join('\n');

let db: PGlite;
let now = 1_000_000_000_000;
const users = {
  host: '11111111-1111-4111-8111-111111111111',
  guest: '22222222-2222-4222-8222-222222222222',
  third: '33333333-3333-4333-8333-333333333333',
  outsider: '44444444-4444-4444-8444-444444444444',
};
type User = keyof typeof users;

beforeAll(async () => {
  db = new PGlite();
  await db.exec(`
    create role anon; create role authenticated;
    create schema auth;
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  `);
  await db.exec(migration);
  // Deterministic clock for tests.
  await db.exec(`create or replace function public._now_ms() returns bigint language sql volatile as
    $$ select current_setting('test.now')::bigint $$;`);
});

async function as<T = unknown>(user: User, sql: string, params: unknown[] = []): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.exec(`set local role authenticated; set local request.jwt.claim.sub = '${users[user]}'; set local test.now = '${now}';`);
    const res = await tx.query<Record<string, unknown>>(sql, params);
    const row = res.rows[0];
    return (row ? Object.values(row)[0] : undefined) as T;
  });
}

const rpc = {
  create: (u: User, name: string) => as<{ code: string; playerId: string }>(u, 'select public.create_room($1)', [name]),
  join: (u: User, code: string, name: string) => as<{ code: string; playerId: string }>(u, 'select public.join_room($1, $2)', [code, name]),
  act: (u: User, code: string, action: object) => as(u, 'select public.room_action($1, $2::jsonb)', [code, JSON.stringify(action)]),
  snap: (u: User, code: string) => as<RoomView>(u, 'select public.get_snapshot($1)', [code]),
  tick: (u: User, code: string) => as(u, 'select public.tick($1)', [code]),
  heartbeat: (u: User, code: string) => as(u, 'select public.heartbeat($1)', [code]),
  peek: (u: User, code: string) => as<{ exists: boolean }>(u, 'select public.peek_room($1)', [code]),
};

async function expectFail(p: Promise<unknown>, code: string) {
  await expect(p).rejects.toThrow(new RegExp(`ABC:${code}:`));
}

async function newGame() {
  const { code, playerId: hostId } = await rpc.create('host', 'Host');
  const { playerId: guestId } = await rpc.join('guest', code, 'Guest');
  return { code, hostId, guestId };
}

/** Drive selection with the ticker: STOP at tick 0 picks the first unused letter. */
async function toAnswering(code: string, speed: 'fast' | 'slow' = 'fast') {
  const v = await rpc.snap('host', code);
  if (v.phase === 'LOBBY') await rpc.act('host', code, { type: 'start_match' });
  await rpc.act('host', code, { type: 'choose_speed', speed });
  await rpc.act('host', code, { type: 'stop_ticker', atTick: 0 });
  now += 2200;
  await rpc.tick('host', code);
  const s = await rpc.snap('host', code);
  expect(s.phase).toBe('ANSWERING');
  return s;
}

describe('supabase SQL backend', () => {
  it('creates rooms, joins by code, rejects unknown codes', async () => {
    const { code } = await newGame();
    expect(code).toMatch(/^[A-Z]{4,5}$/);
    expect(await rpc.peek('outsider', code)).toMatchObject({ exists: true, players: 2 });
    expect(await rpc.peek('outsider', 'ZZZZZ')).toEqual({ exists: false });
    await expectFail(rpc.join('third', 'ZZZZ', 'Nope'), 'not_found');
    // joining twice from the same identity resumes instead of duplicating
    const again = await rpc.join('guest', code, 'Guest');
    const v = await rpc.snap('guest', code);
    expect(v.players).toHaveLength(2);
    expect(again.playerId).toBe(v.you);
  });

  it('enforces host permissions and phase rules', async () => {
    const { code } = await newGame();
    await expectFail(rpc.act('guest', code, { type: 'start_match' }), 'not_host');
    await expectFail(rpc.act('guest', code, { type: 'update_settings', settings: { fastSeconds: 20 } }), 'not_host');
    await expectFail(rpc.act('host', code, { type: 'update_settings', settings: { fastSeconds: 3 } }), 'invalid');
    await rpc.act('host', code, { type: 'update_settings', settings: { fastSeconds: 20, rounds: null } });
    const v = await rpc.snap('host', code);
    expect(v.settings).toMatchObject({ fastSeconds: 20, rounds: null });
    await expectFail(rpc.act('host', code, { type: 'finalize_review' }), 'wrong_phase');
    await expectFail(rpc.snap('outsider', code), 'resume_failed');
    await expectFail(rpc.act('outsider', code, { type: 'set_ready', ready: true }), 'not_allowed');
  });

  it('plays a full round: hidden answers, first-finisher STOP, voting, exact scoring, idempotent finalize', async () => {
    const { code, hostId, guestId } = await newGame();
    const { playerId: thirdId } = await rpc.join('third', code, 'Third');
    const s = await toAnswering(code);
    const L = s.round!.letter!;
    expect(s.round!.deadline! - s.round!.startedAt!).toBe(30_000);
    expect(s.round!.participants.sort()).toEqual([hostId, guestId, thirdId].sort());

    await rpc.act('guest', code, { type: 'save_draft', answers: { boy: `${L}ob`, girl: '', animal: `${L}ear` } });
    const hostView = await rpc.snap('host', code);
    expect(hostView.round!.answers[guestId]).toBeUndefined(); // private while answering
    expect(hostView.round!.progress[guestId]).toBe(2);

    await rpc.act('third', code, { type: 'save_draft', answers: { boy: ` ${L.toLowerCase()}OB `, animal: 'Xylophone' } });
    await expectFail(rpc.act('host', code, { type: 'submit_answers', answers: { boy: `${L}x` } }), 'invalid');
    const sheet = { boy: `${L}ob`, girl: `${L}ella`, animal: `${L}at`, place: `${L}ern`, food: `${L}un` };
    await rpc.act('host', code, { type: 'submit_answers', answers: sheet });
    let v = await rpc.snap('guest', code);
    expect(v.round).toMatchObject({ stoppedBy: hostId, endReason: 'first_finished' });

    now += 700; // past the late-draft grace window
    await expectFail(rpc.act('guest', code, { type: 'save_draft', answers: { place: `${L}ate` } }), 'round_over');

    now += 1200;
    await rpc.tick('guest', code);
    v = await rpc.snap('guest', code);
    expect(v.phase).toBe('REVIEW');
    expect(v.round!.answers[hostId].food).toBe(`${L}un`);

    await expectFail(rpc.act('host', code, { type: 'vote', key: `${hostId}:boy`, vote: 'reject' }), 'not_allowed');
    await expectFail(rpc.act('host', code, { type: 'vote', key: `${thirdId}:animal`, vote: 'reject' }), 'invalid'); // wrong letter
    await rpc.act('guest', code, { type: 'vote', key: `${hostId}:food`, vote: 'reject' });
    await rpc.act('third', code, { type: 'vote', key: `${hostId}:food`, vote: 'reject' });
    await rpc.act('guest', code, { type: 'flag', key: `${hostId}:food`, flagged: true });
    await expectFail(rpc.act('guest', code, { type: 'finalize_review' }), 'not_host');

    const before = await rpc.snap('host', code);
    await rpc.act('host', code, { type: 'finalize_review' });
    await expectFail(rpc.act('host', code, { type: 'finalize_review' }), 'already_scored');
    const after = await rpc.snap('host', code);
    expect(after.phase).toBe('RESULTS');

    // SQL scoring must agree exactly with the TypeScript scorer.
    const expected = scoreRound({
      letter: L,
      categories: before.round!.categories as CategoryId[],
      participants: before.round!.participants,
      answers: before.round!.answers,
      votes: before.round!.votes,
    });
    for (const pid of [hostId, guestId, thirdId]) {
      expect(after.round!.results!.perPlayer[pid].total).toBe(expected.perPlayer[pid].total);
      expect(after.players.find((p) => p.id === pid)!.totalUnits).toBe(expected.perPlayer[pid].total);
    }
    // three-way "Bob" duplicate splits into exact thirds
    expect(after.round!.results!.outcomes[`${hostId}:boy`]).toMatchObject({ status: 'accepted', units: 9240, duplicates: 3 });
    expect(after.round!.results!.outcomes[`${hostId}:food`]).toMatchObject({ status: 'rejected', units: 0 });
    expect(after.round!.results!.outcomes[`${thirdId}:animal`].status).toBe('wrong_letter');
    expect(after.round!.results!.outcomes[`${guestId}:girl`].status).toBe('blank');
    expect(after.history).toHaveLength(1);
  });

  it('ends the round when the timer expires', async () => {
    const { code, guestId } = await newGame();
    await toAnswering(code);
    await rpc.act('guest', code, { type: 'save_draft', answers: { boy: 'Zed' } });
    now += 30_000;
    await rpc.heartbeat('guest', code); // any client heartbeat settles deadlines
    let v = await rpc.snap('host', code);
    expect(v.round!.endReason).toBe('timer');
    now += 1800;
    await rpc.tick('host', code);
    v = await rpc.snap('host', code);
    expect(v.phase).toBe('REVIEW');
    expect(v.round!.answers[guestId]).toBeDefined();
  });

  it('never repeats letters until all 26 are used, then allows a reset', async () => {
    const { code } = await newGame();
    await rpc.act('host', code, { type: 'update_settings', settings: { rounds: null } });
    const seen: string[] = [];
    for (let i = 0; i < 26; i++) {
      const s = await toAnswering(code);
      seen.push(s.round!.letter!);
      await rpc.act('host', code, { type: 'host_end_round' });
      now += 1800;
      await rpc.tick('host', code);
      await rpc.act('host', code, { type: 'finalize_review' });
      await rpc.act('host', code, { type: 'next_round' });
      await rpc.heartbeat('guest', code); // keep the guest online
    }
    expect(new Set(seen).size).toBe(26);
    let v = await rpc.snap('host', code);
    expect(v.round!.selection.status).toBe('exhausted');
    await expectFail(rpc.act('host', code, { type: 'choose_speed', speed: 'fast' }), 'wrong_phase');
    await expectFail(rpc.act('guest', code, { type: 'reset_letters' }), 'not_host');
    await rpc.act('host', code, { type: 'reset_letters' });
    v = await rpc.snap('host', code);
    expect(v.usedLetters).toEqual([]);
    expect(v.round!.selection.status).toBe('choosing');
  });

  it('row level security: no direct table access, rooms visible to members only', async () => {
    const { code } = await newGame();
    await expect(as('guest', 'select count(*) from public.answers')).rejects.toThrow(/permission denied/);
    await expect(as('guest', 'select count(*) from public.players')).rejects.toThrow(/permission denied/);
    await expect(as('guest', "update public.rooms set phase = 'RESULTS'")).rejects.toThrow(/permission denied/);
    await expect(as('guest', 'select public._score_round(gen_random_uuid())')).rejects.toThrow(/permission denied/);
    const mine = await as<string>('guest', 'select string_agg(code, \',\') from public.rooms');
    expect(mine.split(',')).toContain(code);
    const outsider = await as<string | null>('outsider', 'select string_agg(code, \',\') from public.rooms');
    expect(outsider).toBeNull();
  });

  it('hands host to an online player when the host goes quiet', async () => {
    const { code, guestId } = await newGame();
    now += 46_000;
    await rpc.heartbeat('guest', code);
    const v = await rpc.snap('guest', code);
    expect(v.hostId).toBe(guestId);
  });
});
