import { NextRequest, NextResponse } from 'next/server';
import { formulateClinicalRegimen } from '@/lib/nebius';
import { SkinAnalysisResult } from '@/types/dermatwin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const biometrics: SkinAnalysisResult = body.biometrics;

    if (!biometrics || !biometrics.metrics) {
      return NextResponse.json(
        { error: 'Missing or invalid biometric skin profile data' },
        { status: 400 }
      );
    }

    const formulation = await formulateClinicalRegimen(biometrics);

    return NextResponse.json({
      success: true,
      formulation
    });
  } catch (error) {
    console.error('[API /agent-formulate] Error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to generate clinical formulation' },
      { status: 500 }
    );
  }
}
