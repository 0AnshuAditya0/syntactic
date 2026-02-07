import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DiagnosticPage() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  // Try to fetch ALL posts (bypassing published filter temporarily)
  const { data: allPosts, error: allError } = await supabase
    .from('posts')
    .select('id, title, published, published_at, author_id, created_at')
    .order('created_at', { ascending: false })
    .limit(10);
  
  // Try to fetch only published posts
  const { data: publishedPosts, error: pubError } = await supabase
    .from('posts')
    .select('id, title, published, published_at, author_id')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(10);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Diagnostic</h1>
        
        <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h2 className="text-xl font-semibold mb-2">Current User</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify({ userId: user?.id, email: user?.email }, null, 2)}
          </pre>
        </div>

        <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h2 className="text-xl font-semibold mb-2">All Posts Query (Recent 10)</h2>
          {allError && (
            <div className="text-red-600 mb-2">Error: {allError.message}</div>
          )}
          <pre className="text-sm overflow-auto max-h-96">
            {JSON.stringify(allPosts, null, 2)}
          </pre>
        </div>

        <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h2 className="text-xl font-semibold mb-2">Published Posts Query</h2>
          {pubError && (
            <div className="text-red-600 mb-2">Error: {pubError.message}</div>
          )}
          <pre className="text-sm overflow-auto max-h-96">
            {JSON.stringify(publishedPosts, null, 2)}
          </pre>
          <div className="mt-4 text-sm">
            <strong>Count:</strong> {publishedPosts?.length || 0}
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded">
          <h3 className="font-semibold mb-2">What to check:</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Do posts exist in "All Posts"?</li>
            <li>Are any posts showing `published: true`?</li>
            <li>Do published posts have a `published_at` timestamp?</li>
            <li>Does "Published Posts Query" return any results?</li>
            <li>Are there any error messages?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
