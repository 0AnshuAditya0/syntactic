'use client';

import { ReactNode } from 'react';
import { Database } from 'lucide-react';

interface SqlLayoutProps {
  tutorial: ReactNode;
  editor: ReactNode;
  visualizer: ReactNode;
}

export function SqlLayout({ tutorial, editor, visualizer }: SqlLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <header className="space-y-2">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
            <Database className="w-4 h-4" />
            SQL Playground
          </p>
          <h1 className="text-3xl font-bold leading-tight">Practice SQL locally in your browser</h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
            Run queries with an in-memory database powered by AlaSQL. No backend required&mdash;perfect for quick experiments or learning the basics.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4">{tutorial}</div>
          <div className="space-y-4">
            {editor}
            {visualizer}
          </div>
        </div>
      </div>
    </div>
  );
}

