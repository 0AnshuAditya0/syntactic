import { Trash2, Copy, Play, Terminal, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRef, useEffect } from 'react';

interface OutputPanelProps {
  output: string;
  error?: string;
  onClear: () => void;
  stdin: string;
  onStdinChange: (value: string) => void;
  executionTime?: number;
  isRunning?: boolean;
  theme?: 'light' | 'dark';
}

export function OutputPanel({
  output,
  error,
  onClear,
  stdin,
  onStdinChange,
  executionTime,
  isRunning,
  theme
}: OutputPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output, error, isRunning]);

  const handleCopy = () => {
    const text = error ? `${error}\n${output}` : output;
    navigator.clipboard.writeText(text);
  };

  const hasContent = !!output || !!error;

  return (
    <div className={`h-full flex flex-col ${theme === 'dark' ? 'bg-[#0D1117] text-white' : 'bg-[#F8F9FA] text-slate-900'}`}>
      {/* Header */}
      <div className="h-10 flex items-center justify-between px-4 border-b border-slate-200 dark:border-[#30363D]">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-500" />
          <span className="text-[11px] font-bold uppercase tracking-wider opacity-70">Terminal</span>
          {executionTime !== undefined && (
            <span className="text-[10px] font-mono opacity-50 ml-2">
              {executionTime}ms
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-7 w-7 opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
            title="Clear"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-7 w-7 opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
            title="Copy"
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto p-4 font-mono text-[13px] leading-relaxed scroll-smooth"
      >
        {isRunning ? (
          <div className="flex items-center gap-2 text-blue-500 opacity-80 mb-2">
            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Running program...</span>
          </div>
        ) : !hasContent && !stdin ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 opacity-30 select-none">
            <Play className="w-8 h-8" />
            <p className="text-xs">Program output will appear here</p>
          </div>
        ) : null}

        {error && (
          <pre className="whitespace-pre-wrap break-words text-red-500 bg-red-500/5 p-2 rounded mb-2 border border-red-500/10">
            {error}
          </pre>
        )}

        {output && (
          <pre className="whitespace-pre-wrap break-words mb-4">
            {output}
          </pre>
        )}

        {/* Interactive-looking Stdin Area */}
        <div className="mt-auto border-t border-slate-200 dark:border-[#30363D] pt-4">
          <div className="flex items-start gap-2 group">
            <div className="mt-1">
              <ChevronRight className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block mb-1 opacity-70 group-hover:opacity-100 transition-opacity">
                Input (Custom Input Panel)
              </label>
              <textarea
                value={stdin}
                onChange={(e) => onStdinChange(e.target.value)}
                placeholder="Enter input for your program here..."
                className="w-full bg-transparent outline-none resize-none font-mono text-[13px] leading-relaxed placeholder:opacity-30 min-h-[60px]"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 border-t border-slate-200 dark:border-[#30363D] bg-slate-50/50 dark:bg-black/20">
        <p className="text-[10px] opacity-40 font-medium italic">
          Tip: Provide input before clicking Run. Programs requiring input will wait for these values.
        </p>
      </div>
    </div>
  );
}