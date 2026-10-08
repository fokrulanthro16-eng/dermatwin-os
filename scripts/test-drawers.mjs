import { chromium } from 'playwright';

async function test() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Open Checkout Drawer
  console.log('Opening checkout drawer...');
  await page.locator('header button:has-text("Checkout")').first().click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'public/showcase/05-ecommerce-drawer.png' });
  console.log('✓ 05 captured');

  // Close Checkout Drawer
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);

  // Open Chat Drawer
  console.log('Opening chat drawer...');
  await page.locator('header button:has-text("Ask AI Agent")').first().click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'public/showcase/06-ai-chat-drawer.png' });
  console.log('✓ 06 captured');

  await browser.close();
}

test().catch(console.error);
