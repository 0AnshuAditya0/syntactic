'use client';

import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from content
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const matches = Array.from(content.matchAll(headingRegex));
    
    const extractedHeadings = matches.map((match) => {
      const level = match[1].length;
      const text = match[2];
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      return { id, text, level };
    });

    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24 hidden lg:block">
      <h3 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100">
        On This Page
      </h3>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 1) * 0.75}rem` }}
          >
            <a
              href={`#${heading.id}`}
              className={`block py-1 transition-colors ${
                activeId === heading.id
                  ? 'text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
