'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Code2, PenSquare, User, Settings, LogOut, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Slide-in Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-[#1E1E2C] z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b-2 border-[#F29F67]/20">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#F29F67]/20">
                <Code2 className="w-4 h-4 text-[#F29F67]" />
              </div>
              <span className="text-white text-base font-bold">Syntactic</span>
            </div>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* User Section */}
          {user && profile && (
            <div className="p-4 border-b-2 border-[#F29F67]/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[#F29F67] flex items-center justify-center">
                  <span className="text-[#1E1E2C] text-sm font-bold">
                    {profile.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{profile.username}</p>
                  <p className="text-white/60 text-sm">{profile.display_name || 'User'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <Link
                href="/blog"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#F29F67]/20 transition-colors"
              >
                <span>Blog</span>
              </Link>
              <Link
                href="/playground"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#F29F67]/20 transition-colors"
              >
                <span>Playground</span>
              </Link>
              <Link
                href="/explore"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#F29F67]/20 transition-colors"
              >
                <span>Explore</span>
              </Link>
              <Link
                href="/search"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#F29F67]/20 transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </Link>
            </div>

            {user && profile && (
              <>
                <div className="my-4 border-t-2 border-[#F29F67]/20"></div>
                <div className="space-y-2">
                  <Link
                    href="/editor"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#F29F67] text-[#1E1E2C] font-semibold hover:bg-[#E08D55] transition-colors"
                  >
                    <PenSquare className="w-4 h-4" />
                    <span>Write</span>
                  </Link>
                  <Link
                    href={`/profile/${profile.username}`}
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#F29F67]/20 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/settings"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#F29F67]/20 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                </div>
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t-2 border-[#F29F67]/20">
            {user && profile ? (
              <button
                onClick={() => {
                  signOut();
                  closeMenu();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="space-y-2">
                <Link href="/auth/login" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full text-white hover:bg-white/10">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={closeMenu}>
                  <Button className="w-full bg-[#F29F67] hover:bg-[#E08D55] text-[#1E1E2C]">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
