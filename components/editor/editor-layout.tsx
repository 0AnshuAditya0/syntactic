import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, Eye, Code, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface EditorLayoutProps {
  children: ReactNode;
  title: string;
  saving: boolean;
  isPublishing?: boolean;
  onSave: () => void;
  onTogglePreview: () => void;
  showPreview: boolean;
  onOpenSettings: () => void;
  onPublish: () => void;
  onDelete?: () => void;
  published: boolean;
}

export function EditorLayout({
  children,
  title,
  saving,
  isPublishing = false,
  onSave,
  onTogglePreview,
  showPreview,
  onOpenSettings,
  onPublish,
  onDelete,
  published,
}: EditorLayoutProps) {
  return (
    <div className="h-screen pt-20 flex flex-col bg-[#F8F9FA] overflow-hidden font-sans">
      {/* Header Toolbar */}
      <header className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white/80 backdrop-blur-xl z-30 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="h-4 w-px bg-gray-100 dark:bg-gray-800" />

          <div className="flex items-center gap-3 min-w-0">
            <span className="text-sm font-medium text-gray-400 dark:text-gray-500 truncate max-w-[120px] sm:max-w-xs uppercase tracking-tight">
              {title || 'Untitled Story'}
            </span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              {saving || isPublishing ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F29F67] animate-pulse" />
                  <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {isPublishing ? 'Syncing...' : 'Saving...'}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Cloud</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePreview}
            className="hidden sm:flex text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 h-8 px-3 rounded-lg"
          >
            {showPreview ? (
              <><Code className="w-4 h-4 mr-2" /> Editor</>
            ) : (
              <><Eye className="w-4 h-4 mr-2" /> Preview</>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
            className="h-8 w-8 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg"
          >
            <Settings className="w-4 h-4" />
          </Button>

          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors rounded-lg"
              onClick={onDelete}
              title="Delete Forever"
              disabled={isPublishing || saving}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}

          <div className="h-4 w-px bg-gray-100 dark:bg-gray-800 mx-1" />

          <Button
            size="sm"
            className={`h-8 px-5 rounded-lg text-xs font-bold transition-all shadow-sm ${published
              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
              : "bg-[#F29F67] hover:bg-[#E28F57] text-white border-none"
              }`}
            onClick={onPublish}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <Loader2 className="w-3 h-3 animate-spin mr-2" />
            ) : null}
            {published ? 'Published' : 'Publish Story'}
          </Button>
        </div>
      </header>

      {/* Surface Canvas */}
      <main className="flex-1 overflow-hidden relative bg-[#F4F5F7]">
        <div className="h-full w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
