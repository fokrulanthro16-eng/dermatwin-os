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
 * 1. Ensure Voiceover Audio exists
 */
function ensureVoiceover() {
  console.log('\n[Phase 1] Checking / Synthesizing Voiceover Narration via Edge TTS...');
  if (!fs.existsSync(SHOWCASE_DIR)) {
    fs.mkdirSync(SHOWCASE_DIR, { recursive: true });
  }

  if (fs.existsSync(AUDIO_PATH) && fs.statSync(AUDIO_PATH).size > 10000) {
    const stats = fs.statSync(AUDIO_PATH);
    console.log(`✓ Using existing audio file: ${AUDIO_PATH} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    const tempScriptPath = path.join(SHOWCASE_DIR, 'narration.txt');
    fs.writeFileSync(tempScriptPath, NARRATION_TEXT, 'utf8');

    try {
      const cmd = `python -m edge_tts --voice en-US-AndrewMultilingualNeural --file "${tempScriptPath}" --write-media "${AUDIO_PATH}"`;
      console.log(`Executing: ${cmd}`);
      execSync(cmd, { stdio: 'inherit' });
    } catch (err) {
      console.warn('Fallback to en-US-ChristopherNeural:', err.message);
      const fallbackCmd = `python -m edge_tts --voice en-US-ChristopherNeural --file "${tempScriptPath}" --write-media "${AUDIO_PATH}"`;
      execSync(fallbackCmd, { stdio: 'inherit' });
    }

    if (fs.existsSync(tempScriptPath)) {
      fs.unlinkSync(tempScriptPath);
    }
  }

  // Detect audio duration
  let durationSeconds = 75.5;
  try {
    const probeOutput = execSync(`ffmpeg -i "${AUDIO_PATH}" 2>&1`, { encoding: 'utf8' });
    const match = probeOutput.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (match) {
      const hours = parseFloat(match[1]);
      const minutes = parseFloat(match[2]);
      const seconds = parseFloat(match[3]);
      durationSeconds = hours * 3600 + minutes * 60 + seconds;
    }
  } catch (err) {}

  console.log(`✓ Audio Duration: ${durationSeconds.toFixed(2)} seconds`);
  return durationSeconds;
}

/**
 * 2. Capture 6 Ultra-HD Screenshots (3840x2160, 2x DPR) with strict 5s timeouts
 */
async function captureUltraHDScreenshots() {
  console.log('\n[Phase 2] Capturing Ultra-HD Screenshots (3840x2160, 2x DPR)...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 3840, height: 2160 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();
  page.setDefaultTimeout(5000); // Strict 5-second timeout

  console.log('Navigating to http://localhost:3000...');
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 8000 });
    await page.waitForTimeout(2000);
  } catch (e) {
    console.warn('Navigation warning:', e.message);
  }

  // 1. 01-landing-hero.png
  try {
    console.log('Capturing: 01-landing-hero.png...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(SHOWCASE_DIR, '01-landing-hero.png') });
    console.log('✓ 01-landing-hero.png saved');
  } catch (e) {
    console.warn('Failed 01:', e.message);
  }

  // 2. 02-biometric-radar.png
  try {
    console.log('Capturing: 02-biometric-radar.png...');
    await page.evaluate(() => {
      const radar = document.querySelector('.recharts-responsive-container') || document.querySelector('svg');
      if (radar) radar.scrollIntoView({ behavior: 'instant', block: 'center' });
      else window.scrollTo(0, 500);
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(SHOWCASE_DIR, '02-biometric-radar.png') });
    console.log('✓ 02-biometric-radar.png saved');
  } catch (e) {
    console.warn('Failed 02:', e.message);
  }

  // 3. 03-visual-overlays.png
  try {
    console.log('Capturing: 03-visual-overlays.png...');
    await page.evaluate(() => {
      const h = Array.from(document.querySelectorAll('h3')).find(el => el.textContent.includes('Visual Blemish'));
      if (h) h.scrollIntoView({ behavior: 'instant', block: 'center' });
      else window.scrollTo(0, 1000);
    });
    await page.waitForTimeout(500);

    // Toggle acne/redness
    try {
      const acneBtn = page.locator('button:has-text("Acne")').first();
      await acneBtn.click({ timeout: 2000 });
      const redBtn = page.locator('button:has-text("Redness")').first();
      await redBtn.click({ timeout: 2000 });
      await page.waitForTimeout(500);
    } catch (ignore) {}

    await page.screenshot({ path: path.join(SHOWCASE_DIR, '03-visual-overlays.png') });
    console.log('✓ 03-visual-overlays.png saved');
  } catch (e) {
    console.warn('Failed 03:', e.message);
  }

  // 4. 04-agentic-gatekeeper.png
  try {
    console.log('Capturing: 04-agentic-gatekeeper.png...');
    await page.evaluate(() => {
      const gk = Array.from(document.querySelectorAll('h3, span, div')).find(el => el.textContent.includes('Contraindication Gatekeeper'));
      if (gk) gk.scrollIntoView({ behavior: 'instant', block: 'center' });
      else window.scrollTo(0, 1600);
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(SHOWCASE_DIR, '04-agentic-gatekeeper.png') });
    console.log('✓ 04-agentic-gatekeeper.png saved');
  } catch (e) {
    console.warn('Failed 04:', e.message);
  }

  // 5. 05-ecommerce-drawer.png
  try {
    console.log('Capturing: 05-ecommerce-drawer.png...');
    // Open via header or button
    const checkoutTrigger = page.locator('header button:has-text("Checkout"), button:has-text("Add Full Personalized Routine to Cart")').first();
    await checkoutTrigger.click({ timeout: 3000, force: true });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SHOWCASE_DIR, '05-ecommerce-drawer.png') });
    console.log('✓ 05-ecommerce-drawer.png saved');

    // Close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
  } catch (e) {
    console.warn('Failed 05:', e.message);
    await page.screenshot({ path: path.join(SHOWCASE_DIR, '05-ecommerce-drawer.png') });
  }

  // 6. 06-ai-chat-drawer.png
  try {
    console.log('Capturing: 06-ai-chat-drawer.png...');
    // Open via header button or hero button
    const chatTrigger = page.locator('header button:has-text("Ask AI Agent"), button:has-text("Ask AI Clinical Advisor")').first();
    await chatTrigger.click({ timeout: 3000, force: true });
    await page.waitForTimeout(1000);

    // Try clicking first question pill if visible
    try {
      const qPill = page.locator('button:has-text("Why was Glycolic Acid contraindicated")').first();
      await qPill.click({ timeout: 2000 });
      await page.waitForTimeout(3000);
    } catch (ignore) {}

    await page.screenshot({ path: path.join(SHOWCASE_DIR, '06-ai-chat-drawer.png') });
    console.log('✓ 06-ai-chat-drawer.png saved');

    // Close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  } catch (e) {
    console.warn('Failed 06:', e.message);
    await page.screenshot({ path: path.join(SHOWCASE_DIR, '06-ai-chat-drawer.png') });
  }

  await browser.close();
  console.log('✓ Phase 2 screenshots check complete!');
}

/**
 * 3. Record Video Walkthrough with Playwright
 */
async function recordWalkthroughVideo(targetDurationSec) {
  console.log(`\n[Phase 3] Recording Video Walkthrough (${targetDurationSec.toFixed(1)}s target)...`);

  const tempVideoDir = path.join(SHOWCASE_DIR, 'temp-recording');
  if (!fs.existsSync(tempVideoDir)) {
    fs.mkdirSync(tempVideoDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: tempVideoDir,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const startTime = Date.now();

  console.log('Navigating to live application at http://localhost:3000...');
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 8000 });
    await page.waitForTimeout(2000);
  } catch (e) {}

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

  // --- Beat 1: Hero & Vision (0 - 12s) ---
  console.log('Walkthrough Beat 1: Hero & Architecture...');
  await page.mouse.move(600, 300, { steps: 20 });
  await page.waitForTimeout(2000);
  await page.mouse.move(960, 220, { steps: 30 });
  await page.waitForTimeout(3000);

  // --- Beat 2: Clinical Phenotypes (12 - 25s) ---
  console.log('Walkthrough Beat 2: Clinical Phenotypes & Presets...');
  await smoothScrollTo(360, 2000);
  await page.waitForTimeout(1000);

  try {
    const elena = page.locator('div:has-text("Elena")').first();
    await elena.hover({ timeout: 2000 });
    await page.waitForTimeout(1500);
    await elena.click({ timeout: 2000 });
  } catch (e) {}
  await page.waitForTimeout(2000);

  // --- Beat 3: Biometric Spectrum & Radar Chart (25 - 38s) ---
  console.log('Walkthrough Beat 3: 16-Axis Biometric Radar Spectrum...');
  await smoothScrollTo(750, 2500);
  await page.waitForTimeout(1000);

  try {
    await page.mouse.move(1250, 480, { steps: 25 });
    await page.waitForTimeout(2000);
    await page.mouse.move(1350, 550, { steps: 20 });
    await page.waitForTimeout(2000);
  } catch (e) {}

  // --- Beat 4: Visual Blemish Overlay (38 - 50s) ---
  console.log('Walkthrough Beat 4: Visual Blemish Overlays & Gatekeeper...');
  await smoothScrollTo(1380, 2500);
  await page.waitForTimeout(1000);

  try {
    const acneBtn = page.locator('button:has-text("Acne")').first();
    await acneBtn.click({ timeout: 2000 });
    await page.waitForTimeout(1000);

    const rednessBtn = page.locator('button:has-text("Redness")').first();
    await rednessBtn.click({ timeout: 2000 });
    await page.waitForTimeout(1000);
  } catch (e) {}

  // Gatekeeper audit
  await smoothScrollTo(2100, 2500);
  await page.waitForTimeout(2000);

  // --- Beat 5: Regimen Bundle & Cart Drawer (50 - 64s) ---
  console.log('Walkthrough Beat 5: Regimen Assembly & Slide-Out Cart...');
  await smoothScrollTo(2900, 2500);
  await page.waitForTimeout(1000);

  try {
    const checkoutTrigger = page.locator('button:has-text("Add Full Personalized Routine to Cart"), header button:has-text("Checkout")').first();
    await checkoutTrigger.click({ timeout: 2000, force: true });
    await page.waitForTimeout(3000);

    // Close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
  } catch (e) {}

  // --- Beat 6: Ask DermaTwin AI Clinical Advisor (64s - End) ---
  console.log('Walkthrough Beat 6: Clinical Advisor Consultation...');
  try {
    const chatTrigger = page.locator('header button:has-text("Ask AI Agent"), button:has-text("Ask AI Clinical Advisor")').first();
    await chatTrigger.click({ timeout: 2000, force: true });
    await page.waitForTimeout(2000);

    const qPill = page.locator('button:has-text("Why was Glycolic Acid contraindicated")').first();
    await qPill.click({ timeout: 2000 });
    await page.waitForTimeout(3000);
  } catch (e) {}

  // Fill duration to match narration
  const elapsedSec = (Date.now() - startTime) / 1000;
  const remainingSec = targetDurationSec - elapsedSec;
  if (remainingSec > 0) {
    console.log(`Pacing remaining ${remainingSec.toFixed(1)}s of video walkthrough...`);
    await page.waitForTimeout(Math.floor(remainingSec * 1000) + 500);
  }

  // Finalize video recording
  console.log('Finalizing Playwright browser recording...');
  const recordedVideo = page.video();
  await page.close();
  await context.close();
  await browser.close();

  const tempVideoFile = await recordedVideo.path();
  fs.copyFileSync(tempVideoFile, RAW_VIDEO_PATH);
  console.log(`✓ Raw WebM Video saved to: ${RAW_VIDEO_PATH}`);

  try {
    fs.rmSync(tempVideoDir, { recursive: true, force: true });
  } catch (e) {}
}

/**
 * 4. Merge Video and Audio via FFmpeg
 */
function mergeVideoAndAudio() {
  console.log('\n[Phase 4] Merging WebM Video and Voiceover MP3 via FFmpeg...');
  if (!fs.existsSync(RAW_VIDEO_PATH)) {
    console.warn('RAW_VIDEO_PATH not found, skipping merge.');
    return;
  }
  if (!fs.existsSync(AUDIO_PATH)) {
    console.warn('AUDIO_PATH not found, skipping merge.');
    return;
  }

  const ffmpegCmd = `ffmpeg -y -i "${RAW_VIDEO_PATH}" -i "${AUDIO_PATH}" -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest "${FINAL_VIDEO_PATH}"`;
  console.log(`Executing: ${ffmpegCmd}`);
  execSync(ffmpegCmd, { stdio: 'inherit' });

  const finalStats = fs.statSync(FINAL_VIDEO_PATH);
  console.log(`\n🎉 Official Demo Video Created: ${FINAL_VIDEO_PATH} (${(finalStats.size / (1024 * 1024)).toFixed(2)} MB)`);
}

/**
 * Main Pipeline
 */
async function main() {
  console.log('================================================================');
  console.log(' DERMATWIN OS — AUTOMATED SHOWCASE & MEDIA GENERATION PIPELINE');
  console.log('================================================================');

  const audioDuration = ensureVoiceover();
  await captureUltraHDScreenshots();
  await recordWalkthroughVideo(audioDuration);
  mergeVideoAndAudio();

  console.log('\n================================================================');
  console.log(' SHOWCASE VERIFICATION AUDIT');
  console.log('================================================================');

  const files = fs.readdirSync(SHOWCASE_DIR);
  for (const file of files) {
    const filePath = path.join(SHOWCASE_DIR, file);
    const stats = fs.statSync(filePath);
    console.log(`• ${file.padEnd(30)} ${(stats.size / 1024).toFixed(1)} KB`);
  }

  console.log('\n✓ Production Media Showcase Pipeline Completed Successfully!');
}

main().catch((err) => {
  console.error('\n❌ Media showcase generation failed:', err);
  process.exit(1);
});
