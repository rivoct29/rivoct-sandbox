const fs = require('fs');
const path = require('path');
const fetch = global.fetch || require('node-fetch');

const collectionPath = path.join(__dirname, 'postman_collection.json');
const raw = fs.readFileSync(collectionPath, 'utf8');
const col = JSON.parse(raw);

// lightweight arg parse (avoid external deps)
const argv = process.argv.slice(2);
let targetUrl = 'http://localhost:4000';
let secret = 'replace-with-secret';
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--url' && argv[i+1]) { targetUrl = argv[i+1]; i++; }
  else if (a === '--secret' && argv[i+1]) { secret = argv[i+1]; i++; }
}

async function replay() {
  const items = col.item || [];
  for (const it of items) {
    const name = it.name || '';
    const req = it.request;
    if (!req) continue;
    const urlRaw = (req.url && req.url.raw) || '';
    if (urlRaw.includes('/webhooks/mcm/delivery-status') || /webhook/i.test(name)) {
      const body = req.body && req.body.raw ? req.body.raw : '';
      const contentTypeHeader = (req.header || []).find(h => h.key.toLowerCase() === 'content-type');
      const headers = { 'Content-Type': contentTypeHeader ? contentTypeHeader.value : 'application/json', 'x-webhook-secret': secret };
      const dest = `${targetUrl.replace(/\/$/, '')}/webhooks/mcm/delivery-status`;
      console.log(`Posting '${name}' -> ${dest}`);
      try {
        const r = await fetch(dest, { method: 'POST', headers, body });
        const text = await r.text();
        console.log('Response status', r.status, 'body:', text);
      } catch (err) {
        console.error('Error posting', err.message);
      }
    }
  }
}

replay().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(2); });
