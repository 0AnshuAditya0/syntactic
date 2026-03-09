import { compileMDX } from 'next-mdx-remote/rsc';
import rehypePrism from 'rehype-prism-plus';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './code-block';
import { Callout } from './callout';
import { CodePlaygroundEmbed } from './code-playground-embed';
import { MermaidDiagram } from './mermaid-diagram';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';

interface MDXContentSafeProps {
  source: string;
}

const components: MDXComponents = {
  pre: (props: ComponentProps<'pre'>) => {
    const { children, className, ...rest } = props;
    return <CodeBlock className={className} {...rest}>{children}</CodeBlock>;
  },
  Callout,
  CodePlaygroundEmbed,
  MermaidDiagram,
};

export async function MDXContentSafe({ source }: MDXContentSafeProps) {
  const options = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypePrism, { ignoreMissing: true }]],
    },
  };

  try {
    const { content } = await compileMDX({
      source,
      components,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options: options as any,
    });

    return (
      <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-pre:bg-gray-900 prose-pre:text-gray-100">
        {content}
      </div>
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <div className="text-sm font-semibold">This post contains invalid MDX</div>
        <div className="mt-1 text-xs opacity-90">
          The content couldn’t be rendered as MDX. Showing the raw content instead.
        </div>
        <pre className="mt-3 max-h-40 overflow-auto rounded-lg bg-white/70 p-3 text-[11px] leading-relaxed">
{message}
        </pre>
        <pre className="mt-3 max-h-[60vh] overflow-auto rounded-lg bg-white/70 p-3 text-[12px] leading-relaxed whitespace-pre-wrap">
{source}
        </pre>
      </div>
    );
  }
}

