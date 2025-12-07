import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, FileText, Users, Heart } from 'lucide-react';
import Link from 'next/link';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch stats
  const { count: postsCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', user.id);

  const { data: posts } = await supabase
    .from('posts')
    .select('id, view_count, title, slug')
    .eq('author_id', user.id);

  const totalViews = posts?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;

  // Fetch likes count directly from post_likes table for user's posts
  // First get all post IDs
  const postIds = posts?.map(p => p.id) || [];
  
  let totalLikes = 0;
  if (postIds.length > 0) {
    const { count } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .in('post_id', postIds);
    totalLikes = count || 0;
  }

  // Better query for top posts
  const { data: postsWithLikes } = await supabase
    .from('posts')
    .select(`
      id,
      title,
      slug,
      view_count
    `)
    .eq('author_id', user.id)
    .order('view_count', { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postsCount || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalLikes}</div>
            </CardContent>
          </Card>
        </div>

        {/* Top Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {postsWithLikes?.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Link href={`/post/${post.slug}`} className="font-medium hover:underline">
                      {post.title}
                    </Link>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {post.view_count || 0}
                    </div>
                    {/* Note: post_likes count structure depends on Supabase response, usually it's an array of objects if using select(..., count) */}
                    {/* For simplicity assuming we might need to adjust this based on actual response */}
                  </div>
                </div>
              ))}
              {(!postsWithLikes || postsWithLikes.length === 0) && (
                <div className="text-center text-muted-foreground py-4">
                  No posts yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
