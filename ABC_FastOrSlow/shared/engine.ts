// The authoritative game engine. Pure functions over RoomState: the server owns
// the clock (ctx.now) and randomness (ctx.rng), clients only send intentions.
// Every transition validates phase and permissions, so a modified client
// cannot award itself points, skip phases or act as host.

import {
  CATEGORY_BY_ID,
  DEFAULT_CATEGORIES,
  DEFAULT_SETTINGS_SECONDS,
  HOST_HANDOFF_MS,
  LATE_DRAFT_MS,
  MAX_PLAYERS,
  MIN_PLAYERS_TO_START,
  NAME_MAX,
  ANSWER_MAX,
  REVEAL_MS,
  STOP_TO_REVIEW_MS,
  TICKER_AUTO_STOP_MS,
  TICKER_LATENCY_TOLERANCE_MS,
  TICK_INTERVAL,
  TIMER_LIMITS,
  WHEEL_SPIN_MS,
  type CategoryId,
} from './constants';
import { availableLetters, letterAtTick, tickAt } from './letters';
import { checkAnswer, cleanAnswer } from './normalize';
import { answerKey, scoreRound } from './scoring';
import type {
  ActionResult,
  ClientAction,
  ErrorCode,
  Player,
  RoomState,
  RoomView,
  Round,
  RoundView,
  Settings,
  Speed,
} from './types';

export interface EngineCtx {
  now: number;
  rng: () => number;
}

const fail = (error: ErrorCode, message: string): ActionResult => ({ ok: false, error, message });

export const defaultSettings = (): Settings => ({
  letterMode: 'ticker',
  fastSeconds: DEFAULT_SETTINGS_SECONDS.fast,
  slowSeconds: DEFAULT_SETTINGS_SECONDS.slow,
  rounds: 5,
  categories: [...DEFAULT_CATEGORIES],
});

export function sanitizeName(raw: string): string {
  return cleanAnswer(String(raw ?? '')).slice(0, NAME_MAX);
}

function uniqueName(state: RoomState, name: string): string {
  const taken = new Set(state.players.filter((p) => !p.left).map((p) => p.name.toLowerCase()));
  if (!taken.has(name.toLowerCase())) return name;
  for (let i = 2; ; i++) {
    const candidate = `${name.slice(0, NAME_MAX - 3)} ${i}`;
    if (!taken.has(candidate.toLowerCase())) return candidate;
  }
}

function pickHue(state: RoomState): number {
  const used = new Set(state.players.filter((p) => !p.left).map((p) => p.hue));
  for (let i = 0; i < MAX_PLAYERS; i++) if (!used.has(i)) return i;
  return state.players.length % MAX_PLAYERS;
}

export function activePlayers(state: RoomState): Player[] {
  return state.players.filter((p) => !p.left).sort((a, b) => a.joinedAt - b.joinedAt);
}

export function currentRound(state: RoomState): Round | null {
  return state.rounds.length ? state.rounds[state.rounds.length - 1] : null;
}

const isHost = (state: RoomState, id: string) => state.hostId === id;
const findPlayer = (state: RoomState, id: string) => state.players.find((p) => p.id === id && !p.left);

// ─── Room lifecycle (called by the server, not by client actions) ──────────

export function createRoom(code: string, host: { id: string; name: string }, now: number): RoomState {
  const state: RoomState = {
    code,
    createdAt: now,
    lastActivity: now,
    version: 1,
    phase: 'LOBBY',
    hostId: host.id,
    settings: defaultSettings(),
    players: [],
    usedLetters: [],
    rounds: [],
  };
  const res = addPlayer(state, host, now);
  if (!res.ok) throw new Error(res.message);
  return res.state;
}

export function addPlayer(prev: RoomState, p: { id: string; name: string }, now: number): ActionResult {
  const name = sanitizeName(p.name);
  if (!name) return fail('invalid', 'Pick a display name first.');
  if (activePlayers(prev).length >= MAX_PLAYERS) return fail('room_full', `This room is full (${MAX_PLAYERS} players).`);
  const state = structuredClone(prev);
  state.players.push({
    id: p.id,
    name: uniqueName(state, name),
    hue: pickHue(state),
    joinedAt: now,
    connected: true,
    disconnectedAt: null,
    ready: false,
    totalUnits: 0,
    left: false,
  });
  return commit(state, now);
}

export function setConnected(prev: RoomState, playerId: string, connected: boolean, now: number): RoomState {
  const state = structuredClone(prev);
  const p = state.players.find((x) => x.id === playerId);
  if (!p) return prev;
  if (p.connected === connected) return prev;
  p.connected = connected;
  p.disconnectedAt = connected ? null : now;
  return bump(state, now);
}

function bump(state: RoomState, now: number): RoomState {
  state.version += 1;
  state.lastActivity = now;
  return state;
}

function commit(state: RoomState, now: number): ActionResult {
  return { ok: true, state: bump(state, now) };
}

// ─── Rounds ────────────────────────────────────────────────────────────────

function pickChooser(state: RoomState, roundNumber: number): string {
  const pool = activePlayers(state).filter((p) => p.connected);
  if (!pool.length) return state.hostId;
  return pool[(roundNumber - 1) % pool.length].id;
}

function startRound(state: RoomState): void {
  const number = state.rounds.length + 1;
  const letters = availableLetters(state.usedLetters);
  state.rounds.push({
    number,
    chooserId: pickChooser(state, number),
    selection: letters.length ? { status: 'choosing' } : { status: 'exhausted' },
    letter: null,
    speed: null,
    categories: [...state.settings.categories],
    participants: [],
    startedAt: null,
    deadline: null,
    stoppedAt: null,
    stoppedBy: null,
    endReason: null,
    reviewAt: null,
    answers: {},
    submittedAt: {},
    votes: {},
    flags: {},
    scored: false,
    results: null,
  });
  state.phase = 'LETTER_SELECTION';
}

function lockLetter(
  state: RoomState,
  round: Round,
  letter: string,
  speed: Speed,
  via: 'ticker' | 'wheel',
  now: number,
  extra: { sequence?: string[]; stopIndex?: number; autoStopped?: boolean } = {},
): void {
  if (state.usedLetters.includes(letter)) throw new Error(`letter ${letter} already used`); // invariant
  state.usedLetters.push(letter);
  round.letter = letter;
  round.speed = speed;
  const revealUntil = now + (via === 'wheel' ? WHEEL_SPIN_MS + REVEAL_MS.wheel : REVEAL_MS.ticker);
  round.selection = { status: 'locked', speed, letter, via, lockedAt: now, revealUntil, ...extra };
}

function resetMatch(state: RoomState): void {
  state.rounds = [];
  state.players = state.players.filter((p) => !p.left);
  for (const p of state.players) {
    p.totalUnits = 0;
    p.ready = false;
  }
}

/** Is the answer sheet still writable at `now`? Includes the in-flight grace window after STOP. */
export function draftWindowOpen(round: Round, now: number): boolean {
  if (round.startedAt === null || round.deadline === null || now < round.startedAt) return false;
  const stop = round.stoppedAt ?? round.deadline;
  return now <= stop + LATE_DRAFT_MS;
}

function sanitizeAnswers(round: Round, answers: unknown): Partial<Record<CategoryId, string>> {
  const out: Partial<Record<CategoryId, string>> = {};
  if (!answers || typeof answers !== 'object') return out;
  for (const cat of round.categories) {
    const v = (answers as Record<string, unknown>)[cat];
    if (typeof v === 'string') out[cat] = cleanAnswer(v).slice(0, ANSWER_MAX);
  }
  return out;
}

function validateSettings(patch: Partial<Settings>, current: Settings, phase: RoomState['phase'], played: number): Settings | string {
  const next = { ...current };
  if (patch.letterMode !== undefined) {
    if (patch.letterMode !== 'ticker' && patch.letterMode !== 'wheel') return 'Unknown letter mode.';
    next.letterMode = patch.letterMode;
  }
  for (const key of ['fastSeconds', 'slowSeconds'] as const) {
    if (patch[key] !== undefined) {
      const v = Math.round(Number(patch[key]));
      if (!Number.isFinite(v) || v < TIMER_LIMITS.min || v > TIMER_LIMITS.max)
        return `Timers must be between ${TIMER_LIMITS.min} and ${TIMER_LIMITS.max} seconds.`;
      next[key] = v;
    }
  }
  if (patch.rounds !== undefined) {
    if (patch.rounds === null) next.rounds = null;
    else {
      const r = Math.round(Number(patch.rounds));
      if (!Number.isFinite(r) || r < 1 || r > 26) return 'Rounds must be between 1 and 26.';
      if (r < played) return `This match has already played ${played} rounds.`;
      next.rounds = r;
    }
  }
  if (patch.categories !== undefined) {
    if (phase !== 'LOBBY') return 'Categories can only change in the lobby.';
    if (!Array.isArray(patch.categories)) return 'Invalid categories.';
    const cats = [...new Set(patch.categories)].filter((c): c is CategoryId => c in CATEGORY_BY_ID);
    if (cats.length < 3 || cats.length > 9) return 'Pick between 3 and 9 categories.';
    next.categories = cats;
  }
  return next;
}

// ─── Client actions ────────────────────────────────────────────────────────

export function applyAction(prev: RoomState, actorId: string, action: ClientAction, ctx: EngineCtx): ActionResult {
  // Time-based transitions always settle first, so an action can never act on a stale phase.
  const settled = tick(prev, ctx) ?? prev;
  const actor = findPlayer(settled, actorId);
  if (!actor) return fail('not_allowed', 'You are not in this room.');
  const state = structuredClone(settled);
  const me = state.players.find((p) => p.id === actorId)!;
  const round = currentRound(state);
  const host = isHost(state, actorId);
  const { now } = ctx;

  switch (action.type) {
    case 'set_ready': {
      if (state.phase !== 'LOBBY') return fail('wrong_phase', 'Ready-up happens in the lobby.');
      me.ready = Boolean(action.ready);
      return commit(state, now);
    }

    case 'update_settings': {
      if (!host) return fail('not_host', 'Only the host can change settings.');
      if (state.phase !== 'LOBBY' && state.phase !== 'RESULTS')
        return fail('wrong_phase', 'Settings can change in the lobby or between rounds.');
      const next = validateSettings(action.settings ?? {}, state.settings, state.phase, state.rounds.length);
      if (typeof next === 'string') return fail('invalid', next);
      state.settings = next;
      return commit(state, now);
    }

    case 'start_match': {
      if (!host) return fail('not_host', 'Only the host can start the match.');
      if (state.phase !== 'LOBBY') return fail('wrong_phase', 'The match has already started.');
      const online = activePlayers(state).filter((p) => p.connected).length;
      if (online < MIN_PLAYERS_TO_START)
        return fail('too_few_players', `You need at least ${MIN_PLAYERS_TO_START} players online to start.`);
      resetMatch(state);
      startRound(state);
      return commit(state, now);
    }

    case 'choose_speed': {
      if (state.phase !== 'LETTER_SELECTION' || !round) return fail('wrong_phase', 'Not choosing a letter right now.');
      if (actorId !== round.chooserId && !host) return fail('not_allowed', 'It is not your turn to call it.');
      if (action.speed !== 'fast' && action.speed !== 'slow') return fail('invalid', 'Fast or slow?');
      const sel = round.selection;
      if (sel.status !== 'choosing' && sel.status !== 'ready')
        return fail('wrong_phase', 'The speed is already locked in.');
      if (state.settings.letterMode === 'wheel') {
        round.selection = { status: 'ready', speed: action.speed };
      } else {
        round.selection = {
          status: 'ticking',
          speed: action.speed,
          startedAt: now,
          intervalMs: TICK_INTERVAL[action.speed],
          sequence: availableLetters(state.usedLetters),
        };
      }
      return commit(state, now);
    }

    case 'stop_ticker': {
      if (state.phase !== 'LETTER_SELECTION' || !round) return fail('wrong_phase', 'Not choosing a letter right now.');
      const sel = round.selection;
      if (sel.status !== 'ticking') return fail('wrong_phase', 'The ticker is not running.');
      if (actorId !== round.chooserId && !host) return fail('not_allowed', 'Only the caller can shout STOP.');
      const serverTick = tickAt(sel.startedAt, sel.intervalMs, now);
      const tolerance = Math.ceil(TICKER_LATENCY_TOLERANCE_MS / sel.intervalMs);
      // Honour the letter the player actually saw, as long as it is plausible given latency.
      let t = serverTick;
      if (Number.isInteger(action.atTick) && action.atTick! <= serverTick + 1 && action.atTick! >= serverTick - tolerance)
        t = Math.max(0, action.atTick!);
      const stopIndex = t % sel.sequence.length;
      lockLetter(state, round, letterAtTick(sel.sequence, t), sel.speed, 'ticker', now, {
        sequence: sel.sequence,
        stopIndex,
      });
      return commit(state, now);
    }

    case 'spin_wheel': {
      if (state.phase !== 'LETTER_SELECTION' || !round) return fail('wrong_phase', 'Not choosing a letter right now.');
      const sel = round.selection;
      if (sel.status !== 'ready') return fail('wrong_phase', 'Pick fast or slow before spinning.');
      if (actorId !== round.chooserId && !host) return fail('not_allowed', 'It is not your turn to spin.');
      const pool = availableLetters(state.usedLetters);
      const letter = pool[Math.floor(ctx.rng() * pool.length) % pool.length];
      lockLetter(state, round, letter, sel.speed, 'wheel', now);
      return commit(state, now);
    }

    case 'save_draft':
    case 'submit_answers': {
      if (state.phase !== 'ANSWERING' || !round || !round.letter) return fail('wrong_phase', 'No round is running.');
      if (!round.participants.includes(actorId)) return fail('not_allowed', 'You will join from the next round.');
      if (!draftWindowOpen(round, now)) return fail('round_over', 'Time is up. Answers are locked.');
      round.answers[actorId] = { ...round.answers[actorId], ...sanitizeAnswers(round, action.answers) };
      if (action.type === 'save_draft') return commit(state, now);

      if (round.submittedAt[actorId]) return commit(state, now); // double submit: harmless no-op
      const mine = round.answers[actorId];
      const missing = round.categories.filter((c) => checkAnswer(mine[c], round.letter!) !== 'ok');
      if (missing.length)
        return fail('invalid', `Every category needs an answer starting with ${round.letter}.`);
      round.submittedAt[actorId] = now;
      if (round.stoppedAt === null) {
        round.stoppedAt = now;
        round.stoppedBy = actorId;
        round.endReason = 'first_finished';
        round.reviewAt = now + STOP_TO_REVIEW_MS;
      }
      return commit(state, now);
    }

    case 'host_end_round': {
      if (!host) return fail('not_host', 'Only the host can end the round.');
      if (state.phase !== 'ANSWERING' || !round) return fail('wrong_phase', 'No round is running.');
      if (round.stoppedAt !== null) return fail('round_over', 'The round has already stopped.');
      round.stoppedAt = now;
      round.stoppedBy = actorId;
      round.endReason = 'host';
      round.reviewAt = now + STOP_TO_REVIEW_MS;
      return commit(state, now);
    }

    case 'vote':
    case 'flag': {
      if (state.phase !== 'REVIEW' || !round || !round.letter) return fail('wrong_phase', 'Review is closed.');
      const [pid, cat] = String(action.key).split(':');
      if (!round.participants.includes(pid) || !round.categories.includes(cat as CategoryId))
        return fail('invalid', 'Unknown answer.');
      if (action.type === 'flag') {
        const set = new Set(round.flags[action.key] ?? []);
        if (action.flagged) set.add(actorId);
        else set.delete(actorId);
        round.flags[action.key] = [...set];
        return commit(state, now);
      }
      if (pid === actorId) return fail('not_allowed', 'You cannot vote on your own answer.');
      if (checkAnswer(round.answers[pid]?.[cat as CategoryId], round.letter) !== 'ok')
        return fail('invalid', 'Blank or wrong-letter answers score zero automatically.');
      const votes = { ...round.votes[action.key] };
      if (action.vote === null) delete votes[actorId];
      else if (action.vote === 'accept' || action.vote === 'reject') votes[actorId] = action.vote;
      else return fail('invalid', 'Unknown vote.');
      round.votes[action.key] = votes;
      return commit(state, now);
    }

    case 'finalize_review': {
      if (!host) return fail('not_host', 'Only the host can lock in the scores.');
      if (round?.scored) return fail('already_scored', 'This round has already been scored.');
      if (state.phase !== 'REVIEW' || !round || !round.letter) return fail('wrong_phase', 'Nothing to score yet.');
      const results = scoreRound({
        letter: round.letter,
        categories: round.categories,
        participants: round.participants,
        answers: round.answers,
        votes: round.votes,
      });
      for (const p of state.players) p.totalUnits += results.perPlayer[p.id]?.total ?? 0;
      round.results = results;
      round.scored = true;
      state.phase = 'RESULTS';
      return commit(state, now);
    }

    case 'next_round': {
      if (!host) return fail('not_host', 'Only the host can start the next round.');
      if (state.phase !== 'RESULTS') return fail('wrong_phase', 'Finish this round first.');
      if (state.settings.rounds !== null && state.rounds.length >= state.settings.rounds) state.phase = 'MATCH_OVER';
      else startRound(state);
      return commit(state, now);
    }

    case 'end_match': {
      if (!host) return fail('not_host', 'Only the host can end the match.');
      if (state.phase === 'LETTER_SELECTION' && round && round.selection.status !== 'locked') {
        state.rounds.pop(); // abandon a round that never got a letter
      } else if (state.phase !== 'RESULTS') {
        return fail('wrong_phase', 'You can end the match between rounds.');
      }
      state.phase = state.rounds.some((r) => r.scored) ? 'MATCH_OVER' : 'LOBBY';
      if (state.phase === 'LOBBY') resetMatch(state);
      return commit(state, now);
    }

    case 'rematch':
    case 'back_to_lobby': {
      if (!host) return fail('not_host', 'Only the host can do that.');
      if (state.phase !== 'MATCH_OVER') return fail('wrong_phase', 'The match is still going.');
      resetMatch(state);
      if (action.type === 'rematch') {
        if (activePlayers(state).filter((p) => p.connected).length < MIN_PLAYERS_TO_START)
          return fail('too_few_players', `You need at least ${MIN_PLAYERS_TO_START} players online.`);
        startRound(state);
      } else state.phase = 'LOBBY';
      return commit(state, now);
    }

    case 'reset_letters': {
      if (!host) return fail('not_host', 'Only the host can reset the alphabet.');
      const exhaustedNow = state.phase === 'LETTER_SELECTION' && round?.selection.status === 'exhausted';
      if (!exhaustedNow && !['LOBBY', 'RESULTS', 'MATCH_OVER'].includes(state.phase))
        return fail('wrong_phase', 'Reset the alphabet between rounds.');
      state.usedLetters = [];
      if (exhaustedNow && round) round.selection = { status: 'choosing' };
      return commit(state, now);
    }

    case 'kick':
    case 'leave': {
      const targetId = action.type === 'kick' ? action.playerId : actorId;
      if (action.type === 'kick') {
        if (!host) return fail('not_host', 'Only the host can remove players.');
        if (targetId === actorId) return fail('invalid', 'Use leave instead.');
      }
      const target = state.players.find((p) => p.id === targetId && !p.left);
      if (!target) return fail('not_found', 'Player not found.');
      if (state.phase === 'LOBBY') state.players = state.players.filter((p) => p.id !== targetId);
      else {
        target.left = true;
        target.connected = false;
      }
      if (state.hostId === targetId) {
        const next = activePlayers(state).find((p) => p.connected) ?? activePlayers(state)[0];
        if (next) state.hostId = next.id;
      }
      if (round && state.phase === 'LETTER_SELECTION' && round.chooserId === targetId && round.selection.status !== 'locked')
        round.chooserId = state.hostId;
      return commit(state, now);
    }

    case 'transfer_host': {
      if (!host) return fail('not_host', 'Only the host can hand over hosting.');
      const target = findPlayer(state, action.playerId);
      if (!target || !target.connected) return fail('not_found', 'That player is not online.');
      state.hostId = target.id;
      return commit(state, now);
    }

    default:
      return fail('invalid', 'Unknown action.');
  }
}

// ─── Time-based transitions ────────────────────────────────────────────────

/**
 * Apply every transition whose time has come. Returns null if nothing changed.
 * The Node server calls this from a timer; every action also calls it first,
 * so the outcome never depends on timer jitter.
 */
export function tick(prev: RoomState, ctx: EngineCtx): RoomState | null {
  let state: RoomState | null = null;
  const w = () => (state ??= structuredClone(prev));
  const { now } = ctx;

  for (let guard = 0; guard < 6; guard++) {
    const s = state ?? prev;
    const round = currentRound(s);
    let changed = false;

    if (s.phase === 'LETTER_SELECTION' && round) {
      const sel = round.selection;
      if (sel.status === 'ticking' && now >= sel.startedAt + TICKER_AUTO_STOP_MS) {
        const st = w();
        const r = currentRound(st)!;
        const t = Math.floor(ctx.rng() * sel.sequence.length);
        lockLetter(st, r, sel.sequence[t], sel.speed, 'ticker', now, {
          sequence: sel.sequence,
          stopIndex: t,
          autoStopped: true,
        });
        changed = true;
      } else if (sel.status === 'locked' && now >= sel.revealUntil) {
        const st = w();
        const r = currentRound(st)!;
        const seconds = sel.speed === 'fast' ? st.settings.fastSeconds : st.settings.slowSeconds;
        r.startedAt = sel.revealUntil;
        r.deadline = sel.revealUntil + seconds * 1000;
        r.participants = activePlayers(st).map((p) => p.id);
        st.phase = 'ANSWERING';
        changed = true;
      }
    } else if (s.phase === 'ANSWERING' && round && round.deadline !== null) {
      if (round.stoppedAt === null && now >= round.deadline) {
        const r = currentRound(w())!;
        r.stoppedAt = r.deadline;
        r.endReason = 'timer';
        r.reviewAt = r.deadline! + STOP_TO_REVIEW_MS;
        changed = true;
      } else if (round.reviewAt !== null && now >= round.reviewAt) {
        w().phase = 'REVIEW';
        changed = true;
      }
    }

    const host = s.players.find((p) => p.id === s.hostId);
    if (!host || host.left || (!host.connected && host.disconnectedAt !== null && now >= host.disconnectedAt + HOST_HANDOFF_MS)) {
      const next = activePlayers(s).find((p) => p.connected && p.id !== s.hostId);
      if (next) {
        w().hostId = next.id;
        changed = true;
      }
    }

    if (!changed) break;
  }
  return state ? bump(state, now) : null;
}

/** When should the server next call tick()? */
export function nextWakeAt(state: RoomState): number | null {
  const times: number[] = [];
  const round = currentRound(state);
  if (state.phase === 'LETTER_SELECTION' && round) {
    const sel = round.selection;
    if (sel.status === 'ticking') times.push(sel.startedAt + TICKER_AUTO_STOP_MS);
    if (sel.status === 'locked') times.push(sel.revealUntil);
  }
  if (state.phase === 'ANSWERING' && round) {
    if (round.stoppedAt === null && round.deadline !== null) times.push(round.deadline);
    if (round.reviewAt !== null) times.push(round.reviewAt);
  }
  const host = state.players.find((p) => p.id === state.hostId);
  if (host && !host.connected && host.disconnectedAt !== null && activePlayers(state).some((p) => p.connected))
    times.push(host.disconnectedAt + HOST_HANDOFF_MS);
  return times.length ? Math.min(...times) : null;
}

// ─── Per-viewer projection ─────────────────────────────────────────────────

export function viewFor(state: RoomState, viewerId: string, now: number): RoomView {
  const round = currentRound(state);
  let roundView: RoundView | null = null;
  if (round) {
    const revealed = state.phase === 'REVIEW' || state.phase === 'RESULTS' || state.phase === 'MATCH_OVER';
    const progress: Record<string, number> = {};
    for (const pid of round.participants) {
      const a = round.answers[pid] ?? {};
      progress[pid] = round.categories.filter((c) => (a[c] ?? '').trim().length > 0).length;
    }
    const { answers, submittedAt, ...rest } = round;
    roundView = {
      ...rest,
      answers: revealed ? answers : answers[viewerId] ? { [viewerId]: answers[viewerId] } : {},
      progress,
      submitted: Object.keys(submittedAt),
      answersRevealed: revealed,
    };
  }
  return {
    code: state.code,
    version: state.version,
    phase: state.phase,
    hostId: state.hostId,
    you: viewerId,
    settings: state.settings,
    players: state.players,
    usedLetters: state.usedLetters,
    round: roundView,
    history: state.rounds
      .filter((r) => r.scored && r.results && r.letter)
      .map((r) => ({ number: r.number, letter: r.letter!, perPlayer: r.results!.perPlayer })),
    serverNow: now,
  };
}

export { answerKey };
