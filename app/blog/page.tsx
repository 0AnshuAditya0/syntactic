import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  cover_image?: string;
  published_at?: string;
  reading_time?: number;
  view_count?: number;
  tags?: string[];
  profiles?: {
    username?: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export default async function BlogPage() {
  const supabase = await createClient();
  
  // Fetch published posts
  const { data: rawPosts, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (
        username,
        display_name,
        avatar_url
      )
    `)
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(20);

  const posts = rawPosts as unknown as BlogPost[];

  if (error) {
    console.error('Error fetching posts:', error);
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[#1E1E2C] dark:text-white">Blog</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore tutorials, guides, and insights from the Syntactic community
          </p>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No published posts yet.</p>
            <Link href="/editor" className="text-[#F29F67] hover:text-[#E08D55] hover:underline mt-4 inline-block font-medium">
              Create your first post →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 border-2 border-gray-300 dark:border-gray-700"
              >
                {post.cover_image && (
                  <Link href={`/post/${post.slug}`}>
                    <div className="relative w-full h-48 mb-4">
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover rounded-xl border-2 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                  </Link>
                )}
                
                <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
                  {post.profiles?.avatar_url ? (
                    <Image
                      src={post.profiles.avatar_url}
                      alt={post.profiles.display_name || post.profiles.username || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-[#F29F67]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#F29F67] flex items-center justify-center text-[#1E1E2C] font-bold border-2 border-[#F29F67]">
                      {post.profiles?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-[#1E1E2C] dark:text-white">
                      {post.profiles?.display_name || post.profiles?.username}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {post.published_at && formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <Link href={`/post/${post.slug}`}>
                  <h2 className="text-2xl font-bold mb-3 text-[#1E1E2C] dark:text-white hover:text-[#F29F67] transition-colors">
                    {post.title}
                  </h2>
                </Link>

                {post.excerpt && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2">
                    {post.tags && post.tags.slice(0, 3).map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[#F29F67]/10 border border-[#F29F67]/30 text-[#F29F67] text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {post.reading_time && (
                      <span>{post.reading_time} min read</span>
                    )}
                    <span>{post.view_count || 0} views</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
