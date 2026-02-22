'use client';
import { useState, useEffect, useCallback } from 'react';
// Add useRouter import
import { useParams, useRouter } from 'next/navigation';
import { EditorLayout } from '@/components/editor/editor-layout';
import { MdxEditor } from '@/components/editor/mdx-editor';
import { PreviewPanel } from '@/components/editor/preview-panel';
import { PostSettings } from '@/components/editor/post-settings';
import { TitleEditor } from '@/components/editor/title-editor';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';
import { calculateReadingTime } from '@/lib/utils/reading-time';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter(); // Use router
  
  // Track the actual ID we are working with (starts as 'new' or UUID)
  const [postId, setPostId] = useState<string>(params.id as string);
  const { user, tempUser } = useAuth();
  const currentUser = user || tempUser;

  const [post, setPost] = useState<any>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState('');

  const debouncedContent = useDebounce(content, 2000);
  const debouncedTitle = useDebounce(title, 1000);
  // ... (other state)

  // ... (debounced hooks)

  const fetchPost = useCallback(async () => {
    if (postId === 'new') return; // Skip fetch for new

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single();
      if (error) throw error;
      if (data) {
        setPost(data);
        setTitle(data.title || '');
        setContent(data.content || '');
        setCoverImage(data.cover_image || null);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const handleSave = useCallback(async (updates: any = {}, options: { force?: boolean } = {}) => {
    if (!currentUser) {
      console.warn('Cannot save: No authenticated user found');
      return null;
    }
    
    // Auto-save lock: Skip only if NOT forced and already saving a new post
    if (postId === 'new' && saving && !options.force) {
      console.log('[Editor] Skipping auto-save: Creation already in progress');
      return null;
    }

    setSaving(true);
    try {
      if (postId === 'new') {
        const newSlug = (updates.title || title || 'untitled')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `post-${Date.now()}`;
        
        const { data, error } = await supabase
          .from('posts')
          .insert({
            title: title || 'Untitled Post',
            content: content || '',
            author_id: currentUser.id,
            slug: newSlug,
            published: false,
            ...updates
          })
          .select()
          .single();

        if (error) throw error;

        // Transition state to the new UUID
        setPost(data);
        setPostId(data.id);
        setLastSavedContent(content);
        // Use router for a cleaner transition if needed, or just stay on page
        window.history.replaceState(null, '', `/editor/${data.id}`);
        console.log('[Editor] New post created ID:', data.id);
        return data; 
      } else {
        const postData = {
          ...updates,
          updated_at: new Date().toISOString(),
        };
        const { data, error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', postId)
          .select()
          .single();

        if (error) throw error;
        
        setPost((prev: any) => ({ ...prev, ...postData }));
        setLastSavedContent(content);
        return data;
      }
    } catch (error: any) {
      console.error('[Editor] Database error in handleSave:', error);
      toast.error('Failed to save: ' + (error.message || 'Unknown error'));
      throw error;
    } finally {
      if (!options.force) setSaving(false);
    }
  }, [postId, currentUser, title, content, saving]);

  useEffect(() => {
    if (postId === 'new') {
      // Initialize blank post for new editor
      setPost({
        title: '',
        content: '',
        tags: [],
        published: false
      });
      setLoading(false);
      return;
    }
    fetchPost();
  }, [postId, fetchPost]);

  useEffect(() => {
    if (post && debouncedContent !== post.content) {
      const readingTime = calculateReadingTime(debouncedContent);
      handleSave({ content: debouncedContent, reading_time: readingTime });
    }
  }, [debouncedContent, post, handleSave]);

  useEffect(() => {
    if (post && debouncedTitle !== post.title && debouncedTitle.trim()) {
      handleSave({ title: debouncedTitle });
    }
  }, [debouncedTitle, post, handleSave]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload/cover', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');

      const { url } = await res.json();
      setCoverImage(url);
      await handleSave({ cover_image: url });
    } catch (err) {
      console.error(err);
      alert('Failed to upload cover image');
    } finally {
      setUploading(false);
    }
  };

  const removeCover = () => {
    setCoverImage(null);
    handleSave({ cover_image: null });
  };

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    
    setSaving(true);
    try {
      if (postId !== 'new') {
        const { error } = await supabase
          .from('posts')
          .delete()
          .eq('id', postId);
        
        if (error) throw error;
      }
      router.push('/dashboard'); // Redirect to dashboard after delete
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
      setSaving(false);
    }
  }

  const handlePublish = async () => {
    if (!currentUser) {
      toast.error('Authentication required');
      return;
    }

    if (title.trim().length < 5) {
      toast.error('Title is too short (min 5 chars)');
      return;
    }

    const isCurrentlyPublished = post?.published || false;
    const action = isCurrentlyPublished ? 'unpublish' : 'publish';
    const targetState = !isCurrentlyPublished;

    console.log(`[Editor] Starting ${action} flow...`);
    setIsPublishing(true);
    setSaving(true);
    
    try {
      const readingTime = calculateReadingTime(content);
      const updates: any = { 
        title: title.trim(),
        content: content,
        reading_time: readingTime,
        published: targetState,
        updated_at: new Date().toISOString()
      };
      
      if (targetState) {
        updates.published_at = new Date().toISOString();
      }

      // Handle Slug Generation
      const finalSlug = (postId === 'new' || !post?.slug) 
        ? (title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `post-${Date.now()}`)
        : post.slug;
      
      updates.slug = finalSlug;
      if (updates.slug.length < 3) updates.slug += '-article';

      console.log(`[Editor] Submitting ${action} with updates:`, updates);

      // We perform the operation directly to ensure absolute consistency
      let result;
      if (postId === 'new') {
        const { data, error } = await supabase
          .from('posts')
          .insert({
            ...updates,
            author_id: currentUser.id
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        
        setPostId(data.id);
        window.history.replaceState(null, '', `/editor/${data.id}`);
      } else {
        const { data, error } = await supabase
          .from('posts')
          .update(updates)
          .eq('id', postId)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }

      if (result) {
        setPost(result);
        alert(`Successfully ${action}ed!`); // Guaranteed feedback
        toast.success(`Post ${action}ed!`);
      }
    } catch (e: any) {
      console.error(`[Editor] ${action} failed:`, e);
      alert(`Error during ${action}: ` + (e.message || 'Check terminal'));
      toast.error(e.message || `Failed to ${action}`);
    } finally {
      setIsPublishing(false);
      setSaving(false);
    }
  };

  if (loading && postId !== 'new') {
    return (
      <div className="h-screen flex items-center justify-center pt-16 bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-[#F29F67] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <EditorLayout
      title={title}
      saving={saving}
      isPublishing={isPublishing}
      onSave={() => handleSave({ content })}
      onTogglePreview={() => setShowPreview(!showPreview)}
      showPreview={showPreview}
      onOpenSettings={() => setShowSettings(true)}
      onPublish={handlePublish}
      onDelete={handleDelete}
      published={post?.published || false}
    >
      <div className="flex h-full bg-white dark:bg-[#0A0A0B]">
        {/* Editor Main Section */}
        <div className={`flex-1 flex flex-col min-w-0 transition-opacity duration-300 ${isPublishing ? 'opacity-50 pointer-events-none' : 'opacity-100'} ${showPreview ? 'hidden sm:flex border-r border-gray-100 dark:border-gray-800' : 'flex'}`}>
          <div className="flex-1 overflow-y-auto px-4 sm:px-12 py-8">
            <div className="max-w-[720px] mx-auto space-y-8">
              {/* Cover Image Section */}
              {coverImage ? (
                <div className="relative group w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-sm bg-gray-50 dark:bg-gray-900">
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                    <Button variant="secondary" size="sm" onClick={() => document.getElementById('cover-upload')?.click()} className="bg-white/90 backdrop-blur-sm border-none">Change Image</Button>
                    <Button variant="destructive" size="sm" onClick={removeCover} className="bg-red-500/90 backdrop-blur-sm border-none">Remove</Button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => document.getElementById('cover-upload')?.click()}
                  className="w-full h-24 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800 flex items-center justify-center gap-3 text-gray-400 hover:text-[#F29F67] hover:border-[#F29F67]/30 transition-all group"
                  disabled={uploading}
                >
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg group-hover:scale-110 transition-transform">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                  </div>
                  <span className="text-sm font-medium">Add a cover image</span>
                </button>
              )}

              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />

              {/* Title Section */}
              <div className="space-y-4">
                <TitleEditor
                  value={title}
                  onChange={setTitle}
                  placeholder="The title of your story..."
                />
              </div>

              {/* MDX Content Area */}
              <div className="min-h-[500px]">
                <MdxEditor value={content} onChange={setContent} />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Section */}
        {showPreview && (
          <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-black/20 hidden sm:block">
            <PreviewPanel 
              content={content} 
              title={title}
              tags={(post?.tags as string[]) || []}
              readingTime={(post?.reading_time as number) || 0}
              coverImage={coverImage}
            />
          </div>
        )}

        {/* Mobile Preview Toggle Overlay (Optional UX) */}
        {showPreview && (
          <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 sm:hidden">
            <div className="p-4 flex items-center justify-between border-b dark:border-gray-800">
              <span className="font-semibold">Live Preview</span>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>Close</Button>
            </div>
            <div className="h-[calc(100vh-60px)] overflow-y-auto">
              <PreviewPanel 
                content={content} 
                title={title}
                tags={(post?.tags as string[]) || []}
                readingTime={(post?.reading_time as number) || 0}
                coverImage={coverImage}
              />
            </div>
          </div>
        )}

        {/* Post Settings Drawer */}
        <PostSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          post={post || { title, content, tags: [], published: false, slug: '' }}
          onUpdate={handleSave}
        />
      </div>
    </EditorLayout>
  );
}