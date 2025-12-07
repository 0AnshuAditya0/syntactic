'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'strict',
      fontFamily: 'inherit',
    });

    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError('');
      } catch (err: any) {
        console.error('Mermaid rendering error:', err);
        setError('Failed to render diagram');
      }
    };

    renderDiagram();
  }, [chart]);

  if (error) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm">
        {error}
        <pre className="mt-2 text-xs opacity-75 overflow-auto">{chart}</pre>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="my-6 flex justify-center overflow-x-auto p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
