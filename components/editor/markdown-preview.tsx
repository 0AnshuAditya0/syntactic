'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
  source: string;
};

export function MarkdownPreview({ source }: Props) {
  return (
    <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-pre:bg-gray-900 prose-pre:text-gray-100">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // Avoid rendering raw HTML while previewing user input
        skipHtml
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}

