import { test, expect } from '@playwright/test';
import fs from 'fs';

const base = process.env.BASE_URL ?? 'https://rivoct-sandbox.web.app';
const outDir = 'tests/playwright/screenshots';

test.beforeAll(() => {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
});

const pages = [ '/', '/packages', '/contact', '/admin', '/dashboard' ];

for (const p of pages) {
  test(`screenshot ${p}`, async ({ page }) => {
    const url = base + p;
    await page.goto(url, { waitUntil: 'networkidle' });
    // wait a bit for client hydration
    await page.waitForTimeout(1000);
    const file = `${outDir}/${p === '/' ? 'home' : p.replace(/\//g,'_').replace(/^_/, '')}.png`;
    await page.screenshot({ path: file, fullPage: true });
    expect(fs.existsSync(file)).toBeTruthy();
  });
}

// Authenticated admin check placeholder
test('authenticated /admin', async ({ page }) => {
  const email = process.env.ADMIN_EMAIL;
  const pass = process.env.ADMIN_PASSWORD;
  test.skip(!email || !pass, 'ADMIN_EMAIL/ADMIN_PASSWORD not provided');
  await page.goto(base + '/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', pass);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin**', { timeout: 10000 });
  await page.screenshot({ path: `${outDir}/admin_authenticated.png`, fullPage: true });
});
