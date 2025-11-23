const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 4000;
const LOG_PATH = path.join(__dirname, 'webhook-emulator.log');

function appendLog(obj) {
  const line = `[${new Date().toISOString()}] ${JSON.stringify(obj)}\n`;
  fs.appendFileSync(LOG_PATH, line);
}

const server = http.createServer((req, res) => {
  const parsed = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'POST' && parsed.pathname === '/webhooks/mcm/delivery-status') {
    let raw = '';
    req.on('data', chunk => raw += chunk);
    req.on('end', () => {
      let body = raw;
      try { body = JSON.parse(raw); } catch (e) { /* keep raw */ }
      const record = {
        path: parsed.pathname,
        headers: req.headers,
        body,
      };
      appendLog(record);
      console.log('Received webhook:', record);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, received: true }));
    });
  } else if (req.method === 'GET' && parsed.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Webhook emulator running');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Webhook emulator listening on http://localhost:${PORT}`);
  appendLog({ event: 'started', port: PORT });
});
