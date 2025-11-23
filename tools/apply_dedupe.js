const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IGNORE = new Set(['.git', 'node_modules', 'tools/archived-versions', 'tools/archived-credentials', '.next', 'web/.next', '.github', 'dist', 'out']);

function walk(dir, cb) {
  const names = fs.readdirSync(dir);
  for (const name of names) {
    const rel = path.relative(ROOT, path.join(dir, name));
    if (!rel) continue;
    const parts = rel.split(path.sep);
    if (IGNORE.has(parts[0])) continue;
    const full = path.join(dir, name);
    let stat;
    try { stat = fs.statSync(full); } catch (e) { continue; }
    if (stat.isDirectory()) walk(full, cb);
    else if (stat.isFile()) cb(full, stat);
  }
}

const groups = new Map();
walk(ROOT, (file, stat) => {
  const base = path.basename(file);
  if (!groups.has(base)) groups.set(base, []);
  groups.get(base).push({ file, mtime: stat.mtimeMs, size: stat.size });
});

const dupes = [];
for (const [base, items] of groups.entries()) {
  if (items.length > 1) {
    items.sort((a,b) => b.mtime - a.mtime || b.size - a.size);
    const keep = items[0];
    const remove = items.slice(1);
    dupes.push({ base, keep, remove });
  }
}

if (dupes.length === 0) {
  console.log('No duplicated basenames found.');
  process.exit(0);
}

const ts = new Date().toISOString().replace(/[-:]/g,'').replace(/T/, '-').split('.')[0];
const archiveBase = path.join(ROOT, 'tools', 'archived-versions', 'duplicates', `auto-${ts}`);

console.log(`Archiving ${dupes.reduce((a,d)=>a + d.remove.length,0)} files to ${archiveBase}`);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

ensureDir(archiveBase);

let moved = 0;
for (const d of dupes) {
  for (const r of d.remove) {
    const rel = path.relative(ROOT, r.file);
    const safeRel = rel.replace(/[\\/:]/g,'_');
    const dest = path.join(archiveBase, safeRel);
    ensureDir(path.dirname(dest));
    try {
      fs.renameSync(r.file, dest);
      console.log(`Moved: ${rel} -> ${path.relative(ROOT, dest)}`);
      moved++;
    } catch (e) {
      console.error(`Failed move ${rel}: ${e.message}`);
    }
  }
}

console.log(`Done. Files moved: ${moved}`);
console.log(`Archive location: ${archiveBase}`);
