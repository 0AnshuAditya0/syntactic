'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onCommentAdded: () => void;
  onCancel?: () => void;
}

export function CommentForm({ postId, parentId, onCommentAdded, onCancel }: CommentFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    if (!content.trim()) return;

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          parent_id: parentId || null,
          content: content.trim(),
        });

      if (error) throw error;

      setContent('');
      onCommentAdded();
      if (onCancel) onCancel();
      toast.success('Comment posted!');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "Write a reply..." : "Write a comment..."}
        className="min-h-[100px] resize-y"
      />
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={submitting || !content.trim()}>
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Post
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
