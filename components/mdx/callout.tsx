import { AlertCircle, Info, Lightbulb, AlertTriangle } from 'lucide-react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip' | 'danger';
  children: React.ReactNode;
}

const calloutStyles = {
  info: {
    container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
    Icon: Info,
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400',
    Icon: AlertTriangle,
  },
  tip: {
    container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
    Icon: Lightbulb,
  },
  danger: {
    container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400',
    Icon: AlertCircle,
  },
};

export function Callout({ type = 'info', children }: CalloutProps) {
  const style = calloutStyles[type];
  const Icon = style.Icon;

  return (
    <div className={`flex gap-3 p-4 border rounded-lg my-4 ${style.container}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.icon}`} />
      <div className="flex-1 text-sm">{children}</div>
    </div>
  );
}
