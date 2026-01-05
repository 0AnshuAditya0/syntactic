'use client';

import Editor, { OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { Play, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onReset: () => void;
  isRunning?: boolean;
  helperText?: string;
}

export function SqlEditor({ value, onChange, onRun, onReset, isRunning, helperText }: SqlEditorProps) {
  const { theme } = useTheme();

  const handleEditorMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRun();
    });
  };

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white/80 dark:bg-slate-900">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-0.5">
          <p className="text-sm font-semibold">SQL Editor</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Runs entirely in the browser with AlaSQL. Press Ctrl+Enter to execute.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset data
          </Button>
          <Button size="sm" onClick={onRun} disabled={isRunning}>
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Run query'}
          </Button>
        </div>
      </div>

      <div className="h-[380px]">
        <Editor
          height="100%"
          language="sql"
          value={value}
          onChange={(next) => onChange(next || '')}
          onMount={handleEditorMount}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 14, bottom: 14 },
            fontFamily: 'var(--font-space-mono)',
            fontLigatures: true,
          }}
        />
      </div>

      {helperText && (
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60">
          {helperText}
        </div>
      )}
    </div>
  );
}

