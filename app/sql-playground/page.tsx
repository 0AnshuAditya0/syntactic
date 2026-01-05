'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { SqlLayout } from '@/components/sql-playground/SqlLayout';
import { SqlEditor } from '@/components/sql-playground/SqlEditor';
import { TableVisualizer } from '@/components/sql-playground/TableVisualizer';
import { TutorialGuide } from '@/components/sql-playground/TutorialGuide';

interface ColumnSchema {
  name: string;
  type?: string;
}

interface TableSchema {
  name: string;
  columns: ColumnSchema[];
}

const DB_NAME = 'syntactic_sql_playground';

const SEED_SCRIPT = `
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS orders;

CREATE TABLE customers (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  city VARCHAR(50)
);

CREATE TABLE orders (
  id INT PRIMARY KEY,
  customer_id INT,
  total DECIMAL(10,2),
  created_at DATE
);

INSERT INTO customers VALUES
  (1, 'Ada Lovelace', 'London'),
  (2, 'Alan Turing', 'Manchester'),
  (3, 'Grace Hopper', 'New York'),
  (4, 'Margaret Hamilton', 'Pittsburgh');

INSERT INTO orders VALUES
  (101, 1, 149.99, '2024-03-12'),
  (102, 1, 89.50, '2024-04-05'),
  (103, 2, 230.00, '2024-04-21'),
  (104, 3, 410.25, '2024-05-02'),
  (105, 3, 79.99, '2024-05-14'),
  (106, 4, 120.00, '2024-06-01');
`;

const STARTER_QUERY = `-- Start here or write your own SQL
SELECT
  c.name AS customer,
  COUNT(o.id) AS orders,
  ROUND(SUM(o.total), 2) AS total_spent,
  MIN(o.created_at) AS first_order
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.name
ORDER BY total_spent DESC;`;

const GUIDE_STEPS = [
  {
    title: 'Create database & use it',
    description: 'You are working in a dedicated in-memory database. Switch with USE if you add more.',
    example: 'CREATE DATABASE sandbox; USE sandbox;',
  },
  {
    title: 'Create tables',
    description: 'Define your schema before inserting rows. AlaSQL supports most SQL92 column definitions.',
    example: 'CREATE TABLE todos (id INT PRIMARY KEY, title STRING, done BIT DEFAULT 0);',
  },
  {
    title: 'Insert sample data',
    description: 'Populate the tables with rows. Multiple statements are allowed in one run.',
    example: "INSERT INTO todos VALUES (1, 'ship feature', 0), (2, 'write tests', 1);",
  },
  {
    title: 'Query & visualize',
    description: 'Run SELECT, JOIN, GROUP BY, and aggregate functions. Results render instantly below.',
    example: 'SELECT title FROM todos WHERE done = 0 ORDER BY id;',
  },
];

export default function SqlPlaygroundPage() {
  const [query, setQuery] = useState(STARTER_QUERY);
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [message, setMessage] = useState<string | undefined>();
  const [executionTime, setExecutionTime] = useState<number | undefined>();
  const [schema, setSchema] = useState<TableSchema[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const alasqlRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  const helperText = useMemo(
    () => 'Client-side only. Data resets when you reload the page. Press Ctrl+Enter to run your query.',
    []
  );

  const bootstrapDatabase = useCallback(() => {
    const alasql = alasqlRef.current;
    if (!alasql) return;
    alasql(`DROP DATABASE IF EXISTS ${DB_NAME}`);
    alasql(`CREATE DATABASE ${DB_NAME}; USE ${DB_NAME};`);
    alasql(SEED_SCRIPT);
    setSchema(readSchema(alasql));
  }, []);

  const applyResult = useCallback((result: any, time?: number) => {
    const normalized = normalizeResult(result);
    setRows(normalized.rows);
    setColumns(normalized.columns);
    setMessage(normalized.message);
    setExecutionTime(time);
  }, []);

  const previewData = useCallback(() => {
    const alasql = alasqlRef.current;
    if (!alasql) return;
    alasql(`USE ${DB_NAME};`);
    const preview = alasql('SELECT * FROM orders LIMIT 5;');
    applyResult(preview);
  }, [applyResult]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const mod = await import('alasql');
      if (!mounted) return;
      alasqlRef.current = mod.default ?? mod;
      setReady(true);
      bootstrapDatabase();
      previewData();
    })();
    return () => {
      mounted = false;
    };
  }, [bootstrapDatabase, previewData]);

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    const started = performance.now();

    try {
      const alasql = alasqlRef.current;
      if (!alasql) throw new Error('SQL engine not ready yet. Please wait a moment.');
      alasql(`USE ${DB_NAME};`);
      const result = await alasql.promise(query);
      const duration = Math.max(1, Math.round(performance.now() - started));
      applyResult(result, duration);
    } catch (err: any) {
      setRows([]);
      setColumns([]);
      setExecutionTime(undefined);
      setMessage(undefined);
      setError(err?.message || 'Failed to run query');
    } finally {
      const alasql = alasqlRef.current;
      setSchema(readSchema(alasql));
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setQuery(STARTER_QUERY);
    setError(null);
    setExecutionTime(undefined);
    bootstrapDatabase();
    previewData();
  };

  return (
    <SqlLayout
      tutorial={<TutorialGuide steps={GUIDE_STEPS} />}
      editor={
        <SqlEditor
          value={query}
          onChange={setQuery}
          onRun={handleRun}
          onReset={handleReset}
          isRunning={isRunning}
          helperText={ready ? helperText : 'Loading SQL engine...'}
        />
      }
      visualizer={
        <TableVisualizer
          schema={schema}
          rows={rows}
          columns={columns}
          message={message}
          executionTime={executionTime}
          error={error}
        />
      }
    />
  );
}

function readSchema(alasqlInstance?: any): TableSchema[] {
  const db = alasqlInstance?.databases?.[DB_NAME];
  if (!db || !db.tables) return [];

  return Object.entries(db.tables)
    .filter(([, table]) => !(table as any).system)
    .map(([name, table]) => ({
      name,
      columns: ((table as any).columns || []).map((col: any) => ({
        name: col.columnid,
        type: col.dbtypeid || col.type || 'ANY',
      })),
    }));
}

function normalizeResult(result: any) {
  const resultList = Array.isArray(result) ? result : [result];
  const last = resultList[resultList.length - 1];

  const rows = Array.isArray(last) ? (last as Record<string, any>[]) : [];
  const columns = rows.length ? Object.keys(rows[0]) : [];

  const affected = resultList
    .filter((item) => typeof item === 'number')
    .reduce((acc, curr) => acc + Number(curr || 0), 0);

  let message: string | undefined;
  if (rows.length === 0 && typeof last === 'number') {
    message = `Affected rows: ${last}`;
  } else if (rows.length === 0 && last !== undefined && typeof last !== 'object') {
    message = `Result: ${String(last)}`;
  } else if (affected) {
    message = `Affected rows: ${affected}`;
  }

  return { rows, columns, message };
}

