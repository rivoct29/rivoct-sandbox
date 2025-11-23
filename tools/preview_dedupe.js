const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const IGNORE = new Set(['.git', 'node_modules', 'tools/archived-versions', 'tools/archived-credentials', '.next', 'web/.next', '.github', 'dist', 'out']);

function walk(dir, cb) {
  const names = fs.readdirSync(dir);
  for (const name of names) {
    const rel = path.relative(ROOT, path.join(dir, name));
    if (!rel) continue;
    // skip ignored top-level paths
    const parts = rel.split(path.sep);
    if (IGNORE.has(parts[0])) continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
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
    // sort newest first
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

console.log(`Proposed archival directory: ${archiveBase}`);
console.log('Found duplicated basenames (keeping newest):\n');
for (const d of dupes) {
  console.log(`File: ${d.base}`);
  console.log(`  Keep: ${path.relative(ROOT, d.keep.file)}  (mtime: ${new Date(d.keep.mtime).toISOString()}, size: ${d.keep.size})`);
  for (const r of d.remove) {
    const rel = path.relative(ROOT, r.file);
    const dest = path.join(archiveBase, rel.replace(/[:\\/]/g,'_'));
    console.log(`  -> Archive: ${rel}  (mtime: ${new Date(r.mtime).toISOString()}, size: ${r.size})`);
    console.log(`     Proposed dest: ${path.relative(ROOT, dest)}`);
  }
  console.log('');
}

console.log('\nTotal duplicated basename groups: ', dupes.length);
console.log('This preview only lists proposed moves; no files were changed.');
