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

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 font-sans">
      <main className="max-w-7xl mx-auto px-6 lg:px-12">
        {(!posts || posts.length === 0) ? (
          <div className="text-center py-32">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Journal</h1>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              We haven't shared any stories yet. Check back soon for deep dives into engineering and design.
            </p>
            <Link
              href="/editor"
              className="inline-flex items-center justify-center px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all"
            >
              Start Writing
            </Link>
          </div>
        ) : (
          <>
            {/* ── Featured Hero Section ── */}
            {featuredPost && (
              <section className="mb-32">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                  <div className="lg:col-span-7 group">
                    <Link href={`/post/${featuredPost.slug}`}>
                      <div className="relative aspect-[1.4] rounded-[3rem] overflow-hidden bg-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                        {featuredPost.cover_image ? (
                          <Image
                            src={featuredPost.cover_image}
                            alt={featuredPost.title}
                            fill
                            sizes="(min-width: 1024px) 60vw, 100vw"
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            priority
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white font-black text-8xl italic opacity-5">
                            Syntactic
                          </div>
                        )}
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[3rem]" />
                      </div>
                    </Link>
                  </div>

                  <div className="lg:col-span-5 space-y-10">
                    <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">
                      <span className="text-zinc-800">Featured Analysis</span>
                      <span className="w-12 h-px bg-gray-200"></span>
                      <span>
                        {featuredPost.published_at && new Date(featuredPost.published_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    <Link href={`/post/${featuredPost.slug}`} className="block group">
                      <h1 className="text-6xl lg:text-7xl font-black text-zinc-900 leading-[0.95] tracking-tighter group-hover:text-zinc-600 transition-colors">
                        {featuredPost.title}
                        <span className="text-[#F29F67]">.</span>
                      </h1>
                    </Link>

                    {featuredPost.excerpt && (
                      <p className="text-2xl text-gray-500 font-medium leading-relaxed font-serif italic max-w-lg">
                        {featuredPost.excerpt}
                      </p>
                    )}

                    <div className="pt-4">
                      <Link
                        href={`/post/${featuredPost.slug}`}
                        className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-zinc-900 group hover:gap-5 transition-all"
                      >
                        Read the Journal
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ── Section Header ── */}
            <div className="flex items-center justify-between mb-16 px-2">
              <h2 className="text-4xl font-black text-zinc-900 tracking-tighter">Recent Reflections</h2>
              <button className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-zinc-900 hover:shadow-lg transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
            </div>

            {/* ── Blog Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 mb-32">
              {gridPosts.slice(0, 3).map((post) => (
                <article key={post.id} className="flex flex-col space-y-8 group">
                  <Link href={`/post/${post.slug}`}>
                    <div className="relative aspect-[1.3] rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)]">
                      {post.cover_image ? (
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white font-black text-5xl italic opacity-5">SY</div>
                      )}
                      <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2.5rem]" />
                    </div>
                  </Link>

                  <div className="space-y-4 px-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                      {post.tags?.[0] || 'ENGINEERING CULTURE'}
                    </span>
                    <Link href={`/post/${post.slug}`}>
                      <h3 className="text-3xl font-black text-zinc-900 leading-[1.1] group-hover:text-zinc-500 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-xl text-gray-500 font-medium leading-relaxed font-serif italic line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="pt-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      <span>By {post.profiles?.display_name || post.profiles?.username}</span>
                      <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                      <span>{post.reading_time || 5} min read</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* ── Bottom Section ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
              <div className="lg:col-span-8">
                {gridPosts[3] && (
                  <article className="h-full group bg-white rounded-[3rem] border border-gray-100 overflow-hidden flex flex-col md:flex-row shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500">
                    <div className="w-full md:w-5/12 relative min-h-[400px]">
                      {gridPosts[3].cover_image ? (
                        <Image
                          src={gridPosts[3].cover_image}
                          alt={gridPosts[3].title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-100 flex items-center justify-center font-black text-5xl text-zinc-200 italic">SY</div>
                      )}
                    </div>
                    <div className="w-full md:w-7/12 p-12 md:p-16 flex flex-col justify-center space-y-6">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                        {gridPosts[3].tags?.[0] || 'THE CRAFT'}
                      </span>
                      <h3 className="text-4xl lg:text-5xl font-black text-zinc-900 leading-[1] tracking-tight">
                        {gridPosts[3].title}
                      </h3>
                      <p className="text-xl text-gray-500 font-medium leading-relaxed font-serif italic">
                        {gridPosts[3].excerpt}
                      </p>
                      <Link
                        href={`/post/${gridPosts[3].slug}`}
                        className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-zinc-900 group hover:gap-5 transition-all pt-4"
                      >
                        Continue Reading
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </article>
                )}
              </div>

              <div className="lg:col-span-4 bg-zinc-950 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center text-white space-y-8 relative overflow-hidden group">
                <div className="w-16 h-16 bg-[#F29F67]/20 rounded-[1.5rem] flex items-center justify-center text-[#F29F67] border border-[#F29F67]/30">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-black tracking-tighter leading-none">The Sunday Edition</h3>
                  <p className="text-gray-400 text-lg font-medium leading-relaxed italic font-serif">
                    Delivered weekly. Deeply researched.
                  </p>
                </div>
                <div className="w-full space-y-4">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-sm text-center tracking-wider"
                  />
                  <button className="w-full bg-white text-zinc-900 font-black uppercase tracking-[0.3em] text-[11px] py-5 rounded-2xl hover:bg-[#F29F67] transition-all">
                    Join the List
                  </button>
                </div>
              </div>
            </div>

            {/* Remaining Grid Posts */}
            {gridPosts.length > 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                {gridPosts.slice(4).map((post) => (
                  <article key={post.id} className="flex flex-col space-y-8 group">
                    <Link href={`/post/${post.slug}`}>
                      <div className="relative aspect-[1.3] rounded-[2.5rem] overflow-hidden bg-gray-100 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)]">
                        {post.cover_image ? (
                          <Image src={post.cover_image} alt={post.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-white font-black text-5xl italic opacity-5">SY</div>
                        )}
                        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2.5rem]" />
                      </div>
                    </Link>
                    <div className="space-y-4 px-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                         {post.tags && post.tags.length > 0 ? post.tags[post.tags.length - 1] : 'INSIGHTS'}
                       </span>
                       <Link href={`/post/${post.slug}`}>
                         <h3 className="text-3xl font-black text-zinc-900 leading-[1.1] group-hover:text-zinc-500 transition-colors line-clamp-2">
                           {post.title}
                         </h3>
                       </Link>
                       <p className="text-xl text-gray-500 font-medium leading-relaxed font-serif italic line-clamp-2">
                         {post.excerpt}
                       </p>
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
