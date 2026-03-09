'use client';

import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  source: string;
};

type State = {
  error: Error | null;
};

export class MdxPreviewErrorBoundary extends (require('react').Component)<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.source !== this.props.source && this.state.error) {
      // Clear previous compilation error when content changes
      // so preview can recover as user types.
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <div className="text-sm font-semibold">MDX preview error</div>
        <div className="mt-1 text-xs opacity-90">
          Your draft contains invalid MDX syntax (common cause: an unescaped <code>{'{'}</code> starting a JS expression).
          Fix the syntax or wrap text in backticks / a code block.
        </div>
        <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-white/70 p-3 text-[11px] leading-relaxed">
{this.state.error.message}
        </pre>
      </div>
    );
  }
}

