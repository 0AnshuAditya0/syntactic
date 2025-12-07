'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Settings, Eye, Code } from 'lucide-react';
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
  published,
}: EditorLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Toolbar */}
      <header className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 bg-white dark:bg-gray-900 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800" />
          <h1 className="font-medium truncate max-w-[200px] sm:max-w-md">
            {title || 'Untitled Post'}
          </h1>
          {saving && (
            <span className="text-xs text-muted-foreground animate-pulse">
              Saving...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePreview}
            className="hidden sm:flex"
          >
            {showPreview ? (
              <>
                <Code className="w-4 h-4 mr-2" />
                Edit
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>

          <Button variant="ghost" size="icon" onClick={onOpenSettings}>
            <Settings className="w-4 h-4" />
          </Button>

          <Button 
            size="sm" 
            className={published ? "bg-yellow-600 hover:bg-yellow-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"}
            onClick={onPublish}
            disabled={saving}
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
