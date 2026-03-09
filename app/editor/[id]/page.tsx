'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
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

  type AbortableThenable<T> = PromiseLike<T> & {
    abortSignal?: (signal: AbortSignal) => PromiseLike<T>;
  };

  const withAbortTimeout = useCallback(<T,>(
    builder: AbortableThenable<T>,
    ms: number,
    label: string,
  ): Promise<T> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ms);

    // supabase-js Postgrest builders support abort signals in v2 via `.abortSignal(signal)`.
    const maybeBuilder =
      builder && typeof builder.abortSignal === 'function'
        ? builder.abortSignal(controller.signal)
        : builder;

    // Postgrest builders are thenable but don't implement `.catch()`.
    // Wrap to a real Promise so we can safely `catch/finally`.
    return Promise.resolve(maybeBuilder).catch((err: any) => {
        if (controller.signal.aborted) {
          throw new Error(`${label} timed out after ${Math.round(ms / 1000)}s`);
        }
        throw err;
      })
      .finally(() => clearTimeout(timeoutId));
  }, []);

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

  // Persistence lock to avoid race conditions
  const isSavingRef = useRef(false);
  const inFlightSaveRef = useRef<Promise<any> | null>(null);
  const lastSavedRef = useRef({ title: '', content: '' });

  const debouncedContent = useDebounce(content, 2000);
  const debouncedTitle = useDebounce(title, 1000);

  // Tracking latest values for handleSave without causing function recreation
  const contentRef = useRef(content);
  const titleRef = useRef(title);

  useEffect(() => { contentRef.current = content; }, [content]);
  useEffect(() => { titleRef.current = title; }, [title]);


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
        lastSavedRef.current = { title: data.title || '', content: data.content || '' };

      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const handleSave = useCallback(async (updates: any = {}, options: { force?: boolean } = {}) => {
    if (!currentUser) return null;

    // Use a lock to prevent concurrent saves
    if (isSavingRef.current && !options.force) {
      console.log('[Editor] Save already in progress, returning in-flight save');
      return inFlightSaveRef.current;
    }

    // Normalize values for comparison and saving
    const normalize = (val: string) => (val || '').replace(/\r\n/g, '\n').trim();

    const targetTitle = updates.title !== undefined ? updates.title : titleRef.current;
    const targetContent = updates.content !== undefined ? updates.content : contentRef.current;

    // Check if anything actually changed to avoid redundant saves
    const isRedundant = !options.force &&
      normalize(targetTitle) === normalize(lastSavedRef.current.title) &&
      normalize(targetContent) === normalize(lastSavedRef.current.content) &&
      updates.cover_image === undefined &&
      updates.published === undefined &&
      updates.tags === undefined &&
      updates.series_id === undefined &&
      updates.excerpt === undefined;

    if (isRedundant) {
      console.log('[Editor] Skipping save: No changes detected');
      return null;
    }

    setSaving(true);
    isSavingRef.current = true;

    const savePromise = (async () => {
      const payload = {
        title: targetTitle || 'Untitled Post',
        content: targetContent || '',
        ...updates,
        updated_at: new Date().toISOString()
      };

      let result;
      if (postId === 'new') {
        const newSlug = (normalize(targetTitle) || 'untitled')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `post-${Date.now()}`;

        const { data, error } = await withAbortTimeout(
          supabase
            .from('posts')
            .insert({
              ...payload,
              slug: newSlug,
              author_id: currentUser.id,
              published: false
            })
            .select()
            .single(),
          45000,
          'Saving new post'
        );

        if (error) throw error;
        result = data;

        lastSavedRef.current = { title: result.title, content: result.content };
        setPost(result);
        setPostId(result.id);
        window.history.replaceState(null, '', `/editor/${result.id}`);
      } else {
        const { data, error } = await withAbortTimeout(
          supabase
            .from('posts')
            .update(payload)
            .eq('id', postId)
            .select()
            .single(),
          45000,
          'Saving post'
        );

        if (error) throw error;
        result = data;

        lastSavedRef.current = { title: result.title, content: result.content };
        setPost(result);
      }
      return result;
    })();

    inFlightSaveRef.current = savePromise;

    try {
      return await savePromise;
    } catch (error: any) {
      console.error('[Editor] Database error in handleSave:', error);
      toast.error('Failed to save changes');
      throw error;
    } finally {
      if (inFlightSaveRef.current === savePromise) {
        inFlightSaveRef.current = null;
      }
      setSaving(false);
      isSavingRef.current = false;
    }
  }, [postId, currentUser, withAbortTimeout]);



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

  // Unified Auto-save Hook
  useEffect(() => {
    if (!post || isPublishing) return;

    const normalize = (val: string) => (val || '').replace(/\r\n/g, '\n').trim();

    const needsTitleUpdate = debouncedTitle.trim() && normalize(debouncedTitle) !== normalize(post.title);
    const needsContentUpdate = normalize(debouncedContent) !== normalize(post.content);

    if (needsTitleUpdate || needsContentUpdate) {
      const updates: any = {};
      if (needsTitleUpdate) updates.title = debouncedTitle;
      if (needsContentUpdate) {
        updates.content = debouncedContent;
        updates.reading_time = calculateReadingTime(debouncedContent);
      }

      console.log('[Editor] Triggering auto-save...', updates);
      handleSave(updates).catch(() => {
        // Errors already surfaced via toast in handleSave; avoid unhandled rejection
      });
    }
  }, [debouncedContent, debouncedTitle, post, handleSave, isPublishing]);


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
    isSavingRef.current = true;

    try {
      // If an auto-save is in-flight, wait for it to finish to avoid racing updates.
      if (inFlightSaveRef.current) {
        // Don't force-timeout the underlying request; just stop waiting.
        await Promise.race([
          inFlightSaveRef.current.catch(() => null),
          new Promise((resolve) => setTimeout(resolve, 12000)),
        ]);
      }

      const normalize = (val: string) => (val || '').replace(/\r\n/g, '\n').trim();
      const targetTitle = title.trim();
      const targetContent = content; // Keep raw for publish to avoid accidental trimmings if any

      const readingTime = calculateReadingTime(targetContent);
      const updates: any = {
        title: targetTitle,
        content: targetContent,
        reading_time: readingTime,
        published: targetState,
        updated_at: new Date().toISOString()
      };

      if (targetState) {
        updates.published_at = new Date().toISOString();
      }

      // Handle Slug Generation
      const finalSlug = (postId === 'new' || !post?.slug)
        ? (normalize(targetTitle).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `post-${Date.now()}`)
        : post.slug;

      updates.slug = finalSlug;
      if (updates.slug.length < 3) updates.slug += '-article';

      console.log(`[Editor] Submitting ${action} with updates:`, updates);

      let result;
      if (postId === 'new') {
        const { data, error } = await withAbortTimeout(
          supabase
            .from('posts')
            .insert({
              ...updates,
              author_id: currentUser.id
            })
            .select()
            .single(),
          60000,
          `Attempting to ${action}`
        );

        if (error) throw error;
        result = data;

        setPostId(data.id);
        window.history.replaceState(null, '', `/editor/${data.id}`);
      } else {
        const { data, error } = await withAbortTimeout(
          supabase
            .from('posts')
            .update(updates)
            .eq('id', postId)
            .select()
            .single(),
          60000,
          `Attempting to ${action}`
        );

        if (error) throw error;
        result = data;
      }

      if (result) {
        lastSavedRef.current = { title: result.title, content: result.content };
        setPost(result);
        alert(`Successfully ${action}ed!`);
        toast.success(`Post ${action}ed!`);
      }
    } catch (e: any) {
      console.error(`[Editor] ${action} failed:`, e);
      alert(`Error during ${action}: ` + (e.message || 'Check terminal'));
      toast.error(e.message || `Failed to ${action}`);
    } finally {
      setIsPublishing(false);
      setSaving(false);
      isSavingRef.current = false;
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
      <div className="flex h-full">
        {/* Editor Main Section */}
        <div className={`flex-1 flex flex-col min-w-0 transition-opacity duration-300 ${isPublishing ? 'opacity-50 pointer-events-none' : 'opacity-100'} ${showPreview ? 'hidden sm:flex border-r border-gray-300' : 'flex'}`}>
          <div className="flex-1 overflow-y-auto px-4 sm:px-12 py-12">
            <div className="max-w-[850px] mx-auto space-y-12 bg-white p-16 rounded-[3rem] border-[4px] border-gray-300 shadow-[0_2px_45px_-10px_rgba(0,0,0,0.06)]">
              {/* Cover Image Section - Prominent 'Cover Page' feel */}
              <div className="space-y-4">
                <label className="text-xs font-black text-[#F29F67] uppercase tracking-[0.2em] mb-4 block">Story Cover</label>
                {coverImage ? (
                  <div className="relative group w-full aspect-[21/9] rounded-[2rem] overflow-hidden shadow-md border-[3px] border-white ring-1 ring-gray-100">
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/5 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                      <Button variant="secondary" size="sm" onClick={() => document.getElementById('cover-upload')?.click()} className="bg-white/95 border-none shadow-lg">Change Cover</Button>
                      <Button variant="destructive" size="sm" onClick={removeCover} className="bg-red-500/95 border-none shadow-lg">Remove</Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => document.getElementById('cover-upload')?.click()}
                    className="w-full h-48 rounded-[2rem] border-[3px] border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 text-gray-400 hover:text-[#F29F67] hover:border-[#F29F67]/50 transition-all bg-gray-50/50 group"
                    disabled={uploading}
                  >
                    <div className="p-4 bg-white rounded-[1.5rem] shadow-sm border-2 border-transparent group-hover:border-[#F29F67]/20 transition-all">
                      {uploading ? <Loader2 className="w-8 h-8 animate-spin text-[#F29F67]" /> : <ImageIcon className="w-8 h-8 opacity-40 group-hover:opacity-100" />}
                    </div>
                    <span className="text-sm font-bold tracking-tight">Tap to Upload Cover Page</span>
                  </button>
                )}
              </div>

              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />

              {/* Title Section */}
              <div className="space-y-4">
                <label className="text-xs font-black text-[#F29F67] uppercase tracking-[0.2em] mb-4 block px-2">Main Title</label>
                <TitleEditor
                  value={title}
                  onChange={setTitle}
                  placeholder="Tell your story..."
                />
              </div>

              {/* MDX Writing Box Section */}
              <div className="space-y-4">
                <label className="text-xs font-black text-[#F29F67] uppercase tracking-[0.2em] mb-4 block px-2">Writing Area</label>
                <div className="min-h-[500px]">
                  <MdxEditor value={content} onChange={setContent} />
                </div>
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