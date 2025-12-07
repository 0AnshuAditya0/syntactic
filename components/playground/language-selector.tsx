'use client';

import { Language, languageInfo } from '@/lib/playground/templates';
import { Code2 } from 'lucide-react';

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const languages: Language[] = ['javascript', 'python', 'java', 'cpp', 'c'];

  return (
    <div className="flex items-center gap-2">
      <Code2 className="w-4 h-4 text-muted-foreground" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Language)}
        className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {languageInfo[lang].name}
          </option>
        ))}
      </select>
    </div>
  );
}
