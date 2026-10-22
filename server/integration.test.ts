// End-to-end over real WebSockets: separate clients, one authoritative server.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import WebSocket from 'ws';
import { ALPHABET } from '../shared/constants';
import type { ClientAction, RoomView, ServerMessage } from '../shared/types';
import { startServer } from './index';

const PORT = 18787;
let server: ReturnType<typeof startServer>;

beforeAll(() => {
  server = startServer({ port: PORT, quiet: true });
});
afterAll(async () => {
  await server.close();
});

class Client {
  ws!: WebSocket;
  view: RoomView | null = null;
  playerId = '';
  secret = '';
  code = '';
  private n = 0;
  private waiters: ((m: ServerMessage) => boolean)[] = [];

  async open() {
    this.ws = new WebSocket(`ws://localhost:${PORT}/ws`);
    this.ws.on('message', (raw) => {
      const m = JSON.parse(String(raw)) as ServerMessage;
      if (m.t === 'state') this.view = m.view;
      this.waiters = this.waiters.filter((w) => !w(m));
    });
    await new Promise((r) => this.ws.once('open', r));
    return this;
  }
  private request(msg: Record<string, unknown> & { t: string }): Promise<ServerMessage> {
    const reqId = String(++this.n);
    return new Promise((resolve) => {
      this.waiters.push((m) => {
        if ('reqId' in m && m.reqId === reqId) {
          resolve(m);
          return true;
        }
        return false;
      });
      this.ws.send(JSON.stringify({ ...msg, reqId }));
    });
  }
  async enter(msg: Record<string, unknown> & { t: string }) {
    const r = await this.request(msg);
    if (r.t === 'joined') Object.assign(this, { playerId: r.playerId, secret: r.secret, code: r.code });
    return r;
  }
  act(action: ClientAction) {
    return this.request({ t: 'action', action });
  }
  until(pred: (v: RoomView) => boolean, timeout = 8000): Promise<RoomView> {
    if (this.view && pred(this.view)) return Promise.resolve(this.view);
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('timeout waiting for state')), timeout);
      this.waiters.push((m) => {
        if (m.t === 'state' && pred(m.view)) {
          clearTimeout(t);
          resolve(m.view);
          return true;
        }
        return false;
      });
    });
  }
  close() {
    this.ws.close();
  }
}

describe('realtime server', () => {
  it('rejects an invalid room code', async () => {
    const c = await new Client().open();
    const r = await c.enter({ t: 'join', code: 'ZZZZ', name: 'Nope' });
    expect(r).toMatchObject({ t: 'error', error: 'not_found' });
    c.close();
  });

  it('plays a full round across two separate clients', async () => {
    const host = await new Client().open();
    const guest = await new Client().open();
    expect(await host.enter({ t: 'create', name: 'Host' })).toMatchObject({ t: 'joined' });
    expect(await guest.enter({ t: 'join', code: host.code.toLowerCase(), name: 'Guest' })).toMatchObject({ t: 'joined' });

    // Both see each other in the lobby.
    await host.until((v) => v.players.length === 2);
    await guest.until((v) => v.players.length === 2);

    // Guest cannot start; host can.
    expect(await guest.act({ type: 'start_match' })).toMatchObject({ t: 'error', error: 'not_host' });
    await host.act({ type: 'update_settings', settings: { letterMode: 'ticker', fastSeconds: 15 } });
    await host.act({ type: 'start_match' });
    const sel = await guest.until((v) => v.phase === 'LETTER_SELECTION');
    const chooser = sel.round!.chooserId === host.playerId ? host : guest;
    await chooser.act({ type: 'choose_speed', speed: 'fast' });
    await chooser.act({ type: 'stop_ticker' });

    // Same letter on both devices.
    const hv = await host.until((v) => v.phase === 'ANSWERING');
    const gv = await guest.until((v) => v.phase === 'ANSWERING');
    expect(hv.round!.letter).toBe(gv.round!.letter);
    expect(hv.round!.deadline).toBe(gv.round!.deadline);
    expect(hv.round!.deadline! - hv.round!.startedAt!).toBe(15_000);
    const L = hv.round!.letter!;
    expect(ALPHABET).toContain(L);

    // Guest drafts privately; host does not see the text.
    await guest.act({ type: 'save_draft', answers: { boy: `${L}ob` } });
    const hidden = await host.until((v) => v.round!.progress[guest.playerId] === 1);
    expect(hidden.round!.answers[guest.playerId]).toBeUndefined();

    // Host submits all five: STOP for everyone.
    const sheet = { boy: `${L}x`, girl: `${L}y`, animal: `${L}z`, place: `${L}w`, food: `${L}v` };
    expect(await host.act({ type: 'submit_answers', answers: sheet })).toMatchObject({ t: 'ack' });
    await guest.until((v) => v.round!.stoppedBy === host.playerId);
    // Edits after the grace window are refused.
    await new Promise((r) => setTimeout(r, 700));
    expect(await guest.act({ type: 'save_draft', answers: { girl: `${L}ate` } })).toMatchObject({ error: 'round_over' });

    // Server timer moves everyone to review; answers now visible.
    const review = await guest.until((v) => v.phase === 'REVIEW');
    expect(review.round!.answers[host.playerId].boy).toBe(`${L}x`);

    await guest.act({ type: 'vote', key: `${host.playerId}:food`, vote: 'reject' });
    await host.act({ type: 'finalize_review' });
    expect(await host.act({ type: 'finalize_review' })).toMatchObject({ error: 'already_scored' });
    const results = await guest.until((v) => v.phase === 'RESULTS');
    const hostTotal = results.players.find((p) => p.id === host.playerId)!.totalUnits;
    expect(hostTotal).toBe(4 * 27720); // food rejected 1-0
    host.close();
    guest.close();
  });

  it('reconnects a dropped player to the same seat, and refuses silent duplicates', async () => {
    const a = await new Client().open();
    await a.enter({ t: 'create', name: 'Ava' });
    const b = await new Client().open();
    await b.enter({ t: 'join', code: a.code, name: 'Bo' });
    await a.until((v) => v.players.find((p) => p.id === b.playerId)?.connected === true);

    // A second tab cannot silently steal the seat...
    const dup = await new Client().open();
    expect(await dup.enter({ t: 'resume', code: a.code, playerId: b.playerId, secret: b.secret, takeover: false })).toMatchObject({
      t: 'error',
      error: 'resume_failed',
    });
    // ...and a wrong secret never works.
    expect(await dup.enter({ t: 'resume', code: a.code, playerId: b.playerId, secret: 'nope', takeover: true })).toMatchObject({
      error: 'resume_failed',
    });

    b.close();
    await a.until((v) => v.players.find((p) => p.id === b.playerId)?.connected === false);
    const b2 = await new Client().open();
    expect(await b2.enter({ t: 'resume', code: a.code, playerId: b.playerId, secret: b.secret, takeover: true })).toMatchObject({
      t: 'joined',
      playerId: b.playerId,
    });
    await a.until((v) => v.players.find((p) => p.id === b.playerId)?.connected === true);
    expect(a.view!.players.filter((p) => !p.left)).toHaveLength(2);
    a.close();
    b2.close();
    dup.close();
  });

  it('ends the round on timer expiry for everyone', async () => {
    const a = await new Client().open();
    const b = await new Client().open();
    await a.enter({ t: 'create', name: 'Tim' });
    await b.enter({ t: 'join', code: a.code, name: 'Er' });
    await a.until((v) => v.players.length === 2);
    await a.act({ type: 'update_settings', settings: { letterMode: 'ticker', fastSeconds: 15 } });
    await a.act({ type: 'start_match' });
    const v = await a.until((x) => x.phase === 'LETTER_SELECTION');
    const chooser = v.round!.chooserId === a.playerId ? a : b;
    await chooser.act({ type: 'choose_speed', speed: 'fast' });
    await chooser.act({ type: 'stop_ticker' });
    const ans = await b.until((x) => x.phase === 'ANSWERING');
    const ms = ans.round!.deadline! - ans.serverNow + 2500;
    const done = await b.until((x) => x.phase === 'REVIEW', ms);
    expect(done.round!.endReason).toBe('timer');
    a.close();
    b.close();
  }, 30000);
});
