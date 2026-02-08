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
    <div className="w-full max-w-4xl mx-auto px-6 pt-12 pb-4 bg-transparent group mb-4">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-4xl sm:text-5xl font-extrabold font-sans tracking-tight resize-none outline-none bg-transparent text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-700 overflow-hidden leading-tight min-h-[4rem]"
        rows={1}
        required
      />
    </div>
  );
}
