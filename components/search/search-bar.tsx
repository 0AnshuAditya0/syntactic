'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E5E7EB]/50" />
      <input
        type="search"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-9 pr-4 py-2 text-sm bg-[#1E1F2E]/60 backdrop-blur-sm border border-[#6366FF]/20 rounded-lg text-white placeholder:text-[#E5E7EB]/50 focus:outline-none focus:border-[#6366FF]/50 focus:bg-[#1E1F2E]/80 transition-all"
      />
    </form>
  );
}
