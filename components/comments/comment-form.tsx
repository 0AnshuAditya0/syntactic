'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onCommentAdded: () => void;
  onCancel?: () => void;
  placeholder?: string;
}

export function CommentForm({ postId, parentId, onCommentAdded, onCancel, placeholder = "Write a comment..." }: CommentFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post_id: postId,
          parent_id: parentId,
          content: content.trim(),
        }),
      });

      if (!response.ok) throw new Error('Failed to post comment');

      setContent('');
      onCommentAdded();
      if (onCancel) onCancel();
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-6 bg-[#F5F5F7] dark:bg-gray-800 rounded-xl border-2 border-gray-300 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400 mb-3">Sign in to join the conversation</p>
        <a href="/auth/login">
          <Button size="sm" className="bg-[#F29F67] hover:bg-[#E08D55] text-[#1E1E2C]">
            Sign In
          </Button>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[100px] p-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-[#1E1E2C] dark:text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F29F67] resize-none"
        disabled={isSubmitting}
      />
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          {content.length} / 1000 characters
        </span>
        <div className="flex gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || isSubmitting || content.length > 1000}
            className="bg-[#F29F67] hover:bg-[#E08D55] text-[#1E1E2C]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              parentId ? 'Reply' : 'Comment'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
