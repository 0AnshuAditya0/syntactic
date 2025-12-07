'use client';

import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface MdxEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MdxEditor({ value, onChange }: MdxEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
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
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage="markdown"
        value={value}
        onChange={(value) => onChange(value || '')}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          wordWrap: 'on',
        }}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Loading editor...
          </div>
        }
      />
    </div>
  );
}
