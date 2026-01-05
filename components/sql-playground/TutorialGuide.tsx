'use client';

import { Lightbulb, ListChecks } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Step {
  title: string;
  description: string;
  example?: string;
}

interface TutorialGuideProps {
  steps: Step[];
}

export function TutorialGuide({ steps }: TutorialGuideProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-blue-600 dark:text-blue-300" />
          <CardTitle className="text-base">Quick start guide</CardTitle>
        </div>
        <Badge variant="secondary" className="text-[11px]">Client-side</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-md border border-slate-200 dark:border-slate-800 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[11px] px-2 py-1">{index + 1}</Badge>
              <p className="font-semibold text-sm">{step.title}</p>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
            {step.example && (
              <div className="text-xs rounded-md bg-slate-50 dark:bg-slate-800/80 border border-dashed border-slate-200 dark:border-slate-700 px-3 py-2 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5" />
                <pre className="whitespace-pre-wrap break-words text-slate-700 dark:text-slate-200">{step.example}</pre>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

