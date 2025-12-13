'use client';

import { useState } from 'react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { PlaygroundNav } from '@/components/playground/playground-nav';
import { CodeEditorWrapper } from '@/components/playground/code-editor-wrapper';
import { OutputPanel } from '@/components/playground/output-panel';
import { StatusBar } from '@/components/playground/status-bar';
import { ResizeHandle } from '@/components/playground/resize-handle';
import { Language, templates } from '@/lib/playground/templates';
import { executeJavaScript } from '@/lib/playground/javascript-executor';

import { useMediaQuery } from '@/hooks/use-media-query';

export default function Playground() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const direction = isMobile ? 'vertical' : 'horizontal';

  // Theme state for EDITOR/OUTPUT ONLY. The UI generally stays light/neutral.
  const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>('light');
  
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(templates.javascript);
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setCode(templates[newLanguage]);
    handleClear();
  };

  const handleClear = () => {
    setOutput('');
    setError(undefined);
  };

  const handleRun = async () => {
    setIsRunning(true);
    handleClear();

    try {
      if (language === 'javascript') {
        const result = await executeJavaScript(code);
        setOutput(result.output);
        setError(result.error);
      } else {
        const response = await fetch('/api/playground/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error);
        setOutput(result.output);
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || 'Execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-white overflow-hidden">
      {/* Navigation - Always Light/Neutral */}
      <PlaygroundNav 
        language={language}
        onLanguageChange={handleLanguageChange}
        onRun={handleRun}
        onSave={() => alert('Save functionality')}
        onReset={() => { setCode(templates[language]); handleClear(); }}
        onFiles={() => alert('File tree functionality')}
        isRunning={isRunning}
        theme={editorTheme}
        onThemeToggle={() => setEditorTheme(prev => prev === 'light' ? 'dark' : 'light')}
      />
      
      {/* Resizable Panels */}
      <div className="flex-1 overflow-hidden relative">
        <PanelGroup 
          direction={direction} 
          autoSaveId="playground-layout"
          key={direction} // Force re-render when direction changes to avoid layout bugs
        >
          {/* Editor Panel */}
          <Panel defaultSize={60} minSize={30} className={editorTheme === 'dark' ? 'bg-[#0D1117]' : 'bg-white'}>
            <CodeEditorWrapper 
              value={code}
              onChange={setCode}
              language={language}
              theme={editorTheme}
              onRun={handleRun}
            />
          </Panel>
          
          <ResizeHandle direction={direction} />
          
          {/* Output Panel */}
          <Panel 
            defaultSize={40} 
            minSize={20} 
            className={`
              ${editorTheme === 'dark' ? 'bg-[#0D1117]' : 'bg-[#F8F9FA]'}
              ${direction === 'horizontal' 
                ? (editorTheme === 'dark' ? 'border-l-2 border-[#30363D]' : 'border-l-2 border-[#E5E7EB]') 
                : (editorTheme === 'dark' ? 'border-t-2 border-[#30363D]' : 'border-t-2 border-[#E5E7EB]')
              }
            `}
          >
            <OutputPanel 
              output={output}
              error={error}
              onClear={handleClear}
            />
          </Panel>
        </PanelGroup>
      </div>
      
      {/* Status Bar */}
      <StatusBar 
        theme={editorTheme} 
        onThemeToggle={() => setEditorTheme(prev => prev === 'light' ? 'dark' : 'light')}
        isRunningLocally={language === 'javascript'} 
      />
    </div>
  );
}
