// Self-hosted realtime server: serves the built web app and the /ws game socket.
//   npm run dev    -> this server on :8787 + Vite on :5173 (proxying /ws)
//   npm run build && npm start -> one process serving everything on $PORT

import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { WebSocketServer, type WebSocket } from 'ws';
import type { ClientMessage, ServerMessage } from '../shared/types';
import { RoomManager, type Conn } from './rooms';

export function startServer(opts: { port: number; persistPath?: string; staticDir?: string; quiet?: boolean }) {
  const rooms = new RoomManager({ persistPath: opts.persistPath });
  const staticDir = opts.staticDir && existsSync(opts.staticDir) ? resolve(opts.staticDir) : null;

  const http = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://x');
    if (url.pathname === '/healthz') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: true, time: Date.now() }));
      return;
    }
    if (!staticDir) {
      res.writeHead(404).end('Run the Vite dev server for the web app (npm run dev).');
      return;
    }
    // Static files with SPA fallback (room links like /room/BKDT resolve to index.html).
    let file = normalize(join(staticDir, decodeURIComponent(url.pathname)));
    if (!file.startsWith(staticDir) || !existsSync(file) || statSync(file).isDirectory()) file = join(staticDir, 'index.html');
    const type = MIME[extname(file)] ?? 'application/octet-stream';
    const immutable = file.includes(`${join(staticDir, 'assets')}`);
    res.writeHead(200, {
      'content-type': type,
      'cache-control': immutable ? 'public, max-age=31536000, immutable' : 'no-cache',
    });
    createReadStream(file).pipe(res);
  });

  const wss = new WebSocketServer({ server: http, path: '/ws', maxPayload: 16 * 1024 });

  wss.on('connection', (ws: WebSocket & { alive?: boolean }) => {
    let bound: { code: string; playerId: string } | null = null;
    let budget = 40; // simple rate limit: 40 messages, refilled 20/s
    const refill = setInterval(() => (budget = Math.min(40, budget + 20)), 1000);
    ws.alive = true;
    ws.on('pong', () => (ws.alive = true));

    const conn: Conn = {
      send: (msg) => ws.readyState === ws.OPEN && ws.send(JSON.stringify(msg)),
      close: (code, reason) => {
        bound = null; // a replaced/kicked socket must not mark the player offline
        ws.close(code, reason);
      },
    };
    const send = (msg: ServerMessage) => conn.send(msg);

    ws.on('message', (raw) => {
      if (--budget < 0) return send({ t: 'error', error: 'bad_request', message: 'Slow down a little.' });
      let msg: ClientMessage;
      try {
        msg = JSON.parse(String(raw));
      } catch {
        return send({ t: 'error', error: 'bad_request', message: 'Malformed message.' });
      }
      switch (msg.t) {
        case 'ping':
          return send({ t: 'pong', clientTime: msg.clientTime, serverTime: Date.now() });
        case 'peek':
          return send({ t: 'peeked', reqId: msg.reqId, ...rooms.peek(msg.code) });
        case 'create':
        case 'join':
        case 'resume': {
          if (bound) rooms.disconnect(bound.code, bound.playerId, conn);
          bound = null;
          const res =
            msg.t === 'create'
              ? rooms.create(msg.name, conn)
              : msg.t === 'join'
                ? rooms.join(msg.code, msg.name, conn)
                : rooms.resume(msg.code, msg.playerId, msg.secret, conn, Boolean(msg.takeover));
          if (!res.ok) return send({ t: 'error', reqId: msg.reqId, error: res.error, message: res.message });
          bound = { code: res.code, playerId: res.playerId };
          return send({ t: 'joined', reqId: msg.reqId, code: res.code, playerId: res.playerId, secret: res.secret });
        }
        case 'action': {
          if (!bound) return send({ t: 'error', reqId: msg.reqId, error: 'not_allowed', message: 'Join a room first.' });
          const res = rooms.action(bound.code, bound.playerId, msg.action);
          return send(res.ok ? { t: 'ack', reqId: msg.reqId } : { t: 'error', reqId: msg.reqId, error: res.error, message: res.message });
        }
        default:
          return send({ t: 'error', error: 'bad_request', message: 'Unknown message.' });
      }
    });

    ws.on('close', () => {
      clearInterval(refill);
      if (bound) rooms.disconnect(bound.code, bound.playerId, conn);
      bound = null;
    });
  });

  // Drop dead sockets so presence stays honest on flaky mobile connections.
  const heartbeat = setInterval(() => {
    for (const ws of wss.clients as Set<WebSocket & { alive?: boolean }>) {
      if (!ws.alive) ws.terminate();
      else {
        ws.alive = false;
        ws.ping();
      }
    }
  }, 15_000);

  http.listen(opts.port, () => {
    if (!opts.quiet) console.log(`ABC Fast or Slow server on http://localhost:${opts.port}  (ws: /ws)`);
  });

  return {
    rooms,
    http,
    close: () =>
      new Promise<void>((done) => {
        clearInterval(heartbeat);
        for (const c of wss.clients) c.terminate();
        wss.close();
        rooms.dispose();
        http.close(() => done());
      }),
  };
}

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

// Run directly (not when imported by tests).
if (process.argv[1] && resolve(process.argv[1]).replace(/\.ts$/, '') === resolve(import.meta.dirname, 'index')) {
  const arg = (name: string) => {
    const i = process.argv.indexOf(name);
    return i > -1 ? process.argv[i + 1] : undefined;
  };
  startServer({
    port: Number(arg('--port') ?? process.env.PORT ?? 8787),
    persistPath: process.env.ROOMS_FILE ?? 'data/rooms.json',
    staticDir: process.argv.includes('--no-static') ? undefined : (process.env.STATIC_DIR ?? 'dist'),
  });
}
