'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Profile } from '@/types/database';
import { Button } from '@/components/ui/button';
import { User, Mail, Globe, Github, Twitter, Calendar, Edit } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [postsCount, setPostsCount] = useState(0);
  const [codeFilesCount, setCodeFilesCount] = useState(0);
  const [posts, setPosts] = useState<any[]>([]);
  const [codeFiles, setCodeFiles] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'code' | 'activity'>('posts');

  useEffect(() => {
    fetchProfile();
  }, [username]);

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setNotFound(true);
        }
        throw error;
      }

      setProfile(data);
      
      // Fetch posts count and data
      const { count: postsCount, data: postsData } = await supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .eq('author_id', data.id)
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(10);
      
      setPostsCount(postsCount || 0);
      setPosts(postsData || []);
      
      // Fetch code files count and data
      // Show all files if viewing own profile, only public files for others
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const isOwnProfile = currentUser?.id === data.id;
      
      let filesQuery = supabase
        .from('code_files')
        .select('*', { count: 'exact' })
        .eq('user_id', data.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      // Only filter by is_public if viewing someone else's profile
      if (!isOwnProfile) {
        filesQuery = filesQuery.eq('is_public', true);
      }
      
      const { count: filesCount, data: filesData } = await filesQuery;
      
      setCodeFilesCount(filesCount || 0);
      setCodeFiles(filesData || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-xl text-muted-foreground">User not found</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === profile.id;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  profile.username.charAt(0).toUpperCase()
                )}
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div>
                  <h1 className="text-3xl font-bold">
                    {profile.display_name || profile.username}
                  </h1>
                  <p className="text-muted-foreground">@{profile.username}</p>
                </div>

                {profile.bio && (
                  <p className="text-gray-700 dark:text-gray-300 max-w-2xl">
                    {profile.bio}
                  </p>
                )}

                {/* Links */}
                <div className="flex flex-wrap gap-4 text-sm">
                  {profile.website_url && (
                    <a
                      href={profile.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </a>
                  )}
                  {profile.github_username && (
                    <a
                      href={`https://github.com/${profile.github_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:underline"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                  {profile.twitter_username && (
                    <a
                      href={`https://twitter.com/${profile.twitter_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-400 hover:underline"
                    >
                      <Twitter className="w-4 h-4" />
                      Twitter
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {isOwnProfile && (
              <Link href="/settings">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{postsCount}</div>
            <div className="text-sm text-muted-foreground">Posts</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{codeFilesCount}</div>
            <div className="text-sm text-muted-foreground">Code Files</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">0</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex gap-6">
              <button 
                onClick={() => setActiveTab('posts')}
                className={`pb-3 border-b-2 font-medium ${
                  activeTab === 'posts' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Posts ({postsCount})
              </button>
              <button 
                onClick={() => setActiveTab('code')}
                className={`pb-3 border-b-2 font-medium ${
                  activeTab === 'code' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Code Files ({codeFilesCount})
              </button>
              <button 
                onClick={() => setActiveTab('activity')}
                className={`pb-3 border-b-2 font-medium ${
                  activeTab === 'activity' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Activity
              </button>
            </div>
          </div>

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No posts yet</p>
                </div>
              ) : (
                posts.map((post) => (
                  <Link 
                    key={post.id} 
                    href={`/post/${post.slug}`}
                    className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{new Date(post.published_at).toLocaleDateString()}</span>
                      {post.reading_time && <span>{post.reading_time} min read</span>}
                      <span>{post.view_count || 0} views</span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* Code Files Tab */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              {codeFiles.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No public code files yet</p>
                </div>
              ) : (
                codeFiles.map((file) => (
                  <div 
                    key={file.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{file.filename}</h3>
                        {file.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {file.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                            {file.language}
                          </span>
                          <span>{new Date(file.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Activity feed coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
