import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { User, Globe, Github, Twitter, Calendar } from 'lucide-react';
import Image from 'next/image';
import { ProfileContent } from '@/components/profile/profile-content';
import { ProfileEditButton } from '@/components/profile/profile-edit-button';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const username = decodeURIComponent(params.username).replace(/^@/, '');
  const supabase = await createClient();

  // 1. Fetch Profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (error) {
    console.error('[ProfilePage] Error:', error);
    throw error;
  }

  if (!profile) {
    const { data: ciProfiles } = await supabase
      .from('profiles')
      .select('username')
      .ilike('username', username)
      .limit(1);

    if (ciProfiles && ciProfiles.length > 0) {
      return redirect(`/profile/${ciProfiles[0].username}`);
    }
    return notFound();
  }

  // 2. Fetch User Session to check ownership (for private snippets)
  const { data: { user: viewer } } = await supabase.auth.getUser();
  const isOwner = viewer?.id === profile.id;

  // 3. Parallel fetching
  let filesQuery = supabase
    .from('code_files')
    .select('*', { count: 'exact' })
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(12);

  if (!isOwner) {
    filesQuery = filesQuery.eq('is_public', true);
  }

  const [postsRes, filesRes] = await Promise.all([
    supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .eq('author_id', profile.id)
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(12),
    filesQuery
  ]);

  const posts = postsRes.data || [];
  const codeFiles = filesRes.data || [];
  const counts = {
    posts: postsRes.count || 0,
    code: filesRes.count || 0
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-gray-900 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
            {/* Avatar Section */}
            <div className="shrink-0">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-gray-50 dark:border-gray-900 bg-gray-100 dark:bg-gray-700 overflow-hidden shadow-inner">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.username}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#F29F67] text-4xl font-bold bg-[#F29F67]/10">
                    {profile.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-[#1E1E2C] dark:text-white">
                    {profile.display_name || profile.username}
                  </h1>
                  <p className="text-lg text-[#F29F67] font-medium">
                    @{profile.username}
                  </p>
                </div>

                <ProfileEditButton profileId={profile.id} username={profile.username} />
              </div>

              {profile.bio && (
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
                  {profile.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2">
                <div className="flex flex-wrap gap-4">
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-[#F29F67] transition-colors">
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                  {profile.github_username && (
                    <a href={`https://github.com/${profile.github_username}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                  {profile.twitter_username && (
                    <a href={`https://twitter.com/${profile.twitter_username}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-blue-400 transition-colors">
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </a>
                  )}
                </div>

                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400 font-medium border-l border-gray-200 dark:border-gray-700 pl-6">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(profile.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Big Stats Row */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-[#1E1E2C] dark:text-white mb-0.5">{counts.posts}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Articles</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-[#1E1E2C] dark:text-white mb-0.5">{counts.code}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Snippets</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-[#1E1E2C] dark:text-white mb-0.5">0</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Followers</div>
          </div>
        </div>

        {/* Detailed Content */}
        <ProfileContent
          initialPosts={posts}
          initialCodeFiles={codeFiles}
          counts={counts}
          username={profile.username}
        />
      </div>
    </div>
  );
}
