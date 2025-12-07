import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch comments for a post
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const postId = searchParams.get('post_id');

        if (!postId) {
            return NextResponse.json(
                { error: 'post_id is required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        const { data: comments, error } = await supabase
            .from('comments')
            .select(`
        *,
        profiles:user_id (
          username,
          display_name,
          avatar_url
        )
      `)
            .eq('post_id', postId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        return NextResponse.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch comments' },
            { status: 500 }
        );
    }
}

// POST - Create a new comment
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { post_id, parent_id, content } = body;

        if (!post_id || !content) {
            return NextResponse.json(
                { error: 'post_id and content are required' },
                { status: 400 }
            );
        }

        if (content.length > 1000) {
            return NextResponse.json(
                { error: 'Comment must be 1000 characters or less' },
                { status: 400 }
            );
        }

        const { data: comment, error } = await supabase
            .from('comments')
            .insert({
                post_id,
                parent_id: parent_id || null,
                content: content.trim(),
                user_id: user.id,
            })
            .select(`
        *,
        profiles:user_id (
          username,
          display_name,
          avatar_url
        )
      `)
            .single();

        if (error) throw error;

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
            { error: 'Failed to create comment' },
            { status: 500 }
        );
    }
}
