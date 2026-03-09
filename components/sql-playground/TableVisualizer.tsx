'use client';

import { Database, Table as TableIcon, Timer, AlertCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ColumnSchema {
  name: string;
  type?: string;
}

interface TableSchema {
  name: string;
  columns: ColumnSchema[];
}

interface TableVisualizerProps {
  schema: TableSchema[];
  rows: Record<string, unknown>[];
  columns: string[];
  message?: string;
  executionTime?: number;
  error?: string | null;
}

export function TableVisualizer({ schema, rows, columns, message, executionTime, error }: TableVisualizerProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600 dark:text-blue-300" />
            <CardTitle className="text-base">Schema</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {schema.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-300">No tables yet. Run a CREATE TABLE statement to see it here.</p>
          )}
          {schema.map((table) => (
            <div key={table.name} className="rounded-md border border-slate-200 dark:border-slate-800 p-3">
              <div className="flex items-center gap-2 mb-2">
                <TableIcon className="w-4 h-4 text-slate-500" />
                <p className="font-semibold text-sm">{table.name}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {table.columns.map((col) => (
                  <Badge key={col.name} variant="secondary" className="text-xs">
                    {col.name}
                    {col.type ? ` (${col.type})` : ''}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader className="space-y-2 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
              <CardTitle className="text-base">Query Results</CardTitle>
            </div>
            {executionTime !== undefined && (
              <div className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-300">
                <Timer className="w-3.5 h-3.5" />
                {executionTime} ms
              </div>
            )}
          </div>
          {message && <p className="text-xs text-slate-500 dark:text-slate-300">{message}</p>}
          {error && (
            <div className="inline-flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="overflow-auto">
          {!error && rows.length === 0 && !message && (
            <p className="text-sm text-slate-500 dark:text-slate-300">Run a SELECT query to see rows here.</p>
          )}
          {!error && rows.length === 0 && message && (
            <p className="text-sm text-slate-500 dark:text-slate-300">{message}</p>
          )}
          {!error && rows.length > 0 && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-md overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800/60">
                  <tr>
                    {columns.map((col) => (
                      <th key={col} className="text-left px-3 py-2 font-semibold text-slate-700 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={idx} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800/60">
                      {columns.map((col) => (
                        <td key={col} className="px-3 py-2 border-b border-slate-200 dark:border-slate-800 align-top">
                          <span className="break-all">{formatCell(row[col])}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function formatCell(value: unknown) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

