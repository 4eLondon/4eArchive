import type { CategoryId } from './constants';

/**
 * Match state machine:
 *
 *   LOBBY ──start_match(host)──▶ LETTER_SELECTION ──letter locked + reveal──▶ ANSWERING
 *     ▲                               ▲                                          │
 *     │                               │ next_round(host)          first submit / timer / host
 *     │                               │                                          ▼
 *  back_to_lobby(host)            RESULTS ◀──finalize_review(host, once)──── REVIEW
 *     │                               │
 *     └──────── MATCH_OVER ◀──next_round on last round / end_match(host)
 *                    │
 *                 rematch(host) ──▶ LETTER_SELECTION
 */
export type Phase = 'LOBBY' | 'LETTER_SELECTION' | 'ANSWERING' | 'REVIEW' | 'RESULTS' | 'MATCH_OVER';

export type Speed = 'fast' | 'slow';
export type LetterMode = 'ticker' | 'wheel';
export type Vote = 'accept' | 'reject';

export interface Settings {
  letterMode: LetterMode;
  fastSeconds: number;
  slowSeconds: number;
  /** null = keep playing until the host ends the match */
  rounds: number | null;
  categories: CategoryId[];
}

export interface Player {
  id: string;
  name: string;
  hue: number;
  joinedAt: number;
  connected: boolean;
  disconnectedAt: number | null;
  ready: boolean;
  /** Total score in SCORE_UNIT integer units. */
  totalUnits: number;
  left: boolean;
}

export type Selection =
  | { status: 'choosing' }
  | { status: 'exhausted' }
  | { status: 'ready'; speed: Speed } // wheel mode: speed picked, waiting for SPIN
  | { status: 'ticking'; speed: Speed; startedAt: number; intervalMs: number; sequence: string[] }
  | {
      status: 'locked';
      speed: Speed;
      letter: string;
      via: 'ticker' | 'wheel';
      lockedAt: number;
      revealUntil: number;
      /** ticker: the sequence and index where it stopped (for the frozen ticker frame) */
      sequence?: string[];
      stopIndex?: number;
      autoStopped?: boolean;
    };

export type EndReason = 'first_finished' | 'timer' | 'host';

export type AnswerStatus = 'accepted' | 'rejected' | 'blank' | 'wrong_letter';

export interface AnswerOutcome {
  status: AnswerStatus;
  units: number;
  /** size of the accepted duplicate group (1 = unique) */
  duplicates: number;
}

export interface RoundResults {
  outcomes: Record<string, AnswerOutcome>;
  perPlayer: Record<string, { total: number; byCategory: Partial<Record<CategoryId, number>> }>;
}

export interface Round {
  number: number;
  chooserId: string;
  selection: Selection;
  letter: string | null;
  speed: Speed | null;
  categories: CategoryId[];
  participants: string[];
  startedAt: number | null;
  deadline: number | null;
  stoppedAt: number | null;
  stoppedBy: string | null;
  endReason: EndReason | null;
  reviewAt: number | null;
  answers: Record<string, Partial<Record<CategoryId, string>>>;
  submittedAt: Record<string, number>;
  votes: Record<string, Record<string, Vote>>;
  flags: Record<string, string[]>;
  scored: boolean;
  results: RoundResults | null;
}

export interface RoomState {
  code: string;
  createdAt: number;
  lastActivity: number;
  version: number;
  phase: Phase;
  hostId: string;
  settings: Settings;
  players: Player[];
  usedLetters: string[];
  rounds: Round[];
}

/** Actions any client may send. The server decides whether the sender is allowed. */
export type ClientAction =
  | { type: 'set_ready'; ready: boolean }
  | { type: 'update_settings'; settings: Partial<Settings> }
  | { type: 'start_match' }
  | { type: 'choose_speed'; speed: Speed }
  | { type: 'stop_ticker'; atTick?: number }
  | { type: 'spin_wheel' }
  | { type: 'save_draft'; answers: Partial<Record<CategoryId, string>> }
  | { type: 'submit_answers'; answers: Partial<Record<CategoryId, string>> }
  | { type: 'host_end_round' }
  | { type: 'vote'; key: string; vote: Vote | null }
  | { type: 'flag'; key: string; flagged: boolean }
  | { type: 'finalize_review' }
  | { type: 'next_round' }
  | { type: 'end_match' }
  | { type: 'rematch' }
  | { type: 'back_to_lobby' }
  | { type: 'reset_letters' }
  | { type: 'kick'; playerId: string }
  | { type: 'transfer_host'; playerId: string }
  | { type: 'leave' };

export type ActionResult =
  | { ok: true; state: RoomState }
  | { ok: false; error: ErrorCode; message: string };

export type ErrorCode =
  | 'not_host'
  | 'wrong_phase'
  | 'not_allowed'
  | 'invalid'
  | 'too_few_players'
  | 'room_full'
  | 'round_over'
  | 'already_scored'
  | 'not_found'
  | 'letters_exhausted';

// ─── What a single client is allowed to see ────────────────────────────────

export interface RoundView extends Omit<Round, 'answers' | 'submittedAt'> {
  /** During selection/answering: only the viewer's own answers. Afterwards: everyone's. */
  answers: Record<string, Partial<Record<CategoryId, string>>>;
  /** Number of filled categories per participant (safe to show while answering). */
  progress: Record<string, number>;
  submitted: string[];
  answersRevealed: boolean;
}

export interface RoundSummary {
  number: number;
  letter: string;
  perPlayer: RoundResults['perPlayer'];
}

export interface RoomView {
  code: string;
  version: number;
  phase: Phase;
  hostId: string;
  you: string;
  settings: Settings;
  players: Player[];
  usedLetters: string[];
  round: RoundView | null;
  history: RoundSummary[];
  serverNow: number;
}

// ─── Wire protocol for the Node WebSocket server ───────────────────────────

export type ClientMessage =
  | { t: 'create'; name: string; reqId: string }
  | { t: 'join'; code: string; name: string; reqId: string }
  | { t: 'resume'; code: string; playerId: string; secret: string; takeover: boolean; reqId: string }
  | { t: 'peek'; code: string; reqId: string }
  | { t: 'action'; action: ClientAction; reqId: string }
  | { t: 'ping'; clientTime: number };

export type ServerMessage =
  | { t: 'joined'; reqId: string; code: string; playerId: string; secret: string }
  | { t: 'peeked'; reqId: string; exists: boolean; phase?: Phase; players?: number; full?: boolean }
  | { t: 'state'; view: RoomView }
  | { t: 'ack'; reqId: string }
  | { t: 'error'; reqId?: string; error: ErrorCode | 'bad_request' | 'resume_failed'; message: string }
  | { t: 'pong'; clientTime: number; serverTime: number };
