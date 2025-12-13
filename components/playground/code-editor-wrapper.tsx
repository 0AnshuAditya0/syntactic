'use client';

import Editor, { OnMount, loader } from '@monaco-editor/react';
import { Language, languageInfo } from '@/lib/playground/templates';
import { Loader2 } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  theme: 'light' | 'dark';
  onRun: () => void;
}

export function CodeEditorWrapper({ value, onChange, language, theme, onRun }: CodeEditorProps) {

  const handleEditorMount: OnMount = (editor, monaco) => {
    // Define custom themes
    monaco.editor.defineTheme('syntactic-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'CF222E', fontStyle: 'bold' },
        { token: 'string', foreground: '0A3069' },
        { token: 'number', foreground: '0550AE' },
        { token: 'function', foreground: '8250DF' },
        { token: 'comment', foreground: '6E7781', fontStyle: 'italic' },
        { token: 'operator', foreground: 'CF222E' },
        { token: 'type', foreground: '953800' },
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#24292F',
        'editor.lineHighlightBackground': '#F6F8FA',
        'editorLineNumber.foreground': '#57606A',
        'editorCursor.foreground': '#0969DA',
        'editor.selectionBackground': '#0969DA20',
      }
    });

    monaco.editor.defineTheme('syntactic-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'FF7B72', fontStyle: 'bold' },
        { token: 'string', foreground: 'A5D6FF' },
        { token: 'number', foreground: '79C0FF' },
        { token: 'function', foreground: 'D2A8FF' },
        { token: 'comment', foreground: '8B949E', fontStyle: 'italic' },
        { token: 'operator', foreground: 'FF7B72' },
        { token: 'type', foreground: 'FFA657' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#E6EDF3',
        'editor.lineHighlightBackground': '#161B22',
        'editorLineNumber.foreground': '#6E7681',
        'editorCursor.foreground': '#58A6FF',
        'editor.selectionBackground': '#388BFD26',
      }
    });
    
    // Set theme
    monaco.editor.setTheme(theme === 'dark' ? 'syntactic-dark' : 'syntactic-light');

    // Keybinding for Run
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });
  };

  return (
    <div className="h-full w-full bg-white dark:bg-[#1E1E1E] transition-colors duration-200">
      <Editor
        height="100%"
        language={languageInfo[language].monacoLanguage}
        value={value}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorMount}
        theme={theme === 'dark' ? 'syntactic-dark' : 'syntactic-light'}
        loading={<div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-gray-400" /></div>}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 22,
          fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
          fontLigatures: true,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          matchBrackets: 'always',
        }}
        className="font-mono"
      />
    </div>
  );
}
