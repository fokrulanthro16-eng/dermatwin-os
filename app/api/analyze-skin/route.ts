import { NextRequest, NextResponse } from 'next/server';
import { analyzeSkinBiometrics } from '@/lib/youcam';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl, presetId, fileId } = body;

    if (!imageUrl && !fileId) {
      return NextResponse.json(
        { error: 'Missing required field: imageUrl or fileId' },
        { status: 400 }
      );
    }

    const biometrics = await analyzeSkinBiometrics(imageUrl, presetId, fileId);

    return NextResponse.json({
      success: true,
      biometrics
    });
  } catch (error) {
    console.error('[API /analyze-skin] Error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to analyze biometric skin data' },
      { status: 500 }
    );
  }
}
