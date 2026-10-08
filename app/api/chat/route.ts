import { NextRequest, NextResponse } from 'next/server';
import { chatWithDermaTwinAgent } from '@/lib/nebius';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, biometrics, formulation } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Missing or invalid messages array' },
        { status: 400 }
      );
    }

    const reply = await chatWithDermaTwinAgent(messages, biometrics, formulation);

    return NextResponse.json({
      success: true,
      message: reply
    });
  } catch (error) {
    console.error('[API /chat] Error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Chat consultation failed' },
      { status: 500 }
    );
  }
}
