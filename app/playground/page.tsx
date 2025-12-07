'use client';

import { useState } from 'react';
import { Play, RotateCcw, Save, FolderOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/playground/code-editor';
import { OutputPanel } from '@/components/playground/output-panel';
import { LanguageSelector } from '@/components/playground/language-selector';
import { SaveDialog } from '@/components/playground/save-dialog';
import { FileTree } from '@/components/playground/file-tree';
import { Language, templates } from '@/lib/playground/templates';
import { executeJavaScript } from '@/lib/playground/javascript-executor';

export default function PlaygroundPage() {
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(templates.javascript);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [executionTime, setExecutionTime] = useState<number | undefined>();
  const [isRunning, setIsRunning] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showFileTree, setShowFileTree] = useState(false);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setCode(templates[newLanguage]);
    handleClear();
  };

  const handleRun = async () => {
    setIsRunning(true);
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setOutput('');
    setError(undefined);
    setExecutionTime(undefined);
  };

  const handleReset = () => {
    setCode(templates[language]);
    handleClear();
  };

  const handleSaved = (fileId: string) => {
    setShowSaveDialog(false);
    alert('File saved successfully!');
  };

  interface FileItem {
    language: Language;
    code: string;
  }

  const handleFileSelect = (file: FileItem) => {
    setLanguage(file.language);
    setCode(file.code);
    setShowFileTree(false);
    handleClear();
  };

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900 pt-16">
      {/* Sidebar - File Tree */}
      {showFileTree && (
        <div className="w-64 border-r-2 border-gray-300 dark:border-gray-700 overflow-y-auto bg-[#F5F5F7] dark:bg-gray-800">
          <div className="p-4 border-b-2 border-gray-300 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[#1E1E2C] dark:text-white">Files</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowFileTree(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <FileTree onFileSelect={handleFileSelect} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-14 border-b-2 border-gray-300 dark:border-gray-700 flex items-center justify-between px-4 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-[#1E1E2C] dark:text-white">Code Playground</h1>
            <LanguageSelector value={language} onChange={handleLanguageChange} />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowFileTree(!showFileTree)}>
              <FolderOpen className="w-4 h-4 mr-2" />
              Files
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowSaveDialog(!showSaveDialog)}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button 
              size="sm" 
              onClick={handleRun} 
              disabled={isRunning}
              className="bg-[#F29F67] hover:bg-[#E08D55] text-[#1E1E2C]"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Run'}
            </Button>
          </div>
        </div>

        {/* Editor and Output */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          <div className="flex flex-col h-full overflow-auto border-r-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="p-4 border-b-2 border-gray-300 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-[#1E1E2C] dark:text-white mb-2">Code Editor</h3>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <CodeEditor
                value={code}
                onChange={setCode}
                language={language}
                onRun={handleRun}
              />
            </div>
            {showSaveDialog && (
              <div className="flex-shrink-0 p-4 border-t-2 border-gray-300 dark:border-gray-700">
                <SaveDialog
                  code={code}
                  language={language}
                  onSaved={handleSaved}
                />
              </div>
            )}
          </div>
          
          <div className="flex flex-col h-full overflow-auto bg-[#F5F5F7] dark:bg-gray-800">
            <div className="p-4 border-b-2 border-gray-300 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-[#1E1E2C] dark:text-white mb-2">Output</h3>
            </div>
            <div className="flex-1 overflow-auto">
              <OutputPanel
                output={output}
                error={error}
                executionTime={executionTime}
                isRunning={isRunning}
                onClear={handleClear}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-10 border-t-2 border-gray-300 dark:border-gray-700 flex items-center justify-between px-4 text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900">
          <span>Press Ctrl+Enter to run code</span>
          <span>
            {language === 'javascript' 
              ? 'Running locally in Web Worker' 
              : 'Running via Piston API'}
          </span>
        </div>
      </div>
    </div>
  );
}
