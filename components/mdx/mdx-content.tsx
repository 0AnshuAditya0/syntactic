import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrism from 'rehype-prism-plus';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './code-block';
import { Callout } from './callout';
import { CodePlaygroundEmbed } from './code-playground-embed';
import { MermaidDiagram } from './mermaid-diagram';
import type { MDXComponents } from 'mdx/types';
import type { ComponentProps } from 'react';

interface MDXContentProps {
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

export async function MDXContent({ source }: MDXContentProps) {
  const options = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        [rehypePrism, { ignoreMissing: true }],
      ],
    },
  };

  return (
    <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-pre:bg-gray-900 prose-pre:text-gray-100">
      <MDXRemote source={source} components={components} options={options as any} />
    </div>
  );
}