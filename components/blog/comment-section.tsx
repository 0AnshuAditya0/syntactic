'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { CommentForm } from './comment-form';
import { CommentItem } from './comment-item';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            id,
            username,
            display_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Organize into tree structure
      const commentTree = buildCommentTree(data || []);
      setComments(commentTree);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  }

  function buildCommentTree(flatComments: any[]) {
    const commentMap = new Map();
    const roots: any[] = [];

    // Initialize map
    flatComments.forEach(comment => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    // Build tree
    flatComments.forEach(comment => {
      if (comment.parent_id) {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies.push(comment);
        } else {
          // Orphaned comment (parent deleted?), treat as root
          roots.push(comment);
        }
      } else {
        roots.push(comment);
      }
    });

    return roots;
  }

  return (
    <div className="space-y-8" id="comments">
      <div className="flex items-center gap-2 text-xl font-semibold">
        <MessageCircle className="w-6 h-6" />
        <h2>Comments</h2>
      </div>

      {user ? (
        <CommentForm postId={postId} onCommentAdded={fetchComments} />
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg text-center">
          <p className="text-muted-foreground mb-4">Log in to join the discussion</p>
          <Link href="/auth/login">
            <Button>Log In</Button>
          </Link>
        </div>
      )}

      <div className="space-y-8">
        {loading ? (
          <div className="text-center text-muted-foreground">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              onRefresh={fetchComments}
            />
          ))
        )}
      </div>
    </div>
  );
}
