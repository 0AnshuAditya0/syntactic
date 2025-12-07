'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Trash2, Edit2, MoreVertical } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { CommentForm } from './comment-form';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    display_name?: string;
    avatar_url?: string;
  };
}

interface CommentItemProps {
  comment: Comment;
  onReply?: () => void;
  onDelete?: (id: string) => void;
  onUpdate?: () => void;
  depth?: number;
}

export function CommentItem({ comment, onReply, onDelete, onUpdate, depth = 0 }: CommentItemProps) {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const isOwner = user?.id === comment.user_id;
  const maxDepth = 3;

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete comment');
      
      if (onDelete) onDelete(comment.id);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  return (
    <div className={`${depth > 0 ? 'ml-8 md:ml-12' : ''}`}>
      <div className="flex gap-3 group">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {comment.profiles.avatar_url ? (
            <img
              src={comment.profiles.avatar_url}
              alt={comment.profiles.username}
              className="w-10 h-10 rounded-full border-2 border-[#F29F67]"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#F29F67] flex items-center justify-center border-2 border-[#F29F67]">
              <span className="text-[#1E1E2C] text-sm font-bold">
                {comment.profiles.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-[#F5F5F7] dark:bg-gray-800 rounded-2xl p-4 border-2 border-gray-300 dark:border-gray-700">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-semibold text-[#1E1E2C] dark:text-white">
                  {comment.profiles.display_name || comment.profiles.username}
                </span>
                <span className="text-sm text-gray-500 ml-2">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>
              
              {isOwner && (
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  
                  {showMenu && (
                    <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-gray-300 dark:border-gray-700 z-10">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 rounded-t-lg"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDelete();
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 rounded-b-lg"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>

          {/* Actions */}
          {depth < maxDepth && (
            <div className="mt-2 flex items-center gap-4">
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#F29F67] dark:hover:text-[#F29F67] flex items-center gap-1 font-medium"
              >
                <MessageCircle className="w-4 h-4" />
                Reply
              </button>
            </div>
          )}

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-4">
              <CommentForm
                postId={comment.id}
                parentId={comment.id}
                onCommentAdded={() => {
                  setShowReplyForm(false);
                  if (onUpdate) onUpdate();
                }}
                onCancel={() => setShowReplyForm(false)}
                placeholder="Write a reply..."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
