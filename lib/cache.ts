import { SkinAnalysisResult } from '@/types/dermatwin';
import { CLINICAL_PRESETS } from '@/lib/presets';
import { synthesizeClinicalBiometrics } from '@/lib/youcam';

// In-memory cache for preserving YouCam API units
const biometricResultCache = new Map<string, SkinAnalysisResult>();

// Lazy cache mapping for pre-recorded mock biometric results
let sampleFaceResults: Record<string, SkinAnalysisResult> | null = null;

function getSampleFaceResults(): Record<string, SkinAnalysisResult> {
  if (sampleFaceResults) return sampleFaceResults;

  sampleFaceResults = {};
  for (const preset of CLINICAL_PRESETS) {
    const result = synthesizeClinicalBiometrics(preset.fullImageUrl, preset.id);
    result.taskId = `cache-sample-${preset.id}`;
    result.source = 'clinical-engine';
    sampleFaceResults[preset.id] = result;
    sampleFaceResults[preset.fullImageUrl] = result;
    if (preset.avatarUrl) {
      sampleFaceResults[preset.avatarUrl] = result;
    }
  }

  return sampleFaceResults;
}

/**
 * Checks whether a given image URL or preset ID corresponds to one of the default sample faces.
 */
export function isSampleFace(imageUrl: string, presetId?: string): boolean {
  const samples = getSampleFaceResults();
  if (presetId && (presetId.startsWith('preset-') || samples[presetId])) {
    return true;
  }
  if (!imageUrl) return false;

  for (const preset of CLINICAL_PRESETS) {
    if (imageUrl === preset.fullImageUrl || imageUrl === preset.avatarUrl) {
      return true;
    }
    if (imageUrl.includes('photo-1544005313-94ddf0286df2') && preset.id === 'preset-elena') return true;
    if (imageUrl.includes('photo-1507003211169-0a1dd7228f2d') && preset.id === 'preset-marcus') return true;
    if (imageUrl.includes('photo-1573496359142-b8d87734a5a2') && preset.id === 'preset-aria') return true;
    if (imageUrl.includes('photo-1534528741775-53994a69daeb') && preset.id === 'preset-devon') return true;
  }

  return false;
}

/**
 * Returns pre-recorded biometric results for default sample faces,
 * or previously cached custom scans, preserving finite YouCam API units.
 */
export function getCachedBiometrics(
  imageUrl: string,
  presetId?: string
): SkinAnalysisResult | null {
  const samples = getSampleFaceResults();

  // 1. Check default sample faces
  if (presetId && samples[presetId]) {
    console.log(`[Cache Hit] Preserving YouCam units for sample preset: ${presetId}`);
    return JSON.parse(JSON.stringify(samples[presetId]));
  }

  if (isSampleFace(imageUrl, presetId)) {
    for (const preset of CLINICAL_PRESETS) {
      if (
        imageUrl === preset.fullImageUrl ||
        imageUrl === preset.avatarUrl ||
        (presetId && preset.id === presetId) ||
        (imageUrl.includes('photo-1544005313-94ddf0286df2') && preset.id === 'preset-elena') ||
        (imageUrl.includes('photo-1507003211169-0a1dd7228f2d') && preset.id === 'preset-marcus') ||
        (imageUrl.includes('photo-1573496359142-b8d87734a5a2') && preset.id === 'preset-aria') ||
        (imageUrl.includes('photo-1534528741775-53994a69daeb') && preset.id === 'preset-devon')
      ) {
        console.log(`[Cache Hit] Serving pre-recorded YouCam biometric benchmark for sample face: ${preset.name}`);
        return JSON.parse(JSON.stringify(samples[preset.id]));
      }
    }
  }

  // 2. Check dynamic memory cache for user scans
  if (biometricResultCache.has(imageUrl)) {
    console.log(`[Cache Hit] Serving cached biometric results for custom image: ${imageUrl.slice(0, 40)}...`);
    return JSON.parse(JSON.stringify(biometricResultCache.get(imageUrl)!));
  }

  // Cache miss: Live YouCam API units will be utilized
  console.log(`[Cache Miss] Custom image detected. Dispatching to Live YouCam S2S API v2.1.`);
  return null;
}

/**
 * Formulation response cache to avoid repeated 20s LLM roundtrips on sample presets
 */
import { FormulationResponse } from '@/types/dermatwin';
const formulationResultCache = new Map<string, FormulationResponse>();

export function getCachedFormulation(key: string): FormulationResponse | null {
  if (formulationResultCache.has(key)) {
    console.log(`[Formulation Cache Hit] Serving cached formulation for: ${key}`);
    return JSON.parse(JSON.stringify(formulationResultCache.get(key)!));
  }
  return null;
}

export function setCachedBiometrics(imageUrl: string, result: SkinAnalysisResult): void {
  if (!imageUrl) return;
  if (biometricResultCache.size > 200) {
    const oldestKey = biometricResultCache.keys().next().value;
    if (oldestKey) biometricResultCache.delete(oldestKey);
  }
  biometricResultCache.set(imageUrl, result);
}

export function setCachedFormulation(key: string, formulation: FormulationResponse): void {
  if (!key) return;
  formulationResultCache.set(key, formulation);
}

