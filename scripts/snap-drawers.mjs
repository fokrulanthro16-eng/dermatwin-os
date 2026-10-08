import { chromium } from 'playwright';
import path from 'path';

async function snap() {
  const browser = await chromium.launch({ headless: true });

  // 1. Capture 05-ecommerce-drawer.png
  console.log('Capturing 05-ecommerce-drawer.png...');
  const page1 = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page1.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page1.waitForTimeout(2000);
  await page1.locator('header button:has-text("Checkout"), button:has-text("Add Full Personalized Routine to Cart")').first().click({ force: true });
  await page1.waitForTimeout(1000);
  await page1.screenshot({ path: path.resolve('public/showcase/05-ecommerce-drawer.png') });
  await page1.close();
  console.log('✓ 05-ecommerce-drawer.png saved!');

  // 2. Capture 06-ai-chat-drawer.png
  console.log('Capturing 06-ai-chat-drawer.png...');
  const page2 = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page2.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await page2.waitForTimeout(2000);
  await page2.locator('button:has-text("Ask AI Clinical Advisor"), header button:has-text("Ask AI")').first().click({ force: true });
  await page2.waitForTimeout(1000);
  await page2.screenshot({ path: path.resolve('public/showcase/06-ai-chat-drawer.png') });
  await page2.close();
  console.log('✓ 06-ai-chat-drawer.png saved!');

  await browser.close();
}

snap().catch((err) => {
  console.error('Snap error:', err);
  process.exit(1);
});
