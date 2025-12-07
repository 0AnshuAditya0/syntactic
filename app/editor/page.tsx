'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function NewPostPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      createNewDraft();
    } else if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading]);

  async function createNewDraft() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title: 'Untitled Post',
          content: '',
          author_id: user!.id,
          slug: `untitled-${Date.now()}`, // Temporary slug
          published: false,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        router.replace(`/editor/${data.id}`);
      }
    } catch (error) {
      console.error('Error creating draft:', error);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center pt-16 bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#F29F67]" />
        <p className="text-gray-600 dark:text-gray-400">Creating new draft...</p>
      </div>
    </div>
  );
}
