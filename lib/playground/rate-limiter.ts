interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimits = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10;

export function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const entry = rateLimits.get(userId);

    if (!entry || now > entry.resetTime) {
        // New window
        rateLimits.set(userId, {
            count: 1,
            resetTime: now + WINDOW_MS,
        });

        return {
            allowed: true,
            remaining: MAX_REQUESTS - 1,
            resetIn: WINDOW_MS,
        };
    }

    if (entry.count >= MAX_REQUESTS) {
        return {
            allowed: false,
            remaining: 0,
            resetIn: entry.resetTime - now,
        };
    }

    entry.count++;

    return {
        allowed: true,
        remaining: MAX_REQUESTS - entry.count,
        resetIn: entry.resetTime - now,
    };
}

// Clean up old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [userId, entry] of rateLimits.entries()) {
        if (now > entry.resetTime) {
            rateLimits.delete(userId);
        }
    }
}, WINDOW_MS);
