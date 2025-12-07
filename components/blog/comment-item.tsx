'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Trash2, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommentForm } from './comment-form';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface CommentItemProps {
  comment: any;
  postId: string;
  onRefresh: () => void;
  level?: number;
}

export function CommentItem({ comment, postId, onRefresh, level = 0 }: CommentItemProps) {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.id === comment.user_id;
  const hasReplies = comment.replies && comment.replies.length > 0;

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', comment.id);

      if (error) throw error;
      
      toast.success('Comment deleted');
      onRefresh();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className={`space-y-4 ${level > 0 ? 'ml-8 pl-4 border-l-2 border-gray-100 dark:border-gray-800' : ''}`}>
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {comment.profiles?.avatar_url ? (
              <img
                src={comment.profiles.avatar_url}
                alt={comment.profiles.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              (comment.profiles?.username || '?').charAt(0).toUpperCase()
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">
                {comment.profiles?.display_name || comment.profiles?.username || 'Unknown User'}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            {isOwner && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-red-500"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>

          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {comment.content}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-muted-foreground hover:text-foreground text-xs"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="w-3 h-3 mr-1" />
              Reply
            </Button>
          </div>

          {isReplying && (
            <div className="mt-4">
              <CommentForm
                postId={postId}
                parentId={comment.id}
                onCommentAdded={() => {
                  setIsReplying(false);
                  onRefresh();
                }}
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {hasReplies && (
        <div className="space-y-4">
          {comment.replies.map((reply: any) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              onRefresh={onRefresh}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
