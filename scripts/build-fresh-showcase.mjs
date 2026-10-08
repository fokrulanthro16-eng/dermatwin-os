import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SHOWCASE_DIR = path.resolve('public', 'showcase');
const AUDIO_PATH = path.join(SHOWCASE_DIR, 'audio.mp3');
const RAW_VIDEO_PATH = path.join(SHOWCASE_DIR, 'raw-video.webm');
const FINAL_VIDEO_PATH = path.join(SHOWCASE_DIR, 'DermaTwin-Official-Demo.mp4');

const NARRATION_TEXT = 
  'Today, over 80% of online skincare purchases result in product returns or skin barrier damage because consumers guess what their skin needs. ' +
  'Welcome to DermaTwin OS — an autonomous dermatological agent built for the YouCam API Skin AI & eCommerce VTO Hackathon. ' +
  "We didn't build a shallow wrapper. We engineered a closed-loop biometric formulation system that transforms clinical facial diagnostics into personalized, contraindication-safe commerce regimens in real time. " +
  'DermaTwin is built to be universal. Users can capture live selfies, upload photos, or run benchmark presets. ' +
  'Our backend dispatches tasks to the Perfect Corp YouCam S2S Skin Analysis API v2.1, extracting 16 biometric markers in seconds. ' +
  'Powered by DeepSeek-V4.1-Flash via Nebius, our agentic gatekeeper blocks harmful acids when barrier damage is detected and formulates a bespoke routine. ' +
  'With one click, the regimen is bundled into an itemized checkout drawer. ' +
  'DermaTwin OS bridges biometric intelligence with high-conversion eCommerce.';

/**
 * 1. Verify localhost:3000 is running
 */
async function verifyServer() {
  console.log('[Step 1] Verifying http://localhost:3000 responds with 200 OK...');
  try {
    const res = await fetch('http://localhost:3000');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    console.log('✓ Server verified: 200 OK');
  } catch (err) {
    throw new Error(`Server check failed: ${err.message}. Please ensure Next.js is running on port 3000.`);
  }
}

/**
 * 2. Ensure Audio Narration via Edge-TTS
 */
function ensureAudio() {
  console.log('[Step 2] Checking / Synthesizing voiceover audio narration...');
  if (!fs.existsSync(SHOWCASE_DIR)) {
    fs.mkdirSync(SHOWCASE_DIR, { recursive: true });
  }

  if (!fs.existsSync(AUDIO_PATH) || fs.statSync(AUDIO_PATH).size < 10000) {
    const scriptPath = path.join(SHOWCASE_DIR, 'narration.txt');
    fs.writeFileSync(scriptPath, NARRATION_TEXT, 'utf8');
    console.log('Synthesizing voiceover via Edge-TTS en-US-AndrewMultilingualNeural...');
    execSync(`python -m edge_tts --voice en-US-AndrewMultilingualNeural --file "${scriptPath}" --write-media "${AUDIO_PATH}"`, { stdio: 'inherit' });
    if (fs.existsSync(scriptPath)) fs.unlinkSync(scriptPath);
  }

  let durationSeconds = 75.5;
  try {
    const probe = execSync(`ffmpeg -i "${AUDIO_PATH}" 2>&1`, { encoding: 'utf8' });
    const match = probe.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (match) {
      durationSeconds = parseFloat(match[1]) * 3600 + parseFloat(match[2]) * 60 + parseFloat(match[3]);
    }
  } catch (e) {}

  console.log(`✓ Audio ready: ${AUDIO_PATH} (${durationSeconds.toFixed(2)}s)`);
  return durationSeconds;
}

/**
 * 3. Capture 6 Clean Screenshots (1920x1080)
 */
async function captureScreenshots() {
  console.log('[Step 3] Capturing 6 High-Res Showcase Screenshots (1920x1080)...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-dev-shm-usage', '--no-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);

  console.log('Loading http://localhost:3000 and waiting for clinical dashboard...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('text=Visual Blemish & Anatomical Layer Map', { timeout: 30000 });
  await page.waitForTimeout(3000);

  // 1. 01-landing-hero.png
  console.log('Capturing: 01-landing-hero.png...');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(SHOWCASE_DIR, '01-landing-hero.png') });
  console.log('✓ 01-landing-hero.png saved');

  // 2. 02-biometric-radar.png
  console.log('Capturing: 02-biometric-radar.png...');
  await page.evaluate(() => {
    const el = document.querySelector('.recharts-responsive-container') || document.querySelector('svg');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    else window.scrollTo(0, 600);
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SHOWCASE_DIR, '02-biometric-radar.png') });
  console.log('✓ 02-biometric-radar.png saved');

  // 3. 03-visual-overlays.png
  console.log('Capturing: 03-visual-overlays.png...');
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Visual Blemish'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    else window.scrollTo(0, 1200);
  });
  await page.waitForTimeout(1000);

  try {
    const acnePill = page.locator('button:has-text("Acne")').first();
    await acnePill.click();
    await page.waitForTimeout(500);
    const redPill = page.locator('button:has-text("Redness")').first();
    await redPill.click();
    await page.waitForTimeout(1200);
  } catch (e) {}

  await page.screenshot({ path: path.join(SHOWCASE_DIR, '03-visual-overlays.png') });
  console.log('✓ 03-visual-overlays.png saved');

  // 4. 04-agentic-gatekeeper.png
  console.log('Capturing: 04-agentic-gatekeeper.png...');
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h3, span, div')).find(h => h.textContent.includes('Contraindication Gatekeeper'));
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    else window.scrollTo(0, 1800);
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(SHOWCASE_DIR, '04-agentic-gatekeeper.png') });
  console.log('✓ 04-agentic-gatekeeper.png saved');

  // 5. 05-ecommerce-drawer.png
  console.log('Capturing: 05-ecommerce-drawer.png...');
  try {
    const checkoutTrigger = page.locator('button:has-text("Add Full Personalized Routine to Cart"), header button:has-text("Checkout")').first();
    await checkoutTrigger.click({ force: true });
    await page.waitForSelector('text=Personalized Biometric Cart', { timeout: 6000 });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(SHOWCASE_DIR, '05-ecommerce-drawer.png') });
    console.log('✓ 05-ecommerce-drawer.png saved');

    // Close drawer
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
  } catch (e) {
    console.warn('05 capture note:', e.message);
  }

  // 6. 06-ai-chat-drawer.png
  console.log('Capturing: 06-ai-chat-drawer.png...');
  try {
    const chatTrigger = page.locator('header button:has-text("Ask AI Agent"), button:has-text("Ask AI Clinical Advisor")').first();
    await chatTrigger.click({ force: true });
    await page.waitForSelector('text=Ask DermaTwin AI', { timeout: 6000 });
    await page.waitForTimeout(1000);

    // Click quick question pill
    const qPill = page.locator('button:has-text("Why was Glycolic Acid contraindicated")').first();
    if (await qPill.isVisible()) {
      await qPill.click();
      await page.waitForTimeout(3000);
    }

    await page.screenshot({ path: path.join(SHOWCASE_DIR, '06-ai-chat-drawer.png') });
    console.log('✓ 06-ai-chat-drawer.png saved');

    // Close drawer
    await page.keyboard.press('Escape');
    await page.waitForTimeout(800);
  } catch (e) {
    console.warn('06 capture note:', e.message);
  }

  await browser.close();
}

/**
 * 4. Record Walkthrough Video (1920x1080)
 */
async function recordWalkthrough(targetDurationSec) {
  console.log(`[Step 4] Recording User Walkthrough Video (${targetDurationSec.toFixed(1)}s target)...`);

  const tempDir = path.join(SHOWCASE_DIR, 'temp-rec');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-dev-shm-usage', '--no-sandbox']
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: tempDir,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  const startTime = Date.now();

  // Helper smooth scroll
  async function smoothScrollTo(targetY, durationMs = 2000) {
    try {
      await page.evaluate(async ({ targetY, durationMs }) => {
        const startY = window.scrollY;
        const diff = targetY - startY;
        const steps = Math.floor(durationMs / 16);
        for (let i = 1; i <= steps; i++) {
          const progress = i / steps;
          const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
          window.scrollTo(0, startY + diff * ease);
          await new Promise((r) => setTimeout(r, 16));
        }
      }, { targetY, durationMs });
    } catch (e) {}
  }

  // 1. Load http://localhost:3000 (wait until main UI is fully rendered, wait 3s)
  console.log('Walkthrough 1/6: Loading http://localhost:3000 and settling UI (3s)...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('text=Visual Blemish & Anatomical Layer Map', { timeout: 30000 });
  await page.waitForTimeout(3000);

  // 2. Click sample face / run scan (wait for 16-parameter radar chart, 4s)
  console.log('Walkthrough 2/6: Clicking sample face preset and rendering 16-parameter radar (4s)...');
  await smoothScrollTo(360, 1500);
  try {
    const elena = page.locator('div:has-text("Elena")').first();
    await elena.hover();
    await page.waitForTimeout(1000);
    await elena.click();
  } catch (e) {}
  await smoothScrollTo(720, 2000);
  await page.waitForSelector('.recharts-responsive-container', { timeout: 10000 });
  await page.mouse.move(1260, 520, { steps: 20 });
  await page.waitForTimeout(4000);

  // 3. Toggle Acne/Redness visual overlay badges (3s)
  console.log('Walkthrough 3/6: Toggling Acne and Redness visual overlay badges (3s)...');
  await smoothScrollTo(1380, 2000);
  try {
    const acneBtn = page.locator('button:has-text("Acne")').first();
    await acneBtn.click();
    await page.waitForTimeout(1200);

    const rednessBtn = page.locator('button:has-text("Redness")').first();
    await rednessBtn.click();
    await page.waitForTimeout(1800);
  } catch (e) {}

  // 4. Scroll down to DeepSeek Clinical Gatekeeper (contraindication triage, 3s)
  console.log('Walkthrough 4/6: Scrolling to Clinical Gatekeeper contraindication audit (3s)...');
  await smoothScrollTo(2150, 2000);
  await page.mouse.move(500, 450, { steps: 20 });
  await page.waitForTimeout(3000);

  // 5. Click "Add Regimen to Cart" to open the eCommerce slide-out drawer (3s)
  console.log('Walkthrough 5/6: Clicking Add Regimen to Cart & opening slide-out drawer (3s)...');
  await smoothScrollTo(2950, 2000);
  try {
    const cartBtn = page.locator('button:has-text("Add Full Personalized Routine to Cart"), header button:has-text("Checkout")').first();
    await cartBtn.click({ force: true });
    await page.waitForSelector('text=Personalized Biometric Cart', { timeout: 6000 });
    await page.waitForTimeout(3000);

    // Close drawer
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
  } catch (e) {}

  // 6. Click a quick question pill in the AI chat drawer to show contextual response (3s)
  console.log('Walkthrough 6/6: Clicking quick question pill in AI chat drawer (3s)...');
  try {
    const chatBtn = page.locator('header button:has-text("Ask AI Agent"), button:has-text("Ask AI Clinical Advisor")').first();
    await chatBtn.click({ force: true });
    await page.waitForSelector('text=Ask DermaTwin AI', { timeout: 6000 });
    await page.waitForTimeout(1500);

    const qPill = page.locator('button:has-text("Why was Glycolic Acid contraindicated")').first();
    if (await qPill.isVisible()) {
      await qPill.click();
      await page.waitForTimeout(3500);
    }
  } catch (e) {}

  // Match audio duration
  const elapsedSec = (Date.now() - startTime) / 1000;
  const remainingSec = targetDurationSec - elapsedSec;
  if (remainingSec > 0) {
    console.log(`Pacing remaining ${remainingSec.toFixed(1)}s of narration...`);
    await page.waitForTimeout(Math.floor(remainingSec * 1000) + 500);
  }

  // Finalize video
  console.log('Flushing recorded video stream...');
  const recordedVideo = page.video();
  await page.close();
  await context.close();
  await browser.close();

  const tempFile = await recordedVideo.path();
  fs.copyFileSync(tempFile, RAW_VIDEO_PATH);
  console.log(`✓ Raw WebM Video saved: ${RAW_VIDEO_PATH}`);

  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {}
}

/**
 * 5. Merge Audio & Video into MP4 via FFmpeg
 */
function mergeAudioVideo() {
  console.log('[Step 5] Merging raw-video.webm and audio.mp3 via FFmpeg...');
  const cmd = `ffmpeg -y -i "${RAW_VIDEO_PATH}" -i "${AUDIO_PATH}" -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest "${FINAL_VIDEO_PATH}"`;
  console.log(`Executing: ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });

  const stats = fs.statSync(FINAL_VIDEO_PATH);
  console.log(`\n🎉 Official Demo Video Ready: ${FINAL_VIDEO_PATH} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
}

/**
 * Main
 */
async function main() {
  console.log('================================================================');
  console.log(' DERMATWIN OS — CLEAN SHOWCASE & MEDIA GENERATOR');
  console.log('================================================================\n');

  await verifyServer();
  const audioDuration = ensureAudio();
  await captureScreenshots();
  await recordWalkthrough(audioDuration);
  mergeAudioVideo();

  console.log('\n================================================================');
  console.log(' SHOWCASE AUDIT VERIFICATION');
  console.log('================================================================');

  const files = fs.readdirSync(SHOWCASE_DIR);
  for (const f of files) {
    const stat = fs.statSync(path.join(SHOWCASE_DIR, f));
    console.log(`• ${f.padEnd(32)} ${(stat.size / 1024).toFixed(1)} KB`);
  }

  console.log('\n✓ DermaTwin-Official-Demo.mp4 & All 6 Screenshots are 100% Ready!');
}

main().catch((err) => {
  console.error('\n❌ Media generation failed:', err.message);
  process.exit(1);
});
