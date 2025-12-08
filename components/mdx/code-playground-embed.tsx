'use client';

import { useState } from 'react';
import { Play, ExternalLink, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/playground/code-editor';
import { OutputPanel } from '@/components/playground/output-panel';
import { Language } from '@/lib/playground/templates';
import { executeJavaScript } from '@/lib/playground/javascript-executor';
import Link from 'next/link';

interface CodePlaygroundEmbedProps {
  initialCode: string;
  language: Language;
  readOnly?: boolean;
}

export function CodePlaygroundEmbed({ initialCode, language, readOnly = false }: CodePlaygroundEmbedProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [executionTime, setExecutionTime] = useState<number | undefined>();
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);

  const handleRun = async () => {
    setIsRunning(true);
    setShowOutput(true);
    setOutput('');
    setError(undefined);
    setExecutionTime(undefined);

    try {
      if (language === 'javascript') {
        const result = await executeJavaScript(code);
        setOutput(result.output);
        setError(result.error);
        setExecutionTime(result.executionTime);
      } else {
        const response = await fetch('/api/playground/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language }),
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || 'Failed to execute code');
          return;
        }

        setOutput(result.output);
        setError(result.error);
        setExecutionTime(result.executionTime);
      }
    } catch (err) {
      // Fixed: Properly type the error
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    setError(undefined);
    setExecutionTime(undefined);
    setShowOutput(false);
  };

  return (
    <div className="my-6 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase text-muted-foreground">{language} Playground</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleReset} className="h-7 px-2">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
          <Link href="/playground" target="_blank">
            <Button variant="ghost" size="sm" className="h-7 px-2">
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <Button 
            size="sm" 
            onClick={handleRun} 
            disabled={isRunning}
            className="h-7 px-3 bg-green-600 hover:bg-green-700 text-white text-xs"
          >
            <Play className="w-3 h-3 mr-1.5" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="h-[300px]">
        <CodeEditor
          value={code}
          onChange={readOnly ? () => {} : setCode}
          language={language}
          onRun={handleRun}
        />
      </div>

      {/* Output (Collapsible) */}
      {showOutput && (
        <div className="h-[200px] border-t border-gray-200 dark:border-gray-800">
          <OutputPanel
            output={output}
            error={error}
            executionTime={executionTime}
            isRunning={isRunning}
            onClear={() => setShowOutput(false)}
          />
        </div>
      )}
    </div>
  );
}