import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// DELETE - Delete a comment
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const commentId = params.id;

        // Verify ownership
        const { data: comment, error: fetchError } = await supabase
            .from('comments')
            .select('user_id')
            .eq('id', commentId)
            .single();

        if (fetchError || !comment) {
            return NextResponse.json(
                { error: 'Comment not found' },
                { status: 404 }
            );
        }

        if (comment.user_id !== user.id) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        // Delete the comment
        const { error: deleteError } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);

        if (deleteError) throw deleteError;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json(
            { error: 'Failed to delete comment' },
            { status: 500 }
        );
    }
}

// PATCH - Update a comment
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const commentId = params.id;
        const body = await request.json();
        const { content } = body;

        if (!content) {
            return NextResponse.json(
                { error: 'content is required' },
                { status: 400 }
            );
        }

        if (content.length > 1000) {
            return NextResponse.json(
                { error: 'Comment must be 1000 characters or less' },
                { status: 400 }
            );
        }

        // Verify ownership
        const { data: comment, error: fetchError } = await supabase
            .from('comments')
            .select('user_id')
            .eq('id', commentId)
            .single();

        if (fetchError || !comment) {
            return NextResponse.json(
                { error: 'Comment not found' },
                { status: 404 }
            );
        }

        if (comment.user_id !== user.id) {
            return NextResponse.json(
                { error: 'Forbidden' },
                { status: 403 }
            );
        }

        // Update the comment
        const { data: updatedComment, error: updateError } = await supabase
            .from('comments')
            .update({ content: content.trim(), updated_at: new Date().toISOString() })
            .eq('id', commentId)
            .select(`
        *,
        profiles:user_id (
          username,
          display_name,
          avatar_url
        )
      `)
            .single();

        if (updateError) throw updateError;

        return NextResponse.json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error);
        return NextResponse.json(
            { error: 'Failed to update comment' },
            { status: 500 }
        );
    }
}
