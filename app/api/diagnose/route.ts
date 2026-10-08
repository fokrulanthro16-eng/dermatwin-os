import { NextRequest, NextResponse } from 'next/server';
import { analyzeSkinBiometrics } from '@/lib/youcam';
import { formulateClinicalRegimen } from '@/lib/nebius';
import { getCachedFormulation, setCachedFormulation } from '@/lib/cache';
import { DiagnoseResponse } from '@/types/dermatwin';

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { imageUrl, presetId, fileId } = body;

    if (!imageUrl && !fileId) {
      return NextResponse.json(
        { error: 'Missing required field: imageUrl or fileId', success: false },
        { status: 400 }
      );
    }

    console.log(`[API /diagnose] Initiating diagnosis for image (${imageUrl ? imageUrl.slice(0, 60) : fileId})...`);

    // Step 1: Run 16-action YouCam biometric pipeline with unit conservation cache
    const biometrics = await analyzeSkinBiometrics(imageUrl, presetId, fileId);

    // Step 2: Run Nebius DeepSeek-V4.1-Flash autonomous formulation pipeline (with preset cache)
    const cacheKey = presetId || imageUrl || fileId || '';
    let formulation = getCachedFormulation(cacheKey);
    if (!formulation) {
      formulation = await formulateClinicalRegimen(biometrics);
      setCachedFormulation(cacheKey, formulation);
    }

    const executionTimeMs = Date.now() - startTime;
    console.log(`[API /diagnose] Full workflow executed in ${executionTimeMs}ms`);

    const responseData: DiagnoseResponse = {
      success: true,
      biometrics,
      formulation,
      executionTimeMs
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('[API /diagnose] Critical pipeline failure:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Encountered unexpected clinical pipeline error',
        executionTimeMs: Date.now() - startTime
      },
      { status: 500 }
    );
  }
}
