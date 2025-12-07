'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  // Extract language from className (format: language-js)
  const language = className?.replace('language-', '') || 'text';
  
  // Get code content
  const code = typeof children === 'string' 
    ? children 
    : (children as any)?.props?.children || '';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute right-2 top-2 flex items-center gap-2">
        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
        </button>
      </div>
      <pre className={className}>
        {children}
      </pre>
    </div>
  );
}
