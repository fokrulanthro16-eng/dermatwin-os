import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const SHOWCASE_DIR = path.resolve('public', 'showcase');
const TEMP_VIDEO_DIR = path.join(SHOWCASE_DIR, 'temp-record');
const AUDIO_PATH = path.join(SHOWCASE_DIR, 'audio.mp3');
const RAW_WALKTHROUGH_PATH = path.join(SHOWCASE_DIR, 'raw-walkthrough.webm');
const FINAL_VIDEO_PATH = path.join(SHOWCASE_DIR, 'DermaTwin-Official-Demo.mp4');

const NARRATION_TEXT = 
  'Welcome to DermaTwin OS — an autonomous dermatological diagnostic agent built for the YouCam API Skin AI and eCommerce VTO Hackathon. ' +
  'Instead of generic skincare recommendations, DermaTwin delivers a closed-loop biometric formulation system. ' +
  'Users capture a live selfie or select benchmark presets. ' +
  'Our backend orchestrates the Perfect Corp YouCam S2S Skin Analysis API v2.1, evaluating sixteen clinical markers including barrier damage, acne severity, and redness. ' +
  'Next, our agentic gatekeeper powered by DeepSeek-V4.1-Flash detects clinical contraindications, safely blocking harsh exfoliating acids when barrier stress is detected. ' +
  'Finally, a bespoke routine is assembled directly into a headless cart drawer with dynamic biometric discounts. ' +
  'DermaTwin OS bridges clinical facial AI with high-conversion personalized commerce.';

async function recordUltraHD() {
  console.log('=== Step 1: Synthesizing Audio Narration via Edge-TTS ===');
  if (!fs.existsSync(SHOWCASE_DIR)) {
    fs.mkdirSync(SHOWCASE_DIR, { recursive: true });
  }

  // Ensure audio is generated with exact text
  const scriptPath = path.join(SHOWCASE_DIR, 'narration-task.txt');
  fs.writeFileSync(scriptPath, NARRATION_TEXT, 'utf8');
  console.log('Generating audio with voice en-US-AndrewMultilingualNeural...');
  execSync(`python -m edge_tts --voice en-US-AndrewMultilingualNeural --file "${scriptPath}" --write-media "${AUDIO_PATH}"`, { stdio: 'inherit' });
  if (fs.existsSync(scriptPath)) fs.unlinkSync(scriptPath);

  let audioDuration = 64.5;
  try {
    const probe = execSync(`ffmpeg -i "${AUDIO_PATH}" 2>&1`, { encoding: 'utf8' });
    const match = probe.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
    if (match) {
      audioDuration = parseFloat(match[1]) * 3600 + parseFloat(match[2]) * 60 + parseFloat(match[3]);
    }
  } catch (e) {}
  console.log(`✓ Audio ready: ${AUDIO_PATH} (${audioDuration.toFixed(2)}s)`);

  console.log('\n=== Step 2: Autonomous Ultra-HD Browser Walkthrough & Recording ===');
  if (fs.existsSync(TEMP_VIDEO_DIR)) {
    fs.rmSync(TEMP_VIDEO_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TEMP_VIDEO_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 3840, height: 2160 },
    deviceScaleFactor: 2,
    recordVideo: {
      dir: TEMP_VIDEO_DIR,
      size: { width: 3840, height: 2160 }
    }
  });

  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 });

  // Helper for buttery smooth scrolling
  async function smoothScroll(targetY, durationMs = 1200) {
    await page.evaluate(async ({ targetY, durationMs }) => {
      const startY = window.scrollY;
      const diff = targetY - startY;
      const startTime = performance.now();
      await new Promise((resolve) => {
        function step(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / durationMs, 1);
          const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
          window.scrollTo(0, startY + diff * ease);
          if (progress < 1) requestAnimationFrame(step);
          else resolve();
        }
        requestAnimationFrame(step);
      });
    }, { targetY, durationMs });
    await page.waitForTimeout(300);
  }

  const startTime = Date.now();
  const getElapsed = () => (Date.now() - startTime) / 1000;
  console.log(`[0.0s] Page loaded. Commencing choreographed walkthrough...`);

  // --- BEAT 1 (0s to 12s): Hero, Header, Presets Overview ---
  await page.waitForTimeout(3000); // Wait for initial hydration & cached auto-diagnosis
  await page.mouse.move(1920, 300);
  await page.waitForTimeout(1000);
  await page.mouse.move(2500, 320);
  await page.waitForTimeout(1000);
  await smoothScroll(400, 1500);
  console.log(`[${getElapsed().toFixed(1)}s] Beat 1 complete: Hero section highlighted.`);
  
  // Wait until ~12s
  while (getElapsed() < 12.0) {
    await page.waitForTimeout(200);
  }

  // --- BEAT 2 (12s to 27s): Switch Preset & 16-Axis Biometric Radar Chart ---
  console.log(`[${getElapsed().toFixed(1)}s] Beat 2: Clicking benchmark preset & viewing radar chart...`);
  const presetCard = page.locator('div:has-text("Marcus Vance"), div:has-text("Priya Patel"), div:has-text("Clinical Diagnostic Target")').first();
  try {
    const marcusBtn = page.locator('h4:has-text("Marcus Vance")').first();
    if (await marcusBtn.count() > 0) {
      await marcusBtn.click({ force: true });
    }
  } catch (e) {
    console.log('Preset click fallback:', e.message);
  }
  await page.waitForTimeout(2500);

  // Scroll to Radar Chart & Health Gauge
  await smoothScroll(950, 1800);
  await page.waitForTimeout(2000);
  await page.mouse.move(2400, 1100); // Hover over radar chart
  await page.waitForTimeout(2000);
  console.log(`[${getElapsed().toFixed(1)}s] Beat 2 complete: Biometric radar & composite health gauge visible.`);

  while (getElapsed() < 27.0) {
    await page.waitForTimeout(200);
  }

  // --- BEAT 3 (27s to 43s): Visual Blemish Overlays & Clinical Gatekeeper ---
  console.log(`[${getElapsed().toFixed(1)}s] Beat 3: Toggling blemish overlay markers & Gatekeeper triage...`);
  await smoothScroll(1750, 1800);
  await page.waitForTimeout(1500);

  // Toggle Acne Overlay Pill
  try {
    const acnePill = page.locator('button:has-text("Acne")').first();
    if (await acnePill.count() > 0) {
      await acnePill.click({ force: true });
      await page.waitForTimeout(1000);
      await acnePill.click({ force: true });
      await page.waitForTimeout(1000);
    }
  } catch (e) {}

  // Toggle Redness Overlay Pill
  try {
    const rednessPill = page.locator('button:has-text("Redness")').first();
    if (await rednessPill.count() > 0) {
      await rednessPill.click({ force: true });
      await page.waitForTimeout(1000);
      await rednessPill.click({ force: true });
      await page.waitForTimeout(1000);
    }
  } catch (e) {}

  // Scroll to DeepSeek Clinical Gatekeeper
  await smoothScroll(2800, 2000);
  await page.waitForTimeout(2500);
  await page.mouse.move(1920, 2200); // Hover over contraindicated ingredients
  console.log(`[${getElapsed().toFixed(1)}s] Beat 3 complete: Clinical Gatekeeper and contraindications displayed.`);

  while (getElapsed() < 43.0) {
    await page.waitForTimeout(200);
  }

  // --- BEAT 4 (43s to 55s): Headless eCommerce Cart Drawer with Biometric Discount ---
  console.log(`[${getElapsed().toFixed(1)}s] Beat 4: Opening headless eCommerce checkout drawer...`);
  await smoothScroll(3600, 1500);
  await page.waitForTimeout(1000);

  try {
    const checkoutBtn = page.locator('button:has-text("Add Full Personalized Routine to Cart"), header button:has-text("Checkout")').first();
    await checkoutBtn.click({ force: true });
    await page.waitForTimeout(2000);
  } catch (e) {
    console.log('Checkout click fallback:', e.message);
  }

  // Hover inside the cart drawer
  await page.mouse.move(2800, 1000);
  await page.waitForTimeout(2000);
  console.log(`[${getElapsed().toFixed(1)}s] Beat 4 complete: Cart drawer with itemized routine and discount visible.`);

  while (getElapsed() < 55.0) {
    await page.waitForTimeout(200);
  }

  // --- BEAT 5 (55s to 66s): "Ask DermaTwin" AI Clinical Chat Drawer & Question Pill ---
  console.log(`[${getElapsed().toFixed(1)}s] Beat 5: Opening AI Clinical Advisor chat drawer & submitting query...`);
  // Close checkout drawer with Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // Open Chat Drawer
  try {
    const chatBtn = page.locator('header button:has-text("Ask AI"), button:has-text("Ask AI Clinical Advisor")').first();
    await chatBtn.click({ force: true });
    await page.waitForTimeout(2000);

    // Click suggested question pill
    const questionPill = page.locator('div:has-text("Contextual Patient Inquiries") ~ div button, button:has-text("Why was Glycolic Acid contraindicated"), button:has-text("harsh exfoliants")').first();
    if (await questionPill.count() > 0) {
      await questionPill.click({ force: true });
      await page.waitForTimeout(3000);
    }
  } catch (e) {
    console.log('Chat click fallback:', e.message);
  }

  // Hold on chat drawer until recording duration reaches 66s
  while (getElapsed() < 66.0) {
    await page.waitForTimeout(250);
  }
  console.log(`[${getElapsed().toFixed(1)}s] Beat 5 complete: AI clinical reasoning demonstrated.`);

  // Flush video
  console.log('Flushing video stream...');
  const videoObj = page.video();
  await page.close();
  await context.close();
  const tempVideoPath = await videoObj.path();
  await browser.close();
  console.log(`Temp video written to: ${tempVideoPath}`);

  fs.copyFileSync(tempVideoPath, RAW_WALKTHROUGH_PATH);
  console.log(`✓ Video recorded successfully: ${RAW_WALKTHROUGH_PATH} (${(fs.statSync(RAW_WALKTHROUGH_PATH).size / 1024 / 1024).toFixed(2)} MB)`);

  // Clean temp dir
  if (fs.existsSync(TEMP_VIDEO_DIR)) {
    fs.rmSync(TEMP_VIDEO_DIR, { recursive: true, force: true });
  }

  // --- Step 3: FFmpeg Ultra-HD Merge ---
  console.log('\n=== Step 3: FFmpeg Ultra-HD 3840x2160 Merge ===');
  const ffmpegCmd = `ffmpeg -y -i "${RAW_WALKTHROUGH_PATH}" -i "${AUDIO_PATH}" -vf "scale=3840:2160:flags=lanczos" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -c:a aac -b:a 320k -shortest "${FINAL_VIDEO_PATH}"`;
  console.log(`Executing: ${ffmpegCmd}`);
  execSync(ffmpegCmd, { stdio: 'inherit' });

  const finalStat = fs.statSync(FINAL_VIDEO_PATH);
  console.log(`\n🎉 MASTER DEMO VIDEO GENERATION COMPLETE!`);
  console.log(`File: ${FINAL_VIDEO_PATH}`);
  console.log(`Size: ${(finalStat.size / 1024 / 1024).toFixed(2)} MB`);
}

recordUltraHD().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
