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
    <div className="w-full max-w-4xl mx-auto py-2">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-4xl sm:text-5xl font-black tracking-tighter resize-none outline-none bg-transparent text-gray-950 placeholder:text-gray-100 overflow-hidden leading-[1.1] min-h-[4rem] transition-all p-0 border-none shadow-none"
        rows={1}
        required
      />
    </div>
  );
}
