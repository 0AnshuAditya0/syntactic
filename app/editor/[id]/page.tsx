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

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        controller.abort();
        reject(new Error(`${label} timed out after ${Math.round(ms / 1000)}s`));
      }, ms);
    });

    return Promise.race([
      Promise.resolve(maybeBuilder),
      timeoutPromise
    ]).catch((err: any) => {
      throw err;
    }).finally(() => {
      clearTimeout(timeoutId);
    });
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
        const baseSlug = (normalize(targetTitle) || 'untitled')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        const newSlug = `${baseSlug}-${Date.now().toString(36)}`;

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
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || `Upload failed with status ${res.status}`);
      }

      const { url } = await res.json();
      setCoverImage(url);
      await handleSave({ cover_image: url });
    } catch (err: any) {
      console.error('Upload Error:', err);
      toast.error(err.message || 'Failed to upload cover image');
      alert(`Failed to upload cover image: ${err.message}`);
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
    console.log('[handlePublish] Action triggered');
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

    console.log(`[handlePublish] Action determined as "${action}", starting state locks`);
    setIsPublishing(true);

    try {
      if (inFlightSaveRef.current) {
        console.log('[handlePublish] Waiting on in-flight auto-save...');
        await Promise.race([
          inFlightSaveRef.current.catch(() => null),
          new Promise((resolve) => setTimeout(resolve, 5000)),
        ]);
        console.log('[handlePublish] In-flight auto-save resolved/timed out.');
      }

      const normalize = (val: string) => (val || '').replace(/\r\n/g, '\n').trim();
      const targetTitle = title.trim();
      const targetContent = content;
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

      const baseSlug = (normalize(targetTitle) || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const finalSlug = (postId === 'new' || !post?.slug)
        ? `${baseSlug}-${Date.now().toString(36)}`
        : post.slug;

      updates.slug = finalSlug;

      console.log(`[handlePublish] Preparing Supabase call for postId = ${postId}`, updates);

      let result;
      if (postId === 'new') {
        const payload = { ...updates, author_id: currentUser.id };
        console.log('[handlePublish] Inserting new post...', payload);
        const { data, error } = await withAbortTimeout(
          supabase
            .from('posts')
            .insert(payload)
            .select()
            .single(),
          15000,
          `Attempting to ${action}`
        );
        
        console.log('[handlePublish] Insert returned:', { data, error });
        if (error) throw error;
        result = data;
        setPostId(data.id);
        window.history.replaceState(null, '', `/editor/${data.id}`);
      } else {
        console.log(`[handlePublish] Updating existing post ${postId}...`);
        const { data, error } = await withAbortTimeout(
          supabase
            .from('posts')
            .update(updates)
            .eq('id', postId)
            .select()
            .single(),
          15000,
          `Attempting to ${action}`
        );
        
        console.log('[handlePublish] Update returned:', { data, error });
        if (error) throw error;
        result = data;
      }

      if (result) {
        console.log('[handlePublish] Successfully saved DB state. Updating UI components.');
        lastSavedRef.current = { title: result.title, content: result.content };
        setPost(result);
        toast.success(`Post ${action}ed successfully!`);
      }
    } catch (e: any) {
      console.error(`[Editor] ${action} failed execution tree:`, e);
      toast.error(e.message || `Failed to ${action}. Check your connection.`);
    } finally {
      console.log('[handlePublish] Entering strictly enforced finally block, resetting IsPublishing flag.');
      setIsPublishing(false);
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
      <div className="flex h-full overflow-hidden bg-gray-50/50">
        {/* Editor Main Section */}
        <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isPublishing ? 'opacity-50 pointer-events-none' : 'opacity-100'} ${showPreview ? 'hidden sm:flex border-r border-gray-200' : 'flex'}`}>
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 lg:py-12 bg-gray-50/30">
            <div className="max-w-[850px] mx-auto space-y-8 pb-32">
              
              {/* Section 1: Story Cover */}
              <div className="bg-white rounded-[2rem] border-[3px] border-gray-200 shadow-sm overflow-hidden p-8 group transition-all hover:border-gray-300 focus-within:border-[#F29F67]">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">01. Story Cover</label>
                  {coverImage && (
                    <button onClick={removeCover} className="text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-500 transition-colors">Discard Image</button>
                  )}
                </div>
                {coverImage ? (
                  <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-sm">
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                      <Button variant="secondary" size="sm" onClick={() => document.getElementById('cover-upload')?.click()} className="bg-white/95 border-none shadow-lg text-xs font-bold">Swap Cover</Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => document.getElementById('cover-upload')?.click()}
                    className="w-full h-48 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 text-gray-400 hover:text-[#F29F67] hover:border-[#F29F67]/50 transition-all bg-gray-50/30 group/btn"
                    disabled={uploading}
                  >
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover/btn:border-[#F29F67]/20 transition-all">
                      {uploading ? <Loader2 className="w-6 h-6 animate-spin text-[#F29F67]" /> : <ImageIcon className="w-6 h-6 opacity-30 group-hover/btn:opacity-100" />}
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-black uppercase tracking-widest mb-1">Add Story Cover</p>
                      <p className="text-[10px] text-gray-400">High-resolution landscape recommended</p>
                    </div>
                  </button>
                )}
                <input id="cover-upload" type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              </div>

              {/* Section 2: Headline & Intro */}
              <div className="bg-white rounded-[2rem] border-[3px] border-gray-200 shadow-sm p-8 space-y-4 focus-within:border-[#F29F67] transition-all hover:border-gray-300">
                <div className="flex items-center justify-between">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">02. Headline</label>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-2 py-0.5 rounded uppercase tracking-wider">Draft</span>
                      <span className="text-[10px] font-bold text-gray-300 bg-gray-50 px-2 py-0.5 rounded uppercase tracking-wider">Editorial</span>
                   </div>
                </div>
                <TitleEditor
                  value={title}
                  onChange={setTitle}
                  placeholder="Enter a compelling headline..."
                />
                <div className="px-8 pb-4">
                  <textarea
                    value={post?.excerpt || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPost((prev: any) => ({ ...prev, excerpt: val }));
                      // Use the auto-save mechanism by triggering a title change or debouncing excerpt
                    }}
                    placeholder="Write a brief subtitle or introduction..."
                    className="w-full text-base font-serif italic text-gray-500 placeholder:text-gray-200 bg-transparent resize-none outline-none min-h-[50px] leading-relaxed"
                  />
                </div>
              </div>

              {/* Section 3: Manuscript Content */}
              <div className="bg-white rounded-[2rem] border-[3px] border-gray-200 shadow-sm focus-within:border-[#F29F67] transition-all hover:border-gray-300 min-h-[500px]">
                <div className="flex items-center justify-between p-8 pb-4 border-b border-gray-100 mb-6">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">03. Manuscript</label>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">MDX Enabled</span>
                  </div>
                </div>
                <div className="px-2 pb-8 h-[70vh]">
                  <MdxEditor value={content} onChange={setContent} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Improved Right Sidebar */}
        {!showPreview && (
          <aside className="w-[300px] border-l border-gray-200 bg-white hidden xl:flex flex-col shrink-0 p-8 space-y-12">
            {/* Story State */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-gray-900 border-b border-gray-100 pb-3 uppercase tracking-[0.4em]">Story State</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <p className="text-2xl font-black text-gray-950 leading-none mb-1">
                      {content.trim() ? content.trim().split(/\s+/).length : 0}
                   </p>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Words</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                   <p className="text-2xl font-black text-gray-950 leading-none mb-1">
                      {calculateReadingTime(content)}
                   </p>
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Min To</p>
                </div>
              </div>
            </div>

            {/* SEO Score */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.4em]">SEO Score</h3>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${title.length > 20 && content.length > 100 ? 'text-emerald-500 bg-emerald-50' : 'text-[#F29F67] bg-[#F29F67]/5'}`}>
                   {title.length > 20 && content.length > 100 ? 'OPTIMIZED' : 'NEEDS WORK'}
                </span>
              </div>
              <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-[#F29F67] transition-all duration-1000" 
                  style={{ width: `${Math.min(100, (title.length / 50 * 30) + (content.length / 1000 * 70))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-gray-300 uppercase tracking-widest pt-1">
                  <span>Incomplete</span>
                  <span>{Math.round(Math.min(100, (title.length / 50 * 30) + (content.length / 1000 * 70)))}%</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-end">
               <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Author Notes</p>
                  <p className="text-xs text-blue-600/70 font-serif italic">Every story starts with a single word. Keep pushing your boundaries.</p>
               </div>
            </div>
          </aside>
        )}

        {/* Live Preview Section */}
        {showPreview && (
          <div className="flex-1 overflow-y-auto bg-gray-100/30 hidden sm:block">
            <PreviewPanel
              content={content}
              title={title}
              tags={(post?.tags as string[]) || []}
              readingTime={(post?.reading_time as number) || 0}
              coverImage={coverImage}
            />
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