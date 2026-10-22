import { Check, Flag, LockKey, X } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { useMemo } from 'react';
import { CATEGORY_BY_ID, type CategoryId } from '../../shared/constants';
import { normalizeAnswer } from '../../shared/normalize';
import { answerKey, duplicateGroups, formatPoints, scoreRound } from '../../shared/scoring';
import type { AnswerOutcome, Player, RoomView, Vote } from '../../shared/types';
import { CATEGORY_ICON } from '../components/categoryIcons';
import { Avatar, Button, Keycap } from '../components/ui';
import { useAct } from '../lib/hooks';

export function Review({ view }: { view: RoomView }) {
  const round = view.round!;
  const letter = round.letter!;
  const isHost = view.hostId === view.you;
  const host = view.players.find((p) => p.id === view.hostId);
  const { act, busy } = useAct();

  // Live preview using the exact same scoring code the server will run.
  const preview = useMemo(
    () => scoreRound({ letter, categories: round.categories, participants: round.participants, answers: round.answers, votes: round.votes }),
    [letter, round.categories, round.participants, round.answers, round.votes],
  );
  const dupes = useMemo(() => duplicateGroups(round.categories, round.participants, round.answers), [round.categories, round.participants, round.answers]);
  const flaggedCount = Object.values(round.flags).filter((f) => f.length).length;

  function finalize() {
    if (flaggedCount && !confirm(`${flaggedCount} answer${flaggedCount === 1 ? ' is' : 's are'} flagged for discussion. Lock in scores anyway?`)) return;
    act({ type: 'finalize_review' });
  }

  const playersById = Object.fromEntries(view.players.map((p) => [p.id, p]));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-6 pb-36">
      <div className="flex items-start gap-4">
        <Keycap size={60} color="sun">
          {letter}
        </Keycap>
        <div>
          <h1 tabIndex={-1} className="font-display text-3xl font-extrabold tracking-tight focus:outline-none">
            Review the answers
          </h1>
          <p className="mt-1 max-w-[52ch] text-ink-dim">
            Accept or reject other players' answers. Majority wins, ties count as valid. Flag anything worth arguing about.
          </p>
        </div>
      </div>

      <nav className="sticky top-16 z-10 -mx-4 mt-5 flex flex-wrap gap-2 bg-night-950/85 px-4 py-2.5 backdrop-blur-md" aria-label="Jump to category">
        {round.categories.map((c) => {
          const Icon = CATEGORY_ICON[c];
          return (
            <a key={c} href={`#rev-${c}`} className="flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-white/6 px-3 text-sm font-semibold text-ink-dim hover:text-ink">
              <Icon size={15} weight="duotone" aria-hidden /> {CATEGORY_BY_ID[c].label}
            </a>
          );
        })}
      </nav>

      <div className="mt-2 space-y-8">
        {round.categories.map((cat) => (
          <CategoryBlock
            key={cat}
            cat={cat}
            view={view}
            playersById={playersById}
            outcomes={preview.outcomes}
            dupes={dupes}
            onVote={(key, vote) => act({ type: 'vote', key, vote }, { quiet: false })}
            onFlag={(key, flagged) => act({ type: 'flag', key, flagged })}
          />
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/6 bg-night-950/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1 text-sm">
            <p className="font-semibold">
              Your round so far: <span className="text-sun tabular">{formatPoints(preview.perPlayer[view.you]?.total ?? 0)}</span>
            </p>
            <p className="truncate text-ink-mute">{flaggedCount ? `${flaggedCount} flagged for discussion` : 'Nothing flagged'}</p>
          </div>
          {isHost ? (
            <Button size="xl" onClick={finalize} loading={busy === 'finalize_review'}>
              <LockKey size={22} weight="fill" aria-hidden /> Lock in scores
            </Button>
          ) : (
            <p className="max-w-44 text-right text-sm text-ink-dim">Waiting for {host?.name ?? 'the host'} to lock in scores</p>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryBlock({
  cat,
  view,
  playersById,
  outcomes,
  dupes,
  onVote,
  onFlag,
}: {
  cat: CategoryId;
  view: RoomView;
  playersById: Record<string, Player>;
  outcomes: Record<string, AnswerOutcome>;
  dupes: Record<string, number>;
  onVote: (key: string, vote: Vote | null) => void;
  onFlag: (key: string, flagged: boolean) => void;
}) {
  const round = view.round!;
  const Icon = CATEGORY_ICON[cat];
  // Group identical answers next to each other so duplicates are obvious.
  const rows = [...round.participants].sort((a, b) => {
    const na = normalizeAnswer(round.answers[a]?.[cat] ?? '') || '~';
    const nb = normalizeAnswer(round.answers[b]?.[cat] ?? '') || '~';
    return na.localeCompare(nb);
  });
  return (
    <section id={`rev-${cat}`} className="scroll-mt-32" aria-labelledby={`rev-h-${cat}`}>
      <h2 id={`rev-h-${cat}`} className="mb-3 flex items-center gap-2 font-display text-xl font-bold">
        <Icon size={20} weight="duotone" className="text-sun" aria-hidden />
        {CATEGORY_BY_ID[cat].label}
      </h2>
      <ul className="space-y-2">
        {rows.map((pid) => (
          <AnswerRow
            key={pid}
            k={answerKey(pid, cat)}
            player={playersById[pid]}
            answer={round.answers[pid]?.[cat] ?? ''}
            outcome={outcomes[answerKey(pid, cat)]}
            dupes={dupes[answerKey(pid, cat)] ?? 1}
            votes={round.votes[answerKey(pid, cat)] ?? {}}
            flags={round.flags[answerKey(pid, cat)] ?? []}
            you={view.you}
            onVote={onVote}
            onFlag={onFlag}
          />
        ))}
      </ul>
    </section>
  );
}

function AnswerRow({
  k,
  player,
  answer,
  outcome,
  dupes,
  votes,
  flags,
  you,
  onVote,
  onFlag,
}: {
  k: string;
  player?: Player;
  answer: string;
  outcome: AnswerOutcome;
  dupes: number;
  votes: Record<string, Vote>;
  flags: string[];
  you: string;
  onVote: (key: string, vote: Vote | null) => void;
  onFlag: (key: string, flagged: boolean) => void;
}) {
  if (!player) return null;
  const mine = player.id === you;
  const myVote = votes[you];
  const accepts = Object.values(votes).filter((v) => v === 'accept').length;
  const rejects = Object.values(votes).filter((v) => v === 'reject').length;
  const flaggedByMe = flags.includes(you);
  const votable = outcome.status === 'accepted' || outcome.status === 'rejected';
  const tone =
    outcome.status === 'accepted'
      ? 'border-l-mint'
      : outcome.status === 'rejected'
        ? 'border-l-pink'
        : 'border-l-white/15';

  return (
    <motion.li layout className={`rounded-[20px] border border-white/7 border-l-4 bg-night-850/80 p-3 pl-4 ${tone}`}>
      <div className="flex items-center gap-2 text-sm">
        <Avatar player={player} size={24} />
        <span className="truncate font-medium text-ink-dim">{mine ? 'You' : player.name}</span>
        {dupes > 1 && outcome.status !== 'blank' && (
          <span className="rounded-full bg-cyan/15 px-2 py-0.5 text-xs font-bold text-cyan">Shared ×{dupes}</span>
        )}
        {flags.length > 0 && (
          <span className="flex items-center gap-1 rounded-full bg-sun/15 px-2 py-0.5 text-xs font-bold text-sun">
            <Flag size={12} weight="fill" aria-hidden /> {flags.length}
          </span>
        )}
        <span
          className={`ml-auto shrink-0 rounded-full px-2.5 py-0.5 font-display text-sm font-bold tabular ${outcome.units > 0 ? 'bg-sun text-night-950' : 'bg-white/6 text-ink-mute'}`}
          aria-label={`Worth ${formatPoints(outcome.units)} points`}
        >
          +{formatPoints(outcome.units)}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
        <p
          className={`min-w-0 flex-1 font-display text-2xl font-semibold break-words ${
            outcome.status === 'rejected' ? 'text-ink-mute line-through decoration-pink decoration-2' : outcome.status === 'accepted' ? 'text-ink' : 'text-ink-mute'
          }`}
        >
          {answer || <span className="text-lg italic">No answer</span>}
        </p>
        {outcome.status === 'wrong_letter' && <span className="rounded-full bg-pink/15 px-2.5 py-1 text-xs font-bold text-[#ff9cc2]">Wrong letter</span>}

        <div className="flex items-center gap-1.5">
          {votable && !mine && (
            <>
              <VoteButton active={myVote === 'accept'} kind="accept" count={accepts} onClick={() => onVote(k, myVote === 'accept' ? null : 'accept')} label={`Accept ${player.name}'s answer`} />
              <VoteButton active={myVote === 'reject'} kind="reject" count={rejects} onClick={() => onVote(k, myVote === 'reject' ? null : 'reject')} label={`Reject ${player.name}'s answer`} />
            </>
          )}
          {votable && mine && (
            <span className="text-xs text-ink-mute tabular">
              {accepts} accept · {rejects} reject
            </span>
          )}
          {outcome.status !== 'blank' && (
            <button
              onClick={() => onFlag(k, !flaggedByMe)}
              aria-pressed={flaggedByMe}
              aria-label={flaggedByMe ? 'Remove your flag' : 'Flag for discussion'}
              title="Flag for discussion"
              className={`grid size-10 place-items-center rounded-full transition-colors ${flaggedByMe ? 'bg-sun text-night-950' : 'bg-white/5 text-ink-mute hover:text-sun'}`}
            >
              <Flag size={17} weight={flaggedByMe ? 'fill' : 'bold'} />
            </button>
          )}
        </div>
      </div>
    </motion.li>
  );
}

function VoteButton({ active, kind, count, onClick, label }: { active: boolean; kind: Vote; count: number; onClick: () => void; label: string }) {
  const Icon = kind === 'accept' ? Check : X;
  const on = kind === 'accept' ? 'bg-mint text-night-950' : 'bg-pink text-white';
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`flex h-10 min-w-14 items-center justify-center gap-1 rounded-full px-3 text-sm font-bold transition-colors ${active ? on : 'bg-white/6 text-ink-dim hover:text-ink'}`}
    >
      <Icon size={17} weight="bold" aria-hidden />
      <span className="tabular">{count}</span>
    </motion.button>
  );
}
