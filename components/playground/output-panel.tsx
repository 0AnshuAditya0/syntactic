import { Trash2, Copy, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OutputPanelProps {
  output: string;
  error?: string;
  onClear: () => void;
}

export function OutputPanel({ output, error, onClear }: OutputPanelProps) {
  
  const handleCopy = () => {
    const text = error ? `${error}\n${output}` : output;
    navigator.clipboard.writeText(text);
  };

  const hasContent = !!output || !!error;

  return (
    <div className="h-full flex flex-col transition-colors duration-200">
      <div className="h-10 flex items-center justify-between px-4 border-b border-inherit">
        <span className="text-xs font-medium opacity-60 uppercase tracking-wider text-inherit">Output</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-7 w-7 opacity-60 hover:opacity-100 hover:bg-black/5"
            title="Clear output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="h-7 w-7 opacity-60 hover:opacity-100 hover:bg-black/5"
            title="Copy output"
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 font-mono text-[13px] leading-relaxed">
        {!hasContent ? (
          <div className="h-full flex flex-col items-center justify-center opacity-40 gap-3 select-none">
            <Play className="w-8 h-8" />
            <p>Click &apos;Run&apos; or press Ctrl+Enter to execute</p>
          </div>
        ) : (
          <div className="space-y-2">
             {/* Explicitly setting text colors as requested for dark mode visibility */}
            {error && (
              <pre className="whitespace-pre-wrap break-words text-[#DC2626] dark:text-[#F87171]">
                {error}
              </pre>
            )}
            {output && (
              <pre className="whitespace-pre-wrap break-words text-[#1F2937] dark:text-[#E6EDF3]">
                {output}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}