'use client';

import { useState } from 'react';
import { Share2, Twitter, Linkedin, Facebook, Link2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialShareProps {
  url: string;
  title: string;
}

export function SocialShare({ url, title }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowMenu(!showMenu)}
        className="border-2 border-gray-300 dark:border-gray-600 hover:border-[#F29F67] hover:bg-[#F29F67]/10"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>

      {showMenu && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-2 border-gray-300 dark:border-gray-700 z-20 overflow-hidden">
            <div className="p-2 space-y-1">
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                <span className="text-sm font-medium">Share on Twitter</span>
              </a>

              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-[#0A66C2]" />
                <span className="text-sm font-medium">Share on LinkedIn</span>
              </a>

              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Facebook className="w-5 h-5 text-[#1877F2]" />
                <span className="text-sm font-medium">Share on Facebook</span>
              </a>

              <div className="my-2 border-t-2 border-gray-200 dark:border-gray-600" />

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Link copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium">Copy link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
