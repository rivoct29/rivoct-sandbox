#!/usr/bin/env node
/**
 * Simple Playwright visual sweep that varies CSS variables and captures screenshots.
 * Usage: node visual-sweep.js [url]
 *
 * NOTE: Run `pnpm --filter web dev` (or `npm run dev` in `web`) first so the site is available.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
// Use playwright bundled via @playwright/test devDependency
const { chromium } = require('@playwright/test');

const url = process.argv[2] || 'http://localhost:3000';
const outDir = path.resolve(__dirname, '..', '..', 'test-results', 'visual-sweep');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const ctaSaturations = [0.7, 0.85, 1.0];
const footerBgOpacities = [0.03, 0.05, 0.08];
const footerTextOpacities = [0.6, 0.75, 0.9];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const results = {};
  let idx = 0;

  for (const cs of ctaSaturations) {
    for (const fb of footerBgOpacities) {
      for (const ft of footerTextOpacities) {
        idx++;
        const combo = { ctaSaturation: cs, footerBgOpacity: fb, footerTextOpacity: ft };
        console.log(`Trial ${idx}:`, combo);
        try {
          await page.goto(url, { waitUntil: 'networkidle' });

          // Inject variables
          await page.evaluate((vars) => {
            const doc = document.documentElement;
            doc.style.setProperty('--cta-saturation', String(vars.ctaSaturation));
            doc.style.setProperty('--footer-bg-opacity', String(vars.footerBgOpacity));
            doc.style.setProperty('--footer-text-opacity', String(vars.footerTextOpacity));
          }, combo);

          // Allow styles to settle
          await page.waitForTimeout(300);

          const screenshot = await page.screenshot({ fullPage: true });
          const hash = crypto.createHash('sha256').update(screenshot).digest('hex');
          const fileName = `${String(idx).padStart(2,'0')}_${hash}.png`;
          const outPath = path.join(outDir, fileName);
          fs.writeFileSync(outPath, screenshot);

          if (!results[hash]) results[hash] = { count: 0, combos: [], paths: [] };
          results[hash].count += 1;
          results[hash].combos.push(combo);
          results[hash].paths.push(outPath);
        } catch (err) {
          console.error('Trial failed', err);
        }
      }
    }
  }

  await browser.close();

  // Rank by count (pixel-stable = identical hash across multiple runs)
  const ranked = Object.keys(results)
    .map((h) => ({ hash: h, count: results[h].count, combos: results[h].combos, paths: results[h].paths }))
    .sort((a, b) => b.count - a.count || a.hash.localeCompare(b.hash));

  const top = ranked.slice(0, 3);
  console.log('\nTop variants:');
  top.forEach((t, i) => {
    console.log(`\n#${i + 1} — count=${t.count} hash=${t.hash}`);
    console.log('  sample combo:', t.combos[0]);
    console.log('  sample path :', t.paths[0]);
  });

  const summaryPath = path.join(outDir, 'summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({ ranked, top }, null, 2));
  console.log('\nSaved summary to', summaryPath);
}

run().catch((e) => { console.error(e); process.exit(1); });
