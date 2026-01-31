import { checkRateLimit } from '@/lib/playground/rate-limiter';

describe('Rate Limiter', () => {
    // Mock Date.now to control time
    const originalDateNow = Date.now;

    beforeEach(() => {
        // Reset time to 0 for consistent testing
        Date.now = jest.fn(() => 0);
    });

    afterAll(() => {
        Date.now = originalDateNow;
    });

    it('should allow first request', () => {
        const result = checkRateLimit('user-1');
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(9);
    });

    it('should decrease remaining count on subsequent requests', () => {
        checkRateLimit('user-2');
        const result = checkRateLimit('user-2');
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(8);
    });

    it('should block requests after limit is reached', () => {
        const userId = 'user-limit';
        // Consume 10 requests
        for (let i = 0; i < 10; i++) {
            checkRateLimit(userId);
        }

        const result = checkRateLimit(userId);
        expect(result.allowed).toBe(false);
        expect(result.remaining).toBe(0);
        expect(result.resetIn).toBeGreaterThan(0);
    });

    it('should reset after window expires', () => {
        const userId = 'user-reset';
        checkRateLimit(userId); // 1 request at time 0

        // Advance time by 61 seconds (61000ms)
        Date.now = jest.fn(() => 61000);

        const result = checkRateLimit(userId);
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(9); // New window, first request counts as 1
    });
});
