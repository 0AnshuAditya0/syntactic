import { POST } from '@/app/api/playground/execute/route';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@/lib/supabase/server', () => ({
    createClient: jest.fn(() => ({
        auth: {
            getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
        },
        from: jest.fn(() => ({
            insert: jest.fn().mockResolvedValue({}),
        })),
    })),
}));

jest.mock('@/lib/playground/piston-executor', () => ({
    executePiston: jest.fn().mockResolvedValue({
        success: true,
        output: 'Hello World',
        executionTime: 100,
    }),
}));

describe('API Route: /api/playground/execute', () => {
    it('should execute code successfully', async () => {
        const req = new NextRequest('http://localhost:3000/api/playground/execute', {
            method: 'POST',
            body: JSON.stringify({
                code: 'print("Hello World")',
                language: 'python',
            }),
        });

        const response = await POST(req);
        expect(response.status).toBe(200);

        const data = await response.json();
        expect(data.output).toBe('Hello World');
        expect(data.success).toBe(true);
    });

    it('should return 400 for invalid language', async () => {
        const req = new NextRequest('http://localhost:3000/api/playground/execute', {
            method: 'POST',
            body: JSON.stringify({
                code: 'print("Hello")',
                language: 'invalid-lang',
            }),
        });

        const response = await POST(req);
        expect(response.status).toBe(400);
    });

    it('should return 400 if code is missing', async () => {
        const req = new NextRequest('http://localhost:3000/api/playground/execute', {
            method: 'POST',
            body: JSON.stringify({
                language: 'python',
            }),
        });

        const response = await POST(req);
        expect(response.status).toBe(400);
    });
});
