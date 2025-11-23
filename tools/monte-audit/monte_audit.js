const fs = require('fs');
const path = require('path');
// no external deps - use built-in fs to scan files recursively

const SAMPLE_COUNT = Number(process.env.SAMPLE_COUNT || 1000);
const ROOT = path.resolve(__dirname, '..', '..');

function readJsonSafe(file) {
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function scanFiles(patterns) {
  // patterns are kept for documentation but we'll walk and include files matching a simple set
  const out = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      const rel = path.relative(ROOT, full);
      // skip node_modules and .git
      if (rel.split(path.sep).includes('node_modules') || rel.split(path.sep).includes('.git')) continue;
      if (ent.isDirectory()) {
        walk(full);
      } else {
        out.push(full);
      }
    }
  }
  walk(ROOT);
  // filter by sensible extensions / filenames to limit work
  const includeExt = ['.json', '.log', '.md', '.txt'];
  const includeNames = ['lighthouse-accessibility.json'];
  return out.filter((f) => {
    const ext = path.extname(f).toLowerCase();
    const base = path.basename(f);
    if (includeNames.includes(base)) return true;
    return includeExt.includes(ext);
  });
}

function sampleArray(arr, n) {
  const out = [];
  if (!arr || arr.length === 0) return out;
  for (let i = 0; i < n; i++) {
    out.push(arr[Math.floor(Math.random() * arr.length)]);
  }
  return out;
}

function extractErrorsFromJson(obj) {
  const errs = [];
  if (!obj) return errs;
  const s = typeof obj === 'string' ? obj : JSON.stringify(obj);
  if (/401|Unauthorized|Invalid webhook secret/i.test(s)) errs.push('401');
  if (/429|rate limit/i.test(s)) errs.push('429');
  if (/VOICE_LOG_NOT_FOUND/i.test(s)) errs.push('VOICE_LOG_NOT_FOUND');
  if (/error|exception|failed/i.test(s) && /message|stack|code/i.test(s)) errs.push('GENERIC_ERROR');
  return errs;
}

function mergeCount(dest, src) {
  for (const k of Object.keys(src)) dest[k] = (dest[k] || 0) + src[k];
}

async function run() {
  const patterns = [
    '**/lighthouse-accessibility.json',
    'functions/**/lighthouse-accessibility.json',
    '**/*.log',
    '**/*.json',
    'ci/**/*.md',
    'analysis/**/*.md',
  ];
  console.log('Scanning repository for files...');
  const files = scanFiles(patterns);
  console.log(`Found ${files.length} candidate files`);
  const results = {};
  for (const f of files) {
    let parsed = null;
    const rel = path.relative(ROOT, f);
    try {
      const ext = path.extname(f).toLowerCase();
      const raw = fs.readFileSync(f, 'utf8');
      if (ext === '.json') {
        parsed = (() => { try { return JSON.parse(raw); } catch (e) { return raw; } })();
      } else {
        parsed = raw;
      }
      const samples = [];
      if (Array.isArray(parsed)) samples.push(...sampleArray(parsed, Math.min(SAMPLE_COUNT, parsed.length)));
      else samples.push(parsed);

      const fileCounts = {};
      for (const s of samples) {
        const errs = extractErrorsFromJson(s);
        for (const e of errs) fileCounts[e] = (fileCounts[e] || 0) + 1;
      }
      if (Object.keys(fileCounts).length > 0) results[rel] = fileCounts;
    } catch (e) {
      // ignore binary or unreadable files
    }
  }

  console.log('\n=== Monte Audit Summary ===');
  console.log(JSON.stringify(results, null, 2));
  // write summary to file for review
  try {
    const outPath = path.join(ROOT, 'tools', 'monte-audit', 'monte_audit_summary.json');
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
    console.log('\nWrote summary to', outPath);
  } catch (e) {
    console.error('Failed to write summary file:', e.message);
  }
}

run().catch((e)=>{ console.error(e); process.exit(1); });
