'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { EditorLayout } from '@/components/editor/editor-layout';
import { MdxEditor } from '@/components/editor/mdx-editor';
import { PreviewPanel } from '@/components/editor/preview-panel';
import { PostSettings } from '@/components/editor/post-settings';
import { TitleEditor } from '@/components/editor/title-editor';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';
import { calculateReadingTime } from '@/lib/utils/reading-time';

export default function EditorPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [post, setPost] = useState<any>(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Debounce content and title changes for auto-save
  const debouncedContent = useDebounce(content, 2000);
  const debouncedTitle = useDebounce(title, 1000);

  const fetchPost = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setPost(data);
        setTitle(data.title || '');
        setContent(data.content || '');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = useCallback(async (updates: any = {}) => {
    if (!user || !post) return;
    setSaving(true);

    try {
      const postData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', id);
      
      if (error) throw error;

      // Update local state
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setPost((prev: any) => ({ ...prev, ...updates }));
      
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setSaving(false);
    }
  }, [id, post, user]);

  useEffect(() => {
    if (id === 'new') return;
    fetchPost();
  }, [id, fetchPost]);

  // Auto-save when content changes
  useEffect(() => {
    if (post && debouncedContent !== post.content) {
      const readingTime = calculateReadingTime(debouncedContent);
      handleSave({ content: debouncedContent, reading_time: readingTime });
    }
  }, [debouncedContent, post, handleSave]);

  // Auto-save when title changes
  useEffect(() => {
    if (post && debouncedTitle !== post.title && debouncedTitle.trim()) {
      handleSave({ title: debouncedTitle });
    }
  }, [debouncedTitle, post, handleSave]);

  async function handlePublish() {
    if (!post) return;
    
    const newPublishedState = !post.published;
    const action = newPublishedState ? 'publish' : 'unpublish';
    
    if (!confirm(`Are you sure you want to ${action} this post?`)) {
      return;
    }

    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updates: any = {
        published: newPublishedState,
        updated_at: new Date().toISOString(),
      };

      // Set published_at timestamp when publishing
      if (newPublishedState) {
        updates.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setPost((prev: any) => ({ ...prev, ...updates }));
      
      alert(`Post ${action}ed successfully!`);
    } catch (error) {
      console.error('Error publishing post:', error);
      alert(`Failed to ${action} post`);
    } finally {
      setSaving(false);
    }
  }

  if (loading && id !== 'new') {
    return <div className="h-screen flex items-center justify-center pt-16 bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-[#F29F67] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>;
  }

  return (
    <EditorLayout
      title={post?.title || 'Untitled Post'}
      saving={saving}
      onSave={() => handleSave({ content })}
      onTogglePreview={() => setShowPreview(!showPreview)}
      showPreview={showPreview}
      onOpenSettings={() => setShowSettings(true)}
      onPublish={handlePublish}
      published={post?.published || false}
    >
      <div className="flex h-full relative">
        {/* Editor Pane */}
        <div className={`h-full flex flex-col ${showPreview ? 'hidden sm:flex sm:w-1/2 border-r-2 border-gray-300 dark:border-gray-700' : 'w-full'}`}>
          <TitleEditor
            value={title}
            onChange={setTitle}
            placeholder="Enter post title..."
          />
          <div className="flex-1 overflow-hidden">
            <MdxEditor value={content} onChange={setContent} />
          </div>
        </div>

        {/* Preview Pane */}
        <div className={`h-full bg-[#F5F5F7] dark:bg-gray-800 ${showPreview ? 'w-full sm:w-1/2' : 'hidden'}`}>
          <PreviewPanel content={content} />
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
