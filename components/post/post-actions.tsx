'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useState } from 'react';

interface PostActionsProps {
  postId: string;
  authorId: string;
}

export function PostActions({ postId, authorId }: PostActionsProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  // Debug logs
  console.log('[PostActions] Render', { loading, userId: user?.id, authorId });

  if (loading) return null; // Wait for auth
  if (!user || user.id !== authorId) return null; // Not authorized

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      alert('Post deleted successfully');
      router.push('/blog'); // Or /dashboard or /profile
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link href={`/editor/${postId}`}>
        <Button variant="outline" size="sm" className="gap-2">
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
      </Link>
      
      <Button 
        variant="destructive" 
        size="sm" 
        className="gap-2 bg-red-600 hover:bg-red-700 text-white"
        onClick={handleDelete}
        disabled={deleting}
      >
        <Trash2 className="w-4 h-4" />
        {deleting ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  );
}
