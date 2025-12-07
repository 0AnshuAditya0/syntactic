'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { CommentForm } from './comment-form';
import { CommentItem } from './comment-item';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  parent_id: string | null;
  profiles: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
  replies?: Comment[];
}

interface CommentListProps {
  postId: string;
}

export function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments?post_id=${postId}`);
      
      if (!response.ok) throw new Error('Failed to fetch comments');
      
      const data = await response.json();
      
      // Organize comments into threads
      const commentMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];
      
      // First pass: create map of all comments
      data.forEach((comment: Comment) => {
        commentMap.set(comment.id, { ...comment, replies: [] });
      });
      
      // Second pass: organize into threads
      data.forEach((comment: Comment) => {
        const commentWithReplies = commentMap.get(comment.id)!;
        
        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push(commentWithReplies);
          }
        } else {
          rootComments.push(commentWithReplies);
        }
      });
      
      setComments(rootComments);
      setError(null);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const renderComment = (comment: Comment, depth = 0) => (
    <div key={comment.id} className="space-y-4">
      <CommentItem
        comment={comment}
        onUpdate={fetchComments}
        onDelete={fetchComments}
        depth={depth}
      />
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-4">
          {comment.replies.map((reply) => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#F29F67]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={fetchComments}
          className="mt-4 text-[#F29F67] hover:text-[#E08D55] font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-[#F29F67]" />
        <h3 className="text-2xl font-bold text-[#1E1E2C] dark:text-white">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <CommentForm postId={postId} onCommentAdded={fetchComments} />

      {/* Comments */}
      {comments.length === 0 ? (
        <div className="text-center py-12 bg-[#F5F5F7] dark:bg-gray-800 rounded-2xl border-2 border-gray-300 dark:border-gray-700">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 dark:text-gray-400">No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
}
