'use client';

import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CoverImageUpload } from './cover-image-upload';
import { TagInput } from './tag-input';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface PostSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    title: string;
    slug: string;
    excerpt: string | null;
    cover_image: string | null;
    tags: string[];
    published: boolean;
    series_id?: string | null;
  };
  onUpdate: (updates: any) => void;
}

export function PostSettings({ isOpen, onClose, post, onUpdate }: PostSettingsProps) {
  const [slug, setSlug] = useState(post.slug);
  const [excerpt, setExcerpt] = useState(post.excerpt || '');
  const [series, setSeries] = useState<any[]>([]);
  const [isCreatingSeries, setIsCreatingSeries] = useState(false);
  const [newSeriesTitle, setNewSeriesTitle] = useState('');

  useEffect(() => {
    setSlug(post.slug);
    setExcerpt(post.excerpt || '');
    fetchSeries();
  }, [post]);

  async function fetchSeries() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('series')
      .select('*')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) setSeries(data);
  }

  async function handleCreateSeries() {
    if (!newSeriesTitle.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const slug = newSeriesTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const { data, error } = await supabase
      .from('series')
      .insert({
        title: newSeriesTitle,
        slug,
        author_id: user.id
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to create series');
      return;
    }

    setSeries([data, ...series]);
    onUpdate({ series_id: data.id });
    setIsCreatingSeries(false);
    setNewSeriesTitle('');
    toast.success('Series created!');
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-xl z-50 overflow-y-auto transform transition-transform duration-200 ease-in-out">
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Post Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Cover Image */}
        <div className="space-y-4">
          <Label>Cover Image</Label>
          <CoverImageUpload
            url={post.cover_image}
            onUpload={(url) => onUpdate({ cover_image: url })}
            onRemove={() => onUpdate({ cover_image: null })}
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              onUpdate({ slug: e.target.value });
            }}
          />
          <p className="text-xs text-muted-foreground">
            syntactic.com/post/{slug}
          </p>
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <textarea
            id="excerpt"
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={excerpt}
            onChange={(e) => {
              setExcerpt(e.target.value);
              onUpdate({ excerpt: e.target.value });
            }}
            placeholder="Brief description for SEO and previews..."
          />
        </div>

        {/* Series */}
        <div className="space-y-2">
          <Label>Series</Label>
          <div className="flex gap-2">
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={post.series_id || ''}
              onChange={(e) => onUpdate({ series_id: e.target.value || null })}
            >
              <option value="">None</option>
              {series.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsCreatingSeries(true)}
              title="Create new series"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {isCreatingSeries && (
            <div className="flex gap-2 mt-2 items-center">
              <Input
                placeholder="New series name"
                value={newSeriesTitle}
                onChange={(e) => setNewSeriesTitle(e.target.value)}
                className="h-8"
              />
              <Button 
                size="sm" 
                onClick={handleCreateSeries}
                disabled={!newSeriesTitle.trim()}
              >
                Create
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsCreatingSeries(false)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <TagInput
            tags={post.tags || []}
            onChange={(tags) => onUpdate({ tags })}
          />
        </div>

        {/* Danger Zone */}
        <div className="pt-8 border-t">
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => {
              if (confirm('Are you sure you want to delete this post?')) {
                // Handle delete
              }
            }}
          >
            Delete Post
          </Button>
        </div>
      </div>
    </div>
  );
}
