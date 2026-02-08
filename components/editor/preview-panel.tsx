'use client';

import { MDXContent } from '@/components/mdx/mdx-content';
import { Suspense, FC } from 'react';

export interface PreviewPanelProps {
  content: string;
  title: string;
  tags: string[];
  readingTime: number;
  coverImage: string | null;
}

export const PreviewPanel: FC<PreviewPanelProps> = ({ 
  content, 
  title, 
  tags, 
  readingTime, 
  coverImage 
}) => {
  return (
    <div className="h-full overflow-auto p-8 bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Post Header Preview */}
        <header className="space-y-6">
          {coverImage && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800">
              <img src={coverImage} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight lg:text-5xl">
              {title || 'Untitled Post'}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F29F67]" />
                {readingTime} min read
              </span>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        <hr className="border-border" />

        {/* Content Preview */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <Suspense fallback={<div className="text-muted-foreground animate-pulse">Loading content preview...</div>}>
            <MDXContent source={content} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
