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

export default function EditorPage() {
  const params = useParams();
  const router = useRouter(); // Use router
  
  // Track the actual ID we are working with (starts as 'new' or UUID)
  const [postId, setPostId] = useState<string>(params.id as string);
  const { user } = useAuth();

  const [post, setPost] = useState<any>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  const handleSave = useCallback(async (updates: any = {}) => {
    // Prevent saving if user not logged in
    if (!user) return;
    
    // For NEW posts, strictly prevent concurrent creations
    if (postId === 'new' && saving) return;

    setSaving(true);
    try {
      if (postId === 'new') {
        // Initial creation
        const newSlug = `untitled-${Date.now()}`;
        
        const { data, error } = await supabase
          .from('posts')
          .insert({
            title: title || 'Untitled Post',
            content: content || '',
            author_id: user.id,
            slug: newSlug,
            published: false,
            ...updates
          })
          .select()
          .single();

        if (error) throw error;

        // Update state to reflect created post
        setPost(data);
        setPostId(data.id);
        
        // Update URL silently
        window.history.replaceState(null, '', `/editor/${data.id}`);
        
      } else {
        // Update existing
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
        
        // Optimistic update
        setPost((prev: any) => ({ ...prev, ...postData }));
      }

    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setSaving(false);
    }
  }, [postId, user, title, content, saving]);

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

  async function handlePublish() {
    
    const isPublished = post?.published || false;
    const action = isPublished ? 'unpublish' : 'publish';

    if (!confirm(`Are you sure you want to ${action} this post?`)) {
      return;
    }

    try {
      const updates: any = { published: !isPublished };
      if (!isPublished) {
        updates.published_at = new Date().toISOString();
      }
      
      // If postId is still 'new', we need to create the post with published=true
      if (postId === 'new') {
        updates.title = title || 'Untitled Post';
        updates.content = content || '';
      }
      
      await handleSave(updates);
      
      // If we just created a new post, wait a bit then reload
      if (postId === 'new') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.location.reload();
      } else {
        alert(`Post ${action}ed successfully!`);
      }
    } catch (e) {
      console.error('Publish failed', e);
      alert('Publish failed: ' + (e as any).message);
    }
  }

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
      title={title || 'Untitled Post'}
      saving={saving}
      onSave={() => handleSave({ content })}
      onTogglePreview={() => setShowPreview(!showPreview)}
      showPreview={showPreview}
      onOpenSettings={() => setShowSettings(true)}
      onPublish={handlePublish}
      onDelete={handleDelete}
      published={post?.published || false}
    >
      <div className="flex h-full relative">
        {/* Editor Pane */}
        <div className={`h-full flex flex-col bg-white dark:bg-gray-900 ${showPreview ? 'hidden sm:flex sm:w-1/2 border-r border-gray-200 dark:border-gray-800' : 'w-full'}`}>

          {/* Scrollable Container for Title + Cover (Monaco handles its own scroll, so this is tricky) */}
          {/* Actually, best to keep Title separate from Monaco if Monaco is 100% height */}
          
          <div className="flex-none px-6 pt-6 pb-2 max-w-4xl mx-auto w-full">
             {/* Simplified Cover Image Trigger */}
             {!coverImage && (
                <button 
                  onClick={() => document.getElementById('cover-upload')?.click()}
                  className="group flex items-center gap-2 text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors text-sm font-medium mb-4"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0 duration-200">Add Cover Image</span>
                  <span className="opacity-100 group-hover:opacity-0 transition-opacity duration-200 absolute pl-6">Add Cover</span>
                </button>
             )}
              
             <input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
                disabled={uploading}
             />

             {coverImage && (
              <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-8 group">
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button variant="secondary" size="sm" onClick={() => document.getElementById('cover-upload')?.click()}>Change</Button>
                   <Button variant="destructive" size="sm" onClick={removeCover}>Remove</Button>
                </div>
              </div>
             )}

             <TitleEditor
                value={title}
                onChange={setTitle}
                placeholder="Post Title"
             />
          </div>

          <div className="flex-1 overflow-hidden w-full max-w-4xl mx-auto">
            <MdxEditor value={content} onChange={setContent} />
          </div>
        </div>

        {/* Preview Pane */}
        <div className={`h-full bg-[#F5F5F7] dark:bg-gray-800 ${showPreview ? 'w-full sm:w-1/2' : 'hidden'}`}>
          <PreviewPanel 
            content={content} 
            title={title}
            tags={(post?.tags as string[]) || []}
            readingTime={(post?.reading_time as number) || 0}
            coverImage={coverImage}
          />
        </div>

        {/* Settings Sidebar */}
        <PostSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          post={post || {}}
          onUpdate={handleSave}
        />
      </div>
    </EditorLayout>
  );
}