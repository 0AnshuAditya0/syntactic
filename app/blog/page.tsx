import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const fetchCache = 'force-no-store';

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

  const featuredPost = posts?.[0] ?? null;
  const gridPosts = posts?.slice(1) ?? [];

  const allTags = Array.from(
    new Set((posts ?? []).flatMap((p) => p.tags ?? []))
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-20">
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-20 py-12">

      
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3 text-[#1E1E2C]">Blog</h1>
          <p className="text-lg text-gray-600">
            Explore tutorials, guides, and insights from the Syntactic community
          </p>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-600 text-lg mb-4">
              No published posts yet.
            </p>
            <Link
              href="/editor"
              className="text-[#F29F67] hover:text-[#E08D55] hover:underline font-semibold"
            >
              Create your first post →
            </Link>
          </div>
        ) : (
          <>
            {/* ── Featured Hero Section ── */}
            {featuredPost && (
              <section className="mb-20">
                <Link href={`/post/${featuredPost.slug}`}>
                  <div className="group relative flex flex-col lg:flex-row items-center gap-0 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-100 transition-shadow hover:shadow-md">

                    {/* Cover Image */}
                    <div className="w-full lg:w-3/5 aspect-[16/9] relative overflow-hidden shrink-0 bg-gray-100">
                      {featuredPost.cover_image ? (
                        <Image
                          src={featuredPost.cover_image}
                          alt={featuredPost.title}
                          fill
                          sizes="(min-width: 1024px) 60vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#F29F67]/5">
                          <span className="text-[#F29F67]/20 font-black text-6xl select-none">
                            SY
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="w-full lg:w-2/5 p-8 lg:pr-12 flex flex-col gap-5">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-[#F29F67]/10 text-[#F29F67] text-xs font-bold uppercase tracking-widest rounded-full">
                          Latest
                        </span>
                        {featuredPost.published_at && (
                          <span className="text-gray-400 text-xs font-medium">
                            {formatDistanceToNow(new Date(featuredPost.published_at), { addSuffix: true })}
                          </span>
                        )}
                      </div>

                      <h2 className="text-2xl lg:text-4xl font-extrabold leading-tight text-gray-900 group-hover:text-[#F29F67] transition-colors">
                        {featuredPost.title}
                      </h2>

                      {featuredPost.excerpt && (
                        <p className="text-gray-500 text-base leading-relaxed line-clamp-3">
                          {featuredPost.excerpt}
                        </p>
                      )}

                      {/* Tags */}
                      {featuredPost.tags && featuredPost.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {featuredPost.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] font-bold text-[#F29F67] bg-[#F29F67]/5 px-2 py-0.5 rounded"
                            >
                              #{tag.toLowerCase()}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        {/* Author */}
                        <div className="flex items-center gap-2">
                          {featuredPost.profiles?.avatar_url ? (
                            <Image
                              src={featuredPost.profiles.avatar_url}
                              alt={featuredPost.profiles.username || 'Author'}
                              width={28}
                              height={28}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#F29F67]/10 flex items-center justify-center text-[#F29F67] text-xs font-bold border border-[#F29F67]/20">
                              {featuredPost.profiles?.username?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-sm font-semibold text-gray-700">
                            {featuredPost.profiles?.display_name || featuredPost.profiles?.username}
                          </span>
                        </div>

                        {/* Reading time */}
                        {featuredPost.reading_time && (
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {featuredPost.reading_time} min read
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[#F29F67] font-bold text-sm uppercase tracking-wider mt-1">
                        Read Article
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* ── Category Filter Chips ── */}
            {allTags.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-12">
                <span className="px-5 py-2 bg-[#F29F67] text-white text-sm font-bold rounded-xl">
                  All Stories
                </span>
                {allTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-5 py-2 bg-white text-gray-600 text-sm font-bold rounded-xl border border-gray-200 hover:border-[#F29F67]/50 transition-all cursor-pointer capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ── Blog Grid ── */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {gridPosts.map((post) => (
                  <article key={post.id} className="group flex flex-col gap-4">

                    {/* Thumbnail */}
                    <Link href={`/post/${post.slug}`}>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm border border-gray-100 bg-gray-100">
                        {post.cover_image ? (
                          <Image
                            src={post.cover_image}
                            alt={post.title}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#F29F67]/5">
                            <span className="text-[#F29F67]/20 font-black text-4xl select-none">SY</span>
                          </div>
                        )}

                        {/* Tag badge */}
                        {post.tags && post.tags[0] && (
                          <div className="absolute top-3 left-3">
                            <span className="px-2.5 py-1 bg-white/90 dark:bg-gray-900/90 text-[#F29F67] text-[10px] font-bold uppercase tracking-widest rounded-lg backdrop-blur-sm shadow-sm capitalize">
                              {post.tags[0]}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Meta + Content */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        {post.published_at && (
                          <span>
                            {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
                          </span>
                        )}
                        {post.reading_time && (
                          <>
                            <span className="w-1 h-1 bg-[#F29F67] rounded-full" />
                            <span>{post.reading_time} min read</span>
                          </>
                        )}
                      </div>

                      <Link href={`/post/${post.slug}`}>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-[#F29F67] transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>

                      {post.excerpt && (
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Author row */}
                      <div className="flex items-center gap-2 mt-1">
                        {post.profiles?.avatar_url ? (
                          <Image
                            src={post.profiles.avatar_url}
                            alt={post.profiles.username || 'Author'}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[#F29F67]/10 flex items-center justify-center text-[#F29F67] text-[9px] font-bold border border-[#F29F67]/20">
                            {post.profiles?.username?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <Link
                          href={`/profile/${post.profiles?.username}`}
                          className="text-xs font-semibold text-gray-600 hover:text-[#F29F67] transition-colors"
                        >
                          {post.profiles?.display_name || post.profiles?.username}
                        </Link>
                      </div>

                      <Link
                        href={`/post/${post.slug}`}
                        className="inline-flex items-center gap-1 text-[#F29F67] text-sm font-bold mt-1 group/link"
                      >
                        Read More
                        <svg className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
