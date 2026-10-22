# ABC Fast or Slow

**Think quick. Name it. Score it.**

A real-time multiplayer word party game for friends on a call. Someone calls "ABC, fast or slow?" and stops the alphabet (or spins the wheel). Then everyone races to fill **Boy, Girl, Animal, Place, Food** with words starting with that letter. The first player to finish shouts **STOP** for everyone. Answers are reviewed together, duplicates split the points, and the leaderboard updates live.

- Mobile-first, one-handed play, works at 360 px wide
- Real multiplayer across devices and networks, with a server-authoritative game state
- Two interchangeable backends:
  - **Node realtime server** (default). Runs anywhere Node runs and needs no accounts.
  - **Supabase** (Postgres + RLS + Realtime). The full migration is included.

---

## Quick start (local)

```bash
npm install
npm run dev
```

Open http://localhost:5173. To play with a second "device", open the room link in another browser tab or window. Each tab is its own player.

Phones on the same Wi-Fi can join at `http://<your-computer-LAN-IP>:5173/room/CODE`. Vite listens on the network and proxies `/ws` to the game server on port 8787.

| Script | What it does |
| --- | --- |
| `npm run dev` | Game server (:8787, auto-reload) + Vite dev server (:5173) |
| `npm test` | Unit, WebSocket integration and Supabase SQL tests (Vitest) |
| `npm run typecheck` | TypeScript, no emit |
| `npm run build` | Production web build to `dist/` |
| `npm start` | Production: one Node process serves `dist/` and `/ws` on `$PORT` |

Requires Node 20+ (developed on Node 24).

---

## How to play

1. **Create a room.** Share the 4-letter code or the link. 2 to 12 players.
2. The host picks settings: letter picker (alphabet ticker or wheel), fast/slow timers (30 s / 90 s by default), match length (3/5/7/10 rounds or unlimited) and categories (5 defaults plus optional Thing, Brand, Job, Movie).
3. Each round a **caller** (rotating) chooses **Fast** or **Slow**. Fast means a fast ticker and the short timer. Then they hit **STOP** on the running alphabet, or spin the wheel.
4. Everyone fills the categories privately. The first complete, valid sheet triggers **STOP** for everyone. Otherwise the timer ends the round. The host can also end it early.
5. **Review:** everyone accepts or rejects other players' answers and can flag answers for discussion. Majority rules; ties count as valid.
6. The host locks in scores. Unique answer = **100**. Shared by 2 = **50** each. Shared by 3 = **33.3** each. Rejected, blank or wrong letter = **0**.
7. The highest total after the final round wins. Then rematch, or return to the lobby.

Letters never repeat until all 26 have been used. The host then resets the alphabet.

---

## Architecture

```
shared/     Pure TypeScript game logic, used by server, client and tests
  constants.ts   categories, timings, SCORE_UNIT
  normalize.ts   answer cleaning + technical rules (blank / wrong letter)
  scoring.ts     exact integer scoring, duplicate detection
  letters.ts     letter pool + ticker maths
  engine.ts      the state machine: applyAction / tick / nextWakeAt / viewFor
  types.ts       state, views, wire protocol
server/     Node HTTP + WebSocket server (ws). Owns rooms, timers, presence, persistence
src/        React 19 + Tailwind v4 + Motion client
  net/           Transport interface + WebSocket and Supabase implementations
  state/         game store (useSyncExternalStore), seat identity, preferences
  screens/       Landing, RoomScreen, Lobby, LetterSelection, Answering, Review, Results, MatchSummary
  components/    Keycap, Ticker, Wheel, Scoreboard, Players, TopBar...
supabase/
  migrations/    schema, RLS, SECURITY DEFINER RPCs (mirrors shared/engine.ts)
  sql.test.ts    runs the migration in PGlite and plays rounds through the RPCs
```

### State machine

```
LOBBY --start_match (host, >=2 online)--> LETTER_SELECTION
LETTER_SELECTION: choosing -> ticking (ticker) | ready (wheel) -> locked (letter chosen, reveal)
   --reveal finished (server clock)--> ANSWERING
ANSWERING --first valid submit | deadline | host_end_round--> STOP (1.8 s)
   --server clock--> REVIEW
REVIEW --finalize_review (host, exactly once)--> RESULTS
RESULTS --next_round (host)--> LETTER_SELECTION, or MATCH_OVER after the last round
RESULTS --end_match (host)--> MATCH_OVER
MATCH_OVER --rematch (host)--> LETTER_SELECTION | --back_to_lobby (host)--> LOBBY
```

| Transition | Who may trigger it |
| --- | --- |
| change settings, start, next round, end round early, finalize, end match, rematch, reset alphabet, remove player | host only |
| choose fast/slow, STOP ticker, spin wheel | this round's caller, or the host (fallback if the caller is away) |
| draft / submit answers | round participants, only while the sheet is open |
| vote | any player, never on their own answer, never on blank or wrong-letter answers |
| flag | any player |
| reveal -> answering, deadline, STOP -> review, auto-STOP of an idle ticker, host handoff | the **server clock** only |

### Server authority and fairness

- Clients send *intentions* (`{type: 'submit_answers', ...}`). The server validates phase and permission, uses its own clock, and broadcasts a per-player view. Clients never send scores, deadlines or host status.
- Every action first applies due time-based transitions (`tick`), so results never depend on timer jitter. In Node, room actions are processed one at a time, which settles races. In Supabase, every RPC takes `SELECT ... FOR UPDATE` on the room row.
- Other players' answers are **not sent** to clients until review. While answering, only a filled-count is shared.
- **Clock sync:** clients estimate the server clock offset from ping round-trips (lowest-RTT sample). Countdown, ticker and wheel all render from server timestamps, so every device shows the same letter and time.
- **STOP latency:** the ticker STOP accepts the tick the player actually saw if it is within 450 ms of the server tick. Otherwise the server's own tick wins.

### Scoring without floating-point drift

100 points = `SCORE_UNIT` = **27,720** integer units, the least common multiple of 1..12. Any split between up to 12 duplicates is an exact integer (a three-way split is 9,240 units), so totals never drift. Points are converted for display only (`33.3`). Finalizing is idempotent: a second call returns `already_scored`, and `round.scored` / the room lock make double-awarding impossible.

### Answer comparison

Answers are trimmed and have inner whitespace collapsed. They are compared case-insensitively and accent-insensitively, within their category only. "Bass" as an animal and "Bass" as a food are not duplicates.

---

## Edge cases and how they behave

| Case | Behaviour |
| --- | --- |
| Empty form submitted | Rejected: all categories must be filled with the right letter. Drafts still save. |
| Player submits twice | Second submit is a no-op. |
| Two players finish at almost the same time | The first one the server processes wins STOP. A submit arriving within 600 ms after STOP is still recorded ("photo finish") but does not change who stopped. |
| Timer expires while someone submits | The server deadline is authoritative. Anything after deadline + 600 ms grace is refused (`round_over`). |
| Editing after STOP | Inputs lock instantly on every device. The server refuses edits after the grace window. |
| Answer with the wrong first letter | Shown live in the input, blocks submit, marked "Wrong letter" in review and scores 0 automatically. |
| Players disagree | Majority of accept/reject votes decides. Ties count as valid. Flags highlight the answer, and the host is asked to confirm before locking in. |
| Same letter twice | Impossible: the pool excludes used letters, and the engine asserts the invariant. |
| All 26 letters used | Letter selection shows "All 26 letters used". The host resets the alphabet. |
| Too few players | Start and rematch need 2 players online. |
| Player disconnects | Seat and score are kept and shown as "Offline, seat saved". Their drafts so far count. Reloading or reconnecting restores the same seat (seat secret in sessionStorage, with localStorage fallback). |
| Same player opened in two tabs | The second tab cannot silently take the seat. It is offered a new seat instead. A reload of the same tab takes over cleanly. |
| Host disconnects | After 20 s (Node) / 45 s (Supabase) hosting moves to the next connected player. The host can also hand over or leave. |
| Caller is away | The host can choose the speed or press STOP for them. An idle ticker auto-stops after 15 s at a random letter. |
| Joining after the match started | Allowed (up to 12 players). The player sits out the current round and joins from the next. |
| Interrupted or repeated scoring request | `already_scored`. Totals are unchanged. |
| Server restart (Node) | Rooms are persisted to `data/rooms.json` and players reconnect automatically. |
| Expired rooms | Rooms idle for 6 hours with nobody connected are deleted. Supabase: `cleanup_rooms()`, schedule it with pg_cron. |
| Invalid room code | "No room with that code" screen. |

---

## Deploying

### Option A: Node server (simplest, fully tested)

Any host that runs a long-lived Node process with WebSockets: Render, Railway, Fly.io, a VPS.

```bash
npm ci && npm run build
PORT=8080 npm start
```

Or with Docker:

```bash
docker build -t abc-fast-or-slow .
docker run -p 8080:8787 -v abc-data:/app/data abc-fast-or-slow
```

Put it behind HTTPS. The client automatically uses `wss://<host>/ws`. One process holds all rooms in memory, which is plenty for many concurrent friend groups. Horizontal scaling would need sticky sessions or the Supabase backend.

### Option B: Supabase

1. Create a Supabase project.
2. **Authentication > Sign In / Providers > enable "Anonymous sign-ins".**
3. Apply the migration in `supabase/migrations/`. Either:
   - `supabase link --project-ref <ref>` then `supabase db push`, or
   - paste the file into the SQL editor and run it.
4. Check that **Database > Publications > supabase_realtime** includes `rooms` (the migration adds it).
5. Create `.env.local`:
   ```
   VITE_BACKEND=supabase
   VITE_SUPABASE_URL=https://<ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon or publishable key>
   ```
6. `npm run build` and host `dist/` on any static host (Netlify, Vercel, Cloudflare Pages) with SPA fallback to `index.html`.
7. Optional: `select cron.schedule('abc-cleanup', '*/30 * * * *', 'select public.cleanup_rooms()');`

**Security model:** clients can only `SELECT` their own `rooms` row (needed for Realtime notifications). Every other table has RLS enabled with no policies, and table privileges are revoked. All reads and writes go through `SECURITY DEFINER` functions (`create_room`, `join_room`, `resume_room`, `peek_room`, `room_action`, `get_snapshot`, `heartbeat`, `tick`). These validate the caller via `auth.uid()`, check phase and host status, and use the database clock. Internal helpers are not executable by clients. The service-role key is never needed by the app.

How sync works in Supabase mode: a Realtime `UPDATE` on the room row (just a version bump) tells clients to call `get_snapshot`, which returns the same per-player view as the Node server. A 5 s heartbeat keeps presence fresh and acts as a fallback. Clients call `tick` exactly when a deadline is due, so the database settles transitions without a cron job.

---

## Testing

```bash
npm test
```

43 automated tests:

- `shared/engine.test.ts` (32): normalization, scoring (unique 100, 2-way 50, 3-way exact thirds, rejected/blank/wrong letter 0, per-category independence, ties), host permissions, settings validation, ticker STOP with latency tolerance, auto-stop, 26-letter no-repeat cycle and reset, fast/slow timers, first-finisher STOP and input lock, photo finish, double submit, timer expiry, post-deadline submit refused, host emergency stop, hidden answers, late joiners, voting rules, double-finalize protection, leaderboard accumulation, match end and rematch, host handoff, reconnect.
- `server/integration.test.ts` (4): real WebSocket clients against the real server: invalid code rejected, a full round across two clients (same letter and deadline on both, private drafts, STOP propagation, locked edits, review, scoring, double finalize refused), reconnect to the same seat, refusal of duplicate-tab seat theft and wrong secrets, timer expiry for everyone.
- `supabase/sql.test.ts` (7): the production migration executed in PGlite, with rounds played through the RPCs as different users. RLS and privileges (no direct table access, rooms visible to members only), host permissions, a full round with SQL scoring cross-checked against the TypeScript scorer, timer expiry, the 26-letter cycle, host handoff.

---

## Accessibility and motion

- Semantic landmarks, labelled inputs (label above the input, errors below), visible focus rings, keyboard play (Enter moves to the next answer, Space shouts STOP).
- A polite live region announces round start, letter, 10-seconds-left, STOP, review and results. Focus moves to the new screen heading on each phase change.
- Honors `prefers-reduced-motion`. An in-game "Reduce animations" switch is in the room menu.
- Sound is synthesized (no downloads), **muted by default**, toggled in the top bar, and never the only signal.
- Touch targets are 40 px or larger. Primary actions sit in a bottom thumb bar on phones. No hover-only interactions.
