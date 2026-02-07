import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col ${
                  index === 0 ? 'md:col-span-2 md:flex-row md:items-start md:gap-8' : ''
                }`}
              >
                {post.cover_image && (
                  <Link 
                    href={`/post/${post.slug}`} 
                    className={`block relative overflow-hidden group ${
                      index === 0 ? 'w-full md:w-1/2 h-64 md:h-96' : 'w-full h-56'
                    }`}
                  >
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                )}
                
                <div className={`p-6 flex flex-col flex-1 ${index === 0 ? 'md:h-full md:justify-center md:py-8 md:pr-8' : ''}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Link href={`/profile/${post.profiles?.username}`} className="shrink-0 group relative">
                        {post.profiles?.avatar_url ? (
                        <Image
                            src={post.profiles.avatar_url}
                            alt={post.profiles.display_name || post.profiles.username || 'User'}
                            width={index === 0 ? 40 : 32}
                            height={index === 0 ? 40 : 32}
                            className="rounded-full ring-2 ring-gray-100 dark:ring-gray-700 transition-transform group-hover:scale-105"
                        />
                        ) : (
                        <div className={`rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold transition-transform group-hover:scale-105 ${
                            index === 0 ? 'w-10 h-10 text-sm' : 'w-8 h-8 text-xs'
                        }`}>
                            {post.profiles?.username?.charAt(0).toUpperCase()}
                        </div>
                        )}
                    </Link>
                    <div className="flex flex-col">
                      <Link 
                        href={`/profile/${post.profiles?.username}`}
                        className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-none hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {post.profiles?.display_name || post.profiles?.username}
                      </Link>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {post.published_at && formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>

                  <Link href={`/post/${post.slug}`} className="group">
                    <h2 className={`font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                      index === 0 ? 'text-3xl md:text-4xl' : 'text-xl'
                    }`}>
                      {post.title}
                    </h2>
                  </Link>

                  {post.excerpt && (
                    <p className={`text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 ${
                      index === 0 ? 'text-lg' : 'text-sm'
                    }`}>
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
                    <div className="flex flex-wrap gap-2">
                       {post.tags && post.tags.slice(0, 2).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-md font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {post.reading_time ? `${post.reading_time} min read` : ''}
                    </div>
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
