'use client';

import { useEffect, useRef } from 'react';

interface TitleEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TitleEditor({ value, onChange, placeholder = 'Untitled Post' }: TitleEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 bg-transparent group">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-5xl sm:text-6xl font-black font-sans tracking-tight resize-none outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-200 dark:placeholder:text-gray-800 overflow-hidden leading-[1.1] min-h-[4rem] transition-colors"
        rows={1}
        required
      />
    </div>
  );
}
