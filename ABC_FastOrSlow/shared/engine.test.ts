import { describe, expect, it } from 'vitest';
import {
  ALPHABET,
  LATE_DRAFT_MS,
  REVEAL_MS,
  SCORE_UNIT,
  STOP_TO_REVIEW_MS,
  TICKER_AUTO_STOP_MS,
  TICK_INTERVAL,
  WHEEL_SPIN_MS,
  HOST_HANDOFF_MS,
  type CategoryId,
} from './constants';
import { addPlayer, applyAction, createRoom, currentRound, nextWakeAt, setConnected, tick, viewFor } from './engine';
import { checkAnswer, normalizeAnswer } from './normalize';
import { formatPoints, scoreRound } from './scoring';
import type { ClientAction, RoomState } from './types';

// ─── helpers ───────────────────────────────────────────────────────────────

class Clock {
  now = 1_000_000;
  advance(ms: number) {
    this.now += ms;
  }
}

function setup(players = ['Ana', 'Ben', 'Cy']) {
  const clock = new Clock();
  let state = createRoom('BKDT', { id: 'p0', name: players[0] }, clock.now);
  players.slice(1).forEach((name, i) => {
    const r = addPlayer(state, { id: `p${i + 1}`, name }, clock.now);
    if (!r.ok) throw new Error(r.message);
    state = r.state;
  });
  let rngValue = 0;
  const g = {
    clock,
    get state() {
      return state;
    },
    set state(s: RoomState) {
      state = s;
    },
    setRng(v: number) {
      rngValue = v;
    },
    act(actor: string, action: ClientAction) {
      const r = applyAction(state, actor, action, { now: clock.now, rng: () => rngValue });
      if (r.ok) state = r.state;
      return r;
    },
    ok(actor: string, action: ClientAction) {
      const r = g.act(actor, action);
      if (!r.ok) throw new Error(`${action.type} failed: ${r.message}`);
      return r.state;
    },
    tick() {
      const s = tick(state, { now: clock.now, rng: () => rngValue });
      if (s) state = s;
    },
    round() {
      return currentRound(state)!;
    },
  };
  return g;
}

/** Start a match and drive a wheel round to ANSWERING with a chosen letter. */
function toAnswering(g: ReturnType<typeof setup>, letter = 'B', speed: 'fast' | 'slow' = 'fast') {
  if (g.state.phase === 'LOBBY') {
    g.ok('p0', { type: 'update_settings', settings: { letterMode: 'wheel' } });
    g.ok('p0', { type: 'start_match' });
  }
  const pool = ALPHABET.filter((l) => !g.state.usedLetters.includes(l));
  g.setRng(pool.indexOf(letter) / pool.length + 1e-9);
  g.ok(g.round().chooserId, { type: 'choose_speed', speed });
  g.ok(g.round().chooserId, { type: 'spin_wheel' });
  expect(g.round().letter).toBe(letter);
  g.clock.advance(WHEEL_SPIN_MS + REVEAL_MS.wheel);
  g.tick();
  expect(g.state.phase).toBe('ANSWERING');
}

function toReview(g: ReturnType<typeof setup>) {
  g.clock.advance(STOP_TO_REVIEW_MS);
  g.tick();
  expect(g.state.phase).toBe('REVIEW');
}

const full = (l: string) => ({ boy: `${l}ob`, girl: `${l}ella`, animal: `${l}ear`, place: `${l}erlin`, food: `${l}agel` });

// ─── normalisation & technical rules ───────────────────────────────────────

describe('answer normalisation', () => {
  it('ignores case, surrounding and repeated whitespace, and accents', () => {
    expect(normalizeAnswer('  New   York ')).toBe('new york');
    expect(normalizeAnswer('NEW YÖRK')).toBe('new york');
  });
  it('requires a non-empty answer starting with the letter (case-insensitive)', () => {
    expect(checkAnswer('', 'B')).toBe('blank');
    expect(checkAnswer('   ', 'B')).toBe('blank');
    expect(checkAnswer('banana', 'B')).toBe('ok');
    expect(checkAnswer('  Banana', 'b')).toBe('ok');
    expect(checkAnswer('Apple', 'B')).toBe('wrong_letter');
    expect(checkAnswer('Éclair', 'E')).toBe('ok');
  });
});

// ─── scoring ───────────────────────────────────────────────────────────────

describe('scoring', () => {
  const base = { letter: 'B', categories: ['animal', 'food'] as CategoryId[], participants: ['a', 'b', 'c', 'd'] };

  it('gives 100 points for a unique accepted answer', () => {
    const r = scoreRound({ ...base, categories: ['animal'], answers: { a: { animal: 'Bear' }, b: { animal: 'Bison' } }, votes: {} });
    expect(r.perPlayer.a.total).toBe(SCORE_UNIT);
    expect(formatPoints(r.perPlayer.a.total)).toBe('100');
  });

  it('splits 100 between two duplicates and three ways exactly', () => {
    const two = scoreRound({ ...base, categories: ['animal'], answers: { a: { animal: 'Bear' }, b: { animal: ' bear ' } }, votes: {} });
    expect(formatPoints(two.perPlayer.a.total)).toBe('50');
    expect(two.perPlayer.a.total + two.perPlayer.b.total).toBe(SCORE_UNIT);

    const three = scoreRound({
      ...base,
      categories: ['animal'],
      answers: { a: { animal: 'Bear' }, b: { animal: 'BEAR' }, c: { animal: 'bear' } },
      votes: {},
    });
    expect(three.perPlayer.a.total * 3).toBe(SCORE_UNIT); // exact integer thirds
    expect(formatPoints(three.perPlayer.a.total)).toBe('33.3');
  });

  it('gives zero to rejected, blank and wrong-letter answers, and rejected answers do not split points', () => {
    const r = scoreRound({
      ...base,
      categories: ['animal'],
      answers: { a: { animal: 'Bear' }, b: { animal: 'Bear' }, c: { animal: '' }, d: { animal: 'Cat' } },
      votes: { 'b:animal': { a: 'reject', c: 'reject', d: 'accept' } },
    });
    expect(r.outcomes['b:animal'].status).toBe('rejected');
    expect(r.outcomes['c:animal'].status).toBe('blank');
    expect(r.outcomes['d:animal'].status).toBe('wrong_letter');
    expect(r.perPlayer.a.total).toBe(SCORE_UNIT); // a is now unique
    expect(r.perPlayer.b.total + r.perPlayer.c.total + r.perPlayer.d.total).toBe(0);
  });

  it('scores each category independently (same word in two categories is not a duplicate)', () => {
    const r = scoreRound({
      ...base,
      answers: { a: { animal: 'Bass', food: 'Banana' }, b: { animal: 'Bear', food: 'Bass' } },
      votes: {},
    });
    expect(r.perPlayer.a.total).toBe(2 * SCORE_UNIT);
    expect(r.perPlayer.b.total).toBe(2 * SCORE_UNIT);
  });

  it('ties in voting give the benefit of the doubt', () => {
    const r = scoreRound({
      ...base,
      categories: ['animal'],
      answers: { a: { animal: 'Bunyip' } },
      votes: { 'a:animal': { b: 'reject', c: 'accept' } },
    });
    expect(r.outcomes['a:animal'].status).toBe('accepted');
  });

  it('accumulates thirds into exact integers across rounds', () => {
    let total = 0;
    for (let i = 0; i < 3; i++) total += SCORE_UNIT / 3;
    expect(total).toBe(SCORE_UNIT);
    expect(Number.isInteger(SCORE_UNIT / 7) && Number.isInteger(SCORE_UNIT / 11)).toBe(true);
  });
});

// ─── state machine ─────────────────────────────────────────────────────────

describe('lobby and permissions', () => {
  it('creates a room with the creator as host', () => {
    const g = setup(['Ana']);
    expect(g.state.hostId).toBe('p0');
    expect(g.state.phase).toBe('LOBBY');
  });

  it('dedupes display names', () => {
    const g = setup(['Ana', 'ana']);
    expect(g.state.players[1].name).toBe('ana 2');
  });

  it('only the host can change settings or start', () => {
    const g = setup();
    expect(g.act('p1', { type: 'start_match' })).toMatchObject({ ok: false, error: 'not_host' });
    expect(g.act('p1', { type: 'update_settings', settings: { fastSeconds: 20 } })).toMatchObject({ ok: false, error: 'not_host' });
    g.ok('p0', { type: 'update_settings', settings: { fastSeconds: 20, slowSeconds: 120 } });
    expect(g.state.settings.fastSeconds).toBe(20);
  });

  it('rejects starting with too few players', () => {
    const g = setup(['Solo']);
    expect(g.act('p0', { type: 'start_match' })).toMatchObject({ ok: false, error: 'too_few_players' });
  });

  it('validates settings', () => {
    const g = setup();
    expect(g.act('p0', { type: 'update_settings', settings: { fastSeconds: 2 } }).ok).toBe(false);
    expect(g.act('p0', { type: 'update_settings', settings: { categories: ['boy'] } }).ok).toBe(false);
    g.ok('p0', { type: 'update_settings', settings: { categories: ['boy', 'girl', 'animal', 'place', 'food', 'movie'] } });
    expect(g.state.settings.categories).toContain('movie');
  });
});

describe('letter selection', () => {
  it('ticker: STOP picks the letter on screen, honouring a plausible client tick', () => {
    const g = setup();
    g.ok('p0', { type: 'start_match' });
    const chooser = g.round().chooserId;
    g.ok(chooser, { type: 'choose_speed', speed: 'slow' });
    g.clock.advance(TICK_INTERVAL.slow * 3 + 10); // server is on tick 3 -> 'D'
    g.ok(chooser, { type: 'stop_ticker', atTick: 3 });
    expect(g.round().letter).toBe('D');
  });

  it('ticker: ignores a client tick that is implausibly old', () => {
    const g = setup();
    g.ok('p0', { type: 'start_match' });
    const chooser = g.round().chooserId;
    g.ok(chooser, { type: 'choose_speed', speed: 'slow' });
    g.clock.advance(TICK_INTERVAL.slow * 10 + 10);
    g.ok(chooser, { type: 'stop_ticker', atTick: 1 });
    expect(g.round().letter).toBe('K'); // server tick 10
  });

  it('only the caller (or host) may stop the ticker', () => {
    const g = setup();
    g.ok('p0', { type: 'start_match' });
    const chooser = g.round().chooserId;
    const other = ['p0', 'p1', 'p2'].find((p) => p !== chooser && p !== 'p0')!;
    g.ok(chooser, { type: 'choose_speed', speed: 'fast' });
    expect(g.act(other, { type: 'stop_ticker' })).toMatchObject({ ok: false, error: 'not_allowed' });
  });

  it('auto-stops the ticker if nobody presses STOP', () => {
    const g = setup();
    g.ok('p0', { type: 'start_match' });
    g.ok(g.round().chooserId, { type: 'choose_speed', speed: 'fast' });
    g.clock.advance(TICKER_AUTO_STOP_MS);
    g.tick();
    expect(g.round().selection).toMatchObject({ status: 'locked', autoStopped: true });
  });

  it('never repeats a letter until all 26 are used, then offers a reset', () => {
    const g = setup(['Ana', 'Ben']);
    g.ok('p0', { type: 'update_settings', settings: { rounds: null, letterMode: 'wheel' } });
    g.ok('p0', { type: 'start_match' });
    const seen = new Set<string>();
    for (let i = 0; i < 26; i++) {
      g.setRng(0.999); // always pick the last remaining letter
      g.ok(g.round().chooserId, { type: 'choose_speed', speed: 'fast' });
      g.ok(g.round().chooserId, { type: 'spin_wheel' });
      seen.add(g.round().letter!);
      g.clock.advance(WHEEL_SPIN_MS + REVEAL_MS.wheel);
      g.tick();
      g.ok('p0', { type: 'host_end_round' });
      toReview(g);
      g.ok('p0', { type: 'finalize_review' });
      g.ok('p0', { type: 'next_round' });
    }
    expect(seen.size).toBe(26);
    expect(g.round().selection.status).toBe('exhausted');
    expect(g.act(g.round().chooserId, { type: 'choose_speed', speed: 'fast' }).ok).toBe(false);
    expect(g.act('p1', { type: 'reset_letters' })).toMatchObject({ ok: false, error: 'not_host' });
    g.ok('p0', { type: 'reset_letters' });
    expect(g.state.usedLetters).toEqual([]);
    expect(g.round().selection.status).toBe('choosing');
  });
});

describe('answering', () => {
  it('uses the fast and slow timers from settings', () => {
    const g = setup();
    g.ok('p0', { type: 'update_settings', settings: { fastSeconds: 30, slowSeconds: 90 } });
    toAnswering(g, 'B', 'fast');
    expect(g.round().deadline! - g.round().startedAt!).toBe(30_000);
    g.ok('p0', { type: 'host_end_round' });
    toReview(g);
    g.ok('p0', { type: 'finalize_review' });
    g.ok('p0', { type: 'next_round' });
    toAnswering(g, 'C', 'slow');
    expect(g.round().deadline! - g.round().startedAt!).toBe(90_000);
  });

  it('first complete submission stops the round for everyone and locks other sheets', () => {
    const g = setup();
    toAnswering(g, 'B');
    g.ok('p1', { type: 'save_draft', answers: { boy: 'Bob' } });
    expect(g.act('p0', { type: 'submit_answers', answers: { boy: 'Bob' } })).toMatchObject({ ok: false, error: 'invalid' });
    g.ok('p0', { type: 'submit_answers', answers: full('B') });
    expect(g.round()).toMatchObject({ stoppedBy: 'p0', endReason: 'first_finished' });
    g.clock.advance(LATE_DRAFT_MS + 1);
    expect(g.act('p1', { type: 'save_draft', answers: { girl: 'Bella' } })).toMatchObject({ ok: false, error: 'round_over' });
    expect(g.round().answers.p1).toEqual({ boy: 'Bob' });
  });

  it('accepts an in-flight draft that arrives just after STOP (photo finish)', () => {
    const g = setup();
    toAnswering(g, 'B');
    g.ok('p0', { type: 'submit_answers', answers: full('B') });
    g.clock.advance(200);
    g.ok('p1', { type: 'submit_answers', answers: full('B') });
    expect(g.round().stoppedBy).toBe('p0'); // first one still wins
    expect(Object.keys(g.round().submittedAt).sort()).toEqual(['p0', 'p1']);
  });

  it('double submit is a harmless no-op', () => {
    const g = setup();
    toAnswering(g, 'B');
    g.ok('p0', { type: 'submit_answers', answers: full('B') });
    const at = g.round().submittedAt.p0;
    g.clock.advance(100);
    g.ok('p0', { type: 'submit_answers', answers: full('B') });
    expect(g.round().submittedAt.p0).toBe(at);
  });

  it('timer expiry ends the round and drafts become final', () => {
    const g = setup();
    toAnswering(g, 'B');
    g.ok('p1', { type: 'save_draft', answers: { boy: 'Bob', food: 'Bagel' } });
    g.clock.advance(30_000);
    g.tick();
    expect(g.round()).toMatchObject({ endReason: 'timer', stoppedAt: g.round().deadline });
    toReview(g);
    expect(g.round().answers.p1).toEqual({ boy: 'Bob', food: 'Bagel' });
  });

  it('a submit after the deadline is rejected even if the timer tick has not run', () => {
    const g = setup();
    toAnswering(g, 'B');
    g.clock.advance(30_000 + LATE_DRAFT_MS + 5);
    expect(g.act('p0', { type: 'submit_answers', answers: full('B') })).toMatchObject({ ok: false, error: 'round_over' });
    g.tick();
    expect(g.round().endReason).toBe('timer');
  });

  it('host emergency stop', () => {
    const g = setup();
    toAnswering(g, 'B');
    expect(g.act('p1', { type: 'host_end_round' })).toMatchObject({ ok: false, error: 'not_host' });
    g.ok('p0', { type: 'host_end_round' });
    expect(g.round().endReason).toBe('host');
  });

  it("hides other players' answers until review", () => {
    const g = setup();
    toAnswering(g, 'B');
    g.ok('p1', { type: 'save_draft', answers: { boy: 'Bob' } });
    const v0 = viewFor(g.state, 'p0', g.clock.now);
    expect(v0.round!.answers.p1).toBeUndefined();
    expect(v0.round!.progress.p1).toBe(1);
    expect(viewFor(g.state, 'p1', g.clock.now).round!.answers.p1).toEqual({ boy: 'Bob' });
    g.ok('p0', { type: 'host_end_round' });
    toReview(g);
    expect(viewFor(g.state, 'p0', g.clock.now).round!.answers.p1).toEqual({ boy: 'Bob' });
  });

  it('a player who joins mid-round sits out until the next round', () => {
    const g = setup();
    toAnswering(g, 'B');
    const r = addPlayer(g.state, { id: 'late', name: 'Late' }, g.clock.now);
    if (!r.ok) throw new Error();
    g.state = r.state;
    expect(g.act('late', { type: 'save_draft', answers: { boy: 'Bo' } })).toMatchObject({ ok: false, error: 'not_allowed' });
    g.ok('p0', { type: 'host_end_round' });
    toReview(g);
    g.ok('p0', { type: 'finalize_review' });
    g.ok('p0', { type: 'next_round' });
    toAnswering(g, 'C');
    expect(g.round().participants).toContain('late');
  });
});

describe('review and scoring flow', () => {
  function playedRound() {
    const g = setup(['Ana', 'Ben', 'Cy', 'Dee']);
    toAnswering(g, 'B');
    g.ok('p0', { type: 'save_draft', answers: { boy: 'Bob', girl: 'Bella', animal: 'Bear', place: 'Berlin', food: 'Bagel' } });
    g.ok('p1', { type: 'save_draft', answers: { boy: 'bob', girl: 'Beth', animal: 'Bear', place: 'Paris', food: 'Bagel' } });
    g.ok('p2', { type: 'save_draft', answers: { boy: 'Bob', girl: '', animal: 'Bat', place: 'Boston', food: 'Burrito' } });
    g.ok('p3', { type: 'save_draft', answers: { boy: 'Bryce', girl: 'Bianca', animal: 'Bnope', place: 'Bali', food: 'Bagel' } });
    g.ok('p0', { type: 'host_end_round' });
    toReview(g);
    return g;
  }

  it('players vote, invalid answers are rejected, and duplicates split', () => {
    const g = playedRound();
    expect(g.act('p0', { type: 'vote', key: 'p0:boy', vote: 'reject' })).toMatchObject({ error: 'not_allowed' });
    expect(g.act('p0', { type: 'vote', key: 'p1:place', vote: 'reject' })).toMatchObject({ error: 'invalid' }); // wrong letter
    g.ok('p0', { type: 'vote', key: 'p3:animal', vote: 'reject' });
    g.ok('p1', { type: 'vote', key: 'p3:animal', vote: 'reject' });
    g.ok('p2', { type: 'vote', key: 'p3:animal', vote: 'accept' });
    g.ok('p2', { type: 'flag', key: 'p3:animal', flagged: true });
    expect(g.round().flags['p3:animal']).toEqual(['p2']);

    expect(g.act('p1', { type: 'finalize_review' })).toMatchObject({ error: 'not_host' });
    g.ok('p0', { type: 'finalize_review' });
    const res = g.round().results!;
    const pts = (pid: string) => formatPoints(res.perPlayer[pid].total);
    // p0: Bob(1/3) Bella(100) Bear(1/2) Berlin(100) Bagel(1/3)
    expect(res.perPlayer.p0.total).toBe(SCORE_UNIT / 3 + SCORE_UNIT + SCORE_UNIT / 2 + SCORE_UNIT + SCORE_UNIT / 3);
    expect(pts('p0')).toBe('316.7');
    // p3 Bnope rejected -> 0 in animal
    expect(res.outcomes['p3:animal']).toMatchObject({ status: 'rejected', units: 0 });
    expect(res.outcomes['p1:place'].status).toBe('wrong_letter');
    expect(res.outcomes['p2:girl'].status).toBe('blank');
    expect(g.state.phase).toBe('RESULTS');
    expect(g.state.players.find((p) => p.id === 'p0')!.totalUnits).toBe(res.perPlayer.p0.total);
  });

  it('scoring can never be applied twice', () => {
    const g = playedRound();
    g.ok('p0', { type: 'finalize_review' });
    const totals = g.state.players.map((p) => p.totalUnits);
    expect(g.act('p0', { type: 'finalize_review' })).toMatchObject({ ok: false, error: 'already_scored' });
    expect(g.state.players.map((p) => p.totalUnits)).toEqual(totals);
  });

  it('leaderboard totals accumulate and the match ends after the configured rounds', () => {
    const g = setup(['Ana', 'Ben']);
    g.ok('p0', { type: 'update_settings', settings: { rounds: 2, letterMode: 'wheel' } });
    g.ok('p0', { type: 'start_match' });
    for (const l of ['B', 'C']) {
      toAnswering(g, l);
      g.ok('p1', { type: 'submit_answers', answers: full(l) });
      toReview(g);
      g.ok('p0', { type: 'finalize_review' });
      g.ok('p0', { type: 'next_round' });
    }
    expect(g.state.phase).toBe('MATCH_OVER');
    expect(g.state.players.find((p) => p.id === 'p1')!.totalUnits).toBe(10 * SCORE_UNIT);
    expect(viewFor(g.state, 'p0', g.clock.now).history).toHaveLength(2);
    g.ok('p0', { type: 'rematch' });
    expect(g.state.phase).toBe('LETTER_SELECTION');
    expect(g.state.players.every((p) => p.totalUnits === 0)).toBe(true);
  });
});

describe('presence', () => {
  it('hands host to the next connected player after the host drops', () => {
    const g = setup();
    g.state = setConnected(g.state, 'p0', false, g.clock.now);
    expect(nextWakeAt(g.state)).toBe(g.clock.now + HOST_HANDOFF_MS);
    g.clock.advance(HOST_HANDOFF_MS - 1);
    g.tick();
    expect(g.state.hostId).toBe('p0');
    g.clock.advance(1);
    g.tick();
    expect(g.state.hostId).toBe('p1');
  });

  it('a reconnecting player keeps their identity and score', () => {
    const g = setup();
    g.state = setConnected(g.state, 'p1', false, g.clock.now);
    g.state = setConnected(g.state, 'p1', true, g.clock.now + 1000);
    expect(g.state.players.find((p) => p.id === 'p1')).toMatchObject({ connected: true, name: 'Ben' });
  });
});
