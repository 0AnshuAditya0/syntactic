import { Language } from '@/lib/playground/templates';
import { 
  FileCode, 
  Save, 
  RotateCcw, 
  Play, 
  Code2,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PlaygroundNavProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onRun: () => void;
  onSave: () => void;
  onReset: () => void;
  onFiles: () => void;
  isRunning: boolean;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const languages: { id: Language; label: string }[] = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
  { id: 'go', label: 'Go' },
  { id: 'rust', label: 'Rust' },
];

export function PlaygroundNav({ 
  language, 
  onLanguageChange, 
  onRun, 
  onSave, 
  onReset, 
  onFiles,
  isRunning,
  theme,
  onThemeToggle
}: PlaygroundNavProps) {
  
  return (
    <>
      {/* Desktop Toolbar - Normal */}
      <div className="h-14 hidden md:flex items-center justify-between px-4 border-b border-gray-200 dark:border-[#30363D] bg-white transition-colors duration-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Code2 className="w-5 h-5" />
            <span className="font-semibold text-sm tracking-tight">Code Playground</span>
          </div>
          
          <Select value={language} onValueChange={(val) => onLanguageChange(val as Language)}>
            <SelectTrigger className="h-9 min-w-[130px] border-gray-200 bg-white hover:bg-gray-50 text-gray-700">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.id}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={onThemeToggle}
            className="h-9 w-9 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center gap-2 pr-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onFiles}
            className="h-9 px-3 gap-2 text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all font-medium"
          >
            <FileCode className="w-4 h-4" />
            <span>Files</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onSave}
            className="h-9 px-3 gap-2 text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all font-medium"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onReset}
            className="h-9 px-3 gap-2 text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </Button>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <Button 
            size="sm"
            onClick={onRun}
            disabled={isRunning}
            className="h-9 px-4 gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm border-0 transition-all font-medium"
          >
            {isRunning ? (
              <span className="animate-spin mr-1">⟳</span>
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </div>
      </div>

      {/* Mobile Toolbar - Top (Compact) */}
      <div className="h-12 md:hidden flex items-center justify-between px-3 border-b border-gray-200 dark:border-[#30363D] bg-white">
        <div className="flex items-center gap-2 text-gray-700">
          <Code2 className="w-4 h-4" />
          <span className="font-semibold text-sm">Code Playground</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={language} onValueChange={(val) => onLanguageChange(val as Language)}>
            <SelectTrigger className="h-8 w-[100px] text-xs border-gray-200 bg-white text-gray-700 px-2">
              <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.id} className="text-xs">
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onThemeToggle}
            className="h-8 w-8 border-gray-200 text-gray-600"
          >
            {theme === 'light' ? (
              <Moon className="w-3.5 h-3.5" />
            ) : (
              <Sun className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Sticky Action Bar - Bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-4 md:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe-area-inset-bottom">
        <button onClick={onFiles} className="flex flex-col items-center gap-1 p-2 text-gray-600 active:scale-95 transition-transform">
          <FileCode className="w-5 h-5" />
          <span className="text-[10px] font-medium">Files</span>
        </button>
        
        <button onClick={onSave} className="flex flex-col items-center gap-1 p-2 text-gray-600 active:scale-95 transition-transform">
          <Save className="w-5 h-5" />
          <span className="text-[10px] font-medium">Save</span>
        </button>
        
        <button onClick={onReset} className="flex flex-col items-center gap-1 p-2 text-gray-600 active:scale-95 transition-transform">
          <RotateCcw className="w-5 h-5" />
          <span className="text-[10px] font-medium">Reset</span>
        </button>

        <button 
          onClick={onRun}
          disabled={isRunning}
          className="flex flex-col items-center gap-1 px-5 py-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all active:bg-blue-700"
        >
          {isRunning ? (
            <span className="animate-spin mb-0.5">⟳</span>
          ) : (
            <Play className="w-5 h-5 fill-current mb-0.5" />
          )}
          <span className="text-[10px] font-bold tracking-wide">{isRunning ? '...' : 'Run'}</span>
        </button>
      </div>
    </>
  );
}
