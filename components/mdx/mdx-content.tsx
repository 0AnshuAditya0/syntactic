import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypePrism from 'rehype-prism-plus';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { CodeBlock } from './code-block';
import { Callout } from './callout';
import { CodePlaygroundEmbed } from './code-playground-embed';
import { MermaidDiagram } from './mermaid-diagram';
import { mdxSanitizationSchema } from '@/lib/mdx/sanitizer';

interface MDXContentProps {
  source: string;
}

const components = {
  pre: CodeBlock,
  Callout,
  CodePlaygroundEmbed,
  MermaidDiagram,
};

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      // [rehypeSanitize, mdxSanitizationSchema],
      [rehypePrism, { ignoreMissing: true }],
    ] as any,
  },
};

export async function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-pre:bg-gray-900 prose-pre:text-gray-100">
      <MDXRemote source={source} components={components} options={options} />
    </div>
  );
}
