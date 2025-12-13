'use client';

// Override the theme provider for the playground to prevent global hydration issues if any,
// but actually we just return children as we handle layout in the page.
// The main issue was `Header` overlap, which is fixed in `Header.tsx`.
// We can use this layout to ensure full height.

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full overflow-hidden pt-24 pb-4 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="h-full w-full rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
        {children}
      </div>
    </div>
  );
}
