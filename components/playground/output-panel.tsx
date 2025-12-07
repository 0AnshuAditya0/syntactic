'use client';

import { X, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OutputPanelProps {
  output: string;
  error?: string;
  executionTime?: number;
  isRunning: boolean;
  onClear: () => void;
}

export function OutputPanel({ output, error, executionTime, isRunning, onClear }: OutputPanelProps) {
  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Output</span>
          {executionTime !== undefined && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {executionTime}ms
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {isRunning ? (
          <div className="text-muted-foreground">Running code...</div>
        ) : error ? (
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold">Error</div>
                <pre className="whitespace-pre-wrap mt-1">{error}</pre>
              </div>
            </div>
            {output && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="text-xs text-muted-foreground mb-1">Output before error:</div>
                <pre className="whitespace-pre-wrap">{output}</pre>
              </div>
            )}
          </div>
        ) : output ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs">
              <CheckCircle className="w-3 h-3" />
              <span>Executed successfully</span>
            </div>
            <pre className="whitespace-pre-wrap">{output}</pre>
          </div>
        ) : (
          <div className="text-muted-foreground">
            Click "Run" or press Ctrl+Enter to execute your code
          </div>
        )}
      </div>
    </div>
  );
}
