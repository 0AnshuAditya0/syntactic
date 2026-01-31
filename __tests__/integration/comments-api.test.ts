import { GET } from '@/app/api/comments/route';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@/lib/supabase/server', () => ({
    createClient: jest.fn(() => ({
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(() => ({
                    order: jest.fn().mockResolvedValue({
                        data: [
                            { id: 1, content: 'Test Comment', profiles: { username: 'testuser' } }
                        ],
                        error: null
                    }),
                })),
                single: jest.fn(),
            })),
            insert: jest.fn(),
        })),
        auth: {
            getUser: jest.fn(),
        }
    })),
}));

describe('API Route: /api/comments', () => {
    it('should fetch comments for a post', async () => {
        const req = new NextRequest('http://localhost:3000/api/comments?post_id=123');
        const response = await GET(req);

        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.length).toBe(1);
        expect(data[0].content).toBe('Test Comment');
    });

    it('should return 400 if post_id is missing', async () => {
        const req = new NextRequest('http://localhost:3000/api/comments');
        const response = await GET(req);
        expect(response.status).toBe(400);
    });
});
