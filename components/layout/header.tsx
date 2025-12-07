'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { User, Settings, LogOut, PenSquare, Search, Code2 } from 'lucide-react';
import { NotificationBell } from './notification-bell';
import { SearchBar } from '@/components/search/search-bar';
import { MobileMenu } from './mobile-menu';
import { useState, useEffect } from 'react';

export function Header() {
  const { user, profile, signOut } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // Always show navbar at top of page
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up - show navbar
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  return (
    <div 
      className={`fixed left-0 right-0 z-50 px-4 sm:px-6 transition-all duration-300 ${
        isVisible ? 'top-3' : '-top-20'
      }`}
    >
      <nav className="max-w-6xl mx-auto bg-[#1E1E2C] rounded-full shadow-2xl border-2 border-[#F29F67]/20">
        <div className="px-5 sm:px-6 py-2.5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-6 md:gap-10">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="p-1.5 rounded-lg bg-[#F29F67]/20 group-hover:bg-[#F29F67]/30 transition-all">
                  <Code2 className="w-4 h-4 text-[#F29F67]" />
                </div>
                <span className="text-white text-base font-bold hidden sm:block">
                  Syntactic
                </span>
              </Link>

              {/* Menu Items */}
              <div className="hidden lg:flex items-center gap-5 xl:gap-6">
                <Link 
                  href="/blog" 
                  className="text-white/70 text-sm font-medium hover:text-white transition-all relative group"
                >
                  Blog
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F29F67] group-hover:w-full transition-all duration-300" />
                </Link>
                <Link 
                  href="/playground" 
                  className="text-white/70 text-sm font-medium hover:text-white transition-all relative group"
                >
                  Playground
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F29F67] group-hover:w-full transition-all duration-300" />
                </Link>
                <Link 
                  href="/explore" 
                  className="text-white/70 text-sm font-medium hover:text-white transition-all relative group"
                >
                  Explore
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F29F67] group-hover:w-full transition-all duration-300" />
                </Link>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
              {/* Search Bar - Hidden on mobile */}
              <div className="hidden md:block">
                <SearchBar />
              </div>

              {user && profile ? (
                <>
                  {/* Write Button - Hidden on mobile */}
                  <Link href="/editor" className="hidden md:block">
                    <button className="flex items-center gap-2 px-3 py-2 bg-[#F29F67] hover:bg-[#E08D55] rounded-full transition-all group text-[#1E1E2C]">
                      <PenSquare size={14} className="text-[#1E1E2C]" />
                      <span className="text-[#1E1E2C] text-sm font-medium">Write</span>
                    </button>
                  </Link>
                  
                  <div className="hidden md:block">
                    <NotificationBell />
                  </div>

                  {/* User Profile - Hidden on mobile */}
                  <div className="relative group hidden md:block">
                    <button className="relative w-8 h-8 rounded-full overflow-hidden hover:shadow-lg transition-all bg-[#F29F67]">
                      <div className="relative w-full h-full flex items-center justify-center">
                        <span className="text-[#1E1E2C] text-xs font-bold">{profile.username.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/40 rounded-full transition-all" />
                    </button>

                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-48 bg-[#1E1E2C] rounded-xl shadow-2xl border-2 border-[#F29F67]/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                      <div className="p-2 space-y-1">
                        <Link
                          href={`/profile/${profile.username}`}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-[#F29F67]/20 transition-colors text-white"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-[#F29F67]/20 transition-colors text-white"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <hr className="my-1 border-white/10" />
                        <button
                          onClick={() => signOut()}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-500/20 transition-colors w-full text-left text-red-400"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="hidden md:block">
                    <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/10 border border-white/20 px-3 py-1.5 text-xs">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="hidden md:block">
                    <Button size="sm" className="bg-[#F29F67] hover:bg-[#E08D55] text-[#1E1E2C] font-semibold border-0 px-3 py-1.5 text-xs">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}

              {/* Mobile Menu - Visible only on mobile */}
              <MobileMenu />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
