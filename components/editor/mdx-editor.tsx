'use client';

import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface MdxEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function MdxEditor({ value, onChange, disabled }: MdxEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditorDidMount: OnMount = (editor, _monaco) => {
    // Configure editor settings
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      fontSize: 14,
      fontFamily: "'Fira Code', monospace",
      lineNumbers: 'off',
      folding: false,
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 0,
      renderLineHighlight: 'none',
      padding: { top: 16, bottom: 16 },
    });
  };

  if (!mounted) return null;

  return (
    <div className="h-[70vh] w-full rounded-3xl overflow-hidden border-[4px] border-gray-300 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] bg-white">
      <Editor
        height="100%"
        defaultLanguage="markdown"
        value={value}
        onChange={(value) => onChange(value || '')}
        theme="light"
        options={{
          minimap: { enabled: false },
          wordWrap: 'on',
          readOnly: disabled,
          fontSize: 18,
          lineHeight: 30,
          fontFamily: "'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace",
          fontLigatures: true,
          cursorSmoothCaretAnimation: 'on',
          smoothScrolling: true,
          padding: { top: 24, bottom: 24 },
          lineNumbers: 'off',
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          renderLineHighlight: 'none',
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden'
          },
        }}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full text-muted-foreground bg-white">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        }
      />
    </div>
  );
}
