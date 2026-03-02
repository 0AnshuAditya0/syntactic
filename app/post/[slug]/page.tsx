import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { MDXContent } from '@/components/mdx/mdx-content';
import { ReadingProgress } from '@/components/post/reading-progress';
import { TableOfContents } from '@/components/post/table-of-contents';
import { CommentList } from '@/components/comments/comment-list';
import { PostActions } from '@/components/post/post-actions';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const supabase = await createClient();

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
      {/* Reading progress bar */}
      <ReadingProgress />

      <div className="min-h-screen bg-[#F8F6F6] pt-20">

        <main className="max-w-4xl mx-auto px-6 py-12">

          {/* ── Article Header ── */}
          <header className="mb-12">

            {/* Back to Feed */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#F29F67] font-bold text-sm uppercase tracking-wide hover:opacity-75 transition-opacity mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              Back to Feed
            </Link>

            {/* Tag + date + reading time row */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {post.tags && post.tags[0] && (
                <span className="px-3 py-1 bg-[#F29F67]/10 text-[#F29F67] text-xs font-bold uppercase tracking-wider rounded-full">
                  {post.tags[0]}
                </span>
              )}
              <span className="text-gray-500 text-sm">
                {post.published_at &&
                  formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                {post.reading_time && ` • ${post.reading_time} min read`}
                {` • ${post.view_count || 0} views`}
              </span>

              {/* Actions pushed to the right */}
              <div className="ml-auto">
                <PostActions postId={post.id} authorId={post.author_id} />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-[#1E1E2C] mb-8">
              {post.title}
            </h1>

            {/* Author block */}
            <div className="flex items-center gap-4 mb-10">
              <Link href={`/profile/${post.profiles?.username}`} className="group shrink-0">
                {post.profiles?.avatar_url ? (
                  <Image
                    src={post.profiles.avatar_url}
                    alt={post.profiles.display_name || post.profiles.username || 'Author'}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-[#F29F67]/40 transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#F29F67]/10 flex items-center justify-center text-[#F29F67] font-bold text-lg border-2 border-[#F29F67]/20">
                    {post.profiles?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
              <div>
                <Link
                  href={`/profile/${post.profiles?.username}`}
                  className="font-bold text-[#1E1E2C] hover:text-[#F29F67] transition-colors"
                >
                  {post.profiles?.display_name || post.profiles?.username}
                </Link>
                {post.profiles?.bio && (
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{post.profiles.bio}</p>
                )}
              </div>
            </div>

            {/* Hero Cover Image */}
            {post.cover_image && (
              <div className="w-full aspect-video rounded-xl overflow-hidden mb-4">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  width={1200}
                  height={630}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
            )}
          </header>

          {/* ── Article Body ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12 items-start">
            <article>
              {/* Excerpt / description */}
              {post.excerpt && (
                <div
                  id="post-excerpt-content"
                  className="mb-10 px-5 py-4 rounded-lg border-l-4 border-[#F29F67] bg-white dark:bg-gray-800 shadow-sm"
                >
                  <p className="text-[#1E1E2C] dark:text-gray-100 text-lg font-semibold leading-relaxed m-0">
                    {post.excerpt}
                  </p>
                </div>
              )}

              {/* MDX content */}
              <div className="prose prose-lg max-w-none mb-16 prose-headings:font-extrabold prose-headings:text-[#1E1E2C] prose-a:text-[#F29F67] prose-blockquote:border-l-[#F29F67] prose-blockquote:text-gray-600 prose-blockquote:italic">
                <MDXContent source={post.content} />
              </div>

              {/* ── Footer: Tags ── */}
              {post.tags && post.tags.length > 0 && (
                <footer className="mt-16 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2 mb-12">
                    {post.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-sm font-medium text-gray-700 hover:bg-[#F29F67]/20 hover:text-[#F29F67] transition-colors cursor-pointer"
                      >
                        #{tag.toLowerCase()}
                      </span>
                    ))}
                  </div>

                </footer>
              )}

              {/* ── Comments ── */}
              <div className="mt-16 pt-16 border-t border-gray-200">
                <CommentList postId={post.id} />
              </div>
            </article>

            {/* Sticky Table of Contents sidebar */}
            <aside className="hidden lg:block sticky top-28">
              <TableOfContents content={post.content} />
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
