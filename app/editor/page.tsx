'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { Loader2, AlertCircle } from 'lucide-react';

export default function NewPostPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [error, setError] = useState<string>('');

  const creatingRef = useRef(false);

  useEffect(() => {
    // Immediate redirect to new editor - "Lazy Creation" pattern
    // We don't create the DB record until the user actually writes something.
    router.replace('/editor/new');
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center pt-16 bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4 max-w-md">
        {error ? (
          <>
            <AlertCircle className="w-12 h-12 text-red-500" />
            <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
            <button
              onClick={() => router.push('/blog')}
              className="px-4 py-2 bg-[#F29F67] text-white rounded-lg hover:bg-[#e08f57] transition-colors"
            >
              Go to Blog
            </button>
          </>
        ) : (
          <>
            <Loader2 className="w-8 h-8 animate-spin text-[#F29F67]" />
            <p className="text-gray-600 dark:text-gray-400">Creating new draft...</p>
          </>
        )}
      </div>
    </div>
  );
}
