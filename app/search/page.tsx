import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Search } from 'lucide-react';

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

interface SearchPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  published_at?: string;
  profiles?: {
    username?: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const supabase = await createClient();

  let posts: SearchPost[] = [];
  
  if (query) {
    const { data } = await supabase.rpc('search_posts', { search_query: query });
    
    // Fetch author details for the results (since RPC returns raw posts)
    if (data && data.length > 0) {
      const postIds = data.map((p: { id: string }) => p.id);
      const { data: postsWithAuthors } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            username,
            display_name,
            avatar_url
          )
        `)
        .in('id', postIds)
        .eq('published', true);
        
      if (postsWithAuthors) {
        posts = postsWithAuthors as unknown as SearchPost[];
      }
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-muted-foreground">
            {query ? `Showing results for "${query}"` : 'Enter a search term to find posts'}
          </p>
        </div>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12 border rounded-lg border-dashed border-gray-200 dark:border-gray-800">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No posts found matching your query</p>
            </div>
          ) : (
            posts.map((post) => (
              <Link 
                key={post.id} 
                href={`/post/${post.slug}`}
                className="block p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-500 transition-colors bg-white dark:bg-gray-950"
              >
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {post.profiles?.avatar_url && (
                      <img src={post.profiles.avatar_url} className="w-5 h-5 rounded-full" alt="" />
                    )}
                    <span>{post.profiles?.display_name || post.profiles?.username}</span>
                  </div>
                  {post.published_at && (
                    <span>{formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}</span>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
