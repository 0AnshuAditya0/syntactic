'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface LikeButtonProps {
  postId: string;
  initialLikes?: number;
}

export function LikeButton({ postId, initialLikes = 0 }: LikeButtonProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfLiked();
    }
    fetchLikesCount();
  }, [postId, user]);

  async function checkIfLiked() {
    if (!user) return;
    
    const { data } = await supabase
      .from('post_likes')
      .select('user_id')
      .eq('post_id', postId)
      .eq('user_id', user.id)
      .single();
      
    setLiked(!!data);
  }

  async function fetchLikesCount() {
    const { count } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);
      
    setLikesCount(count || 0);
  }

  async function handleToggleLike() {
    if (!user) {
      toast.error('Please login to like posts');
      return;
    }

    if (loading) return;
    setLoading(true);

    // Optimistic update
    const previousLiked = liked;
    const previousCount = likesCount;
    
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);

    try {
      if (previousLiked) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
          
        if (error) throw error;
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.id });
          
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setLiked(previousLiked);
      setLikesCount(previousCount);
      toast.error('Failed to update like');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleLike}
      disabled={loading}
      className={cn(
        "group flex items-center gap-2 transition-colors",
        liked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-red-500"
      )}
    >
      <Heart className={cn("w-5 h-5 transition-all", liked && "fill-current scale-110")} />
      <span className="font-medium">{likesCount}</span>
    </Button>
  );
}
