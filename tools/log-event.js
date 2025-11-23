const fs = require('fs');
const path = require('path');

const LOG = path.resolve(__dirname, 'event-log.md');

function isoNow() { return new Date().toISOString(); }

function appendEvent(actor, action, details) {
  const line = `${isoNow()} | ${actor} | ${action} | ${details}\n`;
  fs.appendFileSync(LOG, line, 'utf8');
  return line;
}

if (require.main === module) {
  const [,,actor,action,...rest] = process.argv;
  if (!actor || !action) {
    console.error('Usage: node log-event.js <actor> <action> [details]');
    process.exit(2);
  }
  const details = rest.join(' ') || '-';
  const out = appendEvent(actor, action, details);
  console.log(out.trim());
}

module.exports = { appendEvent };
