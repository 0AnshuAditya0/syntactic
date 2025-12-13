interface StatusBarProps {
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  isRunningLocally?: boolean;
}

export function StatusBar({ theme, onThemeToggle, isRunningLocally = true }: StatusBarProps) {
  return (
    <div className="h-8 flex items-center justify-between px-4 border-t border-gray-200 bg-[#F9FAFB] transition-colors duration-200 select-none">
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded border border-gray-300 bg-gray-100 font-sans text-[10px]">
            Ctrl
          </kbd>
          <span>+</span>
          <kbd className="px-1.5 py-0.5 rounded border border-gray-300 bg-gray-100 font-sans text-[10px]">
            Enter
          </kbd>
          <span className="ml-1">to run</span>
        </div>
        
        <span className="w-px h-3 bg-gray-300" />
        
        <span>{isRunningLocally ? 'Running locally' : 'Remote execution'}</span>
      </div>

      {/* Theme toggle removed from here as per request */}
      <div className="text-xs text-gray-400">
        Ready
      </div>
    </div>
  );
}
