'use client';

import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { Language, languageInfo } from '@/lib/playground/templates';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  onRun: () => void;
}

export function CodeEditor({ value, onChange, language, onRun }: CodeEditorProps) {
  const { theme } = useTheme();
  
  const handleEditorMount: OnMount = (editor, monaco) => {
    // Add keyboard shortcut for running code (Ctrl+Enter)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });
  };

  return (
    <div className="h-full border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <Editor
        height="100%"
        language={languageInfo[language].monacoLanguage}
        value={value}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorMount}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
}
