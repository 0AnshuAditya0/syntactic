import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { executePiston } from '@/lib/playground/piston-executor';
import { checkRateLimit } from '@/lib/playground/rate-limiter';

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Get user ID (or IP for anonymous)
        const userId = user?.id || request.ip || 'anonymous';

        // Check rate limit
        const rateLimit = checkRateLimit(userId);
        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded. Please wait before running more code.',
                    resetIn: Math.ceil(rateLimit.resetIn / 1000),
                },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { code, language } = body;

        // Validate input
        if (!code || typeof code !== 'string') {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        if (code.length > 100 * 1024) {
            return NextResponse.json({ error: 'Code exceeds 100KB limit' }, { status: 400 });
        }

        if (!['python', 'java', 'cpp', 'c'].includes(language)) {
            return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
        }

        // Execute code via Piston
        const result = await executePiston(code, language as 'python' | 'java' | 'cpp' | 'c');

        // Log execution (optional)
        if (user) {
            await supabase.from('code_executions').insert({
                user_id: user.id,
                language,
                exit_code: result.success ? 0 : 1,
                execution_time_ms: result.executionTime,
                error_message: result.error,
            });
        }

        return NextResponse.json({
            ...result,
            remaining: rateLimit.remaining,
        });
    } catch (error: unknown) {
        console.error('Execution error:', error);
        return NextResponse.json(
            { error: 'Failed to execute code', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
