#!/usr/bin/env node
/**
 * Headless smoke test for checkout flow.
 * - Signs up a temporary user via the UI
 * - Navigates to /checkout and submits a transaction id
 * - Captures outbound requests and reports whether /api/verify-payment was called
 *   and whether a Cloud Functions callable request was attempted.
 *
 * Usage: node checkout-smoke.js
 * Ensure `pnpm --filter web dev` is running at http://localhost:3000
 */

const { chromium } = require('@playwright/test');
const crypto = require('crypto');

const BASE = process.argv[2] || 'http://localhost:3000';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  const requests = [];
  page.on('request', (req) => {
    requests.push({ url: req.url(), method: req.method(), resourceType: req.resourceType() });
  });

  // Signup a temp user
  const id = crypto.randomBytes(4).toString('hex');
  const email = `smoketest+${id}@example.com`;
  const password = 'Sm0keTest!';

  console.log('Opening login page...');
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });

  // Switch to signup mode
  try {
    await page.click('text="[ CREATE_NEW_IDENTITY ]"');
  } catch (e) {
    // If toggle not found, maybe already in signup mode
  }

  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);

  // Agree terms checkbox (only visible in signup)
  try {
    await page.check('input[type="checkbox"]');
  } catch (e) {
    // ignore if not present
  }

  console.log('Submitting signup for', email);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }),
    page.click('button[type="submit"]')
  ]).catch(() => {});

  // Navigate to checkout
  console.log('Navigating to checkout...');
  await page.goto(`${BASE}/checkout?package=basic`, { waitUntil: 'networkidle' });

  // If redirected to login, fail early
  if (page.url().includes('/login')) {
    console.error('Still on login page — signup/login likely failed. Aborting smoke test.');
    await browser.close();
    process.exit(2);
  }

  // Fill txn id and submit
  const txn = `SMOKE-${id}`;
  await page.fill('#txnId', txn).catch(() => {});
  console.log('Submitting transaction id:', txn);

  // Click complete purchase
  await Promise.all([
    page.waitForTimeout(3000), // allow any requests to fire
    page.click('button:has-text("COMPLETE_PURCHASE")').catch(() => {})
  ]);

  // Wait briefly for outgoing requests
  await page.waitForTimeout(1500);

  await browser.close();

  // Analyze requests
  const calledProxy = requests.some(r => r.url.includes('/api/verify-payment'));
  const calledCloudFn = requests.some(r => r.url.includes('cloudfunctions') || r.url.includes('/callable') || r.url.includes('cloudfunctions.net'));

  console.log('\nRequest snapshot (last 20):');
  requests.slice(-20).forEach(r => console.log('-', r.method, r.url));

  console.log('\nResults:');
  console.log('- /api/verify-payment called:', calledProxy);
  console.log('- Cloud Functions callable attempted:', calledCloudFn);

  if (calledProxy) process.exit(3);
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
