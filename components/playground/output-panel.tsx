import { Trash2, Copy, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OutputPanelProps {
  output: string;
  error?: string;
  onClear: () => void;
  executionTime?: number;
  isRunning?: boolean;
  theme?: 'light' | 'dark';
}

export function OutputPanel({ output, error, onClear, executionTime, isRunning, theme }: OutputPanelProps) {
  const handleCopy = () => {
    const text = error ? `${error}\n${output}` : output;
    navigator.clipboard.writeText(text);
  };

  const hasContent = !!output || !!error;

  return (
    <div className={`h-full ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="h-full flex flex-col transition-colors duration-200 text-slate-900 dark:text-white">
      <div className="h-10 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700 dark:text-white">Output</span>
          {executionTime !== undefined && (
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-300">
              ({executionTime}ms)
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-8 w-8 text-slate-700 dark:text-slate-100 hover:bg-black/5 dark:hover:bg-white/10 focus-visible:ring-slate-500"
            title="Clear output"
          >
            <Trash2 className="w-4 h-4 text-current" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-8 w-8 text-slate-700 dark:text-slate-100 hover:bg-black/5 dark:hover:bg-white/10 focus-visible:ring-slate-500"
            title="Copy output"
          >
            <Copy className="w-4 h-4 text-current" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 font-mono text-[13px] leading-relaxed bg-transparent text-slate-900 dark:text-slate-50">
        {isRunning ? (
           <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-300 select-none">
             <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
             <p className="text-sm">Executing...</p>
           </div>
        ) : !hasContent ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-300 select-none">
            <Play className="w-8 h-8" />
            <p className="text-sm">Click &apos;Run&apos; or press Ctrl+Enter to execute</p>
          </div>
        ) : (
          <div className="space-y-2" aria-live="polite">
            {error && (
              <pre className="whitespace-pre-wrap break-words text-[#B91C1C] dark:text-[#FCA5A5]">
                {error}
              </pre>
            )}
            {output && (
              <pre className="whitespace-pre-wrap break-words text-slate-900 dark:text-white">
                {output}
              </pre>
            )}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}