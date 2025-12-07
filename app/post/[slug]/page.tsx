import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { MDXContent } from '@/components/mdx/mdx-content';
import { ReadingProgress } from '@/components/post/reading-progress';
import { TableOfContents } from '@/components/post/table-of-contents';
import { CommentList } from '@/components/comments/comment-list';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const supabase = await createClient();
  
  // Fetch post by slug
  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (
        username,
        display_name,
        avatar_url,
        bio
      )
    `)
    .eq('slug', params.slug)
    .eq('published', true)
    .single();

  if (error || !post) {
    notFound();
  }

  // Increment view count
  await supabase
    .from('posts')
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq('id', post.id);

  return (
    <>
      <ReadingProgress />
      
      <div className="min-h-screen bg-[#F5F5F7] dark:bg-gray-900 pt-20">
        {/* Header */}
        <div className="border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#F29F67] transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
          </div>
        </div>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="w-full h-64 md:h-96 overflow-hidden border-b-2 border-gray-300 dark:border-gray-700">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12">
            {/* Main Content */}
            <article className="min-w-0">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#1E1E2C] dark:text-white">
                {post.title}
              </h1>

              {/* Metadata */}
              <div className="flex items-center gap-4 mb-8 pb-8 border-b-2 border-gray-300 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  {post.profiles?.avatar_url ? (
                    <img
                      src={post.profiles.avatar_url}
                      alt={post.profiles.display_name || post.profiles.username}
                      className="w-12 h-12 rounded-full border-2 border-[#F29F67]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#F29F67] flex items-center justify-center text-[#1E1E2C] font-bold text-lg border-2 border-[#F29F67]">
                      {post.profiles?.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <Link 
                      href={`/profile/${post.profiles?.username}`}
                      className="font-medium text-[#1E1E2C] dark:text-white hover:text-[#F29F67] transition-colors"
                    >
                      {post.profiles?.display_name || post.profiles?.username}
                    </Link>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        {post.published_at && formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                      </span>
                      {post.reading_time && (
                        <>
                          <span>•</span>
                          <span>{post.reading_time} min read</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{post.view_count || 0} views</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#F29F67]/10 border border-[#F29F67]/30 text-[#F29F67] text-sm rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* MDX Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
                <MDXContent content={post.content} />
              </div>

              {/* Comments Section */}
              <div className="mt-16 pt-16 border-t-2 border-gray-300 dark:border-gray-700">
                <CommentList postId={post.id} />
              </div>
            </article>

            {/* Sidebar - Table of Contents */}
            <aside className="hidden lg:block">
              <TableOfContents content={post.content} />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
