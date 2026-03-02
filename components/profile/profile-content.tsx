'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, FileCode, Clock, Eye, Loader2 } from 'lucide-react';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  published_at: string;
  reading_time?: number;
  view_count?: number;
}

interface CodeFile {
  id: string;
  filename?: string;
  description?: string;
  language: string;
  created_at: string;
}

interface ProfileContentProps {
  initialPosts: Post[];
  initialCodeFiles: CodeFile[];
  counts: { posts: number; code: number };
  username: string;
}

export function ProfileContent({
  initialPosts,
  initialCodeFiles,
  counts,
  username
}: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<'posts' | 'code' | 'activity'>('posts');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
        {(['posts', 'code', 'activity'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-sm font-semibold uppercase tracking-wider transition-all relative ${activeTab === tab
                ? 'text-[#F29F67]'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
          >
            {tab === 'posts' && `Posts (${counts.posts})`}
            {tab === 'code' && `Snippets (${counts.code})`}
            {tab === 'activity' && `Activity`}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F29F67]" />
            )}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {initialPosts.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <User className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-lg">No published posts yet</p>
              </div>
            ) : (
              initialPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  className="block p-5 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 hover:border-[#F29F67]/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#F29F67]">{post.title}</h3>
                  {post.excerpt && <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 text-sm">{post.excerpt}</p>}
                  <div className="flex items-center gap-4 text-xs font-medium text-gray-500 uppercase">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(post.published_at).toLocaleDateString()}</span>
                    {post.reading_time && <span className="flex items-center gap-1.5">• {post.reading_time} min read</span>}
                    <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> {post.view_count || 0}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-4">
            {initialCodeFiles.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <FileCode className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="text-lg">No public snippets yet</p>
              </div>
            ) : (
              initialCodeFiles.map((file) => (
                <div
                  key={file.id}
                  className="p-5 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/30 hover:border-[#F29F67]/50 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileCode className="w-4 h-4 text-[#F29F67]" />
                        <h3 className="font-bold text-lg">{file.filename || 'Untitled Snippet'}</h3>
                      </div>
                      {file.description && <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">{file.description}</p>}
                      <div className="flex items-center gap-4">
                        <span className="px-2.5 py-1 bg-[#F29F67]/10 text-[#F29F67] text-xs font-bold rounded">
                          {file.language}
                        </span>
                        <span className="text-xs text-gray-400 font-medium tracking-tight">
                          {new Date(file.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="text-center py-16 text-gray-500">
            <Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin opacity-20" />
            <p className="text-lg">Activity feed coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
