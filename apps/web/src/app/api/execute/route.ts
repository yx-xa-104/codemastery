import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, number[]>();

const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute in ms

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    // Rate limiting check
    const now = Date.now();
    const userRequests = rateLimitMap.get(ip) || [];
    const recentRequests = userRequests.filter(
      (time) => now - time < RATE_WINDOW
    );

    if (recentRequests.length >= RATE_LIMIT) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before running code again.' },
        { status: 429 }
      );
    }

    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);

    // Parse request body
    const body = await request.json();
    const { code, language } = body;

    // Validate input
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Code is required' },
        { status: 400 }
      );
    }

    if (code.length > 10000) {
      return NextResponse.json(
        { error: 'Code is too long (max 10KB)' },
        { status: 400 }
      );
    }

    const supportedLanguages = ['javascript', 'python', 'java', 'cpp'];
    if (!supportedLanguages.includes(language)) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    // Forward to backend execution service
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    const response = await fetch(`${backendUrl}/api/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
      signal: AbortSignal.timeout(15000), // 15s timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend execution failed: ${response.statusText}`);
    }

    const result = await response.json();

    return NextResponse.json({
      output: result.stdout || result.output || '',
      error: result.stderr || result.error || null,
    });
  } catch (error) {
    console.error('Code execution error:', error);

    return NextResponse.json(
      {
        error: 'Failed to execute code. Please try again.',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : String(error))
          : undefined,
      },
      { status: 500 }
    );
  }
}
