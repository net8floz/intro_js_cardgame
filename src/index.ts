import express from 'express';
import https from 'https';
import fs from 'fs';
import http, { Server } from 'http';

const app = express();
let server: Server;
let port: number;

if (process.env.NODE_ENV === 'production') {
  port = 443;
  server = https.createServer(
    {
      key: fs.readFileSync('/etc/letsencrypt/live/research.platform.arkive.ai/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/research.platform.arkive.ai/cert.pem')
    },
    app
  );
} else {
  port = 6969;
  server = http.createServer(app);
}

app.get('/', (req, res) => {
  res.json({ hello: 'world' });
});

server.listen(port, () => {
  console.info(`Started ${process.env.NODE_ENV} server on ${port}`);
});
