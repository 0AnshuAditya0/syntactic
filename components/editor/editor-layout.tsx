'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Settings, Eye, Code, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface EditorLayoutProps {
  children: ReactNode;
  title: string;
  saving: boolean;
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
  onSave,
  onTogglePreview,
  showPreview,
  onOpenSettings,
  onPublish,
  onDelete,
  published,
}: EditorLayoutProps) {
  return (
// Adjusting layout to avoid navbar overlap
    <div className="h-screen pt-20 flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
      {/* Toolbar */}
      <header className="h-16 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex flex-col">
            <h1 className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-md text-base sm:text-lg leading-tight">
              {title || 'Untitled Post'}
            </h1>
            {saving ? (
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#F29F67] animate-pulse">
                Saving...
              </span>
            ) : (
                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-300 dark:text-gray-600">
                Saved
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePreview}
            className="hidden sm:flex text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {showPreview ? (
              <>
                <Code className="w-4 h-4 mr-2" />
                Editor
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </>
            )}
          </Button>

          {onDelete && (
             <Button
              variant="ghost" 
              size="icon"
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              onClick={onDelete}
              title="Delete Post"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden sm:block" />

          <Button variant="ghost" size="icon" onClick={onOpenSettings} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <Settings className="w-5 h-5" />
          </Button>

          <Button 
            size="sm" 
            className={`font-medium shadow-sm transition-all px-6 rounded-full ${
              published 
                ? "bg-yellow-500 hover:bg-yellow-600 text-white border-none" 
                : "bg-black dark:bg-white text-white dark:text-black hover:opacity-90"
            }`}
            onClick={onPublish}
          >
            {published ? 'Unpublish' : 'Publish'}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
}
