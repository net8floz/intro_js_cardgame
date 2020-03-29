import express from 'express';
import https from 'https';
import fs from 'fs';
import http, { Server } from 'http';
import SocketIO from 'socket.io';
import { host } from './host';
import { player } from './player';
import { viewer } from './viewer';

const app = express();

let server: Server;
let port: number;
const ioPort = 3000;

if (process.env.NODE_ENV === 'production') {
  port = 443;
  server = https.createServer(
    {
      key: fs.readFileSync(process.env.PRIVKEY_PATH),
      cert: fs.readFileSync(process.env.CERT_PATH)
    },
    app
  );
  app.use(express.static('../client/dist'));
} else {
  port = 6969;
  server = http.createServer(app);
}

app.get('/socket.io', (req, res) => res.json({ hello: 'world' }));

const io = SocketIO(server, { path: '/socket.io' });

io.on('connect', socket => {
  socket.on('join-host', (ack: (success: boolean) => void) => {
    host(io, socket, ack);
  });

  socket.on('join-player', (username: string, ack: (success: boolean) => void) => {
    player(socket, username, ack);
  });

  socket.on('join-viewer', (ack: (data: unknown) => void) => {
    viewer(socket, ack);
  });
});

server.listen(port, () => {
  console.info(`Started express (${process.env.NODE_ENV}) server on ${port} / ${ioPort}`);
});
