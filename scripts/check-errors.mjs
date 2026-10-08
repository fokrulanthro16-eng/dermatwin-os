import { chromium } from 'playwright';

async function check() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.stack || err.message));

  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  console.log('--- Clicking Checkout Button ---');
  await page.locator('header button:has-text("Checkout")').click();
  await page.waitForTimeout(1000);
  console.log('After checkout click text:', (await page.textContent('body')).slice(0, 200));

  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  console.log('--- Clicking Ask AI Agent Button ---');
  await page.locator('header button:has-text("Ask AI Agent")').click();
  await page.waitForTimeout(1000);
  console.log('After chat click text:', (await page.textContent('body')).slice(0, 200));

  await browser.close();
}

check().catch(console.error);
