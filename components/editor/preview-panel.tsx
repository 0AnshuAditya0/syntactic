'use client';

import { MDXContent } from '@/components/mdx/mdx-content';
import { Suspense } from 'react';

interface PreviewPanelProps {
  content: string;
}

export function PreviewPanel({ content }: PreviewPanelProps) {
  return (
    <div className="h-full overflow-auto p-8 bg-white dark:bg-gray-900">
      <Suspense fallback={<div className="text-muted-foreground">Loading preview...</div>}>
        <MDXContent source={content} />
      </Suspense>
    </div>
  );
}
