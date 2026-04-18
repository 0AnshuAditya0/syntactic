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
    <div className="h-screen pt-20 flex flex-col bg-gray-50 overflow-hidden font-sans">
      <header className="h-16 border-b-2 border-gray-100 flex items-center justify-between px-6 bg-white z-30 shrink-0 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-5">
          <Link
            href="/dashboard"
            className="p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-xl hover:bg-gray-50"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="h-5 w-px bg-gray-100" />

          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">STORY</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter max-w-[180px] truncate">
                {title || 'Untitled Story'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-100 bg-gray-50">
              {saving || isPublishing ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F29F67] animate-pulse" />
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">
                    {isPublishing ? 'Syncing' : 'Saving'}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wider">Saved</span>
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
            className="hidden sm:flex text-gray-400 hover:text-gray-900 hover:bg-gray-50 h-9 px-4 rounded-xl text-xs font-bold uppercase tracking-wider gap-2"
          >
            {showPreview ? (
              <><Code className="w-3.5 h-3.5" /> Editor</>
            ) : (
              <><Eye className="w-3.5 h-3.5" /> Preview</>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
            className="h-9 w-9 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
          >
            <Settings className="w-4 h-4" />
          </Button>

          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-200 hover:text-red-500 hover:bg-red-50 transition-colors rounded-xl"
              onClick={onDelete}
              title="Delete Forever"
              disabled={isPublishing || saving}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}

          <div className="h-5 w-px bg-gray-100 mx-1" />

          <Button
            size="sm"
            className={`h-9 px-6 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all shadow-sm ${
              published
                ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100'
                : 'bg-[#F29F67] hover:bg-[#E28F57] text-white border-none shadow-[#F29F67]/30 shadow-md'
            }`}
            onClick={onPublish}
            disabled={isPublishing}
          >
            {isPublishing ? (
              <Loader2 className="w-3 h-3 animate-spin mr-2" />
            ) : null}
            {published ? 'Published ✓' : 'Publish Story'}
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative">
        <div className="h-full w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
