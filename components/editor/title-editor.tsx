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
    <div className="border-b border-gray-200 dark:border-gray-800 px-8 py-6 bg-white dark:bg-gray-900">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-4xl font-bold resize-none outline-none bg-transparent placeholder:text-gray-300 dark:placeholder:text-gray-700 overflow-hidden"
        rows={1}
        style={{ minHeight: '3rem' }}
      />
    </div>
  );
}
